import type { KnowledgePack } from "./schema";

export const personalWebsitePack: KnowledgePack = {
  slug: "website",
  title: "Personal Website",
  summary:
    "The living portfolio and publishing space Luke uses to document projects, write about what he is learning, and experiment with thoughtful web interactions — including client-side AI via WebLLM.",
  purpose:
    "Be a living portfolio and publishing surface: document projects honestly, publish writing about what is being learned, and use the site itself as a place to experiment with thoughtful web interactions and client-side AI without a server dependency.",
  intendedUser:
    "Visitors evaluating Luke's work (recruiters, collaborators, friends) and Luke himself as the author and maintainer of the portfolio, blog, and experiments.",
  architecture:
    "A Next.js (App Router) + TypeScript site styled with Tailwind CSS and shadcn/Radix primitives, deployed on Vercel. Project and blog content is authored in data files and generated/normalized through scripts (e.g. a tsx-based blog generator pulling from Notion). Images route through an image-proxy API. Client-side AI experiments run via @mlc-ai/web-llm in the browser so no server model dependency is required. The site also hosts dev-only surfaces (e.g. the knowledge-packs viewer) gated to non-production.",
  components: [
    { name: "Next.js App Router frontend", role: "Renders portfolio, blog, projects, and experiment pages." },
    { name: "Data-authored content", role: "Projects and content live in data files (e.g. src/data/projects.ts) so updates don't require code logic changes." },
    { name: "Blog generator scripts", role: "tsx scripts generate/normalize blog posts (including from Notion) into site content." },
    { name: "Image proxy API", role: "Routes images through a server endpoint to handle domain/CORS and resizing concerns." },
    { name: "WebLLM experiments", role: "Client-side AI via @mlc-ai/web-llm loads models in the browser with no server dependency." },
    { name: "Tailwind + Radix/shadcn UI", role: "Design system primitives for consistent, accessible UI." },
    { name: "Vercel deployment", role: "Hosts the site and API routes with preview/production environments." },
  ],
  designDecisions: [
    { decision: "Content as data files, not a CMS", rationale: "Keeping project/blog content in authored data files means updates are reviewable in git and don't require a CMS or database." },
    { decision: "Next.js App Router + TypeScript", rationale: "Modern React server/client split with type safety across the site and API routes." },
    { decision: "Client-side AI via WebLLM", rationale: "Experiments run in the visitor's browser — no server model costs, no API key exposure, and it demonstrates what's possible locally." },
    { decision: "Tailwind + shadcn/Radix", rationale: "Utility-first styling with accessible primitives; fast iteration without a bespoke design system." },
    { decision: "Dev-only surfaces gated to non-production", rationale: "Viewer/lab tools (e.g. canvas contract lab, knowledge-packs viewer) are hidden in production and shown only in dev/preview so experiments can be inspected safely." },
    { decision: "Image proxy over direct hotlinking", rationale: "Routing images through a server proxy handles CORS, domain restrictions, and resizing consistently." },
  ],
  status: "Completed and live at luke.brevoort.com — continuously evolving as the living portfolio and publishing space.",
  limitations: [
    "Content is data-authored, so a non-developer author would need git access to publish.",
    "WebLLM experiments are bounded by the visitor's device and browser model support; they are demonstrations, not production features.",
    "Dev-only surfaces are intentionally not part of the public site.",
    "Blog generation pipeline depends on Notion/external sources staying stable.",
  ],
  technologies: ["TypeScript", "Vercel", "GitHub Actions", "WebLLM", "Next.js", "Tailwind CSS"],
  links: [
    { label: "Live site", url: "https://luke.brevoort.com/" },
    { label: "Source", url: "https://github.com/lukebrevoort/website" },
  ],
  visualVocabulary: [
    { token: "Primary blue", usage: "Brand, links, primary surfaces", value: "#3b82f6" },
    { token: "Violet accent", usage: "Secondary highlights, experiments", value: "#8b5cf6" },
    { token: "Living/growing motif", usage: "Depict the site as evolving — projects gain pages, blog grows over time" },
    { token: "Browser-AI glyph", usage: "Represent WebLLM running models client-side without a server" },
  ],
  diagramPatterns: [
    {
      name: "Data-authored content flow",
      description: "Content authored in data files flows into the Next.js frontend without a CMS.",
      nodes: ["Data files (projects.ts, blog)", "Blog generator scripts", "Next.js App Router", "Visitor browser"],
      style: "Left-to-right: authored data → generated content → rendered site; emphasize no CMS in the path.",
    },
    {
      name: "Client-side AI loop",
      description: "WebLLM loads a model in the browser and runs AI experiments with no server dependency.",
      nodes: ["Visitor browser", "WebLLM (@mlc-ai/web-llm)", "Local model", "AI experiment UI"],
      style: "A self-contained loop inside the browser node; no arrow out to a model server.",
    },
    {
      name: "Dev-only gating",
      description: "Lab/viewer surfaces are gated to non-production; production traffic never sees them.",
      nodes: ["Production visitors", "Dev/preview visitors", "Knowledge-packs viewer", "Canvas contract lab"],
      style: "A gate node split: production path bypasses the dev surfaces; dev/preview path reaches them.",
    },
  ],
  relationships: [
    { toProject: "MALCOM", relation: "The site documents MALCOM at the portfolio level; the knowledge-packs system on this site carries the richer authored agent context for MALCOM." },
    { toProject: "Dispatch", relation: "Dispatch is documented on this site as a featured project; the site's knowledge-pack for Dispatch carries the authored agent context alongside the portfolio page." },
    { toProject: "Orca Mail", relation: "Orca Mail is documented on this site as a featured project; the site's knowledge-pack mirrors and deepens that portfolio content for agent use." },
    { toProject: "FlowState", relation: "FlowState has a dedicated rich page on this site; its knowledge-pack reflects that same authored content for the visual agent." },
  ],
  followUpQA: [
    { question: "Is the site itself the product, or a portfolio?", answer: "Both — it is the living portfolio and publishing space, and it doubles as a place to experiment with web interactions and client-side AI." },
    { question: "How is content published?", answer: "Projects and blog content are authored in data files and generated through scripts, so publishing is a git-reviewed change rather than a CMS action." },
    { question: "Do the AI experiments need a server?", answer: "No — they run client-side via @mlc-ai/web-llm in the visitor's browser, with no server model dependency or API key exposure." },
    { question: "Are there hidden dev-only pages?", answer: "Yes — lab/viewer surfaces (canvas contract lab, knowledge-packs viewer) are gated to non-production and shown only in dev or Vercel preview." },
  ],
  brandColor: "#3b82f6",
  accentColor: "#8b5cf6",
  lastAuthored: "2026-07-20",
};