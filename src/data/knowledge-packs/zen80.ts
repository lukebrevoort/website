import type { KnowledgePack } from "./schema";

export const zen80Pack: KnowledgePack = {
  slug: "zen80",
  title: "Zen80",
  summary:
    "A completed Flutter productivity tracker built around Signal vs. Noise: choose the few tasks that matter, protect time for them on the calendar, and measure whether the day matched that intent.",
  purpose:
    "Help a person identify the few important tasks (Signal) amid the noise of a busy day, protect calendar time for them, and then honestly measure whether the day matched the intended focus — turning intent into a measurable signal-to-noise ratio for how the day was spent.",
  intendedUser:
    "Luke as a personal app today. Originally: individuals who want their daily planning to be about protecting the few things that matter, not listing everything.",
  architecture:
    "A Flutter app with Dart persists locally via Hive and manages state through Provider. Google Calendar API integration lets protected time blocks land on the calendar. OAuth2 authorizes calendar access. The core model is Signal vs. Noise: a small number of important tasks (Signal) versus the churn of the day (Noise), with the app measuring the ratio of how time was actually spent against intent.",
  components: [
    { name: "Signal vs. Noise model", role: "Core abstraction: a few important tasks (Signal) vs. daily churn (Noise), measured as a ratio of intent-to-actual time." },
    { name: "Task selection surface", role: "Lets the user pick the handful of tasks that matter for the day." },
    { name: "Calendar protection", role: "Google Calendar API blocks protected time for those Signal tasks so they are defended against the noise." },
    { name: "Day-match measurement", role: "Measures whether the day matched intent — the actual time-vs-intent ratio." },
    { name: "Local persistence (Hive)", role: "Dart/Flutter local store for tasks and history without a backend." },
    { name: "Provider state management", role: "Reactive app state for the task/day model." },
    { name: "OAuth2 calendar auth", role: "Authorizes read/write to Google Calendar for time blocking." },
  ],
  designDecisions: [
    { decision: "Signal vs. Noise as the core model", rationale: "Most productivity apps list everything; Zen80 makes the user pick the few that matter and measures the day against that choice — a clearer signal of focus than completion counts." },
    { decision: "Protect time on the calendar", rationale: "Intent without protected time loses; placing blocks on Google Calendar defends Signal tasks against Noise." },
    { decision: "Measure intent vs. actual", rationale: "A good day is not 'did everything' — it is 'spent time on what I said mattered'. Measuring that ratio is more honest than task completion." },
    { decision: "Local-first via Hive", rationale: "A personal app should not require a backend; local persistence keeps it private and fast." },
    { decision: "Flutter + Provider", rationale: "Cross-platform personal tooling with a simple reactive state model." },
  ],
  status: "Completed. Now a personal app — Luke uses it day-to-day; not a maintained/shipped product.",
  limitations: [
    "Personal app: no public distribution or multi-user story.",
    "Google Calendar is the only integration; no general task-source sync.",
    "Local-first means no cloud sync/history portability beyond the device.",
    "Measurement is self-reported intent vs. calendar reality — it does not auto-detect what attention actually went to.",
  ],
  technologies: ["Flutter", "Dart", "Google Calendar API", "Hive", "Provider", "OAuth2"],
  links: [{ label: "Source", url: "https://github.com/lukebrevoort/Zen80" }],
  visualVocabulary: [
    { token: "Primary teal", usage: "Signal, important tasks, focus", value: "#0f766e" },
    { token: "Blue accent", usage: "Calendar protection, planned time", value: "#2563eb" },
    { token: "Signal-vs-noise contrast motif", usage: "A few bold Signal items against a faded field of Noise" },
    { token: "Calendar-block glyph", usage: "Depict protected time blocks on the calendar" },
    { token: "Ratio/meter glyph", usage: "Depict the intent-vs-actual ratio that defines a good day" },
  ],
  diagramPatterns: [
    {
      name: "Signal vs. Noise",
      description: "A small set of Signal tasks stands apart from a larger faded field of Noise; the day is measured by the ratio.",
      nodes: ["Signal tasks (few)", "Noise (many, faded)", "Intent", "Day-match ratio"],
      style: "A few bold nodes against a faded background; a meter/ratio node comparing intent to actual.",
    },
    {
      name: "Select → protect → measure",
      description: "Pick the Signal tasks, protect them on the calendar, then measure the day against intent.",
      nodes: ["Task selection", "Calendar protection (Google Calendar)", "Day-match measurement"],
      style: "Left-to-right pipeline; selection feeds calendar blocking feeds the end-of-day ratio.",
    },
    {
      name: "Calendar time-block",
      description: "A Signal task becomes a protected time block on Google Calendar.",
      nodes: ["Signal task", "OAuth2", "Google Calendar", "Protected time block"],
      style: "A task node flowing through OAuth2 into a calendar with a blocked-out time region.",
    },
  ],
  relationships: [
    { toProject: "FlowState", relation: "Shared theme of focus and reducing noise; FlowState orchestrated study context broadly, Zen80 narrows the same instinct to daily Signal-vs-Noise time protection." },
    { toProject: "Orca Mail", relation: "Thematic kin: both cut through noise (automated mail / daily churn) to protect the human, important thing." },
  ],
  followUpQA: [
    { question: "Is Zen80 still being developed?", answer: "It is complete and Luke uses it as a personal app today; it is not a maintained/shipped product." },
    { question: "How is Zen80 different from other to-do apps?", answer: "It does not try to track everything. You pick a few Signal tasks, protect time for them on the calendar, and the day is measured against that intent rather than by total completion." },
    { question: "Does it need a backend?", answer: "No — it is local-first using Hive for persistence; only the Google Calendar integration uses OAuth2." },
    { question: "Where is the source?", answer: "On GitHub at github.com/lukebrevoort/Zen80." },
  ],
  brandColor: "#0f766e",
  accentColor: "#2563eb",
  lastAuthored: "2026-07-20",
};