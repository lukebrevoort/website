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
  const imageMap = {};
  
  // Enhanced regex to catch more AWS URL patterns
  const awsUrlPatterns = [
    // Standard AWS S3 URLs
    /(https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^)\s"`'<>]+)/g,
    
    // URLs with credentials in them
    /(https:\/\/[^\s"`'<>)]+(?:Credential=|X-Amz-Credential=|AWSAccessKeyId=|Security-Token=)[^\s"`'<>)]+)/g,
    
    // Any URLs with amazonaws.com domain
    /(https:\/\/[^)\s"`'<>]+\.amazonaws\.com[^)\s"`'<>]*)/g
  ];
  
  // Process all patterns and add to imageMap
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      const url = match[0];
      const urlHash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      const placeholder = `image-placeholder-${urlHash}`;
      imageMap[placeholder] = url;
    }
  });
  
  // Handle code blocks with specialized approach
  const codeBlockRegex = /```[^\n]*\n([\s\S]*?)```/g;
  let codeMatch;
  
  while ((codeMatch = codeBlockRegex.exec(markdown)) !== null) {
    const codeBlock = codeMatch[1];
    
    // Apply same patterns inside code blocks
    awsUrlPatterns.forEach(pattern => {
      let urlMatch;
      while ((urlMatch = pattern.exec(codeBlock)) !== null) {
        const url = urlMatch[0];
        const urlHash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
        const placeholder = `code-image-placeholder-${urlHash}`;
        imageMap[placeholder] = url;
      }
    });
  }
  
  // Save mapping to file
  const privateDir = path.join(process.cwd(), '.private');
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(privateDir, `${postId}.json`),
    JSON.stringify(imageMap, null, 2)
  );
  
  console.log(`Created image mapping with ${Object.keys(imageMap).length} images`);
  return imageMap;
}

function generatePostPageContent(post, markdown) {
  // Extract properties from the post
  const properties = post.properties;
  const title = properties.Title?.title[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';
  
  // FIRST - Check for any AWS credentials before we do anything else
  // This helps catch if there's something in the raw markdown we're missing
  const preCheckRegex = /https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com).+?(?:Credential=|Security-Token=|X-Amz-Credential=|AWSAccessKeyId=|[A-Z0-9]{20})/gi;
  const preCheckMatches = markdown.match(preCheckRegex);
  
  if (preCheckMatches) {
    console.error('⚠️ AWS credentials detected in raw markdown - Logging patterns to help debugging:');
    const uniquePatterns = [...new Set(preCheckMatches.map(url => {
      // Extract just the beginning of the URL pattern to help identify it
      return url.substring(0, 50) + '...';
    }))];
    uniquePatterns.forEach(pattern => console.error(`- Pattern found: ${pattern}`));
  }
  
  // Create image mapping with enhanced pattern detection
  const imageMap = createImageMapping(post.id, markdown);
  
  // Process the markdown to replace ALL AWS URLs with placeholders
  // Not just image URLs, but ANY AWS URL
  let processedMarkdown = markdown;
  
  // Replace all occurrences
  Object.entries(imageMap).forEach(([placeholder, url]) => {
    // Escape special regex characters in the URL
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a global regex to replace all instances
    const urlRegex = new RegExp(escapedUrl, 'g');
    processedMarkdown = processedMarkdown.replace(urlRegex, placeholder);
  });
  
  // NEW - ADDITIONAL DIRECT CREDENTIAL REPLACEMENT
  // This addresses credentials that might appear outside of full URLs
  const credentialReplacements = {
    // Find and replace any standalone credential patterns
    'Credential=[A-Z0-9/]+': 'Credential=REPLACED_CREDENTIAL',
    'X-Amz-Credential=[A-Z0-9/]+': 'X-Amz-Credential=REPLACED_CREDENTIAL',
    'AWSAccessKeyId=[A-Z0-9]+': 'AWSAccessKeyId=REPLACED_KEY',
    'Security-Token=[A-Za-z0-9%]+': 'Security-Token=REPLACED_TOKEN',
    // AWS Access Key ID pattern (20 character alphanumeric string starting with specific prefixes)
    '(AKIA|ASIA|AROA)[A-Z0-9]{16}': 'REPLACED_ACCESS_KEY_ID',
    // AWS Secret Access Key pattern (40 character base64 string)
    '[A-Za-z0-9+/]{40}': 'REPLACED_SECRET_KEY'
  };
  
  // Apply each credential replacement pattern
  Object.entries(credentialReplacements).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    processedMarkdown = processedMarkdown.replace(regex, replacement);
  });
  
  // Add more comprehensive security check for any remaining AWS URLs or credentials
  const credentialPatterns = [
    /https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^\s"'`<>)]+/gi,  // General AWS URLs
    /Credential=[A-Z0-9/]+/gi,                                                // Credential parameter
    /X-Amz-Credential=[A-Z0-9/]+/gi,                                           // X-Amz-Credential parameter
    /AWSAccessKeyId=[A-Z0-9]+/gi,                                             // Access Key ID
    /[A-Z0-9]{20}/g,                                                          // Possible raw Access Key (20 char alphanumeric)
    /Security-Token=[A-Za-z0-9%]+/gi,                                         // Security Token
    /(AKIA|ASIA|AROA)[A-Z0-9]{16}/g,                                          // AWS Access Key ID specific format
    /[A-Za-z0-9+/]{40}/g                                                      // Possible AWS Secret Key
  ];
  
  // Rest of function remains the same...
  
  let hasCredentials = false;
  const foundPatterns = [];
  
  // Check each pattern
  credentialPatterns.forEach(pattern => {
    const matches = processedMarkdown.match(pattern);
    if (matches) {
      hasCredentials = true;
      foundPatterns.push(...matches);
    }
  });
  
  if (hasCredentials) {
    console.error('CRITICAL ERROR: AWS credentials still detected in processed markdown');
    console.error('Aborting to prevent credential leakage!');
    
    // Log the unique patterns that were found (but mask actual credentials)
    [...new Set(foundPatterns)].forEach(pattern => {
      const maskedPattern = pattern
        .replace(/(Credential=|Security-Token=|X-Amz-Credential=|AWSAccessKeyId=)[^&\s]+/gi, '$1***REDACTED***')
        .replace(/([A-Z0-9]{10})[A-Z0-9]{10}/g, '$1**********');
      console.error(`- ${maskedPattern.substring(0, 100)}...`);
    });
    
    process.exit(1); // Stop execution to prevent leaking credentials
  }

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
    // Load image map (placeholders -> URLs) from external API
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