import "server-only";

import { createGoogleGenerativeAI, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { canvasPatchSchema } from "../contract";
import type { CanvasVisionProvider, VisionProviderInput } from "./types";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

const instructions = `You edit an Excalidraw canvas by returning one CanvasPatchV1 object.
Treat the supplied canvas structure and PNG as the same bounded area.
Use only supplied existing: refs. Create small, legible changes with normalized integer coordinates from 0 to 1000.
Never invent raw Excalidraw IDs or metadata. Prefer 8 or fewer operations. Do not delete or broadly rewrite visitor work unless explicitly asked.
The baseSceneVersion must exactly match the supplied sceneVersion.`;

export class GeminiCanvasVisionProvider implements CanvasVisionProvider {
  async generatePatch(input: VisionProviderInput) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("Gemini is not configured");

    const modelId = process.env.CANVAS_GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    const google = createGoogleGenerativeAI({ apiKey });
    const structuralContext = JSON.stringify({
      request: input.prompt,
      scope: input.scope,
      baseSceneVersion: input.context.sceneVersion,
      normalizationBounds: input.context.bounds,
      elements: input.context.elements,
      projectKnowledge: input.knowledgeSnippets,
      priorBoardTurns: input.priorTurns,
    });

    const { output } = await generateText({
      model: google(modelId),
      system: instructions,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: structuralContext },
          { type: "image", image: input.imageDataUrl, mediaType: "image/png" },
        ],
      }],
      output: Output.object({
        name: "CanvasPatchV1",
        description: "A bounded semantic patch for the supplied Excalidraw canvas context.",
        schema: canvasPatchSchema,
      }),
      maxOutputTokens: 2_500,
      maxRetries: 0,
      temperature: 0.2,
      timeout: { totalMs: 25_000 },
      providerOptions: {
        google: {
          thinkingConfig: { thinkingBudget: 0 },
          mediaResolution: "MEDIA_RESOLUTION_LOW",
        } satisfies GoogleLanguageModelOptions,
      },
    });

    return { patch: output, provider: "gemini", model: modelId };
  }
}
