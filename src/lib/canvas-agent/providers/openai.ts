import "server-only";

import {
  createOpenAI,
  type OpenAILanguageModelResponsesOptions,
} from "@ai-sdk/openai";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { ZodError } from "zod";
import { getOpenAIApiKey } from "./config";
import {
  CANVAS_DIRECTOR_INSTRUCTIONS,
  buildCanvasDirectorContext,
} from "./prompt";
import {
  SimpleOpsConversionError,
  canvasSimpleOpsGenerationSchema,
  convertSimpleOpsToCanvasPatch,
  suggestPlacementRegion,
} from "./simple-ops";
import type { CanvasVisionProvider, VisionProviderInput } from "./types";
import { CanvasPatchGenerationError } from "./types";

const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const DEFAULT_MAX_OUTPUT_TOKENS = 1_200;

export class OpenAICanvasVisionProvider implements CanvasVisionProvider {
  async generatePatch(input: VisionProviderInput) {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) throw new Error("OpenAI is not configured");

    const modelId = process.env.CANVAS_OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const openai = createOpenAI({ apiKey });
    const priorTurnCount = input.priorTurns?.length ?? 0;
    const placement = suggestPlacementRegion(input.context, priorTurnCount);
    const structuralContext = buildCanvasDirectorContext(input, placement);
    const configuredOutputTokens = Number(process.env.CANVAS_MAX_OUTPUT_TOKENS);
    const maxOutputTokens = Number.isInteger(configuredOutputTokens) && configuredOutputTokens >= 600 && configuredOutputTokens <= 3_000
      ? configuredOutputTokens
      : DEFAULT_MAX_OUTPUT_TOKENS;

    try {
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
              providerOptions: { openai: { imageDetail: "auto" } },
            },
          ],
        }],
        output: Output.object({
          schema: canvasSimpleOpsGenerationSchema,
          name: "CanvasSimpleOpsV1",
          description: "A short list of simple add/connect drawing ops for the Excalidraw canvas.",
        }),
        maxOutputTokens,
        maxRetries: 1,
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

      if (!output) {
        throw new CanvasPatchGenerationError(
          "empty-output",
          "The vision model returned no structured drawing ops.",
        );
      }

      const patch = convertSimpleOpsToCanvasPatch(output, {
        placement,
        priorTurnCount,
      });

      return {
        patch,
        provider: "openai",
        model: modelId,
      };
    } catch (error) {
      if (error instanceof CanvasPatchGenerationError || error instanceof SimpleOpsConversionError) {
        throw error;
      }
      if (error instanceof ZodError) {
        throw new CanvasPatchGenerationError(
          "invalid-output",
          "The vision model returned drawing ops that could not be validated.",
          error,
        );
      }
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new CanvasPatchGenerationError(
          "invalid-output",
          "The vision model could not produce a structured sketch.",
          error,
        );
      }
      throw error;
    }
  }
}
