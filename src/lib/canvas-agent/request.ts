import { z } from "zod";
import { existingElementRefSchema, normalizedBoxSchema } from "./contract";

export const MAX_CANVAS_REQUEST_BYTES = 1_900_000;
export const MAX_CANVAS_IMAGE_BYTES = 1_500_000;
export const MAX_CANVAS_IMAGE_DIMENSION = 768;
export const MAX_CONTEXT_ELEMENTS = 40;
export const MAX_PRIOR_TURNS = 2;
export const MAX_KNOWLEDGE_SNIPPETS = 4;

const boundsSchema = z.strictObject({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
});

const contextElementSchema = z.strictObject({
  ref: z.templateLiteral([
    z.literal("existing:"),
    z.string().regex(/^[a-z0-9][a-z0-9_-]{0,127}$/),
  ]),
  elementId: z.string().min(1).max(128),
  kind: z.enum(["text", "note", "rectangle", "ellipse", "frame", "arrow", "freehand"]),
  box: normalizedBoxSchema,
  origin: z.enum(["visitor", "agent", "system"]),
  text: z.string().max(500).optional(),
  containerRef: existingElementRefSchema.optional(),
});

export const canvasAgentContextSchema = z.strictObject({
  sceneVersion: z.string().min(1).max(128),
  bounds: boundsSchema,
  elements: z.array(contextElementSchema).max(MAX_CONTEXT_ELEMENTS),
});

export const priorCanvasTurnSchema = z.strictObject({
  prompt: z.string().trim().min(1).max(400),
  summary: z.string().trim().min(1).max(240),
});

export const canvasAgentRequestSchema = z.strictObject({
  prompt: z.string().trim().min(1).max(400),
  scope: z.enum(["selection", "viewport"]),
  context: canvasAgentContextSchema,
  imageDataUrl: z
    .string()
    .startsWith("data:image/png;base64,")
    .max(Math.ceil((MAX_CANVAS_IMAGE_BYTES * 4) / 3) + 64),
  priorTurns: z.array(priorCanvasTurnSchema).max(MAX_PRIOR_TURNS).default([]),
});

export type CanvasAgentRequest = z.infer<typeof canvasAgentRequestSchema>;
export type PriorCanvasTurn = z.infer<typeof priorCanvasTurnSchema>;
