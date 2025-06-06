import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getBlogPosts, getBlogPost } from './notion';
import { put, list } from '@vercel/blob';
import crypto from 'crypto';

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

// Ensure needed directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
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
      
      // Extract tags from Notion
      const tagsProperty = properties.Tags;
      const tags = tagsProperty?.multi_select
        ? tagsProperty.multi_select.map((tag: any) => ({
            name: tag.name,
            color: tag.color
          }))
        : [];
      
      return {
        id: post.id,
        slug: post.id,
        title: properties.Title?.title[0]?.plain_text || 'Untitled',
        description: properties.Description?.rich_text[0]?.plain_text || '',
        date: properties.Date?.date?.start || null,
        tags, // Add the tags to the output
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
  return crypto
    .createHash('sha256')
    .update(url)
    .digest('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 32);
}

// UPDATED: Preload image to blob storage using filename
async function preloadImageToBlobStorage(url: string, filename: string): Promise<string | null> {
  try {
    console.log(`📸 Preloading image to blob storage: ${url.substring(0, 30)}...`);
    
    // Check if filename already has an extension
    const hasExtension = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(filename);
    
    // Define blob name - use filename as is if it has an extension, otherwise add .jpg
    const blobName = hasExtension ? filename : `${filename}.jpg`;
    
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
    
    // Store the image in Vercel Blob Storage with filename
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

// MODIFIED: Create image mapping using filenames instead of hashes
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
      
      // Extract the original filename from the URL
      const originalFilename = extractFilename(url);
      const safeFilename = sanitizeFilename(originalFilename);
      
      // Create placeholder using sanitized filename
      const placeholder = `image-placeholder-${safeFilename}`;
      
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

  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Make sure we're writing the most up-to-date map with blob URLs
  fs.writeFileSync(
    path.join(privateDir, `${postId}.json`),
    JSON.stringify(imageMap, null, 2)
  );
  
  console.log(`✅ Created image mapping for post ${postId} with ${Object.keys(imageMap).length} images`);
  
  return imageMap;
}

// Function that generates the page.tsx content - this is the key part that needed updating
function generatePostPageContent(post: any, markdown: string) {
  // Get properties safely with fallbacks
  const properties = post.properties || {};
  const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';
  const date = properties.Date?.date?.start 
    ? new Date(properties.Date.date.start).toLocaleDateString()
    : '';

  const tagsProperty = properties.Tags;
  const tags = tagsProperty?.multi_select
    ? tagsProperty.multi_select.map((tag: any) => ({
        name: tag.name,
        color: tag.color
      }))
    : [];

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
  import Image from "next/image";
  import { useState, useEffect } from "react";
  
  const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });
  
  export default function BlogPost() {
    // Store processed markdown in state
    const [content, setContent] = useState(\`${processedMarkdown}\`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "${postId}";
    const tags = ${JSON.stringify(tags)};
    
    // Detect color scheme preference
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }, []);
    
    // Function to preload images to blob storage
    const preloadImages = async (imageMap: Record<string, string>) => {
      if (!imageMap || Object.keys(imageMap).length === 0) return;
      
      console.log('Preloading images:', Object.keys(imageMap).length);
      
      // Create an array to hold all image loading promises
      const imagePromises = Object.values(imageMap).map(url => {
        return new Promise<void>((resolve) => {
          if (!url || typeof url !== 'string') {
            resolve();
            return;
          }
      
          // Skip if URL is not valid or still a placeholder
          if (url.startsWith('image-placeholder-')) {
            resolve();
            return;
          }
          
          // Use browser's Image constructor to preload
          if (typeof window !== 'undefined') {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => {
              console.warn(\`Failed to preload image: \${url}\`);
              resolve(); // Resolve anyway to not block other images
            };
            img.src = url;
          } else {
            // If running on server, just resolve
            resolve();
          }
        });
      });
      
      // Wait for all images to load or fail
      await Promise.all(imagePromises);
      console.log('All images preloaded');
    };
    
    // Combined effect for image mappings
    useEffect(() => {
      console.log('Setting up image mappings...');
      
      // Add direct hardcoded fallback mappings for specific placeholders
      const hardcodedMap: Record<string, string> = {};
      
      // Extract placeholders from content
      const placeholderRegex = /image-placeholder-[^)"\\s]+/g;
      const placeholders = content.match(placeholderRegex) || [];
      console.log('Extracted placeholders:', placeholders);
      
      // Then fetch API mappings and merge them, preserving hardcoded mappings
      fetch(\`/api/image-map?postId=\${postId}&placeholders=\${placeholders.join(',')}\`)
        .then(res => {
          console.log('Image map API response status:', res.status);
          if (!res.ok) {
            throw new Error(\`Failed to fetch image map: \${res.status} \${res.statusText}\`);
          }
          return res.json();
        })
        .then(async fetchedMap => {
          console.log('API returned mappings:', fetchedMap);
          
          // Merge with priority to fetched mappings but keep hardcoded as fallback
          const combinedMap = {...hardcodedMap, ...fetchedMap};
          console.log('Combined map:', combinedMap);
          setImageMap(combinedMap);
          setIsLoading(false);
          
          // Preload images after mapping is set
          await preloadImages(combinedMap);
          setLoadedImages(true);
        })
        .catch(err => {
          console.error('Error fetching image map:', err);
          // Fall back to hardcoded mappings if fetch fails
          console.log('Falling back to hardcoded mappings');
          setImageMap(hardcodedMap);
          setIsLoading(false);
          
          // Attempt to preload hardcoded images
          preloadImages(hardcodedMap).then(() => {
            setLoadedImages(true);
          });
        });
    }, [postId, content]);

    // Include a helper function for tag colors
    function getTagColorClass(notionColor: string) {
      const colorMap = {
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
    
      return colorMap[notionColor as keyof typeof colorMap] || colorMap.default;
    }
  
    return (
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <MotionConfig reducedMotion="user">
          <SidebarInset className="overflow-x-hidden">
            <header className="flex h-14 md:h-16 shrink-0 items-center gap-1 md:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background">
              <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
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
              className="container mx-auto py-4 sm:py-6 md:py-10 px-3 sm:px-4 md:px-6 max-w-3xl overflow-hidden"
            >
              <header className="mb-6 md:mb-8">
                <h1 className={\`\${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3\`}>{${JSON.stringify(title)}}</h1>
                ${date ? `<time className="text-gray-500 text-base sm:text-lg">${date}</time>` : ''}
                
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={\`px-3 py-1 rounded-full text-sm \${getTagColorClass(tag.color)}\`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </header>
              
              {isLoading ? (
                <div className="animate-pulse">Loading content...</div>
              ) : (
                <div className={\`prose dark:prose-invert max-w-none prose-base sm:prose-lg md:prose-lg lg:prose-xl \${crimsonText.className} prose-headings:mb-3 prose-p:mb-3 sm:prose-p:mb-4 prose-p:leading-relaxed prose-li:my-1 sm:prose-li:my-2 overflow-hidden prose-pre:overflow-x-auto\`}>
                  <ReactMarkdown 
                    key={loadedImages ? 'loaded' : 'loading'}
                    components={{
                      img: ({ node, ...props }) => {
                        const imageSrc = props.src || '';
                        console.log('Rendering image in markdown:', imageSrc);
                        console.log('Available mappings:', Object.keys(imageMap));
                        console.log('Image mapped?', !!imageMap[imageSrc]);
                        
                        // First check if we have a mapping
                        if (imageMap[imageSrc]) {
                          console.log(\`Using mapped image: \${imageMap[imageSrc]}\`);
                          return (
                            <div className="my-6 sm:my-8 w-full">
                              <Image 
                                src={imageMap[imageSrc]} 
                                alt={props.alt || ''} 
                                className="rounded-lg w-full shadow-md hover:shadow-lg transition-shadow"
                                width={0}
                                height={0}
                                sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 800px"
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  maxHeight: '70vh',
                                  objectFit: 'contain'
                                }}
                                priority={true}
                              />
                            </div>
                          );
                        }
                        
                        // If all else fails, try SecureImage
                        return (
                          <div className="my-6 sm:my-8 w-full">
                            <SecureImage 
                              src={imageSrc} 
                              alt={props.alt || ''} 
                              className="rounded-lg shadow-md hover:shadow-lg transition-shadow w-full h-auto max-h-[70vh] object-contain" 
                              postId={postId}
                              imageMap={imageMap}
                            />
                          </div>
                        );
                      },
                    }}
                  >{content}</ReactMarkdown>
                </div>
              )}
            </motion.article>
        
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Back to top"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
          </SidebarInset>
        </MotionConfig>
      </SidebarProvider>
    );
  }`;
}