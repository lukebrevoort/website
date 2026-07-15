import "server-only";

import { GeminiCanvasVisionProvider } from "./gemini";
import { ProviderUnavailableError, type CanvasVisionProvider } from "./types";

export function createCanvasVisionProvider(): CanvasVisionProvider {
  const provider = process.env.CANVAS_VISION_PROVIDER || "gemini";
  if (provider === "gemini") return new GeminiCanvasVisionProvider();
  throw new ProviderUnavailableError(`Canvas vision provider "${provider}" is not available`);
}

export { ProviderUnavailableError } from "./types";

