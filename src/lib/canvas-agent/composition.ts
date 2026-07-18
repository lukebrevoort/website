import type { CanvasPatch, NormalizedBox, NormalizedPoint } from "./contract";
import type { CanvasContextElement, CanvasPatchContext } from "./validation";

const ARCHITECTURE_INTENT = /\b(architecture|how\b.+\bworks?|flow|pipeline|process|system|connects?|decide)\b/i;
const MAX_BOX_TEXT_LENGTH = 220;
const MAX_BOX_TEXT_LINES = 6;
const MAX_OVERLAP_RATIO = 0.35;
const PORTRAIT_ASPECT_RATIO = 1.25;
const CONNECTOR_LABEL_FONT_SIZE = 16;
const CONNECTOR_LABEL_CHARACTER_WIDTH = 8.5;
const CONNECTOR_LABEL_LINE_HEIGHT = 22;

type CompositionContext = Pick<CanvasPatchContext, "bounds" | "elements">;

type CompositionBox = {
  ref: string;
  box: NormalizedBox;
  kind: CanvasContextElement["kind"];
  source: "existing" | "created" | "moved";
  containerRef?: string;
};

type Connector = {
  ref: string;
  label?: string;
  segments: Array<readonly [NormalizedPoint, NormalizedPoint]>;
  endpointRefs: ReadonlySet<string>;
};

export type CanvasCompositionReview =
  | { ok: true }
  | { ok: false; issues: string[] };

export function reviewCanvasPatchComposition(
  patch: CanvasPatch,
  prompt: string,
  context?: CompositionContext,
): CanvasCompositionReview {
  const issues: string[] = [];
  const boxes = collectCompositionBoxes(patch, context);

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
      if (
        left.source === "existing" && right.source === "existing" ||
        isBoundTextPair(left, right)
      ) continue;
      if (overlapRatio(left.box, right.box) > MAX_OVERLAP_RATIO) {
        issues.push(`${left.ref} and ${right.ref} overlap too heavily`);
      }
    }
  }

  const createdBoxes = boxes.filter((box) => box.source === "created");
  if (ARCHITECTURE_INTENT.test(prompt) && createdBoxes.length >= 3) {
    const relationshipCount = patch.operations.filter(
      (operation) => operation.op === "connect" ||
        (operation.op === "create" && operation.element.kind === "arrow"),
    ).length;
    if (relationshipCount === 0) {
      issues.push("an architecture or process sketch with three or more nodes needs visible relationships");
    }
  }

  if (context && context.bounds.height >= context.bounds.width * PORTRAIT_ASPECT_RATIO) {
    reviewPortraitConnectors(patch, boxes, context, issues);
  }

  return issues.length === 0 ? { ok: true } : { ok: false, issues };
}

function collectCompositionBoxes(
  patch: CanvasPatch,
  context?: CompositionContext,
): CompositionBox[] {
  const boxes = new Map<string, CompositionBox>();

  for (const element of context?.elements ?? []) {
    if (["frame", "arrow", "freehand"].includes(element.kind)) continue;
    boxes.set(element.ref, {
      ref: element.ref,
      box: element.box,
      kind: element.kind,
      source: "existing",
      ...(element.containerRef ? { containerRef: element.containerRef } : {}),
    });
  }

  for (const operation of patch.operations) {
    if (operation.op === "create" && "box" in operation.element && operation.element.kind !== "frame") {
      boxes.set(operation.ref, {
        ref: operation.ref,
        box: operation.element.box,
        kind: operation.element.kind,
        source: "created",
      });
    }
    if (operation.op === "move") {
      const compositionBox = boxes.get(operation.target);
      if (compositionBox) {
        boxes.set(operation.target, {
          ...compositionBox,
          box: { ...compositionBox.box, x: operation.to.x, y: operation.to.y },
          source: compositionBox.source === "created" ? "created" : "moved",
        });
      }
    }
    if (operation.op === "delete") {
      boxes.delete(operation.target);
    }
  }

  return [...boxes.values()];
}

function reviewPortraitConnectors(
  patch: CanvasPatch,
  boxes: CompositionBox[],
  context: CompositionContext,
  issues: string[],
) {
  const boxByRef = new Map(boxes.map(({ ref, box }) => [ref, box]));
  const connectors = collectConnectors(patch, boxByRef);
  const labelBoxes: Array<{ ref: string; box: NormalizedBox }> = [];

  for (const connector of connectors) {
    const crossedBox = boxes.find((candidate) =>
      !isEndpointOwnedBox(candidate, connector.endpointRefs) &&
      connector.segments.some(([start, end]) => segmentCrossesBoxInterior(start, end, candidate.box))
    );
    if (crossedBox) {
      issues.push(`${connector.ref} crosses unrelated node ${crossedBox.ref} in portrait layout`);
    }

    if (!connector.label) continue;
    const center = polylineMidpoint(connector.segments);
    if (!center) continue;
    const labelBox = connectorLabelBox(connector.label, center, context.bounds);
    const overlappedNode = boxes.find(({ ref, box, containerRef, kind }) =>
      !isBoundTextOfEndpoint({ ref, containerRef, kind }, connector.endpointRefs) &&
      boxesOverlap(labelBox, box)
    );
    if (overlappedNode) {
      issues.push(`${connector.ref} label overlaps node text in ${overlappedNode.ref} in portrait layout`);
    }
    const overlappedLabel = labelBoxes.find(({ box }) => boxesOverlap(labelBox, box));
    if (overlappedLabel) {
      issues.push(`${connector.ref} label overlaps connector label ${overlappedLabel.ref} in portrait layout`);
    }
    labelBoxes.push({ ref: connector.ref, box: labelBox });
  }
}

