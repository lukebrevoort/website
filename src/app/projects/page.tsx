import ProjectCard from '@/components/ProjectCard'
import { projects, getFeaturedProjects } from '@/data/projects'
import { MotionConfig } from 'framer-motion'
import { ModernAppSidebar } from "@/components/modern-app-sidebar"

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects()
  const allProjects = projects

  return (
    <ModernAppSidebar currentPath="/projects">
      <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A collection of my work spanning web development, AI/ML, and software engineering
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Projects</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Projects</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>
      </div>
    </div>
    </MotionConfig>
    </ModernAppSidebar>
  )
}