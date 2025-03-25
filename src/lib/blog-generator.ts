import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getBlogPosts, getBlogPost } from './notion';
import { put, list } from '@vercel/blob'; 

// Directories
const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');
const DATA_DIR = path.join(process.cwd(), 'src/data');

// Helper function to extract original filename from URL
function extractFilename(url: string): string {
  try {
    // Extract last path segment from URL
    const urlPath = new URL(url).pathname;
    const parts = urlPath.split('/');
    let filename = parts[parts.length - 1];
    
    // Remove any query parameters
    filename = filename.split('?')[0];
    
    // If no filename found or it's an empty string, fall back to hash
    if (!filename) {
      return createConsistentHash(url);
    }
    
    return filename;
  } catch {
    // If URL parsing fails, fall back to hash-based approach
    return createConsistentHash(url);
  }
}

// Helper function to sanitize filename
function sanitizeFilename(filename: string): string {
  // Remove special characters, spaces, etc.
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 64); // Limit length
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
  
  // Create mappings for existing blog posts (backwards compatibility)
  const hardcodedMappings: Record<string, Record<string, string>> = {
    "1bef7879-ec1d-80da-81db-e80ce7ae93e3": {
      "image-placeholder-UyKu23r7d3jw7XOtlUmFd2l5lllx31hU": "https://zah3ozwhv9cp0qic.public.blob.vercel-storage.com/image-cache/yCeuzmx3i7j5xhArsQZh907gTcT2SyJM-P6BDZYgCJtrUNFnohWjIqFeQ4ppDvA.jpg",
      "image-placeholder-Vk2B3XvA0Qv1QUlLIg7rmGWTLkQh4eqp": "https://zah3ozwhv9cp0qic.public.blob.vercel-storage.com/image-cache/mzxxSJOVmH8nrsaqsTE36xsiXKhwLWj7-FrswC58wIuc4pZhkuMufJB76lAT7Be.jpg"
    }
  };
  
  // Apply hardcoded mappings if available
  if (hardcodedMappings[postId]) {
    console.log(`Using hardcoded mappings for post ${postId}`);
    Object.assign(imageMap, hardcodedMappings[postId]);
  }
  
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      let url = match[1] || match[0];
      
      // Skip if not an AWS URL or already processed
      if (!url.includes('amazonaws.com') && !url.includes('prod-files-secure.s3')) continue;
      if (processedUrls.has(url)) continue;
      
      processedUrls.add(url);
      
      // Extract the original filename from the URL
      const originalFilename = extractFilename(url);
      const safeFilename = sanitizeFilename(originalFilename);
      
      // Create placeholder using the sanitized original filename
      const placeholder = `image-placeholder-${safeFilename}`;
      
      // Skip if we already have a hardcoded mapping for this post and URL
      if (hardcodedMappings[postId]?.[placeholder]) {
        console.log(`Using existing hardcoded mapping for ${placeholder}`);
        continue;
      }
      
      imageMap[placeholder] = url;
      
      console.log(`Mapped ${url.substring(0, 30)}... to ${placeholder} (filename: ${safeFilename})`);
      
      // Add preloading promise to the array
      preloadPromises.push((async () => {
        const blobUrl = await preloadImageToBlobStorage(url, safeFilename);
        if (blobUrl) {
          // Update the map with the blob URL
          imageMap[placeholder] = blobUrl;
          console.log(`Updated mapping for ${placeholder} to blob URL: ${blobUrl}`);
        }
      })());
    }
  });

  // After all preloading is finished, ensure we're saving the final map with blob URLs
  if (preloadPromises.length > 0) {
    console.log(`🔄 Preloading ${preloadPromises.length} images to blob storage...`);
    await Promise.all(preloadPromises);
    
    // Explicitly log the final state of the imageMap
    console.log('Final image map after preloading:');
    Object.entries(imageMap).forEach(([key, value]) => {
      console.log(`  ${key} -> ${value.substring(0, 30)}...`);
    });
    
    console.log('✅ Image preloading complete!');
  }
  
  // Save the mapping with updated blob URLs
  const privateDir = path.join(process.cwd(), '.private');
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }

  // Small delay to ensure all async operations complete
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Make sure we're writing the most up-to-date map with blob URLs
  fs.writeFileSync(
    path.join(privateDir, `${postId}.json`),
    JSON.stringify(imageMap, null, 2)
  );
  
  console.log(`✅ Created image mapping for post ${postId} with ${Object.keys(imageMap).length} images`);
  
  return imageMap;
}

