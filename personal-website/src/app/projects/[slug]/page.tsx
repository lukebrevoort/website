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

interface ProjectContentProps {
  project: ProjectData
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const project = projects.find((p) => p.link.split('/').pop() === resolvedParams.slug)
  
  if (!project) {
    notFound()
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              
              <div className="flex gap-2 mb-6">
                {project.skills.map((skill) => (
                  <Badge key={`${project.title}-${skill.name}`} variant="secondary">
                    {skill.name}: {skill.details}
                  </Badge>
                ))}
              </div>

              {project.intros.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <p className="mb-4">{section.content}</p>
                  {section.content2 && <p className="mb-4">{section.content2}</p>}
                  {section.image && (
                    <Image
                      src={section.image}
                      alt={section.title}
                      width={800}
                      height={400}
                      className="rounded-lg"
                    />
                  )}
                </div>
              ))}

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {project.flexbar.boxes.map((box, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-lg bg-muted"
                    style={{ borderTop: `4px solid ${box.color}` }}
                  >
                    <h3 className="text-xl font-bold mb-2">{box.title}</h3>
                    <p>{box.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}