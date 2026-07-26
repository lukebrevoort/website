import "server-only";

import { OpenAICanvasVisionProvider } from "./openai";
import { ProviderUnavailableError, type CanvasVisionProvider } from "./types";

export function createCanvasVisionProvider(): CanvasVisionProvider {
  const provider = process.env.CANVAS_VISION_PROVIDER || "openai";
  if (provider === "openai") return new OpenAICanvasVisionProvider();
  throw new ProviderUnavailableError(`Canvas vision provider "${provider}" is not available`);
}

export { ProviderUnavailableError, CanvasPatchGenerationError } from "./types";
