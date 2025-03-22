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

![Image](https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/4e631d27-c201-4ac1-9177-bbf1fca97e1b/JPEG_image-4AF6-B04C-12-0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NBN6V3Z%2F20250322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250322T035840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFwaCXVzLXdlc3QtMiJIMEYCIQCQjCL19tGe1mq7UwiXtvJLkqjSh4YzpTiGfSbhac4tTwIhAIqs6xoWIdNHVHQP7y3WPeTvx0Bkj3tlBORY58fn4SQKKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyXjHg%2BegOHaX5UXtwq3AOkS7VQ1JDr6MxrJvyNZ%2BBdWW%2BRvCo9y%2BuaXuOrBStGIlKehfVMVMR8jjHN7qCCGlCYFEYNWzX%2B%2BrtocrdugW5sbiD82ZE%2FTukiU7glFTDo%2F0hon7vGgGyw8F2OdahIMzgG%2F6UJ3KEnpYWN2LIsJtYF9nf7zS0jBIxrB69JYu5c%2BUSfFOQp5mrcNjl7J8rMo4Y5dUGfr8WebyaT3dGuieEzZKtw1NIfk9OHpHpYoZ%2Fqb86lPFIKEiZDSoEen8LZXnv2QaMfWHeaYxUvwsRdEK0HQEOEorbckMshHvCXtuKK6VwrSpT0XoYjufsa6NXsQhLddave28kIe%2FGljlILi5MGH2nmt7nnLJdApbZTSks4wwC6iWXbbEC4eX8v8jHC6TnHRy8i7OGf8I%2F0q%2FABPYch2hYqN0uHgZ8jEO6731tnefABuzmAIH%2BfAMtetBMN1c3DOyMkOhKaoX5Wm%2BMEyd%2BwWpB2AbxkU3%2Fu5b7BysfUrELKMKJ9ra2Hh29LGtCPvmK0Nx9MvtGz6BdkMcUCKCeHDJk%2FKdu3IQG%2Bgsj8KtEBFUq942Vw%2BeOvOYC%2B5kwl2e%2F3M061MOkiB8u1HdsdYprKXx7A4HSqeWJ25e8otna5b%2FOIwE7H7dE4EJsJbzCL6fi%2BBjqkAfU2ZyzwpljjOFLt4Op7EnlwM4Ft9PMaNnVGIWS7Y3eOEi9Ic5ui4%2BwOGwAPvVnPPf9orCIsBT2LJ%2FksTojNO3f1phYzVITjxM7Cse%2F8mwIV1eunU%2By8eUbAqe2PAgyG3Ek8wSdgXYNRhGHxTFrXsyvsSvTHOziDJ%2F0eLQbXMfTfVTFc6foPwQpsGQ%2BM8fvRFYMUJ9QjuveDukSjrnqJXgvyn0%2FI&X-Amz-Signature=b78bc255a867c22973fd13cc322faeca954fb959e17125699798b0c913de93fb&X-Amz-SignedHeaders=host&x-id=GetObject)


The workflow essentially leverages the **Notion Webhooks** to communicate with my website whenever I decide to post a new blog in my database. Then my personal website will extract the key content and convert it into **Markdown** which is then converted into **React (**JSX**). **

After this, we build a file using Notions UUID as the name and address. This blogs is **1bef7879ec1d80da81dbe80ce7ae93e3! **When this file is done generating we execute a **Github Action** which will automatically push the new file and its changes to my Github Repo! Whenever this happens, Vercel (Which is what my website is deployed on) which re-deploy and show the newest update to the blog!!!

While this may seem quite easy, I ran into a lot of difficulties and unexpected challenges along the way!

# The Challenges 🙅‍♂️


## Images 🌠


The first major hurdle I had to overcome was trying to process Images. 

Markdown couldn’t handle images on its own so, I had to take it into my own hands. My first idea was just to scan the markdown and detect images my Notions **[Image] **tag in front. While this worked I unexpectedly got an email informing me I had leaked an **AWS Temp Key.**

