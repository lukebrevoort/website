import { MAX_KNOWLEDGE_SNIPPETS } from "./request";

const knowledge = [
  "MALCOM is a local-first controller for named coding-agent sessions, policy gates, workspaces, logs, and recovery.",
  "Dispatch is a browser control plane for parallel coding agents using persistent tmux sessions, isolated Git worktrees, jobs, and shared media.",
  "Orca Mail prioritizes human signal: who wrote, whether a reply is needed, and what deserves attention now versus later.",
  "FlowState explores context-aware student workflows across notes, calendars, mail, and approval-gated actions.",
  "Luke's projects favor inspectable orchestration, visible seams, human approval, local ownership, and tools built from real workflow friction.",
  "The canvas is an editable Excalidraw board. Add small, legible diagrams that build on the visitor's marks instead of replacing the whole scene.",
] as const;

export function selectKnowledgeSnippets(prompt: string): string[] {
  const terms = new Set(prompt.toLowerCase().match(/[a-z0-9]+/g) ?? []);
  return knowledge
    .map((snippet, index) => ({
      snippet,
      index,
      score: [...terms].reduce(
        (total, term) => total + (term.length > 3 && snippet.toLowerCase().includes(term) ? 1 : 0),
        0,
      ),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, MAX_KNOWLEDGE_SNIPPETS)
    .map(({ snippet }) => snippet);
}

