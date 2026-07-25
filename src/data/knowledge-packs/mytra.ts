import type { KnowledgePack } from "./schema";

export const mytraPack: KnowledgePack = {
  slug: "mytra",
  title: "Mytra · Interactivity Team",
  summary:
    "A Summer 2026 software engineering internship on the Interactivity team at Mytra, building an agentic debugging agent for internal diagnostics and airgapped Fortune 500 deployments. Work was done in-office in Brisbane.",
  purpose:
    "Give internal support teams and Fortune 500 customers an agentic debugging agent that works within airgapped environments — no external network access required — while serving as a diagnostic tool for Mytra's internal systems.",
  intendedUser:
    "Mytra support engineers debugging internal systems, and Fortune 500 customers operating in airgapped deployments who need agentic diagnostic capabilities without external dependencies.",
  architecture:
    "An agentic debugging agent deployed in two modes: (1) internally at Mytra for diagnostic use, and (2) as a self-contained solution for airgapped Fortune 500 customer environments. Luke built this directly at the Mytra office in Brisbane — no remote agent orchestration involved.",
  components: [
    { name: "Debugging agent core", role: "Agentic diagnostic tool for internal Mytra systems and airgapped customer deployments." },
    { name: "Airgapped deployment mode", role: "Self-contained agentic solution that requires no external network, tailored for Fortune 500 security constraints." },
    { name: "Internal diagnostics mode", role: "Connected variant used by Mytra's internal support teams for system debugging." },
  ],
  designDecisions: [
    { decision: "Two-mode deployment (airgapped + internal)", rationale: "Fortune 500 customers require airgapped solutions; internal use can stay connected. Building one agent that adapts to both contexts avoids maintaining two separate codebases." },
    { decision: "Agentic over scripted diagnostics", rationale: "Static diagnostic scripts cannot adapt to novel failures; an agentic loop can probe, interpret, and escalate without human-in-the-loop for every step." },
    { decision: "Custom guidelines and integrations per deployment", rationale: "Each deployment (internal vs. customer) needs its own guidelines, tool integrations, and guardrails — not a one-size-fits-all agent personality." },
  ],
  status: "In progress (Summer 2026 internship). Active development with internal and customer-facing workstreams.",
  limitations: [
    "Airgapped deployments limit which tools and APIs the agent can reach; capabilities must be bundled or pre-approved per customer.",
    "Internship-scoped — long-term ownership and roadmap are set by the Mytra team.",
  ],
  technologies: ["TypeScript", "Agentic AI", "Airgapped Deployment"],
  links: [{ label: "Mytra", url: "https://mytra.com" }],
  visualVocabulary: [
    { token: "Dark industrial", usage: "Airgapped/deployment surfaces", value: "#1e293b" },
    { token: "Teal accent", usage: "Agent diagnostics, live checks", value: "#0d9488" },
    { token: "Airgap boundary motif", usage: "Depict the agent operating inside a closed environment with no external arrows crossing the boundary" },
  ],
  diagramPatterns: [
    {
      name: "Two-mode deployment",
      description: "The same agent core deploys inside Mytra's network (connected) and inside customer airgapped environments (no external access).",
      nodes: ["Agent core", "Mytra internal (connected)", "Customer airgap (isolated)"],
      style: "Agent core box splitting into two environments; the airgap side has a thick boundary line with a lock icon; Mytra side shows external arrows.",
    },
  ],
  relationships: [
    { toProject: "MALCOM", relation: "During the Mytra internship Luke also ran MALCOM at work for personal projects (website, Orca Mail) — kicked off PRs from his phone on the commute, reviewed from notes, checked runs mobile throughout the day." },
  ],
  followUpQA: [
    { question: "What does the debugging agent do?", answer: "It's an agentic tool for diagnosing system issues — used both internally at Mytra and deployed inside airgapped Fortune 500 customer environments." },
    { question: "Was this done remotely?", answer: "No — Luke worked on Mytra in-office in Brisbane. He also ran MALCOM at work for personal projects (website, Orca Mail)." },
    { question: "What are airgapped deployments?", answer: "Fortune 500 customer environments with no external network access. The agent must be self-contained with all capabilities bundled inside the boundary." },
    { question: "Is this just diagnostics or full product work?", answer: "Both — Luke builds the agent itself and also sets up custom guidelines, integrations, and guardrails per deployment context." },
  ],
  brandColor: "#1e293b",
  accentColor: "#0d9488",
  emoji: "🏭",
  lastAuthored: "2026-07-25",
};
