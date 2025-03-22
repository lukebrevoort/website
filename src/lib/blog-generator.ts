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

    // NEW: Add post-generation security check to catch any remaining credentials
    console.log("Running final security checks...");
    
    // Track which files we've already processed
    const processedFiles = new Set<string>();
    let securityCheckFailed = false;
    
    // Function to scan directories recursively
    function scanDirectory(dir: string) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            scanDirectory(fullPath);
          } else if (entry.name === 'page.tsx' && !processedFiles.has(fullPath)) {
            // Mark this file as processed to avoid double-checking
            processedFiles.add(fullPath);
            
            // Check this file for credentials
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              let hasCredentials = false;
              
              const awsCredentialPatterns = [
                /https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^\s"'`<>)]+/gi,
                /Credential=[A-Z0-9/]+/gi,
                /X-Amz-Credential=[A-Z0-9/]+/gi,
                /AWSAccessKeyId=[A-Z0-9]+/gi,
                /Security-Token=[A-Za-z0-9%]+/gi,
                /(AKIA|ASIA|AROA)[A-Z0-9]{16}/g,
                /[A-Za-z0-9+/]{40}/g
              ];
              
              // Check all patterns
              for (const pattern of awsCredentialPatterns) {
                const matches = content.match(pattern);
                if (matches) {
                  hasCredentials = true;
                  console.error(`Found potential credentials in ${fullPath}`);
                  break; // No need to check other patterns
                }
              }
              
              // Only try to delete if we found credentials
              if (hasCredentials) {
                securityCheckFailed = true;
                try {
                  fs.unlinkSync(fullPath);
                  console.log(`Successfully deleted ${fullPath}`);
                } catch (err) {
                  if (err && typeof err === 'object' && 'code' in err && err.code !== 'ENOENT') { // Ignore "file not found" errors
                    console.error(`Warning: Failed to delete ${fullPath}:`, err);
                  }
                }
              }
            } catch (fileError) {
              console.error(`Error processing file ${fullPath}:`, fileError);
            }
          }
        }
      } catch (dirError) {
        console.error(`Error scanning directory ${dir}:`, dirError);
      }
    }
    
    // Start scanning at the posts directory
    scanDirectory(POSTS_DIR);
    
    if (securityCheckFailed) {
      throw new Error("Security check failed: AWS credentials found in generated files");
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

function createImageMapping(postId: string, markdown: string) {
  // Extract image URLs from markdown
  const imageMap: Record<string, string> = {};
  
  // Use a more comprehensive regex to catch all AWS URL patterns
  const awsUrlPatterns = [
    /(https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^)"\s`'<>]+)/g,
    /(https:\/\/[^\s"`'<>)]+(?:Credential=|X-Amz-Credential=|AWSAccessKeyId=|Security-Token=)[^\s"`'<>)]+)/g,
    /(https:\/\/[^)\s"`'<>]+\.amazonaws\.com[^)\s"`'<>]*)/g
  ];
  
  // Process all patterns
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      const url = match[0];
      const urlHash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      const placeholder = `image-placeholder-${urlHash}`;
      imageMap[placeholder] = url;
    }
  });
  
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

function generatePostPageContent(post: any, markdown: string) {
  // Get properties as before
  const properties = post.properties;
  const title = properties.Title?.title[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString()
    : '';
    
  // FIRST - Check for any AWS credentials before we do anything else
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
    
  // Create image mapping (this also saves it to a file)
  const imageMap = createImageMapping(post.id, markdown);
  
  // Process the markdown to replace AWS URLs with placeholders
  let processedMarkdown = markdown;
  Object.entries(imageMap).forEach(([placeholder, url]) => {
    processedMarkdown = processedMarkdown.replace(
      new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      placeholder
    );
  });
  
  // NEW - ADDITIONAL DIRECT CREDENTIAL REPLACEMENT
  // This addresses credentials that might appear outside of full URLs
  const credentialReplacements: Record<string, string> = {
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
  
  // Create JSON of the image map to embed in the component
  const imageMapJSON = JSON.stringify(imageMap);

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
    // This avoids storing credentials in client-side code
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