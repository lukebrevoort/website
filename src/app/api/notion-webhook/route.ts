import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { generateBlogPosts } from '@/lib/blog-generator';

// For debugging
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

export async function POST(request: Request) {
  try {
    console.log('🔔 Notion webhook received');
    
    // Get all headers for debugging
    if (DEBUG_MODE) {
      const headerEntries = [...request.headers.entries()];
      console.log('Headers:', headerEntries.map(([key, value]) => 
        key.includes('signature') ? `${key}: ${value.substring(0, 10)}...` : `${key}: ${value}`
      ));
    }
    
    // Get the raw request body
    const requestClone = request.clone();
    const rawBody = await requestClone.text();
    
    // Parse body
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('📛 Failed to parse JSON body:', parseError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid JSON body' 
      }, { status: 400 });
    }
    
    // Handle Notion URL verification (needed when setting up webhooks)
    if (body.type === 'url_verification') {
      console.log('🔄 Responding to Notion URL verification challenge');
      return NextResponse.json({ challenge: body.challenge });
    }
    
    // Extract page ID from the body, with multiple fallback paths
    let pageId = null;
    
    // Try various possible payload structures
    if (body.payload?.page?.id) {
      pageId = body.payload.page.id;
    } else if (body.page?.id) {
      pageId = body.page.id;
    } else if (body.id) {
      pageId = body.id;
    } else if (body.data?.page_id) {
      pageId = body.data.page_id;
    } else if (body.data?.id) {
      pageId = body.data.id;
    } else if (body.data?.page?.id) {
      pageId = body.data.page.id;
    } else if (body.database_id) {
      pageId = body.database_id;
    }
    
    if (!pageId) {
      console.error('📛 Could not find page ID in payload');
      return NextResponse.json({ 
        success: false, 
        message: 'Could not find page ID in payload'
      }, { status: 400 });
    }
    
    // IMPORTANT: Respond to Notion immediately
    // before doing any time-consuming processing
    const response = NextResponse.json({ 
      success: true, 
      message: `Received update for page ${pageId}`,
      status: 'Processing started'
    });
    
    // Start processing in the background without awaiting the result
    // This ensures we respond to Notion quickly
    processWebhook(pageId).catch(error => {
      console.error('Background processing error:', error);
    });
    
    console.log(`Responded to webhook - processing continues in background`);
    return response;
    
  } catch (error) {
    console.error('📛 Unhandled error processing webhook:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// This function runs after we've already responded to Notion
async function processWebhook(pageId: string) {
  try {
    console.log(`📝 Background processing started for page ${pageId}`);
    
    // Generate blog post
    console.log('Generating blog post...');
    const generateResult = await generateBlogPosts(pageId);
    
    if (generateResult.success) {
      console.log('✅ Blog post generated successfully');
      
      // Production mode: Trigger Vercel deployment
      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        console.log('🚀 Triggering Vercel deployment...');
        
        try {
          const deployResponse = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trigger: 'notion-update' }),
          });
          
          if (deployResponse.ok) {
            console.log('✅ Vercel deployment triggered successfully');
          } else {
            const deployError = await deployResponse.text();
            console.error('📛 Error triggering deployment:', deployError);
          }
        } catch (deployError) {
          console.error('📛 Error triggering deployment:', deployError);
        }
      } 
      // Development mode: Commit and push
      else if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Committing changes in development mode');
        // Either import from the correct module or implement the functionality here
        console.log('⚠️ commitAndPushChanges functionality needs to be implemented');
        // TODO: Implement version control functionality
      }
      // No deploy hook configured
      else {
        console.log('⚠️ No deployment method configured');
      }
    } else {
      console.error('📛 Failed to generate blog post:', generateResult.error);
    }
  } catch (error) {
    console.error('Background processing error:', error);
  }
}