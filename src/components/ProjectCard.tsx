"use client"
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  image?: string
  demoUrl?: string
  githubUrl?: string
  slug: string
  status: 'completed' | 'in-progress' | 'planned'
  date: string
  category: string
  primaryColor?: string
  secondaryColor?: string
  logo?: string
  variant?: 'standard' | 'featured'
}

export default function ProjectCard({
  title,
  description,
  technologies,
  image,
  demoUrl,
  githubUrl,
  slug,
  status,
  date,
  category,
  primaryColor = '#3b82f6', // Default to blue if not provided
  secondaryColor = '#3b82f6', // Default to blue if not provided
  logo,
  variant = 'standard',
}: ProjectCardProps) {
  const statusColors = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
    planned: 'bg-slate-100 text-slate-600 border-slate-200'
  }

  const isFeatured = variant === 'featured'
  const gradientOverlay = {
    background: `linear-gradient(135deg, ${primaryColor}26, ${secondaryColor}26)`
  }

  const router = useRouter();

  return (
    <div
      className="group h-full"
      onClick={() => router.push(`/projects/${slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/projects/${slug}`); }}
    >
      <div
        className={`relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.65)] ${isFeatured ? 'md:flex-row' : ''}`}
      >
        <div
          className={`relative overflow-hidden ${isFeatured ? 'md:w-[48%]' : ''}`}
        >
          <div className="absolute inset-0" style={gradientOverlay} />
          {image ? (
            <img
              src={image}
              alt={title}
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isFeatured ? 'min-h-[220px]' : 'aspect-[16/9]'}`}
            />
          ) : (
            <div
              className={`flex h-full min-h-[200px] w-full items-center justify-center bg-slate-900/5 ${isFeatured ? '' : 'aspect-[16/9]'}`}
            >
              {logo ? (
                <img src={logo} alt={`${title} logo`} className="h-16 w-16 object-contain" />
              ) : (
                <span className="text-2xl font-semibold text-slate-500">{title.split(' ').map((word) => word[0]).join('')}</span>
              )}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
        </div>

        <div className={`flex flex-1 flex-col gap-4 px-5 py-6 sm:px-6 sm:py-7 ${isFeatured ? 'md:px-8 md:py-10' : ''}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{category}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{date}</p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold capitalize tracking-[0.08em] ${statusColors[status]}`}
            >
              {status.replace('-', ' ')}
            </span>
          </div>

          <p className={`text-sm text-slate-600 ${isFeatured ? 'max-w-xl' : ''}`}>
            {description}
          </p>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-slate-400">
                  +{technologies.length - 4} more
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm font-semibold text-slate-700">
                View Project
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>

              <div className="flex items-center gap-2">
                {demoUrl && (
                  <button
                    type="button"
                    className="rounded-full border border-transparent bg-white/70 p-2 text-slate-500 transition-colors hover:border-slate-200 hover:text-slate-700"
                    title="Live Demo"
                    onClick={(e) => { e.stopPropagation(); if (demoUrl) window.open(demoUrl, '_blank', 'noopener'); }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
                {githubUrl && (
                  <button
                    type="button"
                    className="rounded-full border border-transparent bg-white/70 p-2 text-slate-500 transition-colors hover:border-slate-200 hover:text-slate-700"
                    title="View Code"
                    onClick={(e) => { e.stopPropagation(); if (githubUrl) window.open(githubUrl, '_blank', 'noopener'); }}
                  >
                    <Github className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
