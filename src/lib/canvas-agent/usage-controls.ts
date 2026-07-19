import { randomUUID } from "node:crypto";

export type UsagePolicy = {
  sessionDaily: number;
  ipDaily: number;
  projectDaily: number;
  cooldownMs: number;
  inFlightMs: number;
  executionMs: number;
};

export type UsageIdentity = {
  day: string;
  session: string;
  ip: string;
};

export type UsageSnapshot = {
  sessionUsed: number;
  ipUsed: number;
  projectUsed: number;
};

export type UsageLeaseResult =
  | { ok: true; lease: UsageLease; usage: UsageSnapshot }
  | {
      ok: false;
      code: "cooldown" | "in-flight" | "session-limit" | "ip-limit" | "project-limit" | "usage-unavailable";
      retryAfterSeconds?: number;
      usage?: UsageSnapshot;
    };

export type UsageLease = {
  release: () => Promise<void>;
};

const DEFAULT_POLICY: UsagePolicy = {
  sessionDaily: 6,
  ipDaily: 18,
  projectDaily: 180,
  cooldownMs: 8_000,
  inFlightMs: 25_000,
  executionMs: 18_000,
};

export function getUsagePolicy(env: NodeJS.ProcessEnv = process.env): UsagePolicy {
  return {
    sessionDaily: boundedInteger(env.CANVAS_SESSION_DAILY_LIMIT, DEFAULT_POLICY.sessionDaily, 1, 50),
    ipDaily: boundedInteger(env.CANVAS_IP_DAILY_LIMIT, DEFAULT_POLICY.ipDaily, 1, 250),
    projectDaily: boundedInteger(env.CANVAS_PROJECT_DAILY_LIMIT, DEFAULT_POLICY.projectDaily, 1, 10_000),
    cooldownMs: boundedInteger(env.CANVAS_COOLDOWN_MS, DEFAULT_POLICY.cooldownMs, 1_000, 60_000),
    inFlightMs: boundedInteger(env.CANVAS_IN_FLIGHT_MS, DEFAULT_POLICY.inFlightMs, 5_000, 60_000),
    executionMs: boundedInteger(env.CANVAS_EXECUTION_MS, DEFAULT_POLICY.executionMs, 5_000, 22_000),
  };
}

export function publicUsagePolicy(policy: UsagePolicy) {
  return {
    sessionDaily: policy.sessionDaily,
    cooldownSeconds: Math.ceil(policy.cooldownMs / 1_000),
    executionSeconds: Math.ceil(policy.executionMs / 1_000),
  };
}

type StoredCounter = { value: number; expiresAt: number };
const memoryCounters = new Map<string, StoredCounter>();
const memoryLocks = new Map<string, { token: string; expiresAt: number }>();

export async function readUsage(
  identity: UsageIdentity,
  env: NodeJS.ProcessEnv = process.env,
): Promise<UsageSnapshot | null> {
  const keys = usageKeys(identity);
  const redis = redisConfiguration(env);
  if (redis) {
    const result = await redisCommand(redis, ["MGET", keys.session, keys.ip, keys.project]);
    if (!Array.isArray(result)) return null;
    return {
      sessionUsed: Number(result[0] || 0),
      ipUsed: Number(result[1] || 0),
      projectUsed: Number(result[2] || 0),
    };
  }
  if (requiresDistributedUsage(env)) return null;
  const now = Date.now();
  return {
    sessionUsed: readMemoryCounter(keys.session, now),
    ipUsed: readMemoryCounter(keys.ip, now),
    projectUsed: readMemoryCounter(keys.project, now),
  };
}

export async function acquireUsageLease(
  identity: UsageIdentity,
  policy: UsagePolicy,
  env: NodeJS.ProcessEnv = process.env,
): Promise<UsageLeaseResult> {
  const redis = redisConfiguration(env);
  if (redis) return acquireRedisLease(redis, identity, policy);
  if (requiresDistributedUsage(env)) return { ok: false, code: "usage-unavailable" };
  return acquireMemoryLease(identity, policy);
}

function acquireMemoryLease(identity: UsageIdentity, policy: UsagePolicy): UsageLeaseResult {
  const now = Date.now();
  const keys = usageKeys(identity);
  pruneMemory(now);
  const existingLock = memoryLocks.get(keys.lock);
  if (existingLock && existingLock.expiresAt > now) return { ok: false, code: "in-flight" };
  const cooldown = memoryCounters.get(keys.cooldown);
  if (cooldown && cooldown.expiresAt > now) {
    return { ok: false, code: "cooldown", retryAfterSeconds: Math.ceil((cooldown.expiresAt - now) / 1_000) };
  }

  const usage = {
    sessionUsed: readMemoryCounter(keys.session, now),
    ipUsed: readMemoryCounter(keys.ip, now),
    projectUsed: readMemoryCounter(keys.project, now),
  };
  if (usage.sessionUsed >= policy.sessionDaily) return { ok: false, code: "session-limit", usage };
  if (usage.ipUsed >= policy.ipDaily) return { ok: false, code: "ip-limit", usage };
  if (usage.projectUsed >= policy.projectDaily) return { ok: false, code: "project-limit", usage };

  const dayExpiry = Date.now() + secondsUntilUtcDayEnds() * 1_000;
  incrementMemoryCounter(keys.session, dayExpiry);
  incrementMemoryCounter(keys.ip, dayExpiry);
  incrementMemoryCounter(keys.project, dayExpiry);
  memoryCounters.set(keys.cooldown, { value: 1, expiresAt: now + policy.cooldownMs });
  const token = randomUUID();
  memoryLocks.set(keys.lock, { token, expiresAt: now + policy.inFlightMs });

  return {
    ok: true,
    usage: {
      sessionUsed: usage.sessionUsed + 1,
      ipUsed: usage.ipUsed + 1,
      projectUsed: usage.projectUsed + 1,
    },
    lease: {
      release: async () => {
        if (memoryLocks.get(keys.lock)?.token === token) memoryLocks.delete(keys.lock);
      },
    },
  };
}

