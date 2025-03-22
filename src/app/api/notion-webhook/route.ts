import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
// Remove static import and use dynamic import later

// For debugging
const DEBUG_MODE = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview';

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
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') {
      if (!notionSignature || !notionTimestamp) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing signature headers' 
        }, { status: 401 });
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
    
    // Handle Notion URL verification (needed when setting up webhooks)
    if (body.type === 'url_verification') {
      console.log('🔄 Responding to Notion URL verification challenge');
      return NextResponse.json({ challenge: body.challenge });
    }
    
    // Extract page ID from the body
    let pageId = extractPageId(body);
    
    if (!pageId) {
      console.error('📛 Could not find page ID in payload');
      return NextResponse.json({ 
        success: false, 
        message: 'Could not find page ID in payload'
      }, { status: 400 });
    }
    
    console.log(`📝 Processing update for page/database ${pageId}`);
    
    // Instead of generating blog posts directly, trigger a GitHub workflow
    const githubRepoOwner = process.env.GITHUB_REPO_OWNER || 'lbrevoort';
    const githubRepoName = process.env.GITHUB_REPO_NAME || 'personal-website';
    
    console.log(`🚀 Triggering GitHub workflow for ${githubRepoOwner}/${githubRepoName}...`);
    
    try {
      // Dynamically import Octokit
      const { Octokit } = await import('@octokit/rest');
      // Initialize Octokit with your PAT
      const octokit = new Octokit({
        auth: process.env.GITHUB_PAT
      });
      
      // Log token info for debugging
      console.log(`Token info: exists=${!!process.env.GITHUB_PAT}, length=${process.env.GITHUB_PAT?.length || 0}`);
      
      // Create repository dispatch event
      const response = await octokit.repos.createDispatchEvent({
        owner: githubRepoOwner,
        repo: githubRepoName,
        event_type: 'notion_update',
        client_payload: { 
          pageId,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('✅ GitHub workflow triggered successfully:', response.status);
      return NextResponse.json({ 
        success: true, 
        message: 'Notion webhook processed and GitHub workflow triggered',
        pageId,
        githubStatus: response.status
      });
    } catch (githubError) {
      console.error('📛 Error triggering GitHub workflow:', githubError);
      
      // Get detailed error information
      const errorMessage = githubError instanceof Error ? githubError.message : String(githubError);
      const errorStatus = (githubError as any).status || 500;
      
      console.error(`Error details:
        - Status: ${errorStatus}
        - Message: ${errorMessage}
        - Repository: ${githubRepoOwner}/${githubRepoName}
        - Token exists: ${!!process.env.GITHUB_PAT}
        - Token length: ${process.env.GITHUB_PAT?.length || 0}
      `);
      
      return NextResponse.json({ 
        success: false, 
        message: 'Error triggering GitHub workflow',
        error: errorMessage,
        status: errorStatus
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

// Helper function to extract page ID from various payload formats
// Define interfaces for different Notion webhook payload structures
interface NotionPagePayload {
  payload?: {
    page?: {
      id?: string;
    };
  };
  page?: {
    id?: string;
  };
  id?: string;
  data?: {
    page_id?: string;
    id?: string;
    page?: {
      id?: string;
    };
  };
  database_id?: string;
}

function extractPageId(body: NotionPagePayload): string | null {
  if (body.payload?.page?.id) return body.payload.page.id;
  if (body.page?.id) return body.page.id;
  if (body.id) return body.id;
  if (body.data?.page_id) return body.data.page_id;
  if (body.data?.id) return body.data.id;
  if (body.data?.page?.id) return body.data.page.id;
  if (body.database_id) return body.database_id;
  return null;
}

export async function GET() {
  return NextResponse.json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'unknown'
  });
}