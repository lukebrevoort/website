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
    
    // SUPER VERBOSE DEBUGGING - Hard-code expected placeholders for verification
    const expectedPlaceholders = [
      'image-placeholder-Blog_Image.jpeg',
      'image-placeholder-Mar_21_Screenshot_from_Blog.png'
    ];
    console.log('Expected placeholders:', expectedPlaceholders);
    
    // Extract placeholders from the page content
    const postDir = path.join(process.cwd(), 'src/app/blog/posts', postId);
    const pagePath = path.join(postDir, 'page.tsx');
    let placeholders: string[] = [];
    
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      console.log('Content length from page.tsx:', content.length);
      
      // LOG SAMPLE of content to see if the placeholders are actually in there
      console.log('Content sample:', content.substring(0, 300) + '...');
      console.log('Content contains Blog_Image?', content.includes('Blog_Image'));
      console.log('Content contains Mar_21?', content.includes('Mar_21'));
      
      // Extract image-placeholder mentions
      const placeholderRegex = /(image-placeholder-[a-zA-Z0-9_.-]+)/g;
      const matches = content.match(placeholderRegex);
      
      console.log('Regex matches:', matches);
      
      if (matches) {
        placeholders = [...new Set(matches)]; // Remove duplicates
        console.log(`Found ${placeholders.length} placeholders in page content:`, placeholders);
      } else {
        console.log('NO MATCHES FOUND with regex - USING HARDCODED PLACEHOLDERS FOR DEBUGGING');
        placeholders = expectedPlaceholders;
      }
    } else {
      console.log(`⚠️ WARNING: File not found: ${pagePath}`);
      console.log('USING HARDCODED PLACEHOLDERS FOR DEBUGGING');
      placeholders = expectedPlaceholders;
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
        
        // IMPROVED DIRECT SUBSTRING MATCHING ALGORITHM
        for (const placeholder of placeholders) {
          console.log(`Finding match for placeholder: ${placeholder}`);
          
          // Extract the base name from the placeholder (without "image-placeholder-" prefix and without extension)
          const placeholderFilename = placeholder.replace('image-placeholder-', '');
          const placeholderBase = placeholderFilename.split('.')[0];
          
          console.log(`  - Extracted base name: "${placeholderBase}"`);
          
          // Try to find a blob URL that contains this base name as a substring
          let matchFound = false;
          
          for (const blob of blobs) {
            const blobUrl = blob.url || '';
            if (!blobUrl) continue;
            
            // Case-insensitive check
            const blobUrlLower = blobUrl.toLowerCase();
            const baseNameLower = placeholderBase.toLowerCase();
            
            // Log each comparison being made
            console.log(`  - Checking if "${baseNameLower}" is in "${blobUrlLower.substring(0, 70)}..."`);
            console.log(`    Result: ${blobUrlLower.includes(baseNameLower)}`);
            
            // Check if the blob URL contains the placeholder base name as a substring
            if (blobUrlLower.includes(baseNameLower)) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`✅ MATCH FOUND: ${placeholder} -> ${blobUrl}`);
              console.log(`   Matched because "${placeholderBase}" is in the URL`);
              matchFound = true;
              break; // Stop looking for this placeholder
            }
            
            // Special case for the Mar_21_Screenshot
            if (placeholderBase === 'Mar_21_Screenshot_from_Blog' && 
                blobUrlLower.includes('mar_21') && 
                blobUrlLower.includes('screenshot')) {
              reconstructedMap[placeholder] = blobUrl;
              console.log(`✅ SPECIAL MATCH FOUND: ${placeholder} -> ${blobUrl}`);
              console.log(`   Matched because both "Mar_21" and "Screenshot" are in the URL`);
              matchFound = true;
              break;
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
        
        // FALLBACK: Direct hard-coded mapping for debugging
        console.log('No mappings found with algorithm, using direct URL matching');
        
        // Look for blobs that directly contain the names we're looking for
        for (const blob of blobs) {
          const blobUrl = blob.url || '';
          if (!blobUrl) continue;
          
          if (blobUrl.includes('Blog_Image')) {
            reconstructedMap['image-placeholder-Blog_Image.jpeg'] = blobUrl;
            console.log(`✅ DIRECT MATCH: image-placeholder-Blog_Image.jpeg -> ${blobUrl}`);
          }
          
          if (blobUrl.includes('Mar_21_Screenshot_from_Blog')) {
            reconstructedMap['image-placeholder-Mar_21_Screenshot_from_Blog.png'] = blobUrl;
            console.log(`✅ DIRECT MATCH: image-placeholder-Mar_21_Screenshot_from_Blog.png -> ${blobUrl}`);
          }
        }
        
        if (Object.keys(reconstructedMap).length > 0) {
          console.log(`Found ${Object.keys(reconstructedMap).length} direct mappings`);
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