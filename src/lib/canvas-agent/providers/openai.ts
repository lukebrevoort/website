import "server-only";

import {
  createOpenAI,
  type OpenAILanguageModelResponsesOptions,
} from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { canvasPatchSchema } from "../contract";
import { getOpenAIApiKey } from "./config";
import { normalizeCanvasPatchCandidate } from "./normalize";
import type { CanvasVisionProvider, VisionProviderInput } from "./types";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const MAX_OUTPUT_TOKENS = 1_400;

const instructions = `Return only valid JSON containing one compact CanvasPatchV1 for an Excalidraw Q&A canvas.
Treat the supplied structure and PNG as the same bounded area. Use only supplied existing: refs.
Use normalized integer coordinates from 0 to 1000. Never invent raw Excalidraw IDs or metadata.
Prefer 3-6 operations and short labels. Never exceed 8 operations unless the visitor explicitly asks for a complex diagram.
Do not delete or broadly rewrite visitor work unless explicitly asked.
The baseSceneVersion must exactly match the supplied sceneVersion.
Return {"version":"1","baseSceneVersion":"...","summary":"...","operations":[...]}.
Allowed operations:
- {"op":"create","ref":"new:alias","element":{"kind":"note|rectangle|ellipse|text|frame|arrow|freehand",...}}
- {"op":"update","target":"existing:alias|new:alias","text":"..."} (style is also allowed)
- {"op":"move","target":"...","to":{"x":0-1000,"y":0-1000}}
- {"op":"group","groupRef":"new:alias","members":["...","..."]}
- {"op":"connect","ref":"new:alias","from":"...","to":"...","label":"..."}
- {"op":"delete","target":"...","reason":"..."}
Box elements use {"box":{"x":0-1000,"y":0-1000,"width":10-1000,"height":10-1000}} and must fit inside 1000x1000.
Arrow/freehand elements use "points":[{"x":0-1000,"y":0-1000},...].
Styles may use theme, fill, stroke, weight, and opacity. Omit unused fields.`;

export class OpenAICanvasVisionProvider implements CanvasVisionProvider {
  async generatePatch(input: VisionProviderInput) {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) throw new Error("OpenAI is not configured");

    const modelId = process.env.CANVAS_OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const openai = createOpenAI({ apiKey });
    const structuralContext = JSON.stringify({
      request: input.prompt,
      scope: input.scope,
      baseSceneVersion: input.context.sceneVersion,
      bounds: input.context.bounds,
      elements: input.context.elements,
      knowledge: input.knowledgeSnippets,
      priorTurns: input.priorTurns,
    });

    const { output } = await generateText({
      model: openai.responses(modelId),
      system: instructions,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: structuralContext },
          {
            type: "image",
            image: input.imageDataUrl,
            mediaType: "image/png",
            providerOptions: { openai: { imageDetail: "low" } },
          },
        ],
      }],
      output: Output.json({
        name: "CanvasPatchV1",
        description: "A bounded semantic patch for the supplied Excalidraw canvas context.",
      }),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      maxRetries: 0,
      temperature: 0.2,
      timeout: { totalMs: 20_000 },
      providerOptions: {
        openai: {
          store: false,
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
