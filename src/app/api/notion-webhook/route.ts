import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import * as crypto from 'crypto';

// Update your verification logic
const notionSecret = request.headers.get('Notion-Signature');
const notionTimestamp = request.headers.get('Notion-Timestamp');

if (!notionSecret || !notionTimestamp) {
  return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
}

// Get the raw request body for signature verification
const rawBody = await request.text();
const requestBody = JSON.parse(rawBody);

// Verify signature
const signingSecret = process.env.NOTION_WEBHOOK_SECRET; // Add this to your .env file
const hmac = crypto.createHmac('sha256', signingSecret);
const signature = hmac
  .update(`${notionTimestamp}:${rawBody}`)
  .digest('hex');

if (signature !== notionSecret) {
  return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verify this is a valid request from Notion
    const notionSecret = request.headers.get('Notion-Signature');
    
    if (!notionSecret) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Handle the webhook payload
    if (body.type === 'page.update' || body.type === 'page.create') {
      // Revalidate the blog pages
      revalidatePath('/blog');
      revalidatePath(`/blog/${body.payload.page.id}`);
      
      return NextResponse.json({ success: true, revalidated: true });
    }
    
    return NextResponse.json({ success: true, message: 'No action required' });
  } catch (error) {
    console.error('Error processing Notion webhook:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}