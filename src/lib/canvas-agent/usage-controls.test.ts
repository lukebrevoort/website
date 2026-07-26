import assert from "node:assert/strict";
import test from "node:test";
import { acquireUsageLease, getUsagePolicy } from "./usage-controls";

const policy = {
  sessionDaily: 2,
  ipDaily: 3,
  projectDaily: 4,
  cooldownMs: 8_000,
  inFlightMs: 25_000,
  executionMs: 18_000,
};

test("bounds environment overrides before exposing a usage policy", () => {
  const configured = getUsagePolicy({
    NODE_ENV: "test",
    CANVAS_SESSION_DAILY_LIMIT: "9",
    CANVAS_PROJECT_DAILY_LIMIT: "999999",
    CANVAS_EXECUTION_MS: "20000",
  } as NodeJS.ProcessEnv);
  assert.equal(configured.sessionDaily, 9);
  assert.equal(configured.projectDaily, 180);
  assert.equal(configured.executionMs, 20_000);
});

test("allows only one in-flight request and enforces the cooldown", async () => {
  const identity = { day: "test-lock", session: "session-a", ip: "ip-a" };
  const first = await acquireUsageLease(identity, policy, { NODE_ENV: "test" } as NodeJS.ProcessEnv);
  assert.equal(first.ok, true);
  const concurrent = await acquireUsageLease(identity, policy, { NODE_ENV: "test" } as NodeJS.ProcessEnv);
  assert.equal(concurrent.ok, false);
  if (!concurrent.ok) assert.equal(concurrent.code, "in-flight");
  if (first.ok) await first.lease.release();
  const cooldown = await acquireUsageLease(identity, policy, { NODE_ENV: "test" } as NodeJS.ProcessEnv);
  assert.equal(cooldown.ok, false);
  if (!cooldown.ok) assert.equal(cooldown.code, "cooldown");
});

test("fails closed in production without distributed usage storage", async () => {
  const result = await acquireUsageLease(
    { day: "test-production", session: "session-b", ip: "ip-b" },
    policy,
    { NODE_ENV: "production" } as NodeJS.ProcessEnv,
  );
  assert.deepEqual(result, { ok: false, code: "usage-unavailable" });
});
