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

export default function Zen80Page() {
  const [activeItem, setActiveItem] = useState('#overview')
  const project = getProjectBySlug('zen80')

  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Features', href: '#features' },
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
        eyebrow="Productivity"
        title="Zen80"
        description="A Flutter productivity tracker built around Signal vs Noise: plan 3-5 critical tasks, protect focus time, and track whether your day matches your intent."
        accentColor={project.primaryColor}
        actions={project.githubUrl ? [{ label: 'View source', href: project.githubUrl }] : []}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="Daily planning with accountability"
        subtitle="A lightweight system for choosing what matters and measuring follow-through."
      >
        <ProjectBulletList
          items={[
            'Morning planning flow to pick 3-5 Signal tasks and estimate effort.',
            'Time tracking to compare estimated vs actual minutes per task.',
            'A single ratio (Signal %) that stays readable and actionable.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="philosophy"
        eyebrow="Philosophy"
        title="Signal vs Noise"
        subtitle="A simple model that turns planning into a measurable daily habit."
      >
        <ProjectBulletList
          items={[
            'Signal = focused work that moves goals forward (3-5 tasks).',
            'Noise = admin, interruptions, and unplanned work.',
            'The goal is not perfection - it is awareness and repeatable improvement.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="features"
        eyebrow="Features"
        title="Calendar-aware focus blocks"
        subtitle="Designed to fit into a real schedule instead of ignoring it."
      >
        <ProjectBulletList
          items={[
            'Two-way Google Calendar sync and time blocking for planned Signal work.',
            'External calendar events can fulfill planned Signal time (lecture = study time).',
            'End-of-day review with rollover suggestions for unfinished tasks.',
            'Basic analytics: Signal ratio trends and time breakdowns over weeks.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="Local-first Flutter app with secure calendar authentication."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 sm:text-base">
            Zen80 is local-first: task data lives on-device with encrypted storage, and only calendar events you
            explicitly create/mark are synced.
          </p>
          <ProjectTagList items={project.technologies} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="A calmer planning loop with a single metric that drives behavior."
      >
        <ProjectStatGrid
          items={[
            { label: 'Model', value: '80/20', description: 'Signal ratio frames the day around focus.' },
            { label: 'Planning', value: 'Daily', description: 'Morning intent + end-of-day review.' },
            { label: 'Calendar', value: 'Synced', description: 'Plans reflect real constraints and commitments.' },
            { label: 'Storage', value: 'Local', description: 'Privacy-first by default.' },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
