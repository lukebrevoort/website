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
    const [content, setContent] = useState(`# FlowState Part Two! 🌊


Hello everyone reading! I hope you are all doing well. I just wanted to give a little update on my big personal project I mentioned in the last post **FlowState! I** have made some significant progress from designing the frontend in Figma, using [Builder.io](http://builder.io/) to move it over to a **NextJS** frontend for me to tweak, and then finally getting my **PostgreSQL Database** and **API** routes set up for local development! Here is how I did it:

[Video](image-placeholder-Large_Logo.mp4)


## Frontend Design 🎨


First and foremost, Hannah and I decided to redo the Logo! We went for something that would be a little sharper and would work well the frontend color scheme I wanted!

While I might not be the best artists, I try my best to make the frontend as **stylish** as possible. My design tool of choice for this was **Figma**, a fantastic and easy to use website design tool I’ve fiddled with in the past. Its very clean and made for developers in mind. After quickly skimming a 30 minute tutorial I felt ready for the artistic challenge 🖼️👨‍🎨

> If you would like to go to the direct page and go through each of my designs just click this [Link](https://www.figma.REDACTED_SECRET)!


## The Vision 👁️👄👁️


While the freakish emoji combo I found while writing this is slightly off-putting, the actual design philosophy was to focus on on a warm tone with some light greenery and colors to bring some life to the design. My though process was something welcoming with clean animations that draw the user in. I don’t know much about catchy website designs such as Hero Section and Call to Action buttons, but I plan on working more on those later. For now I just wanted something simple that could get the job done. 

## The Layout 🤩


![Image](image-placeholder-landingpageflow.png)


### Landing Page 🫨


- Links to both Login and Sign Up for users
- In the future, hoping to add more information about FlowState, its uses and what it is capable of. But that is later down the line
### Login Page and Sign Up Page 🚪


- When the user clicks on either of these buttons on the landing page they should direct them to either Sign Up or Login
- If the user already has an account, we will prompt them to instead Log In
- These pages are super simple with simplified designs focused on concise design principles
### Chat Page 💬


- The core of the design will be a simple chat box for the user to interact with FlowState
- This will have a simple send button, and the option in the future to add attachments
- Nothing too complicated, I really like Claude’s design so I took some inspiration off of that
### Mind Map Page 🧠


- This page is meant to be an alternative to the classic sidebar you see on most AI chat bots. Instead of storing past chats linearly in a sidebar, I thought it would be a creative and interesting idea to store previous chats in a mind map system where the user can go down their trains of thought and visually see their chats with FlowState
- This would utilize some Vector Database Visualization feature I would look into, but I wanted to get a basic idea as to my vision
- This would also have to include some sort of search function for users who might not want to closely scroll across every node just to find a super specific conversation  
> Personally I find that the simpler design, the more I can put into the animations and **care for everything that happens on screen**. So I am starting here before moving things forward!


# 🚨Moving to NextJS 🚨


I have chosen NextJS for this project mainly because of my familiarity with the Framework and its quality of life changes such as baked in Tailwind CSS and App Routing I was familiar with. The move from Figma to NextJS was much easier then i had initially thought because of the user of [Builder.io](http://builder.io/) which was a very accurate tool that got most of the details on the page that I wanted to get across. 

## Framer Motion 🫨


I wanted to really focus on the animations of this page and make things run as smooth as possible. While framer took a significant learning curve, I found its [tutorials](https://motion.dev/docs/react-animation) super helpful and easy to follow when implementing hovering animations and some spring like animations. This was really fun to play around with and probably took more time then it should lol. But I am quite happy with the result! (Example of some simple framer motion stuff below!)

\`\`\`javascript
<motion.a 
href="/Login"
whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)" }}
whileTap={{ scale: 0.95, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)"}}
transition={{ type: "spring", stiffness: 400, damping: 17 }}
className="text-white font-alegreya text-[24px] font-medium bg-flowstate-accent hover:bg-flowstate-accent-hover transition-colors duration-200 rounded-[40px] px-[30px] py-[6px] cursor-pointer inline-block text-center"
>
Log in
</motion.a>
\`\`\`


# Backend and API 👈🤠👉


This was easily the most tedious part of the project this past week for me trying to implement. I have always struggled to understand the connection between Frontend and Backend, as well as how to build the middle API layer to properly execute the functions. From a higher up level I had a basic understanding of HTTP Requests being POST’ed and GET as a way to communication between the server. But after watching a few useful videos on Full-Stack Applications and Tech Stacks (As well as lots of questions to Claude and Perplexity)! Here is my Full Tech Stack for this project:

![Image](image-placeholder-Tech_Stack_Cartoon_Apr_15_2025.png)


## **Frontend ❤️:**


- **Next.js 15.2.4**: A React framework for building web applications with features like server-side rendering, static site generation, and API routes
- **React 19**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience and code quality
- **Framer Motion**: Animation library for React
- **TailwindCSS 4**: Utility-first CSS framework for styling
- **Next.js App Router**: The newer routing system used in Next.js applications
## **Backend 💻:**


- **Flask**: Python web framework for the backend API
- **Flask-CORS**: Extension for handling Cross-Origin Resource Sharing
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) library
- **PostgreSQL**: Database (inferred from the psycopg2-binary dependency)
- **JWT**: JSON Web Tokens for authentication (via PyJWT)
## **AI/ML Components 🤖:**


- **LangChain**: Framework for building applications with language models
- **Anthropic**: AI model integration (Claude)
## **Third-party Integrations 3️⃣:**


- **Notion API**: For assignment and content management
- **Google Calendar API**: For scheduling and time management
## **Project Architecture 🧱:**


- Frontend and backend are separated into distinct directories
- RESTful API communication between frontend and backend
- Authentication system with protected routes
- AI agent system with specialized tools for different functions (scheduler, project management)
- Context providers in React for state management (e.g., AuthContext)
## Backend 🗼


My backend is still a big work in progress, but just today it has started working for my development! Correctly storing and saving user information and being able to log in users who have already signed up for the app! This uses a simple PostgreSQL database I set up to store the user information such as a unique ID, name, email, hash encrypted password, and their tokens for Notion and Google Calendar! I hope to talk a lot more about this in another update for now you’ll have to wait

# What’s Next? 🔮


This project has made fantastic progress, but there is still a lot to be done before I can properly begin some production testing! Here is my current To-Do List for this project and what I hope to accomplish!

1. Properly display and store Chat Information from Agents to Frontend
1. Display progress updates on Agents to Front end (Similar to Perplexity in a way as we move agent to agent)
1. Pull from the stored Vector Database to visually create a **Mind Map 🧠 **for the user to traverse
> These Three Goals will be my main focus over the next week (and school too I guess 🙄). I hope to get these done to properly begin testing the agents themselves and implementing it into my workflow fully! 


But if you enjoyed reading at all or have any questions, my email is always open!

## Contact:


luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "1d6f7879-ec1d-803d-90fd-ed6aa54e755b";
    const tags = [{"name":"Flowstate","color":"green"},{"name":"Personal","color":"purple"},{"name":"Projects","color":"red"},{"name":"Tech","color":"green"},{"name":"AI","color":"pink"}];
    
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
                      <BreadcrumbLink>{"FlowState Progress 🌊👋"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"FlowState Progress 🌊👋"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">4/15/2025</time>
                
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