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
    const [content, setContent] = useState(`# Hello Again! 👋


![Image](image-placeholder-july4thmountain.jpg)


It's been a while! I hope your summer has been as relaxing and relieving as mine has been :) This summer was packed with an Apple job interview, trips to Long Island, NY, and **major progress on personal projects**! So with only a week left before school starts back up again, I thought it would be a good time to do a little recap 😉

# The Art of Retail 👖📱


For those who might not know, I have been working as a **Seasonal Employee at American Eagle** for just over a year now. It’s both a very easy job to sell jeans (Despite some possible marketing shortcomings this summer lol) and a great way to get some easy money before the semester 💸. 

![Image](image-placeholder-aelogo.jpg)


I’ve done very well in this seasonal position, even getting **Employee of the Month in June**, but in May, Apple Retail in Colorado reached out asking me if I’d want to apply for a position. **I couldn’t turn it down!**

# Apple Specialist 🍎🔧


I constructed a resume and a cover letter and applied for the **Seasonal Specialist Role**! Then, after about a month, they asked me to come in for an interview! This interview process I knew was serious when there were about 190 people interviewed and only maybe **10 positions**. So I knew my odds were slim, but I prepared using the STAR Method, which stands for

- **S: Situation**
- **T: Task**
- **A: Action**
- **R: Result**

I practiced this using **Claude**, which built an Artifact that would test me on common questions and rate/critique my response to better hone in on the STAR Method! This was the best way I could have prepared, and I highly suggest trying it for yourself!

![Image](image-placeholder-claudeinterview.png)


# The Result 😵‍💫🎉


After going through two full rounds of in-person interviews and an online assessment, I was lucky enough to get a call from their management that ***I had earned the role *****🎉** and that they would love to have me on staff! While this was some good news, I decided to clarify what “**Seasonal**” meant for Apple.

For some context, I assumed that ***Seasonal*** was the same at American Eagle as it was at Apple. I could work there over the Summer and Winter while I was back home and focus on school in New Jersey. Unfortunately, after being told I had received the job, they let me know it was a **6-month** contract and not really as “***Seasonal***” as I had assumed. For this reason, I had to **Turn Down the job offer**. While this was bittersweet, they thanked me for my time and congratulated me, letting me know I was the first call out of 198 applicants, which was nice to hear!

# Long Island, NY 🍕🌊


After this unfortunate news, I did get the opportunity to travel to Long Island, NY, for the first time with my little brother! He was there at a lacrosse tournament, and quite frankly, I came along for the good pizza (but also to support him!). It was an absolutely beautiful trip where we explored Fire Island, went to the Montauk Point Lighthouse, and, of course got some great pizza

![Image](image-placeholder-montauklighthouse.jpg)


The trip was quite relaxing and gave me an appreciation for the East Coast beaches 🏖️. Beautiful water and waves, great food, and even better company :)

# FlowState  Progress Update 🌊


My longest-running project currently is my student productivity agent platform, which looks very different from how it did when I started the summer. Here were my goals for the project this summer and where I am at currently :)

![Image](image-placeholder-goalsflowstate.jpg)


## Agent Conversations 🤖💬


Easily the hardest and most difficult part of this project for me was figuring out how you really put together an efficient full-stack project. I liked to think of this in three consequential steps

1. Deploy **Agent Network and backend on some hosting service 🚂**
1. Create JS Chat Routes in the **frontend to send messages** to our backend and can **receive them** 🗣️
1. Receive chat messages correctly, forward them to the **Agent network**, and then receive and display them on the frontend
After setting up the ***full end to end service*** there was just one thing that didn’t sit right with me:

> **The visual display of the information was dry, bland, and uninteresting**


This got me to start thinking, how can we add some more UI components that interest the user…

## Response Agent 🎤🤖


What if instead of designating the **Orchestrator Agent** to handle choosing the right agents, forwarding information, and displaying a response, we *offload* the responsibility to a separate agent, which will be our **Response Agent.**

![Image](image-placeholder-responseagentflow.jpeg)


The agent is quite simple:

> The *Orchestrator* will forward the **full convo history to the response agent** (Or a summarized version for over 6 messages to save on tokens), then the *Response Agent* will be instructed to write their message out in **Custom React JSX** that still follows our global.css guidelines.  Lastly, the *Response Agent* can also use **interactive buttons and custom UI functions** I built in the frontend, which is interpreted!


This allows **MAXIMUM** flexibility and freedom for the agent to give unique responses and interactive UI components for the User to make it look more visually interesting!

## Streaming Tool Calls 🔨☎️


While the messages were great, the hardest part about using a network of agents is **The Response Time!**Usually, the longest tool calls, like pulling all assignments in a Notion Database, can get response times of 30-45 seconds! This is way too long for the user to just be starting at a spinning wheel of death, so I needed something more interesting. This is when I saw Perplexity’s loading for searches, which is a simple and elegant solution to this problem:

![Image](image-placeholder-perplexityloading.png)


  (Yes I am a grieving Rockies fan and yes every ESPN notification I get upsets me)

> Perplexity shows the user **Real-Time Steps** that are relevant to the question they asked!


This then allows users to follow along and know that their questions are being handled with real-time information on the fly! For this reason, I implemented something similar to FlowState,

![Image](image-placeholder-loadagentcard.png)


## Database and OAuth


While I am very happy with the progress I’ve made with FlowState, I am down to my last two tasks to get the project ready for testing over the semester! For the Database, I have used **Supabase** as a way to authorize users and store personalized information securely.

> As of right now, the setup for this is simple and still very buggy, but over the next few days I am hoping to get **full end-to-end user Sign-up, Login, and OAuth** working before I had back out to **Hoboken** 


![Image](image-placeholder-ef996e6e-1de5-4588-bd93-b4d545b05734.png)


Super excited to continue testing and developing this project during the semester, so you’ll just have to wait until next time for my next big update :)

# End of Summer ☀️


For the time being, I’ll be enjoying my last few days of blue skies and sunshine here in Colorado before heading back to Jersey for my Sophomore year! But if you enjoyed reading at all or have any questions, my email is always open 😉

### Contact:


Email: luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "254f7879-ec1d-809d-a042-d21824b0e6ba";
    const tags = [{"name":"Personal","color":"purple"},{"name":"Projects","color":"red"},{"name":"Flowstate","color":"green"},{"name":"Life","color":"yellow"}];
    
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
                      <BreadcrumbLink>{"Summers End ✌️"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"Summers End ✌️"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">8/21/2025</time>
                
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