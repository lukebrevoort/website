export type TurnstileResult = { ok: true } | { ok: false; reason: "missing" | "unconfigured" | "rejected" | "unavailable" };

export function isTurnstileRequired(env: NodeJS.ProcessEnv = process.env) {
  return env.CANVAS_TURNSTILE_REQUIRED === "true" ||
    (env.CANVAS_TURNSTILE_REQUIRED !== "false" && env.NODE_ENV === "production");
}

export function isTurnstileConfigured(env: NodeJS.ProcessEnv = process.env) {
  return !isTurnstileRequired(env) || Boolean(
    env.TURNSTILE_SECRET_KEY?.trim() && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

export async function verifyTurnstileToken(
  token: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
): Promise<TurnstileResult> {
  if (!isTurnstileRequired(env)) return { ok: true };
  if (!token || token.length > 2_048) return { ok: false, reason: "missing" };
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: false, reason: "unconfigured" };

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });
    if (!response.ok) return { ok: false, reason: "unavailable" };
    const result = await response.json() as { success?: boolean; hostname?: string };
    if (!result.success) return { ok: false, reason: "rejected" };
    const expectedHostname = env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
    if (expectedHostname && result.hostname !== expectedHostname) return { ok: false, reason: "rejected" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
