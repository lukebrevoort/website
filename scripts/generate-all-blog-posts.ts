const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Get the page ID from command line arguments
const pageId = process.argv[2];

if (!pageId) {
  console.error('Error: No page ID provided');
  process.exit(1);
}

async function generateBlogPost() {
  console.log(`Generating blog post for page ID: ${pageId}`);
  
  // Initialize Notion client
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });
  
  // Create blog post directories if they don't exist
  const blogDir = path.join(process.cwd(), 'src', 'app', 'blog', 'posts');
  fs.mkdirSync(blogDir, { recursive: true });
  
  // Copy your blog generation logic from lib/blog-generator.ts
  // Make any necessary adjustments for the Node.js environment
  
  console.log('Blog post generated successfully!');
}

generateBlogPost().catch(error => {
  console.error('Error generating blog post:', error);
  process.exit(1);
});