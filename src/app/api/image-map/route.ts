import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId');
    const debug = request.nextUrl.searchParams.get('debug') === 'true';
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId parameter' }, { status: 400 });
    }
    
    console.log(`Fetching image map for post ${postId}`);
    
    // Extract placeholders from the page content
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
    
    // Check local file system cache
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
        let reconstructedMap: Record<string, string> = {};
        
        // Debug: Print all blob URLs to help with debugging
        console.log('Available blob URLs:');
        blobs.forEach((blob, index) => {
          console.log(`[${index}] ${blob.url}`);
        });
        
        // NEW DIRECT SUBSTRING MATCHING ALGORITHM
        for (const placeholder of placeholders) {
          console.log(`Finding match for placeholder: ${placeholder}`);
          
          // Extract the base name from the placeholder (without "image-placeholder-" prefix and without extension)
          const placeholderFilename = placeholder.replace('image-placeholder-', '');
          const placeholderBase = placeholderFilename.split('.')[0];
          
          // Try to find a blob URL that contains this base name as a substring
          let matchFound = false;
          
          for (const blob of blobs) {
            const blobUrl = blob.url || '';
            if (!blobUrl) continue;
            
            // Check if the blob URL contains the placeholder base name as a substring
            if (blobUrl.includes(placeholderBase)) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`✅ MATCH FOUND: ${placeholder} -> ${blobUrl}`);
              console.log(`   Matched because "${placeholderBase}" is in the URL`);
              matchFound = true;
              break; // Stop looking for this placeholder
            }
          }
          
          if (!matchFound) {
            console.log(`❌ No match found for ${placeholder}`);
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
        
        console.log('No mappings found, returning empty map');
        return NextResponse.json({});
      } else {
        console.log('No blobs found in storage');
        return NextResponse.json({});
      }
    } catch (blobError) {
      console.error('Error accessing Blob storage:', blobError);
      return NextResponse.json({});
    }
  } catch (error) {
    console.error('Error in image-map API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}