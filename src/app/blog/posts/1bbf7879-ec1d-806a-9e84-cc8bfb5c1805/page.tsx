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
import { useState } from "react";

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });

export default function BlogPost() {
  const [content] = useState(`# This is my very first Blog Post! 🤨


Here is some content and an image!

![[Image]](![](https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/544aa699-eacb-46d3-bf01-14b552406bb0/IMG_5936.heic?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z7ENC7W7%2F20250320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250320T021223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCeyHVzhv1mDJ1InERQ3G%2B4pA%2BBcAmtDdl8Ge0NmYDt8wIgaZI9HIQg40LwrdiXtCT2jIZqsFjnfdxiU10zxdFDO9QqiAQIg%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBpc7b5Oi2RVOEsOiCrcA2GBAx6FeRda48iZhKpsmyAumtrAt7AY%2BXrOE9fEFmGB3LMYT1FqAblVTNX27v5Ig%2FxMgFi8ehYAdnw20VqIcfoznjV0uPTRlyVYYcheZXrPbqch0OmmV8P71MWJYvGHjeZi4OtIGzXD%2FjHHIZopd30ZlgFbCS4nEkFsvCsklNmzRQnt0HI041Zt5W0BHJV1IXQZYhRlEJN5KbubARCIZvsagNnLKROt93PCLdJNHxPPQ7dtr2Uiudl9Mv54Ai6fl6gT8CTVWrLJB5NZKdjD82nWI0aUuGd3qtg1Uc2wRNaAfNJRMZUsrYvPCNQqPmg6yM8nUNxDheFts3c7XjHkxYHCNc%2BeWK%2FMEsBsgIwaBJcK%2BsAZHttjYb6Ki2C8zvOkdN2NztHnRaIfXc8F%2B4g7KJDndmcFK%2FCZGKw0kJqcG%2BBKN2VT1Vhui6ju%2Fvwn32ghoQr16bu80GYVpcDfMnl7AXzpsxqVwRa0gzccPDE82NJRS5ZnaquKOnZPEX5vspShv5F80rdvHdRmpCgLD1mZ50fqYIqc%2FrMa5730oPz0s%2FjvWGQtnBkrQGr2q4FqG%2BFpXluK2pENYncvcDWOpZe9SKIJ9hFDxj4kLWrt08QldMsoaSQkqhK34ln%2BlMheMKnq7b4GOqUBzRDsoqeanIVUmXMMnJvDIhJqd9z69HDwPo1gbFuLZsX%2BtH5yddojUeA5SasORRlwFvDCw%2FV%2Famvgp1ENBsOcl94D8RS8nJ76Qslstai3unqqr2NXHHXoKGn%2FkXFDKnfp6dK5st%2B7fC%2FTaygPvcekIECmJ5E2%2BP6kYUpFvmfqFA7xciB9OqGUyiI7tCvcwVMvq4ezkNA4ENQGt2mHLSVIXPLqtETQ&X-Amz-Signature=1413712ae6009b6674241ad1bc3ace128df5a61b91aa3b781cf70a86e11983a9&X-Amz-SignedHeaders=host&x-id=GetObject))


That is the end of this first post!
`);

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