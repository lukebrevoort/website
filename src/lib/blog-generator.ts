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

    // Pre-process step: Extract all AWS URLs and create a master mapping
    const masterImageMap: Record<string, Record<string, string>> = {};
    
    // First pass: Extract all image mappings before generating any files
    for (const post of postsToGenerate) {
      const postId = post.id;
      const { markdown } = await getBlogPost(postId);
      
      // Create and store image mapping
      masterImageMap[postId] = createImageMapping(postId, markdown);
    }

    // Second pass: Generate the page files using the pre-created mappings
    for (const post of postsToGenerate) {
      const postId = post.id;
      const { markdown } = await getBlogPost(postId);
      
      // Create page file for this post
      const postDir = path.join(POSTS_DIR, postId);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Double process to ensure no credentials remain
      let processedMarkdown = sanitizeMarkdown(markdown, masterImageMap[postId]);

      // Write the page.tsx file
      const pageContent = generatePostPageContent(post, processedMarkdown);
      
      // Final credential sweep before writing
      const cleanPageContent = performFinalCredentialSweep(pageContent);
      
      fs.writeFileSync(path.join(postDir, 'page.tsx'), cleanPageContent);
      
      console.log(`✅ Generated page for: ${
        'properties' in post && 
        post.properties.Title?.type === 'title' && 
        Array.isArray(post.properties.Title.title) &&
        post.properties.Title.title[0]?.plain_text || 
        postId
      }`);
    }

    // Post-processing cleanup - additional safeguard
    console.log("Performing post-processing cleanup...");
    for (const post of postsToGenerate) {
      const postId = post.id;
      const postDir = path.join(POSTS_DIR, postId);
      const pagePath = path.join(postDir, 'page.tsx');
      
      if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        // Apply one final cleansing pass
        content = performFinalCredentialSweep(content);
        fs.writeFileSync(pagePath, content);
      }
    }

    // Existing security check
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

