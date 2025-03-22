const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { NotionConverter } = require('notion-to-md');
const { DefaultExporter } = require('notion-to-md/plugins/exporter');

const pageId = process.argv[2];

const notion = new Client({ auth: process.env.NOTION_API_KEY });

if (!pageId) {
  console.error('Error: No page ID provided');
  process.exit(1);
}

const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');
const DATA_DIR = path.join(process.cwd(), 'src/data');

function ensureDirectories() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function createImageMapping(postId, markdown) {
  // Extract image URLs from markdown
  const imageMap = {};
  const regex = /(https:\/\/prod-files-secure\.s3[^)"\s]+)/g;
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    const url = match[0];
    const urlHash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    const placeholder = `image-placeholder-${urlHash}`;
    imageMap[placeholder] = url;
  }
  
  // Save the mapping
  const privateDir = path.join(process.cwd(), '.private');
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(privateDir, `${postId}.json`),
    JSON.stringify(imageMap, null, 2)
  );
  
  console.log(`Created image mapping for post ${postId} with ${Object.keys(imageMap).length} images`);
  
  return imageMap;
}

function generatePostPageContent(post, markdown) {
  // Get properties
  const properties = post.properties;
  const title = properties.Title?.title[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString()
    : '';
    
  // Create image mapping
  const imageMap = createImageMapping(post.id, markdown);
  
  // Process the markdown to replace AWS URLs with placeholders
  let processedMarkdown = markdown;
  Object.entries(imageMap).forEach(([placeholder, url]) => {
    processedMarkdown = processedMarkdown.replace(
      new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      placeholder
    );
  });

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
  // Store processed markdown in state
  const [content, setContent] = useState(\`${processedMarkdown.replace(/`/g, '\\`')}\`);

  // Process image URLs at runtime
  useEffect(() => {
    // Load image map (placeholders -> URLs) from external API or server-side logic
    fetch('/api/image-map?postId=${post.id}')
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

async function getBlogPosts() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
  
  if (!databaseId) {
    throw new Error('NOTION_BLOG_DATABASE_ID is required');
  }

  // Query the database for published posts
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true
      }
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending'
      }
    ]
  });

  return response.results;
}

async function getBlogPost(pageId) {
  // First, retrieve the page data
  const page = await notion.pages.retrieve({ page_id: pageId });
  
  const buffer = {};

  const exporter = new DefaultExporter({
      outputType: 'buffer',
      buffer: buffer
  });
  
  // Initialize the converter with the string exporter
  const n2m = new NotionConverter(notion)
    .withExporter(exporter);
    
  // Convert the page to markdown
  await n2m.convert(pageId);
  
  // Get the markdown content
  const markdown = buffer[pageId] || '';
  
  return {
    page,
    markdown,
  };
}

// Main function
async function generateBlogPost() {
  try {
    console.log(`Generating blog post for page ID: ${pageId}`);
    
    // Ensure directories exist
    ensureDirectories();
    
    // Get all blog posts to update the metadata file
    console.log('Fetching all blog posts for metadata...');
    const allPosts = await getBlogPosts();
    
    // Update the blog-posts.json file
    const postsData = allPosts.map(post => ({
      id: post.id,
      slug: post.id,
      title: post.properties.Title?.title[0]?.plain_text || 'Untitled',
      description: post.properties.Description?.rich_text[0]?.plain_text || '',
      date: post.properties.Date?.date?.start || null,
    }));
    
    fs.writeFileSync(
      path.join(DATA_DIR, 'blog-posts.json'),
      JSON.stringify(postsData, null, 2)
    );
    
    console.log(`Updated blog-posts.json with ${postsData.length} posts`);
    
    // Get the specific post we want to generate
    console.log(`Fetching content for page ${pageId}...`);
    const { page, markdown } = await getBlogPost(pageId);
    
    // Generate the page.tsx file
    const postDir = path.join(POSTS_DIR, pageId);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    
    console.log(`Generating React component for post...`);
    const pageContent = generatePostPageContent(page, markdown);
    fs.writeFileSync(path.join(postDir, 'page.tsx'), pageContent);
    
    console.log(`Generated blog post: ${
      page.properties.Title?.title[0]?.plain_text || pageId
    }`);
    
    // Commit and push changes
    console.log('Checking for changes...');
    
    console.log('Blog post generated successfully!');
  } catch (error) {
    console.error('Error generating blog post:', error);
    process.exit(1);
  }
}

// Run the main function
generateBlogPost();