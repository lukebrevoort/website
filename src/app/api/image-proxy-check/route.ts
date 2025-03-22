import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const hash = request.nextUrl.searchParams.get('hash');
    
    if (!hash) {
      return NextResponse.json({ error: 'Missing hash parameter' }, { status: 400 });
    }
    
    console.log(`Checking for image with hash: ${hash}`);
    
    // Look for the image in blob storage
    const blobName = `blog-images/${hash}.jpg`;
    
    try {
      const { blobs } = await list({ prefix: blobName });
      
      if (blobs.length > 0) {
        console.log(`Found image in Blob storage: ${blobs[0].url}`);
        return NextResponse.json({ imagePath: blobs[0].url });
      }
      
      console.log(`No image found for hash: ${hash}`);
      return NextResponse.json({ imagePath: '/placeholders/default.jpg' });
    } catch (error) {
      console.error('Error checking blob storage:', error);
      return NextResponse.json({ 
        error: 'Error checking blob storage',
        imagePath: '/placeholders/default.jpg' 
      });
    }
  } catch (error) {
    console.error('Error in image-proxy-check:', error);
    return NextResponse.json({ 
      error: 'Server error',
      imagePath: '/placeholders/default.jpg' 
    });
  }
}