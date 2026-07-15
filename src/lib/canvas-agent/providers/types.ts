import type { CanvasPatch } from "../contract";
import type { CanvasAgentRequest } from "../request";

export type VisionProviderInput = CanvasAgentRequest & {
  knowledgeSnippets: string[];
};

export type VisionProviderResult = {
  patch: CanvasPatch;
  provider: string;
  model: string;
};

export interface CanvasVisionProvider {
  generatePatch(input: VisionProviderInput): Promise<VisionProviderResult>;
}

export class ProviderUnavailableError extends Error {}

