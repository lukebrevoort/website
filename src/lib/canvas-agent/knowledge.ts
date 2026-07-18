import { MAX_KNOWLEDGE_SNIPPETS } from "./request";

export type CanvasKnowledgeDocument = {
  id: string;
  title: string;
  aliases: readonly string[];
  keywords: readonly string[];
  facts: readonly string[];
};

// Curated, source-controlled records are the first knowledge index. Keeping the
// retrieval boundary document-shaped makes it straightforward to replace this
// source with hosted search later without changing the provider prompt.
export const canvasKnowledgeDocuments: readonly CanvasKnowledgeDocument[] = [
  {
    id: "malcom",
    title: "MALCOM",
    aliases: ["malcom"],
    keywords: [
      "controller", "coding agent", "remote mac", "session", "registry", "cli",
      "codex", "opencode", "cursor", "policy", "adapter", "recovery",
    ],
    facts: [
      "MALCOM is the controlled execution layer for Luke's remote Mac-based personal coding and assistant host; Hermes remains the conversational orchestrator.",
      "Its source of truth is a session registry plus predictable workspace and log layouts, so long-running work remains inspectable and recoverable.",
      "Stable CLI commands start and track manual, Codex, OpenCode, and Cursor harnesses, while adapters connect GitHub, Notion, and Linear behind constrained credentials and policy controls.",
    ],
  },
  {
    id: "dispatch",
    title: "Dispatch",
    aliases: ["dispatch"],
    keywords: [
      "control plane", "parallel agent", "coding agent", "tmux", "terminal",
      "worktree", "xterm", "job", "mcp", "whiteboard", "media", "persona",
    ],
    facts: [
      "Dispatch is a local-first browser control plane for multiple long-lived coding agents, including Claude, Codex, Cursor, OpenCode, and plain terminals.",
      "xterm.js browser terminals attach to tmux-backed sessions; Git worktrees isolate parallel changes so browser disconnects do not kill work or mix branches.",
      "Lifecycle controls, scheduled jobs, review personas, live status, media sharing, project-scoped MCP tools, pins, notifications, and analytics make parallel work visible and manageable.",
    ],
  },
  {
    id: "orca-mail",
    title: "Orca Mail",
    aliases: ["orca", "orca mail", "email client"],
    keywords: [
      "email", "gmail", "inbox", "human signal", "attention", "contact signature",
      "zen mode", "oauth", "drizzle", "sqlite", "hono",
    ],
    facts: [
      "Orca Mail is a human-first email client that connects to Gmail through read-only OAuth and normalizes provider-specific mail into a clean internal model intended to support other providers later.",
      "Human Signal foregrounds messages written by people and filters marketing automation and inbox clutter; configurable attention views help decide what needs attention now versus later.",
      "Contact signatures make conversations scannable and full-screen Zen Mode protects writing focus. The active Bun monorepo uses React/Vite, Hono, shared Zod schemas, SQLite, and Drizzle.",
    ],
  },
  {
    id: "flowstate",
    title: "FlowState",
    aliases: ["flowstate", "flow state"],
    keywords: [
      "student", "study", "academic", "assignment", "calendar", "notion", "gmail",
      "opencode", "approval", "context", "schedule", "course",
    ],
    facts: [
      "FlowState was an early, completed local-first OpenCode wrapper that gave study workflows a durable context layer before connected MCP tooling became commonplace.",
      "It brought assignments, course context, Notion, Gmail, Google Calendar, LMS APIs, and specialized agents into one academic hub while keeping higher-risk actions behind human approval.",
      "Its interaction goal was a quiet daily plan: translate raw requirements into priorities, adaptive scheduling, overload warnings, and clear progress without constant alerts.",
    ],
  },
  {
    id: "zen80",
    title: "Zen80",
    aliases: ["zen80", "zen 80"],
    keywords: [
      "productivity", "signal", "noise", "focus", "task", "calendar", "flutter",
      "time block", "planning", "ratio",
    ],
    facts: [
      "Zen80 is a local-first Flutter productivity tracker built around Signal versus Noise: choose three to five tasks that genuinely move goals forward, then make drift visible.",
      "It compares estimated and actual time, protects Signal work with Google Calendar time blocks, and uses a simple Signal percentage for daily and multi-week review.",
      "The goal is awareness rather than perfect productivity; constraints keep planning quick, and calendar events can count toward planned Signal time when they represent the intended work.",
    ],
  },
  {
    id: "shared-principles",
    title: "Threads across Luke's work",
    aliases: [
      "luke's projects", "lukes projects", "connect luke's projects", "surprise me",
    ],
    keywords: [
      "luke", "project", "projects", "connect", "thread", "theme", "themes",
      "philosophy", "principle", "principles", "surprise",
    ],
    facts: [
      "Luke builds tools from workflow friction: MALCOM and Dispatch make agent work inspectable, Orca Mail protects human attention, FlowState coordinates student context, and Zen80 separates signal from noise.",
      "The recurring design principles are local ownership, visible system seams, recoverable state, calm interfaces, constrained automation, and human approval where actions carry risk.",
      "The common product question is not how to automate everything, but how software can surface the right context and let a person make the consequential choice.",
    ],
  },
] as const;

const GENERAL_DOCUMENT_ID = "shared-principles";

export function selectKnowledgeSnippets(prompt: string): string[] {
  const normalizedPrompt = normalize(prompt);
  const terms = new Set(tokenize(normalizedPrompt));
  const ranked = canvasKnowledgeDocuments
    .map((document, index) => ({
      document,
      index,
      score: scoreDocument(document, normalizedPrompt, terms),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index);

  const strongProjectMatches = ranked.filter(
    ({ document, score }) => document.id !== GENERAL_DOCUMENT_ID && score >= 8,
  );
  const selected = strongProjectMatches.length > 0
    ? strongProjectMatches
    : ranked.length > 0
      ? ranked
      : canvasKnowledgeDocuments
          .map((document, index) => ({ document, index, score: 0 }))
          .filter(({ document }) => document.id === GENERAL_DOCUMENT_ID);

  return selected
    .slice(0, MAX_KNOWLEDGE_SNIPPETS)
    .map(({ document }) => formatDocument(document));
}

function scoreDocument(
  document: CanvasKnowledgeDocument,
  normalizedPrompt: string,
  terms: ReadonlySet<string>,
) {
  let score = 0;

  for (const alias of document.aliases) {
    const normalizedAlias = normalize(alias);
    if (normalizedPrompt.includes(normalizedAlias)) {
      score += normalizedAlias.includes(" ") ? 24 : 18;
    }
  }

  for (const keyword of document.keywords) {
    const normalizedKeyword = normalize(keyword);
    if (normalizedKeyword.includes(" ")) {
      if (normalizedPrompt.includes(normalizedKeyword)) score += 7;
      continue;
    }
    if (terms.has(normalizedKeyword)) score += 3;
  }

  return score;
}

function formatDocument(document: CanvasKnowledgeDocument) {
  return `[${document.title}] ${document.facts.join(" ")}`;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string) {
  return value.match(/[a-z0-9]+/g) ?? [];
}
