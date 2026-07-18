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
