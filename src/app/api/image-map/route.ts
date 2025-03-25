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
        
        // Process each placeholder and try to match against blobs
        for (const placeholder of placeholders) {
          const placeholderFilename = placeholder.replace('image-placeholder-', '');
          const placeholderBase = placeholderFilename.split('.')[0].toLowerCase();
          
          console.log(`Looking for matches for placeholder: ${placeholder} (${placeholderFilename})`);
          
          // Various approaches to extract real filename from blob
          for (const blob of blobs) {
            const blobUrl = blob.url || '';
            if (!blobUrl) continue;
            
            // Get the full filename from the URL (everything after the last slash)
            const fullBlobFilename = blobUrl.split('/').pop()?.split('?')[0] || '';
            
            // 1. Try to match based on the Vercel Blob naming pattern
            // Typical pattern: originalname-randomstring.ext
            const patternMatch = fullBlobFilename.match(/([^-]+)(?:-[^\.]+)?\.([^\.]+)$/);
            
            let extractedName = '';
            if (patternMatch) {
              extractedName = patternMatch[1];
              console.log(`Extracted name from pattern: ${extractedName}`);
            }
            
            // 2. Also try the full name without the query string
            const blobFilename = fullBlobFilename.split('-')[0];
            
            // 3. And try the whole thing before any extension
            const blobFileBase = fullBlobFilename.split('.')[0];
            
            // LOGGING: Output all the compared values
            console.log(`Comparing: 
              - Placeholder: ${placeholderFilename} (base: ${placeholderBase})
              - Blob full: ${fullBlobFilename}
              - Blob part: ${blobFilename}
              - Blob base: ${blobFileBase}
              - Extracted: ${extractedName}
            `);
            
            // Check all possible matching strategies
            const matchStrategies = [
              // Strategy 1: Direct match on placeholder filename
              fullBlobFilename === placeholderFilename,
              // Strategy 2: Direct match on placeholder base name
              blobFilename === placeholderBase,
              // Strategy 3: Extracted name matches placeholder base
              extractedName.toLowerCase() === placeholderBase,
              // Strategy 4: Contains relationship
              fullBlobFilename.toLowerCase().includes(placeholderBase),
              placeholderBase.includes(blobFilename.toLowerCase()),
              // Strategy 5: Word matching - split by underscores, dashes, etc.
              placeholderBase.split(/[_\-\s]/).some(word => 
                word.length > 2 && fullBlobFilename.toLowerCase().includes(word.toLowerCase())
              ),
              // Strategy 6: Special case for date-based filenames (Mar_21)
              placeholderBase.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i) &&
              fullBlobFilename.toLowerCase().includes(placeholderBase.substring(0, 3).toLowerCase())
            ];
            
            const matchIndex = matchStrategies.findIndex(strategy => strategy);
            
            if (matchIndex >= 0) {
              console.log(`✅ Match found using strategy ${matchIndex + 1}: ${placeholder} -> ${blobUrl}`);
              reconstructedMap[placeholder] = blobUrl;
              break; // Found a match for this placeholder, move on
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