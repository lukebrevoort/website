import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

// Special debug endpoint for request inspection
const DEBUG = process.env.NODE_ENV !== 'production';
const DEBUG_URL = DEBUG ? "https://webhook.site/41fd0193-a1b2-473a-b920-d51dbaf83006" : null; // Optional: Get this from webhook.site

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Notion webhook received');
    
    // Get request details for debugging
    const url = request.url;
    const method = request.method;
    const headers = Object.fromEntries([...request.headers.entries()]);
    console.log('Request details:', { url, method });
    
    // Clone and get body
    const requestClone = request.clone();
    const rawBody = await requestClone.text();
    
    // Optional: Send to debug service (like webhook.site)
    if (DEBUG_URL) {
      fetch(DEBUG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, headers, body: rawBody })
      }).catch(() => {});
    }
    
    try {
      // Try to parse JSON
      const body = JSON.parse(rawBody);
      console.log('Webhook body type:', body.type);
      
      // CRITICAL: Handle URL verification exactly as Notion expects
      if (body.type === 'url_verification') {
        console.log('🔄 Responding to Notion URL verification challenge:', body.challenge);
        
        // The exact response format Notion expects - must be exact
        return new Response(JSON.stringify({ challenge: body.challenge }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // For all other webhooks, trigger deployment
      console.log('Processing webhook...');
      
      // Trigger deploy hook without waiting
      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        console.log('🚀 Triggering Vercel deployment...');
        fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'notion-update' }),
        }).catch(err => console.error('Deploy hook error:', err));
      }
      
      // Return simple success response
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 200, // Still return 200 to prevent Notion from disabling the webhook
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// CORS handler
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

// Debug endpoint
export async function GET(request: NextRequest) {
  console.log('Debug GET endpoint hit');
  return NextResponse.json({ 
    status: 'online',
    message: 'Webhook endpoint is active',
    time: new Date().toISOString()
  });
}