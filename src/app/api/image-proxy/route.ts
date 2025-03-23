import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const hash = searchParams.get('hash');
  
  if (!url || !hash) {
    return NextResponse.json(
      { error: 'Missing url or hash parameter' },
      { status: 400 }
    );
  }

  try {
    // Define blob name/path
    const blobName = `blog-images/${hash}.jpg`;
    
    // Fetch the image from the original URL
    const imageResponse = await fetch(url);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    
    // Get the image as a blob
    const imageBlob = await imageResponse.blob();
    
    // Store the image in Vercel Blob Storage
    const { url: blobUrl } = await put(blobName, imageBlob, {
      access: 'public',
      contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
    });
    
    // Return the new blob URL
    return NextResponse.json({ imagePath: blobUrl });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}