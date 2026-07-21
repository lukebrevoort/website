import type { KnowledgePack } from "./schema";

export const orcaMailPack: KnowledgePack = {
  slug: "orca-mail",
  title: "Orca Mail",
  summary:
    "A human-first email client built for the conversations that matter — read-only Gmail, Human Signal, attention views, and a distraction-free Zen writer.",
  purpose:
    "Cut through automated inbox noise to surface the messages actually written by people, and give writing a calm, focused surface. Orca connects to Gmail through read-only OAuth and normalizes mail into a clean internal model so the product is not glued to one provider.",
  intendedUser:
    "People overwhelmed by automated marketing and inbox clutter who want to read and reply to human-written conversations with focus, without surrendering write access to a third-party tool.",
  architecture:
    "Read-only Google OAuth pulls mail in; a normalizer maps provider-specific Gmail messages into a clean internal model designed to extend to Outlook later. Human Signal filters messages to foreground ones written by people. Contact signatures and configurable attention views make conversations scannable. Writing happens in a dedicated full-screen Zen Mode. The app is a Bun monorepo: a React/Vite web app, a Hono API, shared Zod schemas, and SQLite persistence through Drizzle.",
  components: [
    { name: "Read-only OAuth connector", role: "Connects to Gmail with read-only OAuth; no write access granted to Orca." },
    { name: "Mail normalizer", role: "Maps provider-specific messages into a clean internal model, provider-agnostic by design." },
    { name: "Human Signal filter", role: "Foregrounds messages written by people; filters marketing automation and inbox clutter out of the core reading experience." },
    { name: "Contact signatures", role: "Per-contact identity metadata to make conversations scannable and recognizable." },
    { name: "Attention views", role: "Configurable views that focus reading on what matters." },
    { name: "Zen Mode", role: "Full-screen, distraction-free writer for replies and drafts." },
    { name: "Hono API + Drizzle/SQLite", role: "Backend API and local persistence for the normalized mail model." },
  ],
  designDecisions: [
    { decision: "Read-only OAuth", rationale: "Privacy and safety first: Orca can read and surface mail but cannot send or alter messages on the user's behalf." },
    { decision: "Provider-agnostic internal model", rationale: "Normalizing into a clean model means Gmail support now and Outlook later without rewriting the reading/writing surfaces." },
    { decision: "Human Signal as a first-class filter", rationale: "The core differentiator is surfacing human-written messages rather than ranking all mail." },
    { decision: "Bun monorepo with shared Zod schemas", rationale: "One schema source shared across the React/Vite app and Hono API keeps the client and server in sync." },
    { decision: "Dedicated Zen Mode for writing", rationale: "Replies deserve a focused, full-screen surface separate from the scanning inbox." },
  ],
  status: "In progress (July 2026 – Present). Active development; Gmail is the first provider, Outlook is planned.",
  limitations: [
    "Only Gmail is connected so far; Outlook support is designed-for but not yet implemented.",
    "No public demo or source repository is linked.",
    "Read-only: it surfaces and helps draft, but does not send mail through the Gmail account.",
  ],
  technologies: ["TypeScript", "React", "Gmail API", "OAuth 2.0", "SQLite", "Drizzle"],
  links: [],
  visualVocabulary: [
    { token: "Primary teal", usage: "Brand, primary surfaces", value: "#0f766e" },
    { token: "Blue accent", usage: "Data/attention views", value: "#0369a1" },
    { token: "Calm/wide-spaces motif", usage: "Reflect Zen Mode and distraction-free reading" },
    { token: "Human-vs-automation contrast", usage: "Depict Human Signal separating human mail from automated clutter" },
  ],
  diagramPatterns: [
    {
      name: "OAuth → normalize → model → views",
      description: "Mail flows from read-only Gmail OAuth through a normalizer into the internal model, then into attention views and Zen Mode.",
      nodes: ["Gmail (read-only OAuth)", "Normalizer", "Internal mail model", "Human Signal filter", "Attention views", "Zen writer"],
      style: "Left-to-right pipeline; human-written messages branch upward through Human Signal while automation is filtered off the main path. Teal for control, blue for data.",
    },
    {
      name: "Human Signal split",
      description: "Incoming mail splits into human-written (surfaced) vs automated (filtered) streams.",
      nodes: ["All mail", "Human Signal", "Human-written (surfaced)", "Automation (filtered)"],
      style: "A diverging split; surfaced stream emphasized, filtered stream de-emphasized.",
    },
    {
      name: "Provider-agnostic model",
      description: "Gmail and (future) Outlook both map into one internal model.",
      nodes: ["Gmail", "Outlook (planned)", "Internal model", "Reading/writing surfaces"],
      style: "Two provider inputs converging through a normalizer into one model feeding the UI.",
    },
  ],
  relationships: [
    { toProject: "FlowState", relation: "Thematic link: both engage Gmail/Calendar and aim to reduce noise and protect focus; FlowState planned around it, Orca owns email specifically." },
    { toProject: "MALCOM", relation: "No direct integration; both are personal-tooling projects that emphasize inspectable, bounded automation." },
  ],
  followUpQA: [
    { question: "Can Orca send email for me?", answer: "No. It uses read-only OAuth, so it surfaces and helps you draft replies, but cannot send or alter messages on your account." },
    { question: "Does it support Outlook?", answer: "Not yet — the internal model is provider-agnostic by design, but Gmail is the first connected provider." },
    { question: "What is Human Signal?", answer: "A filter that foregrounds messages written by people and pushes marketing automation and inbox clutter out of the core reading experience." },
    { question: "Is there a public demo?", answer: "No public demo or source link is published yet." },
  ],
  brandColor: "#0f766e",
  accentColor: "#0369a1",
  lastAuthored: "2026-07-20",
};