"use client"

import { lukesFont, crimsonText } from '@/app/fonts';
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { MotionConfig } from "framer-motion";
import dynamic from 'next/dynamic';
import SecureImage from "@/components/secure-image";
import { useState, useEffect } from "react";

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });

export default function BlogPost() {
  // Store processed markdown in state
  const [content, setContent] = useState(`# Introduction 🤔


Hello! My name is Luke Brevoort, I’m a freshman at Stevens and this is my first ever blog post! 🎉

I’ve always toyed with the idea of just writing down what I’m building and generally my thoughts. Maybe posting it somewhere to vent and put some abstract ideas down on paper. Finally I have decided to fully commit to writing a blog and just sorta getting down some of what I’m interested in or currently working on.

So lets talk about what this even is and how it came to be!

# The Idea


After having a conversation with Jordan Scales (A super cool previous Stevens Student I connected with), his biggest takeaway and advice for me was to just start writing. Wether it was projects or just something I thought was remotely interesting or cool! Since that conversation I’ve been thinking of how I would approach putting up a blog. Two main ideas came to mind 

1. Using some external tool, such as Notion, and directing my website to the front Blog page
    1. Pros: Notion has build in tools that make putting together a page unbelievably smooth
    2. Cons: The main downside is that I don’t really build anything and its not really attached to my website, more of an offshoot

1. Completely writing it on my website and building each post individually, or using some generic React Component I build
    1. Pros: The flexibility to do whatever I want and truly get the experience of fleshing the idea out
    2. Cons: Much more difficult to put together a new page every single time I wanted to make an addition to the blog, super time consuming

# The Solution 💡


What if I leveraged the best of both worlds and connected Notions build in page writing directly into my website! This solution would give me all of the upside of building out some software and ease or writing, while avoiding the blog not really being on my website!

![Image](https://REDACTED.amazonaws.com/REDACTED)


The workflow essentially leverages the **Notion Webhooks** to communicate with my website whenever I decide to post a new blog in my database. Then my personal website will extract the key content and convert it into **Markdown** which is then converted into **React (**JSX**). **

After this, we build a file using Notions UUID as the name and address. This blogs is **1bef7879ec1d80da81dbe80ce7ae93e3! **When this file is done generating we execute a **Github Action** which will automatically push the new file and its changes to my Github Repo! Whenever this happens, Vercel (Which is what my website is deployed on) which re-deploy and show the newest update to the blog!!!

While this may seem quite easy, I ran into a lot of difficulties and unexpected challenges along the way!

# The Challenges 🙅‍♂️


## Images 🌠


The first major hurdle I had to overcome was trying to process Images. 

Markdown couldn’t handle images on its own so, I had to take it into my own hands. My first idea was just to scan the markdown and detect images my Notions **[Image] **tag in front. While this worked I unexpectedly got an email informing me I had leaked an **AWS Temp Key.**

![Image](https://REDACTED.amazonaws.com/REDACTED)


The slight oversight in this strategy was that by just using markdown and parsing, I was exposing the 1 Hour AWS Temp Key notion gives to download the image. This was problematic as I had to find some workaround to download the image and never show the Temp Key. 

The fix I (and my best friend Claude) came up with was to map each image to some random placeholder String which would correspond to its position. So that when the image was called, we would know the exact name of the image and where it would be stored. Here is how they were handled:


\`\`\`javascript
    if (src.includes('amazonaws.com') || src.includes('prod-files-secure.s3')) {
      console.log('Detected S3 URL, proxying:', src.substring(0, 30) + '...');
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      // Just a lot to say that if you find some AWS, turn it into a Hash
\`\`\`


If you look at the website repo, a large portion of the merge was dedicated to dealing with pesky images like that

## Pre-Production and Production 🤖


I knew this part of the project was going to be a pain, but simply the amount of trial and error this section took was unbelievable. While the local development server worked fantastic, leveraging Ngrok to direct the Webhooks to my local server, it all had to get moved up to pre-production which was full of its own issues.

First, where the images were stored. My original idea was to simply have some folder called image-cache to store all the images I use. But unfortunately, this would greatly expand my repo as I plan to add a lot of images to this blog. So instead, I had to work to move my entire storage system over to **blob storage**, a form of storage in beta at Vercel. 

\`\`\`javascript
    
    // Define blob name/path (will be used in URL)
    const blobName = \`blog-images/${'somehash'}.jpg\`;
    
    // Check if the blob already exists - list blob with a prefix
    const { blobs } = await list({ prefix: blobName });
    
    // If we found the image in blob storage, return its URL
    if (blobs.length > 0) {
      return NextResponse.json({ imagePath: 'blobs[0].url' });
    }
\`\`\`


Next was trying to get past why my Web hook wouldn’t correctly send requests to my pre-production server. This issue, embarrassingly enough, took me over 2 hours of fiddling and trying new things to stumble upon in some hidden forums that Vercel pre-production automations need a protection-bypass key to even send anything. 

### Protection Bypass for Automation


Enable access for automation services to protected deployments on this project. The secret is available as a System Environment Variable in all deployments after the value is created. You can bypass Deployment Protection by setting an HTTP header or query parameter with the secret provided below named \`x-vercel-protection-bypass\`.

Lastly, the production timeline also took a lot of trial and error, attempting to wrap my head around why now in pre-production could I get this working and not in production. The main culprit was something that had snuck by me for almost the entire project: **A Timestamp Check**. Initially, working with Claude on the early Webhook design led to this parameter being passed as just a good piece of information to hold onto. 

Maybe we want to eventually check when the last blog post was or something along those lines. This was the sole reason why my production runs failed as many times as they did. But if I’ve learned one thing its that banging your head into a wall may just give you enough delusion to solve the problem. 

# Conclusion


After getting into production everything has been moving smoothly! Hopefully at least when this makes its way onto the website! But if you enjoyed reading at all or have any questions my email is always open 😉 

### Contact:


Email: luke@brevoort.com
`);
  const [imageMap, setImageMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Process image URLs at runtime
  useEffect(() => {
    console.log('BlogPost mounted, fetching image map...');
    
    // First check if we still have REDACTED URLs that need to be fixed
    const hasRedactedImages = content.includes('REDACTED.amazonaws.com');
    
    if (hasRedactedImages) {
      console.log('Found REDACTED URLs in content, will attempt to replace them');
    }
    
    // Load image map (placeholders -> URLs) from external API
    fetch(`/api/image-map?postId=1bef7879-ec1d-80da-81db-e80ce7ae93e3`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch image map: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(fetchedMap => {
        console.log('Loaded image map with', Object.keys(fetchedMap).length, 'images');
        setImageMap(fetchedMap);
        
        // If we have REDACTED URLs and we got an image map
        if (hasRedactedImages && Object.keys(fetchedMap).length > 0) {
          console.log('Replacing REDACTED URLs with image placeholders');
          
          // Create a new version of the content with REDACTED URLs replaced
          let updatedContent = content;
          
          // Replace all REDACTED URLs with the first available placeholder
          // In a more sophisticated version, we'd match images to placeholders intelligently
          const allPlaceholders = Object.keys(fetchedMap);
          
          if (allPlaceholders.length > 0) {
            // Replace each instance of a REDACTED URL with a sequential placeholder
            let placeholderIndex = 0;
            
            updatedContent = updatedContent.replace(
              /!\[([^\]]*)\]\(https:\/\/REDACTED\.amazonaws\.com\/REDACTED\)/g,
              (match, altText) => {
                const placeholder = allPlaceholders[placeholderIndex % allPlaceholders.length];
                placeholderIndex++;
                console.log(`Replaced REDACTED URL with placeholder: ${placeholder.substring(0, 30)}...`);
                return `![${altText}](${placeholder})`;
              }
            );
            
            console.log('Updated content with placeholders');
            setContent(updatedContent);
          }
        }
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching image map:', err);
        setIsLoading(false);
      });
  }, []);

  // Debugging button to help diagnose image issues
  const debugImage = () => {
    console.log('Current content contains image placeholders:', 
                content.includes('image-placeholder-'));
    console.log('Current image map:', imageMap);
    
    // Force image map reload
    fetch(`/api/image-map?postId=1bef7879-ec1d-80da-81db-e80ce7ae93e3&force=true`)
      .then(res => res.json())
      .then(fetchedMap => {
        console.log('Reloaded image map:', fetchedMap);
        setImageMap(fetchedMap);
      });
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <MotionConfig reducedMotion="user">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/blog/posts">Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>My First Post</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <motion.article 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-10 px-4 max-w-3xl"
          >
            <header className="mb-10">
              <h1 className={`${lukesFont.className} text-4xl font-bold mb-3`}>My First Post</h1>
              <time className="text-gray-500">3/21/2025</time>
              
              {/* Add debugging button that's only visible during development */}
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={debugImage}
                  className="mt-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded"
                >
                  Debug Images
                </button>
              )}
            </header>
            
            {isLoading ? (
              <div className="animate-pulse">Loading content...</div>
            ) : (
              <div className={`prose dark:prose-invert max-w-none ${crimsonText.className}`}>
                <ReactMarkdown components={{
                  img: ({ node, ...props }) => {
                    console.log('Rendering image with src:', props.src);
                    
                    // Check if this is a placeholder that needs to be handled specially
                    const isPlaceholder = props.src && props.src.startsWith('image-placeholder-');
                    
                    if (isPlaceholder) {
                      console.log('Detected image placeholder:', props.src);
                      
                      // If we have a mapping for this placeholder in our imageMap
                      if (imageMap[props.src]) {
                        console.log('Found mapping for placeholder:', imageMap[props.src].substring(0, 30) + '...');
                      } else {
                        console.log('No mapping found for placeholder:', props.src);
                      }
                    }
                    
                    return (
                      <SecureImage 
                        src={props.src || ''} 
                        alt={props.alt || ''} 
                        className="my-4 rounded-md" 
                        postId="1bef7879-ec1d-80da-81db-e80ce7ae93e3"
                        imageMap={imageMap}
                      />
                    );
                  },
                  // Also fix code formatting issues in the rendered markdown
                  code: ({ node, inline, className, children, ...props }) => {
                    // For code blocks in the blog content
                    return inline ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className={className} {...props}>
                        <code>{children}</code>
                      </pre>
                    );
                  },
                }}>{content}</ReactMarkdown>
              </div>
            )}
          </motion.article>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}