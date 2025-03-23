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
      // List all blobs with prefix 'image-cache/' which is where your images are now
      const { blobs } = await list({ prefix: 'image-cache/' });
      
      console.log(`Found ${blobs.length} relevant blobs in storage`);
      
      if (blobs.length > 0) {
        // Create a mapping from the blobs
        const reconstructedMap: Record<string, string> = {};
        
        for (const blob of blobs) {
          const blobUrl = blob.url || '';
          
          // Extract potential hashes from the blob URL
          const matches = blobUrl.match(/([A-Za-z0-9]{32})/);
          if (matches && matches[1]) {
            const extractedHash = matches[1];
            
            // Check if this extracted hash matches any of our expected hashes
            const expectedHashes = ['0zo7EufQ5ANX7ohKboSu9tTUXBPXRqei', 'Kt4kyWzPvlxsTVuS9Z2DzDagLpQGmwQo'];
            for (const expectedHash of expectedHashes) {
              if (blobUrl.includes(expectedHash)) {
                const placeholder = `image-placeholder-${expectedHash}`;
                reconstructedMap[placeholder] = blobUrl;
                console.log(`Mapped ${placeholder} -> ${blobUrl}`);
                break;
              }
            }
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