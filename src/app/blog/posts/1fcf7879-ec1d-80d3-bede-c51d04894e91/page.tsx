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
  
  // Define a component that uses remark-gfm properly
  const MarkdownWithPlugins = ({ content, imageMap, postId, loadedImages }: { 
    content: string; 
    imageMap: Record<string, string>; 
    postId: string;
    loadedImages: boolean;
  }) => {
    const [RemarkGfm, setRemarkGfm] = useState<any>(null);
    
    useEffect(() => {
      // Import remark-gfm dynamically and set it to state
      import('remark-gfm').then(mod => {
        setRemarkGfm(mod.default);
      });
    }, []);
    
    return (
      <ReactMarkdown 
        key={loadedImages ? 'loaded' : 'loading'}
        remarkPlugins={RemarkGfm ? [RemarkGfm] : []}
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
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 sm:my-8">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="p-2 text-left font-semibold border-b border-gray-200 dark:border-gray-700" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-2 border-b border-gray-200 dark:border-gray-700" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };
  
  export default function BlogPost() {
    // Store processed markdown in state
    const [content, setContent] = useState(`# Welcome Back 👋


After a long and grueling finals season full of essays, exams, and final projects, I can finally say I have completed my first year of college! 🎉

![Image](image-placeholder-publicnyclibrary.jpg)


# The Recap ⏱️


Going into final exam season, I had five major assignments/exams to address: 

1. **CS 135 Final: Discrete Structures** - Wednesday, May 7th
1. **HASS 105 Final Essay: English**- Sunday, May 11th
1. **PEP 112 Final: Electricity and Magnetism**- Tuesday, May 13th
1. **MA 126 Final: Multivariable Calculus**- Wednesday, May 14th
1. **CS 284 Final: Data Structures**- Friday, May 16th
While all these numbers and letters may not mean a lot for most people, over the next three weeks, it was all I was focused on (when I wasn’t distracted of course 😅). Let’s start from the beginning about one weeks before my first final exam. 

## My Studying Ideology 💡


> As an Athlete, I always liked to see exams like the** Championship Game**. You never know what can happen under pressure, but all you can focus on is your pre-game preparation and instincts to come out **victorious 🥳**.  


For me personally, I found that three factors go into a successful Championship game preparation:

### Mental Headspace 📚🌄


- This is the most obvious one out of the three, but for a winning game day, you have to sit down and get the reps in for things to stick. This means tons of practice problems, lecture note reviews, creating study guides, and taking practice tests. But most important of all, **Spending** **Time** ⌛️ 
- **Time is a finite resource** that can catch students by surprise. Three weeks turns to one week and one week turns into one day *faster then you think*. I personally find scheduling out time in my calendar as a key 🔑 to success in preparing for these exams. I used **FlowState** to do this automatically, estimating time needed based off of a study guide I provided and planning study sessions (I couldn’t go a blog without mentioning my personal project just a little 😉). 
![Image](image-placeholder-finalstudyingschedule.png)



- Outside of getting the reps in, there is a lot to be said about mentally feeling stable during exam studying. Its very easy to get stressed and overwhelmed when trying to remember exactly what the professor said the keys to understanding Induced Current was due to a magnetic field (I was stuck here for a while). Sometimes its good to move around, go outside, and have some fun during studying. These breaks for me were a **necessity when it came to long term success on these exams!**
### Physical Preparation 🧘‍♂️🍽️


- Just like before an actual game day, you have to make sure you body is feeling **Great 👍**. This actually has a much larger effect on exams then most people take into account. You have no idea how hard it is to concentrate when you are dehydrated or hungry before a three hour long exam (Speaking from personal experience 😰). 
- I usually emphasized getting the three fundamentals in while studying: 
    - Three meals a day 🥪 
    - A gallon of water 💧
    - Going to the gym or doing something active 🏃‍♂️

- With these three, I always feel at my best before going into a long study session or final exam!
### Attitude and Confidence ✌️😡


- The most overlooked and under-appreciated aspect of preparing for a Championship game is the Attitude and Confidence you have going in. If you’re nervous or anxious, that can be normal! But I try my best to lean on this quote, I tell myself before every exam:
> “**Confidence comes from preparation” - Kobe Bryant**


![Image](image-placeholder-kobedunk.jpg)


- All the hours and time have led to this final game, have faith that your effort and diligence will pull through and prepare you the best you can
## The Unpredictability 🎱


Like in the Championship game, **you never know what could happen**. There is a lot of unpredictability and uncertainty going into a high-stress situation that leads to chaos. Maybe the teacher put something you’ve never seen before, or a problem you can’t even imagine where to start. This is all normal, and if you prepared correctly, other students are likely feeling the *same way*. It is all about rolling with the punches and doing what you are capable of. 

Now it’s time for the best two words in sports:

# Game 7


## The Finals Results 🎉


Here were my final stats of Game 7 for my Second Semester of College:


| Class | Hours Studied | Expected Grade (Pre-Exam) | Expected Grade (Post-Exam) | Final Exam Grade |
| --- | --- | --- | --- | --- |
| CS 135 | ~20 Hours | 89% | 93% | 97% |
| HASS 105 | ~5 Hours | 97% | N/A | 95% |
| PEP 112 | ~12 Hours | 82% | 78% | 88.8% |
| MA 126 | ~6 Hours | 85% | 94% | 80.8% |
| CS 284 | ~17 Hours | 90% | 97% | 87% |
| Time Spent on FlowState instead of Studying | ~20+ Hours | I shouldn’t have been doing this | But I got really distracted by Docker Deployments | Finally got it fixed though! |


## The Highs and the Lows 📈📉


Overall, no exam went horribly, and for some exams, I **greatly exceeded expectations,** such as **CS 135 and PEP 112,** which were my two most difficult subjects this year. Going in, I put a heavy emphasis on these two classes and committed more time to them than any other, so it felt great (especially for 135) to understand these subjects and perform under pressure.

For my other exams both **HASS 105 and MA 126 weren't really that bad in hindsight**. While I was much more confident in my abilities for MA 126, I only needed a 74% to get a A in the class, so there wasn’t a lot of pressure and I’m glad I got what I needed.

The low point of my finals was **CS 284, which I needed an 88% to get an A** in instead of an A- (*Which may sound like a small difference, but I really wanted that A!*). Leaving the exam room, I felt like I dominated that test 💪. With each Heap and AVL Tree, I was unbelievably confident that I was getting an A. This one dreaded *Canvas Notification* definitely broke my heart a bit 💔 especially since for that class I won’t be seeing my exam paper ever again and won’t even know what I did wrong.

![Image](image-placeholder-mochaLukeTrip.jpg)


- Fantastic end of year trip to Asbury Part with some friend and a fire Mocha to go along with it!
# End of First Year


Wild to think that it's already been 1/4 of my college life completed! I was very happy about how my exams went this time around and am looking forward to a long, LONG summer break 😎! Over this break, I hope to continue working on **FlowState** ✌️ to be ready for some testing next semester and begin the **LeetCode Grind** 👾! But if you enjoyed reading at all or have any questions, my email is always open 😉

### Contact:


Email: luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "1fcf7879-ec1d-80d3-bede-c51d04894e91";
    const tags = [{"name":"Personal","color":"purple"},{"name":"School","color":"orange"},{"name":"Life","color":"yellow"}];
    
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
                      <BreadcrumbLink>{"Finally Summer ☀️😎"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"Finally Summer ☀️😎"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">5/23/2025</time>
                
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
                <div className={`prose dark:prose-invert max-w-none prose-base sm:prose-lg md:prose-lg lg:prose-xl ${crimsonText.className} prose-headings:mb-3 prose-p:mb-3 sm:prose-p:mb-4 prose-p:leading-relaxed prose-li:my-1 sm:prose-li:my-2 overflow-hidden prose-pre:overflow-x-auto prose-table:my-4 prose-thead:border-b prose-tr:border-b prose-tr:border-gray-200 dark:prose-tr:border-gray-700`}>
                  <MarkdownWithPlugins 
                    content={content} 
                    imageMap={imageMap} 
                    postId={postId}
                    loadedImages={loadedImages}
                  />
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