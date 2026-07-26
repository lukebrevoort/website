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
  // Sketchbook ink + Excalidraw-style washes (ported from Dispatch #735 named fills).
  ink: { stroke: "#1e1e1e", fill: "#f4f0e7" },
  muted: { stroke: "#868e96", fill: "#e9ecef" },
  accent: { stroke: "#c83f2f", fill: "#ffc9c9" },
  info: { stroke: "#1971c2", fill: "#a5d8ff" },
  success: { stroke: "#2f9e44", fill: "#b2f2bb" },
  warning: { stroke: "#f08c00", fill: "#ffec99" },
  danger: { stroke: "#e03131", fill: "#ffc9c9" },
} as const;

// Excalifont — same handwriting family Dispatch #735 uses for agent ink.
const AGENT_FONT_FAMILY = 5;
const AGENT_LABEL_FONT_SIZE = 18;
const AGENT_TEXT_FONT_SIZE = 20;
const AGENT_LINE_HEIGHT = 1.25;
const AGENT_CHAR_WIDTH = AGENT_LABEL_FONT_SIZE * 0.55;
const BOUND_TEXT_PADDING = 5;
const PAD2 = BOUND_TEXT_PADDING * 2;
const MAX_AUTO_TEXT_WIDTH = 440;

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
            : {
                label: {
                  text: operation.label,
                  fontFamily: AGENT_FONT_FAMILY,
                  fontSize: 16,
                },
              }),
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
        : {
            label: {
              text: element.label,
              fontFamily: AGENT_FONT_FAMILY,
              fontSize: 16,
            },
          }),
      customData,
    };
  }

  if (element.kind === "freehand") {
    return compileFreehand(id, element.points, style, customData, context);
  }

  let box = normalizedBoxToScene(element.box, context);

  if (element.kind === "text") {
    const fitted = fitStandaloneText(element.text, box);
    return {
      id,
      type: "text",
      ...fitted.box,
      text: fitted.text,
      fontFamily: AGENT_FONT_FAMILY,
      fontSize: AGENT_TEXT_FONT_SIZE,
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

  // Bound labels: grow the container so text never clips (Dispatch #735 layoutBoundText).
  const labelText = "text" in element ? element.text : undefined;
  if (labelText) {
    box = fitBoundLabelBox(element.kind === "note" ? "rectangle" : element.kind, labelText, box);
  }

  return {
    id,
    type: element.kind === "note" ? "rectangle" : element.kind,
    ...box,
    roughness: 1,
    roundness: element.kind === "rectangle" || element.kind === "note" ? { type: 3 } : undefined,
    ...style,
    ...(labelText === undefined
      ? {}
      : {
          label: {
            text: wrapLabel(labelText, usableTextWidth(element.kind === "note" ? "rectangle" : element.kind, box.width)),
            fontFamily: AGENT_FONT_FAMILY,
            fontSize: AGENT_LABEL_FONT_SIZE,
            textAlign: "center",
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

/** Measure + wrap helpers adapted from Dispatch whiteboard-builder (#735). */
function measureText(text: string, fontSize = AGENT_LABEL_FONT_SIZE) {
  const charWidth = fontSize * 0.55;
  const lines = text.split("\n");
  const longest = Math.max(...lines.map((line) => line.length), 1);
  return {
    width: Math.ceil(longest * charWidth),
    height: Math.ceil(lines.length * fontSize * AGENT_LINE_HEIGHT),
  };
}

function usableTextWidth(kind: string, width: number) {
  if (kind === "ellipse") return Math.round(width / Math.SQRT2) - PAD2;
  if (kind === "diamond") return width / 2 - PAD2;
  return width - PAD2;
}

function usableTextHeight(kind: string, height: number) {
  if (kind === "ellipse") return Math.round(height / Math.SQRT2) - PAD2;
  if (kind === "diamond") return height / 2 - PAD2;
  return height - PAD2;
}

function containerWidthFor(kind: string, textWidth: number) {
  if (kind === "ellipse") return Math.round((textWidth + PAD2) * Math.SQRT2);
  if (kind === "diamond") return 2 * (textWidth + PAD2);
  return textWidth + PAD2;
}

function containerHeightFor(kind: string, textHeight: number) {
  if (kind === "ellipse") return Math.round((textHeight + PAD2) * Math.SQRT2);
  if (kind === "diamond") return 2 * (textHeight + PAD2);
  return textHeight + PAD2;
}

function longestWordWidth(text: string) {
  let max = 1;
  for (const word of text.split(/[\s\n]+/)) max = Math.max(max, word.length);
  return Math.ceil(max * AGENT_CHAR_WIDTH);
}

function wrapLabel(text: string, maxWidth: number) {
  const maxChars = Math.max(1, Math.floor(maxWidth / AGENT_CHAR_WIDTH));
  const out: string[] = [];
  for (const raw of text.split("\n")) {
    const words = raw.split(" ").filter((word) => word.length > 0);
    if (words.length === 0) {
      out.push("");
      continue;
    }
    let line = "";
    for (let word of words) {
      while (word.length > maxChars) {
        if (line) {
          out.push(line);
          line = "";
        }
        out.push(word.slice(0, maxChars));
        word = word.slice(maxChars);
      }
      if (!line) line = word;
      else if (line.length + 1 + word.length <= maxChars) line += ` ${word}`;
      else {
        out.push(line);
        line = word;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

function fitBoundLabelBox(
  kind: string,
  text: string,
  box: { x: number; y: number; width: number; height: number },
) {
  const fittedKinds = new Set(["rectangle", "ellipse", "diamond"]);
  if (!fittedKinds.has(kind)) return box;

  let width = box.width;
  let height = box.height;
  let maxW = usableTextWidth(kind, width);
  const wordW = Math.min(longestWordWidth(text), MAX_AUTO_TEXT_WIDTH);
  if (wordW > maxW) {
    maxW = wordW;
    width = containerWidthFor(kind, wordW);
  }
  const wrapped = wrapLabel(text, maxW);
  const size = measureText(wrapped);
  if (size.height > usableTextHeight(kind, height)) {
    height = containerHeightFor(kind, size.height);
  }
  return { ...box, width: round(width), height: round(height) };
}

function fitStandaloneText(
  text: string,
  box: { x: number; y: number; width: number; height: number },
) {
  const maxW = Math.max(box.width - PAD2, AGENT_CHAR_WIDTH);
  const wrapped = wrapLabel(text, maxW);
  const size = measureText(wrapped, AGENT_TEXT_FONT_SIZE);
  return {
    text: wrapped,
    box: {
      ...box,
      width: round(Math.max(box.width, size.width + PAD2)),
      height: round(Math.max(box.height, size.height + PAD2)),
    },
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
