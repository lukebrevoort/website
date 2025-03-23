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

    const blobName = `blog-images/${imageHash}.jpg`;

    console.log("Processing image request:", {
      url: imageUrl.substring(0, 30) + "...",
      hash: imageHash,
      blobName: blobName
    });

    // Check if the blob already exists
    try {
      console.log(`Checking if blob already exists: ${blobName}`);
      const { blobs } = await list({ prefix: blobName });
      
      if (blobs.length > 0) {
        console.log(`Found existing image in Blob storage: ${blobs[0].url}`);
        // FIX: Return the actual URL, not a string literal
        return NextResponse.json({ imagePath: blobs[0].url });
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
    
    // Store in Vercel Blob Storage
    const { url: blobUrl } = await put(blobName, imageBuffer, {
      access: 'public',
      contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
    });
    
    console.log(`Successfully uploaded to blob storage: ${blobUrl}`);
    return NextResponse.json({ imagePath: blobUrl });
  } catch (error: unknown) {
    console.error("Error proxying image:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to process image"
    }, { status: 500 });
  }
}