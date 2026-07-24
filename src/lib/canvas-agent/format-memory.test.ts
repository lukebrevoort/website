import assert from "node:assert/strict";
import test from "node:test";
import type { CanvasPatch } from "./contract";
import {
  buildFormatRecipeFromPatch,
  fingerprintPrompt,
  recordFormatFeedback,
  resetFormatMemoryForTests,
  retrieveApprovedFormats,
} from "./format-memory";
import { matchKnowledgeProjectIds } from "./knowledge";

test("fingerprint groups similar compare prompts by project tags + intent", () => {
  const left = fingerprintPrompt("Compare MALCOM and Dispatch");
  const right = fingerprintPrompt("How do Dispatch and MALCOM differ?");
  assert.deepEqual(left.projects.sort(), ["dispatch", "malcom"].sort());
  assert.deepEqual(right.projects.sort(), ["dispatch", "malcom"].sort());
  assert.ok(left.intents.includes("compare") || right.intents.includes("compare") || left.intents.includes("how"));
  assert.equal(left.key, right.key);
});

test("fingerprint separates unrelated project prompts", () => {
  const malcom = fingerprintPrompt("Sketch how MALCOM works");
  const orca = fingerprintPrompt("How does the email client filter inbox noise?");
  assert.notEqual(malcom.key, orca.key);
  assert.deepEqual(matchKnowledgeProjectIds("Sketch how MALCOM works"), ["malcom"]);
});

test("recipe compaction keeps structure without requiring full board replay", () => {
  const patch = samplePatch();
  const recipe = buildFormatRecipeFromPatch(patch);
  assert.ok(recipe);
  assert.equal(recipe.nodeCount, 2);
  assert.equal(recipe.edgeCount, 1);
  assert.equal(recipe.shapes.includes("rect"), true);
  assert.equal(recipe.skeleton.some((item) => item.op === "connect"), true);
  assert.ok((recipe.skeleton[0]?.role?.length ?? 0) <= 48);
});

test("store and retrieve prefers upvoted formats for matching prompts", async () => {
  resetFormatMemoryForTests();
  const recipe = buildFormatRecipeFromPatch(samplePatch());
  assert.ok(recipe);

  await recordFormatFeedback({
    prompt: "Compare MALCOM and Dispatch",
    summary: "Side-by-side control planes",
    vote: "up",
    recipe,
  });
  await recordFormatFeedback({
    prompt: "How do Dispatch and MALCOM differ?",
    summary: "Side-by-side control planes",
    vote: "up",
    recipe,
  });

  const approved = await retrieveApprovedFormats("Compare Dispatch vs MALCOM");
  assert.equal(approved.length, 1);
  assert.equal(approved[0]?.recipe.nodeCount, 2);
  assert.ok(approved[0]!.netScore >= 1);
});

test("downvotes demote formats out of approved retrieval", async () => {
  resetFormatMemoryForTests();
  const recipe = buildFormatRecipeFromPatch(samplePatch());
  assert.ok(recipe);

  await recordFormatFeedback({
    prompt: "Compare MALCOM and Dispatch",
    summary: "Messy board",
    vote: "up",
    recipe,
  });
  await recordFormatFeedback({
    prompt: "Compare MALCOM and Dispatch",
    summary: "Messy board",
    vote: "down",
    recipe,
  });
  await recordFormatFeedback({
    prompt: "Compare MALCOM and Dispatch",
    summary: "Messy board",
    vote: "down",
    recipe,
  });

  const approved = await retrieveApprovedFormats("Compare MALCOM and Dispatch");
  assert.equal(approved.length, 0);
});

function samplePatch(): CanvasPatch {
  return {
    version: "1",
    baseSceneVersion: "scene-v1",
    summary: "Two systems, one comparison",
    operations: [
      {
        op: "create",
        ref: "new:malcom",
        element: {
          kind: "rectangle",
          box: { x: 80, y: 120, width: 200, height: 110 },
          text: "MALCOM\nlocal controller",
          style: { theme: "ink" },
        },
      },
      {
        op: "create",
        ref: "new:dispatch",
        element: {
          kind: "rectangle",
          box: { x: 360, y: 120, width: 200, height: 110 },
          text: "Dispatch\ncontrol plane",
          style: { theme: "accent" },
        },
      },
      {
        op: "connect",
        ref: "new:link",
        from: "new:malcom",
        to: "new:dispatch",
        label: "vs",
        style: { theme: "muted" },
      },
    ],
  };
}
