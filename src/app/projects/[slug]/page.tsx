"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ProjectBulletList,
  ProjectHero,
  ProjectPageShell,
  ProjectSection,
  ProjectTagList,
} from "@/components/project-detail";
import { getProjectBySlug } from "@/data/projects";

const projectHighlights: Record<string, string[]> = {
  malcom: [
    "Coordinates remote coding and assistant sessions with a clear workspace, policy, and logging layer.",
    "Supports multiple coding harnesses while keeping project context and handoffs organized.",
    "Brings GitHub, Notion, and Linear integrations into one personal-assistant workflow.",
  ],
  "orca-mail": [
    "Connects to Gmail through OAuth and normalizes incoming mail into a clean internal model.",
    "Explores a focused inbox experience with configurable attention views and thoughtful mail organization.",
    "Built as an active monorepo with separate web, API, and shared packages.",
  ],
  dispatch: [
    "Works as a local-first control plane for running and managing multiple AI coding agents.",
    "Brings browser-based terminals, media sharing, agent lifecycle controls, and worktree isolation into one interface.",
    "Contributed a new whiteboard surface alongside debugging, product development, and interaction ideas.",
  ],
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
        <ProjectBulletList items={highlights} />
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
