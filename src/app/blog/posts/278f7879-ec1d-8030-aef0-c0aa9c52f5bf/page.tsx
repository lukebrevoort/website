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
    const [content, setContent] = useState(`# Halftime 🏀


![Image](image-placeholder-centralpark.jpg)


As I exit the midterm season, A lot has been going on lately, so I thought it would be fair to write a small **Mid-Season Update** for the blog this week! From working on projects to studying for midterms and all that in between, I look forward to getting these thoughts out of my head and onto paper! Let’s first get our Agenda sorted away:

### Agenda 🗓️


1. Personal Updates ☕️
1. Project Changes! ✅
1. Midterm 📚
1. Thoughts on Recent Anthropic Paper ☠️
# Personal Updates ☕️ 


As many of those around me have likely seen/know of, I have become quite the **Coffee Aficionado!** Since getting that espresso machine, it has been a morning ritual for me to wake up and make a wonderful **Flat White or Mocha** to get my day started (Sometimes even both! 🫢). I thought it wouldn’t be an updated blog post if I didn’t give some insight into the type of beans I have tried, my futile attempt at latte art, and where I hope to continue my coffee ventures!

![Image](image-placeholder-hcoffeeheartlatteart.jpg)


As of right now, the beans I’m using are a *Medium-Dark Roast from Bwè,* a local shop from Hoboken! They are called the “*Courage*” blend, which I think is supposed to make me feel better about the price of coffee beans, which shocked me as a poor college student. 

As for my Latte Art, this is easily the best work I have put forward yet (Peep the Crocs 👀)! While watching one **James Hoffman **video gave me lots of confidence, I have yet to consistently like a good way to steam the milk for good foam, texture, and art. Maybe with a little more practice, I can get this down lol!

## Boston 🦞


![Image](image-placeholder-redtreebostonave.jpg)


I also visited my Girlfriend up in *Boston*! While the city doesn’t share the same allure that NYC does, the bus terminal is much, **MUCH** better for my Greyhound buses.

Overall, super fun trip with a lot of good food. I’ve always had a soft spot for the city and culture, but that might just be all the **Noah Kahan** I’ve been listening to shining through! If you have yet to listen to Noah Kahan during the Fall, I **HIGHLY SUGGEST IT**. Truly a wonderful experience, my personal favorite is his *Live From Fenway Park* record, which is unbelievable!

# Project Updates! ✅


FlowState has been making some huge progress lately! I wanted to highlight it here shortly since I’ve been working on it quite a lot these past few weeks!

> **Summary of Main Changes:** Notion OAuth Pipeline, Google OAuth Pipeline, Fully-Operational Scheduler Agent


A lot of the work I’ve been doing on FlowState isn’t the operational agents, but instead finishing out the OAuth Pipelines for users to create accounts and utilize the Agents. 

## Notion OAuth 😁


![Image](image-placeholder-datasourcesnotiontemplate.png)


While these three tasks did seem easy, Notion made a **HUGE CHANGE** to the way two Databases interact with one another by implementing **Data Sources**. Now, instead of having a *Courses Database* and a separate *Assignments Database*. I could have a single database with *Two Data Sources instead🎉!* This makes things way easier on my end since my template can be a simple one! You can see the example template above I have been testing with.

The difficult part of this was having to **refactor every single one of my hand-built Notion API tools**, which took quite a long amount of time to get right. But afterward, the results were quite rewarding!

## Scheduler Agent and Google OAuth 📆 🎉


While Notion changes were just mainly clerical and refactoring, the main task I wanted to get done this week was finally turning back on the **Scheduling Agent!** For a while, I have had to disable this agent until I finished creating a pipeline for Google Auth while deployed, since without this connection, Google was very stingy about having my personal information on something being deployed (and rightfully so 😅)!

But after a week of work, I finally got them to work in Unison! While I would usually provide a very useful image of this all working, unfortunately, AWS is down today! Meaning all my Build Deployments on Vercel are not working. It’s partially why I am writing this blog post today! Once both of these tools are working, I am so excited to take the next steps and create some really cool UI designs for the agent to display *Calendars, Assignments, Tasks, ect.* For now, you will just have to wait 🤫🥶

# Midterms 😱


As you might expect, with all this work going into projects, how did I distribute my time for studying for my midterms, and most importantly, how did I perform? Let me preface this by saying that **yes, school is very important to me and I do take a substantial amount of time to study**, but I’ve realized that life isn’t just grades, and the skills I learn through building projects and the jobs 🙏 I may get through applying can be even more valuable. So I put much less of a focus on my Exams this upcoming season.

![Image](image-placeholder-midtermgraph.png)


Now first to address some questions, 

1. *Why is Math a range?* 🤔
This is because *I don’t actually know my real score*… The professor only gave the exam back in the following class (Which I didn’t attend since I was sick) and is reluctant to post the grades on Canvas. What he did provide right after the exam, though, was an **Answer Key**. Based on the Answer Key and what I remember answering, my guess range on this exam would be between 85-95% depending on how harsh he is.

1. *What Happened in Algorithms?* 🥲
I think my biggest mistake I made on this exam was simply no spending enough time per question. This is likely correlated with the amount of study time, but I lost a *substantial amount* of points (13%) off of not reading the question entirely! 

For example, a problem asked for runtimes in **Increasing Order**, and I accidentally answered in **Decreasing Order**. That problem alone lost me a solid 7%! So, while I was upset to see this score come in, I know that I aced the core fundamentals on the exam, such as Runtime Analysis and Recurrence Relations.

# Anthropic Paper ☠️🤖


A few days ago, I came across a recent study conducted by researchers from Anthropic, the University of Oxford, the UK AI Security Institute, and the Alan Turing Institute. The study looked at trying to understand how malicious actors might influence LLMs through data poisoning, where attackers insert “*backdoors*,” specific phrases that trigger unintended behaviors in the model. They focused on a trigger phrase "*<SUDO>*" embedded in poisoned training documents. The researchers found that as small as 250-500 malicious documents can create backdoors effectively across models ranging from **600 Million to 13B parameters**, regardless of the model’s size or the volume of clean training data.

Their attack caused models to output nonsensical text when triggered, highlighting a serious and practical vulnerability. These poisoned documents represent only a minuscule fraction of the overall training data, yet their impact is significant.

([https://www.anthropic.com/research/small-samples-poison](https://www.anthropic.com/research/small-samples-poison))

![Image](image-placeholder-DOSattackAnthropic.png)


For me as a student, I think being aware of such vulnerability is super important to understanding the greater issues that AI might bring. In a generation where the velocity to continue iterating and updating AI is so fast, I think there is a lot of value in ensuring that these models are safe and not susceptible to malicious attacks. While this research is very exciting, it is also terrifying to understand that even these blog posts I write now, could have the potential to be malicious if someone were to train off of them. Just some food for thought really 🍎💭

# Until Next Time! 👋


I hope you enjoyed my little yap session in my blog this week and look forward to more in the future! I’m hoping to get a demo out for FlowState soon 🤞 and hear back from some internships at the hope of not being homeless!!! But if you enjoyed reading at all or have any questions my email is always open 😉 

### Contact:


Email: luke@brevoort.com
`);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const postId = "278f7879-ec1d-8030-aef0-c0aa9c52f5bf";
    const tags = [{"name":"Personal","color":"purple"},{"name":"Projects","color":"red"},{"name":"School","color":"orange"},{"name":"Life","color":"yellow"}];
    
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
                      <BreadcrumbLink>{"Mid-Season Update 🍂"}</BreadcrumbLink>
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
                <h1 className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}>{"Mid-Season Update 🍂"}</h1>
                <time className="text-gray-500 text-base sm:text-lg">10/20/2025</time>
                
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