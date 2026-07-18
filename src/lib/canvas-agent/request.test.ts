import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_CONTEXT_ELEMENTS,
  MAX_PRIOR_TURNS,
  canvasAgentRequestSchema,
} from "./request";

const element = {
  ref: "existing:note-1",
  elementId: "note-1",
  kind: "text" as const,
  box: { x: 100, y: 120, width: 220, height: 90 },
  origin: "visitor" as const,
  text: "A visitor-authored note",
};

const validRequest = {
  prompt: "Connect this note to a new explanation",
  scope: "selection" as const,
  context: {
    sceneVersion: "scene-abc",
    bounds: { x: 10, y: 20, width: 900, height: 640 },
    elements: [element],
  },
  imageDataUrl: "data:image/png;base64,iVBORw0KGgo=",
  priorTurns: [],
};

test("accepts a bounded selection-scoped vision request", () => {
  const parsed = canvasAgentRequestSchema.parse(validRequest);
  assert.equal(parsed.scope, "selection");
  assert.equal(parsed.context.elements[0].ref, "existing:note-1");
});

test("accepts the bound-text container relation in serialized context", () => {
  const parsed = canvasAgentRequestSchema.parse({
    ...validRequest,
    context: {
      ...validRequest.context,
      elements: [{ ...element, containerRef: "existing:container-1" }],
    },
  });
  assert.equal(parsed.context.elements[0].containerRef, "existing:container-1");
});

test("rejects context and conversation entries over their budgets", () => {
  const tooManyElements = canvasAgentRequestSchema.safeParse({
    ...validRequest,
    context: {
      ...validRequest.context,
      elements: Array.from({ length: MAX_CONTEXT_ELEMENTS + 1 }, (_, index) => ({
        ...element,
        ref: `existing:note-${index}`,
        elementId: `note-${index}`,
      })),
    },
  });
  assert.equal(tooManyElements.success, false);

  const tooManyTurns = canvasAgentRequestSchema.safeParse({
    ...validRequest,
    priorTurns: Array.from({ length: MAX_PRIOR_TURNS + 1 }, (_, index) => ({
      prompt: `Prompt ${index}`,
      summary: `Summary ${index}`,
    })),
  });
  assert.equal(tooManyTurns.success, false);
});

test("rejects non-PNG visual context and invalid existing refs", () => {
  assert.equal(canvasAgentRequestSchema.safeParse({
    ...validRequest,
    imageDataUrl: "data:image/jpeg;base64,abc",
  }).success, false);

  assert.equal(canvasAgentRequestSchema.safeParse({
    ...validRequest,
    context: { ...validRequest.context, elements: [{ ...element, ref: "new:note" }] },
  }).success, false);
});
