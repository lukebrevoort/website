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
            console.log(`Found ${placeholders.length} placeholders in page content`);
          }
        }
        
        // For each blob, try to match to placeholders
        for (const blob of blobs) {
          const blobUrl = blob.url || '';
          
          for (const placeholder of placeholders) {
            // Extract filename from placeholder
            const filename = placeholder.replace('image-placeholder-', '');
            // Check if blob URL contains this filename (with or without extension)
            const filenameBase = filename.split('.')[0]; // Get filename without extension
            
            if (blobUrl.includes(filename) || 
                (filenameBase && blobUrl.includes(filenameBase))) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`Mapped ${placeholder} -> ${blobUrl}`);
            }
          }
          
          // Also look for image filenames in blob URLs directly
          const blobFilename = blobUrl.split('/').pop()?.split('?')[0] || '';
          if (blobFilename) {
            // Check if this might match one of our placeholders by filename
            placeholders.forEach(placeholder => {
              const placeholderFilename = placeholder.replace('image-placeholder-', '');
              const placeholderBase = placeholderFilename.split('.')[0];
              const blobBase = blobFilename.split('.')[0];
              
              // Match if the filename or base filename matches
              if (blobFilename.includes(placeholderFilename) || 
                  (placeholderBase && blobBase && blobBase.includes(placeholderBase))) {
                reconstructedMap[placeholder] = blobUrl;
                console.log(`Fuzzy mapped ${placeholder} -> ${blobUrl}`);
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
        }
      }
      
      console.log('No relevant blobs found, returning empty mapping');
      return NextResponse.json({});
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