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

![Image](https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/5e57e72c-de4f-40d1-8e51-599b9c508563/pen.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SAI5G26D%2F20250320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250320T051718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC0aCXVzLXdlc3QtMiJIMEYCIQCAB0ltYnkQnppv%2FveIf%2Fz%2BVbW0eG4sC7YOBxL9FFOedAIhANBRdMKgWS7%2F8gyt6WEBvwUqmHL%2F62EKyJ0EDWMUcS1KKogECIb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwaMwvbp2CByJLtQNMq3AOERJNm%2FSI0i2sY9pUZlZm4ThqXmY107Bn3ioRWpRExMHsqPChlZToAA5r1nmn3tCeSpoVhgjxD6YDy6cEseeEvYuJauuCjJRI02lQlif%2FWm9O%2BMbyMTq%2FmJj6QIHl%2FGBznuZdCRApPF8PoXXbktIk3ar5w6dhryWwSQKfZ0ifgKT1cqWWZXKiIxsBCQLcaI8hLTmrsXyAY%2Bmp1Oo9Yq1lTHztqQOvf3ADzJNYYg0Dxp5hxB5E229i6f1sBQ9gRG4JNFXgeVVqIwC35NvKUGSmNsB8z3pL0UCNFhbIGa75tB8VpnqJzLQidcVVg%2FsRFxJd0TBPOhs3jj2yjlHczQdsQI13ofujlK1pnESIl0mwUpWKjUs42%2B5uooGDftyl2RV7tfxz4a4Ej%2FDOl%2BDMyefYhSr97QfsgzlAwyQ22paRu0TIHP2Oix9m9tDTHUGgZXCUOSdbhsf3vHHBAC5P8rn%2BeG5hNXKyf63fgJLqRuqZ%2BX7e61Qb8E6vLacar5svKMHDbkAjRyOjL%2FBzO34k39uKbW53A%2FNeR0SCVKCPx6Q6Ki2015hiwcRGXQ2MuZacx3Ur%2BFOUZog6EuHMPayXdJFf7Jit9br5K96tFr%2B5zga%2FKqWuMLmQlLasc9xgZJTCHyO6%2BBjqkAf3MU8kVDQRkJUwvd%2BravZYvxKp8jkvmwoW4hrYE1rpMNw4A8TcNP9W3hzUgE0eqCoxv%2BK6HlVi2glx1cRcARFrh%2FIl34mOXXFaF%2FD%2FaxMAYkby4S%2BkrDMCDNb8DXYbT%2FbxNSJTzkTpBHJwj00xAxxW6jlNOYmwV0trLk1U%2FBZoNeneg3H0nzcfa%2FcwesjC0kQE%2F2mUHHFF0tU0%2BQCWADIz7beqs&X-Amz-Signature=59fea01cc10ab144af247fa52885ba8e9275405bab08086387164fe59ed882f7&X-Amz-SignedHeaders=host&x-id=GetObject)


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