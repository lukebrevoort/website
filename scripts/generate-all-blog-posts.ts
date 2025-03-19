import { generateBlogPosts, commitAndPushChanges } from '../src/lib/blog-generator';

async function run() {
  console.log('🚀 Starting blog generation...');
  
  const result = await generateBlogPosts();
  
  if (result.success) {
    console.log('✅ Blog posts generated successfully!');
    
    const commitResult = await commitAndPushChanges();
    
    if (commitResult.success) {
      console.log('✅ Changes committed and pushed to GitHub!');
    } else {
      console.error('❌ Failed to commit changes:', commitResult.error);
    }
  } else {
    console.error('❌ Failed to generate blog posts:', result.error);
    process.exit(1);
  }
}

run().catch(console.error);