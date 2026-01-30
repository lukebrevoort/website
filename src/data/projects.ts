export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  slug: string;
  status: "completed" | "in-progress" | "planned";
  date: string;
  category: string;
  featured: boolean;
  // Project sidebar customization
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Personal Website",
    description:
      "A modern, responsive personal website built with Next.js and Tailwind CSS. Features a clean design, project showcase, and contact form with a focus on performance and accessibility.",
    technologies: [
      "TypeScript",
      "Vercel",
      "Github Actions",
      "WebLLM",
      "Next.js",
      "Tailwind CSS",
    ],
    slug: "website",
    image: "/images/babyluke.jpeg",
    status: "completed",
    date: "August 2025",
    category: "Web Development",
    featured: true,
    demoUrl: "https://luke.brevoort.com/",
    githubUrl: "https://github.com/lukebrevoort/website",
    logo: "/icons/github-mark.svg",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
  },
  {
    id: "2",
    title: "FlowState",
    description:
      "A productivity and focus application designed to help users achieve optimal study and work sessions through AI-driven task management and time tracking.",
    technologies: ["Python", "TypeScript", "FastAPI", "LangGraph", "Express"],
    slug: "flowstate",
    status: "in-progress",
    date: "August 2025",
    image: "/icons/flowstate.png",
    category: "Productivity",
    featured: true,
    githubUrl: "https://github.com/lukebrevoort/flowstate",
    demoUrl: "https://flowstate-self.vercel.app",
    logo: "/icons/flowstate.png",
    primaryColor: "#d06224",
    secondaryColor: "#9eab57",
  },
  {
    id: "3",
    title: "Canvas-Notion Automation",
    description:
      "Canvas-Notion integration for seamless assignment tracking and academic workflow management.",
    technologies: [
      "Python",
      "Canvas API",
      "Notion API",
      "Data Modeling",
      "Automation",
    ],
    slug: "canvas-notion",
    image: "/images/canvas-notion.png",
    status: "completed",
    date: "July 2025",
    category: "Education",
    featured: false,
    githubUrl: "https://github.com/lukebrevoort/CanvasToNotion",
    logo: "/images/canvas-notion.png",
    primaryColor: "#dc2626",
    secondaryColor: "#000000",
  },
  {
    id: "4",
    title: "HFTC",
    description:
      "Advanced algorithmic trading system developed for competitive trading competitions with real-time market analysis and automated strategy execution.",
    technologies: [
      "Python",
      "Algorithm Development",
      "Backtrader",
      "Market Making",
      "Momentum Arbitrage",
    ],
    slug: "hftc",
    status: "completed",
    image: "/images/hanlon.png",
    date: "June 2025",
    category: "FinTech",
    featured: false,
    logo: "/images/hanlon.png",
    primaryColor: "#10b981",
    secondaryColor: "#3b82f6",
  },
  {
    id: "5",
    title: "n8n Job Personalizer",
    description:
      "Automated resume personalization workflow using n8n with Slack integration for job selection, dual-LLM processing for skill extraction and resume optimization, and Gmail-based human-in-the-loop approval.",
    technologies: [
      "n8n",
      "Slack",
      "Gmail",
      "Notion API",
      "Ollama",
      "Typst",
      "HTTP Requests",
    ],
    slug: "job-personalizer",
    status: "completed",
    date: "July 2025",
    category: "AI/ML",
    image: "/images/n8n.png",
    featured: true,
    logo: "/images/n8n.png",
    primaryColor: "#7c3aed",
    secondaryColor: "#ec4899",
  },
  {
    id: "6",
    title: "Zen80",
    description:
      "A Flutter productivity tracker built around the Signal vs Noise philosophy, with Google Calendar sync, time tracking, and daily planning workflows.",
    technologies: [
      "Flutter",
      "Dart",
      "Google Calendar API",
      "Hive",
      "Provider",
      "OAuth2",
    ],
    slug: "zen80",
    status: "in-progress",
    date: "2025",
    category: "Productivity",
    image: "/images/zen80logo.png",
    logo: "/images/zen80logo.png",
    featured: true,
    githubUrl: "https://github.com/lukebrevoort/Zen80",
    demoUrl: undefined,
    primaryColor: "#0f766e",
    secondaryColor: "#2563eb",
  },
  {
    id: "7",
    title: "while_unemployed",
    description:
      "A realistic technical interview simulator with an AI interviewer, live code analysis, and speech features for a more authentic practice loop than standard coding sites.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "Socket.IO",
      "Supabase",
      "OpenAI",
    ],
    slug: "while-unemployed",
    status: "in-progress",
    date: "2025",
    category: "AI/ML",
    featured: false,
    githubUrl: "https://github.com/lukebrevoort/while_unemployed",
    demoUrl: "https://while-unemployed.vercel.app",
    image: "/images/whileunemployedlogo.png",
    logo: "/images/whileunemployedimage.png",
    primaryColor: "#0f172a",
    secondaryColor: "#0284c7",
  },
  {
    id: "8",
    title: "SGA Finance Platform",
    description:
      "A platform for Stevens Institute of Technology that automates budget request slideshows and spreadsheets for SGA finance workflows.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Vercel",
      "Google Sheets",
      "Google Slides",
      "Automation",
    ],
    slug: "sga-finance",
    status: "completed",
    date: "2025",
    category: "FinTech",
    featured: false,
    logo: "/images/sgalogo.jpeg",
    image: "/images/sgalogo.jpeg",
    githubUrl: "https://github.com/lukebrevoort/sga-finance-platform",
    demoUrl: "https://sga-finance-platorm.vercel.app",
    primaryColor: "#16a34a",
    secondaryColor: "#0f172a",
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter((project) => project.category === category);
};

export const getProjectsByStatus = (
  status: "completed" | "in-progress" | "planned",
): Project[] => {
  return projects.filter((project) => project.status === status);
};
