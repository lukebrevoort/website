import "server-only";

import {
  createOpenAI,
  type OpenAILanguageModelResponsesOptions,
} from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { canvasPatchSchema } from "../contract";
import { getOpenAIApiKey } from "./config";
import { canvasPatchGenerationSchema } from "./generation-schema";
import { normalizeCanvasPatchCandidate } from "./normalize";
import {
  CANVAS_DIRECTOR_INSTRUCTIONS,
  buildCanvasDirectorContext,
} from "./prompt";
import type { CanvasVisionProvider, VisionProviderInput } from "./types";

const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const DEFAULT_MAX_OUTPUT_TOKENS = 1_600;

export class OpenAICanvasVisionProvider implements CanvasVisionProvider {
  async generatePatch(input: VisionProviderInput) {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) throw new Error("OpenAI is not configured");

    const modelId = process.env.CANVAS_OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const openai = createOpenAI({ apiKey });
    const structuralContext = buildCanvasDirectorContext(input);
    const configuredOutputTokens = Number(process.env.CANVAS_MAX_OUTPUT_TOKENS);
    const maxOutputTokens = Number.isInteger(configuredOutputTokens) && configuredOutputTokens >= 600 && configuredOutputTokens <= 3_000
      ? configuredOutputTokens
      : DEFAULT_MAX_OUTPUT_TOKENS;

    const { output } = await generateText({
      model: openai.responses(modelId),
      system: CANVAS_DIRECTOR_INSTRUCTIONS,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: structuralContext },
          {
            type: "image",
            image: input.imageDataUrl,
            mediaType: "image/png",
            providerOptions: { openai: { imageDetail: "high" } },
          },
        ],
      }],
      output: Output.object({
        schema: canvasPatchGenerationSchema,
        name: "CanvasPatchV1",
        description: "A factual, readable, well-composed semantic patch for the supplied Excalidraw canvas.",
      }),
      maxOutputTokens,
      maxRetries: 0,
      timeout: { totalMs: input.executionMs || 18_000 },
      providerOptions: {
        openai: {
          store: false,
          reasoningEffort: "low",
          textVerbosity: "low",
          safetyIdentifier: input.safetyIdentifier,
        } satisfies OpenAILanguageModelResponsesOptions,
      },
      experimental_telemetry: { isEnabled: false },
      experimental_include: { requestBody: false, responseBody: false },
    });

    return {
      patch: canvasPatchSchema.parse(normalizeCanvasPatchCandidate(output)),
      provider: "openai",
      model: modelId,
    };
  }
}
