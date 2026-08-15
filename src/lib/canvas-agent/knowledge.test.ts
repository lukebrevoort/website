import assert from "node:assert/strict";
import test from "node:test";
import { selectKnowledgeSnippets } from "./knowledge";

test("sends only knowledge that matches a focused project question", () => {
  const snippets = selectKnowledgeSnippets("Sketch how MALCOM works");

  assert.equal(snippets.length, 1);
  assert.match(snippets[0], /MALCOM/);
  assert.equal(snippets.some((snippet) => /\[Orca\]|\[FlowState\]/.test(snippet)), false);
});

test("uses one general fallback for an open-ended question", () => {
  const snippets = selectKnowledgeSnippets("Surprise me");

  assert.equal(snippets.length, 1);
  assert.match(snippets[0], /Threads across Luke's work/);
  assert.match(snippets[0], /local ownership/);
});

test("retrieves multiple specific records for a comparison", () => {
  const snippets = selectKnowledgeSnippets("Compare MALCOM and Dispatch");

  assert.equal(snippets.length, 2);
  assert.match(snippets[0], /\[MALCOM\]/);
  assert.match(snippets[1], /\[Dispatch\]/);
});

test("matches a project from domain language without its name", () => {
  const snippets = selectKnowledgeSnippets("How does the email client filter inbox noise?");

  assert.equal(snippets.length, 1);
  assert.match(snippets[0], /\[Orca\]/);
  assert.match(snippets[0], /Human Signal/);
});
