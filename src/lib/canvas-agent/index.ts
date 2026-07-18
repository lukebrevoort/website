export {
  CANVAS_PATCH_VERSION,
  MAX_FREEHAND_POINTS,
  MAX_PATCH_OPERATIONS,
  MAX_PATCH_TEXT_LENGTH,
  NORMALIZED_CANVAS_SIZE,
  normalizedBoxSchema,
  canvasPatchJsonSchema,
  canvasPatchSchema,
  type CanvasElementRef,
  type CanvasElementSpec,
  type CanvasOperation,
  type CanvasPatch,
  type CanvasStyle,
  type NewCanvasElementRef,
  type NormalizedBox,
  type NormalizedPoint,
} from "./contract";
export {
  MAX_CANVAS_IMAGE_BYTES,
  MAX_CANVAS_IMAGE_DIMENSION,
  MAX_CANVAS_REQUEST_BYTES,
  MAX_CONTEXT_ELEMENTS,
  MAX_PRIOR_TURNS,
  canvasAgentRequestSchema,
  type CanvasAgentRequest,
  type PriorCanvasTurn,
} from "./request";
export {
  classifyCanvasPatchRisk,
  validateCanvasPatch,
  type CanvasContextElement,
  type CanvasElementOrigin,
  type CanvasPatchContext,
  type CanvasPatchRisk,
  type CanvasPatchRiskReason,
  type CanvasPatchValidationResult,
  type ValidatedCanvasPatch,
} from "./validation";
export {
  compileCanvasPatch,
  type CompiledCanvasPatch,
  type CompiledElementConnection,
  type CompiledElementGroup,
  type CompiledElementUpdate,
} from "./compiler";
export { applyCompiledPatchToElements } from "./apply";
