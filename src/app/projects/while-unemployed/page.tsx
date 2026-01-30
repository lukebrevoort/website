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

export default function WhileUnemployedPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const project = getProjectBySlug('while-unemployed')

  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
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
        eyebrow="Interview practice"
        title="while_unemployed"
        description="A technical interview simulator that feels closer to the real thing: an AI interviewer, live code analysis, and speech features for natural back-and-forth."
        accentColor={project.primaryColor}
        actions={[
          project.demoUrl && { label: 'Live demo', href: project.demoUrl, variant: 'secondary' },
          project.githubUrl && { label: 'View source', href: project.githubUrl },
        ].filter(Boolean) as { label: string; href: string; variant?: 'primary' | 'secondary' }[]}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="Beyond LeetCode-style practice"
        subtitle="Adds interview dynamics: communication, follow-ups, and feedback."
      >
        <ProjectBulletList
          items={[
            'Problem database + in-browser editor for real-time coding.',
            'AI interviewer asks follow-up questions based on your explanation.',
            'Session feedback covers both solution quality and communication.',
            'Encourages tradeoff discussion (complexity, edge cases, and design choices) alongside code.',
            'Turns practice into a repeatable loop: attempt, reflect, and track what to improve next time.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="features"
        eyebrow="Features"
        title="Realistic interview loop"
        subtitle="Designed to simulate the pressure and cadence of an actual screen."
      >
        <ProjectBulletList
          items={[
            'Mic/camera-enabled interview simulation with spoken responses (TTS).',
            'Speech-to-text transcription for natural conversation flow.',
            'Code analysis that generates targeted feedback and hints.',
            'Performance recording and review to spot recurring issues.',
            'Difficulty and topic coverage that helps build breadth across common interview patterns.',
            'Rubric-style feedback that highlights what to fix (logic, edge cases, communication) in the next run.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="architecture"
        eyebrow="Architecture"
        title="Streaming-first interactions"
        subtitle="Fast feedback requires real-time communication and careful orchestration."
      >
        <ProjectBulletList
          items={[
            'Socket-based real-time channel for interviewer turns, code state, and feedback.',
            'Backend agent layer orchestrates interview prompts and evaluation logic.',
            'Auth + persistence through Supabase to support saved sessions and user state.',
            'Streaming responses that keep the experience conversational instead of turn-based.',
            'Session capture (prompts, code, feedback) so reviews are reproducible and comparable over time.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="Frontend, backend, and AI integrations."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 sm:text-base">
            Built as an interactive web app with real-time infrastructure, voice features, and persistence so
            sessions feel like an actual interview and can be reviewed afterward.
          </p>
          <ProjectTagList items={project.technologies} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="Practice that rewards clear thinking and clear communication."
      >
        <ProjectStatGrid
          items={[
            { label: 'Mode', value: 'Interactive', description: 'Follow-ups adapt to what you say and write.' },
            { label: 'Feedback', value: 'Specific', description: 'Code-aware hints instead of generic advice.' },
            { label: 'Loop', value: 'Recorded', description: 'Sessions can be reviewed for improvement.' },
            { label: 'Delivery', value: 'Real-time', description: 'Socket-driven latency keeps it conversational.' },
            { label: 'Signal', value: 'Actionable', description: 'Clear next-step feedback makes practice measurable.' },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
