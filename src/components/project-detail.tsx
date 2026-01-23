'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ProjectSidebar from '@/components/project-sidebar'
import type { Project } from '@/data/projects'
import { crimsonText, satoshi } from '@/app/fonts'

type NavigationItem = {
  name: string
  href: string
}

type ProjectHeroAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

type ProjectStat = {
  label: string
  value: string
  description?: string
}

type ProjectPageShellProps = {
  project: Project
  navigation: NavigationItem[]
  activeItem: string
  onItemClick: (href: string) => void
  children: ReactNode
}

type ProjectHeroProps = {
  eyebrow: string
  title: string
  description: string
  actions?: ProjectHeroAction[]
  accentColor: string
}

type ProjectSectionProps = {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
}

type ProjectMediaProps = {
  src: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
}

type ProjectBulletListProps = {
  items: string[]
}

type ProjectTagListProps = {
  items: string[]
}

type ProjectStatGridProps = {
  items: ProjectStat[]
}

export function ProjectPageShell({
  project,
  navigation,
  activeItem,
  onItemClick,
  children,
}: ProjectPageShellProps) {
  const shouldReduceMotion = useReducedMotion()

  const primaryGlow = `${project.primaryColor}26`
  const secondaryGlow = `${project.secondaryColor}26`
  const backgroundStyle = {
    backgroundColor: '#f8fafc',
    backgroundImage: `radial-gradient(circle at top, ${primaryGlow}, transparent 55%), radial-gradient(circle at 80% 15%, ${secondaryGlow}, transparent 45%), radial-gradient(circle at 20% 45%, ${primaryGlow}, transparent 50%)`,
  }

  const enterAnimation = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }

  return (
    <div className={`min-h-screen ${satoshi.className}`} style={backgroundStyle}>
      <ProjectSidebar
        projectName={project.title}
        projectLogo={project.logo}
        primaryColor={project.primaryColor}
        secondaryColor={project.secondaryColor}
        navigation={navigation}
        activeItem={activeItem}
        onItemClick={onItemClick}
      >
        <main className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="space-y-16 sm:space-y-20"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={enterAnimation}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  )
}

export function ProjectHero({
  eyebrow,
  title,
  description,
  actions = [],
  accentColor,
}: ProjectHeroProps) {
  const primaryAction = actions.find((action) => action.variant !== 'secondary')
  const secondaryActions = actions.filter((action) => action !== primaryAction)

  return (
    <section className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.32em]" style={{ color: accentColor }}>
        {eyebrow}
      </p>
      <h1 className={`${crimsonText.className} mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl tracking-[-0.02em]`}>
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
        {description}
      </p>
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {primaryAction && (
            <a
              href={primaryAction.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {primaryAction.label}
            </a>
          )}
          {secondaryActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300"
            >
              {action.label}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}

export function ProjectSection({ id, eyebrow, title, subtitle, children }: ProjectSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="lg:w-1/3">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              {eyebrow}
            </p>
          )}
          <h2 className={`${crimsonText.className} mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl`}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <div className="lg:flex-1">
          {children}
        </div>
      </div>
    </section>
  )
}

export function ProjectMedia({ src, alt, caption, type = 'image' }: ProjectMediaProps) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)]">
      {type === 'video' ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
      {caption && (
        <figcaption className="border-t border-white/60 bg-white/70 px-5 py-4 text-sm text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export function ProjectBulletList({ items }: ProjectBulletListProps) {
  return (
    <ul className="space-y-3 text-sm text-slate-600 sm:text-base">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ProjectTagList({ items }: ProjectTagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function ProjectStatGrid({ items }: ProjectStatGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_18px_40px_-35px_rgba(15,23,42,0.5)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
          {item.description && (
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
