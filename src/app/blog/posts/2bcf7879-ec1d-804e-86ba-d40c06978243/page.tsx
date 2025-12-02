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
    const [content, setContent] = useState(`# Welcome Back and Introducing: Ona!


![Image](image-placeholder-ADE_Follow_Up_Project_Image.png)


So, shortly after my last blog post about ADE environments, I tried this really cool tool called Ona after my dad suggested I give it a try :)

It’s an **all-in-one Agent development software** with a large emphasis on **consistent and deployable environments** for developers and agents to work within. It is all working within the browser, and I was super excited to give it a shot and try something completely new!

Now, to really get a feel for the product and what it brings to me as a developer, I usually need to build something with it. Which is why using Ona, I finished a Beta Version for a class project I’ve been working quite hard on! Read along about my MGT 103 groups project from scratch to working prototype using Ona!

# The Idea 💡


![Image](image-placeholder-mgt103cyclethingy.png)


In MGT 103 (Thinking Entrepreneurship), our group was tasked with finding a problem all of us have, and trying to think about building out products and ideas through an entrepreneurial point of view. The class, overall, has been great so far and eye-opening to say the least. The amount on emphasis on the customer and their needs was something I didn’t really expect when building a product. After doing a few customer interviews and thinking hard as a group, we landed on our Problem!

## The Problem 🤔


Our group landed on a problem all of us have in CS: **Dreaded Technical Interviews**. They are difficult, and while resources like *Leetcode* provide good problems to review and practice, how do you **learn to solve instead of memorize?** We identified a few key issues with the current way people practice for technical interviews:

### Emphasis on Getting it Right the First Time 🤖


Most people, including myself, think that if I don’t immediately know how to solve this problem, I am completely **cooked**. You have to already know the algorithm, know the route to a solution, and go ASAP to hopefully not run out of time. Instead, these interviews are focused on getting to know how you solve difficult problems. Understanding this nuance is an important step that might be the difference between passing and failing an interview. 

### Lack of Additional Support 🤒


While hints can be useful, they are mostly arbitrary or already known to some users on a platform like Leetcode when practicing. This differs greatly from an actual interview, where the interviewer will provide real-time and applicable hints based on what you’ve worked out. Why should practice tools be different?

### Learning to Speak and Code! 🗣️


One skill essential for succeeding in these interviews is all about being able to speak to your thought process professionally and efficiently. If you get the problem right, that can be great, but the interviewer is there to try and understand how you think. The ability to express your thoughts and ideas clearly isn’t practiced enough.

# Validation ✅


While my group thought this problem was very applicable to us, we as a group needed to understand if other people felt the same way and if this was all a problem worth solving. **It doesn’t help to have a solution and no problem for it to solve!**

![Image](image-placeholder-microeventblueprint.png)


Luckily, I was able to go to a really cool **Microsoft Workshop** and hear from Alumni *Gearad Boland* about his thoughts on the hiring process and advice for making it to the final offer. There was one quote from this event that really stuck out to me:

> 💡 ”I’ve hired just as many people who have gotten the technical interview question wrong as people who have gotten it correct.” - Gearard Boland


He went on to explain the importance of stepping through the problem and demonstrating you are an efficient problem solver. This holds much more weight than just being able to solve the problem (Even though that is also something you should try your best to do). This was the validation and information we needed to pursue this project as something worthwhile for our course.

# Development 🔨


Now that we have identified a problem, what should a solution look like? Here is the architecture I laid out before building (First draft of the prototype):

![Image](image-placeholder-whileunemployedphoto.png)


The idea was to have a basic frontend with a database of problems for the user to choose from and a simple authorization screening. The real magic was how the interview was assessed!

We would ask the user to record video and audio to simulate a real technical interview. Once the interview starts, the user would send transcriptions of them talking about the problems (Using Whisper) to an AI Agent Interviewer who will give directed hints based on the user's progress, as well as respond in real-time. The user would work through the problem with the Agent and be graded at the end based on how they responded, worked through the problem, and answered the problem (based on criteria I learned from the Microsoft Event).

# Building With Ona  🤝


Now that I’ve given some context on our project and what we hope it can do, let’s get into how I actually built the whole thing using Ona!

The primary benefits that I saw in using Ona was 

## Persistent Environment 🌍


Ona begins operating by creating a dev environment which is based on a self-described **devcontainer.json** file while allowing for consistent tooling, isolated Linux VM environments, and completely separating the overhead and headaches of “*it works on my local machine!*”

Here is an example configuration

\`\`\`javascript
	"name": "My Project",
	"image": "mcr.microsoft.com/devcontainers/base:ubuntu",
	"features": {
		"ghcr.io/devcontainers/features/node:1": {
			"version": "lts"
		}
	},
	"customizations": {
		"vscode": {
			"extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"],
			"settings": {
				"editor.formatOnSave": true
			}
		},
		"jetbrains": {
			"plugins": ["com.wix.eslint", "intellij.prettierJS"]
		}
	},
	"forwardPorts": [3000, 8080]
}
\`\`\`


## Collaboration with Agents 🤖


Another key benefit to using Ona was how seamless it was to move between communicating with the agent and writing code in the IDE. It was a really cool experience to be able to watch the Agent generate, and in real time, be working on another feature alongside it. Usually, something like this would be separated by two applications (Similar to how I currently use OpenCode and NeoVim), but Ona pulls this all into one experience. I was able to get this to work both through using their built-in VSCode and also using SSH to edit on my personal NeoVim configuration. This was outlined pretty heavily in their **Best Practices** guidelines, where they believed in the 90/10 rule:

> Use the agent to handle the bulk of the changes, letting it do the heavy lifting. Start by giving precise instructions and encourage questions from the agent. 


> Finish and refine your work using VS Code web for precise control. We have seen a lot of milage for using the diff view of VS Code web for doing an initial review of changes.


> Avoid trying to make small “micro-adjustments” through the agent - these are better handled directly.


Read more about best practices here: [https://ona.com/docs/ona/best-practices#one-environment-per-task](https://ona.com/docs/ona/best-practices#one-environment-per-task)

These agents also follow instructions super well by using an [AGENTS.md](http://agents.md/) file, which is becoming more standardized in these collaborative agent workers. I used this file to inform the agent of how I like to make changes and document changes in my codebase, and what specifically it should know about the project before it gets started on its task.

## Agents in Parallel 🚆🚆🚆


One of the coolest features I took advantage of was using these agents alongside each other. You could send multiple queries within a single environment for these agents to operate and work together on solving issues. One of the main use-cases I had for this was sending one Agent on a **Research Mission** to determine a fair and standardized way to judge an interviewee’s performance on a technical interview. The second agent would be responsible for **building the prompt** for this grading as well as fixing some of my state management to reflect these changes. The last agent I used for **making changes to what information the frontend** provides, such as the users' currently written code, the time left on the timer, and the users' transcriptions.

Using these three agents all working together, was super efficient and made sure that these changes made for a more accurate grading system were reflected across the entire codebase. As the agents went along, I would work to fix any small mistakes they would make along the way, which was either quite rare or because I wasn’t specific enough in my query.

## Try it Out! 🤩


If any of this was interesting to you, I would highly suggest trying out Ona, it’s a super cool tool that is looking towards the future of developing software alongside AI Agents.

[https://ona.com/](https://ona.com/?gad_campaignid=23002345166&gbraid=0AAAAAoaiUk5dw1VWs6cHATTOlQSyA004_)

Also want to give a huge thank you to **Johannes Landgraf** for giving me the free credits, super excited to keep building with Ona and using it for more projects in the future! (Definitely will be bringing it up in future blog posts as well!)

# while unemployed:


Now that I’ve gone through the thought process, the building, and the cool tools I used to put it together, I want to introduce our groups project **while unemployed!** 

![Image](image-placeholder-Screenshot_2025-12-02_at_10.39.18_AM.png)


while unemployed: is our approach to building **true problem-solving skills for technical interviews**. Built using NextJS and Typescript for the frontend, Supabase for the PostgreSQL Database and User Authentication, Python in the backend with [Socket.io](http://socket.io/) for quick communication, Whisper and ChatGPT 4o for transcription and Agent model, and LangChain for building the agent.

![Image](image-placeholder-workingwhileunemployed.png)


If you would like to try out our **Demo Version** you can sign up for it right here:
[https://while-unemployed.vercel.app/](https://while-unemployed.vercel.app/)

# See you Next Time! 👋


Our team would love some feedback on the project and what you think of the idea! So feel free to email me if you have any thoughts or suggestions! My email is always open 😉

Contact:

luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "2bcf7879-ec1d-804e-86ba-d40c06978243";
    const tags = [{"name":"Personal","color":"purple"},{"name":"AI","color":"pink"},{"name":"Tech","color":"green"},{"name":"School","color":"orange"}];
    
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
                      <BreadcrumbLink>{"ADE Follow up and New Personal Project 🎉"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"ADE Follow up and New Personal Project 🎉"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">12/2/2025</time>
                
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