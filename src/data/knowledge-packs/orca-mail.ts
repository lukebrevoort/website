import type { KnowledgePack } from "./schema";

export const orcaMailPack: KnowledgePack = {
  slug: "orca-mail",
  title: "Orca",
  summary:
    "A human-first email client for the conversations that matter — read-first Gmail and Outlook, Human Signal classification, a tidal inbox, and a consent-gated composer with a full-screen Zen writer.",
  purpose:
    "Give people a calmer alternative to Gmail and Outlook: separate human-written mail from machine mail locally, present it in a tidal inbox, and make writing easy and focused — without ever claiming broad mailbox access.",
  intendedUser:
    "People overwhelmed by automated mail who want a reading and writing surface built for human-to-human conversation, where sending happens only under explicit per-action consent.",
  architecture:
    "Orca is a Bun monorepo: a React 19/Vite web app, a Hono API, shared Zod schemas, and SQLite via Drizzle. Providers are read-first: login requests read-only scopes (gmail.readonly plus identity), and a narrow gmail.compose grant is requested only through an incremental consent upgrade when the user wants to send, reply, or forward. A normalizer maps provider mail (Gmail live, Outlook implemented against fixtures) into one internal model; a cursor-based sync engine with Gmail Pub/Sub push notifications and a periodic scheduler keeps the local store current. Human Signal classifies mail locally as human vs. machine with evidence, overrides, and correction surfaces; a tidal inbox, collections, pins, reminders, contact signatures, and a full-screen Zen writer sit on top. Provider tokens are encrypted at rest, and disconnecting an account cascades all of its local data away without touching Gmail or Outlook.",
  components: [
    { name: "Read-first OAuth connectors", role: "Gmail (live) and Outlook (in progress) connect with read-only scopes by default; gmail.compose is requested only via an incremental consent upgrade when sending." },
    { name: "Mail normalizer", role: "Maps provider-specific Gmail and Outlook messages into one clean internal model so the product is provider-neutral." },
    { name: "Human Signal classifier", role: "Deterministic local classification of human vs. machine mail with evidence, user overrides, and correction surfaces." },
    { name: "Tidal inbox", role: "The reading surface that keeps human-written threads foregrounded and machine mail submerged." },
    { name: "Composer + Zen writer", role: "Compose, replies, forwards, and attachments with durable draft sync and a full-screen, distraction-free Zen writing mode." },
    { name: "Collections, pins, reminders", role: "Account-scoped organization primitives on the local SQLite model." },
    { name: "Feedback kit", role: "Vendored React feedback package that captures screen state and files issues to Linear from dev builds." },
  ],
  designDecisions: [
    { decision: "Read-first OAuth with incremental compose", rationale: "Orca holds read access by default; send capability is a narrow, per-action scope upgrade, so trust is earned rather than assumed." },
    { decision: "Provider-neutral internal model", rationale: "One normalized model keeps Gmail and Outlook on the same surfaces; providers are interchangeable behind a registry." },
    { decision: "Local-first SQLite store", rationale: "Normalized mail, classification, drafts, pins, and reminders live in a local database with token encryption at rest and cascading disconnect cleanup." },
    { decision: "Human Signal as a local classifier, not a black box", rationale: "Classification stays deterministic and local with evidence, overrides, and correction surfaces so users stay in control." },
    { decision: "Bun monorepo with shared Zod schemas", rationale: "One schema source shared across the React app and Hono API keeps client and server in sync." },
  ],
  status: "In progress (July 2026 – Present). Milestones M3 (writing/delivery) and M5 (human vs. machine mail separation) are closed; M4's unified inbox shipped with live Outlook login/sync verification deferred.",
  limitations: [
    "Outlook OAuth, normalizer, and sync are implemented against fixtures; live Microsoft tenant login/sync verification is deferred.",
    "Gmail write access is intentionally narrow — compose/send only via explicit consent; Orca never requests gmail.modify or mail.google.com.",
    "No hosted public demo is linked from the repo.",
  ],
  technologies: ["TypeScript", "Bun", "React", "Hono", "Gmail API", "Outlook API", "OAuth 2.0", "SQLite", "Drizzle", "Zod"],
  links: [
    { label: "GitHub — lukebrevoort/orca", url: "https://github.com/lukebrevoort/orca" },
  ],
  visualVocabulary: [
    { token: "Primary teal", usage: "Brand, primary surfaces", value: "#0f766e" },
    { token: "Blue accent", usage: "Data/attention views", value: "#0369a1" },
    { token: "Tidal inbox motif", usage: "Human mail rises with the tide; machine mail stays submerged" },
    { token: "Light/dark theme parity", usage: "Every control state is verified in both themes" },
  ],
  diagramPatterns: [
    {
      name: "Read-first OAuth → normalize → local model",
      description: "Providers connect read-only by default; a narrow compose upgrade unlocks sending; normalized mail flows into the local SQLite model and out to the reading and writing surfaces.",
      nodes: ["Gmail + Outlook (read-first OAuth)", "Normalizer", "Local SQLite model", "Human Signal", "Tidal inbox", "Zen writer"],
      style: "Left-to-right pipeline with a small consent-gated send branch off the composer; teal for control, blue for data.",
    },
    {
      name: "Human Signal split",
      description: "Incoming mail splits into human-written (surfaced) vs. machine (submerged) streams, with overrides and correction surfaces.",
      nodes: ["All mail", "Human Signal", "Human-written (tidal inbox)", "Machine mail (submerged)"],
      style: "A diverging split; surfaced stream emphasized, machine stream de-emphasized.",
    },
    {
      name: "Provider registry",
      description: "Gmail and Outlook implement one provider interface; the registry routes sync, labels, and drafts per account.",
      nodes: ["Gmail provider", "Outlook provider", "Provider registry", "Local model", "Web UI"],
      style: "Two provider lanes converging through the registry into one model feeding the UI.",
    },
  ],
  relationships: [
    { toProject: "FlowState", relation: "Thematic link: both engage Gmail and aim to reduce noise and protect focus; FlowState planned around it, Orca owns email specifically." },
    { toProject: "MALCOM", relation: "Orca development runs through MALCOM's remote host; both projects emphasize inspectable, bounded automation." },
  ],
  followUpQA: [
    { question: "Can Orca send email for me?", answer: "Only with your explicit consent: login stays read-only, and a narrow gmail.compose grant is requested through an incremental upgrade when you send, reply, or forward. Orca never requests gmail.modify or full mailbox access." },
    { question: "Does it support Outlook?", answer: "In progress — Outlook OAuth, normalizer, and sync are implemented against fixtures; live Microsoft tenant login/sync verification is deferred." },
    { question: "What is Human Signal?", answer: "A deterministic, local classifier that separates human-written mail from machine mail, with evidence, user overrides, and correction surfaces." },
    { question: "How does mail stay current?", answer: "A cursor-based sync engine keeps the local store current, backed by Gmail Pub/Sub push notifications and a periodic scheduler, so mail arrives without constant polling." },
    { question: "What happens when I disconnect an account?", answer: "The local OAuth account, encrypted tokens, and all account-scoped local data are removed through SQLite cascades; nothing is deleted or modified at Gmail or Outlook." },
  ],
  brandColor: "#0f766e",
  accentColor: "#0369a1",
  lastAuthored: "2026-08-15",
};
