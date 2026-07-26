import type { KnowledgePack } from "./schema";

export const canvasNotionPack: KnowledgePack = {
  slug: "canvas-notion",
  title: "Canvas-Notion Automation",
  summary:
    "An academic workflow bridge that pulls Canvas assignments into Notion so deadlines, priorities, grades, and submission status live in one organized planning system.",
  purpose:
    "Eliminate manual перекopying by syncing assignments from a Canvas LMS into Notion, giving students one place to track deadlines, priorities, grades, and submission status instead of juggling the LMS UI alongside their planning system.",
  intendedUser:
    "Students using Canvas who keep their planning system in Notion and want academic deadlines and status to flow in automatically rather than by hand.",
  architecture:
    "A Python service authenticates against the Canvas API on a schedule and pulls assignments, due dates, grades, and submission status. A mapping layer translates Canvas entities into Notion database rows, preserving priorities and status. Notion's API is the write target; Canvas is read-only source. The bridge is a scheduled sync rather than a live event stream.",
  components: [
    { name: "Canvas API connector", role: "Reads assignments, due dates, grades, and submission status from the Canvas LMS API." },
    { name: "Entity mapper", role: "Translates Canvas items into Notion database rows, preserving priority and status semantics." },
    { name: "Notion API writer", role: "Inserts/updates rows in a Notion database that serves as the planning hub." },
    { name: "Scheduler", role: "Runs the sync on a recurring cadence rather than reacting to live events." },
    { name: "Status normalization", role: "Keeps submission status and grades consistent between Canvas and Notion." },
  ],
  designDecisions: [
    { decision: "Canvas read-only, Notion write target", rationale: "Canvas is the source of truth for assignments; Notion is the planning surface. One-way sync avoids reconciliation conflicts." },
    { decision: "Scheduled sync over live events", rationale: "Canvas webhook/event plumbing adds reliability burden; a schedule is sufficient for academic timescales." },
    { decision: "Preserve priority + status semantics across systems", rationale: "Deadlines and submission status need to mean the same thing on both sides so prioritization is trustworthy." },
    { decision: "Automate the mapping, not the planning", rationale: "Data flows in; the student still makes prioritization and planning decisions." },
  ],
  status: "Completed (July 2025). A finished, working academic-workflow artifact.",
  limitations: [
    "Canvas-specific; the bridge is not generalized to other LMSes.",
    "Scheduled sync means near-real-time Canvas changes appear on the next run, not instantly.",
    "Single Notion database schema assumed; custom Notion layouts may need mapping tweaks.",
    "Academic-focused — not a general task/assignment sync tool.",
  ],
  technologies: ["Python", "Canvas API", "Notion API", "Data Modeling", "Automation"],
  links: [{ label: "Source", url: "https://github.com/lukebrevoort/CanvasToNotion" }],
  visualVocabulary: [
    { token: "Primary red", usage: "Deadlines, urgent items", value: "#dc2626" },
    { token: "Black accent", usage: "Status, structural elements", value: "#000000" },
    { token: "One-way flow motif", usage: "Depict Canvas → Notion as a one-directional sync, not bidirectional" },
    { token: "Database/grid glyph", usage: "Represent Notion database rows being updated" },
  ],
  diagramPatterns: [
    {
      name: "One-way Canvas → Notion sync",
      description: "Canvas (source) flows through the mapper into the Notion planning database (target).",
      nodes: ["Canvas LMS", "Canvas API connector", "Entity mapper", "Notion API writer", "Notion planning database"],
      style: "Left-to-right pipeline; a scheduler node feeding the connector. Red for the Canvas source edge, black for the Notion target. No return arrow.",
    },
    {
      name: "Assignment-to-row mapping",
      description: "A Canvas assignment maps to a Notion row with priority, due date, grade, and submission status fields.",
      nodes: ["Canvas assignment", "Mapper", "Notion row", "Priority", "Due date", "Grade", "Submission status"],
      style: "A single Canvas item expanding into the Notion row's fields on the right.",
    },
    {
      name: "Scheduled sync cycle",
      description: "A scheduler triggers the sync on a recurring cadence instead of subscribing to live events.",
      nodes: ["Scheduler", "Canvas sync run", "Notion updates"],
      style: "A loop/cycle icon on the scheduler feeding periodic sync runs.",
    },
  ],
  relationships: [
    { toProject: "FlowState", relation: "Thematic predecessor: both connect academic/LMS data to a planning surface; Canvas-Notion automates the data flow, FlowState later orchestrated study context more broadly." },
  ],
  followUpQA: [
    { question: "Does it push changes from Notion back to Canvas?", answer: "No — sync is one-way. Canvas is the source of truth for assignments; Notion is where they are planned against." },
    { question: "How current is the data in Notion?", answer: "Updates appear on the next scheduled sync run, not instantly. That is sufficient for academic timescales." },
    { question: "Does it support LMSes other than Canvas?", answer: "No — it is Canvas-specific; generalizing the connector would replace the Canvas API client." },
    { question: "Can I see the code?", answer: "Yes — the source is on GitHub at github.com/lukebrevoort/CanvasToNotion." },
  ],
  brandColor: "#dc2626",
  accentColor: "#000000",
  lastAuthored: "2026-07-20",
};