// ENHANCED: Sanitizes markdown by applying credential removal patterns
function sanitizeMarkdown(markdown: string, imageMap: Record<string, string>): string {
  let processedMarkdown = markdown;
  
  // First replace all AWS URLs with placeholders
  Object.entries(imageMap).forEach(([placeholder, url]) => {
    processedMarkdown = processedMarkdown.replace(
      new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      placeholder
    );
  });
  
  // Then apply additional credential scrubbing
  const credentialPatterns = [
    // Query parameter credentials
    { pattern: /Credential=[A-Za-z0-9/+=]+/gi, replacement: 'Credential=REDACTED' },
    { pattern: /X-Amz-Credential=[A-Za-z0-9/+=]+/gi, replacement: 'X-Amz-Credential=REDACTED' },
    { pattern: /AWSAccessKeyId=[A-Za-z0-9/+=]+/gi, replacement: 'AWSAccessKeyId=REDACTED' },
    { pattern: /Security-Token=[A-Za-z0-9%+=]+/gi, replacement: 'Security-Token=REDACTED' },
    { pattern: /X-Amz-Security-Token=[A-Za-z0-9%+=]+/gi, replacement: 'X-Amz-Security-Token=REDACTED' },
    { pattern: /X-Amz-Date=[0-9TZ]+/gi, replacement: 'X-Amz-Date=REDACTED' },
    { pattern: /X-Amz-Signature=[0-9a-f]+/gi, replacement: 'X-Amz-Signature=REDACTED' },
    
    // Access and secret keys
    { pattern: /(AKIA|ASIA|AROA)[A-Z0-9]{16,17}/g, replacement: 'REDACTED_AWS_KEY' },
    { pattern: /[A-Za-z0-9+/]{35,40}(?:[=]{0,2})/g, replacement: 'REDACTED_SECRET_KEY' },
    
    // Any remaining AWS URLs
    { pattern: /https:\/\/[^\s"'<>)]*amazonaws\.com[^\s"'<>)]*/gi, replacement: 'https://REDACTED.amazonaws.com/REDACTED' },
  ];
  
  // Apply each pattern
  credentialPatterns.forEach(({ pattern, replacement }) => {
    processedMarkdown = processedMarkdown.replace(pattern, replacement);
  });
  
  return processedMarkdown;
}

// ENHANCED: Performs a final credential sweep on content before saving
function performFinalCredentialSweep(content: string): string {
  // One final pass of credential patterns on the entire file
  const finalPatterns = [
    // AWS domain names with credentials
    { pattern: /https:\/\/[^\s"'<>)]*amazonaws\.com[^\s"'<>)]*\?[^\s"'<>)]*(?:Credential|X-Amz-Credential|AWSAccessKeyId|Security-Token)=[^\s"'<>)]*/gi, 
      replacement: 'https://REDACTED.amazonaws.com?REDACTED' },
    // Access key patterns
    { pattern: /(AKIA|ASIA|AROA)[A-Z0-9]{16,17}/g, replacement: 'REDACTED_KEY' },
    // Secret key patterns
    { pattern: /[A-Za-z0-9+/]{35,40}(?:[=]{0,2})/g, replacement: 'REDACTED_SECRET' },
    // Any remaining credential fragments
    { pattern: /Credential=[^&"\s]+/gi, replacement: 'Credential=REDACTED' },
    { pattern: /X-Amz-Credential=[^&"\s]+/gi, replacement: 'X-Amz-Credential=REDACTED' },
    { pattern: /AWSAccessKeyId=[^&"\s]+/gi, replacement: 'AWSAccessKeyId=REDACTED' },
    { pattern: /X-Amz-Security-Token=[^&"\s]+/gi, replacement: 'X-Amz-Security-Token=REDACTED' },
    { pattern: /Security-Token=[^&"\s]+/gi, replacement: 'Security-Token=REDACTED' },
  ];
  
  let cleanContent = content;
  finalPatterns.forEach(({ pattern, replacement }) => {
    cleanContent = cleanContent.replace(pattern, replacement);
  });
  
  return cleanContent;
}

function createConsistentHash(url: string): string {
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(url)
    .digest('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 32);
}

function createImageMapping(postId: string, markdown: string) {
  // Extract image URLs from markdown
  const imageMap: Record<string, string> = {};
  
  // More comprehensive regex patterns to catch all AWS URL variations
  const awsUrlPatterns = [
    // Standard S3 URLs
    /(https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^)"\s`'<>]+)/g,
    // URLs with credential parameters
    /(https:\/\/[^\s"`'<>)]+(?:Credential=|X-Amz-Credential=|AWSAccessKeyId=|Security-Token=)[^\s"`'<>)]+)/g,
    // Any amazonaws.com URL
    /(https:\/\/[^)\s"`'<>]+\.amazonaws\.com[^)\s"`'<>]*)/g,
    // Image URLs in markdown syntax
    /!\[.*?\]\((https?:\/\/[^"\s)]+)\)/g,
    // HTML image tags
    /<img[^>]*src=["'](https?:\/\/[^"'\s>]+)["'][^>]*>/g,
  ];
  
  // Use Set to avoid processing the same URL multiple times
  const processedUrls = new Set<string>();
  
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      let url = match[1] || match[0];
      
      // Skip if not an AWS URL or already processed
      if (!url.includes('amazonaws.com') && !url.includes('Credential=')) continue;
      if (processedUrls.has(url)) continue;
      
      processedUrls.add(url);
      
      // Create a deterministic hash for the URL
      const urlHash = createConsistentHash(url);
      const placeholder = `image-placeholder-${urlHash}`;
      imageMap[placeholder] = url;
      
      console.log(`Mapped ${url.substring(0, 30)}... to ${placeholder}`);
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

// UPDATED: Uses sanitized markdown with placeholders
function generatePostPageContent(post: any, markdown: string) {
  // Get properties
  const properties = post.properties;
  const title = properties.Title?.title[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString()
    : '';

  let processedMarkdown = markdown;

  processedMarkdown = processedMarkdown.replace(
    /```(javascript|typescript|js|ts)([\s\S]*?)```/g,
    (match, language, code) => {
      // Escape template literals in code blocks
      const escapedCode = code
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${')
        // Fix specific bugs in code examples
        .replace(/'blobs\[0\]\.url'/g, 'blobs[0].url')
        .replace(/\$\{'somehash'\}/g, '\\${\'somehash\'}');
      
      return '```' + language + escapedCode + '```';
    }
  );
    
  // We're now working with pre-sanitized markdown that already has placeholders

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
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Process image URLs at runtime
  useEffect(() => {
    console.log('BlogPost mounted, fetching image map...');
    
    // First check if we still have REDACTED URLs that need to be fixed
    const hasRedactedImages = content.includes('REDACTED.amazonaws.com');
    
    if (hasRedactedImages) {
      console.log('Found REDACTED URLs in content, will attempt to replace them');
    }
    
    // Load image map (placeholders -> URLs) from external API
    fetch(\`/api/image-map?postId=${post.id}\`)
      .then(res => {
        if (!res.ok) {
          throw new Error(\`Failed to fetch image map: \${res.status} \${res.statusText}\`);
        }
        return res.json();
      })
      .then(fetchedMap => {
        console.log('Loaded image map with', Object.keys(fetchedMap).length, 'images');
        setImageMap(fetchedMap);
        
        // If we have REDACTED URLs and we got an image map
        if (hasRedactedImages && Object.keys(fetchedMap).length > 0) {
          console.log('Replacing REDACTED URLs with image placeholders');
          
          // Create a new version of the content with REDACTED URLs replaced
          let updatedContent = content;
          
          // Replace all REDACTED URLs with the first available placeholder
          // In a more sophisticated version, we'd match images to placeholders intelligently
          const allPlaceholders = Object.keys(fetchedMap);
          
          if (allPlaceholders.length > 0) {
            // Replace each instance of a REDACTED URL with a sequential placeholder
            let placeholderIndex = 0;
            
            updatedContent = updatedContent.replace(
              /!\\[([^\\]]*)\\]\\(https:\\/\\/REDACTED\\.amazonaws\\.com\\/REDACTED\\)/g,
              (match, altText) => {
                const placeholder = allPlaceholders[placeholderIndex % allPlaceholders.length];
                placeholderIndex++;
                console.log(\`Replaced REDACTED URL with placeholder: \${placeholder.substring(0, 30)}...\`);
                return \`![\${altText}](\${placeholder})\`;
              }
            );
            
            console.log('Updated content with placeholders');
            setContent(updatedContent);
          }
        }
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching image map:', err);
        setIsLoading(false);
      });
  }, []);

  // Debugging button to help diagnose image issues
  const debugImage = () => {
    console.log('Current content contains image placeholders:', 
                content.includes('image-placeholder-'));
    console.log('Current image map:', imageMap);
    
    // Force image map reload
    fetch(\`/api/image-map?postId=${post.id}&force=true\`)
      .then(res => res.json())
      .then(fetchedMap => {
        console.log('Reloaded image map:', fetchedMap);
        setImageMap(fetchedMap);
      });
  };

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
              
              {/* Add debugging button that's only visible during development */}
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={debugImage}
                  className="mt-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded"
                >
                  Debug Images
                </button>
              )}
            </header>
            
            {isLoading ? (
              <div className="animate-pulse">Loading content...</div>
            ) : (
              <div className={\`prose dark:prose-invert max-w-none \${crimsonText.className}\`}>
                <ReactMarkdown components={{
                  img: ({ node, ...props }) => {
                    // Fix TypeScript errors by ensuring src is not undefined
                    const imageSrc = props.src || '';
                    console.log('Rendering image with src:', imageSrc);
                    
                    // Check if this is a placeholder that needs to be handled specially
                    const isPlaceholder = imageSrc.startsWith('image-placeholder-');
                    
                    if (isPlaceholder) {
                      console.log('Detected image placeholder:', imageSrc);
                      
                      // If we have a mapping for this placeholder in our imageMap
                      if (imageMap[imageSrc]) {
                        const mappedUrl = imageMap[imageSrc];
                        console.log('Found mapping for placeholder:', 
                          mappedUrl ? mappedUrl.substring(0, 30) + '...' : 'undefined');
                      } else {
                        console.log('No mapping found for placeholder:', imageSrc);
                      }
                    }
                    
                    return (
                      <SecureImage 
                        src={imageSrc} 
                        alt={props.alt || ''} 
                        className="my-4 rounded-md" 
                        postId="${post.id}"
                        imageMap={imageMap}
                      />
                    );
                  },
                  // Also fix code formatting issues in the rendered markdown
                  code: ({ node, inline, className, children, ...props }) => {
                    // For code blocks in the blog content
                    return inline ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className={className} {...props}>
                        <code>{children}</code>
                      </pre>
                    );
                  },
                  },
                }}>{content}</ReactMarkdown>
              </div>
            )}
          </motion.article>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}`;
}