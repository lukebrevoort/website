"use client"

import { motion } from "framer-motion"
import { projects } from "@/data/project-data"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { notFound } from "next/navigation"
import { use } from "react"


export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const project = projects.find((p) => p.link.split('/').pop() === resolvedParams.slug)
  
  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex gap-2 mb-6">
          {project.skills.map((skill) => (
            <Badge key={skill.name} variant="secondary">
              {skill.name}: {skill.details}
            </Badge>
          ))}
        </div>
        
        {project.intros.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <p className="mb-4">{section.content}</p>
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
      </motion.div>
    </div>
  )
}