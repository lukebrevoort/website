import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageUrl || !imageHash) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Define blob name/path (will be used in URL)
    const blobName = `blog-images/${imageHash}.jpg`;
    
    // Check if the blob already exists - list blob with a prefix
    const { blobs } = await list({ prefix: blobName });
    
    // If we found the image in blob storage, return its URL
    if (blobs.length > 0) {
      console.log(`Found existing image in Blob storage: ${blobs[0].url}`);
      return NextResponse.json({ imagePath: blobs[0].url });
    }
    
    console.log(`Fetching new image from: ${imageUrl.substring(0, 50)}...`);
    
    try {
      // Fetch the image
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlogImageFetcher/1.0)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      // Get the image data
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const imageBuffer = await response.arrayBuffer();
      
      // Upload to Vercel Blob
      const blob = await put(blobName, imageBuffer, {
        contentType: contentType,
        access: 'public',
      });
      
      console.log(`Uploaded to Blob storage: ${blob.url}`);
      
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