"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Compass,
  Sparkles,
} from "lucide-react";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import { ModernSidebar } from "@/components/modern-sidebar";
import styles from "./landing-story.module.css";

const chapters = [
  {
    eyebrow: "01 / build with intent",
    title: "I make useful things from curious questions.",
    copy: "I’m Luke Brevoort — a computer science student, researcher, and product-minded engineer. I turn messy, human problems into software that feels clear enough to use every day.",
    detail: "Stevens Institute of Technology · B.S. Computer Science · 2028",
    image: "/images/greenSweater.jpg",
    alt: "Luke Brevoort sitting outside in a green sweater",
    position: "center",
  },
  {
    eyebrow: "02 / work in the real world",
    title: "The work has to survive outside the whiteboard.",
    copy: "At Mytra, I build AI solution software on the Interactivity team. With Blueprint, I lead nonprofit product engagements from the first ticket through delivery.",
    detail: "Software Engineering Intern · Project Lead",
    image: "/images/rainnyc.jpg",
    alt: "A rainy street scene in New York City",
    position: "center",
  },
  {
    eyebrow: "03 / learn in public",
    title: "Research gives the next idea somewhere to go.",
    copy: "My work in the Stevens NLP Lab keeps me close to the questions underneath the interface: language, models, and how people make sense of technical systems.",
    detail: "Research Assistant · AI, NLP, and product systems",
    image: "/images/hawaii.jpg",
    alt: "A mountain rising above a layer of clouds in Hawaii",
    position: "center",
  },
  {
    eyebrow: "04 / make space for people",
    title: "Good systems create more room for the humans using them.",
    copy: "From student government finance to personal tools, I care about reducing the overhead around important work so teams can spend their time on better decisions.",
    detail: "Student Government · Finance · Community",
    image: "/images/Skiing.jpg",
    alt: "Skiers and chairlifts on a snowy mountain",
    position: "center",
  },
];

export default function LandingStory() {
  const exploreRef = useRef<HTMLElement | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    const exploreSection = exploreRef.current;

    if (!exploreSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowNavigation(entry.isIntersecting),
      { threshold: 0.35 },
    );

    observer.observe(exploreSection);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.story}>
      <aside
        aria-hidden={!showNavigation}
        className={`${styles.desktopNavigation} ${
          showNavigation ? styles.navigationVisible : ""
        }`}
      >
        <ModernSidebar currentPath="/" />
      </aside>
      <div
        aria-hidden={!showNavigation}
        className={`${styles.mobileNavigation} ${
          showNavigation ? styles.navigationVisible : ""
        }`}
      >
        <FloatingBottomNav currentPath="/" />
      </div>

      <section className={styles.hero} aria-labelledby="landing-title">
        <Image
          src="/images/hawaii.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Luke Brevoort / personal work</p>
          <h1 id="landing-title">
            Building thoughtful systems
            <br />
            for people and ideas in motion.
          </h1>
          <p className={styles.heroLead}>
            Software, research, and experiments in making complicated things
            feel more human.
          </p>
          <a className={styles.scrollPrompt} href="#story">
            <span>Read the story</span>
            <ArrowDown aria-hidden="true" size={18} />
          </a>
        </div>
        <p className={styles.heroIndex} aria-hidden="true">
          01—05
        </p>
      </section>

      <div id="story" className={styles.chapterList}>
        {chapters.map((chapter, index) => (
          <section
            className={styles.chapter}
            key={chapter.eyebrow}
            aria-labelledby={`chapter-${index}`}
          >
            <Image
              src={chapter.image}
              alt={chapter.alt}
              fill
              sizes="100vw"
              className={styles.chapterImage}
              style={{ objectPosition: chapter.position }}
            />
            <div className={styles.chapterShade} />
            <div className={styles.chapterCopy}>
              <p className={styles.kicker}>{chapter.eyebrow}</p>
              <h2 id={`chapter-${index}`}>{chapter.title}</h2>
              <p>{chapter.copy}</p>
              <span className={styles.detail}>{chapter.detail}</span>
            </div>
            <p className={styles.chapterIndex} aria-hidden="true">
              0{index + 2}
            </p>
          </section>
        ))}
      </div>

      <section
        ref={exploreRef}
        className={styles.explore}
        aria-labelledby="explore-title"
      >
        <div className={styles.exploreGrid} aria-hidden="true" />
        <div className={styles.exploreContent}>
          <p className={styles.kicker}>05 / resume, still in progress</p>
          <h2 id="explore-title">There’s more to explore.</h2>
          <p>
            Projects, notes, and unfinished ideas live beyond this first
            impression. The navigation is back whenever you are ready to look
            around.
          </p>
          <div className={styles.actions}>
            <Link className={styles.exploreAction} href="/explore">
              <Sparkles aria-hidden="true" size={19} />
              Explore the canvas
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
            <Link className={styles.resumeAction} href="/about#experience">
              <BookOpen aria-hidden="true" size={18} />
              Read my resume
            </Link>
          </div>
          <div className={styles.directory}>
            <Link href="/about">
              <Compass aria-hidden="true" size={16} />
              About
            </Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog/posts">Writing</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
