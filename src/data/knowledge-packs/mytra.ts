import type { KnowledgePack } from "./schema";

export const mytraPack: KnowledgePack = {
  slug: "mytra",
  title: "Mytra · Interactivity Team",
  summary:
    "A Summer 2026 software engineering internship on the Interactivity team at Mytra, building an agentic debugging agent for internal diagnostics and airgapped Fortune 500 deployments. Work was done remotely via MALCOM.",
  purpose:
    "Give internal support teams and Fortune 500 customers an agentic debugging agent that works within airgapped environments — no external network access required — while serving as a diagnostic tool for Mytra's internal systems.",
  intendedUser:
    "Mytra support engineers debugging internal systems, and Fortune 500 customers operating in airgapped deployments who need agentic diagnostic capabilities without external dependencies.",
  architecture:
    "An agentic debugging agent deployed in two modes: (1) internally at Mytra for diagnostic use, and (2) as a self-contained solution for airgapped Fortune 500 customer environments. The agent is built and iterated on through MALCOM remotely. Luke writes tickets and documents in Notion, kicks off PRs from his phone during his commute, reviews PRs from mobile notes, and monitors runs throughout the day.",
  components: [
    { name: "Debugging agent core", role: "Agentic diagnostic tool for internal Mytra systems and airgapped customer deployments." },
    { name: "Airgapped deployment mode", role: "Self-contained agentic solution that requires no external network, tailored for Fortune 500 security constraints." },
    { name: "Internal diagnostics mode", role: "Connected variant used by Mytra's internal support teams for system debugging." },
    { name: "MALCOM remote workflow", role: "All agent work is done remotely via MALCOM — PRs kicked off from phone, tickets and docs in Notion, run progress checked mobile throughout the day." },
  ],
  designDecisions: [
    { decision: "Two-mode deployment (airgapped + internal)", rationale: "Fortune 500 customers require airgapped solutions; internal use can stay connected. Building one agent that adapts to both contexts avoids maintaining two separate codebases." },
    { decision: "Agentic over scripted diagnostics", rationale: "Static diagnostic scripts cannot adapt to novel failures; an agentic loop can probe, interpret, and escalate without human-in-the-loop for every step." },
    { decision: "Remote MALCOM-driven development", rationale: "Luke works remotely; MALCOM provides persistent agent sessions, worktree isolation, and mobile-accessible orchestration so work continues during commutes and off hours." },
    { decision: "Custom guidelines and integrations", rationale: "Each deployment (internal vs. customer) needs its own guidelines, tool integrations, and guardrails — not a one-size-fits-all agent personality." },
  ],
  status: "In progress (Summer 2026 internship). Active development with internal and customer-facing workstreams.",
  limitations: [
    "Airgapped deployments limit which tools and APIs the agent can reach; capabilities must be bundled or pre-approved per customer.",
    "Remote MALCOM-driven workflow depends on reliable mobile connectivity for PR kickoffs and run monitoring.",
    "Internship-scoped — long-term ownership and roadmap are set by the Mytra team.",
  ],
  technologies: ["TypeScript", "MALCOM", "Notion", "Agentic AI", "Airgapped Deployment", "Mobile-first workflow"],
  links: [{ label: "Mytra", url: "https://mytra.com" }],
  visualVocabulary: [
    { token: "Dark industrial", usage: "Airgapped/deployment surfaces", value: "#1e293b" },
    { token: "Teal accent", usage: "Agent diagnostics, live checks", value: "#0d9488" },
    { token: "Airgap boundary motif", usage: "Depict the agent operating inside a closed environment with no external arrows crossing the boundary" },
    { token: "Mobile-trigger motif", usage: "PRs and runs triggered from a phone; small-screen glyph for the commute workflow" },
  ],
  diagramPatterns: [
    {
      name: "Two-mode deployment",
      description: "The same agent core deploys inside Mytra's network (connected) and inside customer airgapped environments (no external access).",
      nodes: ["Agent core", "Mytra internal (connected)", "Customer airgap (isolated)"],
      style: "Agent core box splitting into two environments; the airgap side has a thick boundary line with a lock icon; Mytra side shows external arrows.",
    },
    {
      name: "Mobile-driven workflow",
      description: "Luke kicks off PRs from phone during commute, reviews from mobile notes, monitors runs throughout the day — all via MALCOM.",
      nodes: ["Phone (commute)", "PR kickoff", "Notion tickets/docs", "MALCOM", "Run progress (mobile check)"],
      style: "Phone icon on the left fanning into PRs, Notion docs, and MALCOM sessions; a dotted return arrow from MALCOM back to phone for run checks.",
    },
  ],
  relationships: [
    { toProject: "MALCOM", relation: "MALCOM is the remote session orchestrator Luke uses for all Mytra agent work — PR kickoffs, run monitoring, and mobile access depend on it." },
  ],
  followUpQA: [
    { question: "What does the debugging agent do?", answer: "It's an agentic tool for diagnosing system issues — used both internally at Mytra and deployed inside airgapped Fortune 500 customer environments." },
    { question: "How does Luke work on it remotely?", answer: "He uses MALCOM for persistent agent sessions. During his commute he kicks off PRs from his phone, writes tickets/docs in Notion, and checks run progress mobile throughout the day." },
    { question: "What are airgapped deployments?", answer: "Fortune 500 customer environments with no external network access. The agent must be self-contained with all capabilities bundled inside the boundary." },
    { question: "Is this just diagnostics or full product work?", answer: "Both — Luke builds the agent itself and also sets up custom guidelines, integrations, and guardrails per deployment context." },
  ],
  brandColor: "#1e293b",
  accentColor: "#0d9488",
  emoji: "🏭",
  lastAuthored: "2026-07-25",
};
