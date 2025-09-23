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
  // Project sidebar customization
  logo: string
  primaryColor: string
  secondaryColor: string
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Personal Website',
    description: 'A modern, responsive personal website built with Next.js and Tailwind CSS. Features a clean design, project showcase, and contact form with a focus on performance and accessibility.',
    technologies: ['TypeScript', 'Vercel', 'Github Actions', 'WebLLM', 'Next.js', 'Tailwind CSS'],
    slug: 'website',
    image: '/images/babyluke.jpeg',
    status: 'completed',
    date: 'August 2025',
    category: 'Web Development',
    featured: true,
    demoUrl: 'https://luke.brevoort.com/',
    githubUrl: 'https://github.com/lukebrevoort/website',
    logo: '/icons/github-mark.svg',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  },
  {
    id: '2',
    title: 'FlowState',
    description: 'A productivity and focus application designed to help users achieve optimal study and work sessions through AI-driven task management and time tracking.',
    technologies: ['Python', 'TypeScript', 'FastAPI', 'LangGraph', 'Express'],
    slug: 'flowstate',
    status: 'in-progress',
    date: 'August 2025',
    image: '/icons/flowstate.png',
    category: 'Productivity',
    featured: true,
    githubUrl: 'https://github.com/lukebrevoort/flowstate',
    demoUrl: 'https://flowstate-self.vercel.app',
    logo: '/icons/flowstate.png',
    primaryColor: '#d06224',
    secondaryColor: '#9eab57'
  },  
  {
    id: '3',
    title: 'Canvas-Notion Automation',
    description: 'Canvas-Notion integration for seamless assignment tracking and academic workflow management.',
    technologies: ['Python', 'Canvas API', 'Notion API', 'Data Modeling', 'Automation'],
    slug: 'canvas-notion',
    image: '/images/canvas-notion.png',
    status: 'completed',
    date: 'July 2025',
    category: 'Education',
    featured: true,
    githubUrl: 'https://github.com/lukebrevoort/CanvasToNotion',
    logo: '/images/canvas-notion.png',
    primaryColor: '#dc2626',
    secondaryColor: '#000000'
  },
  {
    id: '4',
    title: 'HFTC',
    description: 'Advanced algorithmic trading system developed for competitive trading competitions with real-time market analysis and automated strategy execution.',
    technologies: ['Python', 'Algorithm Development', 'Backtrader', 'Market Making', 'Momentum Arbitrage'],
    slug: 'hftc',
    status: 'completed',
    image: '/images/hanlon.png',
    date: 'June 2025',
    category: 'FinTech',
    featured: true,
    logo: '/images/hanlon.png',
    primaryColor: '#10b981',
    secondaryColor: '#3b82f6'
  },
  {
    id: '5',
    title: 'Job Personalizer',
    description: 'AI-powered tool for generating personalized resumes and cover letters tailored to specific job descriptions using natural language processing.',
    technologies: ['Python', 'Ollama', 'LaTeX', 'Notion API', 'Llama 3.2'],
    slug: 'job-personalizer',
    status: 'in-progress',
    date: 'July 2025',
    category: 'AI/ML',
    image: '/images/jobpersonalize.png',
    featured: true,
    githubUrl: 'https://github.com/lukebrevoort/job-application-automator',
    logo: '/images/jobpersonalize.png',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899'
  },
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
