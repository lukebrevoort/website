"use client"

import { lukesFont, crimsonText } from "@/app/fonts"
import { ProjectCard } from "@/components/project-card"
import projects from "@/data/project-data"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { motion, MotionConfig } from "framer-motion"

export default function Page() {


  
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <MotionConfig reducedMotion="user">
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 rounded-xl bg-muted/50 relative"
        >
          <img 
            src="/images/hawaii.jpg" 
            alt="Hawaii" 
            className="w-full h-[75vh] object-cover rounded-xl" 
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.75 }}
            className={`absolute bottom-1/2 left-1/3 text-white font-bold max-w-[50%] text-3xl md:text-5xl ${lukesFont.className}`}>
            I am Luke Brevoort, I like to build stuff
          </motion.div>
        </motion.div>
        <motion.div 
          className="text-3xl font-bold mt-8 text-center leading-[1.5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.75 }}
          >
          <h1 className={`${crimsonText.className}`}>Welcome to my Website!</h1>
            <h3 className={`${crimsonText.className} max-w-[50%] mx-auto`}>I host my personal projects, photos, and other stuff I find cool on here!</h3>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.75 }}
          className="flex flex-row items-center justify-center my-8"
        >
          <h3 className={`${lukesFont.className} ml-14 text-4xl`}>Enjoy your Stay!</h3>
          <img src="/images/Explode.png" alt="Explosion" className="relative h-16 w-16 -top-4 -left-4" />
        </motion.div>
        <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        >
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50">
              <img src="/images/nycSunset.jpg" alt="NYC Sunset" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              <img src="/images/jellyfish.jpg" alt="Jellyfish" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              <img src="/images/sunset.jpg" alt="Sunset" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
        </motion.div>
        <motion.div
        className="mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        >
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50">
            <img src="/images/train.jpg" alt="NYC Sunset" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="aspect-video rounded-xl bg-muted/50">
            <img src="/images/tower.jpg" alt="Jellyfish" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="aspect-video rounded-xl bg-muted/50">
            <img src="/images/theBoys.jpg" alt="Sunset" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className={`${crimsonText.className} text-3xl font-bold mb-8 text-center`}>
            Featured Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            )).slice(0, 3)}
          </div>
        </motion.div>




      </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  )
}
