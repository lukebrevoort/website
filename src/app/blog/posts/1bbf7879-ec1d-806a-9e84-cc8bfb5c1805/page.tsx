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

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });

export default function BlogPost() {
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
              }}># This is my very first Blog Post! 🤨


Here is some content and an image!

<SecureImage src="https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/544aa699-eacb-46d3-bf01-14b552406bb0/IMG_5936.heic?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MCPGL74%2F20250320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250320T020125Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQDqLaVvc0p%2BDTD7ykKhLgEPOVYhzO5Djjf4EUYyA7Vh%2BAIgV11ChBow2g5vdMUUcdGNjGo3kK8I5VdJzd1VKFm3LjgqiAQIg%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJclTU5G1j%2FVZ9xa%2BCrcAwltvWNglBLbn1eRKPyqzbl481q5%2F%2BKdhuRdtXWJgGgFxQaEuTIBYkFp0RhCCuj1UFUZuMyoKxvncyx9MlOVrYzKyBE3pVPZL90OqaFjoXgt9LmTaj4TK9tqAZJhqFIGb75r4NYU1okT5zpfexONqpy5ere1ho5R2Va2kyp%2FZj2t2oJIFzBwJAWSppeNInJLnLSgy5eXu0n9hBts4gbpClU4EU4dBYLydT9E%2F738SNewf5%2FrGm3Iy7rC04NgE%2BVXRwM7TyMX4zLq2LIzQfXMfvpv7f%2FIvRcEz7KYgqG8rlieGQOBnzglRIrg08AMf5zF6laQgu04SAEGc9%2BEuty5IWNZemvDnA8m%2B9lIxLoD2ptFvi2mjLEhhusIlJz%2Fw7KgObQP54PoAA8WvyVRoroYJZ%2FEMywaNIexZXgg4lfx%2BdRE9v4GbX4TTvDsw0amQ5A0Zrb5WVLGdN0FtEgYqh2FsUitmO9scG9GtsklVrJRtkcJfsivUu1k0tC78gE7oIF7yYtQU2APzA3xTowuH3%2FogLmxpM9IjI8ROhq3ezGFdLEBCgMl56y15uZWqET4dlqeuTNcRJ0h2uMmb2TNwm3xJdweatagZqKrZy6%2FCPaWIP8EByyQCusCdjxtQzh4MNXq7b4GOqUBZk%2FylhpvMdcwb6QvsqYDD3XgwXDHAUIydJXJyZTZFaCVZK2xilP3zsB6cJdNj5%2FyJ84PijUjX4oazdJzm9IzFGeeHG0N7VMMI%2B%2FBWrz%2FoESbK68nPUbEKfLCF9g%2FWn9WIUq%2FzPEDgcXabawK7xTjZVbfEQwVPXHRRonXVKe3Pax%2FjLfC4a%2Fq1PXUDEswXGQ0n6i%2FoG%2FJ5d9Np%2Fa5luIQttiQrLDd&X-Amz-Signature=a6144c6d64babeb9df3939b0ad83e8a6250d0763cc3b75d3b0fd70896f403d72&X-Amz-SignedHeaders=host&x-id=GetObject" alt="Image" />


That is the end of this first post!
</ReactMarkdown>
            </div>
          </motion.article>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}