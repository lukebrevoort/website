import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the image URL from the query parameter
    const imageUrl = request.nextUrl.searchParams.get('url');
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageUrl || !imageHash) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }
    
    // Create directory for cached images if it doesn't exist
    const cacheDir = path.join(process.cwd(), 'public', 'image-cache');
    try {
      await fs.mkdir(cacheDir, { recursive: true });
    } catch (err) {
      console.error('Error creating cache directory:', err);
    }
    
    const cachedImagePath = path.join(cacheDir, `${imageHash}.jpg`);
    const cachedImagePublicPath = `/image-cache/${imageHash}.jpg`;
    
    // Check if image is already cached
    try {
      await fs.access(cachedImagePath);
      // Image exists in cache
      return NextResponse.json({ imagePath: cachedImagePublicPath });
    } catch (error) {
      // Image doesn't exist in cache, fetch it
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return new NextResponse('Failed to fetch image', { status: 500 });
      }
      
      // Get image as buffer
      const imageBuffer = await response.arrayBuffer();
      
      // Save image to cache
      await fs.writeFile(cachedImagePath, Buffer.from(imageBuffer));
      
      // Return the cached image path
      return NextResponse.json({ imagePath: cachedImagePublicPath });
    }
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}