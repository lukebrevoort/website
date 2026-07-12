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
  emoji?: string;
  primaryColor: string;
  secondaryColor: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Personal Website",
    description:
      "The living portfolio and publishing space I use to document projects, write about what I am learning, and experiment with thoughtful web interactions.",
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
    featured: false,
    demoUrl: "https://luke.brevoort.com/",
    githubUrl: "https://github.com/lukebrevoort/website",
    logo: "/images/personalWebsiteUI.png",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
  },
  {
    id: "2",
    title: "FlowState",
    description:
      "A completed, early MCP-driven study-workflow experiment: a local-first OpenCode wrapper that brought academic context, connected apps, specialized agents, and approval-gated actions into one place.",
    technologies: ["TypeScript", "OpenCode", "MCP", "SQLite", "Notion", "Gmail", "Google Calendar"],
    slug: "flowstate",
    status: "completed",
    date: "2025 – 2026",
    image: "/icons/flowstate.png",
    category: "Productivity",
    featured: false,
    githubUrl: "https://github.com/lukebrevoort/flowstate",
    demoUrl: "https://flowstate-self.vercel.app",
    logo: "/icons/flowstate.png",
    primaryColor: "#d06224",
    secondaryColor: "#9eab57",
  },
  {
    id: "9",
    title: "MALCOM",
    description:
      "A controller for a remote, Mac-based personal coding and assistant host—keeping sessions, workspaces, policy, logs, and tool integrations inspectable across multiple coding harnesses.",
    technologies: [
      "Python",
      "CLI Design",
      "Agent Orchestration",
      "GitHub",
      "Notion",
      "Linear",
    ],
    slug: "malcom",
    status: "in-progress",
    date: "June 2026 – Present",
    category: "AI/ML",
    featured: true,
    logo: "/icons/malcom.svg",
    emoji: "🤖",
    primaryColor: "#1d4ed8",
    secondaryColor: "#0891b2",
  },
  {
    id: "10",
    title: "Orca Mail",
    description:
      "A human-first email client in progress that filters for real communication, normalizes provider mail into one model, and makes the inbox calmer through attention views and a focused writing mode.",
    technologies: [
      "TypeScript",
      "React",
      "Gmail API",
      "OAuth 2.0",
      "SQLite",
      "Drizzle",
    ],
    slug: "orca-mail",
    status: "in-progress",
    date: "July 2026 – Present",
    category: "Web Development",
    featured: true,
    logo: "/icons/orca-mail.svg",
    primaryColor: "#0f766e",
    secondaryColor: "#0369a1",
  },
  {
    id: "11",
    title: "Dispatch",
    description:
      "A local-first control plane for running multiple AI coding agents, with persistent browser terminals, worktree isolation, media sharing, and the whiteboard surface I helped shape.",
    technologies: [
      "TypeScript",
      "Bun",
      "PostgreSQL",
      "tmux",
      "MCP",
      "Product Design",
    ],
    slug: "dispatch",
    status: "in-progress",
    date: "2026 – Present",
    category: "Collaboration",
    featured: true,
    logo: "/icons/dispatch-logo-cropped.png",
    githubUrl: "https://github.com/selfcontained/dispatch",
    primaryColor: "#7c3aed",
    secondaryColor: "#db2777",
  },
  {
    id: "3",
    title: "Canvas-Notion Automation",
    description:
      "An academic workflow bridge that pulls Canvas assignments into Notion, so deadlines, priorities, grades, and submission status can live in one organized planning system.",
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
      "A competition trading system for the Stevens High-Frequency Trading Competition, combining market-making discipline with momentum-based strategies on the SHIFT platform.",
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
      "A human-in-the-loop n8n workflow that finds relevant roles, drafts tailored resumes, and requires my explicit Gmail approval before any generated material is finalized or used.",
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
    featured: false,
    logo: "/images/n8n.png",
    primaryColor: "#7c3aed",
    secondaryColor: "#ec4899",
  },
  {
    id: "6",
    title: "Zen80",
    description:
      "A Flutter productivity tracker built around Signal vs. Noise: choose the few tasks that matter, protect time for them on the calendar, and measure whether the day matched that intent.",
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
    featured: false,
    githubUrl: "https://github.com/lukebrevoort/Zen80",
    demoUrl: undefined,
    primaryColor: "#0f766e",
    secondaryColor: "#2563eb",
  },
  {
    id: "7",
    title: "while_unemployed",
    description:
      "A completed class MVP for technical-interview practice, pairing an AI interviewer, live code analysis, and voice interaction; the MVP and demo earned a 100% evaluation.",
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
    status: "completed",
    date: "2025",
    category: "AI/ML",
    featured: false,
    githubUrl: "https://github.com/lukebrevoort/while_unemployed",
    demoUrl: "https://while-unemployed.vercel.app",
    logo: "/images/whileunemployedimage.png",
    image: "/images/whileunemployedlogo.png",
    primaryColor: "#0f172a",
    secondaryColor: "#0284c7",
  },
  {
    id: "8",
    title: "SGA Finance Platform",
    description:
      "A document-automation platform for Stevens SGA Finance that turns CampusGroups exports into review-ready weekly spreadsheets and Senate-ready budget-request presentations.",
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
