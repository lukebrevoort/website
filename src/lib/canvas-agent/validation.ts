import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  MAX_PATCH_TEXT_LENGTH,
  canvasPatchSchema,
  type CanvasElementRef,
  type CanvasOperation,
  type CanvasPatch,
  type NormalizedBox,
} from "./contract";

export type CanvasElementOrigin = "visitor" | "agent" | "system";

export type CanvasContextElement = {
  ref: `existing:${string}`;
  elementId: ExcalidrawElement["id"];
  kind: "text" | "note" | "rectangle" | "ellipse" | "frame" | "arrow" | "freehand";
  box: NormalizedBox;
  origin: CanvasElementOrigin;
  text?: string;
};

export type CanvasPatchContext = {
  sceneVersion: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  elements: readonly CanvasContextElement[];
};

export type CanvasPatchRiskReason =
  | "stale-scene"
  | "delete"
  | "visitor-authored-change"
  | "large-operation-count"
  | "large-created-area"
  | "large-move";

export type CanvasPatchRisk = {
  requiresConfirmation: boolean;
  reasons: CanvasPatchRiskReason[];
};

export type ValidatedCanvasPatch = {
  patch: CanvasPatch;
  risk: CanvasPatchRisk;
};

export type CanvasPatchValidationResult =
  | { ok: true; value: ValidatedCanvasPatch }
  | { ok: false; issues: string[] };

const LARGE_OPERATION_COUNT = 12;
const LARGE_CREATED_AREA = 450_000;
const LARGE_MOVE_DISTANCE = 450;

export function validateCanvasPatch(
  input: unknown,
  context: CanvasPatchContext,
): CanvasPatchValidationResult {
  const parsed = canvasPatchSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map(formatSchemaIssue),
    };
  }

  const patch = parsed.data;
  const issues = validateSemantics(patch, context);
  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    value: {
      patch,
      risk: classifyCanvasPatchRisk(patch, context),
    },
  };
}

export function classifyCanvasPatchRisk(
  patch: CanvasPatch,
  context: CanvasPatchContext,
): CanvasPatchRisk {
  const reasons = new Set<CanvasPatchRiskReason>();
  const contextByRef = new Map(context.elements.map((element) => [element.ref, element]));

  if (patch.baseSceneVersion !== context.sceneVersion) reasons.add("stale-scene");
  if (patch.operations.length > LARGE_OPERATION_COUNT) reasons.add("large-operation-count");

  let createdArea = 0;

  for (const operation of patch.operations) {
    if (operation.op === "create" && "box" in operation.element) {
      createdArea += operation.element.box.width * operation.element.box.height;
    }

    if (operation.op === "delete") reasons.add("delete");

    for (const target of getMutationTargets(operation)) {
      const existing = contextByRef.get(target as CanvasContextElement["ref"]);
      if (existing?.origin === "visitor") reasons.add("visitor-authored-change");

      if (operation.op === "move" && existing) {
        const distance = Math.hypot(operation.to.x - existing.box.x, operation.to.y - existing.box.y);
        if (distance > LARGE_MOVE_DISTANCE) reasons.add("large-move");
      }
    }
  }

  if (createdArea > LARGE_CREATED_AREA) reasons.add("large-created-area");

  return {
    requiresConfirmation: reasons.size > 0,
    reasons: [...reasons],
  };
}

function validateSemantics(patch: CanvasPatch, context: CanvasPatchContext): string[] {
  const issues: string[] = [];
  const existingRefs = new Set(context.elements.map((element) => element.ref));
  const availableRefs = new Set<CanvasElementRef>(existingRefs);
  const declaredRefs = new Set<string>(existingRefs);
  let totalTextLength = patch.summary.length;

  if (!Number.isFinite(context.bounds.x) || !Number.isFinite(context.bounds.y)) {
    issues.push("context bounds origin must be finite");
  }
  if (!Number.isFinite(context.bounds.width) || context.bounds.width <= 0) {
    issues.push("context bounds width must be positive and finite");
  }
  if (!Number.isFinite(context.bounds.height) || context.bounds.height <= 0) {
    issues.push("context bounds height must be positive and finite");
  }

  patch.operations.forEach((operation, index) => {
    for (const ref of getDeclaredRefs(operation)) {
      if (declaredRefs.has(ref)) {
        issues.push(`operations[${index}] declares duplicate ref ${ref}`);
      } else {
        declaredRefs.add(ref);
      }
    }

    for (const ref of getReferencedRefs(operation)) {
      if (!availableRefs.has(ref)) {
        issues.push(`operations[${index}] references unavailable element ${ref}`);
      }
    }

    for (const ref of getDeclaredElementRefs(operation)) availableRefs.add(ref);
    totalTextLength += getOperationTextLength(operation);
  });

  if (totalTextLength > MAX_PATCH_TEXT_LENGTH) {
    issues.push(`patch text exceeds the ${MAX_PATCH_TEXT_LENGTH} character budget`);
  }

  return issues;
}

function getDeclaredRefs(operation: CanvasOperation): string[] {
  switch (operation.op) {
    case "create":
    case "connect":
      return [operation.ref];
    case "group":
      return [operation.groupRef];
    default:
      return [];
  }
}

function getDeclaredElementRefs(operation: CanvasOperation): CanvasElementRef[] {
  return operation.op === "create" || operation.op === "connect" ? [operation.ref] : [];
}

function getReferencedRefs(operation: CanvasOperation): CanvasElementRef[] {
  switch (operation.op) {
    case "update":
    case "move":
    case "delete":
      return [operation.target];
    case "group":
      return operation.members;
    case "connect":
      return [operation.from, operation.to];
    default:
      return [];
  }
}

function getMutationTargets(operation: CanvasOperation): CanvasElementRef[] {
  switch (operation.op) {
    case "update":
    case "move":
    case "delete":
      return [operation.target];
    case "group":
      return operation.members;
    default:
      return [];
  }
}

function getOperationTextLength(operation: CanvasOperation): number {
  switch (operation.op) {
    case "create":
      switch (operation.element.kind) {
        case "text":
        case "note":
        case "rectangle":
        case "ellipse":
          return operation.element.text?.length ?? 0;
        case "frame":
        case "arrow":
          return operation.element.label?.length ?? 0;
        case "freehand":
          return 0;
      }
    case "update":
      return operation.text?.length ?? 0;
    case "connect":
      return operation.label?.length ?? 0;
    case "delete":
      return operation.reason.length;
    default:
      return 0;
  }
}

function formatSchemaIssue(issue: { path: PropertyKey[]; message: string }): string {
  const path = issue.path.length > 0 ? issue.path.join(".") : "patch";
  return `${path}: ${issue.message}`;
}
