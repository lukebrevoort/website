import assert from "node:assert/strict";
import test from "node:test";
import { selectKnowledgeSnippets } from "./knowledge";

test("sends only knowledge that matches a focused project question", () => {
  const snippets = selectKnowledgeSnippets("Sketch how MALCOM works");

  assert.equal(snippets.length, 1);
  assert.match(snippets[0], /MALCOM/);
  assert.equal(snippets.some((snippet) => /Orca Mail|FlowState/.test(snippet)), false);
});

test("uses one general fallback for an open-ended question", () => {
  const snippets = selectKnowledgeSnippets("Surprise me");

  assert.equal(snippets.length, 1);
  assert.match(snippets[0], /Luke's projects/);
});
