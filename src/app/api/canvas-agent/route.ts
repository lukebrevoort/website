import { NextResponse } from "next/server";
import {
  MAX_CANVAS_REQUEST_BYTES,
  canvasAgentRequestSchema,
} from "@/lib/canvas-agent/request";
import { selectKnowledgeSnippets } from "@/lib/canvas-agent/knowledge";
import {
  ProviderUnavailableError,
  createCanvasVisionProvider,
} from "@/lib/canvas-agent/providers";
import { getOpenAIApiKey } from "@/lib/canvas-agent/providers/config";
import { validateCanvasPatch } from "@/lib/canvas-agent";
import { createSafetyIdentifier } from "@/lib/canvas-agent/security";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return restingResponse("The canvas request must be sent as JSON.", 415, "invalid-request");
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_CANVAS_REQUEST_BYTES) {
    return restingResponse("That canvas view is too large to inspect safely. Select fewer marks and try again.", 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_CANVAS_REQUEST_BYTES) {
      return restingResponse("That canvas view is too large to inspect safely. Select fewer marks and try again.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return restingResponse("The canvas request could not be read. Your board was not changed.", 400);
  }

  const parsed = canvasAgentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      ok: false,
      code: "invalid-request",
      message: "That canvas context was incomplete or too large. Your board was not changed.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    }, { status: 400 });
  }

  const provider = process.env.CANVAS_VISION_PROVIDER || "openai";
  const openaiApiKey = getOpenAIApiKey();
  if (!openaiApiKey && provider === "openai") {
    return restingResponse("The vision agent is resting while its OpenAI connection is unavailable.", 503);
  }

  try {
    const result = await createCanvasVisionProvider().generatePatch({
      ...parsed.data,
      knowledgeSnippets: selectKnowledgeSnippets(parsed.data.prompt),
      safetyIdentifier: createSafetyIdentifier(request, openaiApiKey || "unconfigured"),
    });
    const validation = validateCanvasPatch(result.patch, parsed.data.context);
    if (!validation.ok) {
      return NextResponse.json({
        ok: false,
        code: "invalid-patch",
        message: "The agent returned an unsafe canvas change, so nothing was applied.",
        issues: validation.issues,
      }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      patch: validation.value.patch,
      risk: validation.value.risk,
      provider: result.provider,
      model: result.model,
      scope: parsed.data.scope,
    });
  } catch (error) {
    if (error instanceof ProviderUnavailableError) {
      return restingResponse("The configured vision provider is unavailable. Your board was not changed.", 503);
    }
    if (isQuotaError(error)) {
      return restingResponse("The vision agent is receiving too many requests. Wait a moment and try again.", 429);
    }
    console.error("Canvas vision request failed", error);
    return restingResponse("The vision agent lost the thread. Your board is untouched—please try again.", 502);
  }
}

function restingResponse(message: string, status: number, code = "agent-resting") {
  return NextResponse.json(
    { ok: false, code, message },
    { status, headers: { "cache-control": "private, no-store" } },
  );
}

function isQuotaError(error: unknown) {
  const candidate = error as { statusCode?: number; status?: number; message?: string };
  return candidate?.statusCode === 429 || candidate?.status === 429 ||
    /quota|resource.?exhausted|rate.?limit/i.test(candidate?.message || "");
}
