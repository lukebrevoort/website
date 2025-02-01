"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { lukesFont, crimsonText } from "../fonts"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocumentationPage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background">
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
                  <BreadcrumbLink href="/documentation">Documentation</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-8 px-4 space-y-8"
          >
            {/* Introduction Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              id="introduction"
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className={`${lukesFont.className} text-4xl`}>
                    Introduction to AI Models
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-lg">
                  <p>
                    Welcome to the AI Models documentation. This guide will help you understand and effectively use the different AI models available on this platform. My website currently hosts three models, each designed for specific tasks and use cases:
                  </p>
                  <ul>
                    <li><strong>Llama 3.8B</strong> - A general-purpose language model</li>
                    <li><strong>DeepSeek R1</strong> - Specialized in complex reasoning tasks</li>
                    <li><strong>LeetCode Assistant</strong> - Focused on programming and algorithm problems</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.section>

            <motion.div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-xl"
                >
                    <Image 
                      src="/icons/deepseek.png" 
                      alt="NYC Sunset" 
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-xl" 
                    />
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-xl"
                >
                    <Image 
                      src="/icons/meta.png" 
                      alt="Jellyfish" 
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-xl" 
                    />
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-xl"
                >
                    <Image 
                      src="/icons/leetcode.webp" 
                      alt="Sunset" 
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-xl" 
                    />
                </motion.div>
            </motion.div>

            {/* Getting Started Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              id="gettingstarted"
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className={`${lukesFont.className} text-4xl`}>
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <h3 className={`font-bold text-2xl`}>Quick Setup Guide</h3>
                  <ol className='text-lg'>
                    <li>Select a model from the dropdown menu</li>
                    <br />
                    <li>Click "Download Model" and wait for initialization</li>
                    <Image 
                      src='/images/progress.png' 
                      alt='Progress Bar' 
                      width={800}
                      height={400}
                      className='w-full' 
                    />
                    <br />
                    <li>Once loaded, the chat interface will become active</li>
                    <li>Type your message and press Enter or click Send</li>
                    <Image 
                      src='/images/chat.png' 
                      alt='Chat Interface' 
                      width={800}
                      height={400}
                      className='w-full' 
                    />
                    <br />
                  </ol>
                  
                  <h3 className='font-bold text-2xl'>System Requirements</h3>
                  <ul>
                    <li>Modern web browser with WebGPU support</li>
                    <li><strong>Minimum 4GB RAM for basic models</strong></li>
                    <li>8GB+ RAM recommended for DeepSeek R1</li>
                    <li>Stable internet connection for initial model download</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.section>

            {/* Tutorial Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              id="tutorial"
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className={`${lukesFont.className} text-4xl`}>
                    Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <h3 className="font-bold text-3xl">Step-by-Step Guide</h3>
                  <br />
                  
                  <h4 className="font-bold text-2xl">1. Model Selection</h4>
                  <p>Choose the appropriate model based on your needs:</p>
                  <ul>
                    <li><strong>Llama 3.8B</strong> - Best for general conversations and tasks</li>
                    <li><strong>DeepSeek R1</strong> - Ideal for complex problem-solving</li>
                    <li><strong>LeetCode Assistant</strong> - Perfect for programming help</li>
                  </ul>
                  <br />

                  <h4 className="font-bold text-2xl">2. Model Initialization</h4>
                  <p>After selecting your model:</p>
                  <ul>
                    <li>Click "Download Model"</li>
                    <li>Monitor the progress bar</li>
                    <li>Wait for completion message</li>
                  </ul>
                  <br />

                  <h4 className="font-bold text-2xl">3. Using the Chat Interface</h4>
                  <p>Best practices for interaction:</p>
                  <ul>
                    <li>Be specific in your questions</li>
                    <li>Use clear, concise language</li>
                    <li>Check the usage stats for performance metrics</li>
                    <li>Press Shift + Enter for new lines</li>
                  </ul>
                  <br />

                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <h4>Pro Tips</h4>
                    <ul>
                      <li>Models retain context within the conversation</li>
                      <li>You can scroll through chat history</li>
                      <li>Usage statistics show model performance</li>
                      <li>Models can be switched mid-conversation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </motion.div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}