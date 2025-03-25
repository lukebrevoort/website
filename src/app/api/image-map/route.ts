import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId parameter' }, { status: 400 });
    }
    
    console.log(`Fetching image map for post ${postId}`);
    
    // Check local file system first (for development and cached maps)
    const privateDir = path.join(process.cwd(), '.private');
    const mapFile = path.join(privateDir, `${postId}.json`);
    
    if (fs.existsSync(mapFile)) {
      console.log(`Found local mapping file: ${mapFile}`);
      const map = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));
      console.log(`Loaded ${Object.keys(map).length} mappings`);
      return NextResponse.json(map);
    }
    
    console.log(`No local mapping found, checking Blob storage for post ${postId}`);
    
    // Check blob storage
    try {
      // Listing all blobs in the storage
      const { blobs } = await list();
      
      console.log(`Found ${blobs.length} total blobs in storage`);
      
      if (blobs.length > 0) {
        // Create a mapping from the blobs
        const reconstructedMap: Record<string, string> = {};
        
        // Extract placeholders from existing page.tsx content if available
        const postDir = path.join(process.cwd(), 'src/app/blog/posts', postId);
        const pagePath = path.join(postDir, 'page.tsx');
        let placeholders: string[] = [];
        
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');
          // Extract image-placeholder mentions
          const placeholderRegex = /(image-placeholder-[a-zA-Z0-9_.-]+)/g;
          const matches = content.match(placeholderRegex);
          if (matches) {
            placeholders = [...new Set(matches)]; // Remove duplicates
            console.log(`Found ${placeholders.length} placeholders in page content:`, placeholders);
          }
        }
        
        // Debug: Print all blob URLs to help with debugging
        console.log('Available blob URLs:');
        blobs.forEach((blob, index) => {
          console.log(`[${index}] ${blob.url}`);
        });
        
        // Process each blob to extract original filename
        for (const blob of blobs) {
          const blobUrl = blob.url || '';
          if (!blobUrl) continue;
          
          // Get the filename part from the URL
          const urlParts = blobUrl.split('/');
          const blobFilename = urlParts[urlParts.length - 1].split('?')[0];
          
          // Extract original filename (everything before the first dash)
          const dashIndex = blobFilename.indexOf('-');
          let originalFilename = blobFilename;
          
          if (dashIndex > 0) {
            originalFilename = blobFilename.substring(0, dashIndex);
            console.log(`Extracted original filename from blob: ${originalFilename}`);
          }
          
          // Match against placeholders
          for (const placeholder of placeholders) {
            const placeholderFilename = placeholder.replace('image-placeholder-', '');
            const placeholderBase = placeholderFilename.split('.')[0];
            
            // Check if the original filename matches the placeholder
            if (
              // Direct filename match
              originalFilename === placeholderFilename ||
              // Base name match (ignoring extension)
              originalFilename.split('.')[0] === placeholderBase ||
              // Original filename contains the placeholder filename or vice versa
              originalFilename.includes(placeholderFilename) ||
              placeholderFilename.includes(originalFilename)
            ) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`Mapped ${placeholder} -> ${blobUrl} (matched original filename: ${originalFilename})`);
              break; // Found a match for this blob, move to next
            }
          }
          
          // If no match found yet, try another approach with filenames
          if (Object.keys(reconstructedMap).length === 0) {
            placeholders.forEach(placeholder => {
              const placeholderFilename = placeholder.replace('image-placeholder-', '');
              
              // Just check if the full blob URL contains the placeholder filename
              if (blobUrl.includes(placeholderFilename.split('.')[0])) {
                reconstructedMap[placeholder] = blobUrl;
                console.log(`Fallback mapped ${placeholder} -> ${blobUrl}`);
              }
            });
          }
        }
        
        // If we found any mappings, return them
        if (Object.keys(reconstructedMap).length > 0) {
          console.log(`Reconstructed ${Object.keys(reconstructedMap).length} mappings from Blob storage`);
          
          // For local development, save this mapping for future use
          if (process.env.NODE_ENV === 'development') {
            if (!fs.existsSync(privateDir)) {
              fs.mkdirSync(privateDir, { recursive: true });
            }
            fs.writeFileSync(mapFile, JSON.stringify(reconstructedMap, null, 2));
            console.log(`Saved reconstructed mapping to ${mapFile}`);
          }
          
          return NextResponse.json(reconstructedMap);
        } else {
          // No mappings found, but we have blobs, so create a fallback mapping
          console.log(`No direct mappings found, creating fallback mappings based on available blobs...`);
          
          // Simple fallback approach: For each placeholder, find any blob that might be a match
          placeholders.forEach(placeholder => {
            const placeholderFilename = placeholder.replace('image-placeholder-', '');
            const placeholderBase = placeholderFilename.split('.')[0].toLowerCase();
            
            // Look for any reasonable match in any blob
            for (const blob of blobs) {
              const blobUrl = blob.url || '';
              const blobFilename = blobUrl.split('/').pop()?.split('?')[0] || '';
              const blobLower = blobFilename.toLowerCase();
              
              // Very loose matching - if any part of the filename seems to match
              if (blobLower.includes(placeholderBase) || 
                  placeholderBase.includes(blobLower.split('-')[0])) {
                reconstructedMap[placeholder] = blobUrl;
                console.log(`Fallback loose match: ${placeholder} -> ${blobUrl}`);
                break;
              }
            }
          });
          
          if (Object.keys(reconstructedMap).length > 0) {
            console.log(`Created ${Object.keys(reconstructedMap).length} fallback mappings`);
            return NextResponse.json(reconstructedMap);
          }
          
          console.log('No relevant blobs found, returning empty mapping');
          return NextResponse.json({});
        }
      } else {
        console.log('No blobs found in storage');
        return NextResponse.json({});
      }
    } catch (blobError) {
      console.error('Error accessing Blob storage:', blobError);
      // Continue to fallback logic
    }
    
    // Fallback - empty mapping
    console.log(`No mappings found for post ${postId}`);
    return NextResponse.json({});
  } catch (error) {
    console.error('Error in image-map API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}