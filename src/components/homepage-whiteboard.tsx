"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  FolderOpen,
  PencilLine,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import { projects } from "@/data/projects";
import { lukesFont, satoshi } from "@/app/fonts";
import ExcalidrawCanvas, { type CanvasSnapshot } from "./excalidraw-canvas";
import styles from "./homepage-whiteboard.module.css";

type AgentState = "loading" | "idle" | "thinking" | "active" | "error";

const featured = ["malcom", "orca-mail", "dispatch"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const prompts = [
  "Show me how Luke builds with agents",
  "I care about thoughtful product design",
  "What is Luke working on now?",
];

const noteColors = ["#fff3bf", "#d3f9d8", "#d0ebff"];

const wrapQuestion = (question: string, maxLineLength = 27) =>
  question.split(" ").reduce<string[]>((lines, word) => {
    const current = lines.at(-1);
    if (!current || `${current} ${word}`.length > maxLineLength) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
    return lines;
  }, []).map((line) => `${line}  `).join("\n");

const buildProjectResponse = (
  question: string,
  turn: number,
  isMobile: boolean,
): ExcalidrawElementSkeleton[] => {
  const prefix = `agent-${turn}-${Date.now()}`;
  const baseY = 140 + turn * (isMobile ? 720 : 330);
  const cardWidth = isMobile ? 300 : 270;
  const cardHeight = 175;
  const gap = isMobile ? 42 : 55;
  const startX = isMobile ? 70 : 110;
  const cards = featured.map((project, index) => ({
    id: `${prefix}-card-${index}`,
    type: "rectangle" as const,
    x: isMobile ? startX : startX + index * (cardWidth + gap),
    y: baseY + 78 + (isMobile ? index * (cardHeight + gap) : 0),
    width: cardWidth,
    height: cardHeight,
    strokeColor: project.primaryColor || "#20201d",
    backgroundColor: noteColors[index],
    fillStyle: "solid" as const,
    roughness: 1,
    roundness: { type: 3 as const },
    link: `/projects/${project.slug}`,
    label: {
      text: `${project.title}\n\n${project.description.slice(0, 118)}${project.description.length > 118 ? "…" : ""}`,
      fontSize: 17,
      fontFamily: 1 as const,
      textAlign: "left" as const,
      verticalAlign: "middle" as const,
    },
  }));

  const arrows: ExcalidrawElementSkeleton[] = cards.slice(0, -1).map((card, index) => ({
    id: `${prefix}-arrow-${index}`,
    type: "arrow",
    x: isMobile ? card.x + cardWidth / 2 : card.x + cardWidth + 8,
    y: isMobile ? card.y + cardHeight + 5 : card.y + cardHeight / 2,
    width: isMobile ? 0 : gap - 16,
    height: isMobile ? gap - 10 : 0,
    points: isMobile
      ? [[0, 0], [0, gap - 10]]
      : [[0, 0], [gap - 16, 0]],
    strokeColor: "#8a8175",
    strokeWidth: 2,
    roughness: 1,
    endArrowhead: "arrow",
  }));

  return [
    {
      id: `${prefix}-question`,
      type: "text",
      x: startX,
      y: baseY,
      text: `✦ “${isMobile ? wrapQuestion(question, 14) : question}”`,
      width: isMobile ? 430 : 900,
      height: isMobile ? 84 : 42,
      fontSize: isMobile ? 22 : 28,
      fontFamily: 1,
      strokeColor: "#e4573e",
      textAlign: "left",
    },
    ...cards,
    ...arrows,
  ];
};

export default function HomepageWhiteboard() {
  const [agentState, setAgentState] = useState<AgentState>("loading");
  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState("");
  const timers = useRef<number[]>([]);
  const canvasSnapshot = useRef<CanvasSnapshot | null>(null);
  const turn = useRef(0);

  const handleSnapshot = useCallback((snapshot: CanvasSnapshot) => {
    canvasSnapshot.current = snapshot;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setAgentState("idle"), 650);
    timers.current.push(timer);
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  const explore = (value: string) => {
    const nextQuestion = value.trim();
    if (!nextQuestion) return;

    timers.current.forEach(window.clearTimeout);
    setQuestion(nextQuestion);
    setPrompt("");

    if (!navigator.onLine) {
      setAgentState("error");
      return;
    }

    setAgentState("thinking");
    timers.current.push(
      window.setTimeout(async () => {
        const snapshot = canvasSnapshot.current;
        if (!snapshot) {
          setAgentState("error");
          return;
        }

        const isMobile = window.matchMedia("(max-width: 760px)").matches;
        await snapshot.insertElements(
          buildProjectResponse(nextQuestion, turn.current, isMobile),
        );
        turn.current += 1;
        setAgentState("active");
      }, 900),
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    explore(prompt);
  };

  return (
    <main className={`${styles.shell} ${satoshi.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={`${styles.signature} ${lukesFont.className}`}>
          luke.brev
        </Link>
        <div className={styles.presence} aria-label="Vision agent status">
          <span className={styles.presenceDot} /> vision agent
        </div>
      </header>

      <section className={styles.canvas} aria-label="Luke's project exploration canvas">
        <ExcalidrawCanvas onSnapshot={handleSnapshot} />

        {agentState === "loading" && (
          <div className={styles.loading} role="status">
            <span className={styles.agentGlyph}>✦</span>
            <span>unrolling the canvas…</span>
            <span className={styles.loadingLine} />
          </div>
        )}

        {(agentState === "idle" || agentState === "error") && turn.current === 0 && (
          <div className={styles.invitation}>
            <div className={`${styles.eyebrow} ${lukesFont.className}`}>
              <PencilLine size={17} /> start with a thought
            </div>
            <h1 className={lukesFont.className}>
              What do you want
              <br />
              <span>to explore?</span>
            </h1>
            <p>
              Describe what caught your curiosity. I’ll arrange a path through
              Luke’s work around it.
            </p>

            <form className={styles.promptForm} onSubmit={submit}>
              <label htmlFor="vision-prompt" className="sr-only">
                What would you like to explore?
              </label>
              <input
                id="vision-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="e.g. tools that make AI feel more human"
                autoComplete="off"
              />
              <button type="submit" disabled={!prompt.trim()} aria-label="Explore">
                <Send size={18} />
              </button>
            </form>

            {agentState === "error" && (
              <div className={styles.errorNote} role="alert">
                The agent lost the thread. Your canvas is still here—check your
                connection and try again.
              </div>
            )}

            <div className={styles.promptList} aria-label="Suggested starting points">
              {prompts.map((item) => (
                <button key={item} type="button" onClick={() => explore(item)}>
                  <span>↳</span> {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {agentState === "thinking" && (
          <div className={styles.thoughtWrap} role="status" aria-live="polite">
            <div className={styles.orb}><Sparkles size={22} /></div>
            <div className={styles.thoughtBubble}>
              <span>Following that thread…</span>
              <strong>“{question}”</strong>
              <i><b /> <b /> <b /></i>
            </div>
          </div>
        )}

        {(agentState === "active" ||
          ((agentState === "thinking" || agentState === "error") && turn.current > 0)) && (
          <form className={styles.followUpTray} onSubmit={submit}>
            <div>
              <span className={styles.agentGlyph}>✦</span>
              <label htmlFor="follow-up-prompt">
                {agentState === "thinking"
                  ? "adding to the board…"
                  : agentState === "error"
                    ? "connection lost — try again"
                    : "ask a follow-up"}
              </label>
            </div>
            <input
              id="follow-up-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="What should we explore next?"
              autoComplete="off"
              disabled={agentState === "thinking"}
            />
            <button
              type="submit"
              disabled={agentState === "thinking" || !prompt.trim()}
              aria-label="Add follow-up to canvas"
            >
              <Send size={17} />
            </button>
          </form>
        )}

        <aside className={styles.cornerNote} aria-hidden="true">
          <span>this space is yours</span>
          <span>draw, type, and move things around ↗</span>
        </aside>
      </section>

      <nav className={styles.dock} aria-label="Primary navigation">
        <Link href="/about"><UserRound size={18} /><span>About</span></Link>
        <Link href="/projects"><FolderOpen size={18} /><span>Projects</span></Link>
        <Link href="/blog/posts"><BookOpen size={18} /><span>Blog</span></Link>
      </nav>
    </main>
  );
}
