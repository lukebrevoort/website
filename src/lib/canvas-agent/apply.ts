import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
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

    elements.set(arrow.id, {
      ...arrow,
      startBinding: { elementId: from.id, focus: 0, gap: 8 },
      endBinding: { elementId: to.id, focus: 0, gap: 8 },
    });
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
