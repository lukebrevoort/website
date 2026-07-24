import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  MAX_CANVAS_IMAGE_BYTES,
  MAX_CANVAS_REQUEST_BYTES,
  MAX_CONTEXT_ELEMENTS,
  canvasAgentRequestSchema,
} from "@/lib/canvas-agent/request";
import { MAX_PATCH_OPERATIONS } from "@/lib/canvas-agent/contract";
import { selectKnowledgeSnippets } from "@/lib/canvas-agent/knowledge";
import {
  ProviderUnavailableError,
  createCanvasVisionProvider,
} from "@/lib/canvas-agent/providers";
import { CanvasPatchGenerationError } from "@/lib/canvas-agent/providers/types";
import { SimpleOpsConversionError } from "@/lib/canvas-agent/providers/simple-ops";
import { getOpenAIApiKey } from "@/lib/canvas-agent/providers/config";
import { validateCanvasPatch } from "@/lib/canvas-agent";
import { reviewCanvasPatchComposition } from "@/lib/canvas-agent/composition";
import {
  createDailySafetyIdentifiers,
  getCanvasSession,
  type CanvasSession,
} from "@/lib/canvas-agent/security";
import {
  acquireUsageLease,
  getUsagePolicy,
  publicUsagePolicy,
  readUsage,
  type UsageIdentity,
} from "@/lib/canvas-agent/usage-controls";
import {
  isTurnstileConfigured,
  isTurnstileRequired,
  verifyTurnstileToken,
} from "@/lib/canvas-agent/turnstile";
import { isMatchingStarterPrompt } from "@/lib/canvas-agent/starter-prompts";
import { createAuthoredStarterPatch } from "@/lib/canvas-agent/fallbacks";

export const runtime = "nodejs";
export const maxDuration = 25;

const NO_STORE_HEADERS = { "cache-control": "private, no-store" };

