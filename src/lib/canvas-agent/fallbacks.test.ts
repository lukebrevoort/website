import assert from "node:assert/strict";
import test from "node:test";
import { validateCanvasPatch } from "./validation";
import { createAuthoredStarterPatch } from "./fallbacks";
import { CANVAS_STARTER_PROMPTS } from "./starter-prompts";

const context = {
  sceneVersion: "scene-authored",
  bounds: { x: 0, y: 0, width: 1_200, height: 800 },
  elements: [],
};

test("every starter prompt has a valid, bounded authored fallback", () => {
  for (const starter of CANVAS_STARTER_PROMPTS) {
    const patch = createAuthoredStarterPatch(starter.id, context);
    const result = validateCanvasPatch(patch, context);
    assert.equal(result.ok, true, starter.id);
    assert.equal(patch.operations.length, 6);
  }
});
