import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageUrl || !imageHash) {
      console.error('Missing required parameters:', { imageUrl, imageHash });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Define blob name/path (will be used in URL)
    const blobName = `blog-images/${imageHash}.jpg`;
    
    console.log(`Processing image request:`, {
      url: imageUrl.substring(0, 30) + '...',
      hash: imageHash,
      blobName
    });
    
    // First check if this blob already exists
    try {
      console.log(`Checking if blob already exists: ${blobName}`);
      const { blobs } = await list({ prefix: blobName });
      
      // If we found the image in blob storage, return its URL
      if (blobs.length > 0) {
        console.log(`Found existing image in Blob storage: ${blobs[0].url}`);
        return NextResponse.json({ imagePath: blobs[0].url });
      }
    } catch (listError) {
      console.error('Error checking for existing blob:', listError);
      // Continue to try fetching the image
    }
    
    console.log(`Fetching new image from: ${imageUrl.substring(0, 30)}...`);
    
    try {
      // Sanitize the URL again just to be safe
      const sanitizedUrl = imageUrl
        .replace(/Credential=[^&]+/g, 'Credential=REDACTED')
        .replace(/X-Amz-Credential=[^&]+/g, 'X-Amz-Credential=REDACTED')
        .replace(/X-Amz-Security-Token=[^&]+/g, 'X-Amz-Security-Token=REDACTED')
        .replace(/X-Amz-Signature=[^&]+/g, 'X-Amz-Signature=REDACTED');
      
      // Fetch the image with proper headers
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlogImageFetcher/1.0)',
          'Accept': 'image/*',
          // Bypass CORS issues
          'Origin': request.headers.get('origin') || 'https://yourwebsite.com'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      // Get the image data
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const imageBuffer = await response.arrayBuffer();
      
      console.log(`Successfully fetched image, size: ${imageBuffer.byteLength} bytes, type: ${contentType}`);
      
      // Upload to Vercel Blob
      console.log(`Uploading to Vercel Blob as: ${blobName}`);
      const blob = await put(blobName, new Uint8Array(imageBuffer), {
        contentType: contentType,
        access: 'public',
      });
      
      console.log(`Successfully uploaded to Blob storage: ${blob.url}`);
      
      return NextResponse.json({ imagePath: blob.url });
    } catch (fetchError) {
      console.error('Error fetching/uploading image:', fetchError);
      
      // Return path to placeholder as fallback
      return NextResponse.json({ 
        imagePath: '/placeholders/default.jpg',
        error: 'Failed to fetch original image, using placeholder'
      });
    }
  } catch (error) {
    console.error('Error in image proxy:', error);
    return NextResponse.json({ 
      error: 'Server error',
      imagePath: '/placeholders/default.jpg' 
    }, { status: 200 });
  }
}