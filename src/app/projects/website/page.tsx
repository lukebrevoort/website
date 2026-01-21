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

export default function WebsitePage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const project = getProjectBySlug('website')

  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Approach', href: '#approach' },
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
        eyebrow="Digital portfolio"
        title="Personal Website"
        description="A modern portfolio that balances editorial storytelling with practical infrastructure: automated content, client-side AI, and a performance-first build pipeline."
        accentColor={project.primaryColor}
        actions={[
          project.githubUrl && { label: 'View source', href: project.githubUrl },
          project.demoUrl && { label: 'Live site', href: project.demoUrl, variant: 'secondary' },
        ].filter(Boolean) as { label: string; href: string; variant?: 'primary' | 'secondary' }[]}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="A polished web presence"
        subtitle="Designed to showcase projects, writing, and experimentation without visual noise."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-slate-600 sm:text-base">
            <p>
              The site pairs a clean editorial layout with focused interactions so each project reads like
              a short case study. The UI emphasizes clarity, typography, and calm motion.
            </p>
            <p>
              The supporting stack handles automated blog publishing, deployment previews, and a lightweight
              AI layer for interactive demos.
            </p>
          </div>
          <ProjectMedia
            src="/images/personalWebsiteUI.png"
            alt="Personal website overview"
            caption="A calm, readable layout built for narrative project walkthroughs."
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="approach"
        eyebrow="Approach"
        title="Concise, automated, consistent"
        subtitle="Three guiding principles behind the build."
      >
        <ProjectBulletList
          items={[
            'Automated publishing from Notion into markdown to keep content current.',
            'A restrained component system focused on typography, spacing, and hierarchy.',
            'Performance-first rendering with Next.js App Router and server-driven metadata.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Tools and platforms"
        subtitle="The key technologies behind the experience."
      >
        <ProjectTagList items={project.technologies} />
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Outcome"
        subtitle="The platform now doubles as a portfolio and a living product surface."
      >
        <ProjectStatGrid
          items={[
            { label: 'Publishing', value: 'Automated', description: 'Notion content updates flow directly to the site.' },
            { label: 'Performance', value: 'Optimized', description: 'Server rendering and edge deployment keep it fast.' },
            { label: 'Iteration', value: 'Rapid', description: 'Design system updates roll through every page.' },
            { label: 'Presence', value: 'Cohesive', description: 'Projects, writing, and experiments share one voice.' },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
