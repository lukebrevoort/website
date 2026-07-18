import { z } from "zod";

export const CANVAS_PATCH_VERSION = "1" as const;
export const NORMALIZED_CANVAS_SIZE = 1000;
export const MAX_PATCH_OPERATIONS = 25;
export const MAX_PATCH_TEXT_LENGTH = 2_500;
export const MAX_FREEHAND_POINTS = 128;

const normalizedCoordinateSchema = z.number().int().min(0).max(NORMALIZED_CANVAS_SIZE);
const normalizedSizeSchema = z.number().int().min(10).max(NORMALIZED_CANVAS_SIZE);
const aliasNameSchema = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/);

export const existingElementRefSchema = z.templateLiteral([
  z.literal("existing:"),
  aliasNameSchema,
]);
export const newElementRefSchema = z.templateLiteral([
  z.literal("new:"),
  aliasNameSchema,
]);
export const elementRefSchema = z.union([existingElementRefSchema, newElementRefSchema]);

export const normalizedPointSchema = z.strictObject({
  x: normalizedCoordinateSchema,
  y: normalizedCoordinateSchema,
});

export const normalizedBoxSchema = z
  .strictObject({
    x: normalizedCoordinateSchema,
    y: normalizedCoordinateSchema,
    width: normalizedSizeSchema,
    height: normalizedSizeSchema,
  })
  .refine((box) => box.x + box.width <= NORMALIZED_CANVAS_SIZE, {
    message: "box must fit within the normalized canvas width",
    path: ["width"],
  })
  .refine((box) => box.y + box.height <= NORMALIZED_CANVAS_SIZE, {
    message: "box must fit within the normalized canvas height",
    path: ["height"],
  })
  .describe("An integer box in the 1000x1000 normalized canvas; leave visual gaps between peer boxes.");

export const canvasThemeSchema = z.enum([
  "ink",
  "muted",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
]);

export const canvasStyleSchema = z.strictObject({
  theme: canvasThemeSchema.optional(),
  fill: z.enum(["transparent", "solid", "hachure"]).optional(),
  stroke: z.enum(["solid", "dashed", "dotted"]).optional(),
  weight: z.enum(["thin", "regular", "bold"]).optional(),
  opacity: z.number().int().min(20).max(100).optional(),
}).describe("A restrained semantic style. Use accent sparingly and omit fields that do not add meaning.");

const shortTextSchema = z.string().trim().min(1).max(500);
const labelSchema = z.string().trim().min(1).max(160);

const boxedElementSchema = z.strictObject({
  kind: z.enum(["note", "rectangle", "ellipse"]),
  box: normalizedBoxSchema,
  text: shortTextSchema.optional(),
  style: canvasStyleSchema.optional(),
});

const textElementSchema = z.strictObject({
  kind: z.literal("text"),
  box: normalizedBoxSchema,
  text: shortTextSchema,
  style: canvasStyleSchema.optional(),
});

const frameElementSchema = z.strictObject({
  kind: z.literal("frame"),
  box: normalizedBoxSchema,
  label: labelSchema.optional(),
  style: canvasStyleSchema.optional(),
});

const arrowElementSchema = z.strictObject({
  kind: z.literal("arrow"),
  points: z.array(normalizedPointSchema).min(2).max(12),
  label: labelSchema.optional(),
  style: canvasStyleSchema.optional(),
});

const freehandElementSchema = z.strictObject({
  kind: z.literal("freehand"),
  points: z.array(normalizedPointSchema).min(2).max(MAX_FREEHAND_POINTS),
  style: canvasStyleSchema.optional(),
});

export const canvasElementSpecSchema = z.discriminatedUnion("kind", [
  boxedElementSchema,
  textElementSchema,
  frameElementSchema,
  arrowElementSchema,
  freehandElementSchema,
]).describe("One readable Excalidraw element. Box text must be concise enough to scan without zooming.");

const createOperationSchema = z.strictObject({
  op: z.literal("create"),
  ref: newElementRefSchema,
  element: canvasElementSpecSchema,
});

const updateOperationSchema = z
  .strictObject({
    op: z.literal("update"),
    target: elementRefSchema,
    text: shortTextSchema.optional(),
    style: canvasStyleSchema.optional(),
  })
  .refine((operation) => operation.text !== undefined || operation.style !== undefined, {
    message: "update must include text or style",
  });

const moveOperationSchema = z.strictObject({
  op: z.literal("move"),
  target: elementRefSchema,
  to: normalizedPointSchema,
});

const groupOperationSchema = z.strictObject({
  op: z.literal("group"),
  groupRef: newElementRefSchema,
  members: z.array(elementRefSchema).min(2).max(20),
});

const connectOperationSchema = z.strictObject({
  op: z.literal("connect"),
  ref: newElementRefSchema,
  from: elementRefSchema,
  to: elementRefSchema,
  label: labelSchema.optional(),
  style: canvasStyleSchema.optional(),
});

const deleteOperationSchema = z.strictObject({
  op: z.literal("delete"),
  target: elementRefSchema,
  reason: z.string().trim().min(1).max(240),
});

export const canvasOperationSchema = z.discriminatedUnion("op", [
  createOperationSchema,
  updateOperationSchema,
  moveOperationSchema,
  groupOperationSchema,
  connectOperationSchema,
  deleteOperationSchema,
]).describe("One ordered canvas mutation. Create endpoints before referring to them in later operations.");

export const canvasPatchSchema = z.strictObject({
  version: z.literal(CANVAS_PATCH_VERSION),
  baseSceneVersion: z.string().trim().min(1).max(128)
    .describe("Copy the supplied sceneVersion exactly."),
  summary: z.string().trim().min(1).max(300)
    .describe("A concise description of the insight and visual change, not implementation metadata."),
  operations: z.array(canvasOperationSchema).min(1).max(MAX_PATCH_OPERATIONS)
    .describe("An ordered, cohesive composition; normally 12 operations or fewer."),
});

export const canvasPatchJsonSchema = z.toJSONSchema(canvasPatchSchema, {
  target: "draft-2020-12",
});

export type CanvasPatch = z.infer<typeof canvasPatchSchema>;
export type CanvasOperation = z.infer<typeof canvasOperationSchema>;
export type CanvasElementSpec = z.infer<typeof canvasElementSpecSchema>;
export type CanvasStyle = z.infer<typeof canvasStyleSchema>;
export type CanvasElementRef = z.infer<typeof elementRefSchema>;
export type NewCanvasElementRef = z.infer<typeof newElementRefSchema>;
export type NormalizedPoint = z.infer<typeof normalizedPointSchema>;
export type NormalizedBox = z.infer<typeof normalizedBoxSchema>;
