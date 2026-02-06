'use client'

import { useState } from 'react'
import {
  ProjectPageShell,
  ProjectHero,
  ProjectSection,
  ProjectMedia,
  ProjectBulletList,
  ProjectTagList,
  ProjectStatGrid,
} from '@/components/project-detail'
import { getProjectBySlug } from '@/data/projects'

export default function CanvasNotionPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const project = getProjectBySlug('canvas-notion')

  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Solution', href: '#solution' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Stack', href: '#stack' },
    { name: 'Impact', href: '#impact' },
  ]

  return (
    <ProjectPageShell
      project={project}
      navigation={navigation}
      activeItem={activeItem}
      onItemClick={setActiveItem}
    >
      <ProjectHero
        eyebrow="Workflow automation"
        title="Canvas + Notion"
        description="A Python automation bridge that keeps academic assignments synchronized in Notion with priorities, due dates, grades, and submission status."
        accentColor={project.primaryColor}
        actions={project.githubUrl ? [{ label: 'View source', href: project.githubUrl }] : []}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="Organized academic workflows"
        subtitle="Replacing manual tracking with a clean, reliable sync layer."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-slate-600 sm:text-base">
            <p>
              Traditional student workflows spread across Canvas, calendars, and notes, which leads to missed deadlines
              and poor prioritization. This automation centralizes that information in a single Notion dashboard.
            </p>
            <p>
              It pulls assignments (and related metadata) from Canvas, normalizes due dates/timezones, and mirrors them
              into structured Notion databases while preserving course context.
            </p>
            <p>
              Reliability comes from auth-aware API clients, rate limiting/backoff, and idempotent upserts that prevent
              duplicates during long-running sync jobs.
            </p>
            <p>
              The outcome is a single source of truth for schoolwork: a clean, prioritized view that stays current
              without manual copy/paste and scales across multiple courses.
            </p>
          </div>
          {project.image && (
            <ProjectMedia src={project.image} alt="Canvas to Notion automation" />
          )}
        </div>
      </ProjectSection>

      <ProjectSection
        id="solution"
        eyebrow="Solution"
        title="Smart automation layer"
        subtitle="Core capabilities that remove workflow friction."
      >
        <ProjectBulletList
          items={[
            'Real-time sync between Canvas modules and Notion databases.',
            'Priority scoring based on due dates, assignment weights, and submission requirements.',
            'Automatic grade tracking and submission-state updates (submitted/missing/late).',
            'Intentional Notion views that keep the dashboard usable under load.',
            'Safe retries, logging, and health checks for long-running tasks.',
            'Traceable, structured fields so each task is actionable at a glance (course, due date, status, priority).',
            'De-duplication and idempotent writes so repeated runs never inflate your task list.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="architecture"
        eyebrow="Architecture"
        title="System design"
        subtitle="Built to run unattended and stay resilient."
      >
        <ProjectBulletList
          items={[
            'Dedicated API client layer with auth handling, rate limiting, and error recovery.',
            'Background scheduling via macOS LaunchAgent for reliable unattended execution.',
            'Idempotent upserts and normalized Notion schema for assignments, courses, and metadata.',
            'Timezone normalization and stable identifiers to prevent drift across semesters and repeated runs.',
            'Failure-safe reruns: partial syncs can be repeated without corrupting state.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="Core tools used in the automation pipeline."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 sm:text-base">
            Python orchestrates a JSON transformation pipeline across the Canvas LMS API and the Notion API,
            with careful timezone handling for consistent due dates.
          </p>
          <ProjectTagList items={project.technologies} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="A calmer academic workflow with fewer manual steps."
      >
        <ProjectStatGrid
          items={[
            { label: 'Sync', value: 'Automated', description: 'Assignments stay current without manual entry.' },
            { label: 'Priority', value: 'Weighted', description: 'Deadlines are ordered by impact and urgency.' },
            { label: 'Reliability', value: 'Resilient', description: 'Retry logic keeps the pipeline stable.' },
            { label: 'Clarity', value: 'Unified', description: 'Canvas data lives inside a single Notion view.' },
            { label: 'Overhead', value: 'Lower', description: 'Less manual tracking and fewer missed deadlines.' },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
