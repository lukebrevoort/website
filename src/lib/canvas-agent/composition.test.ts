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

const existingLandscapeContext: CanvasPatchContext = {
  ...landscapeContext,
  elements: [
    {
      ref: "existing:visitor-card",
      elementId: "visitor-card-id",
      kind: "rectangle",
      box: { x: 420, y: 300, width: 220, height: 120 },
      origin: "visitor",
    },
  ],
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

test("rejects created nodes that overlap a surviving existing visitor node", () => {
  const patch = patchWith([
    node("new:overlap", 430, 320, "New node"),
  ]);

  const review = reviewCanvasPatchComposition(patch, "Compare these ideas", existingLandscapeContext);
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.ok(review.issues.some((issue) => /existing:visitor-card and new:overlap overlap too heavily/.test(issue)));
});

test("does not reject overlap between two pre-existing readable nodes", () => {
  const contextWithExistingOverlap: CanvasPatchContext = {
    ...existingLandscapeContext,
    elements: [
      ...existingLandscapeContext.elements,
      {
        ref: "existing:visitor-card-2",
        elementId: "visitor-card-2-id",
        kind: "rectangle",
        box: { x: 450, y: 320, width: 220, height: 120 },
        origin: "visitor",
      },
    ],
  };

  assert.deepEqual(
    reviewCanvasPatchComposition(patchWith([node("new:note", 50, 50, "Note")]), "Compare", contextWithExistingOverlap),
    { ok: true },
  );
});

test("rejects moving one existing node onto another in portrait and landscape", () => {
  const elements: CanvasPatchContext["elements"] = [
    {
      ref: "existing:stationary",
      elementId: "stationary-id",
      kind: "rectangle",
      box: { x: 100, y: 100, width: 220, height: 120 },
      origin: "visitor",
    },
    {
      ref: "existing:moving",
      elementId: "moving-id",
      kind: "rectangle",
      box: { x: 500, y: 100, width: 220, height: 120 },
      origin: "visitor",
    },
  ];
  const patch = patchWith([
    { op: "move", target: "existing:moving", to: { x: 100, y: 100 } },
  ]);

  for (const context of [
    { ...portraitContext, elements },
    { ...landscapeContext, elements },
  ]) {
    const review = reviewCanvasPatchComposition(patch, "Rearrange these nodes", context);
    assert.equal(review.ok, false);
    if (review.ok) continue;
    assert.ok(review.issues.some((issue) =>
      /existing:stationary and existing:moving overlap too heavily/.test(issue)
    ));
  }
});

test("treats bound text inside an endpoint container as endpoint-owned", () => {
  const contextWithBoundText: CanvasPatchContext = {
    ...portraitContext,
    elements: [
      {
        ref: "existing:container",
        elementId: "container-id",
        kind: "rectangle",
        box: { x: 390, y: 100, width: 220, height: 120 },
        origin: "visitor",
      },
      {
        ref: "existing:container-text",
        elementId: "container-text-id",
        kind: "text",
        box: { x: 420, y: 135, width: 160, height: 45 },
        origin: "visitor",
        text: "Container label",
        containerRef: "existing:container",
      },
    ],
  };
  const patch = patchWith([
    node("new:next", 390, 300, "Next"),
    { op: "connect", ref: "new:container-next", from: "existing:container", to: "new:next", label: "continues" },
  ]);

  assert.deepEqual(reviewCanvasPatchComposition(patch, "Show the flow", contextWithBoundText), { ok: true });
});

test("keeps standalone existing text as a connector obstacle", () => {
  const contextWithStandaloneText: CanvasPatchContext = {
    ...portraitContext,
    elements: [{
      ref: "existing:unrelated-text",
      elementId: "unrelated-text-id",
      kind: "text",
      box: { x: 420, y: 300, width: 160, height: 60 },
      origin: "visitor",
      text: "Unrelated note",
    }],
  };
  const patch = patchWith([
    node("new:first", 390, 100, "First"),
    node("new:last", 390, 500, "Last"),
    { op: "connect", ref: "new:first-last", from: "new:first", to: "new:last", label: "skips" },
  ]);

  const review = reviewCanvasPatchComposition(patch, "Show the process", contextWithStandaloneText);
  assert.equal(review.ok, false);
  if (review.ok) return;
  assert.ok(review.issues.some((issue) => /crosses unrelated node existing:unrelated-text/.test(issue)));
});

test("replays delete and move operations before reviewing final boxes", () => {
  const contextWithState: CanvasPatchContext = {
    ...landscapeContext,
    elements: [
      {
        ref: "existing:deleted-card",
        elementId: "deleted-card-id",
        kind: "rectangle",
        box: { x: 420, y: 300, width: 220, height: 120 },
        origin: "visitor",
      },
      {
        ref: "existing:moved-card",
        elementId: "moved-card-id",
        kind: "rectangle",
        box: { x: 700, y: 300, width: 180, height: 100 },
        origin: "visitor",
      },
    ],
  };
  const patch = patchWith([
    { op: "delete", target: "existing:deleted-card", reason: "remove stale card" },
    { op: "move", target: "existing:moved-card", to: { x: 760, y: 700 } },
    node("new:replacement", 430, 320, "Replacement"),
    node("new:near-moved", 700, 300, "New node"),
  ]);

  assert.deepEqual(reviewCanvasPatchComposition(patch, "Compare these ideas", contextWithState), { ok: true });
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
