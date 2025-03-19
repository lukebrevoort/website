import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { generateBlogPosts, commitAndPushChanges } from '@/lib/blog-generator';

export async function POST(request: Request) {
  try {
    // Get the raw request body for signature verification
    const requestClone = request.clone();
    const rawBody = await requestClone.text();
    
    // Verify this is a valid request from Notion
    const notionSecret = request.headers.get('Notion-Signature');
    const notionTimestamp = request.headers.get('Notion-Timestamp');

    if (!notionSecret || !notionTimestamp) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify signature
    const signingSecret = process.env.NOTION_TOKEN;
    if (signingSecret) {
      const hmac = crypto.createHmac('sha256', signingSecret);
      const signature = hmac
        .update(`${notionTimestamp}:${rawBody}`)
        .digest('hex');

      if (signature !== notionSecret) {
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
      }
    }
    
    // Parse the body
    const body = JSON.parse(rawBody);
    
    // Handle the webhook payload
    if (body.type === 'page.update' || body.type === 'page.create') {
      const pageId = body.payload.page.id;
      console.log(`Received update for page ${pageId}`);
      
      // Generate the specific post that was updated
      const generateResult = await generateBlogPosts(pageId);
      
      if (generateResult.success) {
        // Commit and push the changes
        const commitResult = await commitAndPushChanges();
        
        return NextResponse.json({ 
          success: true, 
          generated: generateResult.message,
          committed: commitResult.message
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: generateResult.error 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, message: 'No action required' });
  } catch (error) {
    console.error('Error processing Notion webhook:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}