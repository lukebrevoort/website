"use client";

import { lukesFont, satoshi } from "@/app/fonts";
import { ModernAppSidebar } from "@/components/modern-app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import { MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import SecureImage from "@/components/secure-image";
import Image from "next/image";
import { useState, useEffect } from "react";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: true });

export default function BlogPost() {
  // Store processed markdown in state
  const [content, setContent] = useState(`# New Beginnings  📅


![Image](image-placeholder-decemberjanuary2025.png)


I can’t think of a bigger two months for the industry shifting its perspective on AI than December and January of this past winter break. Granted, I haven’t followed the industry until recently, but this was truly a transformative two months for what would become an **Agent Avalanche.** So, how did we get here, what changed, and what was I doing while this was going on?

# How Did We Get Here? 📍🗺️


For as long as I could remember, over the last semester, the general thought on programming with AI was that it was:

> “A great tool, but also a very destructive tool that almost did more harm than good at times.”


> “Great for low signal, high noise tasks, but anything important, it would certainly screw up.”


> “If you let it [AI] autocomplete everything directly in your editor, you can literally feel competence draining out of your fingers.”


And for the most part, these takes were **correct**. If you let AI do everything, it would just mess up, or you would be at a place in the program where you had no idea what was going on. Even the best models would make mistakes or errors, maybe even the user wouldn’t specify, or get lazy and end up just having to spend more time debugging than actually solving. But then suddenly, everything just *clicked*…

# What Changed? 🤖💡


All at once it seemed like these models weren't just working better, they were absolutely *flying* through requests with **unbelievable** **accuracy.** Tools like Claude Code and Opencode through the CLI were the way people were taking advantage. 

These tools weren’t putting people into debt; **they were able to pull them out** and showed unbelievable promise. Every day during break, I would (regretfully) hop on **Twitter** (not calling it X) to see a new change, or update, or idea that someone came up with to optimize their workflow and enable them to build faster. Here are a few of my favorites :)

> 👉 [https://x.com/trq212/status/2005315275026260309](https://x.com/trq212/status/2005315275026260309)


> 👉 [https://x.com/rahulgs/status/2010734250203455862](https://x.com/rahulgs/status/2010734250203455862)


> 👉 [https://x.com/geoffreylitt/status/2014454144103539175](https://x.com/geoffreylitt/status/2014454144103539175)

Again **highly suggest** checking out some more of these videos and blogs, but seeing this every single day got me personally inspired to see what kind of Config I could build and what setup would be most efficient for me as a developer. I have been (unfortunately) brought back to Twitter (Not calling it X) because it is so cool to see passionate engineers build these unique workflows!

# What Was I Doing? 🤨


During this whole revolution, I decided I can’t be left out, and instantly started theorizing the best and most efficient setup for my own Opencode config. Opencode is just one of the tools I use, but if you’ve always wanted to try it, I highly suggest it :) ([https://opencode.ai/](https://opencode.ai/))



## **OpenCode Configuration**


I personally decided to build a **hybrid configuration** based on two other configurations that heavily inspired me in December. The idea was a configuration that combines the discipline of Superpowers with the parallel-agent capabilities of [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode). I wanted something that let me use multi-agent capabilities only when I felt a task needed them. Here is the basic overview of my config:

![Image](image-placeholder-openchangeflowmovingpmagentstuff.jpeg)


### Primary Agents


1. **Developer** - My bread and butter, focused model to pair code with and focus on single solutions
1. **Project Manager** - My parallel Agent who takes the best skills from Superpowers and puts them into this agent, focused on planning out multiple tasks in parallel and being efficient. I implemented a SQLlite configuration to track specific large-scale projects and break them down into tasks and a **Directed Acyclic Graph** to map out dependencies and hold context. 
    1. Planning to make a whole other blog post to go more into depth on this one, but that is for another time 😉

1. **Architect** - My Plan agent that I bounce ideas off of, provide my [PLAN.md](http://plan.md/) to for overview and additions, and walk through every idea with before starting development
### Subagents


1. **Oracle** - My strong debugging agent focused on finding the problem and coming up with a solution
1. **Performance** - Built for assessing performance and working on optimizations in the codebase
1. **Librarian** - A fast and efficient model for lookups and fast responses to questions about the codebase and beyond
1. **Researcher** - A designated subagent for researching any queries that need answers in the project
1. **Reviewer** - A critical review agent for assessing the codebase and is most often run before the agent finishes/ends to ensure a job well done
1. **Teacher** - Best for explaining any part of the codebase that doesn’t make sense, and also for giving key insights into certain design choices or decisions made
1. **UI/UX** - The go-to agent for redesigns, assessing the UI and UX across all platforms. A focus on asking the user for a specific design and never aiming for average
# Projects! 👀


So, with all of these developments, what was I working on in winter and burning through all of my **ChatGPT Plus and Copilot Pro Credits?** I had TWO main projects I decided to work on over the winter that I was super passionate about:

## Zen80 ✌️


![Image](image-placeholder-zen80logo.png)


> 🛠 The goal of this project was to get more adjusted to building my **first-ever mobile application **🎉 and automate a new studying and productivity method that I had been doing manually. 


### The “Why” 👷


After doing some reading of the book *Build: An Unorthodox Guide to Making Things Worth Making *by Tony Fadell, I realized that before working on a project like this, I need to really hone in on the **why** of the project. If there isn’t a good driving vision or purpose, then what are we building for?

My vision for Zen80 was to push people to focus on the day instead of the week, the month, the year. I noticed that when I was trying to be productive, it was all about the next week or planning everything out in advance. It was stressful and counterintuitive. This was until I heard about Steve Jobs 80-20 Principle:

> 🐑 He would designate 3-5 **critical signal tasks** to start the day, and try to spend *80%* of his working day on completing these absolutely critical tasks, and anything else would be considered *Noise* and not essential. 


I started using this idea during finals, using Obsidian and my Stopwatch app on my phone to track the total amount of time. It was unbelievably inefficient, but I loved the system, so I thought to myself,

> I should make this an app! 🤓☝️


### The Build


I used my agent network for the first time on this app, and it worked like **magic** 🪄! Using the Xcode Build MCP server, the agents were able to **build, run, edit, screenshot, and see changes in real time!** They could make adjustments and view bugs when needed. It felt like they really were working all together!

And while this was super cool, it was also sometimes unorganized, and the agents would lose sight of the vision or purpose of the context, which is why I wired up my Notion MCP and created a **Project Page.** 

> This page was a place for me to store bug reports, feature ideas, and context for the agent to pull from anytime! I hand-built a *pull-feature* and *pull-bug* command with a *pull-work* Skill to inform the agents about best practices and how to correctly pull all the context they need to work! I learned how to build skills by looking at this fantastic website from Vercel. I would highly suggest checking it out! [https://skills.sh/](https://skills.sh/)


### The Product (So Far 🤫)


![Image](image-placeholder-zenpercentscreenimage.jpg)


Right now, I am building and testing the app on Testflight, so if you want to keep up with the progress, here is the Repo: [https://github.com/lukebrevoort/Zen80](https://github.com/lukebrevoort/Zen80) ! Hoping to officially launch it for external testers soon, so stay posted for updates! 

## FlowState


![Image](image-placeholder-flowopenstatecodedesktop.png)


Now, I haven’t talked about FlowState in a while because I knew I had to pivot the project, but didn’t know in what direction. With MCPs becoming super prevalent, my entire backend API architecture became obsolete overnight, and I questioned the purpose of the program. This was until this winter, when I came up with the idea to supercharge my idea with MCPs and use **Opencode** as the router in the backend! 

> The idea was that most students aren’t CS students, they don’t understand CLI, and TUI is pretty scary for them. So instead, I wanted to build a more friendly desktop application that gives them an opinionated setup of Opencode made for students with a fresh coat of paint! The focus is on building the students’ perfect study schedule and attending to their needs.


This program integrates Gmail, Google Calendar, Canvas, Notion, and the ability to add **any MCP services you would like as well!** So you can stick to the standard setup or add something that is useful for you! 

![Image](image-placeholder-flowchatopencodestatethingy.png)


The project is still in early development, but made HUGE strides in a single month of developing and is a wonderful testing ground for what is possible with agentic development! 

# Conclusion


All in all, the space is moving SO SO FAST 🚗💨, but I think that is a good thing! As a student, I am doing everything possible to learn, adapt, and experiment with as many tools as possible, so if you know anything you think I can try or just want to chat, send me an email :) Happy Start of Semester!

### Contact


luke@brevoort.com
`);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const postId = "2edf7879-ec1d-807f-a268-f72c24695084";
  const tags = [
    { name: "Personal", color: "purple" },
    { name: "Projects", color: "red" },
    { name: "Life", color: "yellow" },
    { name: "AI", color: "pink" },
  ];

  // Detect color scheme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Function to preload images to blob storage
  const preloadImages = async (imageMap: Record<string, string>) => {
    if (!imageMap || Object.keys(imageMap).length === 0) return;

    console.log("Preloading images:", Object.keys(imageMap).length);

    // Create an array to hold all image loading promises
    const imagePromises = Object.values(imageMap).map((url) => {
      return new Promise<void>((resolve) => {
        if (!url || typeof url !== "string") {
          resolve();
          return;
        }

        // Skip if URL is not valid or still a placeholder
        if (url.startsWith("image-placeholder-")) {
          resolve();
          return;
        }

        // Use browser's Image constructor to preload
        if (typeof window !== "undefined") {
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
    console.log("All images preloaded");
  };

  // Combined effect for image mappings
  useEffect(() => {
    console.log("Setting up image mappings...");

    // Add direct hardcoded fallback mappings for specific placeholders
    const hardcodedMap: Record<string, string> = {};

    // Extract placeholders from content
    const placeholderRegex = /image-placeholder-[^)"\s]+/g;
    const placeholders = content.match(placeholderRegex) || [];
    console.log("Extracted placeholders:", placeholders);

    // Then fetch API mappings and merge them, preserving hardcoded mappings
    fetch(
      `/api/image-map?postId=${postId}&placeholders=${placeholders.join(",")}`,
    )
      .then((res) => {
        console.log("Image map API response status:", res.status);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch image map: ${res.status} ${res.statusText}`,
          );
        }
        return res.json();
      })
      .then(async (fetchedMap) => {
        console.log("API returned mappings:", fetchedMap);

        // Merge with priority to fetched mappings but keep hardcoded as fallback
        const combinedMap = { ...hardcodedMap, ...fetchedMap };
        console.log("Combined map:", combinedMap);
        setImageMap(combinedMap);
        setIsLoading(false);

        // Preload images after mapping is set
        await preloadImages(combinedMap);
        setLoadedImages(true);
      })
      .catch((err) => {
        console.error("Error fetching image map:", err);
        // Fall back to hardcoded mappings if fetch fails
        console.log("Falling back to hardcoded mappings");
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
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      green:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      yellow:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      orange:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      purple:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
      brown:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
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
                    <BreadcrumbLink>{"Agent Avalanche! 🌨️"}</BreadcrumbLink>
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
              <h1
                className={`${lukesFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3`}
              >
                {"Agent Avalanche! 🌨️"}
              </h1>
              <time className="text-gray-500 text-base sm:text-lg">
                1/30/2026
              </time>

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
              <div
                className={`prose dark:prose-invert max-w-none prose-base sm:prose-lg md:prose-lg lg:prose-xl ${satoshi.className} prose-headings:mb-3 prose-p:mb-3 sm:prose-p:mb-4 prose-p:leading-relaxed prose-li:my-1 sm:prose-li:my-2 overflow-hidden prose-pre:overflow-x-auto`}
              >
                <ReactMarkdown
                  key={loadedImages ? "loaded" : "loading"}
                  components={{
                    img: ({ node, ...props }) => {
                      const imageSrc: string =
                        typeof props.src === "string" ? props.src : "";
                      console.log("Rendering image in markdown:", imageSrc);
                      console.log("Available mappings:", Object.keys(imageMap));
                      console.log("Image mapped?", !!imageMap[imageSrc]);

                      // First check if we have a mapping
                      if (imageMap[imageSrc]) {
                        console.log(
                          `Using mapped image: ${imageMap[imageSrc]}`,
                        );
                        return (
                          <div className="my-6 sm:my-8 w-full">
                            <Image
                              src={imageMap[imageSrc]}
                              alt={props.alt || ""}
                              className="rounded-lg w-full shadow-md hover:shadow-lg transition-shadow"
                              width={0}
                              height={0}
                              sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 800px"
                              style={{
                                width: "100%",
                                height: "auto",
                                maxHeight: "70vh",
                                objectFit: "contain",
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
                            alt={props.alt || ""}
                            className="rounded-lg shadow-md hover:shadow-lg transition-shadow w-full h-auto max-h-[70vh] object-contain"
                            postId={postId}
                            imageMap={imageMap}
                          />
                        </div>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </motion.article>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </MotionConfig>
    </ModernAppSidebar>
  );
}
