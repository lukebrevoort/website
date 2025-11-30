"use client"

import { lukesFont, crimsonText } from "@/app/fonts"
import ProjectCard from "@/components/ProjectCard"
import { projects } from "@/data/projects"

import { ModernAppSidebar } from "@/components/modern-app-sidebar"

import { motion, MotionConfig } from "framer-motion"

import useEmblaCarousel from 'embla-carousel-react'

import Image from 'next/image'




export default function Page() {
  const [emblaRef, emblaApi] = useEmblaCarousel()

  return (
    <ModernAppSidebar currentPath="/dashboard">
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen p-8">
        <motion.div
          initial={{ opacity: 1 }}
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
            className="w-full h-[75vh] object-cover rounded-xl" 
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`absolute bottom-1/2 left-1/3 text-white font-bold max-w-[50%] text-3xl md:text-5xl ${lukesFont.className}`}>
            I am Luke Brevoort, I like to build stuff
          </motion.div>
        </motion.div>
        <motion.div 
          className="text-3xl font-bold mt-8 text-center leading-[1.5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          >
          <h1 className={`${crimsonText.className} text-xl md:text-3xl`}>Welcome to my Website!</h1>
          <h3 className={`${crimsonText.className} max-w-[90%] md:max-w-[50%] mx-auto text-base md:text-xl`}>I host my personal projects, photos, and other stuff I find cool on here!</h3>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-row items-center justify-center my-8"
        >
          <h3 className={`${lukesFont.className} ml-14 text-4xl`}>Enjoy your Stay!</h3>
          <Image 
            src="/images/Explode.png" 
            alt="Explosion" 
            width={64}
            height={64}
            sizes="64px"
            className="relative -top-4 -left-4"
          />
        </motion.div>
        <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        >
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
              alt="Jellyfish"
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="aspect-video rounded-xl bg-muted/50">
            <Image
              src="/images/theBoys.jpg"
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
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
            <h2 className={`${crimsonText.className} text-3xl font-bold mb-8 text-center`}>
            Featured Projects
            </h2>
            <div className="relative">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex gap-6">
              {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="embla__slide flex-[0_0_300px] md:flex-[0_0_400px]">
                <ProjectCard {...project} />
              </div>
              ))}
              </div>
            </div>
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
              onClick={() => emblaApi?.scrollNext()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>
        </motion.div>

        </div>
      </MotionConfig>
    </ModernAppSidebar>
  )
}
