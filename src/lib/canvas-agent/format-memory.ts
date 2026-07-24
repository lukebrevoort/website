import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import type { CanvasElementSpec, CanvasPatch } from "./contract";
import { matchKnowledgeProjectIds } from "./knowledge";

/** Max formats retained per fingerprint rollup. */
export const MAX_FORMATS_PER_FINGERPRINT = 12;
/** How many approved formats to inject into the director. */
export const MAX_APPROVED_FORMATS_FOR_CONTEXT = 2;
/** Soft TTL so old recipes age out of Redis. */
const FORMAT_TTL_SECONDS = 60 * 60 * 24 * 90;
const FEEDBACK_SESSION_DAILY = 24;
const FEEDBACK_IP_DAILY = 72;

const INTENT_GROUPS: ReadonlyArray<{ id: string; terms: readonly string[] }> = [
  { id: "compare", terms: ["compare", "vs", "versus", "differ", "difference", "between", "unlike"] },
  { id: "architecture", terms: ["architecture", "pipeline", "components", "system", "stack", "layers"] },
  { id: "how", terms: ["how", "works", "work", "flow", "process"] },
  { id: "overview", terms: ["what", "overview", "explain", "about", "summary"] },
  { id: "connect", terms: ["connect", "thread", "relate", "relationship", "together"] },
];

export const formatRecipeSchema = z.strictObject({
  version: z.literal(1),
  summary: z.string().trim().min(1).max(300),
  nodeCount: z.number().int().min(0).max(32),
  edgeCount: z.number().int().min(0).max(32),
  shapes: z.array(z.enum(["rect", "ellipse", "note", "text", "other"])).max(32),
  themes: z.array(z.enum(["ink", "muted", "accent", "info", "success", "warning"])).max(16),
  /** Compact layout skeleton — labels truncated; treat as structure only. */
  skeleton: z.array(z.strictObject({
    op: z.enum(["add", "connect"]),
    type: z.enum(["rect", "ellipse", "note", "text", "arrow"]).nullable(),
    theme: z.enum(["ink", "muted", "accent", "info", "success", "warning"]).nullable(),
    /** Coarse 0–4 grid cell for placement priors. */
    gx: z.number().int().min(0).max(4).nullable(),
    gy: z.number().int().min(0).max(4).nullable(),
    role: z.string().trim().max(48).nullable(),
  })).min(1).max(24),
});

export type FormatRecipe = z.infer<typeof formatRecipeSchema>;

export const formatFeedbackRequestSchema = z.strictObject({
  prompt: z.string().trim().min(1).max(400),
  summary: z.string().trim().min(1).max(300),
  vote: z.enum(["up", "down"]),
  note: z.string().trim().max(200).optional(),
  recipe: formatRecipeSchema.optional(),
  /** Client may send ops-derived recipe or a patch we compact server-side. */
  patch: z.unknown().optional(),
});

export type FormatFeedbackRequest = z.infer<typeof formatFeedbackRequestSchema>;

export type ApprovedFormatPrior = {
  fingerprint: string;
  summary: string;
  recipe: FormatRecipe;
  netScore: number;
  updatedAt: number;
};

type StoredFormatEntry = {
  id: string;
  fingerprint: string;
  summary: string;
  recipe: FormatRecipe;
  ups: number;
  downs: number;
  netScore: number;
  createdAt: number;
  updatedAt: number;
  lastNote?: string;
};

type FormatRollup = {
  fingerprint: string;
  entries: StoredFormatEntry[];
};

type RedisConfiguration = { url: string; token: string };

const memoryRollups = new Map<string, FormatRollup>();
const memoryFeedbackCounters = new Map<string, { value: number; expiresAt: number }>();

export type PromptFingerprint = {
  key: string;
  projects: string[];
  intents: string[];
};

export function fingerprintPrompt(prompt: string): PromptFingerprint {
  const projects = matchKnowledgeProjectIds(prompt);
  const intents = detectIntents(prompt);
  const normalizedProjects = projects.length > 0 ? [...projects].sort() : ["general"];
  // One primary intent keeps near-paraphrases (compare vs how…differ) on the same key.
  const primaryIntent = intents[0] ?? "open";
  const material = `v1|projects:${normalizedProjects.join("+")}|intent:${primaryIntent}`;
  return {
    key: createHash("sha256").update(material).digest("hex").slice(0, 24),
    projects: normalizedProjects,
    intents: [primaryIntent],
  };
}

