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
    "Connects to Gmail through read-only OAuth and normalizes provider-specific messages into a clean internal model designed to support Gmail now and Outlook later.",
    "Uses Human Signal to foreground messages written by people, filtering marketing automation and inbox clutter out of the core reading experience.",
    "Makes conversations scannable with contact signatures and configurable attention views, then gives writing a dedicated full-screen Zen Mode.",
    "Runs as an active Bun monorepo with a React/Vite web app, Hono API, shared Zod schemas, and SQLite persistence through Drizzle.",
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
    src: "/images/orca-mail-login.png",
    alt: "Orca Mail Google sign-in screen",
    caption: "A live capture of Orca's read-only Gmail connection flow, taken from the local project.",
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
