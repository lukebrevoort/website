import assert from "node:assert/strict";
import test from "node:test";
import { canvasPatchSchema } from "../contract";
import { normalizeCanvasPatchCandidate } from "./normalize";

test("clamps model-authored geometry without changing semantic fields", () => {
  const normalized = normalizeCanvasPatchCandidate({
    version: "1",
    baseSceneVersion: "scene-1",
    summary: "Add an edge note",
    operations: [{
      op: "create",
      ref: "new:edge-note",
      element: {
        kind: "note",
        box: { x: 880.4, y: -12, width: 240, height: 120.6 },
        text: "Still visible",
      },
    }],
  });

  const patch = canvasPatchSchema.parse(normalized);
  const operation = patch.operations[0];
  assert.equal(operation.op, "create");
  if (
    operation.op !== "create" ||
    !("box" in operation.element) ||
    !("text" in operation.element)
  ) return;
  assert.deepEqual(operation.element.box, { x: 880, y: 0, width: 120, height: 121 });
  assert.equal(operation.element.text, "Still visible");
});

test("leaves malformed geometry for strict validation to reject", () => {
  const normalized = normalizeCanvasPatchCandidate({
    version: "1",
    baseSceneVersion: "scene-1",
    summary: "Bad geometry",
    operations: [{
      op: "create",
      ref: "new:bad-note",
      element: { kind: "note", box: { x: "far", y: 0, width: 100, height: 100 } },
    }],
  });

  assert.equal(canvasPatchSchema.safeParse(normalized).success, false);
});

test("preserves repeated model-authored declaration refs for fail-closed validation", () => {
  const normalized = normalizeCanvasPatchCandidate({
    version: "1",
    baseSceneVersion: "scene-1",
    summary: "Repeated generic refs",
    operations: [
      {
        op: "create",
        ref: "new:rectangle",
        element: { kind: "rectangle", box: { x: 0, y: 0, width: 100, height: 100 } },
      },
      {
        op: "create",
        ref: "new:rectangle",
        element: { kind: "rectangle", box: { x: 120, y: 0, width: 100, height: 100 } },
      },
      {
        op: "create",
        ref: "new:rectangle",
        element: { kind: "rectangle", box: { x: 240, y: 0, width: 100, height: 100 } },
      },
    ],
  });

  const patch = canvasPatchSchema.parse(normalized);
  assert.deepEqual(
    patch.operations.map((operation) => operation.op === "create" ? operation.ref : null),
    ["new:rectangle", "new:rectangle", "new:rectangle"],
  );
});

test("prunes provider nulls and maps the flattened connection destination", () => {
  const normalized = normalizeCanvasPatchCandidate({
    version: "1",
    baseSceneVersion: "scene-1",
    summary: "Connect two nodes",
    operations: [{
      op: "connect",
      ref: "new:a-b",
      groupRef: null,
      members: null,
      from: null,
      target: "existing:a",
      to: null,
      connectionTo: "existing:b",
      label: "routes",
      reason: "irrelevant provider filler",
      text: null,
      style: null,
      element: null,
    }],
  });

  assert.deepEqual(normalized, {
    version: "1",
    baseSceneVersion: "scene-1",
    summary: "Connect two nodes",
    operations: [{
      op: "connect",
      ref: "new:a-b",
      from: "existing:a",
      to: "existing:b",
      label: "routes",
    }],
  });
});
