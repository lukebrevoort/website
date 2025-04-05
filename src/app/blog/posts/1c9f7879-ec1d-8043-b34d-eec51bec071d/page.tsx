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
  import Image from "next/image";
  import { useState, useEffect } from "react";
  
  const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: true });
  
  export default function BlogPost() {
    // Store processed markdown in state
    const [content, setContent] = useState(`# Current Projects ☕️


As a current Freshman at Stevens, I have found myself committing more and more time to personal projects and ideas I have, from small changes to my website (like the new tags), or larger-scale projects that I hope to develop into something bigger than me. I thought it was about time to give an update as to what I’m doing all the time and what I am working on 😊

![Image](image-placeholder-nycnight.jpeg)


# Small Projects 😮‍💨


Not every project/idea I have has to be something huge! Most times it's quite the opposite. A few changes I’ve made/ideas I’ve had recently include:

### Adding Tags to Blog Posts 🏷️


- Something super small to just give each blog post a little more color and life!
![Image](image-placeholder-Screenshot_2025-04-05_at_1.44.52_PM.png)



### Improving Canvas-Notion 🧮


- I added another functionality to make mapping new courses (such as Quarter courses like MA 126) easier to add.
### Adding a Dynamic Island to Mac 🏝️


- After seeing an online ad for a Dynamic Island on Mac and traveling down the Perplexity rabbit hole of finding every product ever made related to this topic, I realized it would be pretty cool if I could make one of my own using Swift! So thats probably something to come in the future!
![Image](image-placeholder-image.png)


# The Ambitious Projects 🚀


Now what I am most excited about are my two on-going huge projects I have been developing non-stop for the past few weeks. If you’ve seen me in the library or at coffee shops in NYC, this is probably what I have been working on!

## High-Frequency Trading Competition 💸📈


While I may tell myself that “**stocks only go up,”** unfortunately, it is not true! For a few weeks now I have been working in a team with some of my friends in a High-Frequency Trading Competition. For me personally, I know very little about algorithmic trading or strategies to maximize profits, but luckily all my friends Matt, Anushka, and Marc are **Quantitative Finance Majors** (my personal quants)! They tell me good strategies to try, and I work my hardest to implement them!

![Image](image-placeholder-stockgoup.jpeg)


### How does the Competition work? 🤔💭


Essentially, we play simulated runs of previous stock days, which are provided by **Stevens Hanlon Labs.** We utilize the SHIFT API (link here:[ https://github.com/hanlonlab/shift-python/wiki/SHIFT-Python-API](https://github.com/hanlonlab/shift-python/wiki/SHIFT-Python-API)) to put together a strategy in Python.

> The competition essentially works like an 8-week cycle  where we attempt to improve the strategy every week to get better and as you go along placement is worth more points. **This past week we placed 3rd! **


I have been designated as our teams **Coding Expert** and have to put together the strategies they want as well as test them out with market data. I am looking forward to occasionally updating this blog about our progress and maybe some of our ideas :)

# FlowState 🌊


Now my most ambitious project and the one I am most excited to share is an idea I’ve been cooking up for a while. I like to call it **FlowState**, a Student Productivity Agent that leverages **LangGraph** to create a web of agents capable of assisting students and researchers manage time, study for exams, and handle all of the pressures of being a student! Here was the first ever sketch of the idea:

![Image](image-placeholder-flowstatefirst.jpeg)


I came up with this idea after reading the “*Building Effective Agents*” paper published by **Anthropic.** This paper describes the O*rchestrator Agent Workflow* on which this agent system is built on top of! If you are curious about the article itself, I highly suggest giving it a read here:[ Link](https://www.anthropic.com/engineering/building-effective-agents). Let's walk through what each agent does and how they can be leveraged to improve student productivity!

### Supervisor Agent 🤖


This Orchestrator Agent is meant to **coordinate** the other agents to properly manage user requests by routing to the correct agents, and enables the ability to hold a conversation and pull from the memory of a specific user!

### Project Manager Agent ✏️


This agent's goal is to handle the user's **Tasks, Projects, and Exams!** I use Notion to hold all of my course assignments, so I will start by implementing the agent to work through Notion (I ❤️ Notion). This agent can **Create, Update, and Delete** assignments as well as handle specialized tasks like **creating subtasks for an assignment** or **breaking down exam study schedules into specific tasks** such as adding a deadline to finish a practice exam or complete a rough draft of an essay!

### Scheduler Agent 🗓️


The Scheduler is exactly what it sounds like: it's an agent that will look at your calendar and be able to **create, update, and delete events!** It also contains specialized abilities such as finding available time, suggesting a study schedule, and implementing it for you!

### Document Analysis 📖


The Document Analysis Agent is meant to make understanding lecture notes way easier. It takes in your notes and can **create study guides on material, build flashcards, or able to explain concepts to the user entirely**! Specialized abilities include producing specific practice tests based on previous practice test performance!

### Resource Finder 🖥️


The Resource Finder Agent is super simple, it's an agent that is built to synthesize outside information to better contextualize building a study guide or practice test! This Agent will be able to pull from outside sources to best understand the User's Needs, including **finding publicly available previous tests** or **similar questions in users' lecture notes!**

## To Put it All onto One Whiteboard at 2 AM:


![Image](image-placeholder-Flowstate_Whiteboard.jpg)


## The Future 😎


Currently, this project is still in super early development, but it is basically what I’ll be working on non-stop until the end of the year! I’ll likely be documenting it all here, so if you want to learn more, then stick around :)

But if you enjoyed reading at all or have any questions, my email is always open!

## Contact:


luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "1c9f7879-ec1d-8043-b34d-eec51bec071d";
    const tags = [{"name":"AI","color":"pink"},{"name":"Flowstate","color":"green"},{"name":"Personal","color":"purple"},{"name":"Projects","color":"red"}];
    
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
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <MotionConfig reducedMotion="user">
          <SidebarInset className="overflow-x-hidden">
            <header className="flex h-14 md:h-16 shrink-0 items-center gap-1 md:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-50 bg-background">
              <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
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
                      <BreadcrumbLink>{"What Am I Building? 🧱👷‍♂️"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"What Am I Building? 🧱👷‍♂️"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">4/5/2025</time>
                
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
                <div className={`prose dark:prose-invert max-w-none prose-base sm:prose-lg md:prose-lg lg:prose-xl ${crimsonText.className} prose-headings:mb-3 prose-p:mb-3 sm:prose-p:mb-4 prose-p:leading-relaxed prose-li:my-1 sm:prose-li:my-2 overflow-hidden prose-pre:overflow-x-auto`}>
                  <ReactMarkdown 
                    key={loadedImages ? 'loaded' : 'loading'}
                    components={{
                      img: ({ node, ...props }) => {
                        const imageSrc = props.src || '';
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
          </SidebarInset>
        </MotionConfig>
      </SidebarProvider>
    );
  }