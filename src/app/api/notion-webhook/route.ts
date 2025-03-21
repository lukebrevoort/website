import { NextResponse } from 'next/server';

// CRITICAL: Set this to the maximum allowed
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    console.log('🔔 Notion webhook received');
    
    // Clone and get body
    const requestClone = request.clone();
    const rawBody = await requestClone.text();
    
    try {
      // Try to parse JSON - this is the minimum needed to respond to URL verification
      const body = JSON.parse(rawBody);
      
      // Handle URL verification immediately - this is critical
      if (body.type === 'url_verification') {
        console.log('🔄 Responding to Notion URL verification challenge');
        return NextResponse.json({ challenge: body.challenge });
      }
      
      // Acknowledge receipt immediately
      console.log('Responding with acknowledgement...');
      
      // Instead of background processing, do minimal work then trigger deploy hook
      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        console.log('🚀 Triggering Vercel deployment directly...');
        fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'notion-update' }),
        }).catch(err => console.error('Deploy hook error (non-blocking):', err));
      }
      
      // Return success immediately without waiting for the deployment trigger
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