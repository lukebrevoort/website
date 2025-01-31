"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { projects } from "@/data/project-data"
import { motion } from "framer-motion"

interface ProjectData {
  title: string
  description: string
  image: string
  color: string
  skills: { name: string; details: string }[]
  link: string
  repo: string
}

interface ProjectCardProps {
  project: ProjectData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Add viewport options to improve performance
      viewport={{ once: true, margin: "0px 0px -100px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-video flex items-center justify-center">
          {/* Use Next.js Image component for automatic optimization */}
          <Image 
            src={project.image}
            alt={project.title}
            width={500}
            height={300}
            loading="lazy"
            className="object-cover w-1/2 h-auto"
          />
          <div 
            className="absolute inset-0"
            style={{ borderTop: `4px solid ${project.color}` }}
          />
        </div>
        
        {/* Rest of the component remains the same */}
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Badge key={`${project.title}-${skill.name}`} variant="secondary">
                {skill.name}: {skill.details}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2 pt-6">
          <Button asChild variant="default">
            <Link href={project.link}>View Project</Link>
          </Button>
          <Button asChild variant="outline">
            <a 
              href={project.repo} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}