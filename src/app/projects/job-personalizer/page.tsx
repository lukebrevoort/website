'use client'

import { useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'

export default function JobPersonalizerPage() {
  const [activeItem, setActiveItem] = useState('#overview')

  const project = getProjectBySlug('job-personalizer')
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
              <h1 className="text-3xl font-bold text-gray-900">Job Personalizer</h1>
              <p className="mt-2 text-lg text-gray-600">
                AI-powered platform for personalizing job applications and optimizing candidate matching
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
                  The Job Personalizer leverages artificial intelligence to help job seekers create tailored applications that match specific job requirements. By analyzing job descriptions and candidate profiles, it provides personalized recommendations and optimizations.
                </p>
              </section>

              <section id="features">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">AI Analysis</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Job description parsing</li>
                      <li>• Skill gap identification</li>
                      <li>• Keyword optimization</li>
                      <li>• Match score calculation</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Personalization</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Custom resume generation</li>
                      <li>• Cover letter templates</li>
                      <li>• Interview preparation</li>
                      <li>• Application tracking</li>
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
                  The development process focused on integrating natural language processing capabilities with a user-friendly interface. The system uses machine learning algorithms to analyze job requirements and provide intelligent recommendations for application optimization.
                </p>
              </section>

              <section id="results">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results & Impact</h2>
                <p className="text-gray-600">
                  The Job Personalizer has helped job seekers improve their application success rates by providing data-driven insights and personalized optimization suggestions, leading to better job matching and increased interview opportunities.
                </p>
              </section>
            </div>
          </div>
        </main>
      </ProjectSidebar>
    </div>
  )
}
