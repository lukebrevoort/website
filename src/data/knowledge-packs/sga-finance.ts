import type { KnowledgePack } from "./schema";

export const sgaFinancePack: KnowledgePack = {
  slug: "sga-finance",
  title: "SGA Finance Platform",
  summary:
    "A document-automation platform for Stevens SGA Finance that turns CampusGroups exports into review-ready weekly spreadsheets and Senate-ready budget-request presentations — now handling over $2.5M.",
  purpose:
    "Remove manual spreadsheet and slide labor from SGA Finance by converting CampusGroups exports into review-ready weekly spreadsheets and Senate-ready budget-request presentations automatically, so finance review happens on numbers instead of formatting.",
  intendedUser:
    "Stevens SGA Finance reviewers and the Senate budget process — the people who need fast, consistent weekly financial review and presentable budget-request decks.",
  architecture:
    "A Next.js + TypeScript frontend (Tailwind, Vercel-hosted) drives the document-automation flows. CampusGroups exports are ingested and mapped into structured financial data, then rendered to Google Sheets for weekly review spreadsheets and Google Slides for Senate-ready budget-request presentations. Automation replaces the manual formatting step; Google Sheets/Slides are the output surfaces, not human-formatting targets.",
  components: [
    { name: "CampusGroups import", role: "Ingests CampusGroups exports that previously drove manual formatting." },
    { name: "Financial data model", role: "Normalizes exports into structured data that weekly sheets and budget decks are generated from." },
    { name: "Google Sheets renderer", role: "Produces review-ready weekly spreadsheets from the normalized data." },
    { name: "Google Slides renderer", role: "Produces Senate-ready budget-request presentations." },
    { name: "Next.js web app", role: "Operator UI for running the document-automation flows." },
    { name: "Vercel deployment", role: "Hosts the app with simple access for SGA Finance." },
  ],
  designDecisions: [
    { decision: "Automate formatting, not judgment", rationale: "Reviewers should spend time on the numbers, not formatting spreadsheets and slides; the platform replaces the formatting labor." },
    { decision: "Google Sheets + Slides as output surfaces", rationale: "SGA already worked in Google Workspace; generating into Sheets and Slides meets reviewers where they are instead of forcing a new tool." },
    { decision: "CampusGroups exports as the input", rationale: "CampusGroups was the source of student-org financial data; accepting its exports removes the manual copy-paste step." },
    { decision: "Web app over a scheduled batch job", rationale: "Finance review cadence varies; an operator-run web flow gives control over when outputs are produced." },
    { decision: "Next.js + Vercel hosting", rationale: "Fast delivery and simple access for an internal university tool." },
  ],
  status: "Completed and working — in production use for Stevens SGA Finance, handling over $2.5M.",
  limitations: [
    "CampusGroups-specific input format; a different export schema would require mapping changes.",
    "Output fidelity is bounded by the Google Sheets/Slides APIs; highly custom layouts may not be fully automatable.",
    "Internal university tool — the deployment and access are scoped to SGA Finance.",
    "Not a general finance platform; the model is tuned to SGA's review and Senate budget flows.",
  ],
  technologies: ["Next.js", "TypeScript", "Vercel", "Google Sheets", "Google Slides", "Automation"],
  links: [
    { label: "Source", url: "https://github.com/lukebrevoort/sga-finance-platform" },
    { label: "Demo", url: "https://sga-finance-platorm.vercel.app" },
  ],
  visualVocabulary: [
    { token: "Primary green", usage: "Finance, approval, healthy balances", value: "#16a34a" },
    { token: "Near-black accent", usage: "Senate/formal documents, structure", value: "#0f172a" },
    { token: "Document-generation motif", usage: "Depict one input (CampusGroups export) fanning into two outputs (Sheets + Slides)" },
    { token: "Dollar/money glyph", usage: "Represent the $2.5M+ scale handled by the platform" },
  ],
  diagramPatterns: [
    {
      name: "One input, two outputs",
      description: "CampusGroups export fans into a review-ready weekly Google Sheet and a Senate-ready Google Slides deck.",
      nodes: ["CampusGroups export", "Financial data model", "Google Sheets (weekly review)", "Google Slides (Senate budget)"],
      style: "A single input node fanning into two output surfaces via the data model. Green for finance/approval, near-black for Senate/formal outputs.",
    },
    {
      name: "Format-removal pipeline",
      description: "The platform replaces manual formatting: data in → formatted Sheets/Slides out.",
      nodes: ["Manual formatting (replaced)", "CampusGroups import", "Data model", "Generated Sheets/Slides"],
      style: "A struck-through manual-formatting node replaced by the automation pipeline.",
    },
    {
      name: "Scale annotation",
      description: "The platform is annotated as handling over $2.5M, emphasizing production use over a demo.",
      nodes: ["SGA Finance Platform", "$2.5M+ handled", "Weekly reviews", "Senate budget decks"],
      style: "A central platform node with a scale annotation and its two outputs.",
    },
  ],
  relationships: [],
  followUpQA: [
    { question: "Is this actually used?", answer: "Yes — it is in production for Stevens SGA Finance and handles over $2.5M." },
    { question: "Where does the data come from?", answer: "CampusGroups exports — the platform replaces the manual copy-paste/format step that used to turn them into review spreadsheets." },
    { question: "Why Google Sheets and Slides?", answer: "SGA already worked in Google Workspace; generating into Sheets and Slides meets reviewers where they are instead of forcing a new tool." },
    { question: "Is the source public?", answer: "Yes — on GitHub at github.com/lukebrevoort/sga-finance-platform, with a demo deployment on Vercel." },
  ],
  brandColor: "#16a34a",
  accentColor: "#0f172a",
  lastAuthored: "2026-07-20",
};