// Update the preload function to use filename
async function preloadImageToBlobStorage(url: string, filename: string): Promise<string | null> {
  try {
    console.log(`📸 Preloading image to blob storage: ${url.substring(0, 30)}... (filename: ${filename})`);
    
    // Define blob name using the filename directly (not hash)
    const blobName = `${filename}.jpg`;
    
    // Check if the blob already exists before fetching
    const { blobs } = await list();
    const existingBlob = blobs.find(blob => 
      blob.url?.includes(filename)
    );
    
    if (existingBlob) {
      console.log(`✅ Image already exists in blob storage: ${existingBlob.url}`);
      return existingBlob.url;
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
    
    // Store the image in Vercel Blob Storage with the filename
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

function extractAwsUrls(markdown: string): string[] {
  const urlSet = new Set<string>();
  
  // Use the same AWS URL patterns from createImageMapping
  const awsUrlPatterns = [
    // Standard S3 URLs
    /(https:\/\/(?:prod-files-secure\.s3|s3\.amazonaws\.com)[^)"\s`'<>]+)/g,
    // URLs with credential parameters
    /(https:\/\/[^\s"`'<>)]+(?:Credential=|X-Amz-Credential=|AWSAccessKeyId=|Security-Token=)[^\s"`'<>)]+)/g,
    // Any amazonaws.com URL
    /(https:\/\/[^)\s"`'<>]+\.amazonaws\.com[^)\s"`'<>]*)/g,
    // Image URLs in markdown syntax
    /!\[.*?\]\((https?:\/\/[^"\s)]+amazonaws\.com[^"\s)]*)\)/g,
    /!\[.*?\]\((https?:\/\/prod-files-secure\.s3[^"\s)]*)\)/g,
    // HTML image tags
    /<img[^>]*src=["'](https?:\/\/[^"'\s>]+amazonaws\.com[^"'\s>]*)["'][^>]*>/g,
    /<img[^>]*src=["'](https?:\/\/prod-files-secure\.s3[^"'\s>]*)["'][^>]*>/g,
  ];
  
  // Extract URLs using each pattern
  awsUrlPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
      // Get the URL from either the full match or the capture group
      let url = match[1] || match[0];
      
      // Only add AWS URLs
      if (url.includes('amazonaws.com') || url.includes('prod-files-secure.s3')) {
        urlSet.add(url);
      }
    }
  });
  
  return Array.from(urlSet);
}

// Keep the existing hash function for backward compatibility
function createConsistentHash(url: string): string {
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(url)
    .digest('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 32);
}

// Update sanitizeMarkdown to use the new filename approach
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
    
    // Extract filename from URL
    const originalFilename = extractFilename(url);
    const safeFilename = sanitizeFilename(originalFilename);
    const placeholder = `image-placeholder-${safeFilename}`;
    
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
  
  return processedMarkdown;
}

// Function to create a blog post component
export function createBlogPost(postId: string, title: string, processedMarkdown: string, date?: string) {
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
    console.log('Preloading images to blob storage...', imageMap);
    
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
    console.log('BlogPost effect running - imageMap changed');
    console.log('Available image mappings:', Object.keys(imageMap).length);
    if (Object.keys(imageMap).length > 0) {
      console.log('Sample mapping:', Object.entries(imageMap)[0]);
    }
  }, [imageMap]);
    
  useEffect(() => {
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
  }, [postId]);

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
