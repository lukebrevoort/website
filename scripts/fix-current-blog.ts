import { generateBlogPosts } from '../src/lib/blog-generator';

// This script regenerates the current/latest blog post for fixing issues
async function main() {
  try {
    console.log('Running blog fix for current post...');
    
    // Generate all posts but focus on the most recent one
    const result = await generateBlogPosts();
    
    console.log('Blog fix result:', JSON.stringify(result, null, 2));
    
    if (!result.success) {
      console.error('Blog fix failed:', result.error);
      process.exit(1);
    } else {
      console.log('Blog fix succeeded!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();