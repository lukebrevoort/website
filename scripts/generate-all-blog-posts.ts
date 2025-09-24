import { generateBlogPosts } from '../src/lib/blog-generator';

async function main() {
  try {
    console.log('Running complete blog generation...');
    
    const result = await generateBlogPosts();
    
    console.log('Blog generation result:', JSON.stringify(result, null, 2));
    
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