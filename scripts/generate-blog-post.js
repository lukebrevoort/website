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
    const command = `ts-node -e "import { generateBlogPosts } from './src/lib/blog-generator'; generateBlogPosts('${pageId}').then(result => console.log(JSON.stringify(result, null, 2))).catch(err => console.log(JSON.stringify({success: false, error: err.message})))"`;
    
    const output = execSync(command, { 
      env: { 
        ...process.env,
        NOTION_TOKEN: process.env.NOTION_TOKEN,
        NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID
      },
      encoding: 'utf-8' 
    });
    
    console.log('Blog post generation complete');
    
    // Add safer JSON parsing
    try {
      // Log some debug info about the output
      console.log(`Output length: ${output.length} bytes`);
      
      // Find the last JSON object in the output (most likely to be our result)
      const lastJsonStart = output.lastIndexOf('{');
      const lastJsonEnd = output.lastIndexOf('}') + 1;
      
      if (lastJsonStart >= 0 && lastJsonEnd > lastJsonStart) {
        const jsonStr = output.substring(lastJsonStart, lastJsonEnd);
        try {
          const result = JSON.parse(jsonStr);
          console.log('Successfully parsed result:', result.success ? 'SUCCESS' : 'FAILED');
          return result;
        } catch (innerParseError) {
          console.error('Error parsing extracted JSON:', innerParseError);
          // Fall through to alternative method
        }
      }
      
      // Fallback to regex method if direct extraction fails
      const trimmedOutput = output.trim();
      const jsonRegex = /\{[\s\S]*\}/;
      const jsonMatch = trimmedOutput.match(jsonRegex);
      
      if (!jsonMatch) {
        console.error('Could not find valid JSON in output');
        console.error('Raw output first 200 chars:', trimmedOutput.substring(0, 200));
        console.error('Raw output last 200 chars:', trimmedOutput.substring(trimmedOutput.length - 200));
        return { success: false, error: 'No JSON found in generator output' };
      }
      
      // Parse the extracted JSON
      const result = JSON.parse(jsonMatch[0]);
      
      // Log for debugging
      console.log('Successfully parsed result with regex:', result.success ? 'SUCCESS' : 'FAILED');
      
      return result;
    } catch (parseError) {
      console.error('Error parsing output:', parseError);
      console.error('Raw output excerpt:', output.substring(output.length - 300));
      return { success: false, error: 'Failed to parse generator output' };
    }
  } catch (error) {
    console.error('Error executing TypeScript generator:', error);
    return { success: false, error: error.message || String(error) };
  }
}

// Main execution - handle errors at the top level
(async function main() {
  try {
    const result = await runTypescriptGenerator();
    if (!result.success) {
      console.error('Blog generation failed:', result.error);
      process.exit(1);
    } else {
      console.log('Blog generation succeeded!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();