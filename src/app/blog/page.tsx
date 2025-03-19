import { getBlogPosts } from '@/lib/notion';
import Link from 'next/link';
import { lukesFont, crimsonText } from '@/app/fonts';

export const revalidate = 3600; // Revalidate at most every hour

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className={`${lukesFont.className} text-4xl font-bold mb-10`}>Blog</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => {
          const properties = post.properties;
          const title = properties.Title?.title[0]?.plain_text || 'Untitled';
          const description = properties.Description?.rich_text[0]?.plain_text || '';
          const date = properties.Date?.date?.start 
            ? new Date(properties.Date.date.start).toLocaleDateString() 
            : '';
          
          return (
            <Link 
              href={`/blog/${post.id}`} 
              key={post.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <article>
                <h2 className={`${crimsonText.className} text-2xl font-semibold mb-2`}>{title}</h2>
                {date && <time className="text-sm text-gray-500">{date}</time>}
                {description && <p className="mt-3 text-gray-700 dark:text-gray-300">{description}</p>}
              </article>
            </Link>
          );
        })}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No blog posts found.</p>
        </div>
      )}
    </div>
  );
}