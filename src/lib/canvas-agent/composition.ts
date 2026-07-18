import type { CanvasPatch, NormalizedBox } from "./contract";

const ARCHITECTURE_INTENT = /\b(architecture|how\b.+\bworks?|flow|pipeline|process|system|connects?|decide)\b/i;
const MAX_BOX_TEXT_LENGTH = 220;
const MAX_BOX_TEXT_LINES = 6;
const MAX_OVERLAP_RATIO = 0.35;

export type CanvasCompositionReview =
  | { ok: true }
  | { ok: false; issues: string[] };

export function reviewCanvasPatchComposition(
  patch: CanvasPatch,
  prompt: string,
): CanvasCompositionReview {
  const issues: string[] = [];
  const boxes = patch.operations.flatMap((operation) => {
    if (operation.op !== "create" || !("box" in operation.element)) return [];
    if (operation.element.kind === "frame") return [];
    return [{ ref: operation.ref, box: operation.element.box }];
  });

  for (const operation of patch.operations) {
    if (operation.op !== "create" || !("text" in operation.element)) continue;
    const text = operation.element.text;
    if (!text) continue;
    if (text.length > MAX_BOX_TEXT_LENGTH || text.split("\n").length > MAX_BOX_TEXT_LINES) {
      issues.push(`${operation.ref} contains too much text for a readable canvas node`);
    }
  }

  for (let leftIndex = 0; leftIndex < boxes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < boxes.length; rightIndex += 1) {
      const left = boxes[leftIndex];
      const right = boxes[rightIndex];
      if (overlapRatio(left.box, right.box) > MAX_OVERLAP_RATIO) {
        issues.push(`${left.ref} and ${right.ref} overlap too heavily`);
      }
    }
  }

  if (ARCHITECTURE_INTENT.test(prompt) && boxes.length >= 3) {
    const relationshipCount = patch.operations.filter(
      (operation) => operation.op === "connect" ||
        (operation.op === "create" && operation.element.kind === "arrow"),
    ).length;
    if (relationshipCount === 0) {
      issues.push("an architecture or process sketch with three or more nodes needs visible relationships");
    }
  }

  return issues.length === 0 ? { ok: true } : { ok: false, issues };
}

function overlapRatio(left: NormalizedBox, right: NormalizedBox) {
  const overlapWidth = Math.max(
    0,
    Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x),
  );
  const overlapHeight = Math.max(
    0,
    Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y),
  );
  const overlapArea = overlapWidth * overlapHeight;
  const smallerArea = Math.min(left.width * left.height, right.width * right.height);
  return smallerArea === 0 ? 0 : overlapArea / smallerArea;
}
