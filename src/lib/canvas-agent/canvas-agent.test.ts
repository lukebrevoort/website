import assert from "node:assert/strict";
import test from "node:test";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  applyCompiledPatchToElements,
  canvasPatchJsonSchema,
  compileCanvasPatch,
  validateCanvasPatch,
  type CanvasPatch,
  type CanvasPatchContext,
} from "./index";

const context: CanvasPatchContext = {
  sceneVersion: "scene-v1",
  bounds: { x: 100, y: 200, width: 2_000, height: 1_000 },
  elements: [
    {
      ref: "existing:controller",
      elementId: "controller-id",
      kind: "rectangle",
      box: { x: 50, y: 100, width: 180, height: 120 },
      origin: "agent",
    },
    {
      ref: "existing:visitor-note",
      elementId: "visitor-note-id",
      kind: "note",
      box: { x: 700, y: 650, width: 180, height: 120 },
      origin: "visitor",
    },
  ],
};

const validPatch = {
  version: "1",
  baseSceneVersion: "scene-v1",
  summary: "Add and connect a policy gate",
  operations: [
    {
      op: "create",
      ref: "new:policy-gate",
      element: {
        kind: "note",
        box: { x: 350, y: 220, width: 220, height: 150 },
        text: "Policy gate",
        style: { theme: "warning", fill: "solid", weight: "bold" },
      },
    },
    {
      op: "connect",
      ref: "new:controller-policy-arrow",
      from: "existing:controller",
      to: "new:policy-gate",
      label: "checks scope",
      style: { theme: "success", stroke: "dashed" },
    },
    {
      op: "update",
      target: "new:policy-gate",
      text: "Policy gate\ncredentials · scope · approval",
    },
    {
      op: "move",
      target: "new:policy-gate",
      to: { x: 400, y: 250 },
    },
    {
      op: "group",
      groupRef: "new:policy-cluster",
      members: ["new:policy-gate", "new:controller-policy-arrow"],
    },
    {
      op: "create",
      ref: "new:underline",
      element: {
        kind: "freehand",
        points: [
          { x: 420, y: 420 },
          { x: 480, y: 430 },
          { x: 540, y: 418 },
        ],
        style: { theme: "accent", weight: "bold" },
      },
    },
  ],
} satisfies CanvasPatch;

test("exports a provider-compatible JSON schema", () => {
  assert.equal(canvasPatchJsonSchema.type, "object");
  assert.ok(canvasPatchJsonSchema.properties);
});

test("validates a complete semantic patch", () => {
  const result = validateCanvasPatch(validPatch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.risk.requiresConfirmation, false);
});

test("rejects unknown fields and out-of-bounds boxes at runtime", () => {
  const malformed = clone(validPatch);
  Object.assign(malformed.operations[0], { surprise: true });
  Object.assign((malformed.operations[0] as { element: { box: object } }).element.box, {
    x: 900,
    width: 200,
  });

  const result = validateCanvasPatch(malformed, context);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.issues.some((issue) => issue.includes("Unrecognized key")));
  assert.ok(result.issues.some((issue) => issue.includes("normalized canvas width")));
});

test("rejects references before they are available", () => {
  const patch = clone(validPatch) as unknown as {
    operations: Array<Record<string, unknown>>;
  };
  patch.operations[1] = {
    op: "connect",
    ref: "new:bad-arrow",
    from: "existing:controller",
    to: "new:not-created",
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.issues.includes("operations[1] references unavailable element new:not-created"));
});

test("rejects duplicate model-authored aliases", () => {
  const patch = clone(validPatch) as unknown as {
    operations: Array<Record<string, unknown>>;
  };
  patch.operations[5].ref = "new:policy-gate";

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.issues.includes("operations[5] declares duplicate ref new:policy-gate"));
});

test("fails closed when duplicate refs are later used by connect and group operations", () => {
  const patch: CanvasPatch = {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Reject ambiguous aliases",
    operations: [
      {
        op: "create",
        ref: "new:ambiguous",
        element: { kind: "rectangle", box: { x: 260, y: 200, width: 180, height: 100 } },
      },
      {
        op: "create",
        ref: "new:ambiguous",
        element: { kind: "rectangle", box: { x: 520, y: 200, width: 180, height: 100 } },
      },
      {
        op: "connect",
        ref: "new:ambiguous-arrow",
        from: "new:ambiguous",
        to: "existing:controller",
      },
      {
        op: "group",
        groupRef: "new:ambiguous-group",
        members: ["new:ambiguous", "new:ambiguous-arrow"],
      },
    ],
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.issues.includes("operations[1] declares duplicate ref new:ambiguous"));
});

