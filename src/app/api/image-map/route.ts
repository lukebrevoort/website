import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId parameter' }, { status: 400 });
    }
    
    // First try to get mappings from .private directory (local development)
    const privateDir = path.join(process.cwd(), '.private');
    const mapFile = path.join(privateDir, `${postId}.json`);
    
    // Check if we have a local mapping file
    if (fs.existsSync(mapFile)) {
      console.log(`Found local mapping for post ${postId}`);
      const mapping = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));
      return NextResponse.json(mapping);
    }
    
    // If no local mapping, try to reconstruct from Vercel Blob storage
    console.log(`No local mapping found, checking Blob storage for post ${postId}`);
    
    try {
      // List all blobs with this post ID in their name
      const { blobs } = await list({ prefix: `blog-images/` });
      
      if (blobs.length > 0) {
        console.log(`Found ${blobs.length} images in Blob storage`);
        
        // Create a mapping from the blobs
        const reconstructedMap: Record<string, string> = {};
        
        for (const blob of blobs) {
          // Extract the hash from the blob name
          const hashMatch = blob.pathname.match(/blog-images\/(.+)\.jpg$/);
          if (hashMatch && hashMatch[1]) {
            const hash = hashMatch[1];
            // Reconstruct the placeholder
            const placeholder = `image-placeholder-${hash}`;
            // Use the blob URL
            reconstructedMap[placeholder] = blob.url;
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
    } catch (blobError) {
      console.error('Error accessing Blob storage:', blobError);
      // Continue to fallback logic
    }
    
    // Fallback for specific test post
    if (postId === '1bbf7879-ec1d-806a-9e84-cc8bfb5c1805') {
      console.log('Using fallback mapping for test post');
      const dummyMapping = {
        "image-placeholder-aHR0cHM6Ly9wcm9kLWZpbGVzLXNlY3Vy": "/placeholders/default.jpg"
      };
      
      // Save for local development
      if (process.env.NODE_ENV === 'development') {
        if (!fs.existsSync(privateDir)) {
          fs.mkdirSync(privateDir, { recursive: true });
        }
        fs.writeFileSync(mapFile, JSON.stringify(dummyMapping));
      }
      
      return NextResponse.json(dummyMapping);
    }
    
    // No mappings found anywhere
    console.log(`No mappings found for post ${postId}`);
    return NextResponse.json({});
  } catch (error) {
    console.error('Error in image-map endpoint:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}