async function acquireRedisLease(
  redis: RedisConfiguration,
  identity: UsageIdentity,
  policy: UsagePolicy,
): Promise<UsageLeaseResult> {
  const keys = usageKeys(identity);
  const token = randomUUID();
  const script = `
local lockTtl = redis.call('PTTL', KEYS[5])
if lockTtl > 0 then return {0, 'in-flight', math.ceil(lockTtl / 1000)} end
local cooldownTtl = redis.call('PTTL', KEYS[4])
if cooldownTtl > 0 then return {0, 'cooldown', math.ceil(cooldownTtl / 1000)} end
local sessionUsed = tonumber(redis.call('GET', KEYS[1]) or '0')
local ipUsed = tonumber(redis.call('GET', KEYS[2]) or '0')
local projectUsed = tonumber(redis.call('GET', KEYS[3]) or '0')
if sessionUsed >= tonumber(ARGV[1]) then return {0, 'session-limit', sessionUsed, ipUsed, projectUsed} end
if ipUsed >= tonumber(ARGV[2]) then return {0, 'ip-limit', sessionUsed, ipUsed, projectUsed} end
if projectUsed >= tonumber(ARGV[3]) then return {0, 'project-limit', sessionUsed, ipUsed, projectUsed} end
sessionUsed = redis.call('INCR', KEYS[1])
ipUsed = redis.call('INCR', KEYS[2])
projectUsed = redis.call('INCR', KEYS[3])
if sessionUsed == 1 then redis.call('EXPIRE', KEYS[1], ARGV[4]) end
if ipUsed == 1 then redis.call('EXPIRE', KEYS[2], ARGV[4]) end
if projectUsed == 1 then redis.call('EXPIRE', KEYS[3], ARGV[4]) end
redis.call('SET', KEYS[4], '1', 'PX', ARGV[5])
redis.call('SET', KEYS[5], ARGV[7], 'PX', ARGV[6])
return {1, 'ok', sessionUsed, ipUsed, projectUsed}`;
  const result = await redisCommand(redis, [
    "EVAL", script, "5", keys.session, keys.ip, keys.project, keys.cooldown, keys.lock,
    String(policy.sessionDaily), String(policy.ipDaily), String(policy.projectDaily),
    String(secondsUntilUtcDayEnds()), String(policy.cooldownMs), String(policy.inFlightMs), token,
  ]);
  if (!Array.isArray(result) || Number(result[0]) !== 1) {
    if (!Array.isArray(result)) return { ok: false, code: "usage-unavailable" };
    const code = String(result[1]) as Exclude<UsageLeaseResult, { ok: true }>['code'];
    return {
      ok: false,
      code,
      ...(code === "cooldown" || code === "in-flight" ? { retryAfterSeconds: Number(result[2]) } : {}),
      ...(["session-limit", "ip-limit", "project-limit"].includes(code) ? {
        usage: { sessionUsed: Number(result[2]), ipUsed: Number(result[3]), projectUsed: Number(result[4]) },
      } : {}),
    };
  }

  return {
    ok: true,
    usage: { sessionUsed: Number(result[2]), ipUsed: Number(result[3]), projectUsed: Number(result[4]) },
    lease: {
      release: async () => {
        const releaseScript = "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end";
        await redisCommand(redis, ["EVAL", releaseScript, "1", keys.lock, token]);
      },
    },
  };
}

type RedisConfiguration = { url: string; token: string };

function redisConfiguration(env: NodeJS.ProcessEnv): RedisConfiguration | null {
  const url = env.KV_REST_API_URL?.trim() || env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.KV_REST_API_TOKEN?.trim() || env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisCommand(redis: RedisConfiguration, command: string[]): Promise<unknown> {
  try {
    const response = await fetch(redis.url, {
      method: "POST",
      headers: { authorization: `Bearer ${redis.token}`, "content-type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
      signal: AbortSignal.timeout(2_500),
    });
    if (!response.ok) return null;
    const body = await response.json() as { result?: unknown };
    return body.result ?? null;
  } catch {
    return null;
  }
}

function usageKeys(identity: UsageIdentity) {
  const prefix = `canvas-usage:${identity.day}`;
  return {
    session: `${prefix}:session:${identity.session}`,
    ip: `${prefix}:ip:${identity.ip}`,
    project: `${prefix}:project`,
    cooldown: `${prefix}:cooldown:${identity.session}`,
    lock: `${prefix}:lock:${identity.session}`,
  };
}

function requiresDistributedUsage(env: NodeJS.ProcessEnv) {
  return env.CANVAS_USAGE_STORAGE_REQUIRED === "true" ||
    (env.CANVAS_USAGE_STORAGE_REQUIRED !== "false" && env.NODE_ENV === "production");
}

function boundedInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function secondsUntilUtcDayEnds(now = new Date()) {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(60, Math.ceil((end - now.getTime()) / 1_000));
}

function readMemoryCounter(key: string, now: number) {
  const counter = memoryCounters.get(key);
  return counter && counter.expiresAt > now ? counter.value : 0;
}

function incrementMemoryCounter(key: string, expiresAt: number) {
  const current = readMemoryCounter(key, Date.now());
  memoryCounters.set(key, { value: current + 1, expiresAt });
}

function pruneMemory(now: number) {
  for (const [key, value] of memoryCounters) if (value.expiresAt <= now) memoryCounters.delete(key);
  for (const [key, value] of memoryLocks) if (value.expiresAt <= now) memoryLocks.delete(key);
}
