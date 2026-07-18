import assert from "node:assert/strict";
import test from "node:test";
import { createSafetyIdentifier } from "./security";

test("creates a stable pseudonymous safety identifier from the first forwarded IP", () => {
  const first = createSafetyIdentifier(new Request("https://example.com", {
    headers: { "x-forwarded-for": "203.0.113.8, 10.0.0.1" },
  }), "server-secret");
  const second = createSafetyIdentifier(new Request("https://example.com", {
    headers: { "x-forwarded-for": "203.0.113.8" },
  }), "server-secret");

  assert.equal(first, second);
  assert.match(first, /^canvas_[a-f0-9]{24}$/);
  assert.equal(first.includes("203.0.113.8"), false);
});

test("separates visitors without exposing their address", () => {
  const first = createSafetyIdentifier(new Request("https://example.com", {
    headers: { "x-forwarded-for": "203.0.113.8" },
  }), "server-secret");
  const second = createSafetyIdentifier(new Request("https://example.com", {
    headers: { "x-forwarded-for": "198.51.100.4" },
  }), "server-secret");

  assert.notEqual(first, second);
});
