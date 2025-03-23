import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageUrl || !imageHash) {
      console.error('Missing required parameters:', { imageUrl, imageHash });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Determine file extension based on URL or default to jpg
    let extension = 'jpg';
    const urlExtMatch = imageUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    if (urlExtMatch && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExtMatch[1].toLowerCase())) {
      extension = urlExtMatch[1].toLowerCase();
    }
    
    const blobName = `blog-images/${imageHash}.${extension}`;
    console.log('Processing image request:', {
      url: imageUrl.substring(0, 30) + '...',
      hash: imageHash,
      blobName
    });
    
    // Check if the blob already exists (with any extension)
    try {
      console.log(`Checking if blob already exists: blog-images/${imageHash}`);
      const { blobs } = await list({ prefix: `blog-images/${imageHash}` });
      
      // If we found the image in blob storage, return its URL
      if (blobs.length > 0) {
        console.log(`Found existing image in Blob storage: ${blobs[0].url}`);
        
        // Update the local image map if we're in development
        if (process.env.NODE_ENV === 'development') {
          try {
            // Try to determine the post ID from the referrer or URL path
            const referer = request.headers.get('referer') || '';
            const postIdMatch = referer.match(/\/blog\/posts\/([^/]+)/);
            const postId = postIdMatch ? postIdMatch[1] : '';
            
            if (postId) {
              updateLocalImageMap(postId, `image-placeholder-${imageHash}`, blobs[0].url);
            }
          } catch (mapError) {
            console.error('Error updating local image map:', mapError);
            // Non-critical error, continue
          }
        }
        
        return NextResponse.json({ imagePath: blobs[0].url });
      }
    } catch (error) {
      console.error('Error checking for existing blob:', error);
      // Continue to fetch the image
    }
    
    console.log(`Fetching new image from: ${imageUrl.substring(0, 30)}...`);
    
    try {
      // Strip credential parameters from the URL if they exist
      const cleanUrl = imageUrl.replace(/([?&](?:Credential|X-Amz-Credential|AWSAccessKeyId|Security-Token|X-Amz-Security-Token|X-Amz-Date|X-Amz-Signature)=[^&]+)/g, '');
      
      // Fetch the image with appropriate headers for AWS authentication
      const imageResponse = await fetch(cleanUrl, {
        headers: {
          'Accept': 'image/*',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
      });
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      }
      
      // Get image blob
      const imageBlob = await imageResponse.blob();
      
      // Determine content type based on response or extension
      let contentType = imageResponse.headers.get('content-type') || `image/${extension === 'jpg' ? 'jpeg' : extension}`;
      
      // Upload to Vercel Blob storage
      const { url } = await put(blobName, imageBlob, {
        access: 'public',
        contentType: contentType,
        addRandomSuffix: false, // Use exact name for better caching
      });
      
      console.log(`Uploaded image to Blob storage: ${url}`);
      
      // Try to update the local image map if we're in development
      if (process.env.NODE_ENV === 'development') {
        try {
          // Try to determine the post ID from the referrer or URL path
          const referer = request.headers.get('referer') || '';
          const postIdMatch = referer.match(/\/blog\/posts\/([^/]+)/);
          const postId = postIdMatch ? postIdMatch[1] : '';
          
          if (postId) {
            updateLocalImageMap(postId, `image-placeholder-${imageHash}`, url);
          }
        } catch (mapError) {
          console.error('Error updating local image map:', mapError);
          // Non-critical error, continue
        }
      }
      
      return NextResponse.json({ imagePath: url });
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json(
        { error: 'Failed to process image', imagePath: '/placeholders/default.jpg' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in image-proxy:', error);
    return NextResponse.json(
      { error: 'Server error', imagePath: '/placeholders/default.jpg' },
      { status: 500 }
    );
  }
}

// Helper function to update the local image map
function updateLocalImageMap(postId: string, placeholder: string, url: string) {
  try {
    const privateDir = path.join(process.cwd(), '.private');
    const mapFile = path.join(privateDir, `${postId}.json`);
    
    let existingMap: Record<string, string> = {};
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(privateDir)) {
      fs.mkdirSync(privateDir, { recursive: true });
    }
    
    // Read existing map if it exists
    if (fs.existsSync(mapFile)) {
      existingMap = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));
    }
    
    // Update map with new entry
    existingMap[placeholder] = url;
    
    // Write updated map back to file
    fs.writeFileSync(mapFile, JSON.stringify(existingMap, null, 2));
    
    console.log(`Updated image map for ${postId} with ${placeholder} -> ${url}`);
  } catch (error) {
    console.error('Error updating local image map:', error);
  }
}