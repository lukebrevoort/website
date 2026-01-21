'use client'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { projects, getFeaturedProjects } from '@/data/projects'
import { ModernAppSidebar } from "@/components/modern-app-sidebar"
import { crimsonText, satoshi } from '@/app/fonts'

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects()
  const allProjects = projects
  const categories = Array.from(new Set(projects.map((project) => project.category)))
  const projectCount = allProjects.length
  const featuredCount = featuredProjects.length
  const [primaryFeatured, ...secondaryFeatured] = featuredProjects

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <ModernAppSidebar currentPath="/projects">
      <motion.div
        className={`relative min-h-screen overflow-hidden py-16 ${satoshi.className}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,_rgba(59,130,246,0.18),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.18),_transparent_55%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div className="mb-12" variants={itemVariants}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Project Index
                </p>
                <h1 className={`${crimsonText.className} mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl md:text-6xl tracking-[-0.02em]`}>
                  A focused archive of product, research, and automation work.
                </h1>
                <p className="mt-4 text-base text-slate-600 sm:text-lg">
                  Each project page highlights the intent, the system design, and the measurable outcomes behind the build.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 rounded-3xl border border-white/70 bg-white/70 px-6 py-5 text-sm text-slate-600 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.55)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{projectCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Featured</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{featuredCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Focus</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">Design + Automation</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-14" variants={itemVariants}>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                All Projects
              </span>
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  {category}
                </span>
              ))}
            </div>
          </motion.div>

          {featuredProjects.length > 0 && (
            <motion.section className="mb-16" variants={itemVariants}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Featured</p>
                  <h2 className={`${crimsonText.className} mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl`}>
                    Highlighted Builds
                  </h2>
                </div>
                <p className="hidden text-sm text-slate-500 md:block">Most recent and most impactful work.</p>
              </div>

              <motion.div className="mt-8 grid gap-8 lg:grid-cols-3" variants={containerVariants}>
                {primaryFeatured && (
                  <motion.div
                    key={primaryFeatured.id}
                    variants={itemVariants}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                  >
                    <ProjectCard {...primaryFeatured} variant="featured" />
                  </motion.div>
                )}
                <div className="flex flex-col gap-8">
                  {secondaryFeatured.map((project, index) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <ProjectCard {...project} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.section>
          )}

          <motion.section variants={itemVariants}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">All Work</p>
                <h2 className={`${crimsonText.className} mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl`}>
                  Complete Archive
                </h2>
              </div>
              <p className="hidden text-sm text-slate-500 md:block">Sorted by latest additions.</p>
            </div>

            <motion.div className="mt-8 grid gap-8 md:grid-cols-2" variants={containerVariants}>
              {allProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.08 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </motion.div>
    </ModernAppSidebar>
  )
}
