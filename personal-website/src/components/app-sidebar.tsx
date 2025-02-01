"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  BookText,
  Atom,
  LaptopMinimalCheck,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import Link from "next/link"

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

// This is sample data.
const data = {
  user: {
    name: "Luke Brevoort",
    email: "luke@brevoort.com",
    avatar: "/avatars/shadcn.jpg",
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
          title: "Quantum",
          url: "/models#quantum",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