function isBoundTextPair(left: CompositionBox, right: CompositionBox) {
  return left.containerRef === right.ref || right.containerRef === left.ref;
}

function isBoundTextOfEndpoint(
  box: Pick<CompositionBox, "ref" | "kind" | "containerRef">,
  endpointRefs: ReadonlySet<string>,
) {
  return box.kind === "text" && box.containerRef !== undefined && endpointRefs.has(box.containerRef);
}

function isEndpointOwnedBox(
  box: Pick<CompositionBox, "ref" | "kind" | "containerRef">,
  endpointRefs: ReadonlySet<string>,
) {
  return endpointRefs.has(box.ref) || isBoundTextOfEndpoint(box, endpointRefs);
}

function collectConnectors(
  patch: CanvasPatch,
  boxByRef: ReadonlyMap<string, NormalizedBox>,
): Connector[] {
  return patch.operations.flatMap((operation): Connector[] => {
    if (operation.op === "connect") {
      const from = boxByRef.get(operation.from);
      const to = boxByRef.get(operation.to);
      if (!from || !to) return [];
      return [{
        ref: operation.ref,
        label: operation.label,
        segments: [[boxCenter(from), boxCenter(to)]],
        endpointRefs: new Set([operation.from, operation.to]),
      }];
    }
    if (operation.op !== "create" || operation.element.kind !== "arrow") return [];
    const arrow = operation.element;
    const endpointRefs = new Set(
      [...boxByRef]
        .filter(([, box]) =>
          pointInsideBox(arrow.points[0], box) || pointInsideBox(arrow.points.at(-1)!, box)
        )
        .map(([ref]) => ref),
    );
    return [{
      ref: operation.ref,
      label: arrow.label,
      segments: arrow.points.slice(1).map((point, index) => [
        arrow.points[index],
        point,
      ] as const),
      endpointRefs,
    }];
  });
}

function pointInsideBox(point: NormalizedPoint, box: NormalizedBox) {
  return point.x >= box.x && point.x <= box.x + box.width &&
    point.y >= box.y && point.y <= box.y + box.height;
}

function boxCenter(box: NormalizedBox): NormalizedPoint {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

function segmentCrossesBoxInterior(
  start: NormalizedPoint,
  end: NormalizedPoint,
  box: NormalizedBox,
) {
  const inset = 1;
  const left = box.x + inset;
  const right = box.x + box.width - inset;
  const top = box.y + inset;
  const bottom = box.y + box.height - inset;
  let minimum = 0;
  let maximum = 1;
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  for (const [direction, distance] of [
    [-dx, start.x - left],
    [dx, right - start.x],
    [-dy, start.y - top],
    [dy, bottom - start.y],
  ] as const) {
    if (direction === 0) {
      if (distance < 0) return false;
      continue;
    }
    const ratio = distance / direction;
    if (direction < 0) minimum = Math.max(minimum, ratio);
    else maximum = Math.min(maximum, ratio);
    if (minimum > maximum) return false;
  }
  return maximum > 0 && minimum < 1;
}

function polylineMidpoint(segments: Connector["segments"]): NormalizedPoint | undefined {
  const lengths = segments.map(([start, end]) => Math.hypot(end.x - start.x, end.y - start.y));
  const halfLength = lengths.reduce((total, length) => total + length, 0) / 2;
  let traversed = 0;

  for (let index = 0; index < segments.length; index += 1) {
    const [start, end] = segments[index];
    const length = lengths[index];
    if (traversed + length >= halfLength) {
      const ratio = length === 0 ? 0 : (halfLength - traversed) / length;
      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      };
    }
    traversed += length;
  }
  return segments.at(-1)?.[1];
}

function connectorLabelBox(
  label: string,
  center: NormalizedPoint,
  bounds: CompositionContext["bounds"],
): NormalizedBox {
  const width = Math.min(
    1000,
    Math.max(CONNECTOR_LABEL_FONT_SIZE * 2, label.length * CONNECTOR_LABEL_CHARACTER_WIDTH) *
      1000 / bounds.width,
  );
  const height = Math.min(1000, CONNECTOR_LABEL_LINE_HEIGHT * 1000 / bounds.height);
  return {
    x: center.x - width / 2,
    y: center.y - height / 2,
    width,
    height,
  };
}

function boxesOverlap(left: NormalizedBox, right: NormalizedBox) {
  return left.x < right.x + right.width && left.x + left.width > right.x &&
    left.y < right.y + right.height && left.y + left.height > right.y;
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
