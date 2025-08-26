"use client"

import Link from 'next/link';
import { lukesFont, crimsonText } from '@/app/fonts';
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { MotionConfig } from "framer-motion"
import { ModernAppSidebar } from "@/components/modern-app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import blogPosts from '@/data/blog-posts.json';
// Update interface as more properties are added
interface BlogPost {
  id: string;
  title: string;
  date?: string;
  description?: string;
  tags?: Array<{ name: string; color: string }>;  // Add tags to the interface
}

function getTagColorClass(notionColor: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    brown: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
  };
  
  return colorMap[notionColor] || colorMap.default;
}

export default function BlogPage() {
  // Sort posts by date (newest first)
  const posts = [...(blogPosts as BlogPost[])].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <ModernAppSidebar currentPath="/blog/posts">
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/10">
            <div className="flex items-center gap-2 px-4">
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
            <div className="py-10"></div>
                <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
                >
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.8 }}
                  className="hidden md:block md:w-1/4 lg:w-1/5 xl:w-1/6 overflow-hidden rounded-xl shadow-md"
                >
                  <img src="/images/car.jpg" alt="car" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`${lukesFont.className} text-6xl font-bold text-center`}
                >
                  My Personal Blog 🖋️
                </motion.h1>

                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.8 }}
                  className="md:hidden w-[90%] sm:w-[60%] overflow-hidden rounded-xl shadow-md"
                >
                  <img src="/images/car.jpg" alt="car" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.8 }}
                  className="w-[90%] sm:w-[60%] md:w-1/4 lg:w-1/5 xl:w-1/6 overflow-hidden rounded-xl shadow-md"
                >
                  <img src="/images/street.jpg" alt="street" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              </motion.div>
          </div>
        
          <div className="container mx-auto px-4">
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
                  className="block border border-gray-300 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <article>
                    <h2 className={`${crimsonText.className} text-4xl font-semibold mb-2`}>{post.title}</h2>
                    {post.date && <time className="text-sm text-lg text-gray-500">{new Date(post.date).toLocaleDateString()}</time>}
                    
                    {/* Display tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 my-2">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className={`px-2 py-0.5 rounded-full text-xs ${getTagColorClass(tag.color)}`}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {post.description && <p className="mt-3 text-gray-700 text-xl dark:text-gray-300">{post.description}</p>}
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
        </div>
      </MotionConfig>
    </ModernAppSidebar>
  );
}