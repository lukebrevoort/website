import { generateBlogPosts } from '../src/lib/blog-generator';

const pageId = process.argv[2];

if (!pageId) {
  console.error('Error: No page ID provided');
  process.exit(1);
}

// Show environment variables for debugging (masking sensitive values)
console.log('Environment variables check:');
console.log('- NOTION_TOKEN: ' + (process.env.NOTION_TOKEN ? 'Set (value hidden)' : 'Not set ❌'));
console.log('- NOTION_DATABASE_ID: ' + (process.env.NOTION_DATABASE_ID ? 'Set (value hidden)' : 'Not set ❌'));
console.log('- BLOB_READ_WRITE_TOKEN: ' + (process.env.BLOB_READ_WRITE_TOKEN ? 'Set (value hidden)' : 'Not set ❌'));

async function main() {
  try {
    console.log(`Running TypeScript blog generator for post ID: ${pageId}`);
    
    const result = await generateBlogPosts(pageId);
    
    console.log('Blog post generation result:', JSON.stringify(result, null, 2));
    
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
}

main();