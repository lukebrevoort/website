import { NORMALIZED_CANVAS_SIZE } from "../contract";

export function normalizeCanvasPatchCandidate(input: unknown): unknown {
  if (!isRecord(input) || !Array.isArray(input.operations)) return input;

  return pruneNullValues({
    ...input,
    operations: input.operations.map((operation) => {
      return normalizeOperation(operation);
    }),
  });
}

function normalizeOperation(input: unknown): unknown {
  if (!isRecord(input)) return input;
  const operation = { ...input };

  if (operation.op === "connect" && typeof operation.from !== "string" && typeof operation.target === "string") {
    operation.from = operation.target;
  }
  if (operation.op === "connect" && typeof operation.connectionTo === "string") {
    operation.to = operation.connectionTo;
    delete operation.connectionTo;
  }
  if (operation.op === "create" && isRecord(operation.element)) {
    operation.element = normalizeElement(operation.element);
  }
  if (operation.op === "move" && isRecord(operation.to)) {
    operation.to = normalizePoint(operation.to);
  }

  return sanitizeOperation(operation);
}

function normalizeElement(input: Record<string, unknown>) {
  const element = { ...input };
  if (isRecord(element.box)) element.box = normalizeBox(element.box);
  if (Array.isArray(element.points)) {
    element.points = element.points.map((point) => isRecord(point) ? normalizePoint(point) : point);
  }
  return sanitizeElement(element);
}

function sanitizeOperation(operation: Record<string, unknown>): unknown {
  switch (operation.op) {
    case "create":
      return pick(operation, ["op", "ref", "element"]);
    case "update":
      return pick(operation, ["op", "target", "text", "style"]);
    case "move":
      return pick(operation, ["op", "target", "to"]);
    case "group":
      return pick(operation, ["op", "groupRef", "members"]);
    case "connect":
      return pick(operation, ["op", "ref", "from", "to", "label", "style"]);
    case "delete":
      return pick(operation, ["op", "target", "reason"]);
    default:
      return operation;
  }
}

function sanitizeElement(element: Record<string, unknown>): unknown {
  switch (element.kind) {
    case "note":
    case "rectangle":
    case "ellipse":
    case "text":
      return pick(element, ["kind", "box", "text", "style"]);
    case "frame":
      return pick(element, ["kind", "box", "label", "style"]);
    case "arrow":
      return pick(element, ["kind", "points", "label", "style"]);
    case "freehand":
      return pick(element, ["kind", "points", "style"]);
    default:
      return element;
  }
}

function pick(input: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  return Object.fromEntries(keys.flatMap((key) =>
    Object.hasOwn(input, key) ? [[key, sanitizeNestedValue(key, input[key])]] : [],
  ));
}

function sanitizeNestedValue(key: string, value: unknown): unknown {
  if (key !== "style" || !isRecord(value)) return value;
  return pick(value, ["theme", "fill", "stroke", "weight", "opacity"]);
}

function normalizeBox(input: Record<string, unknown>) {
  if (![input.x, input.y, input.width, input.height].every(isFiniteNumber)) return input;
  const x = clamp(Math.round(input.x as number), 0, NORMALIZED_CANVAS_SIZE - 10);
  const y = clamp(Math.round(input.y as number), 0, NORMALIZED_CANVAS_SIZE - 10);
  return {
    ...input,
    x,
    y,
    width: clamp(Math.round(input.width as number), 10, NORMALIZED_CANVAS_SIZE - x),
    height: clamp(Math.round(input.height as number), 10, NORMALIZED_CANVAS_SIZE - y),
  };
}

function normalizePoint(input: Record<string, unknown>) {
  if (!isFiniteNumber(input.x) || !isFiniteNumber(input.y)) return input;
  return {
    ...input,
    x: clamp(Math.round(input.x), 0, NORMALIZED_CANVAS_SIZE),
    y: clamp(Math.round(input.y), 0, NORMALIZED_CANVAS_SIZE),
  };
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isFiniteNumber(input: unknown): input is number {
  return typeof input === "number" && Number.isFinite(input);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function pruneNullValues(input: unknown): unknown {
  if (Array.isArray(input)) return input.map(pruneNullValues);
  if (!isRecord(input)) return input;

  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) =>
      value === null ? [] : [[key, pruneNullValues(value)]],
    ),
  );
}
