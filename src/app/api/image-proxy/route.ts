import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Define interfaces
interface ImageResponse {
  imagePath: string;
}

interface ErrorResponse {
  error: string;
}

// In image-proxy/route.ts
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    const imageHash = url.searchParams.get('hash'); // keep for backward compatibility

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Extract original filename from the URL
    const originalFilename = extractFilename(imageUrl);
    const safeFilename = sanitizeFilename(originalFilename || 'image.jpg');
    
    console.log(`Processing image: ${safeFilename} from ${imageUrl.substring(0, 30)}...`);

    // Check if blob exists with this name
    const { blobs } = await list();
    const existingBlob = blobs.find(blob => 
      blob.url?.includes(safeFilename)
    );
    
    if (existingBlob) {
      return NextResponse.json({ imagePath: existingBlob.url });
    }

    // Fetch and store with original filename
    const imageResponse = await fetch(imageUrl, { headers: { Accept: "image/*" } });
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const { url: blobUrl } = await put(safeFilename, imageBuffer, {
      access: 'public',
      contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
    });
    
    console.log(`Uploaded image with filename: ${safeFilename}`);
    return NextResponse.json({ imagePath: blobUrl });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to process image"
    }, { status: 500 });
  }
}

// Helper functions
function extractFilename(url: string): string | null {
  try {
    // Extract last path segment from URL
    const urlPath = new URL(url).pathname;
    const parts = urlPath.split('/');
    let filename = parts[parts.length - 1];
    
    // Remove any query parameters
    filename = filename.split('?')[0];
    
    return filename || null;
  } catch {
    return null;
  }
}

function sanitizeFilename(filename: string): string {
  // Remove special characters, spaces, etc.
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100); // Limit length
}