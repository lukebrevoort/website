import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Define interfaces
interface ImageResponse {
  imagePath: string;
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: Request): Promise<NextResponse<ImageResponse | ErrorResponse>> {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    const imageHash = url.searchParams.get('hash');

    if (!imageUrl || !imageHash) {
      return NextResponse.json({ 
        error: "Missing required parameters" 
      }, { status: 400 });
    }

    console.log("Processing image request:", {
      url: imageUrl.substring(0, 30) + "...",
      hash: imageHash
    });

    // Check if the blob already exists
    try {
      console.log(`Checking if blob already exists with hash: ${imageHash}`);
      // List all blobs (no prefix to ensure we find it anywhere)
      const { blobs } = await list();
      
      // Find the blob by looking for the hash in the URL
      const existingBlob = blobs.find(blob => 
        blob.url && blob.url.includes(imageHash)
      );
      
      if (existingBlob) {
        console.log(`Found existing image in Blob storage: ${existingBlob.url}`);
        return NextResponse.json({ imagePath: existingBlob.url });
      }
    } catch (error: unknown) {
      console.error("Error checking for existing blob:", error);
    }

    // Fetch the image and store it in blob storage
    console.log(`Fetching new image from: ${imageUrl.substring(0, 30)}...`);
    const imageResponse = await fetch(imageUrl, {
      headers: { Accept: "image/*" }
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    // Get image as buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Store in Vercel Blob Storage - use hash directly without path prefix
    const { url: blobUrl } = await put(`${imageHash}.jpg`, imageBuffer, {
      access: 'public',
      contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
    });

    console.log(`Blob storage debug info:
      - Original URL: ${imageUrl.substring(0, 30)}...
      - Hash: ${imageHash}
      - Blob Name: ${imageHash}.jpg (without path prefix)
      - Stored URL: ${blobUrl}
    `);
    
    console.log(`Successfully uploaded to blob storage: ${blobUrl}`);
    return NextResponse.json({ imagePath: blobUrl });
  } catch (error: unknown) {
    console.error("Error proxying image:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to process image"
    }, { status: 500 });
  }
}