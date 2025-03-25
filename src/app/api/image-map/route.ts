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
    
    // KNOWN PLACEHOLDERS - use these as fallback if we can't extract them
    const knownPlaceholders = [
      'image-placeholder-Blog_Image.jpeg',
      'image-placeholder-Mar_21_Screenshot_from_Blog.png'
    ];
    let placeholders = knownPlaceholders; // Default to known placeholders
    
    // First check custom .private directory for cached mappings
    const privateDir = path.join(process.cwd(), '.private');
    const mapFile = path.join(privateDir, `${postId}.json`);
    
    if (fs.existsSync(mapFile)) {
      console.log(`Found local mapping file: ${mapFile}`);
      const map = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));
      console.log(`Loaded ${Object.keys(map).length} mappings from cache`);
      return NextResponse.json(map);
    }
    
    console.log(`No local mapping found, checking Blob storage for placeholders: ${placeholders}`);
    
    // Check blob storage
    try {
      const { blobs } = await list();
      console.log(`Found ${blobs.length} total blobs in storage`);
      
      if (blobs.length > 0) {
        const reconstructedMap: Record<string, string> = {};
        
        // Debug: Print all blob URLs
        console.log('Available blob URLs:');
        blobs.forEach((blob, index) => {
          console.log(`[${index}] ${blob.url}`);
        });
        
        // Direct matching algorithm - simple and reliable
        for (const placeholder of placeholders) {
          console.log(`Finding match for placeholder: ${placeholder}`);
          
          // Extract base name without prefix and extension
          const placeholderFilename = placeholder.replace('image-placeholder-', '');
          const placeholderBase = placeholderFilename.split('.')[0];
          
          console.log(`Looking for base name: "${placeholderBase}"`);
          
          // Find matching blob
          for (const blob of blobs) {
            const blobUrl = blob.url || '';
            if (!blobUrl) continue;
            
            // Case-insensitive check
            if (blobUrl.toLowerCase().includes(placeholderBase.toLowerCase())) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`✅ MATCH FOUND: ${placeholder} -> ${blobUrl}`);
              break; // Stop looking for this placeholder
            }
          }
        }
        
        if (Object.keys(reconstructedMap).length > 0) {
          console.log(`Found ${Object.keys(reconstructedMap).length} mappings`);
          
          // For development, save mapping for future use
          if (process.env.NODE_ENV === 'development' && !fs.existsSync(privateDir)) {
            try {
              fs.mkdirSync(privateDir, { recursive: true });
              fs.writeFileSync(mapFile, JSON.stringify(reconstructedMap, null, 2));
              console.log(`Saved mapping to ${mapFile}`);
            } catch (fsError) {
              console.error('Error saving mapping file:', fsError);
            }
          }
          
          return NextResponse.json(reconstructedMap);
        }
      }
      
      console.log('No mappings found, returning empty map');
      return NextResponse.json({});
    } catch (blobError) {
      console.error('Error accessing Blob storage:', blobError);
      return NextResponse.json({});
    }
  } catch (error) {
    console.error('Error in image-map API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}