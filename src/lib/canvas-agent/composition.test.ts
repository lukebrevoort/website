import assert from "node:assert/strict";
import test from "node:test";
import type { CanvasPatch } from "./contract";
import { reviewCanvasPatchComposition } from "./composition";

function patchWith(operations: CanvasPatch["operations"]): CanvasPatch {
  return {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "A test composition",
    operations,
  };
}

test("accepts a readable connected architecture composition", () => {
  const patch = patchWith([
    node("new:input", 80, 250, "Request"),
    node("new:controller", 390, 250, "Controller\nchecks policy"),
    node("new:runtime", 700, 250, "Runtime"),
    { op: "connect", ref: "new:input-controller", from: "new:input", to: "new:controller", label: "routes" },
    { op: "connect", ref: "new:controller-runtime", from: "new:controller", to: "new:runtime", label: "starts" },
  ]);

  assert.deepEqual(reviewCanvasPatchComposition(patch, "Show the architecture"), { ok: true });
});

test("rejects severe node overlap", () => {
  const patch = patchWith([
    node("new:left", 100, 200, "Left"),
    node("new:right", 140, 220, "Right"),
  ]);

  const review = reviewCanvasPatchComposition(patch, "Compare these ideas");
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.match(review.issues[0], /overlap too heavily/);
});

test("rejects disconnected architecture nodes", () => {
  const patch = patchWith([
    node("new:one", 50, 200, "One"),
    node("new:two", 380, 200, "Two"),
    node("new:three", 710, 200, "Three"),
  ]);

  const review = reviewCanvasPatchComposition(patch, "How does this system work?");
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.match(review.issues[0], /visible relationships/);
});

test("rejects prose-heavy nodes", () => {
  const patch = patchWith([
    node("new:essay", 100, 200, "A".repeat(221)),
  ]);

  const review = reviewCanvasPatchComposition(patch, "Explain this");
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.match(review.issues[0], /too much text/);
});

function node(
  ref: `new:${string}`,
  x: number,
  y: number,
  text: string,
): CanvasPatch["operations"][number] {
  return {
    op: "create",
    ref,
    element: {
      kind: "rectangle",
      box: { x, y, width: 220, height: 120 },
      text,
      style: { theme: "ink", fill: "hachure" },
    },
  };
}
