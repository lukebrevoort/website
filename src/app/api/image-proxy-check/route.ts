import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hash = url.searchParams.get('hash');

    if (!hash) {
      return NextResponse.json({ 
        error: "Missing hash parameter" 
      }, { status: 400 });
    }

    console.log(`Checking if image exists in blob storage with hash: ${hash}`);
    
    // List all blobs
    const { blobs } = await list();
    
    // Find the blob by looking for the hash in the URL
    const blob = blobs.find(b => b.url.includes(hash));
    
    if (blob) {
      console.log(`Found image in blob storage: ${blob.url}`);
      return NextResponse.json({ imagePath: blob.url });
    }
    
    console.log(`Image not found in blob storage with hash: ${hash}`);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error) {
    console.error("Error checking for image:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to check image"
    }, { status: 500 });
  }
}