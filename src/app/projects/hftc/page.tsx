'use client'

import { useState } from 'react'
import { ChevronLeft, ExternalLink, Github, Menu, X } from 'lucide-react'
import Link from 'next/link'
import ProjectSidebar from '@/components/project-sidebar'
import { getProjectBySlug } from '@/data/projects'


export default function HFTCPage() {
  const [activeItem, setActiveItem] = useState('#overview')

  const project = getProjectBySlug('hftc')
  if (!project) {
    return <div>Project not found</div>
  }

  const handleItemClick = (href: string) => {
    setActiveItem(href)
  }
  
  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'Technology', href: '#technology' },
    { name: 'Process', href: '#process' },
    { name: 'Results', href: '#results' },
  ]
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
            <h1 className="text-3xl font-bold text-gray-900">HFTC</h1>
            <p className="mt-2 text-lg text-gray-600">
              Advanced algorithmic trading system developed for competitive trading competitions with real-time market analysis and automated strategy execution
            </p>
            <div className="mt-4 flex space-x-3">
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
                HFTC is a sophisticated algorithmic trading system designed for high-frequency trading competitions. It leverages advanced mathematical models and real-time data processing to execute trades with microsecond precision.
              </p>
            </section>

            <section id="features">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Trading Capabilities</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Real-time market data processing</li>
                    <li>• Automated strategy execution</li>
                    <li>• Risk management systems</li>
                    <li>• Portfolio optimization</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Performance metrics tracking</li>
                    <li>• Market analysis algorithms</li>
                    <li>• Backtesting framework</li>
                    <li>• Real-time monitoring</li>
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
                The development process focused on creating a high-performance, low-latency trading system. Extensive backtesting and optimization were performed to ensure competitive performance in trading competitions.
              </p>
            </section>

            <section id="results">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Results & Impact</h2>
              <p className="text-gray-600">
                The HFTC system achieved top-tier performance in algorithmic trading competitions, demonstrating effective strategy execution and risk management capabilities.
              </p>
            </section>
          </div>
        </div>
      </main>
      </ProjectSidebar>
    </div>
  )
}
