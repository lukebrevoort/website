"use client"

import { Berkshire_Swash, Raleway } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"

import { lukesFont, berkshireSwash, crimsonText } from "@/app/fonts"


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { motion } from "framer-motion"

export default function Page() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="h-[500px] flex-1 rounded-xl bg-muted/50 relative"
        >
          <img 
            src="/images/hawaii.jpg" 
            alt="Hawaii" 
            className="w-full h-full object-cover rounded-xl" 
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.75 }}
            className={`absolute bottom-1/2 left-1/3 text-white text-5xl font-bold max-w-[50%] ${lukesFont.className}`}>
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
          className="flex flex-row items-center justify-center mt-8"
        >
          <h3 className={`${berkshireSwash.className} ml-14 text-4xl`}>Enjoy your Stay!</h3>
          <img src="/images/Explode.png" alt="Explosion" className="relative h-16 w-16 -top-4 -left-4" />
        </motion.div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-10">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