export function buildFormatRecipeFromPatch(patch: CanvasPatch, summary = patch.summary): FormatRecipe | null {
  const skeleton: FormatRecipe["skeleton"] = [];
  const shapes: FormatRecipe["shapes"] = [];
  const themes = new Set<FormatRecipe["themes"][number]>();
  let nodeCount = 0;
  let edgeCount = 0;

  for (const operation of patch.operations) {
    if (operation.op === "create") {
      nodeCount += 1;
      const kind = operation.element.kind;
      const shape =
        kind === "rectangle" ? "rect" as const
          : kind === "ellipse" || kind === "note" || kind === "text" ? kind
            : "other" as const;
      shapes.push(shape);
      const theme = toRecipeTheme(operation.element.style?.theme);
      if (theme) themes.add(theme);
      const box = "box" in operation.element ? operation.element.box : null;
      skeleton.push({
        op: "add",
        type: shape === "other" ? "rect" : shape,
        theme,
        gx: box ? Math.min(4, Math.max(0, Math.floor(box.x / 200))) : null,
        gy: box ? Math.min(4, Math.max(0, Math.floor(box.y / 200))) : null,
        role: truncateRole(elementRoleText(operation.element)),
      });
      continue;
    }
    if (operation.op === "connect") {
      edgeCount += 1;
      const theme = toRecipeTheme(operation.style?.theme);
      if (theme) themes.add(theme);
      skeleton.push({
        op: "connect",
        type: "arrow",
        theme,
        gx: null,
        gy: null,
        role: truncateRole(operation.label),
      });
    }
  }

  if (skeleton.length === 0) return null;
  return formatRecipeSchema.parse({
    version: 1,
    summary: summary.trim().slice(0, 300),
    nodeCount,
    edgeCount,
    shapes: shapes.slice(0, 32),
    themes: [...themes].slice(0, 16),
    skeleton: skeleton.slice(0, 24),
  });
}

export async function recordFormatFeedback(
  input: {
    prompt: string;
    summary: string;
    vote: "up" | "down";
    recipe: FormatRecipe;
    note?: string;
  },
  env: NodeJS.ProcessEnv = process.env,
): Promise<{ fingerprint: string; netScore: number; stored: boolean }> {
  const fingerprint = fingerprintPrompt(input.prompt);
  const now = Date.now();
  const rollup = await readRollup(fingerprint.key, env);
  const recipeKey = recipeSignature(input.recipe);
  let entry = rollup.entries.find((candidate) => recipeSignature(candidate.recipe) === recipeKey);

  if (!entry) {
    entry = {
      id: randomUUID(),
      fingerprint: fingerprint.key,
      summary: input.summary.slice(0, 300),
      recipe: input.recipe,
      ups: 0,
      downs: 0,
      netScore: 0,
      createdAt: now,
      updatedAt: now,
    };
    rollup.entries.push(entry);
  }

  if (input.vote === "up") entry.ups += 1;
  else entry.downs += 1;
  entry.netScore = entry.ups - entry.downs;
  entry.updatedAt = now;
  entry.summary = input.summary.slice(0, 300);
  entry.recipe = input.recipe;
  if (input.note) entry.lastNote = input.note.slice(0, 200);

  rollup.entries = pruneAndRank(rollup.entries).slice(0, MAX_FORMATS_PER_FINGERPRINT);
  await writeRollup(rollup, env);

  const stored = rollup.entries.some((candidate) => candidate.id === entry!.id);
  return { fingerprint: fingerprint.key, netScore: entry.netScore, stored };
}

export async function retrieveApprovedFormats(
  prompt: string,
  limit = MAX_APPROVED_FORMATS_FOR_CONTEXT,
  env: NodeJS.ProcessEnv = process.env,
): Promise<ApprovedFormatPrior[]> {
  const fingerprint = fingerprintPrompt(prompt);
  const rollup = await readRollup(fingerprint.key, env);
  return pruneAndRank(rollup.entries)
    .filter((entry) => entry.netScore > 0 && entry.ups > 0)
    .slice(0, Math.max(1, Math.min(limit, MAX_APPROVED_FORMATS_FOR_CONTEXT)))
    .map((entry) => ({
      fingerprint: entry.fingerprint,
      summary: entry.summary,
      recipe: entry.recipe,
      netScore: entry.netScore,
      updatedAt: entry.updatedAt,
    }));
}

