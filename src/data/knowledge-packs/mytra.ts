import type { KnowledgePack } from "./schema";

export const mytraPack: KnowledgePack = {
  slug: "mytra",
  title: "Mytra · Interactivity Team",
  summary:
    "A Summer 2026 software engineering internship on the Interactivity team at Mytra, building an agentic debugging agent for internal diagnostics and airgapped Fortune 500 deployments. In-office in Brisbane. Work spanned training a local open-source model for the airgap, Kubernetes deployment, multi-source debugging, an entity-based overhaul, and reshaping data pipelines for agent-native consumption.",
  purpose:
    "Give internal support teams and Fortune 500 customers an agentic debugging agent that works within airgapped environments — no external network access required — while serving as a diagnostic tool for Mytra's internal systems.",
  intendedUser:
    "Mytra support engineers debugging internal systems, and Fortune 500 customers operating in airgapped deployments who need agentic diagnostic capabilities without external dependencies.",
  architecture:
    "An agentic debugging agent deployed in two modes: (1) internally at Mytra for diagnostic use, and (2) as a self-contained solution for airgapped Fortune 500 customer environments. For the airgap, Luke trained a local open-source model so the agent could run without external API calls. The service is hosted on Kubernetes. Debugging pulls from multiple sources simultaneously. The work also included helping with a broader entity-based architectural overhaul and reworking data pipelines to structure data in a way agents could consume natively rather than requiring extraction passes.",
  components: [
    { name: "Debugging agent core", role: "Agentic diagnostic tool for internal Mytra systems and airgapped customer deployments." },
    { name: "Airgapped deployment mode", role: "Self-contained agentic solution with a locally trained open-source model, no external network required." },
    { name: "Internal diagnostics mode", role: "Connected variant used by Mytra's internal support teams for system debugging." },
    { name: "Multi-source debugger", role: "Ingests and correlates signals from multiple system sources simultaneously for richer diagnostics." },
    { name: "Kubernetes hosting", role: "Service deployed and managed on Kubernetes for both internal and airgapped environments." },
    { name: "Agent-native data pipelines", role: "Restructured existing data pipelines so agents consume data directly rather than requiring preprocessing or extraction passes." },
  ],
  designDecisions: [
    { decision: "Two-mode deployment (airgapped + internal)", rationale: "Fortune 500 customers require airgapped solutions; internal use can stay connected. Building one agent that adapts to both contexts avoids maintaining two separate codebases." },
    { decision: "Local open-source model for airgap", rationale: "Airgapped environments cannot reach external LLM APIs. Training a local open-source model lets the agent run fully offline without sacrificing diagnostic capability." },
    { decision: "Multi-source debugging", rationale: "System failures rarely have a single signal — pulling from multiple sources simultaneously gives the agent a cross-sectional view rather than a narrow trace." },
    { decision: "Agent-native data pipelines", rationale: "Traditional pipelines produce human-oriented output that needs re-extraction. Structuring data for direct agent consumption removes a conversion layer and speeds up diagnostic loops." },
    { decision: "Entity-based architecture overhaul", rationale: "The existing system needed reorganized around entities to give the agent a cleaner, more composable mental model of the system it was diagnosing." },
    { decision: "Custom guidelines and integrations per deployment", rationale: "Each deployment (internal vs. customer) needs its own guidelines, tool integrations, and guardrails — not a one-size-fits-all agent personality." },
  ],
  status: "In progress (Summer 2026 internship). Active development with internal and customer-facing workstreams.",
  limitations: [
    "Airgapped deployments limit which tools and APIs the agent can reach; capabilities must be bundled or pre-approved per customer.",
    "Internship-scoped — long-term ownership and roadmap are set by the Mytra team.",
  ],
  technologies: ["TypeScript", "Agentic AI", "Airgapped Deployment", "Kubernetes", "Open-Source LLMs", "Data Pipelines"],
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
    {
      name: "Airgap stack",
      description: "Inside the airgap: a locally trained open-source model powers the agent, running on Kubernetes with no outbound network calls.",
      nodes: ["Local open-source model", "Kubernetes", "Agent service", "Airgap boundary"],
      style: "Model + K8s + Agent inside a locked boundary box; no arrows cross the boundary outward.",
    },
    {
      name: "Agent-native pipeline",
      description: "Before: data pipelines produce human output that agents must re-extract. After: pipelines structure data for direct agent consumption.",
      nodes: ["Source systems", "Data pipeline", "Agent-native format", "Agent"],
      style: "Before/after comparison: 'before' shows a pipeline → human output → extraction step → agent; 'after' shows pipeline → agent-native format → agent (no extraction step).",
    },
  ],
  relationships: [
    { toProject: "MALCOM", relation: "During the Mytra internship Luke also ran MALCOM at work for personal projects (website, Orca Mail) — kicked off PRs from his phone on the commute, reviewed from notes, checked runs mobile throughout the day." },
  ],
  followUpQA: [
    { question: "What does the debugging agent do?", answer: "It's an agentic tool for diagnosing system issues — used both internally at Mytra and deployed inside airgapped Fortune 500 customer environments." },
    { question: "How does the airgap work?", answer: "Luke trained a local open-source model so the agent never needs to call an external API. The whole service runs on Kubernetes inside the airgapped boundary." },
    { question: "What else did Luke work on beyond the agent?", answer: "Multi-source debugging (correlating signals across system sources), an entity-based architectural overhaul, and restructuring data pipelines so agents consume data natively without extraction passes." },
    { question: "Was this done remotely?", answer: "No — in-office in Brisbane. He also ran MALCOM at work for personal projects (website, Orca Mail)." },
    { question: "What are airgapped deployments?", answer: "Fortune 500 customer environments with no external network access. The agent must be self-contained — local model, local compute, no outbound calls." },
  ],
  brandColor: "#1e293b",
  accentColor: "#0d9488",
  emoji: "🏭",
  lastAuthored: "2026-07-25",
};
