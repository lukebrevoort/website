import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');
    const imageHash = request.nextUrl.searchParams.get('hash');
    
    if (!imageUrl || !imageHash) {
      console.error('Missing required parameters:', { imageUrl, imageHash });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    const blobName = `blob-images/${imageHash}.jpg`;
    console.log('Processing image request:', {
      url: imageUrl.substring(0, 30) + '...',
      hash: imageHash,
      blobName
    });
    
    // Check if the blob already exists
    try {
      console.log(`Checking if blob already exists: ${blobName}`);
      const { blobs } = await list({ prefix: blobName });
      
      // If we found the image in blob storage, return its URL
      if (blobs.length > 0) {
        console.log(`Found existing image in Blob storage: ${blobs[0].url}`);
        return NextResponse.json({ imagePath: blobs[0].url });
      }
    } catch (error) {
      console.error('Error checking for existing blob:', error);
    }
    
    console.log(`Fetching new image from: ${imageUrl.substring(0, 30)}...`);
    
    // Strip credential parameters from the URL if they exist
    const cleanUrl = imageUrl.replace(/([?&](?:Credential|X-Amz-Credential|AWSAccessKeyId|Security-Token|X-Amz-Security-Token|X-Amz-Date|X-Amz-Signature)=[^&]+)/g, '');
    
    try {
      // Fetch the image with appropriate headers for AWS authentication
      const imageResponse = await fetch(cleanUrl, {
        headers: {
          'Accept': 'image/*',
        },
      });
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      }
      
      // Get image blob
      const imageBlob = await imageResponse.blob();
      
      // Upload to Vercel Blob storage
      const { url } = await put(blobName, imageBlob, {
        access: 'public',
        contentType: imageBlob.type || 'image/jpeg',
      });
      
      console.log(`Uploaded image to Blob storage: ${url}`);
      
      return NextResponse.json({ imagePath: url });
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json(
        { error: 'Failed to process image', imagePath: '/placeholders/default.jpg' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in image-proxy:', error);
    return NextResponse.json(
      { error: 'Server error', imagePath: '/placeholders/default.jpg' },
      { status: 500 }
    );
  }
}