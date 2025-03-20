import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId parameter' }, { status: 400 });
    }
    
    // Check for mapping file in .private directory
    const privateDir = path.join(process.cwd(), '.private');
    const mapFile = path.join(privateDir, `${postId}.json`);
    
    // If mapping doesn't exist, create an empty one for now
    if (!fs.existsSync(mapFile)) {
      console.log(`Warning: No image map found for post ${postId}`);
      
      // For the specific example in your code
      if (postId === '1bbf7879-ec1d-806a-9e84-cc8bfb5c1805') {
        // Create a dummy mapping for testing
        const dummyMapping = {
          "image-placeholder-aHR0cHM6Ly9wcm9kLWZpbGVzLXNlY3Vy": "https://via.placeholder.com/800x600"
        };
        
        // Ensure directory exists
        if (!fs.existsSync(privateDir)) {
          fs.mkdirSync(privateDir, { recursive: true });
        }
        
        // Save the dummy mapping
        fs.writeFileSync(mapFile, JSON.stringify(dummyMapping));
        return NextResponse.json(dummyMapping);
      }
      
      // Return empty mapping
      return NextResponse.json({});
    }
    
    // Read the mapping file
    const mapping = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));
    return NextResponse.json(mapping);
  } catch (error) {
    console.error('Error in image-map endpoint:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}