/** Peek rollup state for a prompt — useful for local play / confirmation. */
export async function inspectFormatMemory(
  prompt: string,
  env: NodeJS.ProcessEnv = process.env,
) {
  const fingerprint = fingerprintPrompt(prompt);
  const rollup = await readRollup(fingerprint.key, env);
  const ranked = pruneAndRank(rollup.entries);
  const approved = ranked.filter((entry) => entry.netScore > 0 && entry.ups > 0);
  return {
    fingerprint: fingerprint.key,
    projects: fingerprint.projects,
    intents: fingerprint.intents,
    backend: redisConfiguration(env) ? "redis" : "memory",
    entryCount: ranked.length,
    approvedCount: approved.length,
    entries: ranked.map((entry) => ({
      id: entry.id,
      summary: entry.summary,
      ups: entry.ups,
      downs: entry.downs,
      netScore: entry.netScore,
      updatedAt: entry.updatedAt,
      recipe: entry.recipe,
      eligible: entry.netScore > 0 && entry.ups > 0,
    })),
  };
}

export async function allowFormatFeedback(
  identity: { day: string; session: string; ip: string },
  env: NodeJS.ProcessEnv = process.env,
): Promise<{ ok: true } | { ok: false; code: "session-limit" | "ip-limit" | "storage-unavailable" }> {
  const keys = {
    session: `canvas-format-feedback:${identity.day}:session:${identity.session}`,
    ip: `canvas-format-feedback:${identity.day}:ip:${identity.ip}`,
  };
  const redis = redisConfiguration(env);
  if (redis) {
    const result = await redisCommand(redis, ["MGET", keys.session, keys.ip]);
    if (!Array.isArray(result)) return { ok: false, code: "storage-unavailable" };
    const sessionUsed = Number(result[0] || 0);
    const ipUsed = Number(result[1] || 0);
    if (sessionUsed >= FEEDBACK_SESSION_DAILY) return { ok: false, code: "session-limit" };
    if (ipUsed >= FEEDBACK_IP_DAILY) return { ok: false, code: "ip-limit" };
    const ttl = secondsUntilUtcDayEnds();
    await redisCommand(redis, ["INCR", keys.session]);
    await redisCommand(redis, ["EXPIRE", keys.session, String(ttl)]);
    await redisCommand(redis, ["INCR", keys.ip]);
    await redisCommand(redis, ["EXPIRE", keys.ip, String(ttl)]);
    return { ok: true };
  }
  if (requiresDistributedStorage(env)) return { ok: false, code: "storage-unavailable" };
  const now = Date.now();
  pruneFeedbackMemory(now);
  const sessionUsed = readMemoryCounter(keys.session, now);
  const ipUsed = readMemoryCounter(keys.ip, now);
  if (sessionUsed >= FEEDBACK_SESSION_DAILY) return { ok: false, code: "session-limit" };
  if (ipUsed >= FEEDBACK_IP_DAILY) return { ok: false, code: "ip-limit" };
  const expiresAt = now + secondsUntilUtcDayEnds() * 1_000;
  incrementMemoryCounter(keys.session, expiresAt);
  incrementMemoryCounter(keys.ip, expiresAt);
  return { ok: true };
}

/** Test helper: clear in-memory stores between cases. */
export function resetFormatMemoryForTests() {
  memoryRollups.clear();
  memoryFeedbackCounters.clear();
}

function detectIntents(prompt: string) {
  const normalized = normalize(prompt);
  const terms = new Set(tokenize(normalized));
  const matched: string[] = [];
  for (const group of INTENT_GROUPS) {
    if (group.terms.some((term) => term.includes(" ") ? normalized.includes(term) : terms.has(term))) {
      matched.push(group.id);
    }
  }
  return matched.slice(0, 3);
}

