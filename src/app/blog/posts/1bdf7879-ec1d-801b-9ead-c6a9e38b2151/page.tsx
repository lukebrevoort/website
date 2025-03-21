"use client"

import { lukesFont, crimsonText } from '@/app/fonts';
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { MotionConfig } from "framer-motion";
import dynamic from 'next/dynamic';
import SecureImage from "@/components/secure-image";
import { useState, useEffect } from "react";

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });

export default function BlogPost() {
  // Store processed markdown in state
  const [content, setContent] = useState(`# PLEASE

`);

  // Process image URLs at runtime
  useEffect(() => {
    // Load image map (placeholders -> URLs) from external API or server-side logic
    // This avoids storing credentials in client-side code
    fetch('/api/image-map?postId=1bdf7879-ec1d-801b-9ead-c6a9e38b2151')
      .then(res => res.json())
      .then(imageMap => {
        let processedContent = content;
        // Replace placeholders with actual URLs
        Object.entries(imageMap).forEach(([placeholder, url]) => {
          processedContent = processedContent.replace(
            new RegExp(placeholder, 'g'),
            String(url)
          );
        });
        setContent(processedContent);
      })
      .catch(err => console.error('Error fetching image map:', err));
  }, []);

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
                    <BreadcrumbLink href="/blog/posts">Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>This is a new blog post im making</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <motion.article 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-10 px-4 max-w-3xl"
          >
            <header className="mb-10">
              <h1 className={`${lukesFont.className} text-4xl font-bold mb-3`}>This is a new blog post im making</h1>
              <time className="text-gray-500">3/20/2025</time>
            </header>
            
            <div className={`prose dark:prose-invert max-w-none ${crimsonText.className}`}>
              <ReactMarkdown components={{
                img: ({ node, ...props }) => (
                  <SecureImage 
                    src={props.src || ''} 
                    alt={props.alt || ''} 
                    className="my-4 rounded-md" 
                  />
                ),
              }}>{content}</ReactMarkdown>
            </div>
          </motion.article>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}