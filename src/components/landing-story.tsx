"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Compass,
  Sparkles,
} from "lucide-react";
import { lukesFont } from "@/app/fonts";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import { ModernSidebar } from "@/components/modern-sidebar";
import styles from "./landing-story.module.css";

const chapters = [
  {
    composition: "experienceMytra",
    eyebrow: "01 / now at mytra",
    title: "I build systems that help warehouses keep moving.",
    copy: "I’m building Mytra Oracle, an agentic diagnostics platform that connects Splunk telemetry, PostgreSQL data, Kubernetes logs, and live warehouse data to investigate production issues.",
    detail: "Software Engineering Intern · Brisbane, CA · June 2026—Present",
    image: "/images/mytra-cover.jpg",
    alt: "Golden Gate Bridge emerging from fog over San Francisco Bay",
    position: "center 31%",
  },
  {
    composition: "experienceBlueprint",
    eyebrow: "02 / stevens blueprint",
    title: "Good data is a service to the people who need it.",
    copy: "As a Project Lead, I work with nonprofit partners from requirements through delivery. Recent work includes an HSDS Transformer that maps inconsistent health and human-services records into the Open Referral standard.",
    detail: "Project Lead · Hoboken, NJ · October 2025—Present",
    image: "/images/nycSunset.jpg",
    alt: "New York City at sunset seen from the Hoboken waterfront",
    position: "center 47%",
  },
  {
    composition: "experienceResearch",
    eyebrow: "03 / stevens nlp lab",
    title: "Research is where interfaces learn to listen.",
    copy: "At the Stevens NLP Lab, I was the only undergraduate on a multilingual news-analysis team, building a full-stack Next.js prototype and helping evaluate language models for equivalent phrases.",
    detail: "Research Intern · Hoboken, NJ · December 2024—August 2025",
    image: "/images/sunset.jpg",
    alt: "Sunlight reflecting across the ocean at sunset",
    position: "center 44%",
  },
  {
    composition: "selectedProject",
    eyebrow: "04 / selected work",
    title: "Long-running agent work needs a real home.",
    copy: "MALCOM is a personal execution control plane for durable coding-agent sessions: a stable CLI, session registry, recoverable workspaces, logs, and constrained adapters for GitHub, Notion, and Linear.",
    detail: "MALCOM · Python · CLI Design · Agent Orchestration",
    image: "/images/malcom-cover.jpg",
    alt: "Sunset reflecting across a quiet beach",
    position: "center",
    href: "/projects/malcom",
    linkLabel: "See the MALCOM project",
  },
];

export default function LandingStory() {
  const exploreRef = useRef<HTMLElement | null>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const pointerFrame = useRef(0);
  const [showNavigation, setShowNavigation] = useState(false);
  const [activeChapter, setActiveChapter] = useState(-1);

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

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("return") !== "work") {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      exploreRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", window.location.pathname);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const currentChapter = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!currentChapter) {
          return;
        }

        setActiveChapter(
          Number((currentChapter.target as HTMLElement).dataset.chapterIndex),
        );
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    chapterRefs.current.forEach((chapter) => {
      if (chapter) {
        observer.observe(chapter);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    const updateProgress = () => {
      animationFrame = 0;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      progressRef.current?.style.setProperty(
        "--scroll-progress",
        String(Math.min(1, Math.max(0, progress))),
      );
    };

    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const scene = event.currentTarget;
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    if (pointerFrame.current) {
      window.cancelAnimationFrame(pointerFrame.current);
    }

    pointerFrame.current = window.requestAnimationFrame(() => {
      scene.style.setProperty("--cursor-x", `${x * 100}%`);
      scene.style.setProperty("--cursor-y", `${y * 100}%`);
      scene.style.setProperty("--pointer-shift-x", `${(0.5 - x) * 16}px`);
      scene.style.setProperty("--pointer-shift-y", `${(0.5 - y) * 12}px`);
      pointerFrame.current = 0;
    });
  };

  const resetPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const scene = event.currentTarget;

    scene.style.setProperty("--cursor-x", "50%");
    scene.style.setProperty("--cursor-y", "50%");
    scene.style.setProperty("--pointer-shift-x", "0px");
    scene.style.setProperty("--pointer-shift-y", "0px");
  };

  return (
    <main
      className={`${styles.story} ${
        showNavigation ? styles.navigationPhase : ""
      }`}
    >
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

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span>scroll</span>
        <i>
          <b ref={progressRef} />
        </i>
      </div>

      <section
        className={styles.hero}
        aria-labelledby="landing-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
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
          <h1
            id="landing-title"
            className={`${styles.handwrittenTitle} ${lukesFont.className}`}
          >
            I am Luke Brevoort,
            <br />I like to build stuff
          </h1>
          <p className={styles.heroLead}>
            Software engineering, applied research, and personal tools for
            making complicated work more legible.
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
            className={`${styles.chapter} ${
              activeChapter === index ? styles.chapterActive : ""
            } ${styles[chapter.composition]}`}
            key={chapter.eyebrow}
            aria-labelledby={`chapter-${index}`}
            data-chapter-index={index}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            ref={(node) => {
              chapterRefs.current[index] = node;
            }}
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
              <h2
                id={`chapter-${index}`}
                className={`${styles.handwrittenTitle} ${lukesFont.className}`}
              >
                {chapter.title}
              </h2>
              <p>{chapter.copy}</p>
              <span className={styles.detail}>{chapter.detail}</span>
              {chapter.href && chapter.linkLabel && (
                <Link className={styles.chapterLink} href={chapter.href}>
                  {chapter.linkLabel}
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              )}
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
          <p className={styles.kicker}>05 / keep following the thread</p>
          <h2
            id="explore-title"
            className={`${styles.handwrittenTitle} ${lukesFont.className}`}
          >
            The work keeps going.
          </h2>
          <p>
            The resume is the outline. Projects, notes, and unfinished ideas
            make the systems tangible.
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
