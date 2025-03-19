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
        
        <div className="container mx-auto py-8 px-4" id="history">
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
                <p>I&apos;m Luke Brevoort a freshman at Stevens Institute of Technology in Hoboken NJ who is studying Computer Science! I am passionate about AI, Fullstack Development, and Natural Language Processing.</p>
                <p>I work on a variety of projects of different fields to learn as much as possible. From Machine Learning, Frontend Development, to Concurrency im always trying to expand my horizons which includes joining research and trying to learn as much as possible.</p>
                <p>Outside of school I enjoy Frisbee, Skiing, Weightlifting, and Lacrosse, so really anything active :). I am actively involved in the Schools Student Government Association and love giving back to the Hoboken Community.</p>
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

            <motion.div 
            className="flex justify-center w-full mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ 
              once: true,  // Makes the animation happen only once
              amount: 0.3, // Triggers when 30% of the element is in view
              margin: "0px 0px -100px 0px" // Offset for when animation triggers
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ opacity: 1 }}
            >
            <div className="w-1/2">
              <Image 
              src="/images/rainnyc.jpg" 
              alt="NYC rainy" 
              width={600} 
              height={300} 
              className="rounded-lg w-full"
              />
            </div>
            </motion.div>

          <Card className="mb-16">
            <CardContent className="p-6">
              <h2 className={`${lukesFont.className} text-4xl mb-6`}>Skills:</h2>
              <div className={`space-y-6 ${crimsonText.className}`}>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Python</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>JavaScript</Badge>
                    <Badge>Java</Badge>
                    <Badge>SQL</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Web Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>TailwindCSS</Badge>
                    <Badge>HTML/CSS</Badge>
                    <Badge>REST APIs</Badge>
                    <Badge>WebLLM</Badge>
                    <Badge>NumPy</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tools & Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Git</Badge>
                    <Badge>Docker</Badge>
                    <Badge>AWS</Badge>
                    <Badge>Linux</Badge>
                    <Badge>VS Code</Badge>
                    <Badge>PostgreSQL</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div 
            className="flex justify-center w-full mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ 
              once: true,  // Makes the animation happen only once
              amount: 0.3, // Triggers when 30% of the element is in view
              margin: "0px 0px -100px 0px" // Offset for when animation triggers
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ opacity: 1 }}
            id="experience"
            >
            <div className="w-1/2">
              <Image 
              src="/images/crocs.jpg" 
              alt="NYC rainy" 
              width={600} 
              height={300} 
              className="rounded-lg w-full"
              />
            </div>
            </motion.div>


            <Card>
            <CardContent className="p-6">
              <h2 className={`${lukesFont.className} text-3xl mb-6`}>Experience:</h2>
              <div className={`space-y-8 ${crimsonText.className}`}>
              {[
                {
                title: "Stevens NLP Lab",
                role: "Research Assistant",
                date: "December 2024 – Present"
                },
                {
                title: "EH Yang Lab",
                role: "Undergraduate Researcher",
                date: "September 2024 – January 2025"
                },
                {
                title: "Student Government Organization",
                role: "Assistant Vice President of Finance",
                date: "September 2024 – Present"
                },
                {
                title: "Student Government Organization and NHS",
                role: "Student Body President and National Honors Society VP",
                date: "August 2023 – May 2024"
                }
              ].map((item, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                >
                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.role}</p>
                  <Badge variant="outline">{item.date}</Badge>
                </div>
                {index < 3 && <Separator className="mt-8" />}
                </motion.div>
              ))}
              </div>
            </CardContent>
            </Card>

            <motion.div 
            className="flex justify-center w-full mb-2 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ 
              once: true,  // Makes the animation happen only once
              amount: 0.3, // Triggers when 30% of the element is in view
              margin: "0px 0px -100px 0px" // Offset for when animation triggers
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ opacity: 1 }}
            id="experience"
            >
            <div className="w-1/2">
              <Image 
              src="/images/babyluke.jpeg" 
              alt="Baby Luke!" 
              width={300} 
              height={250} 
              className="rounded-lg w-full"
              />
            </div>
            </motion.div>



        </div>

        <Card className="mt-16 mb-8" id="contact">
          <CardContent className="p-6">
            <h2 className={`${lukesFont.className} text-3xl mb-6`}>Contact:</h2>
            <div className="flex justify-center gap-6">
              {[
          {
            href: "https://github.com/lukebrevoort",
            src: "/icons/github-mark.svg",
            alt: "GitHub"
          },
          {
            href: "https://bsky.app/profile/luke-brev.bsky.social",
            src: "/icons/bluesky.png", 
            alt: "Bluesky"
          },
          {
            href: "https://www.linkedin.com/in/luke-brevoort-6a545626a/",
            src: "/icons/linkedin.png",
            alt: "LinkedIn"
          },
          {
            href: "mailto:luke@brevoort.com",
            src: "/icons/gmail.svg",
            alt: "Email"
          },
          {
            href: "https://instagram.com/luke.brev",
            src: "/icons/instagram.svg",
            alt: "Instagram" 
          }
              ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              ease: "easeOut"
            }}
          >
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              <Image 
                src={item.src} 
                alt={item.alt} 
                width={64} 
                height={64} 
                className="opacity-85 hover:opacity-100 transition-all"
              />
            </a>
          </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

      </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  )
}