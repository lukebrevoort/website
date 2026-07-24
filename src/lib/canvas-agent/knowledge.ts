import { MAX_KNOWLEDGE_SNIPPETS } from "./request";
import {
  getKnowledgePack,
  listKnowledgePackSlugs,
} from "@/data/knowledge-packs";
import type { KnowledgePack } from "@/data/knowledge-packs/schema";

export type CanvasKnowledgeDocument = {
  id: string;
  title: string;
  aliases: readonly string[];
  keywords: readonly string[];
  facts: readonly string[];
};

const PROJECT_ALIAS_MAP: Record<string, readonly string[]> = {
  malcom: ["malcom"],
  dispatch: ["dispatch"],
  "orca-mail": ["orca", "orca mail", "email client", "orca-mail"],
  flowstate: ["flowstate", "flow state"],
  "canvas-notion": ["canvas notion", "canvas to notion", "canvas-notion"],
  hftc: ["hftc", "trading", "trading competition", "shift"],
  zen80: ["zen80", "zen 80"],
  "while-unemployed": ["while unemployed", "while_unemployed", "interview practice"],
  "sga-finance": ["sga finance", "sga", "campusgroups", "budget"],
  website: ["personal website", "website", "portfolio"],
};

const PROJECT_KEYWORD_MAP: Record<string, readonly string[]> = {
  malcom: [
    "controller", "coding agent", "remote mac", "session", "registry", "cli",
    "codex", "opencode", "cursor", "policy", "adapter", "recovery",
  ],
  dispatch: [
    "control plane", "parallel agent", "coding agent", "tmux", "terminal",
    "worktree", "xterm", "job", "mcp", "whiteboard", "media", "persona",
  ],
  "orca-mail": [
    "email", "gmail", "inbox", "human signal", "attention", "contact signature",
    "zen mode", "oauth", "drizzle", "sqlite", "hono",
  ],
  flowstate: [
    "student", "study", "academic", "assignment", "calendar", "notion", "gmail",
    "opencode", "approval", "context", "schedule", "course",
  ],
  "canvas-notion": [
    "canvas", "notion", "assignment", "deadline", "grade", "lms", "sync",
    "academic", "automation",
  ],
  hftc: [
    "trading", "market making", "momentum", "competition", "shift",
    "backtrader", "bid ask", "spread",
  ],
  zen80: [
    "productivity", "signal", "noise", "focus", "task", "calendar", "flutter",
    "time block", "planning", "ratio",
  ],
  "while-unemployed": [
    "interview", "mock interview", "ai interviewer", "code analysis",
    "voice", "practice", "mvp",
  ],
  "sga-finance": [
    "finance", "sga", "senate", "budget", "campusgroups", "spreadsheet",
    "google slides", "document automation",
  ],
  website: [
    "portfolio", "blog", "personal website", "webllm", "nextjs",
    "tailwind", "vercel", "experiment",
  ],
};

const GENERAL_DOCUMENT: CanvasKnowledgeDocument = {
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
};

function buildFactsFromPack(pack: KnowledgePack): string[] {
  const facts: string[] = [pack.summary];

  const componentNames = pack.components.map((c) => c.name);
  facts.push(
    `Key components: ${componentNames.join(", ")}. ` +
      `${pack.architecture}`,
  );

  const topDecisions = pack.designDecisions
    .slice(0, 3)
    .map((d) => d.decision);
  facts.push(`Design decisions: ${topDecisions.join("; ")}.`);

  const visualHints = pack.diagramPatterns.slice(0, 2).map((d) => {
    return `${d.name}: ${d.nodes.slice(0, 5).join(" → ")}`;
  });
  if (pack.visualVocabulary.length >= 2) {
    const colors = pack.visualVocabulary
      .slice(0, 2)
      .map((v) => `${v.token}${v.value ? ` (${v.value})` : ""}`)
      .join(", ");
    facts.push(
      `Visual: ${colors}. Diagrams: ${visualHints.join("; ")}.`,
    );
  }

  return facts;
}

function buildKnowledgeDocument(slug: string): CanvasKnowledgeDocument {
  const pack = getKnowledgePack(slug);
  if (!pack) throw new Error(`Unknown knowledge pack: ${slug}`);

  return {
    id: slug,
    title: pack.title,
    aliases: PROJECT_ALIAS_MAP[slug] ?? [slug],
    keywords: PROJECT_KEYWORD_MAP[slug] ?? [],
    facts: Object.freeze(buildFactsFromPack(pack)),
  };
}

const projectDocuments: readonly CanvasKnowledgeDocument[] =
  listKnowledgePackSlugs().map(buildKnowledgeDocument);

export const canvasKnowledgeDocuments: readonly CanvasKnowledgeDocument[] = [
  ...projectDocuments,
  GENERAL_DOCUMENT,
];

const GENERAL_DOCUMENT_ID = "shared-principles";

export function selectKnowledgeSnippets(prompt: string): string[] {
  const ranked = rankKnowledgeDocuments(prompt);
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

/** Project ids matched for prompt fingerprinting (excludes the general fallback). */
export function matchKnowledgeProjectIds(prompt: string): string[] {
  return rankKnowledgeDocuments(prompt)
    .filter(({ document, score }) => document.id !== GENERAL_DOCUMENT_ID && score > 0)
    .slice(0, MAX_KNOWLEDGE_SNIPPETS)
    .map(({ document }) => document.id);
}

function rankKnowledgeDocuments(prompt: string) {
  const normalizedPrompt = normalize(prompt);
  const terms = new Set(tokenize(normalizedPrompt));
  return canvasKnowledgeDocuments
    .map((document, index) => ({
      document,
      index,
      score: scoreDocument(document, normalizedPrompt, terms),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index);
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
