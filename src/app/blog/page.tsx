import { getBlogPosts } from '@/lib/notion';
import Link from 'next/link';
import { lukesFont, crimsonText } from '@/app/fonts';
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MotionConfig } from "framer-motion"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const revalidate = 3600; // Revalidate at most every hour

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
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
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        </div>
    </header>
    <div className="container mx-auto py-10 px-4">
      <h1 className={`${lukesFont.className} text-4xl font-bold mb-10`}>Blog</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => {
          const properties = post.properties;
          const title = properties.Title?.title[0]?.plain_text || 'Untitled';
          const description = properties.Description?.rich_text[0]?.plain_text || '';
          const date = properties.Date?.date?.start 
            ? new Date(properties.Date.date.start).toLocaleDateString() 
            : '';
          
          return (
            <Link 
              href={`/blog/${post.id}`} 
              key={post.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <article>
                <h2 className={`${crimsonText.className} text-2xl font-semibold mb-2`}>{title}</h2>
                {date && <time className="text-sm text-gray-500">{date}</time>}
                {description && <p className="mt-3 text-gray-700 dark:text-gray-300">{description}</p>}
              </article>
            </Link>
          );
        })}
      </div>
      
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