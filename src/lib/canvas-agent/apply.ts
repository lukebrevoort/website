import type {
  ExcalidrawElement,
  ExcalidrawLinearElement,
} from "@excalidraw/excalidraw/element/types";
import type { CompiledCanvasPatch, CompiledElementUpdate } from "./compiler";

export function applyCompiledPatchToElements(
  sceneElements: readonly ExcalidrawElement[],
  createdElements: readonly ExcalidrawElement[],
  compiled: CompiledCanvasPatch,
): ExcalidrawElement[] {
  const elements = new Map(
    [...sceneElements, ...createdElements].map((element) => [element.id, element]),
  );

  for (const update of compiled.updates) {
    const element = elements.get(update.elementId);
    if (!element) continue;

    elements.set(update.elementId, applyElementUpdate(element, update));

    if (update.text !== undefined && element.type !== "text") {
      const boundTextId = element.boundElements?.find((bound) => bound.type === "text")?.id;
      const boundText = boundTextId ? elements.get(boundTextId) : undefined;
      if (boundText?.type === "text") {
        elements.set(boundText.id, {
          ...boundText,
          text: update.text,
          originalText: update.text,
        });
      }
    }
  }

  for (const group of compiled.groups) {
    for (const elementId of group.elementIds) {
      const element = elements.get(elementId);
      if (!element) continue;
      elements.set(elementId, {
        ...element,
        groupIds: [group.groupId, ...element.groupIds.filter((id) => id !== group.groupId)],
      });
    }
  }

  for (const connection of compiled.connections) {
    const arrow = elements.get(connection.arrowId);
    const from = elements.get(connection.fromElementId);
    const to = elements.get(connection.toElementId);
    if (arrow?.type !== "arrow" || !from || !to) continue;

    elements.set(arrow.id, alignBoundArrow(arrow, from, to));
    elements.set(from.id, addBoundArrow(from, arrow.id));
    elements.set(to.id, addBoundArrow(to, arrow.id));
  }

  for (const elementId of compiled.deleteElementIds) {
    const element = elements.get(elementId);
    if (!element) continue;
    elements.set(elementId, { ...element, isDeleted: true });

    for (const bound of element.boundElements ?? []) {
      if (bound.type !== "text") continue;
      const boundText = elements.get(bound.id);
      if (boundText) elements.set(bound.id, { ...boundText, isDeleted: true });
    }
  }

  return [...elements.values()];
}

const ARROW_BINDING_GAP = 8;

/**
 * Excalidraw stores arrow bindings separately from the arrow's points. When a
 * binding is added programmatically, Excalidraw does not reconcile those
 * points until an endpoint is moved. Start with edge-aligned geometry so the
 * first rendered frame matches the geometry Excalidraw maintains after a drag.
 */
function alignBoundArrow(
  arrow: ExcalidrawLinearElement,
  from: ExcalidrawElement,
  to: ExcalidrawElement,
): ExcalidrawElement {
  const fromCenter = elementCenter(from);
  const toCenter = elementCenter(to);
  if (!fromCenter || !toCenter) {
    return {
      ...arrow,
      startBinding: { elementId: from.id, focus: 0, gap: ARROW_BINDING_GAP },
      endBinding: { elementId: to.id, focus: 0, gap: ARROW_BINDING_GAP },
    };
  }

  const distance = Math.hypot(toCenter.x - fromCenter.x, toCenter.y - fromCenter.y);
  if (distance === 0) {
    return {
      ...arrow,
      startBinding: { elementId: from.id, focus: 0, gap: ARROW_BINDING_GAP },
      endBinding: { elementId: to.id, focus: 0, gap: ARROW_BINDING_GAP },
    };
  }

  const direction = {
    x: (toCenter.x - fromCenter.x) / distance,
    y: (toCenter.y - fromCenter.y) / distance,
  };
  const fromEdge = rayIntersection(from, fromCenter, direction);
  const toEdge = rayIntersection(to, toCenter, { x: -direction.x, y: -direction.y });
  const availableGap = Math.max(
    0,
    Math.hypot(toEdge.x - fromEdge.x, toEdge.y - fromEdge.y) / 3,
  );
  const gap = Math.min(ARROW_BINDING_GAP, availableGap);
  const start = {
    x: fromEdge.x + direction.x * gap,
    y: fromEdge.y + direction.y * gap,
  };
  const end = {
    x: toEdge.x - direction.x * gap,
    y: toEdge.y - direction.y * gap,
  };
  const endPoint = [roundCoordinate(end.x - start.x), roundCoordinate(end.y - start.y)] as const;

  return {
    ...arrow,
    x: roundCoordinate(start.x),
    y: roundCoordinate(start.y),
    width: Math.abs(endPoint[0]),
    height: Math.abs(endPoint[1]),
    points: [[0, 0], endPoint],
    startBinding: { elementId: from.id, focus: 0, gap },
    endBinding: { elementId: to.id, focus: 0, gap },
  };
}

function elementCenter(element: ExcalidrawElement) {
  if (![element.x, element.y, element.width, element.height].every(Number.isFinite)) return null;
  return {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };
}

function rayIntersection(
  element: ExcalidrawElement,
  center: { x: number; y: number },
  direction: { x: number; y: number },
) {
  const halfWidth = Math.max(element.width / 2, 1);
  const halfHeight = Math.max(element.height / 2, 1);
  let distance: number;

  if (element.type === "ellipse") {
    distance = 1 / Math.sqrt(
      (direction.x * direction.x) / (halfWidth * halfWidth) +
        (direction.y * direction.y) / (halfHeight * halfHeight),
    );
  } else if (element.type === "diamond") {
    distance = 1 / (
      Math.abs(direction.x) / halfWidth + Math.abs(direction.y) / halfHeight
    );
  } else {
    distance = 1 / Math.max(
      Math.abs(direction.x) / halfWidth,
      Math.abs(direction.y) / halfHeight,
    );
  }

  return {
    x: center.x + direction.x * distance,
    y: center.y + direction.y * distance,
  };
}

function roundCoordinate(value: number) {
  return Math.round(value * 100) / 100;
}

function addBoundArrow(element: ExcalidrawElement, arrowId: string): ExcalidrawElement {
  if (element.boundElements?.some((bound) => bound.id === arrowId)) return element;
  return {
    ...element,
    boundElements: [...(element.boundElements ?? []), { id: arrowId, type: "arrow" }],
  };
}

function applyElementUpdate(
  element: ExcalidrawElement,
  update: CompiledElementUpdate,
): ExcalidrawElement {
  const next = {
    ...element,
    ...(update.x === undefined ? {} : { x: update.x }),
    ...(update.y === undefined ? {} : { y: update.y }),
    ...(update.style === undefined ? {} : update.style),
  } as ExcalidrawElement;

  if (update.text !== undefined && next.type === "text") {
    return {
      ...next,
      text: update.text,
      originalText: update.text,
    };
  }

  return next;
}
