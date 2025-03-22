"use client"

import Link from 'next/link';
import { lukesFont, crimsonText } from '@/app/fonts';
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MotionConfig } from "framer-motion"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import blogPosts from '@/data/blog-posts.json';
// Update interface as more properties are added
interface BlogPost {
  id: string;
  title: string;
  date?: string;
  description?: string;
}

export default function BlogPage() {
  // Sort posts by date (newest first)
  const posts = [...(blogPosts as BlogPost[])].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
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
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="container mx-auto py-10 px-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${lukesFont.className} text-4xl font-bold mb-10`}
            >
              Blog
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={`/blog/posts/${post.id}`} 
                    className="block border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <article>
                      <h2 className={`${crimsonText.className} text-2xl font-semibold mb-2`}>{post.title}</h2>
                      {post.date && <time className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</time>}
                      {post.description && <p className="mt-3 text-gray-700 dark:text-gray-300">{post.description}</p>}
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            {posts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No blog posts found.</p>
              </div>
            )}
          </div>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}