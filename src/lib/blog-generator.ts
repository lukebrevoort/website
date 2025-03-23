import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getBlogPosts, getBlogPost } from './notion';
import { put, list } from '@vercel/blob'; // Add Vercel Blob import
// Dynamic import for node-fetch since it's an ESM module

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
      
      // Create and store image mapping - now async
      masterImageMap[postId] = await createImageMapping(postId, markdown);
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

function sanitizeMarkdown(markdown: string, imageMap: Record<string, string>): string {
  let processedMarkdown = markdown;
  
  // Create a reverse mapping for easy lookup (placeholder → URL)
  const reverseMap: Record<string, string> = {};
  Object.entries(imageMap).forEach(([placeholder, url]) => {
    reverseMap[url] = placeholder;
  });
  
  // First extract and replace any remaining AWS URLs that weren't mapped
  const unmappedAwsUrls = extractAwsUrls(processedMarkdown);
  
  for (const url of unmappedAwsUrls) {
    // Skip if we already have a mapping for this URL
    if (reverseMap[url]) continue;
    
    // Create a new placeholder for this URL
    const urlHash = createConsistentHash(url);
    const placeholder = `image-placeholder-${urlHash}`;
    
    // Add to our maps
    imageMap[placeholder] = url;
    reverseMap[url] = placeholder;
    
    console.log(`Added additional mapping for ${url.substring(0, 30)}... to ${placeholder}`);
  }
  
  // Replace all AWS URLs with their placeholders
  unmappedAwsUrls.forEach(url => {
    const placeholder = reverseMap[url];
    if (placeholder) {
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      processedMarkdown = processedMarkdown.replace(
        new RegExp(escapedUrl, 'g'),
        placeholder
      );
    }
  });
  
  // Now replace URL patterns in Markdown image syntax
  processedMarkdown = processedMarkdown.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^"\s)]+)\)/g,
    (match, altText, url) => {
      if (url.includes('amazonaws.com') || url.includes('prod-files-secure.s3')) {
        const placeholder = reverseMap[url];
        if (placeholder) {
          return `![${altText}](${placeholder})`;
        }
      }
      return match;
    }
  );
  
  // Safety - apply sanitization to credentials without REDACTEDing the entire URL
  const credentialPatterns = [
    // Query parameter credentials - just remove the credentials, not the whole URL
    { pattern: /(https:\/\/[^\s"'<>)]*amazonaws\.com[^\s"'<>)]*)([?&](?:Credential|X-Amz-Credential|AWSAccessKeyId|Security-Token|X-Amz-Security-Token|X-Amz-Date|X-Amz-Signature)=[^&"'\s<>)]+)/gi, 
      replacement: '$1' }, // Keep the URL but remove the credential part
  ];
  
  // Apply credential-only patterns
  credentialPatterns.forEach(({ pattern, replacement }) => {
    processedMarkdown = processedMarkdown.replace(pattern, replacement);
  });
  
  return processedMarkdown;
}

