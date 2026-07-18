import { NORMALIZED_CANVAS_SIZE } from "../contract";

export function normalizeCanvasPatchCandidate(input: unknown): unknown {
  if (!isRecord(input) || !Array.isArray(input.operations)) return input;

  const declaredRefs = new Set<string>();

  return {
    ...input,
    operations: input.operations.map((operation) => {
      const normalized = normalizeOperation(operation);
      return normalizeDeclaredRef(normalized, declaredRefs);
    }),
  };
}

function normalizeDeclaredRef(input: unknown, declaredRefs: Set<string>): unknown {
  if (!isRecord(input)) return input;
  const field = input.op === "group" ? "groupRef" :
    input.op === "create" || input.op === "connect" ? "ref" : null;
  if (!field || typeof input[field] !== "string") return input;

  const ref = input[field];
  if (!ref.startsWith("new:") || !declaredRefs.has(ref)) {
    declaredRefs.add(ref);
    return input;
  }

  const alias = ref.slice(4);
  let suffix = 2;
  let uniqueRef = ref;
  do {
    const suffixText = `-${suffix}`;
    uniqueRef = `new:${alias.slice(0, 64 - suffixText.length)}${suffixText}`;
    suffix += 1;
  } while (declaredRefs.has(uniqueRef));

  declaredRefs.add(uniqueRef);
  return { ...input, [field]: uniqueRef };
}

function normalizeOperation(input: unknown): unknown {
  if (!isRecord(input)) return input;
  const operation = { ...input };

  if (operation.op === "create" && isRecord(operation.element)) {
    operation.element = normalizeElement(operation.element);
  }
  if (operation.op === "move" && isRecord(operation.to)) {
    operation.to = normalizePoint(operation.to);
  }

  return operation;
}

function normalizeElement(input: Record<string, unknown>) {
  const element = { ...input };
  if (isRecord(element.box)) element.box = normalizeBox(element.box);
  if (Array.isArray(element.points)) {
    element.points = element.points.map((point) => isRecord(point) ? normalizePoint(point) : point);
  }
  return element;
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
