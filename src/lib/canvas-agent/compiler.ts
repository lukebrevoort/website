import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import type { ExcalidrawFreeDrawElement } from "@excalidraw/excalidraw/element/types";
import type {
  CanvasElementRef,
  CanvasElementSpec,
  CanvasPatch,
  CanvasStyle,
  NewCanvasElementRef,
  NormalizedBox,
  NormalizedPoint,
} from "./contract";
import type { CanvasPatchContext, CanvasPatchRisk } from "./validation";

type CompiledStyle = {
  strokeColor: string;
  backgroundColor: string;
  fillStyle: "solid" | "hachure";
  strokeStyle: "solid" | "dashed" | "dotted";
  strokeWidth: number;
  opacity: number;
};

export type CompiledElementUpdate = {
  elementId: string;
  x?: number;
  y?: number;
  text?: string;
  style?: CompiledStyle;
};

export type CompiledElementGroup = {
  groupId: string;
  elementIds: string[];
};

export type CompiledElementConnection = {
  arrowId: string;
  fromElementId: string;
  toElementId: string;
};

export type CompiledCanvasPatch = {
  patchKey: string;
  createElements: ExcalidrawElementSkeleton[];
  updates: CompiledElementUpdate[];
  groups: CompiledElementGroup[];
  connections: CompiledElementConnection[];
  deleteElementIds: string[];
  elementIdsByRef: Record<string, string>;
  risk: CanvasPatchRisk;
};

type ResolvedElement = {
  id: string;
  kind: CanvasElementSpec["kind"];
  box: NormalizedBox;
};

const THEME_COLORS = {
  ink: { stroke: "#20201d", fill: "#f4f0e7" },
  muted: { stroke: "#6f6a61", fill: "#ebe6dc" },
  accent: { stroke: "#c83f2f", fill: "#fee2e2" },
  info: { stroke: "#1d4ed8", fill: "#dbeafe" },
  success: { stroke: "#047857", fill: "#d1fae5" },
  warning: { stroke: "#a16207", fill: "#fef3c7" },
  danger: { stroke: "#b91c1c", fill: "#fee2e2" },
} as const;

