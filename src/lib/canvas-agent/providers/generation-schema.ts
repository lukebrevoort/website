import { z } from "zod";
import { canvasSimpleOpsGenerationSchema } from "./simple-ops";

/**
 * Provider-facing structured output schema.
 * Kept as a flat simple-ops shape (Dispatch #735 style) so the model invents
 * less nested geometry. Canonical CanvasPatch validation still runs after conversion.
 */
export const canvasPatchGenerationSchema = canvasSimpleOpsGenerationSchema;

export function canvasPatchGenerationJsonSchema() {
  return z.toJSONSchema(canvasPatchGenerationSchema, { target: "draft-2020-12" });
}
