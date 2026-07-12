"use client";

import { useState } from "react";
import {
  ProjectPageShell,
  ProjectHero,
  ProjectSection,
  ProjectMedia,
  ProjectBulletList,
  ProjectTagList,
  ProjectStatGrid,
} from "@/components/project-detail";
import { getProjectBySlug } from "@/data/projects";

export default function FlowStatePage() {
  const [activeItem, setActiveItem] = useState("#overview");
  const project = getProjectBySlug("flowstate");

  if (!project) {
    return <div>Project not found</div>;
  }

  const navigation = [
    { name: "Overview", href: "#overview" },
    { name: "Approach", href: "#approach" },
    { name: "Stack", href: "#stack" },
    { name: "Experience", href: "#experience" },
    { name: "Impact", href: "#impact" },
  ];

  return (
    <ProjectPageShell
      project={project}
      navigation={navigation}
      activeItem={activeItem}
      onItemClick={setActiveItem}
    >
      <ProjectHero
        eyebrow="Completed MCP experiment"
        title="FlowState"
        description="A completed, early MCP-driven study-workflow experiment: a local-first OpenCode wrapper that brought academic context, connected apps, specialized agents, and approval-gated actions into one place."
        accentColor={project.primaryColor}
        actions={
          project.githubUrl
            ? [{ label: "View source", href: project.githubUrl }]
            : []
        }
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="A pre-context era experiment"
        subtitle="Built before today’s AI tooling made connected context a default expectation."
      >
        <div className="space-y-8">
          <div className="space-y-4 text-md text-slate-600 sm:text-base">
            <p>
              FlowState started as an attempt to give study workflows a durable,
              local-first context layer before modern MCP-based tooling had
              become commonplace.
            </p>
            <p>
              It wrapped OpenCode with specialized agents and app integrations,
              connecting tools such as Notion, Gmail, Google Calendar, and LMS
              APIs while keeping higher-risk actions behind approval.
            </p>
            <p>
              The project is now complete: a useful artifact from an earlier
              moment in agent tooling, and a foundation for how I think about
              context, autonomy, and user control today.
            </p>
          </div>
          <ProjectMedia
            src="/images/NEWflowstate.png"
            alt="FlowState overview"
            caption="FlowState's clean task management interface."
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="approach"
        eyebrow="Approach"
        title="What it explored"
        subtitle="A local-first coordination layer for study and daily-work tools."
      >
        <div className="space-y-8">
          <ProjectBulletList
            items={[
              "Real-time assistant with streaming responses and clear progress feedback.",
              "Unified academic hub for assignments, course context, and priorities.",
              "Adaptive scheduling that adjusts to workload and focus patterns.",
              "Dynamic content when helpful (small interactive UI snippets instead of walls of text).",
              "Lightweight analytics: overload warnings and productivity patterns without nagging.",
              "Human override controls so students can lock deadlines and reprioritize without fighting the system.",
              "Outcome-focused planning that turns raw requirements into a short, scannable daily plan.",
            ]}
          />
          <ProjectMedia
            src="/images/NEWflowstatetasks.png"
            alt="FlowState task management view"
            caption="Organized task view with priorities and due dates."
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="The core tools that power the product."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 sm:text-base">
            Frontend focuses on speed and clarity; the backend/AI layer focuses
            on orchestration and streaming.
          </p>
          <p className="text-sm text-slate-600 sm:text-base">
            The system is built to feel responsive in-session while still
            producing structured outputs you can trust (plans, task context, and
            next steps).
          </p>
          <ProjectTagList items={project.technologies} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="experience"
        eyebrow="Experience"
        title="Focused interaction design"
        subtitle="Minimal surfaces with just the right amount of feedback."
      >
        <div className="space-y-8">
          <ProjectBulletList
            items={[
              "Calm typography and restrained color to keep long sessions comfortable.",
              "Clear loading/progress states so the system never feels vague.",
              "Mobile-first layouts for quick replans between classes.",
              "A readable hierarchy that keeps tasks, context, and next actions easy to scan.",
              "Deliberately quiet motion and UI feedback so the product feels steady under pressure.",
            ]}
          />
          <ProjectMedia
            src="/images/NEWflowstatechat.png"
            alt="FlowState chat interface"
            caption="AI-powered chat for scheduling and task management."
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="A platform built for sustained attention, not constant alerts."
      >
        <ProjectStatGrid
          items={[
            {
              label: "Planning",
              value: "Automated",
              description:
                "Schedules and reminders are generated by the system.",
            },
            {
              label: "Focus",
              value: "Sustained",
              description: "Clear task context reduces cognitive switching.",
            },
            {
              label: "AI Layer",
              value: "Orchestrated",
              description: "Specialized agents handle distinct student needs.",
            },
            {
              label: "UX",
              value: "Quiet",
              description: "A calmer interface keeps attention on the work.",
            },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  );
}
