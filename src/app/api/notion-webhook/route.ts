import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { generateBlogPosts, commitAndPushChanges } from '@/lib/blog-generator';

// For debugging
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

// Maximum execution time
export const maxDuration = 60;

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
    
    // Log raw body for debugging
    if (DEBUG_MODE) {
      console.log('Raw body:', rawBody.length > 500 ? rawBody.substring(0, 500) + '...' : rawBody);
    }
    
    // Check for Notion's signature headers (with fallbacks for different header formats)
    const notionSignature = request.headers.get('notion_signing_secret') || 
                           request.headers.get('x-notion-signature') ||
                           request.headers.get('notion-signature');
    const notionTimestamp = request.headers.get('x-notion-timestamp') ||
                           request.headers.get('notion-timestamp');
    
    console.log('Signature check:', { 
      hasSignature: !!notionSignature, 
      hasTimestamp: !!notionTimestamp 
    });
    
    // Only enforce signature in production
    if (process.env.NODE_ENV === 'production') {
      if (!notionSignature || !notionTimestamp) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing signature headers' 
        }, { status: 401 });
      }
      
      // Verify signature if we have the secret
      if (process.env.NOTION_SIGNING_SECRET) {
        const hmac = crypto.createHmac('sha256', process.env.NOTION_SIGNING_SECRET);
        const signature = hmac
          .update(`${notionTimestamp}:${rawBody}`)
          .digest('hex');
        
        if (signature !== notionSignature) {
          console.error('⚠️ Signature verification failed');
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid signature' 
          }, { status: 401 });
        }
        
        console.log('✓ Signature verified');
      }
    }
    
    // Parse the body
    console.log('Parsing body...');
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
    
    // Log the parsed body for debugging
    if (DEBUG_MODE) {
      console.log('Parsed body:', body);
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
    }

    if (!pageId && body.data?.page_id) {
      pageId = body.data.page_id;
    } else if (!pageId && body.data?.id) {
      pageId = body.data.id;
    } else if (!pageId && body.data?.page?.id) {
      pageId = body.data.page.id;
    }
    
    // If we still don't have a page ID, check for database ID
    if (!pageId && body.database_id) {
      console.log('Using database ID instead of page ID');
      pageId = body.database_id;
    }

    if (DEBUG_MODE && !pageId) {
      console.log('Debug - Payload structure:', JSON.stringify(body, null, 2));
    }
    
    // If we can't find a page ID, we can't proceed
    if (!pageId) {
      console.error('📛 Could not find page ID in payload');
      return NextResponse.json({ 
        success: false, 
        message: 'Could not find page ID in payload',
        payloadReceived: DEBUG_MODE ? body : 'REDACTED'
      }, { status: 400 });
    }
    
    console.log(`📝 Processing update for page/database ${pageId}`);
    
    // Generate blog post - now this happens for ANY webhook (not just page.update/create)
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
            return NextResponse.json({ 
              success: true, 
              generated: generateResult.message,
              deployed: 'Deployment triggered'
            });
          } else {
            const deployError = await deployResponse.text();
            console.error('📛 Error triggering deployment:', deployError);
            return NextResponse.json({ 
              success: false, 
              error: `Deployment failed: ${deployError}` 
            }, { status: 500 });
          }
        } catch (deployError) {
          console.error('📛 Error triggering deployment:', deployError);
          return NextResponse.json({ 
            success: false, 
            error: `Deployment error: ${deployError}` 
          }, { status: 500 });
        }
      } 
      // Development mode: Commit and push
      else if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Committing changes in development mode');
        const commitResult = await commitAndPushChanges();
        
        return NextResponse.json({ 
          success: true, 
          generated: generateResult.message,
          committed: commitResult.message
        });
      }
      // No deploy hook configured
      else {
        console.log('⚠️ No deployment method configured');
        return NextResponse.json({ 
          success: true, 
          generated: generateResult.message,
          note: 'No deployment triggered (missing deploy hook)'
        });
      }
    } else {
      console.error('📛 Failed to generate blog post:', generateResult.error);
      return NextResponse.json({ 
        success: false, 
        error: generateResult.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('📛 Unhandled error processing webhook:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}