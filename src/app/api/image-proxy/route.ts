import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

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
    if (!fs.existsSync(cacheDir)) {
      await fsPromises.mkdir(cacheDir, { recursive: true });
    }
    
    const cachedImagePath = path.join(cacheDir, `${imageHash}.jpg`);
    const cachedImagePublicPath = `/image-cache/${imageHash}.jpg`;
    
    // Check if image is already cached
    if (fs.existsSync(cachedImagePath)) {
      // Return the cached image path
      return NextResponse.json({ imagePath: cachedImagePublicPath });
    }
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: 500 });
    }
    
    // Get image as buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Save image to cache
    await fsPromises.writeFile(cachedImagePath, Buffer.from(imageBuffer));
    
    // Return the cached image path
    return NextResponse.json({ imagePath: cachedImagePublicPath });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}