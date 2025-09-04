'use client'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { projects, getFeaturedProjects } from '@/data/projects'
import { ModernAppSidebar } from "@/components/modern-app-sidebar"

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects()
  const allProjects = projects

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
        className="min-h-screen bg-gray-50 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of my work spanning web development, AI/ML, and software engineering
            </p>
          </motion.div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <motion.section className="mb-16" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Projects</h2>
              <motion.div 
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
              >
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard {...project} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* All Projects */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Projects</h2>
            <motion.div 
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
            >
              {allProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
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