"use client"

import { motion } from "framer-motion"
import { projects } from "@/data/project-data"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { notFound } from "next/navigation"
import { use } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface Box {
  title: string
  content: string
  color: string
}

interface FlexBar {
  boxes: Box[]
}

interface Skill {
  name: string
  details: string
}

interface IntroSection {
  title: string
  content: string
  content2?: string
  image?: string
}

interface Project {
  title: string
  description: string
  link: string
  image: string
  skills: Skill[]
  intros: IntroSection[]
  flexbar: FlexBar
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const project = projects.find((p) => p.link.split('/').pop() === resolvedParams.slug)
  
  if (!project) {
    notFound()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background"
        >
          <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{project.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
            >
              {project.title}
            </motion.h1>
            
            <motion.div 
              variants={itemVariants}
              className="flex gap-2 mb-6 flex-wrap"
            >
              {project.skills.map((skill) => (
                <motion.div
                  key={`${project.title}-${skill.name}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="secondary" className="transition-colors hover:bg-primary/20">
                    {skill.name}: {skill.details}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>

            {project.intros.map((section, index) => (
                <motion.div
                key={index}
                variants={itemVariants}
                className="mb-8"
                >
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <p className="mb-4 text-muted-foreground">{section.content}</p>
                {section.content2 && <p className="mb-4 text-muted-foreground">{section.content2}</p>}
                {section.image && (
                  <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                  >
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={500}
                    height={250}
                    className="rounded-lg shadow-lg"
                  />
                  </motion.div>
                )}
                </motion.div>
            ))}

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {project.flexbar.boxes.map((box, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, translateY: -5 }}
                  className="p-6 rounded-lg bg-muted/50 backdrop-blur-sm shadow-lg"
                  style={{ borderTop: `4px solid ${box.color}` }}
                >
                  <h3 className="text-xl font-bold mb-2">{box.title}</h3>
                  <p className="text-muted-foreground">{box.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}