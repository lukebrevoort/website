import { getBlogPost, getBlogPosts } from '@/lib/notion';
import { lukesFont, crimsonText } from '@/app/fonts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });

export const revalidate = 3600; // Revalidate every hour at most

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const { page } = await getBlogPost(slug);
    const title = (page as any).properties?.Title?.title[0]?.plain_text || 'Blog Post';
    const description = (page as any).properties?.Description?.rich_text[0]?.plain_text || '';
    
    return { title, description };
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'A blog post on the website',
    };
  }
}

export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post: any) => ({
      slug: post.id,
    }));
}

export default async function Page({ params }: { params: Params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const { page, markdown } = await getBlogPost(slug);
    
    const title = (page as any).properties?.Title?.title[0]?.plain_text || 'Untitled';
    const date = (page as any).properties?.Date?.date?.start 
      ? new Date((page as any).properties.Date.date.start).toLocaleDateString() 
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