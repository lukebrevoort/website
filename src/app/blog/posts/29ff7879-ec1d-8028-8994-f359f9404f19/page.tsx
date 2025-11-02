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
    const [content, setContent] = useState(`# Why Switch? 🤔💭 


![Image](image-placeholder-vscodevisual.png)


A little over two years ago, I started using VSCode, which is considered the world’s most popular IDE (Integrated Development Environment). I’ve always appreciated its vast array of extensions and its visually appealing, feature-rich interface. But since the beginning of this year, my feelings have changed. It now feels like the honeymoon phase has ended, and the underlying issues, such as its heavy resource use, clunky performance, and overall bloat, have started to outweigh the benefits I once saw in VSCode.

But as many others have done before searching for an alternative, there wasn’t really anything I could get behind that promised the same kind of coding environment as **VSCode**, without the fluff. 

> While I would love to say Neovim offered this perfect in between, **it absolutely did not**. But what it lacked in usability and overall appeal, it made up for in the promise of total customizability.


So after about a week of debating, I finally decided to give **Neovim** a real chance. How hard could it possibly be?

# Neovim and Vim Motions


One of the many reasons people are **intimidated to try Neovim** is because of how *you move* in Neovim. Programmers rave about the speed and velocity you can type, change and edit text using what is called **Vim Motions.** These motions are supposed to completely replace your mouse and enable your hands to never leave the keyboard.

![Image](image-placeholder-vimmotions.jpg)


> Quite frankly, its a lot to learn. I’m about **10 tutorials deep on advanced motions** and still trying to get used to it 😅


## The Benefits? 🤩


While lots of tech influencers will tell you that using **Neovim** will allow you to **“Escape the Matrix”**, that's not really the case. I saw Neovim as an opportunity to try another way programmers use their workflows. I saw **three primary benefits in using Neovim:**

1. The benefits of knowing Vim Motions can extend to any IDE, as even VSCode has extensions that allow you to use these hyper-quick motions and edit text as fast as you can think ***Kachow*** 🚗💨
1. Being able to customize **every aspect** of these key binds allows for the ultimate personalized experience when editing. From themes to specific motions, to workflows, it can all be made as long as I can think of it
1. **Simplicity of Neovim** is what really drew me in. At its core, it's just a text editor that allows it to run fast, limit battery usage, and keep everything running *super smooth*.
## Downsides 🫢


Now, while all of this sounds fantastic for Neovim, there are more than a few downsides to switching over as quickly as I did with limited experience in something like this.

1. Trying to go from an environment set up for you to building your own from scratch is a **gargantuan task.**
1. The learning curve is **STEEP**. Just getting used to moving around text in a certain way is a struggle and felt unbelievably slow early on; about as discouraging as it gets
1. While customizing is great, *knowing what or how to customize is a whole other issue*. Every plugin is built around this language, **Lua**, which is how you edit and write within your environment. **Learning an entire language** to make small adjustments could be **catastrophic**. Adding in one key bind wrong would brick the whole system!
# My Neovim Setup 🤖🤓


As someone trying to switch over quickly and still enjoying the IDE feel of VSCode, I found a **Neovim Distribution called Lazyvim**, think of it like a built-in template that adds all the modern plugins programmers use with Neovim. It’s considered an **opinionated form of Neovim**, while some might think this “isn’t true Neovim,” I think personally that Neovim is what you make of it :)

If you want to checkout Lazyvim here is the link: [https://www.lazyvim.org/](https://www.lazyvim.org/)

![Image](image-placeholder-Screenshot_2025-11-02_at_11.29.35_AM.png)


Since I am writing this in the morning, you can see I customized a nice Gruvbox Lightmode to enable during the day for light mode, and a nice Catppuccin Macchiato Theme for my dark mode. It’s clean, simple, and ready to go right out of the box with a ton of Plugins I find particularly useful!

# AI and Development ⚠️


### Now, something I was curious about moving over to Neovim is how it integrates AI?  


VSCode always made AI programming simple; you had **GitHub Copilot** with a whole plugin and interface that was easy to interact with and code alongside. While at times I thought it was quite intrusive when trying to program, it was very simple to use.

Neovim has its own GitHub Copilot Interface that is not quite as clean or easy to use. Basically, take out the entire UI and just leave you with a blank slate!

![Image](image-placeholder-githubcopilotnvim.png)


> Here is an example of me just asking a basic question about the repo I am in! 


It is super simple and much less intrusive, which I like, but it doesn’t feel quite as **powerful**. This is where I think the best part of using Neovim has been so far, and that is unlocking the capabilities of **Warp!**

# Using Warp & Neovim 💻⌨️


Warp, for those who don’t know, is considered an **Agentic Development Environment** (ADE) which hinges on merging a traditional terminal-like environment with active AI Agents that you can provide template prompts, rules, and guidelines for within a specific workspace or your entire environment. The best part about using Neovim and Warp is that Warp Agents can very easily interact within Neovim from within the program itself. They even have a feature where you can **edit with Vim Motions** when adjusting the code suggestions it writes!

> If you haven’t tried Warp yet, **I would highly suggest it!** I think the free tier is fairly generous, and it's a great tool to have!


Check it out here with my referral link :) [https://app.warp.dev/referral/6RPEXE](https://app.warp.dev/referral/6RPEXE)

# Conclusion 😌


Overall, my experience has been pretty great! I like the customizability; it feels very new and fresh. I like the process of learning how to fly through the editor super fast and make editing changes. For now, **I’ll probably continue using Lazyvim** and keep trying to see how I can further customize my experience!

> 💡 Do I think **Neovim is for everyone?** Absolutely not, but I do think giving it a try is well worth it :)


# See you Later! 👋


If you enjoyed reading at all or have any questions, my email is always open 😉 

### Contact:


Email: luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "29ff7879-ec1d-8028-8994-f359f9404f19";
    const tags = [{"name":"Personal","color":"purple"},{"name":"Tech","color":"green"}];
    
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
                      <BreadcrumbLink>{"What’s the Hype Around Neovim? 🤓"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"What’s the Hype Around Neovim? 🤓"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">11/2/2025</time>
                
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