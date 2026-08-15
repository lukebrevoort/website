"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ProjectBulletList,
  ProjectHero,
  ProjectMedia,
  ProjectPageShell,
  ProjectSection,
  ProjectTagList,
} from "@/components/project-detail";
import { getProjectBySlug } from "@/data/projects";

const projectHighlights: Record<string, string[]> = {
  malcom: [
    "Acts as the controlled execution layer for a remote Mac-based personal coding and assistant host, while Hermes remains the conversational orchestrator.",
    "Maintains the source-of-truth session registry, workspace layout, logs, and policy controls so long-running work stays inspectable and recoverable.",
    "Uses stable CLI commands to start and track manual, Codex, OpenCode, and Cursor harnesses without tying the controller to one provider.",
    "Connects services such as GitHub, Notion, and Linear through adapters, keeping credentials and recurring automation deliberately constrained.",
  ],
  "orca-mail": [
    "Connects Gmail and Outlook through read-first OAuth — read-only by default, with a narrow gmail.compose grant requested only through an explicit consent upgrade when you send, reply, or forward.",
    "Normalizes provider mail into one clean local model on SQLite — threads, labels, contacts, drafts, pins, and reminders — kept current by a cursor-based sync engine with Gmail Pub/Sub push notifications.",
    "Separates human from machine mail with Human Signal: a deterministic local classifier with evidence, user overrides, and correction surfaces, presented in a tidal inbox with collections and contact signatures.",
    "Ships as a Bun monorepo — React 19/Vite web app, Hono API, shared Zod schemas — with a vendored feedback kit that files issues to Linear, deployed on Vercel with a Hono bridge.",
  ],
  dispatch: [
    "Runs and manages multiple long-lived coding agents—Claude, Codex, Cursor, OpenCode, or a plain terminal—without losing them when a browser disconnects.",
    "Pairs interactive xterm.js browser terminals with tmux-backed persistence, Git worktree isolation, lifecycle controls, scheduled jobs, and reusable review personas.",
    "Surfaces the context that makes parallel work usable: live status events, media sharing, browser streaming, project-scoped MCP tools, pins, notifications, and activity analytics.",
    "What I contributed: the collaborative whiteboard system — per-agent tldraw canvases with MCP drawing tools (whiteboard_update) and live SSE sync that let users and agents draw together. Brad at selfcontained built the core agent infrastructure.",
  ],
};

const projectMedia: Record<string, { src: string; alt: string; caption: string }> = {
  malcom: {
    src: "/images/malcom-architecture.svg",
    alt: "MALCOM architecture diagram",
    caption: "Hermes coordinates the conversation; MALCOM controls the remote execution layer, adapters, and Mac runtime.",
  },
  "orca-mail": {
    src: "/images/orca-tidal-inbox.png",
    alt: "Orca's tidal inbox separating human-written mail from machine mail",
    caption: "Orca's tidal inbox: Human Signal separates human-written threads from machine mail, with an attention queue built for the conversations that matter.",
  },
};

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const project = getProjectBySlug(params.slug);

  if (!project) {
    router.replace("/projects");
    return null;
  }

  const highlights = projectHighlights[project.slug] ?? [project.description];
  const media = projectMedia[project.slug];
  const navigation = [
    { name: "Overview", href: "#overview" },
    { name: "Focus", href: "#focus" },
    { name: "Stack", href: "#stack" },
  ];

  return (
    <ProjectPageShell
      project={project}
      navigation={navigation}
      activeItem="#overview"
      onItemClick={(href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })}
    >
      <ProjectHero
        eyebrow={`${project.category} · ${project.status.replace("-", " ")}`}
        title={project.title}
        description={project.description}
        accentColor={project.primaryColor}
      />
      <ProjectSection id="overview" eyebrow="Overview" title="The work">
        <div className="space-y-8">
          <ProjectBulletList items={highlights} />
          {media && <ProjectMedia {...media} />}
        </div>
      </ProjectSection>
      <ProjectSection id="focus" eyebrow="Now" title="Current focus">
        <p>
          This is active work. The portfolio entry will evolve as the project reaches new milestones and there is more to share.
        </p>
      </ProjectSection>
      <ProjectSection id="stack" eyebrow="Tools" title="Built with">
        <ProjectTagList items={project.technologies} />
      </ProjectSection>
    </ProjectPageShell>
  );
}
