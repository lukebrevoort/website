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
  // Store processed markdown in state to avoid exposing credentials in the source
  const [content, setContent] = useState(`# This is my very first Blog Post! 🤨


Here is some content and an image!

![Image](image-placeholder-aHR0cHM6Ly9wcm9kLWZpbGVzLXNlY3Vy)


That is the end of this first post!
`);

  // Process image URLs at runtime
  useEffect(() => {
    // This map will hold placeholders to real URLs
    const imageMap = new Map();
    
    // Extract all AWS S3 URLs from the original markdown and map them to placeholders
    const regex = /(https:\/\/prod-files-secure\.s3[^)"\s]+)/g;
    let match;
    let originalMarkdown = `# This is my very first Blog Post! 🤨


Here is some content and an image!

![Image](https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/544aa699-eacb-46d3-bf01-14b552406bb0/IMG_5936.heic?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UYEYFYL6%2F20250320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250320T050827Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECwaCXVzLXdlc3QtMiJHMEUCIQD7bnW9Sb7pdLu%2BpqTc1i6rHm4YaLAm%2Fw5WpgX6Yp6yBwIgfIn8aQ3%2BHpYCt5ct1ZoqtcfuEQJxXpiY5aftyAe%2F%2FqMqiAQIhf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPHIowIBARA0R9nFHSrcA%2Bw8t%2FDc%2BpMHxG3cbOC%2FMRzqbM2S29ge0YMriuU47A62cAQi2QkPhF2oP7tVOJKWjz2%2BXN%2F9%2FLmsrkFL0xt6bYQWfUO7JwJMouwXKfTwldlIUfHaGnreCxoNMj%2BDIDNfuVwrURIOmYrqTdnQLeV89ln8UWJnmNvtkBmhFBhIq5QHbqvW%2BA7BMZSTZEwuoHL478MKnZWjlKNOh9ODc2qNG%2FkHM4Oq44i8fRxGnI5FbnS7QC5U%2Ba6plkjblLddwr1vwoA1waLahLcIg9QK38ZYmKDS%2FjKCuGHU%2FEuQ9bJ%2BvkoXt81I3KU3vjIgGPJlwFYvH%2FFO0499He9rzH0HOyOMUU7xMkew7ap2vsAK34vcJBdiHjmHYiMQRWvTHt8tS2VSKdy2a1bU6gUYfR2h5gj%2B9yaq7Plo52FU2oP50Im25z71aPFMasjpPpVGUkRohRBfUqQa4ZMugSZNDjAunD%2FeFdGaPKNYho6CNkJJJSm0yn1%2BY26dX1euuyYGpeKXcGl54b7bntmhSwgLt5ooIeA5v%2BTK%2F2d3JyvFCr%2F68tccxbXkokgcQae9dg20Tazgpu2xLRruvs%2BRyxXNGLf43Ndp9W51AphB2bH8OucUpBmXVImZ4JoCj3Qi0aA01e99MKqn7r4GOqUB4CfBFScRIJXPfvZVyKXVToc1NBg0mvJ6o5PhiFfT5KOydD03z6B7HzE4idL7RKb5JgRW%2BKefIfiOa1ZmovoWU87EuNdbiUTzupAX88RdHIwHKrSEjI%2BN24%2Fl%2BnjG6F9B2ypHi%2BxqwKuXCxZMkr%2FdIbTuRF19h507ogT%2BmQLeLCu3ef5hTUH%2FGnq3Z%2Bnz2hFQDPfDxhfzrce2WmVSxiNXpM8ShXg1&X-Amz-Signature=b52e44120bab670dc8b9db85e2cff2e12334b28cbb304f326ce38a6ebf895be4&X-Amz-SignedHeaders=host&x-id=GetObject)


That is the end of this first post!
`;
    
    while ((match = regex.exec(originalMarkdown)) !== null) {
      const url = match[0];
      const urlHash = btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      const placeholder = `image-placeholder-${urlHash}`;
      imageMap.set(placeholder, url);
    }
    
    // Replace placeholders with actual URLs
    let processedContent = content;
    imageMap.forEach((url, placeholder) => {
      processedContent = processedContent.replace(
        new RegExp(placeholder, 'g'),
        url
      );
    });
    
    setContent(processedContent);
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
                    <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>My First Blog Post!</BreadcrumbLink>
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
              <h1 className={`${lukesFont.className} text-4xl font-bold mb-3`}>My First Blog Post!</h1>
              <time className="text-gray-500">3/17/2025</time>
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