export function compileCanvasPatch(
  patch: CanvasPatch,
  context: CanvasPatchContext,
  risk: CanvasPatchRisk,
): CompiledCanvasPatch {
  const patchKey = stableId("canvas-patch", JSON.stringify(patch));
  const resolved = new Map<CanvasElementRef, ResolvedElement>(
    context.elements.map((element) => [
      element.ref,
      { id: element.elementId, kind: element.kind, box: element.box },
    ]),
  );
  const createElements: ExcalidrawElementSkeleton[] = [];
  const updates: CompiledElementUpdate[] = [];
  const groups: CompiledElementGroup[] = [];
  const connections: CompiledElementConnection[] = [];
  const deleteElementIds: string[] = [];
  const elementIdsByRef: Record<string, string> = Object.fromEntries(
    [...resolved].map(([ref, value]) => [ref, value.id]),
  );

  patch.operations.forEach((operation) => {
    switch (operation.op) {
      case "create": {
        const id = stableId(patchKey, operation.ref);
        const compiled = compileCreateElement(id, operation.ref, operation.element, context);
        createElements.push(compiled);
        const box = getElementBox(operation.element);
        resolved.set(operation.ref, { id, kind: operation.element.kind, box });
        elementIdsByRef[operation.ref] = id;
        break;
      }
      case "update": {
        const target = requireResolved(operation.target, resolved);
        updates.push({
          elementId: target.id,
          ...(operation.text === undefined ? {} : { text: operation.text }),
          ...(operation.style === undefined ? {} : { style: compileStyle(operation.style) }),
        });
        break;
      }
      case "move": {
        const target = requireResolved(operation.target, resolved);
        const position = normalizedToScene(operation.to, context);
        updates.push({ elementId: target.id, x: position.x, y: position.y });
        resolved.set(operation.target, {
          ...target,
          box: { ...target.box, x: operation.to.x, y: operation.to.y },
        });
        break;
      }
      case "group": {
        groups.push({
          groupId: stableId(patchKey, operation.groupRef),
          elementIds: operation.members.map((ref) => requireResolved(ref, resolved).id),
        });
        break;
      }
      case "connect": {
        const from = requireResolved(operation.from, resolved);
        const to = requireResolved(operation.to, resolved);
        const id = stableId(patchKey, operation.ref);
        const start = boxCenter(from.box);
        const end = boxCenter(to.box);
        const startScene = normalizedToScene(start, context);
        const endScene = normalizedToScene(end, context);
        const style = compileStyle(operation.style);

        createElements.push({
          id,
          type: "arrow",
          x: startScene.x,
          y: startScene.y,
          width: round(endScene.x - startScene.x),
          height: round(endScene.y - startScene.y),
          points: [[0, 0], [round(endScene.x - startScene.x), round(endScene.y - startScene.y)]],
          endArrowhead: "arrow",
          roughness: 1,
          ...style,
          ...(operation.label === undefined
            ? {}
            : { label: { text: operation.label, fontFamily: 1, fontSize: 16 } }),
          customData: { canvasAgentRef: operation.ref, canvasAgentPatch: patchKey },
        });
        connections.push({
          arrowId: id,
          fromElementId: from.id,
          toElementId: to.id,
        });

        const box = pointsBox([start, end]);
        resolved.set(operation.ref, { id, kind: "arrow", box });
        elementIdsByRef[operation.ref] = id;
        break;
      }
      case "delete":
        deleteElementIds.push(requireResolved(operation.target, resolved).id);
        break;
      default:
        operation satisfies never;
    }

  });

  return {
    patchKey,
    createElements,
    updates,
    groups,
    connections,
    deleteElementIds,
    elementIdsByRef,
    risk,
  };
}

function compileCreateElement(
  id: string,
  ref: NewCanvasElementRef,
  element: CanvasElementSpec,
  context: CanvasPatchContext,
): ExcalidrawElementSkeleton {
  const style = compileStyle(element.style, element.kind === "note" ? "warning" : "ink");
  const customData = { canvasAgentRef: ref, origin: "agent", canvasAgentVersion: 1 };

  if (element.kind === "arrow") {
    const [first, ...remaining] = element.points;
    const origin = normalizedToScene(first, context);
    const points = [first, ...remaining].map((point) => {
      const scene = normalizedToScene(point, context);
      return [round(scene.x - origin.x), round(scene.y - origin.y)] as [number, number];
    });
    return {
      id,
      type: "arrow",
      x: origin.x,
      y: origin.y,
      points,
      endArrowhead: "arrow",
      roughness: 1,
      ...style,
      ...(element.label === undefined
        ? {}
        : { label: { text: element.label, fontFamily: 1, fontSize: 16 } }),
      customData,
    };
  }

  if (element.kind === "freehand") {
    return compileFreehand(id, element.points, style, customData, context);
  }

  const box = normalizedBoxToScene(element.box, context);

  if (element.kind === "text") {
    return {
      id,
      type: "text",
      ...box,
      text: element.text,
      fontFamily: 1,
      fontSize: 18,
      textAlign: "left",
      verticalAlign: "top",
      strokeColor: style.strokeColor,
      opacity: style.opacity,
      customData,
    };
  }

  if (element.kind === "frame") {
    return {
      id,
      type: "frame",
      ...box,
      children: [],
      name: element.label,
      roughness: 1,
      ...style,
      customData,
    };
  }

  return {
    id,
    type: element.kind === "note" ? "rectangle" : element.kind,
    ...box,
    roughness: 1,
    roundness: element.kind === "rectangle" || element.kind === "note" ? { type: 3 } : undefined,
    ...style,
    ...(element.text === undefined
      ? {}
      : {
          label: {
            text: element.text,
            fontFamily: 1,
            fontSize: 17,
            textAlign: "left",
            verticalAlign: "middle",
          },
        }),
    customData,
  };
}

