import { createHmac, randomBytes } from "node:crypto";

export const CANVAS_SESSION_COOKIE = "luke_canvas_session";
export const CANVAS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{32,96}$/;

export type CanvasSession = {
  id: string;
  isNew: boolean;
  cookie: string | null;
};

export function getCanvasSession(request: Request): CanvasSession {
  const existing = readCookie(request.headers.get("cookie"), CANVAS_SESSION_COOKIE);
  if (existing && SESSION_ID_PATTERN.test(existing)) {
    return { id: existing, isNew: false, cookie: null };
  }

  const id = randomBytes(24).toString("base64url");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return {
    id,
    isNew: true,
    cookie: `${CANVAS_SESSION_COOKIE}=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CANVAS_SESSION_MAX_AGE_SECONDS}${secure}`,
  };
}

export function createDailySafetyIdentifiers(
  request: Request,
  sessionId: string,
  secret: string,
  now = new Date(),
) {
  const day = now.toISOString().slice(0, 10);
  const clientIp = getClientIp(request);
  return {
    day,
    session: digestIdentifier(secret, `session:${day}:${sessionId}`),
    ip: digestIdentifier(secret, `ip:${day}:${clientIp}`),
    provider: `canvas_${digestIdentifier(secret, `provider:${day}:${clientIp}`).slice(0, 24)}`,
  };
}

/** Kept as a small compatibility wrapper for provider safety identifiers. */
export function createSafetyIdentifier(request: Request, secret: string) {
  return createDailySafetyIdentifiers(request, "provider", secret).provider;
}

function digestIdentifier(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function getClientIp(request: Request) {
  const trusted = request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  return trusted?.trim() || "unknown";
}

function readCookie(header: string | null, name: string) {
  if (!header) return null;
  for (const pair of header.split(";")) {
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    if (pair.slice(0, separator).trim() === name) {
      return decodeURIComponent(pair.slice(separator + 1).trim());
    }
  }
  return null;
}
