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
        
        // Process each placeholder and try to match against blobs
        placeholders.forEach(placeholder => {
          const placeholderFilename = placeholder.replace('image-placeholder-', '');
          const placeholderBase = placeholderFilename.split('.')[0];
          
          console.log(`Looking for matches for placeholder: ${placeholder} (${placeholderFilename})`);
          
          // Try to find a match for this placeholder in the blobs
          for (const blob of blobs) {
            const blobUrl = blob.url || '';
            if (!blobUrl) continue;
            
            // Get the filename part from the URL
            const urlParts = blobUrl.split('/');
            const blobFilename = urlParts[urlParts.length - 1].split('?')[0];
            
            // IMPROVED: Extract original filename using pattern recognition
            // Pattern: originalname.ext-randomstring.jpg
            const patternMatch = blobFilename.match(/(.+)-[A-Za-z0-9]{10,32}\.jpg$/);
            let originalFilename = blobFilename;
            
            if (patternMatch && patternMatch[1]) {
              originalFilename = patternMatch[1];
              console.log(`Extracted original filename from blob: ${originalFilename}`);
            }
            
            // Now compare the extracted original filename with our placeholder
            const originalBase = originalFilename.split('.')[0];
            
            // Check for various types of matches
            const isMatch = 
              // Direct filename match
              originalFilename === placeholderFilename ||
              // Base name match (ignoring extension)
              originalBase === placeholderBase ||
              // Original filename contains the placeholder filename or vice versa
              originalFilename.includes(placeholderFilename) ||
              placeholderFilename.includes(originalFilename) ||
              // Base name contains each other
              originalBase.includes(placeholderBase) ||
              placeholderBase.includes(originalBase);
            
            if (isMatch) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`✅ MATCHED ${placeholder} -> ${blobUrl} (original: ${originalFilename})`);
              break; // Found a match for this placeholder
            }
          }
        });
        
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
          // No mappings found, try an even more aggressive approach
          console.log(`No direct mappings found, trying aggressive fuzzy matching...`);
          
          // Super fuzzy matching - just try to match any part of the filename
          placeholders.forEach(placeholder => {
            const placeholderFilename = placeholder.replace('image-placeholder-', '');
            const placeholderBase = placeholderFilename.split('.')[0].toLowerCase();
            
            for (const blob of blobs) {
              const blobUrl = blob.url || '';
              if (!blobUrl || reconstructedMap[placeholder]) continue; // Skip if already matched
              
              const blobFilename = blobUrl.split('/').pop()?.split('?')[0] || '';
              
              // Try different methods to extract the meaningful part
              const possibleOriginals = [
                blobFilename,
                blobFilename.split('-')[0],
                blobFilename.replace(/-[A-Za-z0-9]{10,32}\.jpg$/, '')
              ];
              
              for (const possibleOriginal of possibleOriginals) {
                // Convert both to lowercase for case-insensitive matching
                const original = possibleOriginal.toLowerCase();
                
                // Check if any part of the original matches any part of the placeholder
                if (original.includes(placeholderBase) || 
                    placeholderBase.includes(original) ||
                    (placeholderBase.length > 5 && original.includes(placeholderBase.substring(0, 5)))) {
                  reconstructedMap[placeholder] = blobUrl;
                  console.log(`⚠️ FUZZY MATCH: ${placeholder} -> ${blobUrl} (matched part: ${possibleOriginal})`);
                  break;
                }
              }
              
              if (reconstructedMap[placeholder]) break; // Stop if we found a match
            }
          });
          
          if (Object.keys(reconstructedMap).length > 0) {
            console.log(`Created ${Object.keys(reconstructedMap).length} aggressive fuzzy mappings`);
            return NextResponse.json(reconstructedMap);
          }
          
          // Last resort: Just assign any image to any placeholder
          if (placeholders.length > 0 && blobs.length > 0) {
            console.log('Last resort: Assigning arbitrary images to placeholders');
            
            placeholders.forEach((placeholder, index) => {
              // Use modulo to cycle through available blobs
              const blobIndex = index % blobs.length;
              const blob = blobs[blobIndex];
              if (blob.url) {
                reconstructedMap[placeholder] = blob.url;
                console.log(`📌 ARBITRARY ASSIGNMENT: ${placeholder} -> ${blob.url}`);
              }
            });
            
            if (Object.keys(reconstructedMap).length > 0) {
              console.log(`Created ${Object.keys(reconstructedMap).length} arbitrary mappings`);
              return NextResponse.json(reconstructedMap);
            }
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