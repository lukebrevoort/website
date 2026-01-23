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

export default function JobPersonalizerPage() {
  const [activeItem, setActiveItem] = useState("#overview");
  const project = getProjectBySlug("job-personalizer");

  if (!project) {
    return <div>Project not found</div>;
  }

  const navigation = [
    { name: "Overview", href: "#overview" },
    { name: "Workflow", href: "#workflow" },
    { name: "Stack", href: "#stack" },
    { name: "Impact", href: "#impact" },
    { name: "Proof", href: "#proof" },
  ];

  return (
    <ProjectPageShell
      project={project}
      navigation={navigation}
      activeItem={activeItem}
      onItemClick={setActiveItem}
    >
      <ProjectHero
        eyebrow="Automation"
        title="Resume Personalization"
        description="An n8n workflow that discovers new roles, customizes resumes with dual LLM passes, and routes approvals through email before submission."
        accentColor={project.primaryColor}
        actions={project.githubUrl ? [{ label: "View source", href: project.githubUrl }] : []}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="From job discovery to delivery"
        subtitle="A two-part workflow that keeps job hunting consistent and fast."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-slate-600 sm:text-base">
            <p>
              This project evolved from an early LangChain + Ollama prototype into an n8n workflow so it could
              support real integrations (Slack selection + Gmail approvals).
            </p>
            <p>
              Every ~5 hours it pulls a curated internship feed, filters to recent postings (last 7 days),
              de-dupes against Notion, and sends a Slack message so I can pick which roles are worth pursuing.
            </p>
            <p>
              When a role is selected, the workflow scrapes the posting, extracts relevant skills with one LLM,
              rewrites a Typst resume with another, and waits for a Gmail approve/deny before finalizing.
            </p>
          </div>
          <ProjectMedia
            src="/images/slackn8nsuperthingy.png"
            alt="n8n workflow overview"
            caption="Job intake, filtering, and Slack routing in one automated flow."
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="workflow"
        eyebrow="Workflow"
        title="Concise automation loop"
        subtitle="Each step is designed to minimize manual effort."
      >
        <ProjectBulletList
          items={[
            "Scheduled trigger (~5 hour cadence) pulls a job repository feed.",
            "Filters to recent listings (last 7 days) and avoids duplicates via Notion comparison.",
            "Slack Block Kit message with Multi-Static Select lets me pick roles quickly.",
            'Selected roles are marked "Considering" in Notion to trigger personalization.',
            "LLM #1 extracts and categorizes role-specific skills; LLM #2 tailors the Typst resume to match.",
            "Gmail approve/deny provides human-in-the-loop control with iterative refinement.",
            "Edge-case handling: dead links notify by email; Workday SOAP redirects are normalized.",
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="Core tooling across the workflow."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 sm:text-base">
            n8n orchestrates the pipeline; Slack is the selection UI; Gmail is the approval loop; Notion is the
            system of record; Ollama runs the model passes; Typst produces the final resume.
          </p>
          <ProjectTagList items={project.technologies} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="Automates the tedious parts while keeping review control."
      >
        <ProjectStatGrid
          items={[
            { label: "Cadence", value: "~5 hours", description: "New roles surface quickly without manual searching." },
            { label: "Freshness", value: "7 days", description: "Filters to recent postings before they hit Notion." },
            { label: "Quality", value: "Checked", description: "Approve/deny loop keeps output trustworthy." },
            { label: "Tracking", value: "Centralized", description: "Jobs and generated resumes live in Notion." },
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="proof"
        eyebrow="Proof"
        title="Generated output"
        subtitle="A sample of the resume generated by the workflow."
      >
        <ProjectMedia
          src="/images/NEWRESUME.png"
          alt="Generated resume sample"
          caption="Example resume output produced after Slack selection + Gmail approval (redacted)."
        />
      </ProjectSection>
    </ProjectPageShell>
  );
}
