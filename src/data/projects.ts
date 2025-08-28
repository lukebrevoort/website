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
    title: 'FlowState',
    description: 'A productivity and focus application designed to help users achieve optimal flow states with advanced tracking and analytics.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Express'],
    slug: 'flowstate',
    status: 'in-progress',
    date: 'August 2025',
    category: 'Productivity',
    featured: true,
    githubUrl: 'https://github.com/yourusername/flowstate'
  },
  {
    id: '3',
    title: 'Assignment Tracker',
    description: 'Canvas-Notion integration for seamless assignment tracking and academic workflow management.',
    technologies: ['React', 'Node.js', 'Canvas API', 'Notion API', 'MongoDB'],
    slug: 'canvas-notion',
    status: 'completed',
    date: 'July 2025',
    category: 'Education',
    featured: true,
    demoUrl: 'https://assignment-tracker-demo.com',
    githubUrl: 'https://github.com/yourusername/assignment-tracker'
  },
  {
    id: '4',
    title: 'HFTC',
    description: 'Advanced algorithmic trading system developed for competitive trading competitions with real-time market analysis and automated strategy execution.',
    technologies: ['Python', 'NumPy', 'Pandas', 'QuantLib', 'WebSocket', 'Redis'],
    slug: 'hftc',
    status: 'completed',
    date: 'June 2025',
    category: 'FinTech',
    featured: true,
    githubUrl: 'https://github.com/yourusername/hftc'
  },
  {
    id: '5',
    title: 'Job Personalizer',
    description: 'AI-powered tool for generating personalized resumes and cover letters tailored to specific job descriptions using natural language processing.',
    technologies: ['Python', 'OpenAI API', 'Flask', 'React', 'PostgreSQL', 'Docker'],
    slug: 'job-personalizer',
    status: 'in-progress',
    date: 'July 2025',
    category: 'AI/ML',
    featured: true,
    demoUrl: 'https://job-personalizer-demo.com',
    githubUrl: 'https://github.com/yourusername/job-personalizer'
  },
  {
    id: '6',
    title: 'Sentiment Analysis',
    description: 'Advanced sentiment analysis tool using machine learning to analyze text data and provide insights.',
    technologies: ['Python', 'TensorFlow', 'Flask', 'React', 'PostgreSQL'],
    slug: 'sentiment',
    status: 'completed',
    date: 'June 2025',
    category: 'AI/ML',
    featured: false,
    demoUrl: 'https://sentiment-analysis-demo.com',
    githubUrl: 'https://github.com/yourusername/sentiment-analysis'
  },
  {
    id: '7',
    title: 'Calculator',
    description: 'A modern, feature-rich calculator application with advanced mathematical functions and a sleek UI.',
    technologies: ['React', 'TypeScript', 'CSS3', 'Vercel'],
    slug: 'calculator',
    status: 'completed',
    date: 'May 2025',
    category: 'Web Development',
    featured: false,
    demoUrl: 'https://calculator-demo.com',
    githubUrl: 'https://github.com/yourusername/calculator'
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
