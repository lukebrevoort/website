import { NextResponse } from "next/server";
import { canvasPatchSchema } from "@/lib/canvas-agent/contract";
import {
  allowFormatFeedback,
  buildFormatRecipeFromPatch,
  formatFeedbackRequestSchema,
  formatRecipeSchema,
  recordFormatFeedback,
} from "@/lib/canvas-agent/format-memory";
import {
  createDailySafetyIdentifiers,
  getCanvasSession,
  type CanvasSession,
} from "@/lib/canvas-agent/security";

export const runtime = "nodejs";
export const maxDuration = 10;

const NO_STORE_HEADERS = { "cache-control": "private, no-store" };

export async function POST(request: Request) {
  const session = getCanvasSession(request);

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, code: "invalid-request", message: "Feedback must be JSON." }, 415, session);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, code: "invalid-request", message: "Feedback could not be read." }, 400, session);
  }

  const parsed = formatFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({
      ok: false,
      code: "invalid-request",
      message: "That feedback payload was incomplete.",
    }, 400, session);
  }

  const identity = feedbackIdentity(request, session.id);
  if (!identity) {
    return jsonResponse({
      ok: false,
      code: "feedback-unavailable",
      message: "Sketch feedback is resting right now.",
    }, 503, session);
  }

  const allowance = await allowFormatFeedback(identity);
  if (!allowance.ok) {
    return jsonResponse({
      ok: false,
      code: allowance.code,
      message: allowance.code === "storage-unavailable"
        ? "Sketch feedback storage is resting."
        : "This board has shared enough format feedback for today.",
    }, allowance.code === "storage-unavailable" ? 503 : 429, session);
  }

  let recipe = parsed.data.recipe ?? null;
  if (!recipe && parsed.data.patch !== undefined) {
    const patch = canvasPatchSchema.safeParse(parsed.data.patch);
    if (patch.success) {
      recipe = buildFormatRecipeFromPatch(patch.data, parsed.data.summary);
    }
  }
  if (!recipe) {
    return jsonResponse({
      ok: false,
      code: "invalid-request",
      message: "A compact format recipe is required to store feedback.",
    }, 400, session);
  }

  const validatedRecipe = formatRecipeSchema.safeParse(recipe);
  if (!validatedRecipe.success) {
    return jsonResponse({
      ok: false,
      code: "invalid-request",
      message: "That format recipe could not be validated.",
    }, 400, session);
  }

  const result = await recordFormatFeedback({
    prompt: parsed.data.prompt,
    summary: parsed.data.summary,
    vote: parsed.data.vote,
    recipe: validatedRecipe.data,
    ...(parsed.data.note ? { note: parsed.data.note } : {}),
  });

  return jsonResponse({
    ok: true,
    fingerprint: result.fingerprint,
    netScore: result.netScore,
    stored: result.stored,
    vote: parsed.data.vote,
  }, 200, session);
}

function feedbackIdentity(request: Request, sessionId: string) {
  const secret = process.env.CANVAS_USAGE_HMAC_SECRET?.trim() ||
    (process.env.NODE_ENV === "production" ? "" : "local-canvas-development-only");
  if (!secret) return null;
  const identifiers = createDailySafetyIdentifiers(request, sessionId, secret);
  return { day: identifiers.day, session: identifiers.session, ip: identifiers.ip };
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
