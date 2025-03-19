"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  BookText,
  Atom,
  LaptopMinimalCheck,
  PieChart,
  SquareTerminal,
  MoreHorizontal,
  NotebookPen,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { HomeButton } from "@/components/home-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Luke Brevoort",
    email: "luke@brevoort.com",
    avatar: "/images/avatar.jpg",
  },
  teams: [
    {
      name: "luke.brev",
      logo: Atom,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "About Me",
      url: "/about", // Updated URL
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/about#history",
        },
        {
          title: "Experience",
          url: "/about#experience", 
        },
        {
          title: "Contact",
          url: "/about#contact",
        },
      ],
    },
    {
      title: "Models",
      url: "/models",
      icon: Bot,
      items: [
        {
          title: "Llama",
          url: "/models#llama",
        },
        {
          title: "DeepSeekR1",
          url: "/models#deepseekr1",
        },
        {
          title: "Leetcode",
          url: "/models#leetcode",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/documentation#introduction",
        },
        {
          title: "Get Started",
          url: "/documentation#gettingstarted",
        },
        {
          title: "Tutorials",
          url: "/documentation#tutorial",
        },
      ],
    },
    {
      title: "Blog",
      url: "/blog",
      icon: NotebookPen,
      items: [ // Placeholders, will eventually be fetched from most recent posts
        {
          title: "Tech",
          url: "/blog#tech",
        },
        {
          title: "Personal",
          url: "/blog#personal",
        },
        {
          title: "Projects",
          url: "/blog#projects",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Assignment Tracker",
      url: "/projects/canvas-notion",
      icon: BookText,
    },
    {
      name: "Sentiment Analysis",
      url: "/projects/canvas-notion",
      icon: PieChart,
    },
    {
      name: "Personal Website",
      url: "/projects/website",
      icon: LaptopMinimalCheck,
    },
    {
      name: "More",
      url: "/projects",
      icon: MoreHorizontal,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HomeButton />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} teams={data.teams} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
