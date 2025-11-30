"use client"
import { useRouter } from 'next/navigation'
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react'

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
}: ProjectCardProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    planned: 'bg-gray-100 text-gray-800'
  }

  // Function to get gradient style for project cards, same as their sidebars in project_sidebar
  const getGradientStyle = (opacity1: number = 0.3, opacity2: number = 0.4, opacity3: number = 0.25) => ({
    background: `linear-gradient(135deg, ${primaryColor}${Math.round(opacity1 * 255).toString(16).padStart(2, '0')}, ${secondaryColor}${Math.round(opacity2 * 255).toString(16).padStart(2, '0')}, ${primaryColor}${Math.round(opacity3 * 255).toString(16).padStart(2, '0')})`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  })

  const router = useRouter();

  return (
    <div
      className="block group"
      onClick={() => router.push(`/projects/${slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/projects/${slug}`); }}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] cursor-pointer" 
        style={getGradientStyle()}>
        {/* Project Image */}
        <div className="h-48 flex items-center justify-center">
          {image ? (
            <img src={image} alt={title} className="w-32 h-32 object-cover" />
          ) : (
            <div className="text-6xl text-gray-300">📱</div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {date}
                </span>
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {category}
                </span>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
              {status.replace('-', ' ')}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded">
                +{technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md transition-colors">
              View Project
            </div>

            <div className="flex space-x-2">
              {demoUrl && (
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Live Demo"
                  onClick={(e) => { e.stopPropagation(); if (demoUrl) window.open(demoUrl, '_blank', 'noopener'); }}
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
              {githubUrl && (
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
  )
}
