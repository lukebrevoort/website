'use client'

import { useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function WebsitePage() {
  const [activeItem, setActiveItem] = useState('#overview')

  const project = getProjectBySlug('website')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'Technology', href: '#technology' },
    { name: 'Process', href: '#process' },
    { name: 'Results', href: '#results' },
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
              <h1 className="text-3xl font-bold text-gray-900">Personal Website</h1>
              <p className="mt-2 text-lg text-gray-600">
                A modern, responsive personal website built with Next.js and Tailwind CSS
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

            {/* Content sections */}
            <div className="space-y-8">
              <section id="overview">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600">
                  This personal website showcases my projects, skills, and experience as a developer. Built with modern web technologies, it features a clean design, responsive layout, and smooth animations.
                </p>
              </section>

              <section id="features">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Design & UX</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Responsive design for all devices</li>
                      <li>• Clean, modern interface</li>
                      <li>• Smooth animations and transitions</li>
                      <li>• Dark mode support</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Functionality</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Project showcase with filtering</li>
                      <li>• Blog with markdown support</li>
                      <li>• Contact form integration</li>
                      <li>• SEO optimization</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="technology">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.technologies.map((tech) => (
                    <div key={tech} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-sm font-medium text-gray-800">{tech}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="process">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Process</h2>
                <p className="text-gray-600">
                  The development process focused on creating a fast, accessible, and maintainable codebase. I used modern React patterns, TypeScript for type safety, and Tailwind CSS for rapid styling.
                </p>
              </section>

              <section id="results">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results & Impact</h2>
                <p className="text-gray-600">
                  The website achieved excellent performance scores and provides a professional platform to showcase my work to potential employers and collaborators.
                </p>
              </section>
            </div>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  )
}