'use client'

import { useState } from 'react'
import {
  ProjectPageShell,
  ProjectHero,
  ProjectSection,
  ProjectBulletList,
  ProjectTagList,
  ProjectStatGrid,
} from '@/components/project-detail'
import { getProjectBySlug } from '@/data/projects'

export default function SGAFinancePage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const project = getProjectBySlug('sga-finance')

  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Workflow', href: '#workflow' },
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
        eyebrow="Operations automation"
        title="SGA Finance Platform"
        description="A platform for Stevens Institute of Technology that automates budget request slideshows and spreadsheets, reducing repetitive manual work for SGA finance workflows."
        accentColor={project.primaryColor}
        actions={[
          project.demoUrl && { label: 'Live demo', href: project.demoUrl, variant: 'secondary' },
          project.githubUrl && { label: 'View source', href: project.githubUrl },
        ].filter(Boolean) as { label: string; href: string; variant?: 'primary' | 'secondary' }[]}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="Automating finance artifacts"
        subtitle="Turn structured budget request inputs into consistent docs."
      >
        <ProjectBulletList
          items={[
            'Generates slide decks from standardized templates so presentations stay consistent.',
            'Produces spreadsheets that align with the same request data.',
            'Designed to reduce copy/paste, formatting drift, and manual rework.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="workflow"
        eyebrow="Workflow"
        title="From request to deliverable"
        subtitle="A focused pipeline that emphasizes consistency and speed."
      >
        <ProjectBulletList
          items={[
            'Intake budget request details through a structured interface.',
            'Map request fields into a slide template and a spreadsheet layout.',
            'Export/share generated artifacts for review and approval.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="A web platform with document automation integrations."
      >
        <ProjectTagList items={project.technologies} />
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="Cleaner handoffs and fewer manual steps for recurring finance work."
      >
        <ProjectStatGrid
          items={[
            { label: 'Docs', value: 'Generated', description: 'Slides and spreadsheets stay in sync.' },
            { label: 'Workflow', value: 'Faster', description: 'Reduces repetitive formatting work.' },
            { label: 'Output', value: 'Consistent', description: 'Templates prevent drift across requests.' },
            { label: 'Platform', value: 'Web', description: 'Accessible for teams without local tooling.' },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
