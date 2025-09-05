export interface Project {
  id: string
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
  featured: boolean
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Personal Website',
    description: 'A modern, responsive personal website built with Next.js and Tailwind CSS. Features a clean design, project showcase, and contact form with a focus on performance and accessibility.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    slug: 'website',
    status: 'completed',
    date: 'August 2025',
    category: 'Web Development',
    featured: true,
    demoUrl: 'https://yourwebsite.com',
    githubUrl: 'https://github.com/yourusername/personal-website'
  },
  {
    id: '2',
    title: 'AI Agent Platform',
    description: 'An intelligent AI agent system for automated task processing and decision making. Built with Python and machine learning frameworks to handle complex workflow automation.',
    technologies: ['Python', 'FastAPI', 'OpenAI', 'PostgreSQL', 'Docker', 'Redis'],
    slug: 'ai-agent',
    status: 'in-progress',
    date: 'July 2025',
    category: 'AI/ML',
    featured: true,
    githubUrl: 'https://github.com/yourusername/ai-agent'
  },
  {
    id: '3',
    title: 'Task Manager Application',
    description: 'A comprehensive task management system with team collaboration features. Includes real-time updates, project tracking, and advanced filtering capabilities.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
    slug: 'task-manager',
    status: 'completed',
    date: 'June 2025',
    category: 'Web Development',
    featured: false,
    demoUrl: 'https://taskmanager-demo.com',
    githubUrl: 'https://github.com/yourusername/task-manager'
  }
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug)
}

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured)
}

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter(project => project.category === category)
}

export const getProjectsByStatus = (status: 'completed' | 'in-progress' | 'planned'): Project[] => {
  return projects.filter(project => project.status === status)
}