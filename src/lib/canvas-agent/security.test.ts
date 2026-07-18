import assert from "node:assert/strict";
import test from "node:test";
import {
  CANVAS_SESSION_COOKIE,
  createDailySafetyIdentifiers,
  createSafetyIdentifier,
  getCanvasSession,
} from "./security";

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

test("mints an opaque, HttpOnly browser session and reuses its cookie", () => {
  const first = getCanvasSession(new Request("https://example.com"));
  assert.equal(first.isNew, true);
  assert.match(first.cookie || "", /HttpOnly; SameSite=Lax/);
  assert.equal(first.id.includes("."), false);

  const second = getCanvasSession(new Request("https://example.com", {
    headers: { cookie: `${CANVAS_SESSION_COOKIE}=${first.id}` },
  }));
  assert.equal(second.id, first.id);
  assert.equal(second.cookie, null);
});

test("rotates IP and session identifiers each UTC day", () => {
  const request = new Request("https://example.com", {
    headers: { "x-forwarded-for": "203.0.113.8" },
  });
  const first = createDailySafetyIdentifiers(request, "session-id", "secret", new Date("2026-07-18T12:00:00Z"));
  const next = createDailySafetyIdentifiers(request, "session-id", "secret", new Date("2026-07-19T12:00:00Z"));
  assert.notEqual(first.ip, next.ip);
  assert.notEqual(first.session, next.session);
  assert.equal(first.ip.includes("203.0.113.8"), false);
});
