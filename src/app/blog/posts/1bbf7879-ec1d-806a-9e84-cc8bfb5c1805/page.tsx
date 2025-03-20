"use client"

import { lukesFont, crimsonText } from '@/app/fonts';
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { MotionConfig } from "framer-motion";
import dynamic from 'next/dynamic';

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
                    <BreadcrumbLink href="/blog/posts">Blog</BreadcrumbLink>
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
              <ReactMarkdown>{`# This is my very first Blog Post! 🤨


Here is some content and an image!

![Image](https://prod-files-secure.s3.us-west-2.amazonaws.com/c41a9cb2-d354-461a-84e7-dc2c10a616fc/544aa699-eacb-46d3-bf01-14b552406bb0/IMG_5936.heic?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2FEY5U7%2F20250319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250319T235416Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECUaCXVzLXdlc3QtMiJGMEQCIBldfbKqUsJTVp4gvD5GPOPm3wrwdMnDf8S0Oc4mIHbbAiBU3fYXRMfslU6GUnnLQEa80%2FISVLsSJNBjGbJ6%2FqY2Kyr%2FAwh%2BEAAaDDYzNzQyMzE4MzgwNSIMF4NqP3PPqGk8NXseKtwD%2Bkc6kyByIef4hxAopq7d7X%2B5kuu2PLyUxaSPOwSXBHWoa2SUnghxJd1UXOTUlYaXHd%2FG1MBHUDfgPU65fecX4r%2FLNmwAXqKG5jvBbOCI%2B3cnJIkbL%2Fd%2FS4XmjnHETOoN1YIi8ZgogvgVf6mblJ7gF2GIfpQ0%2BcOYYsDGrmJOJQtw3fTi2qpozibkaRiAMOWRayWOIj1vNUWRu0se2wvCzqu7elnQFAOAhUmiM%2FQnQvY%2FME3O0%2FZilMs%2BKZXoAi4avnoNZq1BNzoMsvkuTznlIeXTO7ZvpctWe8sPew89HoBQq4qGvmoZLGuepO6xlu31JVcw8%2FZUlikkAXuYcipqETdPDbRQopNbj6Z9THK%2BqoaG%2F0TyN96u38GjLf8Dfx1rqjiEK946kPSMgxQ%2F2z7TJzPkjsK9ACz2YIqrpVOUT3WhnfrGw6lbGS3WOuSM0T%2FNvVuSYv0eq4bzFluzWDVx243fWlb7tRMBytZeK%2FNE24vNLw1IDvtIxa2RhcqkGKQx6muU%2B0lm0MiYziM%2Bc8CQ8oceRhwKOvbgyzkk6mRC9pC3pRYTIAlDXqWrcK9ag0WX7bnrjADEql2oaY2gv6CY0EOGM0wh7hrtMwQjIEHMSy%2BJXDKAn%2F1mBmouCY8w19jsvgY6pgHMgo4Hu5H2%2FYF30F7%2BrOVzpS5f5sCE%2FA77wLR4nnNYYWxBqEgHQvu2mpR7pgeU9EN%2FcRsys%2BEJ6X97Xr2TjQTzED7tfC8x9I42cYJXAoQcb7IaiLKu6nQ1injeiHoYogJhZmNZOpHG7gpgQPlp7cEm31V3v1Y1jXeRHmnERnzlXtWf6v8LLGziWI5sx71ZtwuwnxNm6ri4tMN7TGlX2Mh3Z3PgN6Dl&X-Amz-Signature=00504e5af394fd440ded2f04db9a6d199312f21a0cd53204a9f044fc79542c79&X-Amz-SignedHeaders=host&x-id=GetObject)


That is the end of this first post!
`}</ReactMarkdown>
            </div>
          </motion.article>
        </SidebarInset>
      </MotionConfig>
    </SidebarProvider>
  );
}
