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
        description="A Python automation bridge that keeps academic assignments synchronized in Notion with priorities, due dates, and status tracking."
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
              The automation pulls assignments from Canvas, normalizes due dates, and mirrors them into a Notion dashboard
              so deadlines stay visible in one place.
            </p>
            <p>
              Reliability comes from careful retry logic and structured data modeling that preserves course context.
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
            'Priority scoring based on due dates, weights, and submission status.',
            'Safe retries, logging, and health checks for long-running tasks.',
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
            'Dedicated API client layer with rate limiting and error recovery.',
            'Background scheduling via macOS LaunchAgent for reliability.',
            'Normalized Notion schema for assignments, courses, and metadata.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="Core tools used in the automation pipeline."
      >
        <ProjectTagList items={project.technologies} />
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
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