test("requires confirmation for deletes and visitor-authored changes", () => {
  const patch: CanvasPatch = {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Remove the visitor note",
    operations: [
      {
        op: "delete",
        target: "existing:visitor-note",
        reason: "The visitor explicitly asked to remove it",
      },
    ],
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value.risk.reasons, ["delete", "visitor-authored-change"]);
  assert.equal(result.value.risk.requiresConfirmation, true);
});

test("requires confirmation for stale or unusually large patches", () => {
  const patch: CanvasPatch = {
    version: "1",
    baseSceneVersion: "older-scene",
    summary: "Fill the board",
    operations: [
      {
        op: "create",
        ref: "new:large-one",
        element: { kind: "rectangle", box: { x: 0, y: 0, width: 700, height: 700 } },
      },
      {
        op: "create",
        ref: "new:large-two",
        element: { kind: "ellipse", box: { x: 200, y: 200, width: 700, height: 700 } },
      },
    ],
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value.risk.reasons, ["stale-scene", "large-created-area"]);
});

test("compiles the same patch deterministically into scene coordinates", () => {
  const result = validateCanvasPatch(validPatch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const first = compileCanvasPatch(result.value.patch, context, result.value.risk);
  const second = compileCanvasPatch(result.value.patch, context, result.value.risk);

  assert.deepEqual(first, second);
  assert.equal(first.createElements.length, 3);
  assert.equal(first.groups.length, 1);
  assert.equal(first.connections.length, 1);
  assert.equal(first.deleteElementIds.length, 0);
  assert.equal(first.elementIdsByRef["existing:controller"], "controller-id");
  assert.match(first.elementIdsByRef["new:policy-gate"], /^agent-/);

  const note = first.createElements[0];
  assert.equal(note.x, 800);
  assert.equal(note.y, 420);
  assert.equal(note.width, 440);
  assert.equal(note.height, 150);
  assert.equal(
    "label" in note && note.label && "fontFamily" in note.label ? note.label.fontFamily : undefined,
    5,
  );
});

test("grows cramped labeled boxes so text fits (Dispatch #735 layout)", () => {
  const patch: CanvasPatch = {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Tiny box with a long label",
    operations: [
      {
        op: "create",
        ref: "new:cramped",
        element: {
          kind: "rectangle",
          box: { x: 100, y: 100, width: 40, height: 30 },
          text: "Authentication gateway\ncredentials · scope · approval",
          style: { theme: "ink", fill: "hachure" },
        },
      },
    ],
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const compiled = compileCanvasPatch(result.value.patch, context, result.value.risk);
  const box = compiled.createElements[0];
  assert.ok((box.width ?? 0) > 80, "box should auto-grow wider for long words");
  assert.ok((box.height ?? 0) > 30, "box should auto-grow taller for wrapped lines");
  assert.equal(
    "label" in box && box.label && "textAlign" in box.label ? box.label.textAlign : undefined,
    "center",
  );
});

test("compiles every supported create element kind", () => {
  const patch: CanvasPatch = {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Exercise the element vocabulary",
    operations: [
      {
        op: "create",
        ref: "new:text",
        element: { kind: "text", box: { x: 10, y: 10, width: 150, height: 60 }, text: "Heading" },
      },
      {
        op: "create",
        ref: "new:rectangle",
        element: { kind: "rectangle", box: { x: 200, y: 10, width: 150, height: 100 } },
      },
      {
        op: "create",
        ref: "new:ellipse",
        element: { kind: "ellipse", box: { x: 400, y: 10, width: 150, height: 100 } },
      },
      {
        op: "create",
        ref: "new:frame",
        element: { kind: "frame", box: { x: 10, y: 200, width: 500, height: 300 }, label: "System" },
      },
      {
        op: "create",
        ref: "new:arrow",
        element: { kind: "arrow", points: [{ x: 100, y: 600 }, { x: 450, y: 700 }] },
      },
    ],
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const compiled = compileCanvasPatch(result.value.patch, context, result.value.risk);
  assert.deepEqual(
    compiled.createElements.map((element) => element.type),
    ["text", "rectangle", "ellipse", "frame", "arrow"],
  );
});

test("applies connection bindings to existing and created elements", () => {
  const result = validateCanvasPatch(validPatch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const compiled = compileCanvasPatch(result.value.patch, context, result.value.risk);
  const policyId = compiled.elementIdsByRef["new:policy-gate"];
  const arrowId = compiled.elementIdsByRef["new:controller-policy-arrow"];
  const scene = [fakeElement("controller-id", "rectangle")];
  const created = [
    fakeElement(policyId, "rectangle"),
    fakeElement(arrowId, "arrow"),
    fakeElement(compiled.elementIdsByRef["new:underline"], "freedraw"),
  ];

  const applied = applyCompiledPatchToElements(scene, created, compiled);
  const arrow = applied.find((element) => element.id === arrowId);
  const controller = applied.find((element) => element.id === "controller-id");
  const policy = applied.find((element) => element.id === policyId);

  assert.equal(arrow?.type, "arrow");
  if (arrow?.type === "arrow") {
    assert.equal(arrow.startBinding?.elementId, "controller-id");
    assert.equal(arrow.endBinding?.elementId, policyId);
  }
  assert.ok(controller?.boundElements?.some((bound) => bound.id === arrowId));
  assert.ok(policy?.boundElements?.some((bound) => bound.id === arrowId));
});

test("aligns programmatic connection points to node edges before first render", () => {
  const result = validateCanvasPatch(validPatch, context);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const compiled = compileCanvasPatch(result.value.patch, context, result.value.risk);
  const policyId = compiled.elementIdsByRef["new:policy-gate"];
  const arrowId = compiled.elementIdsByRef["new:controller-policy-arrow"];
  const scene = [fakeBox("controller-id", "rectangle", 200, 300, 360, 120)];
  // The policy node is moved by the patch before its connection is applied.
  const created = [
    fakeBox(policyId, "rectangle", 800, 420, 440, 150),
    fakeArrow(arrowId, 380, 360, [0, 0], [640, 135]),
  ];

  const applied = applyCompiledPatchToElements(scene, created, compiled);
  const arrow = applied.find((element) => element.id === arrowId);
  assert.equal(arrow?.type, "arrow");
  if (arrow?.type !== "arrow") return;

  const controllerRightEdge = 560;
  const movedPolicyLeftEdge = 900;
  const start = { x: arrow.x + arrow.points[0][0], y: arrow.y + arrow.points[0][1] };
  const endPoint = arrow.points.at(-1)!;
  const end = { x: arrow.x + endPoint[0], y: arrow.y + endPoint[1] };

  assert.ok(start.x > controllerRightEdge, "start should sit outside the source edge");
  assert.ok(end.x < movedPolicyLeftEdge, "end should sit outside the destination edge");
  assert.equal(arrow.startBinding?.gap, 8);
  assert.equal(arrow.endBinding?.gap, 8);
});

test("rejects patches that exceed the aggregate text budget", () => {
  const patch: CanvasPatch = {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Oversized text",
    operations: Array.from({ length: 6 }, (_, index) => ({
      op: "update" as const,
      target: "existing:controller" as const,
      text: `${index}${"x".repeat(499)}`,
    })),
  };

  const result = validateCanvasPatch(patch, context);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.issues.some((issue) => issue.includes("character budget")));
});

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function fakeElement(id: string, type: "rectangle" | "arrow" | "freedraw"): ExcalidrawElement {
  return {
    id,
    type,
    x: 0,
    y: 0,
    groupIds: [],
    boundElements: null,
    isDeleted: false,
  } as unknown as ExcalidrawElement;
}

function fakeBox(
  id: string,
  type: "rectangle" | "ellipse" | "diamond",
  x: number,
  y: number,
  width: number,
  height: number,
): ExcalidrawElement {
  return {
    ...fakeElement(id, "rectangle"),
    type,
    x,
    y,
    width,
    height,
  } as ExcalidrawElement;
}

function fakeArrow(
  id: string,
  x: number,
  y: number,
  start: [number, number],
  end: [number, number],
): ExcalidrawElement {
  return {
    ...fakeElement(id, "arrow"),
    type: "arrow",
    x,
    y,
    width: Math.abs(end[0] - start[0]),
    height: Math.abs(end[1] - start[1]),
    points: [start, end],
    startBinding: null,
    endBinding: null,
  } as unknown as ExcalidrawElement;
}
