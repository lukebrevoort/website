import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { generateBlogPosts, commitAndPushChanges } from '@/lib/blog-generator';
import fs from 'fs';
import path from 'path';

// Maximum execution time: 60 seconds (Vercel limit for serverless functions)
export const maxDuration = 60;

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
    
    // Verify signature (optional in development, required in production)
    if (process.env.NODE_ENV === 'production' && process.env.NOTION_SIGNING_SECRET) {
      const hmac = crypto.createHmac('sha256', process.env.NOTION_SIGNING_SECRET);
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
      
      // Generate the specific post that was updated (but don't commit)
      const generateResult = await generateBlogPosts(pageId);
      
      if (generateResult.success) {
        // For production: Trigger a new deployment via Deploy Hook
        if (process.env.VERCEL_DEPLOY_HOOK_URL) {
          console.log('Triggering Vercel deployment...');
          
          try {
            const deployResponse = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ trigger: 'notion-update' }),
            });
            
            if (deployResponse.ok) {
              console.log('Vercel deployment triggered successfully');
              return NextResponse.json({ 
                success: true, 
                generated: generateResult.message,
                deployed: 'Deployment triggered'
              });
            } else {
              const deployError = await deployResponse.text();
              console.error('Error triggering deployment:', deployError);
              return NextResponse.json({ 
                success: false, 
                error: `Deployment failed: ${deployError}` 
              }, { status: 500 });
            }
          } catch (deployError) {
            console.error('Error triggering deployment:', deployError);
            return NextResponse.json({ 
              success: false, 
              error: `Deployment error: ${deployError}` 
            }, { status: 500 });
          }
        } 
        // For local development: Commit and push changes directly
        else if (process.env.NODE_ENV === 'development') {
          // Use the commitAndPushChanges function that was imported at the top
          const commitResult = await commitAndPushChanges();
          
          return NextResponse.json({ 
            success: true, 
            generated: generateResult.message,
            committed: commitResult.message
          });
        }
        // Fallback: Just return success
        else {
          return NextResponse.json({ 
            success: true, 
            generated: generateResult.message,
            note: 'No deployment triggered (missing deploy hook)'
          });
        }
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