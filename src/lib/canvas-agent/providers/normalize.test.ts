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
  if (operation.op !== "create" || !("box" in operation.element)) return;
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
