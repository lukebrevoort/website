import { getBlogPost, getBlogPosts } from '@/lib/notion';
import { lukesFont, crimsonText } from '@/app/fonts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

export const revalidate = 3600; // Revalidate every hour at most

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Ensure params is awaited
  const slug = await params.slug;
  
  try {
    const { page } = await getBlogPost(slug);
    const title = page.properties.Title.title[0]?.plain_text || 'Blog Post';
    const description = page.properties.Description?.rich_text[0]?.plain_text || '';
    
    return {
      title,
      description,
    };
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'A blog post on the website',
    };
  }
}

// Generate static paths for all published blog posts
export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post: any) => ({
      slug: post.id,
    }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    // Ensure params is awaited
    const slug = await params.slug;
    
    const { page, markdown } = await getBlogPost(slug);
    
    const title = page.properties.Title.title[0]?.plain_text || 'Untitled';
    const date = page.properties.Date?.date?.start 
      ? new Date(page.properties.Date.date.start).toLocaleDateString() 
      : '';
      
    return (
      <article className="container mx-auto py-10 px-4 max-w-3xl">
        <header className="mb-10">
          <h1 className={`${lukesFont.className} text-4xl font-bold mb-3`}>{title}</h1>
          {date && <time className="text-gray-500">{date}</time>}
        </header>
        
        <div className={`prose dark:prose-invert max-w-none ${crimsonText.className}`}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}