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
        description="A modern portfolio that balances editorial storytelling with practical infrastructure: automated content, client-side AI experiments, and a performance-first build pipeline."
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
              The site also acts as a sandbox for experimentation: lightweight client-side AI demos,
              automated content publishing, and rapid iteration with preview deployments.
            </p>
            <p>
              It is built to be recruiter-friendly: clear outcomes, skimmable sections, and direct links to
              source code and live demos without extra clicks.
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
            'GitHub Actions-driven workflows for content updates and deployment confidence.',
            'Client-side AI experiments via @mlc-ai/web-llm without server dependency.',
            'Monitoring/analytics feedback loop through the Vercel platform.',
            'Reusable project detail components so every case study has consistent structure and polish.',
            'Accessibility and semantic markup choices that improve scanning and SEO friendliness.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Tools and platforms"
        subtitle="The key technologies behind the experience."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 sm:text-base">
            Frontend (Next.js, React, TypeScript), UI (Tailwind + motion), platform (Vercel), and
            integrations (Notion + GitHub) work together so the site stays fast and easy to update.
          </p>
          <p className="text-sm text-slate-600 sm:text-base">
            CI and automated content workflows reduce maintenance overhead so updates stay frequent without
            introducing regressions.
          </p>
          <ProjectTagList items={project.technologies} />
        </div>
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
            { label: 'Performance', value: 'Optimized', description: 'Rendering + edge delivery keep it consistently fast.' },
            { label: 'Iteration', value: 'Rapid', description: 'Preview deployments and a shared system speed up changes.' },
            { label: 'Presence', value: 'Cohesive', description: 'Projects and writing follow the same editorial design language.' },
            { label: 'Maintenance', value: 'Lower', description: 'Shared components keep changes small and consistent.' },
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
