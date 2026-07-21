"use client";

import React from "react";
import { lukesFont, crimsonText } from "@/app/fonts";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { ModernAppSidebar } from "@/components/modern-app-sidebar";
import { motion, MotionConfig } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function Page() {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const prevBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  // Sync embla's callback ref to our local ref
  React.useEffect(() => {
    if (typeof emblaRef === "function" && viewportRef.current)
      emblaRef(viewportRef.current);
  }, [emblaRef]);

  // Next/Prev handlers (desktop Embla only)
  const handleNext = (ev?: React.SyntheticEvent) => {
    ev?.stopPropagation();
    if (!emblaApi) return;
    try {
      emblaApi.scrollNext();
    } catch (err) {
      console.log("[Carousel Action] next error", err);
    }
  };

  const handlePrev = (ev?: React.SyntheticEvent) => {
    ev?.stopPropagation();
    if (!emblaApi) return;
    try {
      emblaApi.scrollPrev();
    } catch (err) {
      console.log("[Carousel Action] prev error", err);
    }
  };

  return (
    <ModernAppSidebar currentPath="/dashboard">
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen p-4 md:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 rounded-xl bg-muted/50 relative"
          >
            <Image
              src="/images/hawaii.jpg"
              alt="Hawaii"
              width={1920}
              height={1080}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              className="w-full h-[40vh] sm:h-[50vh] md:h-[75vh] object-cover rounded-xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`absolute bottom-6 sm:bottom-8 md:bottom-1/4 left-4 right-4 md:left-12 md:right-auto text-white font-bold max-w-full md:max-w-[50%] text-3xl sm:text-3xl md:text-6xl drop-shadow-lg ${lukesFont.className}`}
            >
              I am Luke Brevoort, I like to build stuff
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-6 md:mt-8 text-center leading-[1.5]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div
              className={`${crimsonText.className} font-bold text-2xl sm:text-3xl md:text-4xl`}
            >
              Welcome to my Website!
            </div>
            <div
              className={`${crimsonText.className} max-w-full md:max-w-[60%] mx-auto text-sm sm:text-base md:text-xl lg:text-2xl px-2 md:px-0 mt-2`}
            >
              I am a current CS Student at Stevens Institute of Technology and
              aspiring Software Engineer passionate about building Full-Stack
              applications, engineering personal solutions, and exploring the
              cutting-edge of technology :)
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-row items-center justify-center my-6 md:my-8"
          >
            <h3
              className={`${lukesFont.className} ml-4 md:ml-14 text-2xl md:text-4xl`}
            >
              Enjoy your Stay!
            </h3>
            <Image
              src="/images/Explode.png"
              alt="Explosion"
              width={64}
              height={64}
              sizes="64px"
              className="relative -top-2 md:-top-4 -left-2 md:-left-4 w-10 h-10 md:w-16 md:h-16"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="grid auto-rows-min gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50">
                <Image
                  src="/images/nycSunset.jpg"
                  alt="NYC Sunset"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="aspect-video rounded-xl bg-muted/50">
                <Image
                  src="/images/jellyfish.jpg"
                  alt="Jellyfish"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="aspect-video rounded-xl bg-muted/50">
                <Image
                  src="/images/sunset.jpg"
                  alt="Sunset"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="grid auto-rows-min gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50">
                <Image
                  src="/images/train.jpg"
                  alt="NYC Sunset"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="aspect-video rounded-xl bg-muted/50">
                <Image
                  src="/images/tower.jpg"
                  alt="Tower"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="aspect-video rounded-xl bg-muted/50">
                <Image
                  src="/images/theBoys.jpg"
                  alt="The Boys"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 md:mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h2
              className={`${crimsonText.className} text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center`}
            >
              Featured Projects
            </h2>

            <div className="relative">
              {/* Desktop: Embla carousel (md+) */}
              <div className="hidden md:block">
                <div className="embla overflow-hidden">
                  <div
                    className="embla__viewport"
                    ref={(node) => {
                      viewportRef.current = node;
                      if (typeof emblaRef === "function") emblaRef(node);
                    }}
                    style={{ touchAction: "pan-y" }}
                  >
                    <div className="embla__container flex gap-6 px-4">
                      {projects.slice(0, 5).map((project) => (
                        <div
                          key={project.id}
                          className="embla__slide flex-[0_0_80%] sm:flex-[0_0_70%] md:flex-[0_0_400px]"
                        >
                          <ProjectCard {...project} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  aria-label="Previous project"
                  type="button"
                  ref={prevBtnRef}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-colors z-[9999] pointer-events-auto"
                  onClick={(e) => handlePrev(e)}
                  style={{ touchAction: "manipulation", pointerEvents: "auto" }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  aria-label="Next slide"
                  type="button"
                  ref={nextBtnRef}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors z-[9999] pointer-events-auto"
                  onClick={(e) => handleNext(e)}
                  style={{ touchAction: "manipulation", pointerEvents: "auto" }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile: native horizontal scroller (sm) */}
              <div className="md:hidden">
                <div className="overflow-x-auto touch-pan-x -mx-4 px-4 scrollbar-hide">
                  <div className="flex gap-3">
                    {projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className="min-w-[75vw] sm:min-w-[60vw]"
                      >
                        <ProjectCard {...project} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </MotionConfig>
    </ModernAppSidebar>
  );
}
