import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// Specify runtime (optional but recommended)
export const runtime = 'nodejs'; // or 'nodejs' if you need Node.js features

// Maximum execution time
export const maxDuration = 60;

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Notion webhook received');
    
    // Clone and get body
    const requestClone = request.clone();
    const rawBody = await requestClone.text();
    
    try {
      // Try to parse JSON
      const body = JSON.parse(rawBody);
      
      // Handle URL verification 
      if (body.type === 'url_verification') {
        console.log('🔄 Responding to Notion URL verification challenge');
        return NextResponse.json({ challenge: body.challenge });
      }
      
      // Acknowledge receipt immediately
      console.log('Responding with acknowledgement...');
      
      // Trigger deploy hook
      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        console.log('🚀 Triggering Vercel deployment...');
        fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'notion-update' }),
        }).catch(err => console.error('Deploy hook error:', err));
      }
      
      // Return success immediately
      return NextResponse.json({ success: true });
      
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 200 });
  }
}

// Add OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Notion-Signature, Notion-Timestamp',
    },
  });
}