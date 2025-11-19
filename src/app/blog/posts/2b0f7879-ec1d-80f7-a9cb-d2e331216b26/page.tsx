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
    const [content, setContent] = useState(`# Developing for the Future? 👷


Over my time as a student developing software, trends have been moving faster than ever for building what is the “**Perfect Development Environment**”. From the earlier days of copy and pasting from ChatGPT and Claude 😴, to now having fully-fledged sub-agents working on your behalf 🤖, developing software has never been in a more unpredictable and volatile place in my lifetime. Even my Professors like **Dr. Zumrut Akcam** today told our class that she doesn’t know if coding will ever be the same again, or if hand coding in 5 years will be considered “*Obsolete*”. As a student, that's scary to hear, but also exciting to dive into the **Why!**

So this week I’ve decided to document what I’m doing to try and predict the future 🔮 and what I’ve learned through my journey as a student developer.

# Why the Concern? 😱


All I see and hear from upperclassmen and professionals in the field is that:

> **CS is COOKED 🔥**


![Image](image-placeholder-cursoraiimage.png)


From 8-round interviews to AI displacing Junior Engineers, there has never been a more uneasy feeling around being a Computer Scientist. Part of this fear is generated from the newest, latest, and greatest IDEs like **Cursor** that are unbelievably accurate when it comes to developing software at hyper-fast speeds. It’s better, smarter, and faster as a developer than I (and probably many others), which has been **intimidating to say the least**.

But, Cursor is only the first step in the direction of *complete AI-driven development*. Using Cursor is unbelievable, and my first time using it was the moment I realized that there will be no going back in development once AI has fully taken over. The days of hard-coding functions are nonexistent and won’t be by the time I am applying for software engineering jobs.

![Image](image-placeholder-claudecodeimage.png)


Other tools like **Claude Code** take away the Environment entirely and rely on written language to build full applications at blazing speeds with wild accuracy. These tools are unbelievable, but have they gotten good enough so that truly **anybody can code and develop?**

## Why CS Will Still Exist ☄️🧨


As much as all of those **TikToks and Reels** will tell you that becoming a software engineer is “*useless*” now that anybody can build a todo app or Spotify Clone using tools like **Base44**, it’s far from the truth. There is still an unbelievable amount of skill and oversight involved with making these tools as productive as possible when building applications. It’s common (and unsurprising) that relying on AI tools can get developers into **Tech Debt**, where the programmer slowly loses their control of the codebase as less and less code makes sense to them. This can drive developers insane and leads many to spend more time fixing bugs AI created than actually solving the problem itself. So rest assured that

> A CS Degree 🎓 is *still valuable* and provides the best opportunity to build **alongside** these tools ⚒️


# How to Optimize 🤔💭


So the next question is:

> How can you avoid **Tech Debt** 🥸 and build like a ***Developer of the Future***? 🤓


While I don’t know the answer to that question (and probably nobody fully does 😳), here are some insights I’ve gathered from talks with professionals as well as my own use of some of these tools!

## 1. Software Engineer👷 Vs. Software Architect 🗺️


One of the first realizations I had when coding this year with all these tools is that, despite my best efforts to hold onto the past of hand-coding every function, *it is simply not where the future is headed*.

What I mean is that the days of looking over every last detail and **writing** **every** **single line in a codebase won’t exist**. AI is too *fast*, too *smart*, and too *far along* that writing every line will *inevitably* make you slower and less agile in the future.

> As a **Student, especially**, I want to *Develop Skills* that will be future-proof and allow me to flourish with new technologies, not get stuck in the past 🚗💨


So what will enable me to do that? It’s a complete **change in thinking** and **understanding**. AI has taken the load off of the **Engineers** to now spend more time thinking about the *overall structure* than the tiny details within a function. Instead of being another engineer, you are now orchestrating a conglomerate of AI Agents to execute. It is a new phase of liberation that allows the engineer to spend more time planning and blueprinting then fixing another TypeScript Error. A great example of development moving in this direction is **Google’s new AI IDE, Antigravity**, which hinges on the future of coordinating agents ([https://antigravity.google/](https://antigravity.google/)). I plan on trying this tool out more this week, but for now it’s presence alone shows a shift in development stradegies.

![Image](image-placeholder-antigravity.png)


It is now my job as the Developer to **explain the vision**, **build concrete guidelines**, and **illustrate my thought process** in collaboration with these Agents. To improve my thought processes and planning, I have been spending my time reading up on Architecture to become more well-versed in a higher-level understanding of System Design to best inform my AI Agents on how to execute certain ideas.

> 📚 To develop this skill, I’ve been reading this **fantastic book** called “*Fundamentals of Software Architecture*” by Mark Richards and Neal Ford. I would Highly Suggest checking it out 👍


> If you want more information about **Engineering versus Architecture**, also check out this article “*Agile is Out, Architecture is Back*“ by Craig Adam on Medium ([https://medium.com/@craig_32726/agile-is-out-architecture-is-back-7586910ab810](https://medium.com/@craig_32726/agile-is-out-architecture-is-back-7586910ab810))


## 2. Foundations Hold the House Up 🏡


While all of these tools are fantastic and can get you far in a project, you won't be capable of coding and developing **without the assistance of AI **if all you do is *rely on them*.

> To be a great Software Architect, you need to be **capable** of becoming a good Software Engineer. 👌


I always want to be prepared for situations such as:

1. **The AI Service is down?**
1. **The AI can’t solve this problem / Is confused?**
1. **You ran out of context space or money?**
If any of these occur, you don’t want to be the developer who stops working. The development of tomorrow is enabled through building a *Strong Foundation* in the fundamentals before starting projects. If you are trying to build software in **Next.js** and don’t understand the benefits of Server Side Rendering (also known as Dynamic Rendering), then maybe it's good to review the documentation and come back with an understanding of what is going on before diving headfirst into uncharted territory.

> 🤖 AI has enabled us not to know the nitty-gritty details of every function, call, and API, but **AI loses its value and won’t be useful if you don’t have the fundamentals down on what you’re building on**


It is **SO SO IMPORTANT TO KNOW WHAT YOU ARE DOING**. I can’t stress enough how many times I’ve started huge projects without knowing anything that is going on, hoping AI can get me through it. It fails every. single. time. Just put in the up-front work of learning the software, and it will help beyond belief!

## 3. The Best Environment is Your Environment 🌎


If I’ve learned anything from using AI tools, it's that **there is no “Right Answer.”** More AI tools are being built every day with brand new features, capabilities, and options that haven’t been explored before. But what I’ve found matters more than anything is creating an environment you can get the most out of.

> It will no longer matter which AI is the smartest 🧠 or the best 🥇, what matters is **which AI you find yourself working best with.** 


While it sounds weird to start considering AI to be your little engineers, it's true! Your ability to communicate ideas to your software and execute will make a tremendous difference in how you develop. For me personally, I have taken full advantage of the customization of **LazyVim** and found a strategy that makes development alongside AI as much fun as possible.

### My Current Set Up 🤓✌️


1. Environment: **LazyVim**
1. Agent Within Environment: **Avante (**[https://github.com/yetone/avante.nvim](https://github.com/yetone/avante.nvim)**)**
1. CLI Agent and Sub-Agents: **Opencode (**[https://opencode.ai/](https://opencode.ai/)**)**
1. Favorite AI Model: **Claude Sonnet 4.5** and **GPT 5 Codex**
What I love about each of these tools is that they are customizable and allow me to build in **Guidelines and Structure** to their responses. While I am hardcoding less, I am spending more time building out the agent guidelines and developing strategies to fix bugs or issues while driving the project forward. 

> Remember, **YOU** are the *brain of the project*, don’t rely on AI to come up with every solution to every bug for you. Most likely, it’ll be less efficient or wrong by offloading this work. Spend the time to understand the issue, and present your agents with ideas and a solution to execute. 


I have done this through **Opencode’s** [AGENTS.md](http://agents.md/) file as well as Avante’s system prompting and key binds for faster movements. This has enabled me to build the way I want to build while still having control over the future of the project. 

# Conclusion 🎬 


The developer space is **unpredictable, volatile, and scary for Students and New Grads alike.** But, I strongly believe that learning for the future and constantly surveying the developer environment will lead to success in the near future.

> All anybody can do in today’s age is **Guess.** You just have to hope that you *Guess Right* ✅


f you’re a current CS Student, I would **highly encourage you** to reach out to professionals in the field, read as much as you can, and absorb like a sponge. Talk to anybody who is currently in the position you want to be in and ask them what it's changing, what they need to know, and how to adapt. Pick up as many hints as possible to st\`eer your ship in the right direction 🚀.

# See you Next Time! 👋


I hope to bring some more updates on my personal project too, but for now, if you enjoyed reading at all or have any questions, my email is always open 😉

Contact:

luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "2b0f7879-ec1d-80f7-a9cb-d2e331216b26";
    const tags = [{"name":"Personal","color":"purple"},{"name":"AI","color":"pink"},{"name":"Tech","color":"green"}];
    
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
                      <BreadcrumbLink>{"From Engineer to Architect: How ADE’s are Changing Development 🚀 "}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"From Engineer to Architect: How ADE’s are Changing Development 🚀 "}</h1>
                <time className="text-gray-500 text-base sm:text-lg">11/19/2025</time>
                
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