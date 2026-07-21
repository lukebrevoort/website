import type { KnowledgePack } from "./schema";

export const malcomPack: KnowledgePack = {
  slug: "malcom",
  title: "MALCOM",
  summary:
    "Controller layer for a remote, Mac-based personal coding and assistant host — the stable execution plane behind Hermes, the conversational orchestrator.",
  purpose:
    "Give long-running agent work a stable home that survives disconnects: a controlled execution layer that owns the session registry, workspace layout, logs, and policy boundaries for a remote Mac that hosts coding and assistant harnesses. Hermes handles the conversation; MALCOM controls what actually runs and for how long.",
  intendedUser:
    "Luke, operating as a single operator orchestrating many parallel agent tasks from a remote Mac host. Not a multi-tenant product — a personal control plane.",
  architecture:
    "MALCOM sits between a conversational orchestrator (Hermes) and the remote Mac runtime. It exposes a stable CLI surface to start and track harnesses (manual shells, Codex, OpenCode, Cursor) and routes to external services through discrete adapters (GitHub, Notion, Linear). The session registry is the source of truth for what is running, where, and with what workspace. Policy and logging are first-class so any action is inspectable and recoverable after the fact.",
  components: [
    { name: "Session registry", role: "Source of truth for live and historical sessions; what is running, on which harness, and with what workspace." },
    { name: "Workspace layout manager", role: "Owns per-session worktree/layout so long-running work has a stable, recoverable filesystem context." },
    { name: "CLI command surface", role: "Stable commands to start and track manual, Codex, OpenCode, and Cursor harnesses without coupling the controller to any one provider." },
    { name: "Adapter layer", role: "Connects GitHub, Notion, and Linear behind a constrained boundary so credentials and recurring automation stay bounded." },
    { name: "Policy boundary", role: "Defines what long-running and recurring actions are permitted; keeps automation deliberate rather than open-ended." },
    { name: "Logging / inspection", role: "Captures enough state that interrupted work can be inspected and resumed." },
  ],
  designDecisions: [
    { decision: "Split conversation (Hermes) from execution (MALCOM)", rationale: "Keeps the voice/interface layer swappable and the execution layer durable; they fail and evolve independently." },
    { decision: "Provider-agnostic harness CLI", rationale: "Start and track Codex, OpenCode, Cursor, or a plain terminal through one surface so a provider change does not rewrite the controller." },
    { decision: "Constrained adapters for services", rationale: "GitHub/Notion/Linear access is deliberately bounded so credentials and scheduled automation cannot run open-ended." },
    { decision: "Session registry as source of truth", rationale: "Recoverability and inspection require a durable record of what ran, where, and with what workspace." },
  ],
  status: "In progress (June 2026 – Present). Active personal tooling; the portfolio surface is intentionally thin and evolves as the project reaches milestones.",
  limitations: [
    "No public demo or source repository is linked; this is personal infrastructure, not a shipped product.",
    "Architecture detail documented publicly is limited by design — most internals are owner-known and not fully described on the portfolio page.",
    "Single-operator scope: no multi-tenant or shared-access story.",
    "Hermes (the conversational layer) is mentioned but not part of this pack's scope.",
  ],
  technologies: ["Python", "CLI Design", "Agent Orchestration", "GitHub", "Notion", "Linear"],
  links: [],
  visualVocabulary: [
    { token: "Primary blue", usage: "Control-plane surfaces, headers", value: "#1d4ed8" },
    { token: "Cyan accent", usage: "Adapters, runtime, data flow", value: "#0891b2" },
    { token: "Robot emoji", usage: "Brand mark", value: "🤖" },
    { token: "Layered/control-plane motif", usage: "Depict Hermes above MALCOM above the Mac runtime and adapters" },
  ],
  diagramPatterns: [
    {
      name: "Orchestrator/executor split",
      description: "Two stacked layers: Hermes (conversation) above MALCOM (execution), with MALCOM fanning out to the Mac runtime and adapters.",
      nodes: ["Hermes (conversational orchestrator)", "MALCOM (control layer)", "Mac runtime", "GitHub / Notion / Linear adapters"],
      style: "Stacked layers with downward fan-out to service adapters. Use the blue→cyan palette and solid arrows for control, dashed for data.",
    },
    {
      name: "Session registry hub",
      description: "Central registry node connected to live harness sessions pointing at isolated workspaces.",
      nodes: ["Session registry", "Codex session", "OpenCode session", "Cursor session", "Manual shell", "Workspaces"],
      style: "Hub-and-spoke; registry at center, harnesses as spokes, each linking to its worktree.",
    },
    {
      name: "Provider-agnostic harness lane",
      description: "A single CLI lane that branches into interchangeable harness providers.",
      nodes: ["Stable CLI", "Codex", "OpenCode", "Cursor", "Manual terminal"],
      style: "One input lane fanning into parallel, interchangeable provider branches.",
    },
  ],
  relationships: [
    { toProject: "Dispatch", relation: "Shared theme (agent orchestration) but different scope: MALCOM is a personal remote-host controller; Dispatch is a local-first collaborative control plane for many agents. MALCOM is single-operator; Dispatch is multi-agent-workspace." },
    { toProject: "FlowState", relation: "Conceptual lineage: FlowState explored agent context, autonomy, and approval-gating; MALCOM applies similar control/inspection thinking to a durable execution layer." },
  ],
  followUpQA: [
    { question: "Is MALCOM the same as the chat assistant I talk to?", answer: "No. Hermes is the conversational orchestrator you talk to; MALCOM is the execution control layer that actually runs and tracks work on the remote Mac." },
    { question: "Can I see the code?", answer: "There is no public repository linked; MALCOM is personal infrastructure, not an open product." },
    { question: "Which coding agents does it control?", answer: "Manual shells plus Codex, OpenCode, and Cursor, through one provider-agnostic CLI." },
    { question: "How is it different from Dispatch?", answer: "MALCOM controls one operator's remote Mac host; Dispatch runs many agents in a local-first, browser-paired, worktree-isolated workspace for collaborative work." },
  ],
  brandColor: "#1d4ed8",
  accentColor: "#0891b2",
  emoji: "🤖",
  lastAuthored: "2026-07-20",
};