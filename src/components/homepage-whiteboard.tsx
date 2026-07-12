"use client";

import Link from "next/link";
import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  FolderOpen,
  Move,
  PencilLine,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { projects } from "@/data/projects";
import { lukesFont, satoshi } from "@/app/fonts";
import ExcalidrawCanvas from "./excalidraw-canvas";
import styles from "./homepage-whiteboard.module.css";

type AgentState = "loading" | "idle" | "thinking" | "results" | "error";
type Position = { x: number; y: number };

const featured = ["malcom", "orca-mail", "dispatch"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const prompts = [
  "Show me how Luke builds with agents",
  "I care about thoughtful product design",
  "What is Luke working on now?",
];

const initialPositions: Position[] = [
  { x: -330, y: 24 },
  { x: -20, y: 92 },
  { x: 300, y: 12 },
];

export default function HomepageWhiteboard() {
  const [agentState, setAgentState] = useState<AgentState>("loading");
  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState("");
  const [positions, setPositions] = useState(initialPositions);
  const timers = useRef<number[]>([]);

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
      window.setTimeout(() => setAgentState("results"), 1050),
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    explore(prompt);
  };

  const reset = () => {
    timers.current.forEach(window.clearTimeout);
    setQuestion("");
    setPrompt("");
    setPositions(initialPositions);
    setAgentState("idle");
  };

  const startDrag = (event: PointerEvent<HTMLElement>, index: number) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    const start = { x: event.clientX, y: event.clientY };
    const origin = positions[index];

    const move = (moveEvent: globalThis.PointerEvent) => {
      setPositions((current) =>
        current.map((position, positionIndex) =>
          positionIndex === index
            ? {
                x: origin.x + moveEvent.clientX - start.x,
                y: origin.y + moveEvent.clientY - start.y,
              }
            : position,
        ),
      );
    };

    const stop = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", stop);
      target.removeEventListener("pointercancel", stop);
    };

    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", stop);
    target.addEventListener("pointercancel", stop);
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
        <ExcalidrawCanvas />

        {agentState === "loading" && (
          <div className={styles.loading} role="status">
            <span className={styles.agentGlyph}>✦</span>
            <span>unrolling the canvas…</span>
            <span className={styles.loadingLine} />
          </div>
        )}

        {(agentState === "idle" || agentState === "error") && (
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

        {agentState === "results" && (
          <div className={styles.results} aria-live="polite">
            <div className={styles.resultHeading}>
              <span className={styles.agentGlyph}>✦</span>
              <div>
                <small>A path for your question</small>
                <h1 className={lukesFont.className}>“{question}”</h1>
              </div>
            </div>

            <div className={styles.projectField}>
              {featured.map((project, index) => (
                <article
                  key={project.id}
                  className={`${styles.projectNote} ${styles[`note${index + 1}`]}`}
                  style={{
                    "--x": `${positions[index].x}px`,
                    "--y": `${positions[index].y}px`,
                    "--project-color": project.primaryColor,
                  } as React.CSSProperties}
                >
                  <div
                    className={styles.dragHandle}
                    onPointerDown={(event) => startDrag(event, index)}
                    title="Drag this note"
                  >
                    <Move size={14} /> move
                  </div>
                  <span className={styles.noteNumber}>0{index + 1}</span>
                  <p>{index === 0 ? "start here" : index === 1 ? "then notice" : "keep going"}</p>
                  <h2>{project.title}</h2>
                  <div className={styles.noteDescription}>{project.description}</div>
                  <Link href={`/projects/${project.slug}`}>
                    Open project <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))}
              <svg className={styles.connectionLine} viewBox="0 0 900 260" aria-hidden="true">
                <path d="M130 65 C 278 7, 337 188, 466 137 S 696 20, 791 83" />
              </svg>
            </div>

            <button className={styles.resetButton} type="button" onClick={reset}>
              <RotateCcw size={15} /> start a new thread
            </button>
          </div>
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
