"use client"
    
  import { lukesFont, satoshi } from '@/app/fonts';
  import { ModernAppSidebar } from "@/components/modern-app-sidebar";
  import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
  import { motion } from "framer-motion";
  import { MotionConfig } from "framer-motion";
  import dynamic from 'next/dynamic';
  import SecureImage from "@/components/secure-image";
  import Image from "next/image";
  import { useState, useEffect } from "react";
  
  const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });
  
  export default function BlogPost() {
    // Store processed markdown in state
    const [content, setContent] = useState(`# Winter Break! ☃️


![Image](image-placeholder-winterbreaksnoweymountain.jpeg)


Happy Holidays and Merry Christmas to those who celebrate 🎉! I thought it would be nice before the start of the new year to write a nice **end-of-semester review.** From classes I felt I excelled, to those that felt much harder, and lastly, a save at the bell 🔔 from one of my professors! In this blog, I’ll go over my past semester and what I am looking forward to in ***2026***!

# Finals Season 💼


Having to go right from **Thanksgiving Break** 🦃 back to locking in is a rough transition, and this year was no different. But luckily, my checklist of to-dos for the end of the semester was a little smaller than I was used to!

### Finals Checklist (Date Sorted)


- [ ] Entrepreneurial Thinking | Final Prototype and Video | Dec. 7th
- [ ] Computer Algorithms | Final Exam | Dec. 10th
- [ ] Computer Architecture and Design | Final CPU Project | Dec. 11th
- [ ] Probability | Final Exam | Dec. 15th
- [ ] Computers and Society | Final Essay | Dec. 19th
### Priorities 🧐


When I try to plan out what needs to get done and when, my first task is always **getting my priorities straight.**

1. Which assignments are the most **difficult**?
1. Which will be the most **time-consuming**?
1. Which do I need to put the **most effort** into to get my A?
These are the types of questions I ask myself before I start to work on something like this. For me, my priority list looked something more like this

### Finals Checklist (Priority Sorted)


1. Computer Algorithms Final Exam** HIGHEST**
1. Computer Architecture and Design Final CPU Project **Very High**
1. Entrepreneurial Thinking Final Prototype and Video **Medium**
1. Probability Final Exam **Medium**
1. Computers and Society Final Essay **Low**
---


My top two were my two most important classes, especially Algorithms, where I would need an **Above 85%** to get an A-! The rest were seen as simply below these two, with the Entrepreneurial Thinking being mostly group work. I needed to find time for the Probability Final Exam, which I had felt super comfortable about all year. Lastly, the essay was already mostly complete from my rough draft, so it was just cleaning things up.

## So, How Did it Go? 👀


Before I get into the grades, I wanted to at least show off my hard work on my CPU final projects. Easily one of the coolest projects I was able to get done first was my baby CPU, **Son of Anton!** 

![Image](image-placeholder-sonofanton.jpg.png)


Using Logism-Evolution, we had to hand-build each essential part of a **single-cycle CPU**, including the Program Counter, Instruction Memory and Decoding, the Register Logic, the ALU, and lastly the Data Memory. Super excited about this project and loved going through the process of building it all!

### Results 🥁


![Image](image-placeholder-sophendofyeargrades.jpg.png)


---


Now, sometimes you should notice, first, I still have no idea what my class grade was in **Probability and Statistics**. I thought the final went well, but *nothing was ever posted to Canvas*, so I really have no idea! All I know is that by the end of the year, I had earned an A!

Secondly, I was also **super** disappointed with Algorithms, due to a Homework assignment that I submitted incorrectly, my grade was dropped **10%~** and my final exam wasn’t enough to clutch out the A 😢

Outside of those two, everything else went exactly how I wanted it to, just would have wished for that one Homework Assignment to be dropped…

### The Email 📧


After accepting my grade in algorithms going into break, I had received an email titled **Letter Grades Are Entered,** I opened the email, and to my surprise, Dr. Akcam had decided to drop the lowest HW Assignment, moving my final grade up to a **93%!!!** This was a huge win, and I can’t thank Dr. Akcam enough for pulling through and securing me, and probably many others, that A!

## Reflection 🪞


In the end, I was (obviously) pretty happy with the results! I was able to pull through in the end and get the grades that I wanted, even if I was still spending most of my time on personal projects… :)

# Personal Projects 👑


Now, if I wasn’t studying or working on school projects, then what was I spending all of this time on? 

### n8n Workflows 👻


Something I have been working on for quite a while is my new resume personalization tool using n8n! After building my own using LangChain and Ollama, I found n8n as a way to move over my existing code and add in some nice quality of life features like Human in the Loop through Gmail and Slack! 

---


**The workflow is split into two parts!**

### Step 1


![Image](image-placeholder-slackn8nsuperthingy.png)


The first is my Job Pulling section, where every 5 hours, this workflow will run on the scheduled trigger, making an HTTP request to a SWE Internship Job Repo (Thanks Vansh & Ouckah!), which will pull ALL the jobs in the repo.

Then we will use the **Filter** to pick jobs within the last 7 days. We will then compare this with what has already been added to my personal Notion in the last 7 days. If it is not in our Job Database, we will add it and then send an **HTTP request to my Slack**.

![Image](image-placeholder-SLAckmessagen8nin.png)


Then, using the Block Kit Builder, we make a customized message to be sent directly to my Slack! I used the **Multi-Static Select** since I can then choose which jobs I would like to get my resume personalized for!

After I choose which jobs I would like, it will send that information back to my integration and add these positions in Notion under “Considering.”

---


### Step 2


Now that we have what jobs we want to personalize, how do we actually personalize them? 

![Image](image-placeholder-personalizen8nintegr.png)


The first phase of this step is getting our trigger from Notion and requesting the job site's URL. Pulling out any HTML from the page. If the job URL is no longer available, it will send me an email letting me know.

Now that if statement is essential, as some platforms (Workday) choose to render all of their HTML is extrapolated with scripts after the URL is called, giving us a SOAP Redirect. But, after investigating the network, I found Workday uses a very simple calling mechanism to extract this HTML.

\`\`\`javascript
\\`https://\\${tenant}.wd5.myworkdayjobs.com/wday/cxs/\\${tenant}/\\${siteId}/job/\\${tail}\\`
\`\`\`


Once we have our HTML, we can parse it with JS and then send it to two LLMs

1. Our Skill Categorizer takes in this parsed HTML and lists the most important skills that the user should mention in their resume to pass the Automated Resume Review
1. The Resume Maker takes in these suggestions and my Typst Resume to optimize it for the specific Job Application
![Image](image-placeholder-humanintheloopn8n.png)


After we have successfully made the resume, I am sent an email to compile the Typst resume and either **APPROVE** or **DENY** with suggestions for what to change. If I deny the resume, the JS script will extract my feedback and feed it into the Resume Optimizer, which will take in these considerations and adjust the iterated resume as many times as needed before I approve!

Once the Resume is approved, we add the appended resume in blocks and chunks into Notion and update its Status for me to go ahead and submit the application! If you want to read up more on this and see an example generated resume it made for me, check it out here: [https://luke.brevoort.com/projects/job-personalizer](https://luke.brevoort.com/projects/job-personalizer)

# Until Next Time 🫡


Well, that is all I have for now! Hoping to make another blog post soon about two other exciting personal projects, but I want to get a little further into development before I reveal them 🤌

Happy Holidays, and see you in the new year! Feel free to email me if you want to try this tool or want to talk about anything at all, my email is always open 😉

luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "2d8f7879-ec1d-807f-a7ef-eda85834552b";
    const tags = [{"name":"Personal","color":"purple"},{"name":"School","color":"orange"},{"name":"Life","color":"yellow"},{"name":"Projects","color":"red"}];
    
    // Detect color scheme preference
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }, []);
    
    // Function to preload images to blob storage
    const preloadImages = async (imageMap: Record<string, string>) => {
      if (!imageMap || Object.keys(imageMap).length === 0) return;
      
      console.log('Preloading images:', Object.keys(imageMap).length);
      
      // Create an array to hold all image loading promises
      const imagePromises = Object.values(imageMap).map(url => {
        return new Promise<void>((resolve) => {
          if (!url || typeof url !== 'string') {
            resolve();
            return;
          }
      
          // Skip if URL is not valid or still a placeholder
          if (url.startsWith('image-placeholder-')) {
            resolve();
            return;
          }
          
          // Use browser's Image constructor to preload
          if (typeof window !== 'undefined') {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => {
              console.warn(`Failed to preload image: ${url}`);
              resolve(); // Resolve anyway to not block other images
            };
            img.src = url;
          } else {
            // If running on server, just resolve
            resolve();
          }
        });
      });
      
      // Wait for all images to load or fail
      await Promise.all(imagePromises);
      console.log('All images preloaded');
    };
    
    // Combined effect for image mappings
    useEffect(() => {
      console.log('Setting up image mappings...');
      
      // Add direct hardcoded fallback mappings for specific placeholders
      const hardcodedMap: Record<string, string> = {};
      
      // Extract placeholders from content
      const placeholderRegex = /image-placeholder-[^)"\s]+/g;
      const placeholders = content.match(placeholderRegex) || [];
      console.log('Extracted placeholders:', placeholders);
      
      // Then fetch API mappings and merge them, preserving hardcoded mappings
      fetch(`/api/image-map?postId=${postId}&placeholders=${placeholders.join(',')}`)
        .then(res => {
          console.log('Image map API response status:', res.status);
          if (!res.ok) {
            throw new Error(`Failed to fetch image map: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(async fetchedMap => {
          console.log('API returned mappings:', fetchedMap);
          
          // Merge with priority to fetched mappings but keep hardcoded as fallback
          const combinedMap = {...hardcodedMap, ...fetchedMap};
          console.log('Combined map:', combinedMap);
          setImageMap(combinedMap);
          setIsLoading(false);
          
          // Preload images after mapping is set
          await preloadImages(combinedMap);
          setLoadedImages(true);
        })
        .catch(err => {
          console.error('Error fetching image map:', err);
          // Fall back to hardcoded mappings if fetch fails
          console.log('Falling back to hardcoded mappings');
          setImageMap(hardcodedMap);
          setIsLoading(false);
          
          // Attempt to preload hardcoded images
          preloadImages(hardcodedMap).then(() => {
            setLoadedImages(true);
          });
        });
    }, [postId, content]);

    // Include a helper function for tag colors
    function getTagColorClass(notionColor: string) {
      const colorMap = {
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        brown: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
      };
    
      return colorMap[notionColor as keyof typeof colorMap] || colorMap.default;
    }
  
    return (
      <ModernAppSidebar currentPath="/blog/posts">
        <MotionConfig reducedMotion="user">
          <div className="min-h-screen overflow-x-hidden">
            <header className="flex h-14 md:h-16 shrink-0 items-center gap-1 md:gap-2 transition-[width,height] ease-linear sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/10">
              <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
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
                      <BreadcrumbLink>{"Winter is Here ❄️⛄️"}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
        
            <motion.article 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto py-4 sm:py-6 md:py-10 px-3 sm:px-4 md:px-6 max-w-3xl overflow-hidden"
            >
              <header className="mb-6 md:mb-8">
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"Winter is Here ❄️⛄️"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">12/30/2025</time>
                
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${getTagColorClass(tag.color)}`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </header>
              
              {isLoading ? (
                <div className="animate-pulse">Loading content...</div>
              ) : (
                <div className={`prose dark:prose-invert max-w-none prose-base sm:prose-lg md:prose-lg lg:prose-xl ${satoshi.className} prose-headings:mb-3 prose-p:mb-3 sm:prose-p:mb-4 prose-p:leading-relaxed prose-li:my-1 sm:prose-li:my-2 overflow-hidden prose-pre:overflow-x-auto`}>
                  <ReactMarkdown 
                    key={loadedImages ? 'loaded' : 'loading'}
                    components={{
                      img: ({ node, ...props }) => {
                        const imageSrc: string = typeof props.src === 'string' ? props.src : '';
                        console.log('Rendering image in markdown:', imageSrc);
                        console.log('Available mappings:', Object.keys(imageMap));
                        console.log('Image mapped?', !!imageMap[imageSrc]);
                        
                        // First check if we have a mapping
                        if (imageMap[imageSrc]) {
                          console.log(`Using mapped image: ${imageMap[imageSrc]}`);
                          return (
                            <div className="my-6 sm:my-8 w-full">
                              <Image 
                                src={imageMap[imageSrc]} 
                                alt={props.alt || ''} 
                                className="rounded-lg w-full shadow-md hover:shadow-lg transition-shadow"
                                width={0}
                                height={0}
                                sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 800px"
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  maxHeight: '70vh',
                                  objectFit: 'contain'
                                }}
                                priority={true}
                              />
                            </div>
                          );
                        }
                        
                        // If all else fails, try SecureImage
                        return (
                          <div className="my-6 sm:my-8 w-full">
                            <SecureImage 
                              src={imageSrc} 
                              alt={props.alt || ''} 
                              className="rounded-lg shadow-md hover:shadow-lg transition-shadow w-full h-auto max-h-[70vh] object-contain" 
                              postId={postId}
                              imageMap={imageMap}
                            />
                          </div>
                        );
                      },
                    }}
                  >{content}</ReactMarkdown>
                </div>
              )}
            </motion.article>
        
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Back to top"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </MotionConfig>
      </ModernAppSidebar>
    );
  }