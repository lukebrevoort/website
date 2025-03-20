import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageUrl || !imageHash) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Make sure cache directory exists
    const cacheDir = path.join(process.cwd(), 'public', 'image-cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const cachedImagePath = path.join(cacheDir, `${imageHash}.jpg`);
    const publicPath = `/image-cache/${imageHash}.jpg`;
    
    // Return cached image if it exists
    if (fs.existsSync(cachedImagePath)) {
      console.log(`Serving cached image: ${imageHash}`);
      return NextResponse.json({ imagePath: publicPath });
    }
    
    console.log(`Fetching new image: ${imageUrl.substring(0, 50)}...`);
    
    try {
      // Download the image
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlogImageFetcher/1.0)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      // Get image data
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Save to cache
      fs.writeFileSync(cachedImagePath, buffer);
      console.log(`Cached new image: ${imageHash}`);
      
      return NextResponse.json({ imagePath: publicPath });
    } catch (fetchError) {
      console.error('Error fetching image:', fetchError);
      
      // Create an empty placeholder image as fallback
      const fallbackPath = `/image-cache/${imageHash}.jpg`;
      // Create a simple 1x1 transparent pixel
      const emptyImageBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      fs.writeFileSync(cachedImagePath, emptyImageBuffer);
      
      return NextResponse.json({ 
        imagePath: fallbackPath,
        error: 'Failed to fetch original image, using placeholder'
      });
    }
  } catch (error) {
    console.error('Error in image proxy:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}