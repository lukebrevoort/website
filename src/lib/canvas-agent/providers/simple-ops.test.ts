import assert from "node:assert/strict";
import test from "node:test";
import {
  convertSimpleOpsToCanvasPatch,
  suggestPlacementRegion,
} from "./simple-ops";

test("converts flat add/connect ops into a canonical canvas patch", () => {
  const patch = convertSimpleOpsToCanvasPatch({
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Tiny architecture",
    ops: [
      {
        op: "add",
        id: "input",
        type: "rect",
        x: 80,
        y: 200,
        w: 180,
        h: 100,
        label: "Request",
        from: null,
        to: null,
        theme: "ink",
      },
      {
        op: "add",
        id: "runtime",
        type: "rect",
        x: 360,
        y: 200,
        w: 180,
        h: 100,
        label: "Runtime",
        from: null,
        to: null,
        theme: "ink",
      },
      {
        op: "connect",
        id: "input-runtime",
        type: null,
        x: null,
        y: null,
        w: null,
        h: null,
        label: "starts",
        from: "input",
        to: "runtime",
        theme: "muted",
      },
    ],
  });

  assert.equal(patch.operations.length, 3);
  assert.equal(patch.operations[0].op, "create");
  assert.equal(patch.operations[2].op, "connect");
  if (patch.operations[2].op === "connect") {
    assert.equal(patch.operations[2].from, "new:input");
    assert.equal(patch.operations[2].to, "new:runtime");
  }
});

test("follow-up placement shifts new clusters below occupied work", () => {
  const placement = suggestPlacementRegion({
    elements: [{
      ref: "existing:board",
      elementId: "board-id",
      kind: "rectangle",
      box: { x: 100, y: 80, width: 220, height: 120 },
      origin: "agent",
    }],
  }, 1);

  assert.equal(placement.mode, "below");
  assert.ok(placement.y > 200);

  const patch = convertSimpleOpsToCanvasPatch({
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Follow-up cluster",
    ops: [{
      op: "add",
      id: "next",
      type: "note",
      x: 120,
      y: 100,
      w: 200,
      h: 110,
      label: "Next idea",
      from: null,
      to: null,
      theme: "warning",
    }],
  }, { placement, priorTurnCount: 1 });

  const create = patch.operations[0];
  assert.equal(create.op, "create");
  if (create.op !== "create" || !("box" in create.element)) return;
  assert.ok(create.element.box.y >= placement.y);
});
