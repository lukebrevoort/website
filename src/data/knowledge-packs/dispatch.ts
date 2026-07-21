import type { KnowledgePack } from "./schema";

export const dispatchPack: KnowledgePack = {
  slug: "dispatch",
  title: "Dispatch",
  summary:
    "A local-first control plane for running and managing multiple AI coding agents from one workspace — tmux-backed persistence paired with browser terminals and worktree isolation.",
  purpose:
    "Keep many long-lived coding agents alive and observable from a single workspace, so work is not lost when a browser disconnects and parallel agent sessions can be run, inspected, and controlled side by side.",
  intendedUser:
    "Developers running several AI coding agents (Claude, Codex, Cursor, OpenCode, or a plain terminal) in parallel who want persistent, observable, isolated sessions without losing work on disconnect.",
  architecture:
    "Agents run in tmux-backed sessions for persistence; interactive xterm.js browser terminals pair with those sessions so a disconnect does not kill the work. Each agent gets Git worktree isolation. A PostgreSQL store backed by a Bun runtime holds lifecycle, jobs, media, and analytics. Project-scoped MCP tools, pins, notifications, and a collaborative whiteboard surface sit alongside the terminal/agent layer.",
  components: [
    { name: "Agent session manager", role: "Runs long-lived agents in tmux-backed sessions that survive browser disconnects." },
    { name: "Browser terminal bridge", role: "xterm.js terminals in the browser paired to tmux sessions." },
    { name: "Worktree isolation", role: "Per-agent Git worktrees so parallel sessions do not collide on the same checkout." },
    { name: "Lifecycle controls + jobs", role: "Start/stop/restart agents and schedule recurring jobs." },
    { name: "Review personas", role: "Reusable agent personas/roles for review and other repeated workflows." },
    { name: "Context surfacing", role: "Live status events, media sharing, browser streaming, pins, notifications, and activity analytics." },
    { name: "Project-scoped MCP tools", role: "Scoped MCP tool registry per project." },
    { name: "Collaborative whiteboard", role: "A shared canvas surface; the part Luke contributed to and helped shape." },
  ],
  designDecisions: [
    { decision: "tmux-backed session persistence", rationale: "Browser disconnects should not kill long-running agents; tmux keeps the session alive independently of the client." },
    { decision: "xterm.js + tmux pairing", rationale: "Interactive browser terminals that reconnect to durable tmux sessions give both responsiveness and persistence." },
    { decision: "Git worktree isolation per agent", rationale: "Parallel agents working in the same repo need isolated checkouts to avoid file collisions." },
    { decision: "Provider-agnostic agent support", rationale: "Claude, Codex, Cursor, OpenCode, or a plain terminal run through one control plane." },
    { decision: "Local-first", rationale: "Keeps the control plane under the operator's machine rather than a hosted SaaS." },
  ],
  status: "In progress (2026 – Present). Collaborative project; Luke's contribution focuses on the whiteboard surface plus product development, debugging, and interaction design.",
  limitations: [
    "Source belongs to a collaborative repo (github.com/selfcontained/dispatch); Luke contributed the whiteboard surface and product/interaction work, not the entire codebase.",
    "No public demo URL is linked.",
    "Active development — feature coverage evolves.",
  ],
  technologies: ["TypeScript", "Bun", "PostgreSQL", "tmux", "MCP", "Product Design"],
  links: [{ label: "Source (collaborative repo)", url: "https://github.com/selfcontained/dispatch" }],
  visualVocabulary: [
    { token: "Primary purple", usage: "Agent/control surfaces", value: "#7c3aed" },
    { token: "Pink accent", usage: "Whiteboard, media, highlights", value: "#db2777" },
    { token: "Multi-lane/multi-agent motif", usage: "Depict parallel agent sessions side by side" },
    { token: "Terminal glyphs", usage: "xterm.js pairing with tmux persistence" },
  ],
  diagramPatterns: [
    {
      name: "Session persistence pairing",
      description: "Browser xterm.js terminal on top, tmux session beneath, so a disconnect breaks only the top edge, not the session.",
      nodes: ["xterm.js browser terminal", "tmux session", "Agent process"],
      style: "Two-layer stack; a break symbol on the browser↔tmux edge to show disconnect-tolerance; use purple for control, pink for the live/interactive edge.",
    },
    {
      name: "Multi-agent worktree lanes",
      description: "Parallel agent lanes, each branching from the repo into its own worktree.",
      nodes: ["Repo", "Agent A + worktree", "Agent B + worktree", "Agent C + worktree"],
      style: "One repo node fanning into parallel lanes; each lane links an agent to its isolated worktree branch.",
    },
    {
      name: "Context surface fan-out",
      description: "From each agent session, fan out to the context surfaces: status events, media, browser streaming, pins, notifications, analytics.",
      nodes: ["Agent session", "Status events", "Media sharing", "Browser streaming", "Pins", "Notifications", "Analytics"],
      style: "Agent session on the left with rightward fan-out to surface nodes.",
    },
    {
      name: "MCP tool registry",
      description: "Project-scoped MCP tools attach to a project, available to its agents.",
      nodes: ["Project", "MCP tool registry", "Agent sessions"],
      style: "Project node holding a scoped tool registry that agents under that project can reach.",
    },
  ],
  relationships: [
    { toProject: "MALCOM", relation: "Shared agent-orchestration theme with different scope: Dispatch is a local-first collaborative multi-agent workspace; MALCOM is a single-operator remote Mac controller." },
    { toProject: "FlowState", relation: "Thematic continuity in local-first control and context surfacing; Dispatch generalizes agent management where FlowState focused on study workflows." },
  ],
  followUpQA: [
    { question: "What part did Luke build?", answer: "Luke contributed and helped shape the collaborative whiteboard surface, plus product development, debugging, and interaction work. The broader codebase is a collaborative project." },
    { question: "What happens if I close the browser?", answer: "Agents keep running in tmux-backed sessions; reconnecting the xterm.js terminal restores the live session." },
    { question: "Which agents are supported?", answer: "Claude, Codex, Cursor, OpenCode, or a plain terminal — all through one workspace with worktree isolation." },
    { question: "Is there a hosted version?", answer: "Dispatch is local-first; no hosted/public demo URL is linked." },
  ],
  brandColor: "#7c3aed",
  accentColor: "#db2777",
  lastAuthored: "2026-07-20",
};