\`\`\`javascript
![Image](https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/5e57e72c-de4f-40d1-8e51-599b9c508563/pen.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-

Credential=ASIAZI2LB466SAI5G26D //This was the bad part

%2F20250320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250320T051718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC0aCXVzLXdlc3QtMiJIMEYCIQCAB0ltYnkQnppv%2FveIf%2Fz%2BVbW0eG4sC7YOBxL9FFOedAIhANBRdMKgWS7%2F8gyt6WEBvwUqmHL%2F62EKyJ0EDWMUcS1KKogECIb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwaMwvbp2CByJLtQNMq3AOERJNm%2FSI0i2sY9pUZlZm4ThqXmY107Bn3ioRWpRExMHsqPChlZToAA5r1nmn3tCeSpoVhgjxD6YDy6cEseeEvYuJauuCjJRI02lQlif%2FWm9O%2BMbyMTq%2FmJj6QIHl%2FGBznuZdCRApPF8PoXXbktIk3ar5w6dhryWwSQKfZ0ifgKT1cqWWZXKiIxsBCQLcaI8hLTmrsXyAY%2Bmp1Oo9Yq1lTHztqQOvf3ADzJNYYg0Dxp5hxB5E229i6f1sBQ9gRG4JNFXgeVVqIwC35NvKUGSmNsB8z3pL0UCNFhbIGa75tB8VpnqJzLQidcVVg%2FsRFxJd0TBPOhs3jj2yjlHczQdsQI13ofujlK1pnESIl0mwUpWKjUs42%2B5uooGDftyl2RV7tfxz4a4Ej%2FDOl%2BDMyefYhSr97QfsgzlAwyQ22paRu0TIHP2Oix9m9tDTHUGgZXCUOSdbhsf3vHHBAC5P8rn%2BeG5hNXKyf63fgJLqRuqZ%2BX7e61Qb8E6vLacar5svKMHDbkAjRyOjL%2FBzO34k39uKbW53A%2FNeR0SCVKCPx6Q6Ki2015hiwcRGXQ2MuZacx3Ur%2BFOUZog6EuHMPayXdJFf7Jit9br5K96tFr%2B5zga%2FKqWuMLmQlLasc9xgZJTCHyO6%2BBjqkAf3MU8kVDQRkJUwvd%2BravZYvxKp8jkvmwoW4hrYE1rpMNw4A8TcNP9W3hzUgE0eqCoxv%2BK6HlVi2glx1cRcARFrh%2FIl34mOXXFaF%2FD%2FaxMAYkby4S%2BkrDMCDNb8DXYbT%2FbxNSJTzkTpBHJwj00xAxxW6jlNOYmwV0trLk1U%2FBZoNeneg3H0nzcfa%2FcwesjC0kQE%2F2mUHHFF0tU0%2BQCWADIz7beqs&X-Amz-Signature=59fea01cc10ab144af247fa52885ba8e9275405bab08086387164fe59ed882f7&X-Amz-SignedHeaders=host&x-id=GetObject)
\`\`\`


![Image](image-placeholder-aHR0cHM6Ly9wcm9kLWZpbGVzLXNlY3Vy)


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
    const blobName = \`blog-images/${imageHash}.jpg\`;
    
    // Check if the blob already exists - list blob with a prefix
    const { blobs } = await list({ prefix: blobName });
    
    // If we found the image in blob storage, return its URL
    if (blobs.length > 0) {
      console.log(\`Found existing image in Blob storage: ${blobs[0].url}\`);
      return NextResponse.json({ imagePath: blobs[0].url });
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

  // Process image URLs at runtime
  useEffect(() => {
    // Load image map (placeholders -> URLs) from external API or server-side logic
    fetch('/api/image-map?postId=1bef7879-ec1d-80da-81db-e80ce7ae93e3')
      .then(res => res.json())
      .then(imageMap => {
        let processedContent = content;
        // Replace placeholders with actual URLs
        Object.entries(imageMap).forEach(([placeholder, url]) => {
          processedContent = processedContent.replace(
            new RegExp(placeholder, 'g'),
            String(url)
          );
        });
        setContent(processedContent);
      })
      .catch(err => console.error('Error fetching image map:', err));
  }, []);

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
                    <BreadcrumbLink>My First Post 😊</BreadcrumbLink>
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
              <h1 className={`${lukesFont.className} text-4xl font-bold mb-3`}>My First Post 😊</h1>
              <time className="text-gray-500">3/21/2025</time>
            </header>
            
            <div className={`prose dark:prose-invert max-w-none ${crimsonText.className}`}>
              <ReactMarkdown components={{
                img: ({ node, ...props }) => (
                  <SecureImage 
                    src={props.src || ''} 
                    alt={props.alt || ''} 
                    className="my-4 rounded-md" 
                  />
                ),
              }}>{content}</ReactMarkdown>
            </div>
          </motion.article>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}