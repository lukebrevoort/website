"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { crimsonText, lukesFont } from "../fonts"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MotionConfig } from "framer-motion"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

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
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/about">About</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="container mx-auto py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center gap-8 mb-16"
          >
            <div className="lg:w-1/2">
              <h1 className={`text-4xl ${lukesFont.className} mb-6`}>
                I like building things in my freetime. coding, writing, and creating :)
              </h1>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/images/greenSweater.jpg"
                alt="Me!"
                width={400}
                height={400}
                className="rounded-lg opacity-85 transition-all hover:opacity-100"
              />
            </div>
          </motion.div>

          <Card className="mb-16">
            <CardContent className="p-6">
              <h2 className={`${lukesFont.className} text-3xl mb-6`}>About:</h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>I'm Luke Brevoort a freshman at Stevens Institute of Technology in Hoboken NJ who is studying Computer Science! I am passionate about AI, Fullstack Development, and Natural Language Processing.</p>
                <p>I work on a variety of projects of different fields to learn as much as possible. From Machine Learning, Frontend Development, to Concurrency im always trying to expand my horizons which includes joining research and trying to learn as much as possible.</p>
                <p>Outside of school I enjoy Frisbee, Skiing, Weightlifting, and Lacrosse, so really anything active :). I am actively involved in the School's Student Government Association and love giving back to the Hoboken Community.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-16">
            <CardContent className="p-6">
              <h2 className={`${lukesFont.className} text-3xl mb-6`}>Education:</h2>
              <div className={`space-y-4 ${crimsonText.className}`}>
                <div>
                  <h3 className="text-2xl font-bold">Stevens Institute of Technology</h3>
                  <p className="text-muted-foreground text-lg">Bachelor of Science in Computer Science</p>
                  <Badge variant="outline">Expected May 2027</Badge>
                  <p className="mt-4">Relevant Coursework:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>Data Structures</Badge>
                    <Badge>Algorithms</Badge>
                    <Badge>Computer Architecture</Badge>
                    <Badge>Discrete Structures</Badge>
                    <Badge>Linear Algebra</Badge>
                    <Badge>Calculus</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className={`${lukesFont.className} text-3xl mb-6`}>Experience:</h2>
              <div className={`space-y-8 ${crimsonText.className}`}>
                <div>
                  <h3 className="text-2xl font-bold">Stevens NLP Lab</h3>
                  <p className="text-muted-foreground text-lg">Research Assistant</p>
                  <Badge variant="outline">December 2024 – Present</Badge>
                </div>
                <Separator />
                <div>
                  <h3 className="text-2xl font-bold">EH Yang Lab</h3>
                  <p className="text-muted-foreground text-lg">Undergraduate Researcher</p>
                  <Badge variant="outline">September 2024 – January 2025</Badge>
                </div>
                <Separator />
                <div>
                  <h3 className="text-2xl font-bold">Student Government Organization</h3>
                  <p className="text-muted-foreground text-lg">Assistant Vice President of Finance</p>
                  <Badge variant="outline">September 2024 – Present</Badge>
                </div>
                <Separator />
                <div>
                  <h3 className="text-2xl font-bold">Student Government Organization and NHS</h3>
                  <p className="text-muted-foreground text-lg">Student Body President and National Honors Society VP</p>
                  <Badge variant="outline">August 2023 – May 2024</Badge>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  )
}