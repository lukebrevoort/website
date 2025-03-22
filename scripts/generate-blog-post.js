const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pageId = process.argv[2];

if (!pageId) {
  console.error('Error: No page ID provided');
  process.exit(1);
}

// Show environment variables for debugging (masking sensitive values)
console.log('Environment variables check:');
console.log('- NOTION_TOKEN: ' + (process.env.NOTION_TOKEN ? 'Set (value hidden)' : 'Not set ❌'));
console.log('- NOTION_DATABASE_ID: ' + (process.env.NOTION_DATABASE_ID ? 'Set (value hidden)' : 'Not set ❌'));

async function runTypescriptGenerator() {
  try {
    // Run the TypeScript generator with the specific post ID
    console.log(`Running TypeScript blog generator for post ID: ${pageId}`);
    
    // We need to use ts-node to execute the TypeScript file
    // Install it if not already installed
    try {
      execSync('which ts-node', { stdio: 'ignore' });
    } catch (error) {
      console.log('Installing ts-node...');
      execSync('npm install -g ts-node');
    }
    
    // Execute the TypeScript generator with the specific post ID
    // Important: Pass the environment variables to the child process
    const command = `ts-node -e "import { generateBlogPosts } from './src/lib/blog-generator'; generateBlogPosts('${pageId}').then(result => console.log(JSON.stringify(result)))"`;
    
    const output = execSync(command, { 
      env: { 
        ...process.env,
        NOTION_TOKEN: process.env.NOTION_TOKEN,
        NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID
      },
      encoding: 'utf-8' 
    });
    
    console.log('Blog post generated successfully!');
    console.log(output);
    
    return JSON.parse(output);
  } catch (error) {
    console.error('Error generating blog post:', error);
    process.exit(1);
  }
}

runTypescriptGenerator();