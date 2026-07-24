import type { CanvasPatch } from "../contract";
import type { CanvasAgentRequest } from "../request";

import type { ApprovedFormatPrior } from "../format-memory";

export type VisionProviderInput = CanvasAgentRequest & {
  knowledgeSnippets: string[];
  /** Layout/format priors only — never treat as factual ground truth. */
  approvedFormats?: ApprovedFormatPrior[];
  safetyIdentifier: string;
  executionMs?: number;
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

export class CanvasPatchGenerationError extends Error {
  readonly code: "invalid-output" | "empty-output";

  constructor(code: CanvasPatchGenerationError["code"], message: string, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.code = code;
    this.name = "CanvasPatchGenerationError";
  }
}