export async function GET(request: Request) {
  const session = getCanvasSession(request);
  const policy = getUsagePolicy();
  const identity = usageIdentity(request, session.id);
  const usage = identity ? await readUsage(identity) : null;

  return jsonResponse({
    ok: true,
    live: {
      available: providerConfigured() && Boolean(identity) && usage !== null && isTurnstileConfigured(),
      verificationRequired: isTurnstileRequired(),
      turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null,
    },
    limits: {
      ...publicUsagePolicy(policy),
      promptCharacters: 400,
      imageBytes: MAX_CANVAS_IMAGE_BYTES,
      contextElements: MAX_CONTEXT_ELEMENTS,
      operations: MAX_PATCH_OPERATIONS,
    },
    usage: usage ? { sessionUsed: usage.sessionUsed } : null,
  }, 200, session);
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = randomUUID();
  const session = getCanvasSession(request);

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return restingResponse("The canvas request must be sent as JSON.", 415, "invalid-request", session);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_CANVAS_REQUEST_BYTES) {
    return restingResponse("That canvas view is too large to inspect safely. Select fewer marks and try again.", 413, "invalid-request", session);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_CANVAS_REQUEST_BYTES) {
      return restingResponse("That canvas view is too large to inspect safely. Select fewer marks and try again.", 413, "invalid-request", session);
    }
    body = JSON.parse(rawBody);
  } catch {
    return restingResponse("The canvas request could not be read. Your board was not changed.", 400, "invalid-request", session);
  }

  const parsed = canvasAgentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({
      ok: false,
      code: "invalid-request",
      message: "That canvas context was incomplete or too large. Your board was not changed.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    }, 400, session);
  }

  if (parsed.data.starterId && isMatchingStarterPrompt(parsed.data.starterId, parsed.data.prompt)) {
    const patch = createAuthoredStarterPatch(parsed.data.starterId, parsed.data.context);
    const validation = validateCanvasPatch(patch, parsed.data.context);
    if (!validation.ok) {
      logCanvasEvent("authored-invalid", { requestId, durationMs: Date.now() - startedAt });
      return restingResponse("That authored sketch is resting. Your board was not changed.", 503, "fallback-unavailable", session);
    }
    logCanvasEvent("authored-complete", { requestId, durationMs: Date.now() - startedAt });
    return jsonResponse({
      ok: true,
      patch: validation.value.patch,
      risk: validation.value.risk,
      provider: "authored",
      model: "cached-starter-v1",
      scope: parsed.data.scope,
      usage: { counted: false },
    }, 200, session);
  }

  if (parsed.data.starterId) {
    return restingResponse("That starter prompt did not match its authored sketch. Your board was not changed.", 400, "invalid-request", session);
  }

  const identity = usageIdentity(request, session.id);
  if (!identity || !providerConfigured()) {
    return restingResponse(
      "Live sketching is resting, but the authored starting points still work and your board is safe.",
      503,
      "live-unavailable",
      session,
    );
  }

  const verification = await verifyTurnstileToken(parsed.data.turnstileToken);
  if (!verification.ok) {
    const unavailable = verification.reason === "unconfigured" || verification.reason === "unavailable";
    return restingResponse(
      unavailable
        ? "Live verification is resting. Try an authored starting point—your board is unchanged."
        : "Please complete the quick human check before asking the live canvas.",
      unavailable ? 503 : 403,
      unavailable ? "verification-unavailable" : "verification-required",
      session,
    );
  }

  const policy = getUsagePolicy();
  const leaseResult = await acquireUsageLease(identity, policy);
  if (!leaseResult.ok) {
    const response = usageLimitResponse(leaseResult.code, leaseResult.retryAfterSeconds, session);
    logCanvasEvent("usage-rejected", { requestId, code: leaseResult.code, durationMs: Date.now() - startedAt });
    return response;
  }

  try {
    const result = await createCanvasVisionProvider().generatePatch({
      ...parsed.data,
      knowledgeSnippets: selectKnowledgeSnippets(parsed.data.prompt),
      safetyIdentifier: identity.ip.slice(0, 32),
      executionMs: policy.executionMs,
    });
    const validation = validateCanvasPatch(result.patch, parsed.data.context);
    if (!validation.ok) {
      return jsonResponse({
        ok: false,
        code: "invalid-patch",
        message: "The agent returned an unsafe canvas change, so nothing was applied.",
        issues: validation.issues,
      }, 422, session);
    }
    const composition = reviewCanvasPatchComposition(
      validation.value.patch,
      parsed.data.prompt,
      parsed.data.context,
    );
    // Soft quality: return a usable patch with issues so the visitor can Apply
    // anyway (and undo). Hard-reject only unsafe/invalid patches above.
    const quality = composition.ok
      ? { ok: true as const, issues: [] as string[] }
      : { ok: false as const, issues: composition.issues };

    logCanvasEvent(quality.ok ? "live-complete" : "live-quality-warn", {
      requestId,
      provider: result.provider,
      durationMs: Date.now() - startedAt,
      operationCount: validation.value.patch.operations.length,
      ...(quality.ok ? {} : { issueCount: quality.issues.length }),
    });
    return jsonResponse({
      ok: true,
      patch: validation.value.patch,
      risk: validation.value.risk,
      quality,
      provider: result.provider,
      model: result.model,
      scope: parsed.data.scope,
      usage: {
        counted: true,
        sessionUsed: leaseResult.usage.sessionUsed,
        sessionLimit: policy.sessionDaily,
      },
    }, 200, session);
  } catch (error) {
    if (error instanceof ProviderUnavailableError) {
      return restingResponse("The configured vision provider is unavailable. Your board was not changed.", 503, "live-unavailable", session);
    }
    if (isQuotaError(error)) {
      return restingResponse(
        "Today's live model allowance is exhausted. Authored starting points still work, and your board is untouched.",
        503,
        "provider-quota",
        session,
      );
    }
    if (
      error instanceof CanvasPatchGenerationError ||
      error instanceof SimpleOpsConversionError ||
      isStructuredOutputError(error)
    ) {
      logCanvasEvent("live-invalid-output", {
        requestId,
        durationMs: Date.now() - startedAt,
        errorType: error instanceof Error ? error.name : "unknown",
      });
      return jsonResponse({
        ok: false,
        code: "invalid-patch",
        message: "The agent sketched something we could not safely read, so nothing was applied. Try that thought once more.",
        issues: [error instanceof Error ? error.message : "invalid structured output"],
      }, 422, session);
    }
    const timedOut = isTimeoutError(error);
    logCanvasEvent(timedOut ? "live-timeout" : "live-failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      errorType: error instanceof Error ? error.name : "unknown",
      errorMessage: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return restingResponse(
      timedOut
        ? "The live sketch took too long, so it was stopped. Your board is untouched—try again in a moment."
        : "The live sketch hiccuped before it could finish. Your board is untouched—please try that thought again.",
      timedOut ? 504 : 502,
      timedOut ? "execution-timeout" : "agent-resting",
      session,
    );
  } finally {
    await leaseResult.lease.release();
  }
}

function usageIdentity(request: Request, sessionId: string): UsageIdentity | null {
  const secret = process.env.CANVAS_USAGE_HMAC_SECRET?.trim() ||
    (process.env.NODE_ENV === "production" ? "" : "local-canvas-development-only");
  if (!secret) return null;
  const identifiers = createDailySafetyIdentifiers(request, sessionId, secret);
  return { day: identifiers.day, session: identifiers.session, ip: identifiers.ip };
}

function providerConfigured() {
  const provider = process.env.CANVAS_VISION_PROVIDER || "openai";
  return provider === "openai" && Boolean(getOpenAIApiKey());
}

function usageLimitResponse(
  code: Exclude<Awaited<ReturnType<typeof acquireUsageLease>>, { ok: true }>["code"],
  retryAfterSeconds: number | undefined,
  session: CanvasSession,
) {
  const messages = {
    cooldown: "Give the canvas a few seconds before adding another live thought.",
    "in-flight": "This board already has a live sketch in progress. Let it finish before sending another.",
    "session-limit": "This board has used today's live sketch allowance. Authored starting points still work.",
    "ip-limit": "This connection has used today's live sketch allowance. Authored starting points still work.",
    "project-limit": "The site's live sketch allowance is finished for today. Authored starting points still work.",
    "usage-unavailable": "Live usage controls are resting, so inference was safely stopped. Authored starting points still work.",
  } as const;
  return restingResponse(
    messages[code],
    code === "cooldown" || code === "in-flight" ? 429 : 503,
    code,
    session,
    retryAfterSeconds ? { "retry-after": String(retryAfterSeconds) } : undefined,
  );
}

function restingResponse(
  message: string,
  status: number,
  code: string,
  session: CanvasSession,
  headers?: Record<string, string>,
) {
  return jsonResponse({ ok: false, code, message }, status, session, headers);
}

function jsonResponse(
  body: unknown,
  status: number,
  session: CanvasSession,
  headers: Record<string, string> = {},
) {
  const response = NextResponse.json(body, { status, headers: { ...NO_STORE_HEADERS, ...headers } });
  if (session.cookie) response.headers.append("set-cookie", session.cookie);
  return response;
}

function isQuotaError(error: unknown) {
  const candidate = error as { statusCode?: number; status?: number; message?: string };
  return candidate?.statusCode === 429 || candidate?.status === 429 ||
    /quota|resource.?exhausted|rate.?limit/i.test(candidate?.message || "");
}

function isTimeoutError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const haystack = `${error.name} ${error.message}`;
  return /timeout|abort|etimedout|deadline/i.test(haystack);
}

function isStructuredOutputError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return /structured output|no object generated|did not match schema|invalid.*schema|ai_noobjectgeneratederror/i
    .test(`${error.name} ${error.message}`);
}

function logCanvasEvent(event: string, details: Record<string, string | number>) {
  console.info(JSON.stringify({ area: "canvas-agent", event, ...details }));
}
