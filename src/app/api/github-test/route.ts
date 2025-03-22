import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get repository information from environment variables
    const githubRepoOwner = process.env.GITHUB_REPO_OWNER || 'lbrevoort';
    const githubRepoName = process.env.GITHUB_REPO_NAME || 'personal-website';
    
    console.log('🧪 Testing GitHub authentication...');
    console.log(`Repository: ${githubRepoOwner}/${githubRepoName}`);
    console.log(`Token exists: ${!!process.env.GITHUB_PAT}`);
    console.log(`Token length: ${process.env.GITHUB_PAT?.length || 0} characters`);
    
    // First test: Simple repo information retrieval
    const response = await fetch(
      `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GitHub authentication successful!');
      
      // If first test passes, try the actual dispatch API
      const dispatchResponse = await fetch(
        `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'test_event',
            client_payload: { test: true }
          })
        }
      );
      
      const dispatchSuccess = dispatchResponse.status === 204; // 204 No Content is success for dispatches
      
      return NextResponse.json({ 
        success: true, 
        repoInfo: {
          name: data.name,
          owner: data.owner.login,
          visibility: data.visibility,
          defaultBranch: data.default_branch
        },
        dispatchTest: {
          success: dispatchSuccess,
          status: dispatchResponse.status
        }
      });
    } else {
      const errorText = await response.text();
      console.error(`❌ GitHub API error: ${response.status} - ${errorText}`);
      
      return NextResponse.json({ 
        success: false, 
        status: response.status,
        error: errorText,
        hint: response.status === 401 ? "Your token is invalid or expired" : 
              response.status === 404 ? "Repository not found - check owner and repo name" :
              "Check GitHub API documentation for this status code"
      });
    }
  } catch (error) {
    console.error('❌ Error testing GitHub authentication:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    });
  }
}