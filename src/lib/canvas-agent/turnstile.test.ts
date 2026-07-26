import assert from "node:assert/strict";
import test from "node:test";
import { isTurnstileConfigured, isTurnstileRequired } from "./turnstile";

test("requires complete Turnstile configuration in production", () => {
  const production = { NODE_ENV: "production" } as NodeJS.ProcessEnv;
  assert.equal(isTurnstileRequired(production), true);
  assert.equal(isTurnstileConfigured(production), false);
  assert.equal(isTurnstileConfigured({
    ...production,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
    TURNSTILE_SECRET_KEY: "secret-key",
  }), true);
});

test("allows an explicit local verification bypass", () => {
  const local = {
    NODE_ENV: "development",
    CANVAS_TURNSTILE_REQUIRED: "false",
  } as NodeJS.ProcessEnv;
  assert.equal(isTurnstileRequired(local), false);
  assert.equal(isTurnstileConfigured(local), true);
});