function compileFreehand(
  id: string,
  normalizedPoints: readonly NormalizedPoint[],
  style: CompiledStyle,
  customData: Record<string, unknown>,
  context: CanvasPatchContext,
): ExcalidrawElementSkeleton {
  const scenePoints = normalizedPoints.map((point) => normalizedToScene(point, context));
  const minX = Math.min(...scenePoints.map((point) => point.x));
  const minY = Math.min(...scenePoints.map((point) => point.y));
  const maxX = Math.max(...scenePoints.map((point) => point.x));
  const maxY = Math.max(...scenePoints.map((point) => point.y));
  const seed = stableHash(id) || 1;

  const freehand = {
    id,
    type: "freedraw",
    x: round(minX),
    y: round(minY),
    width: round(Math.max(1, maxX - minX)),
    height: round(Math.max(1, maxY - minY)),
    points: scenePoints.map((point) => [round(point.x - minX), round(point.y - minY)]),
    pressures: [],
    simulatePressure: true,
    lastCommittedPoint: null,
    strokeColor: style.strokeColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: style.strokeWidth,
    strokeStyle: style.strokeStyle,
    roundness: null,
    roughness: 1,
    opacity: style.opacity,
    angle: 0,
    seed,
    version: 1,
    versionNonce: seed,
    index: null,
    isDeleted: false,
    groupIds: [],
    frameId: null,
    boundElements: null,
    updated: 0,
    link: null,
    locked: false,
    customData,
  } as unknown as ExcalidrawFreeDrawElement;

  return freehand;
}

function compileStyle(style?: CanvasStyle, defaultTheme: keyof typeof THEME_COLORS = "ink"): CompiledStyle {
  const theme = THEME_COLORS[style?.theme ?? defaultTheme];
  return {
    strokeColor: theme.stroke,
    backgroundColor: style?.fill === "transparent" ? "transparent" : theme.fill,
    fillStyle: style?.fill === "hachure" ? "hachure" : "solid",
    strokeStyle: style?.stroke ?? "solid",
    strokeWidth: style?.weight === "thin" ? 1 : style?.weight === "bold" ? 4 : 2,
    opacity: style?.opacity ?? 100,
  };
}

function requireResolved(
  ref: CanvasElementRef,
  resolved: ReadonlyMap<CanvasElementRef, ResolvedElement>,
): ResolvedElement {
  const element = resolved.get(ref);
  if (!element) throw new Error(`Canvas patch referenced unresolved element ${ref}`);
  return element;
}

function getElementBox(element: CanvasElementSpec): NormalizedBox {
  return "box" in element ? element.box : pointsBox(element.points);
}

function pointsBox(points: readonly NormalizedPoint[]): NormalizedBox {
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(...points.map((point) => point.x));
  const maxY = Math.max(...points.map((point) => point.y));
  return {
    x: minX,
    y: minY,
    width: Math.max(10, maxX - minX),
    height: Math.max(10, maxY - minY),
  };
}

function boxCenter(box: NormalizedBox): NormalizedPoint {
  return {
    x: Math.round(box.x + box.width / 2),
    y: Math.round(box.y + box.height / 2),
  };
}

function normalizedBoxToScene(box: NormalizedBox, context: CanvasPatchContext) {
  const topLeft = normalizedToScene({ x: box.x, y: box.y }, context);
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: round((box.width / 1000) * context.bounds.width),
    height: round((box.height / 1000) * context.bounds.height),
  };
}

function normalizedToScene(point: NormalizedPoint, context: CanvasPatchContext) {
  return {
    x: round(context.bounds.x + (point.x / 1000) * context.bounds.width),
    y: round(context.bounds.y + (point.y / 1000) * context.bounds.height),
  };
}

function stableId(namespace: string, value: string): string {
  return `agent-${stableHash(`${namespace}:${value}`).toString(36)}`;
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
