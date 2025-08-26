"use client"
    
  import { lukesFont, crimsonText } from '@/app/fonts';
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
    const [content, setContent] = useState(`# The Before ⏰




 In my personal experience, every project begins with the **Ideas Phase**. This usually stems from some Eureka connection between something you found online and something you know. Maybe it was while doom-scrolling on Instagram reels or watching a random YouTube video at an unbelievable hour with class at 8 in the morning (This one hits home for me 😔). Personally, I spend this phase doing a lot of drawing, I mean **A LOT** of drawing, drafting, and making connections on my iPad. The more connections I make, the more I feel like I could get this thing to work! Looks kind of like one of those conspiracy boards with tons of red strings


 ![Image](image-placeholder-conspiracyboard.jpg)




 Pretty accurate representation of how I feel after running through another Expo Marker and Whiteboard in The Bridge 😵


 Inevitably, the excitement leads to using many new frameworks, languages, or concepts that I haven't seen before. This is where **The Before Phase** steps in, where you try to learn just enough about every new program you want to implement to get started! Maybe just looking over some examples or finding some *ancient video on YouTube* to asking *Perplexity* how it works!


 > This is my story about learning LangGraph and LangChain and how I thought I knew a lot, until I really **REALLY** didn't 🙃




 # Early Building 😌




 For me, this phase is where I feel like I could pick up any framework and build anything! Usually, this is me putting together just small test files for little things to get a better understanding of how everything works as a whole. If you've looked at any of my projects, particularly *FlowState*, I have a lot of files dedicated to just testing my **Agents** or **Notion API** because I like learning through seeing it working.


 > ☝ This usually has me bouncing between three places to learn new tools




 ### GitHub Examples 🤓




 - Here is where I generally see simple implementations put into effect by the creators to demonstrate certain concepts about the framework or language!
 - I usually try to skim these examples and get a basic understanding of how the program operates/is supposed to work.
 ### Perplexity 🤖




 - If I feel like I don't understand how the examples work, and I struggle skimming through the documentation to understand how it works, I'll usually ask *Perplexity* a series of questions to try and understand the workflow.
 - An example question I gave *Perplexity* recently was:
 > Is it possible for LangGraph supervisors to specifically prompt sub-agents according to the task instead of simply handing off the user request? This could be such as:
 > User Asks 👨: Can you find exactly what assignments I have due today and add them into the description of the event? Also make sure the study event doesn't conflict with anything on any of my calendars?
 >
 > Supervisor passes to Project Manager 🤖: Find exactly what assignments I have due today!
 >
 > Project Manager Passes Back assignments to Supervisor 🤖:
 >
 > Supervisor passes to Scheduler 🤖: Add {Assignments} to description of Study Event Tonight and check if it conflicts with any events
 >
 > Scheduler passes back successful initiation to Supervisor 🤖:
 > Supervisor responds to user with success 🤖




 - *Perplexity* usually does a fantastic job pulling from the GitHub Examples as well as the Documentation
 ### IDE 📝




 - This is where I put my new tools and ideas to practice! I usually take from one of the GitHub Examples and try to expand on it! I pulled from [this example](https://github.com/langchain-REDACTED_SECRETls/multi_agent/agent_supervisor.ipynb) for a LONG time, starting with LangGraph
 - After iterating on the example and trying to get the output I want, usually I get something pretty close and can work on specifying and optimization later!
 > 🔑 While the advantage to this strategy is that **you only know as much as you need**, if you run into problems down the road or want to improve/change it in any way, it would need a **Whole Rework!** This is exactly what happened with FlowState




 # Ignorance is Bliss 🌸




 As I described in my last blog post, I thought I was pretty close to getting the backend to stream to the frontend for user deployment; all I had to do was figure out why LangGraph wasn't outputting correctly. **As expected, this turned into a much MUCH larger issue than I imagined!**


 > Turns out I hadn't really been using LangGraph all that much at all, just kind of LangGraph elements mixed with LangChainAI's and tools.




 ![Image](image-placeholder-langchainvlanggraph.jpeg)




 What I really wanted was **LangGraph** for its flexibility to choose between AI ReAct Agents (Reasoning and Acting Framework), specialized for a specific task. While this could lead to more errors than **LangChain's** simplistic sequence, it would allow FlowState to handle more complex and out-of-the-ordinary tasks!


 > 🤔 So, how did I reproach learning **LangGraph** to Fully Implement it into FlowState?




 # Tutorials ✏️




 While tutorials are quite scary for some developers due to horror stories of **Tutorial Hell** (Where you get stuck watching tutorials without actually learning how to build anything), I think it's a great starting place to build the groundwork of how the program will work!


 For me personally I went through most of the modules of [Introduction to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph), which made me realize I knew A LOT less than I initially thought I did. During this course, to avoid **Tutorial Hell,** I find it most useful to take notes on the subject. Nothing super elaborate, but enough to engage with the subject matter and make connections to your own project!


 ![Image](image-placeholder-samplenotes.jpeg)




 A quick sample of some of the notes I took that led to my Eureka moment!


 # Eureka! 💡




 At some point during the tutorials, you'll feel as though you've finally found the perfect solution you were looking for to truly apply this to your personal project. For me, that came in the form of **Sub-Graphs** where I realized in my notes I could make each of my agents their own designated Sub-Graph to better track the State and retrieve the final result message I had been searching for!


 > 📌 This is the [EXACT video](https://www.youtube.com/watch?v=B_0TNuYi56w) where I realized that after tons of trial and error of building **Supervisor Agents** and **Handoff Tools,** that there was a specific library built for this!




 ![Image](image-placeholder-dopeflowworkthingy.jpeg)




 This was my new and improved Workflow after coming to this understanding!


 Luckily, due to a **Regional Ultimate Frisbee** tournament in **Batavia, NY** (Niagara Falls Land), I had 6 hours on my hands to implement this workflow and more! This didn't come without challenges. I realized that I have to change the outputs to all my tools, re-do all of my prompting for the Supervisor Agents and ReAct Agents, and build custom Hand-Off tools to reduce prompting tokens! I ended up landing on this workflow:


 ![Image](image-placeholder-langdevworkflow.png)




 ## Teams 👏




 Each team for Project Management and Scheduler consists of **Three ReAct Agents:**


 1. **Team Supervisor**: Responsible for providing SPECIFIC prompts to the other agents and determining which of the two other agents is necessary for the task to be completed
 2. **READ Agent**: Utilizing all of the reading tools WITHOUT editing any information in the student's Calendar or Notion. This agent is responsible for simply pulling information from these sources, not changing it
 3. **CUD Agent**: The Create, Update, and Delete Agent (CUD for short) will edit and update information in the User's Calendar and Notion. This agent is separated to even add in Breakpoints and Human-In-The-Loop response, so the Agent gets **approval** from the user to change their information before executing.
 # Conclusion 🥳




 Sometimes it's mentally challenging to have to go back and sit through hours of tutorials and examples to get a framework under your belt, but the end result is **unbelievably rewarding**. I cannot express the joy I felt on that bus when I got my agent to create subtasks for my upcoming *Physics Exam* and schedule me time over the next week to **Study for the Exam!** I genuinely thought I was going to tear up at the sight of little FlowState growing up so fast 🥲!


 While that is half a joke, I think the most important takeaway from me through this process is that it's **always** worth going back to the source material to find ways to improve your system or your understanding of the system. But like my favorite sentient red race car would say, **Ka-Chow!**


 ![Image](image-placeholder-KACHOW.jpg)




 Yes, I look deranged in this photo, this is what 4 frisbee games does to a man 😭


 But as always, if you enjoyed reading at all or have any questions, my email is open!


 ## Contact:




 luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "1e4f7879-ec1d-8004-82c7-f2c7a14ffd2c";
    const tags = [{"name":"Flowstate","color":"green"},{"name":"Personal","color":"purple"},{"name":"Projects","color":"red"},{"name":"AI","color":"pink"}];
    
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
      <ModernAppSidebar>
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">Blog Post</span>
                  </div>
                </nav>
              </div>
            </div>
          </header>
        <MotionConfig reducedMotion="user">
        
            <motion.article 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto py-4 sm:py-6 md:py-10 px-3 sm:px-4 md:px-6 max-w-3xl overflow-hidden"
            >
              <header className="mb-6 md:mb-8">
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"You Know Until You Don’t 🤷‍♂️"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">4/29/2025</time>
                
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
          </MotionConfig>
        </div>
      </ModernAppSidebar>
    );
  }