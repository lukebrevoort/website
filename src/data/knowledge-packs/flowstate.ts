import type { KnowledgePack } from "./schema";

export const flowstatePack: KnowledgePack = {
  slug: "flowstate",
  title: "FlowState",
  summary:
    "A completed, early MCP-driven study-workflow experiment — a local-first OpenCode wrapper that brought academic context, connected apps, specialized agents, and approval-gated actions into one place.",
  purpose:
    "Give study workflows a durable, local-first context layer before modern MCP-based tooling made connected context a default expectation. FlowState wrapped OpenCode with specialized agents and app integrations to coordinate study and daily-work tools while keeping higher-risk actions behind explicit approval.",
  intendedUser:
    "Students who wanted a calm, local-first hub for assignments, course context, scheduling, and an AI study assistant — with human override controls so the system never locked them out of their own plan.",
  architecture:
    "FlowState wrapped OpenCode as its core, surrounded by specialized agents for distinct student needs and app integrations to Notion, Gmail, Google Calendar, and LMS APIs. Higher-risk actions required approval. Storage was local-first SQLite. The frontend emphasized calm typography, restrained color, and quiet motion for long sessions, with streaming responses and clear progress states.",
  components: [
    { name: "Real-time assistant", role: "Streaming responses with clear progress feedback." },
    { name: "Unified academic hub", role: "Assignments, course context, and priorities in one place." },
    { name: "Adaptive scheduling", role: "Adjusts to workload and focus patterns." },
    { name: "Dynamic content", role: "Small interactive UI snippets instead of walls of text, when helpful." },
    { name: "Lightweight analytics", role: "Overload warnings and productivity patterns without nagging." },
    { name: "Human override controls", role: "Lock deadlines and reprioritize without fighting the system." },
    { name: "Outcome-focused planning", role: "Turns raw requirements into a short, scannable daily plan." },
  ],
  designDecisions: [
    { decision: "Local-first context layer", rationale: "Keep study context durable and private on the user's machine." },
    { decision: "Approval-gated higher-risk actions", rationale: "Connected apps could act, but risky actions required explicit human approval." },
    { decision: "Specialized agents per student need", rationale: "Distinct agents handled distinct tasks rather than one monolithic assistant." },
    { decision: "Quiet, restrained UX", rationale: "Long study sessions needed calm typography, restrained color, and quiet motion." },
    { decision: "Mobile-first layouts", rationale: "Quick replans between classes needed to work on a phone." },
  ],
  status: "Completed (2025 – 2026). A finished artifact from an earlier moment in agent tooling, now superseded by modern connected-context defaults.",
  limitations: [
    "Completed, not actively developed — it is a reference artifact, not a maintained product.",
    "Pre-modern-MCP assumptions; the connected-context problem it solved is now partly a default expectation of newer tooling.",
    "Scope was study workflows specifically, not general productivity.",
  ],
  technologies: ["TypeScript", "OpenCode", "MCP", "SQLite", "Notion", "Gmail", "Google Calendar"],
  links: [
    { label: "Source", url: "https://github.com/lukebrevoort/flowstate" },
    { label: "Demo", url: "https://flowstate-self.vercel.app" },
  ],
  visualVocabulary: [
    { token: "Primary orange", usage: "Brand, focus surfaces", value: "#d06224" },
    { token: "Green accent", usage: "Success/planning, secondary surfaces", value: "#9eab57" },
    { token: "Quiet/calm motif", usage: "Restrained color, calm typography, quiet motion for long sessions" },
    { token: "Hub-and-spoke", usage: "OpenCode core connecting to app integrations" },
    { token: "Approval gate glyph", usage: "Depict gated, human-approved higher-risk actions" },
  ],
  diagramPatterns: [
    {
      name: "OpenCode core hub-and-spoke",
      description: "OpenCode core at the center connecting to specialized agents and app integrations.",
      nodes: ["OpenCode core", "Specialized agents", "Notion", "Gmail", "Google Calendar", "LMS APIs"],
      style: "Hub-and-spoke; OpenCode core at center, agents and integrations on spokes. Orange for core, green for integrations.",
    },
    {
      name: "Approval gate",
      description: "Higher-risk actions flow through an approval gate before executing against connected apps.",
      nodes: ["Agent action", "Approval gate (human)", "Connected app"],
      style: "A gate node between the agent and the app; only approved actions proceed; denied actions stop at the gate.",
    },
    {
      name: "Daily plan flow",
      description: "Raw requirements turn into a short, scannable daily plan with overrides.",
      nodes: ["Raw requirements", "Outcome-focused planning", "Daily plan", "Human override"],
      style: "Left-to-right pipeline with an override branch that can lock deadlines or reprioritize.",
    },
  ],
  relationships: [
    { toProject: "MALCOM", relation: "Conceptual predecessor: FlowState explored agent context, autonomy, and approval-gating; MALCOM applies similar control/inspection thinking to a durable execution layer." },
    { toProject: "Orca Mail", relation: "Shared theme of reducing noise and protecting focus via connected-app integrations (Gmail/Calendar); FlowState planned across tools, Orca owns email." },
    { toProject: "Dispatch", relation: "Thematic continuity in local-first control and context surfacing; Dispatch generalizes agent management where FlowState focused on study workflows." },
  ],
  followUpQA: [
    { question: "Is FlowState still being worked on?", answer: "No — it is completed. It is a reference artifact from an earlier moment in agent tooling, not a maintained product." },
    { question: "Why build it before MCP was common?", answer: "It predates today's connected-context defaults; it was an attempt to give study workflows a durable, local-first context layer before that became expected." },
    { question: "Could risky actions happen automatically?", answer: "No — higher-risk actions were approval-gated and required explicit human approval before executing." },
    { question: "Where can I see it?", answer: "Source is on GitHub (github.com/lukebrevoort/flowstate) and there is a demo at flowstate-self.vercel.app." },
  ],
  brandColor: "#d06224",
  accentColor: "#9eab57",
  lastAuthored: "2026-07-20",
};