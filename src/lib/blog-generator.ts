import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getBlogPosts, getBlogPost } from './notion';

// Directories
const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');
const DATA_DIR = path.join(process.cwd(), 'src/data');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function generateBlogPosts(specificPostId?: string) {
  try {
    ensureDirectories();
    console.log('🔄 Fetching blog posts from Notion...');
    const posts = await getBlogPosts();
    
    // Create a data file with all posts metadata
    const postsData = posts.map((post: any) => {
      const properties = post.properties;
      return {
        id: post.id,
        slug: post.id,
        title: properties.Title?.title[0]?.plain_text || 'Untitled',
        description: properties.Description?.rich_text[0]?.plain_text || '',
        date: properties.Date?.date?.start || null,
      };
    });

    // Write posts data to a JSON file
    fs.writeFileSync(
      path.join(DATA_DIR, 'blog-posts.json'),
      JSON.stringify(postsData, null, 2)
    );

    console.log(`✅ Generated blog-posts.json with ${postsData.length} posts`);

    // If specificPostId is provided, only generate that post
    const postsToGenerate = specificPostId 
      ? posts.filter((post: any) => post.id === specificPostId)
      : posts;

    // Create individual files for each post
    for (const post of postsToGenerate) {
      const postId = post.id;
      const { markdown } = await getBlogPost(postId);
      
      // Create page file for this post
      const postDir = path.join(POSTS_DIR, postId);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Write the page.tsx file
      const pageContent = generatePostPageContent(post, markdown);
      fs.writeFileSync(path.join(postDir, 'page.tsx'), pageContent);
      
      console.log(`✅ Generated page for: ${
        'properties' in post && 
        post.properties.Title?.type === 'title' && 
        Array.isArray(post.properties.Title.title) &&
        post.properties.Title.title[0]?.plain_text || 
        postId
      }`);
    }

    return {
      success: true,
      postsGenerated: postsToGenerate.length,
      message: `Generated ${postsToGenerate.length} blog posts`
    };
  } catch (error) {
    console.error('❌ Error generating blog posts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function commitAndPushChanges() {
  try {
    // Check if there are changes to commit
    const hasChanges = execSync('git status --porcelain').toString().trim().length > 0;
    
    if (hasChanges) {
      console.log('📝 Committing changes...');
      execSync('git add .');
      execSync('git commit -m "Update blog posts from Notion via webhook"');
      console.log('🚀 Pushing to GitHub...');
      execSync('git push');
      console.log('✅ Changes pushed to GitHub');
      return { success: true, message: 'Changes committed and pushed' };
    } else {
      console.log('ℹ️ No changes to commit');
      return { success: true, message: 'No changes to commit' };
    }
  } catch (error) {
    console.error('❌ Error committing changes:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function processMarkdownImages(markdown: string): string {
  // Clean up Notion's nested image syntax
  let processed = markdown;
  
  // Fix the double-nested format: ![[text]](![](url))
  processed = processed.replace(
    /!\[\[(.*?)\]\]\(!\[\]\((.*?)\)\)/g,
    '![$1]($2)'
  );
  
  // Replace AWS S3 URLs with placeholders
  processed = processed.replace(
    /(https:\/\/prod-files-secure\.s3[^)"\s]+)/g,
    (match) => {
      // Create a simple hash for this URL
      const urlHash = Buffer.from(match).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      return `image-placeholder-${urlHash}`;
    }
  );
  
  return processed;
}

// Then update your generatePostPageContent function:
function generatePostPageContent(post: any, markdown: string) {
  const properties = post.properties;
  const title = properties.Title?.title[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString()
    : '';

  // First, process the markdown to replace AWS URLs with placeholders
  const processedMarkdown = processMarkdownImages(markdown);
  
  // Then, in the page content, restore the placeholders with our secure image component
  // But store the actual URLs in a separate constant
  const originalMarkdown = markdown;

  return `"use client"

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
  // Store processed markdown in state to avoid exposing credentials in the source
  const [content, setContent] = useState(\`${processedMarkdown.replace(/`/g, '\\`')}\`);

  // Process image URLs at runtime
  useEffect(() => {
    // This map will hold placeholders to real URLs
    const imageMap = new Map();
    
    // Extract all AWS S3 URLs from the original markdown and map them to placeholders
    const regex = /(https:\\/\\/prod-files-secure\\.s3[^)"\\s]+)/g;
    let match;
    let originalMarkdown = \`${originalMarkdown.replace(/`/g, '\\`')}\`;
    
    while ((match = regex.exec(originalMarkdown)) !== null) {
      const url = match[0];
      const urlHash = btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      const placeholder = \`image-placeholder-\${urlHash}\`;
      imageMap.set(placeholder, url);
    }
    
    // Replace placeholders with actual URLs
    let processedContent = content;
    imageMap.forEach((url, placeholder) => {
      processedContent = processedContent.replace(
        new RegExp(placeholder, 'g'),
        url
      );
    });
    
    setContent(processedContent);
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
                    <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>${title}</BreadcrumbLink>
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
              <h1 className={\`\${lukesFont.className} text-4xl font-bold mb-3\`}>${title}</h1>
              ${date ? `<time className="text-gray-500">${date}</time>` : ''}
            </header>
            
            <div className={\`prose dark:prose-invert max-w-none \${crimsonText.className}\`}>
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
}`;
}