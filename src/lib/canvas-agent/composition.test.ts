import assert from "node:assert/strict";
import test from "node:test";
import type { CanvasPatch } from "./contract";
import { reviewCanvasPatchComposition } from "./composition";
import type { CanvasPatchContext } from "./validation";

const portraitContext: CanvasPatchContext = {
  sceneVersion: "scene-v1",
  bounds: { x: 0, y: 0, width: 390, height: 844 },
  elements: [],
};

const landscapeContext: CanvasPatchContext = {
  ...portraitContext,
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
};

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

test("rejects a portrait connector that crosses an unrelated center node", () => {
  const patch = patchWith([
    node("new:first", 390, 80, "First"),
    node("new:middle", 390, 310, "Middle"),
    node("new:last", 390, 540, "Last"),
    { op: "connect", ref: "new:first-last", from: "new:first", to: "new:last", label: "skips ahead" },
  ]);

  const review = reviewCanvasPatchComposition(patch, "Show the process", portraitContext);
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.ok(review.issues.some((issue) => /crosses unrelated node new:middle/.test(issue)));
});

test("accepts the existing landscape composition policy without portrait corridor checks", () => {
  const patch = patchWith([
    node("new:first", 390, 80, "First"),
    node("new:middle", 390, 310, "Middle"),
    node("new:last", 390, 540, "Last"),
    { op: "connect", ref: "new:first-last", from: "new:first", to: "new:last", label: "skips ahead" },
  ]);

  assert.deepEqual(
    reviewCanvasPatchComposition(patch, "Show the process", landscapeContext),
    { ok: true },
  );
});

test("rejects a portrait connector label that intrudes into tightly spaced node text", () => {
  const patch = patchWith([
    node("new:first", 390, 100, "First"),
    node("new:second", 390, 225, "Second"),
    { op: "connect", ref: "new:first-second", from: "new:first", to: "new:second", label: "then" },
  ]);

  const review = reviewCanvasPatchComposition(patch, "Show the flow", portraitContext);
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.ok(review.issues.some((issue) => /label overlaps node text/.test(issue)));
});

test("rejects portrait connector labels that converge in one corridor", () => {
  const patch = patchWith([
    compactNode("new:left-one", 100, 200, "A"),
    compactNode("new:right-one", 700, 200, "B"),
    compactNode("new:left-two", 100, 220, "C"),
    compactNode("new:right-two", 700, 220, "D"),
    { op: "connect", ref: "new:one", from: "new:left-one", to: "new:right-one", label: "routes" },
    { op: "connect", ref: "new:two", from: "new:left-two", to: "new:right-two", label: "starts" },
  ]);

  const review = reviewCanvasPatchComposition(patch, "Show the system", portraitContext);
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.ok(review.issues.some((issue) => /label overlaps connector label/.test(issue)));
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

function compactNode(
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
      box: { x, y, width: 100, height: 10 },
      text,
      style: { theme: "ink", fill: "hachure" },
    },
  };
}
