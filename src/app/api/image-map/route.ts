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
    
    // HARDCODED MAPPINGS - add direct mappings for known placeholders
    // This is a fallback for when automatic matching fails
    const hardcodedMappings: Record<string, string> = {
      'image-placeholder-Blog_Image.jpeg': 'https://zah3ozwhv9cp0qic.public.blob.vercel-storage.com/Blog_Image-AmTPaYs4kz4ll6pG2ApjIziS9xTZhl.jpeg',
      'image-placeholder-Mar_21_Screenshot_from_Blog.png': 'https://zah3ozwhv9cp0qic.public.blob.vercel-storage.com/JPEG_image-4AF6-B04C-12-0.jpeg-I92hDi0iwQCDYqt7AcaMqvxF7D0ili.jpg'
    };
    
    // Check if we have hardcoded mappings for this post's placeholders
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
        
        // Check if all placeholders have hardcoded mappings
        const allMapped = placeholders.every(p => !!hardcodedMappings[p]);
        if (allMapped) {
          console.log('All placeholders have hardcoded mappings - using those');
          // Filter to only include mappings for the placeholders in this post
          const relevantMappings = Object.fromEntries(
            Object.entries(hardcodedMappings).filter(([key]) => placeholders.includes(key))
          );
          return NextResponse.json(relevantMappings);
        }
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
        
        // First apply any hardcoded mappings we have
        placeholders.forEach(placeholder => {
          if (hardcodedMappings[placeholder]) {
            reconstructedMap[placeholder] = hardcodedMappings[placeholder];
            console.log(`Using hardcoded mapping: ${placeholder} -> ${hardcodedMappings[placeholder]}`);
          }
        });
        
        // Debug: Print all blob URLs to help with debugging
        console.log('Available blob URLs:');
        blobs.forEach((blob, index) => {
          console.log(`[${index}] ${blob.url}`);
        });
        
        // Process each placeholder and try to match against blobs (only for ones without hardcoded mappings)
        placeholders.forEach(placeholder => {
          // Skip if we already have a mapping from hardcoded values
          if (reconstructedMap[placeholder]) return;
          
          const placeholderFilename = placeholder.replace('image-placeholder-', '');
          const placeholderBase = placeholderFilename.split('.')[0].toLowerCase();
          
          console.log(`Looking for matches for placeholder: ${placeholder} (${placeholderFilename})`);
          
          // SUPER AGGRESSIVE matching - try multiple approaches
          let bestMatch: string | null = null;
          let bestMatchScore = 0;
          
          for (const blob of blobs) {
            const blobUrl = blob.url || '';
            if (!blobUrl) continue;
            
            // Get the filename part from the URL
            const urlParts = blobUrl.split('/');
            const blobFilename = urlParts[urlParts.length - 1].split('?')[0];
            
            // Extract parts of the blob filename
            let originalFilename = blobFilename;
            const dashIndex = blobFilename.indexOf('-');
            if (dashIndex > 0) {
              // Get everything before the first dash
              originalFilename = blobFilename.substring(0, dashIndex);
            }
            
            // Get base name without extension
            const originalBase = originalFilename.split('.')[0].toLowerCase();
            
            // Calculate match score - higher is better
            let matchScore = 0;
            
            // Exact filename match is best
            if (originalFilename === placeholderFilename) {
              matchScore = 100;
            } 
            // Base name exact match is good
            else if (originalBase === placeholderBase) {
              matchScore = 90;
            }
            // One contains the other completely
            else if (originalFilename.includes(placeholderFilename) || placeholderFilename.includes(originalFilename)) {
              matchScore = 80;
            }
            // Base names contain each other
            else if (originalBase.includes(placeholderBase) || placeholderBase.includes(originalBase)) {
              matchScore = 70;
            }
            // Partial word matching 
            else {
              // Split into words and see if any words match
              const placeholderWords = placeholderBase.split(/[_\s-]/);
              const originalWords = originalBase.split(/[_\s-]/);
              
              const matchingWords = placeholderWords.filter(word => 
                word.length > 2 && originalWords.some(oWord => oWord.includes(word) || word.includes(oWord))
              );
              
              if (matchingWords.length > 0) {
                matchScore = 50 + (matchingWords.length * 5);
              }
              
              // Special case for dates in filenames
              if (placeholderFilename.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)_\d+\b/i)) {
                // Prioritize screenshots for these date-based placeholders
                if (blobFilename.toLowerCase().includes('screenshot') || 
                    blobFilename.toLowerCase().includes('scr') || 
                    blobFilename.toLowerCase().includes('screen')) {
                  matchScore += 15;
                }
              }
            }
            
            if (debug) {
              console.log(`Match score for ${placeholder} -> ${blobFilename}: ${matchScore}`);
            }
            
            // Keep track of best match
            if (matchScore > bestMatchScore) {
              bestMatchScore = matchScore;
              bestMatch = blobUrl;
            }
          }
          
          // If we found a match with a score above threshold, use it
          if (bestMatch && bestMatchScore > 20) {
            reconstructedMap[placeholder] = bestMatch;
            console.log(`🏆 BEST MATCH (score ${bestMatchScore}): ${placeholder} -> ${bestMatch}`);
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
        }
        
        // LAST RESORT: Just use the hardcoded mappings we provided
        if (Object.keys(hardcodedMappings).length > 0) {
          console.log('Using hardcoded mappings as last resort');
          return NextResponse.json(hardcodedMappings);
        }
        
        console.log('No relevant blobs found, returning empty mapping');
        return NextResponse.json({});
      } else {
        // No blobs in storage, but we might have hardcoded mappings
        if (Object.keys(hardcodedMappings).length > 0) {
          console.log('No blobs found, using hardcoded mappings');
          return NextResponse.json(hardcodedMappings);
        }
        
        console.log('No blobs found in storage');
        return NextResponse.json({});
      }
    } catch (blobError) {
      console.error('Error accessing Blob storage:', blobError);
      
      // If we fail to access blob storage, fall back to hardcoded mappings
      if (Object.keys(hardcodedMappings).length > 0) {
        console.log('Blob storage error, using hardcoded mappings');
        return NextResponse.json(hardcodedMappings);
      }
    }
    
    // Final fallback - empty mapping
    console.log(`No mappings found for post ${postId}`);
    return NextResponse.json({});
  } catch (error) {
    console.error('Error in image-map API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}