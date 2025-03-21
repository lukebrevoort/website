import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageHash) {
      return NextResponse.json({ error: 'Missing hash parameter' }, { status: 400 });
    }
    
    // Define blob name/path pattern
    const blobPrefix = `blog-images/${imageHash}`;
    
    // Check if the blob already exists
    const { blobs } = await list({ prefix: blobPrefix });
    
    // If we found the image in blob storage, return its URL
    if (blobs.length > 0) {
      console.log(`Found existing image in Blob storage: ${blobs[0].url}`);
      return NextResponse.json({ imagePath: blobs[0].url });
    }
    
    // No blob found
    return NextResponse.json({ 
      error: 'No image found with this hash',
      imagePath: '/placeholders/default.jpg'
    });
  } catch (error) {
    console.error('Error checking for image:', error);
    return NextResponse.json({ 
      error: 'Server error',
      imagePath: '/placeholders/default.jpg' 
    }, { status: 200 });
  }
}