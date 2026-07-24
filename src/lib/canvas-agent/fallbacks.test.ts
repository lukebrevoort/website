import assert from "node:assert/strict";
import test from "node:test";
import { validateCanvasPatch } from "./validation";
import { reviewCanvasPatchComposition } from "./composition";
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
    assert.equal(result.ok, true, `${starter.id}: ${result.ok ? "" : result.issues.join("; ")}`);
    assert.ok(patch.operations.length >= 8, starter.id);
    assert.ok(patch.operations.length <= 12, `${starter.id} should apply without large-op confirmation`);
    assert.ok(!result.ok || !result.value.risk.requiresConfirmation, starter.id);

    const composition = reviewCanvasPatchComposition(patch, starter.prompt, context);
    assert.equal(
      composition.ok,
      true,
      `${starter.id} composition: ${composition.ok ? "" : composition.issues.join("; ")}`,
    );
  }
});

test("starter follow-ups are curated and non-empty", () => {
  for (const starter of CANVAS_STARTER_PROMPTS) {
    assert.ok(starter.followUps.length >= 2, starter.id);
    for (const followUp of starter.followUps) {
      assert.ok(followUp.trim().length > 12, followUp);
    }
  }
});
