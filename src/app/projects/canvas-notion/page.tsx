'use client'

import { useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function JobPersonalizerPage() {
  const [activeItem, setActiveItem] = useState('#overview')

  const project = getProjectBySlug('canvas-notion')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview', current: true },
    { name: 'Features', href: '#features', current: false },
    { name: 'Technology', href: '#technology', current: false },
    { name: 'Process', href: '#process', current: false },
    { name: 'Results', href: '#results', current: false },
  ]

  const handleItemClick = (href: string) => {
    setActiveItem(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectSidebar
        projectName={project.title}
        projectLogo={project.logo}
        primaryColor={project.primaryColor}
        secondaryColor={project.secondaryColor}
        navigation={navigation}
        activeItem={activeItem}
        onItemClick={handleItemClick}
      >

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Assignment Tracker</h1>
              <p className="mt-2 text-lg text-gray-600">
                Canvas-Notion integration for seamless assignment tracking and academic workflow management
              </p>
              <div className="mt-4 flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Github className="h-4 w-4 mr-2" />
                  View Code
                </button>
              </div>
            </div>

            {/* Content sections - placeholder for you to fill in */}
            <div className="space-y-8">
              <section id="overview">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                {/* Add your overview content here */}
              </section>

              <section id="features">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                {/* Add your features content here */}
              </section>

              <section id="technology">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                {/* Add your technology content here */}
              </section>

              <section id="process">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Process</h2>
                {/* Add your process content here */}
              </section>

              <section id="results">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results & Impact</h2>
                {/* Add your results content here */}
              </section>
            </div>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  )
}
