"use client"

import { motion } from "framer-motion"
import { projects } from "@/data/project-data"
import { ProjectCard } from "@/components/project-card"
import { ModernAppSidebar } from "@/components/modern-app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ProjectsPage() {
  return (
    <ModernAppSidebar currentPath="/projects">
      <div className="min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">All Projects</h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </ModernAppSidebar>
  )
}