function pruneAndRank(entries: StoredFormatEntry[]) {
  return [...entries].sort((left, right) => {
    const leftScore = rankScore(left);
    const rightScore = rankScore(right);
    return rightScore - leftScore || right.updatedAt - left.updatedAt;
  });
}

function rankScore(entry: StoredFormatEntry) {
  const ageHours = Math.max(0, (Date.now() - entry.updatedAt) / 3_600_000);
  const recencyBoost = Math.max(0, 8 - ageHours / 24);
  return entry.netScore * 10 + entry.ups * 2 - entry.downs + recencyBoost;
}

function recipeSignature(recipe: FormatRecipe) {
  return createHash("sha256")
    .update(JSON.stringify({
      nodeCount: recipe.nodeCount,
      edgeCount: recipe.edgeCount,
      shapes: recipe.shapes,
      themes: recipe.themes,
      skeleton: recipe.skeleton.map((item) => ({
        op: item.op,
        type: item.type,
        theme: item.theme,
        gx: item.gx,
        gy: item.gy,
      })),
    }))
    .digest("hex")
    .slice(0, 24);
}

async function readRollup(fingerprint: string, env: NodeJS.ProcessEnv): Promise<FormatRollup> {
  const key = rollupKey(fingerprint);
  const redis = redisConfiguration(env);
  if (redis) {
    const raw = await redisCommand(redis, ["GET", key]);
    if (typeof raw === "string" && raw.length > 0) {
      try {
        const parsed = JSON.parse(raw) as FormatRollup;
        if (parsed && Array.isArray(parsed.entries)) {
          return { fingerprint, entries: parsed.entries };
        }
      } catch {
        // fall through to empty
      }
    }
    return { fingerprint, entries: [] };
  }
  if (requiresDistributedStorage(env)) return { fingerprint, entries: [] };
  return memoryRollups.get(key) ?? { fingerprint, entries: [] };
}

async function writeRollup(rollup: FormatRollup, env: NodeJS.ProcessEnv) {
  const key = rollupKey(rollup.fingerprint);
  const payload = JSON.stringify(rollup);
  const redis = redisConfiguration(env);
  if (redis) {
    await redisCommand(redis, ["SET", key, payload, "EX", String(FORMAT_TTL_SECONDS)]);
    return;
  }
  if (requiresDistributedStorage(env)) return;
  memoryRollups.set(key, rollup);
}

function rollupKey(fingerprint: string) {
  return `canvas-format-memory:v1:${fingerprint}`;
}

const RECIPE_THEMES = ["ink", "muted", "accent", "info", "success", "warning"] as const;
type RecipeTheme = (typeof RECIPE_THEMES)[number];

function toRecipeTheme(theme: string | undefined | null): RecipeTheme | null {
  if (!theme) return null;
  if ((RECIPE_THEMES as readonly string[]).includes(theme)) return theme as RecipeTheme;
  if (theme === "danger") return "warning";
  return null;
}

function elementRoleText(element: CanvasElementSpec) {
  if ("text" in element && typeof element.text === "string") return element.text;
  if ("label" in element && typeof element.label === "string") return element.label;
  return undefined;
}

function truncateRole(value: string | undefined) {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, 48);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string) {
  return value.match(/[a-z0-9]+/g) ?? [];
}

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

function requiresDistributedStorage(env: NodeJS.ProcessEnv) {
  return env.CANVAS_USAGE_STORAGE_REQUIRED === "true" ||
    (env.CANVAS_USAGE_STORAGE_REQUIRED !== "false" && env.NODE_ENV === "production");
}

function secondsUntilUtcDayEnds(now = new Date()) {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(60, Math.ceil((end - now.getTime()) / 1_000));
}

function readMemoryCounter(key: string, now: number) {
  const counter = memoryFeedbackCounters.get(key);
  return counter && counter.expiresAt > now ? counter.value : 0;
}

function incrementMemoryCounter(key: string, expiresAt: number) {
  const current = readMemoryCounter(key, Date.now());
  memoryFeedbackCounters.set(key, { value: current + 1, expiresAt });
}

function pruneFeedbackMemory(now: number) {
  for (const [key, value] of memoryFeedbackCounters) {
    if (value.expiresAt <= now) memoryFeedbackCounters.delete(key);
  }
}
