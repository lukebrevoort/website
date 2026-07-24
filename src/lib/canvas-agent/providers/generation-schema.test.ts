import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { canvasPatchGenerationSchema } from "./generation-schema";

test("provider generation schema avoids unsupported oneOf constructs", () => {
  const schema = z.toJSONSchema(canvasPatchGenerationSchema, { target: "draft-2020-12" });
  assert.equal(containsKey(schema, "oneOf"), false);
});

test("provider generation schema accepts flat Dispatch-style ops", () => {
  const result = canvasPatchGenerationSchema.safeParse({
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Sketch a tiny flow",
    ops: [
      {
        op: "add",
        id: "runtime",
        type: "rect",
        x: 120,
        y: 180,
        w: 200,
        h: 110,
        label: "Runtime",
        from: null,
        to: null,
        theme: "ink",
      },
      {
        op: "add",
        id: "policy",
        type: "note",
        x: 400,
        y: 180,
        w: 200,
        h: 110,
        label: "Policy",
        from: null,
        to: null,
        theme: "warning",
      },
      {
        op: "connect",
        id: "runtime-policy",
        type: null,
        x: null,
        y: null,
        w: null,
        h: null,
        label: "checks",
        from: "runtime",
        to: "policy",
        theme: "muted",
      },
    ],
  });

  assert.equal(result.success, true);
});

function containsKey(input: unknown, key: string): boolean {
  if (Array.isArray(input)) return input.some((value) => containsKey(value, key));
  if (typeof input !== "object" || input === null) return false;
  const record = input as Record<string, unknown>;
  return Object.hasOwn(record, key) || Object.values(record).some((value) => containsKey(value, key));
}
