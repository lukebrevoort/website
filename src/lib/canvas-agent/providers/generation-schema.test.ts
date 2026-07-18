import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { canvasPatchGenerationSchema } from "./generation-schema";

test("provider generation schema avoids unsupported oneOf constructs", () => {
  const schema = z.toJSONSchema(canvasPatchGenerationSchema, { target: "draft-2020-12" });
  assert.equal(containsKey(schema, "oneOf"), false);
});

test("provider generation schema requires nullable superset fields", () => {
  const result = canvasPatchGenerationSchema.safeParse({
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Add a node",
    operations: [{
      op: "create",
      ref: "new:node",
      target: null,
      groupRef: null,
      members: null,
      from: null,
      to: null,
      connectionTo: null,
      label: null,
      reason: null,
      text: null,
      style: null,
      element: {
        kind: "rectangle",
        box: { x: 100, y: 200, width: 220, height: 120 },
        text: "Controller",
        label: null,
        points: null,
        style: {
          theme: "ink",
          fill: "hachure",
          stroke: null,
          weight: null,
          opacity: null,
        },
      },
    }],
  });

  assert.equal(result.success, true);
});

function containsKey(input: unknown, key: string): boolean {
  if (Array.isArray(input)) return input.some((value) => containsKey(value, key));
  if (typeof input !== "object" || input === null) return false;
  const record = input as Record<string, unknown>;
  return Object.hasOwn(record, key) || Object.values(record).some((value) => containsKey(value, key));
}
