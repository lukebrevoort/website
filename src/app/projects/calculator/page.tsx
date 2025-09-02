'use client'

import { useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function CalculatorPage() {
  const [activeItem, setActiveItem] = useState('#overview')

  const project = getProjectBySlug('calculator')
  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'Design', href: '#design' },
    { name: 'Technology', href: '#technology' },
    { name: 'Demo', href: '#demo' },
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
              <h1 className="text-3xl font-bold text-gray-900">Calculator</h1>
              <p className="mt-2 text-lg text-gray-600">
                A modern, feature-rich calculator application with advanced mathematical functions and a sleek UI
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
                  This calculator project showcases a clean, modern interface with advanced mathematical capabilities. Built with React and TypeScript, it demonstrates proper state management and user experience design principles.
                </p>
              </section>

              <section id="features">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Basic Operations</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Addition, subtraction, multiplication, division</li>
                      <li>• Decimal number support</li>
                      <li>• Clear and all-clear functions</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Advanced Functions</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Square root and power operations</li>
                      <li>• Memory functions (M+, M-, MR, MC)</li>
                      <li>• Percentage calculations</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="design">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Design</h2>
                <p className="text-gray-600">
                  The calculator features a dark, minimalist design with a focus on usability. The interface uses a grid layout for the buttons with clear visual hierarchy and responsive design for different screen sizes.
                </p>
              </section>

              <section id="technology">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.technologies.map((tech) => (
                    <div key={tech} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-sm font-medium text-gray-800">{tech}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="demo">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo</h2>
                <p className="text-gray-600">
                  Try out the calculator functionality and explore the smooth animations and responsive design.
                </p>
              </section>
            </div>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  )
}