// Helper function to extract AWS URLs from markdown
function extractAwsUrls(markdown: string): string[] {
  const urls = new Set<string>();
  
  const awsUrlPatterns = [
    // Standard S3 URLs
    /(https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^)"\s`'<>]+)/g,
    // Any amazonaws.com URL
    /(https:\/\/[^)\s"`'<>]+\.amazonaws\.com[^)\s"`'<>]*)/g,
    // Image URLs in markdown syntax
    /!\[.*?\]\((https?:\/\/[^"\s)]+amazonaws\.com[^"\s)]+)\)/g,
    // HTML image tags
    /<img[^>]*src=["'](https?:\/\/[^"'\s>]+amazonaws\.com[^"'\s>]+)["'][^>]*>/g,
  ];
  
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      let url = match[1] || match[0];
      
      // Only add if it's an AWS URL
      if (url.includes('amazonaws.com') || url.includes('prod-files-secure.s3')) {
        urls.add(url);
      }
    }
  });
  
  return Array.from(urls);
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

async function preloadImageToBlobStorage(url: string, hash: string): Promise<string | null> {
  try {
    console.log(`📸 Preloading image to blob storage: ${url.substring(0, 30)}...`);
    
    // Define blob name/path
    const blobName = `image-cache/${hash}.jpg`;
    
    // Check if the blob already exists before fetching
    const { blobs } = await list({ prefix: blobName });
    if (blobs.length > 0) {
      console.log(`✅ Image already exists in blob storage: ${blobs[0].url}`);
      return blobs[0].url;
    }
    
    // Dynamically import fetch
    const { default: fetch } = await import('node-fetch');
    
    // Fetch the image from the original URL
    const imageResponse = await fetch(url);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    
    // Get the image buffer
    const imageBuffer = await imageResponse.buffer();
    
    // Store the image in Vercel Blob Storage
    const { url: blobUrl } = await put(blobName, imageBuffer, {
      access: 'public',
      contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
    });
    
    console.log(`✅ Successfully uploaded to blob storage: ${blobUrl}`);
    return blobUrl;
  } catch (error) {
    console.error('❌ Error preloading image to blob storage:', error);
    return null;
  }
}

// MODIFIED: Create image mapping and preload to blob storage
async function createImageMapping(postId: string, markdown: string) {
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
  
  // Array to store preloading promises
  const preloadPromises: Promise<void>[] = [];
  
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      let url = match[1] || match[0];
      
      // Skip if not an AWS URL or already processed
      if (!url.includes('amazonaws.com') && !url.includes('prod-files-secure.s3')) continue;
      if (processedUrls.has(url)) continue;
      
      processedUrls.add(url);
      
      // Create a deterministic hash for the URL
      const urlHash = createConsistentHash(url);
      const placeholder = `image-placeholder-${urlHash}`;
      imageMap[placeholder] = url;
      
      console.log(`Mapped ${url.substring(0, 30)}... to ${placeholder}`);
      
      // Add preloading promise to the array
      preloadPromises.push((async () => {
        const blobUrl = await preloadImageToBlobStorage(url, urlHash);
        if (blobUrl) {
          // Update the map with the blob URL
          imageMap[placeholder] = blobUrl;
          console.log(`Updated mapping for ${placeholder} to blob URL: ${blobUrl}`);
        }
      })());
    }
  });
  
  // Wait for all preloading operations to complete
  if (preloadPromises.length > 0) {
    console.log(`🔄 Preloading ${preloadPromises.length} images to blob storage...`);
    await Promise.all(preloadPromises);
    console.log('✅ Image preloading complete!');
  } else {
    console.log('ℹ️ No images to preload');
  }
  
  // Save the mapping with updated blob URLs
  const privateDir = path.join(process.cwd(), '.private');
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(privateDir, `${postId}.json`),
    JSON.stringify(imageMap, null, 2)
  );
  
  console.log(`✅ Created image mapping for post ${postId} with ${Object.keys(imageMap).length} images`);
  
  return imageMap;
}

// UPDATED: Uses sanitized markdown with placeholders
function generatePostPageContent(post: any, markdown: string) {
  // Get properties safely with fallbacks
  const properties = post.properties || {};
  const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString()
    : '';

  let processedMarkdown = markdown;

  // Carefully handle code blocks to prevent template literal issues
  processedMarkdown = processedMarkdown.replace(
    /```(javascript|typescript|js|ts)([\s\S]*?)```/g,
    (match, language, code) => {
      // Escape backticks, template literals and other problematic characters
      const escapedCode: string = code
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${')
        // Fix specific bugs in code examples that might exist in the content
        .replace(/['"]blobs\[0\]\.url['"]/g, 'blobs[0].url')
        .replace(/\$\{(['"])([^}]*)\1\}/g, (m: string, q: string, content: string) => `\\\${${q}${content}${q}}`);
      
      return '```' + language + escapedCode + '```';
    }
  );

  // Extra step to escape any remaining backticks in the markdown
  processedMarkdown = processedMarkdown.replace(/`/g, '\\`');
  
  // More comprehensive escaping for dollar signs followed by curly braces
  processedMarkdown = processedMarkdown.replace(/\${/g, '\\${');

  // Ensure the post ID is sanitized and available
  const postId = post.id || '';
  if (!postId) {
    console.warn('Post ID is missing, using empty string as fallback');
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
  const [content, setContent] = useState(\`${processedMarkdown}\`);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const postId = "${postId}";

  // Function to preload images to blob storage
  const preloadImages = async (imageMap: Record<string, string>) => {
    console.log('Preloading images to blob storage...');
    
    // Gather all image placeholders that need to be preloaded
    const placeholders = Object.keys(imageMap).filter(key => 
      key.startsWith('image-placeholder-') && 
      !imageMap[key].includes('vercel-blob.com') && 
      !imageMap[key].includes('blob.vercel-storage.com')
    );
    
    if (placeholders.length === 0) {
      console.log('No images need preloading - all are already in blob storage');
      return;
    }
    
    console.log(\`Found \${placeholders.length} images that need to be preloaded to blob storage\`);
    
    // Process each placeholder in sequence to avoid overloading
    for (const placeholder of placeholders) {
      try {
        // Extract the original URL
        const originalUrl = imageMap[placeholder];
        // Extract hash from placeholder
        const hash = placeholder.replace('image-placeholder-', '');
        
        console.log(\`Preloading image: \${placeholder} -> \${originalUrl.substring(0, 30)}...\`);
        
        // Call the image proxy to ensure it's stored in blob storage
        const response = await fetch(
          \`/api/image-proxy?url=\${encodeURIComponent(originalUrl)}&hash=\${hash}\`
        );
        
        if (!response.ok) {
          throw new Error(\`Failed to preload image: \${response.status} \${response.statusText}\`);
        }
        
        const data = await response.json();
        
        if (data.imagePath && (data.imagePath.includes('vercel-blob.com') || data.imagePath.includes('blob.vercel-storage.com'))) {
          console.log(\`Successfully preloaded: \${data.imagePath.substring(0, 30)}...\`);
          // Update the imageMap with the blob URL for future use
          imageMap[placeholder] = data.imagePath;
        } else {
          console.warn(\`Failed to preload image \${placeholder}: No valid blob URL returned\`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(\`Error preloading image \${placeholder}:\`, error);
      }
    }
    
    console.log('Preloading complete!');
    
    // Update the state with the new map containing blob URLs
    setImageMap({...imageMap});
  };

  // Process image URLs at runtime
  useEffect(() => {
    console.log('BlogPost mounted, fetching image map...');
    
    // Load image map (placeholders -> URLs) from external API
    fetch(\`/api/image-map?postId=\${postId}\`)
      .then(res => {
        if (!res.ok) {
          throw new Error(\`Failed to fetch image map: \${res.status} \${res.statusText}\`);
        }
        return res.json();
      })
      .then(fetchedMap => {
        console.log('Loaded image map with', Object.keys(fetchedMap).length, 'images');
        setImageMap(fetchedMap);
        setIsLoading(false);
        
        // Start preloading images to blob storage after a short delay
        // This ensures the component renders first, then we handle the preloading
        setTimeout(() => {
          preloadImages(fetchedMap);
        }, 1000);
      })
      .catch(err => {
        console.error('Error fetching image map:', err);
        setIsLoading(false);
      });
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
                    <BreadcrumbLink>{${JSON.stringify(title)}}</BreadcrumbLink>
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
              <h1 className={\`\${lukesFont.className} text-4xl font-bold mb-3\`}>{${JSON.stringify(title)}}</h1>
              ${date ? `<time className="text-gray-500">${date}</time>` : ''}
            </header>
            
            {isLoading ? (
              <div className="animate-pulse">Loading content...</div>
            ) : (
              <div className={\`prose dark:prose-invert max-w-none \${crimsonText.className}\`}>
                <ReactMarkdown components={{
                  img: ({ node, ...props }) => {
                    // Fix TypeScript errors by ensuring src is not undefined
                    const imageSrc = props.src || '';
                    
                    return (
                      <SecureImage 
                        src={imageSrc} 
                        alt={props.alt || ''} 
                        className="my-4 rounded-md" 
                        postId={\`\${postId}\`}
                        imageMap={imageMap}
                      />
                    );
                  }
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