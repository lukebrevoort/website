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

const starterPrompts = [
  { prompt: "Sketch how MALCOM works", note: "controller + sessions", tilt: "-1.4deg" },
  { prompt: "Show me the architecture of Dispatch", note: "agents + worktrees", tilt: ".8deg" },
  { prompt: "How does Orca Mail decide what matters?", note: "signal, not noise", tilt: "-0.5deg" },
  { prompt: "Explain FlowState visually", note: "context + action", tilt: "1.2deg" },
  { prompt: "What connects Luke's projects?", note: "follow the thread", tilt: "-.8deg" },
  { prompt: "Surprise me", note: "dealer's choice", tilt: ".5deg" },
] as const;

type ResponseNode = {
  title: string;
  body: string;
  color: string;
  paper: string;
  link: string;
};

type SampleResponse = {
  heading: string;
  aside: string;
  nodes: ResponseNode[];
};

const projectLink = (slug: string) => `/projects/${slug}`;

const sampleResponses: Record<string, SampleResponse> = {
  "Sketch how MALCOM works": {
    heading: "MALCOM keeps the work legible",
    aside: "more air-traffic control than robot brain",
    nodes: [
      { title: "Controller", body: "One stable CLI routes commands and keeps a registry of long-running work.", color: "#1d4ed8", paper: "#dbeafe", link: projectLink("malcom") },
      { title: "Policy boundary", body: "Approvals and workspace rules stay visible instead of hiding inside an agent.", color: "#b45309", paper: "#fef3c7", link: projectLink("malcom") },
      { title: "Sessions + adapters", body: "Codex, Cursor, GitHub, Notion, and Linear plug into inspectable sessions.", color: "#0f766e", paper: "#d1fae5", link: projectLink("malcom") },
    ],
  },
  "Show me the architecture of Dispatch": {
    heading: "Dispatch is a control plane for parallel work",
    aside: "the browser is the cockpit; the work stays local",
    nodes: [
      { title: "Workspace", body: "A browser surface brings terminals, shared media, jobs, and agent status together.", color: "#7c3aed", paper: "#ede9fe", link: projectLink("dispatch") },
      { title: "Agent runtime", body: "tmux-backed sessions keep coding agents alive beyond a single request.", color: "#be185d", paper: "#fce7f3", link: projectLink("dispatch") },
      { title: "Isolated work", body: "Git worktrees and a shared data layer let agents move in parallel without collisions.", color: "#0369a1", paper: "#e0f2fe", link: projectLink("dispatch") },
    ],
  },
  "How does Orca Mail decide what matters?": {
    heading: "Orca listens for human signal",
    aside: "an inbox should know the difference between a person and a receipt",
    nodes: [
      { title: "Human Signal", body: "People, relationship context, and real conversation outrank automated volume.", color: "#0f766e", paper: "#d1fae5", link: projectLink("orca-mail") },
      { title: "Attention views", body: "Mail is normalized into calm views that surface what needs a decision or reply.", color: "#0369a1", paper: "#e0f2fe", link: projectLink("orca-mail") },
      { title: "Zen writer", body: "Once the right thread is found, the interface gets out of the way of responding.", color: "#b45309", paper: "#fef3c7", link: projectLink("orca-mail") },
    ],
  },
  "Explain FlowState visually": {
    heading: "FlowState turns context into approved action",
    aside: "the useful bit is the handoff, not another chat window",
    nodes: [
      { title: "Connected context", body: "School, mail, calendar, and notes enter one local-first workspace.", color: "#d06224", paper: "#ffedd5", link: projectLink("flowstate") },
      { title: "Specialized agents", body: "Focused helpers interpret that context for a concrete study workflow.", color: "#9eab57", paper: "#ecfccb", link: projectLink("flowstate") },
      { title: "Approval gate", body: "Anything consequential pauses for a human decision before it moves.", color: "#7c3aed", paper: "#ede9fe", link: projectLink("flowstate") },
    ],
  },
  "What connects Luke's projects?": {
    heading: "The same three instincts keep showing up",
    aside: "build the missing tool, keep the seams visible",
    nodes: [
      { title: "Personal friction", body: "Each project begins with a real workflow that feels harder than it should.", color: "#e4573e", paper: "#fee2e2", link: "/projects" },
      { title: "Human control", body: "Automation helps, but approvals and understandable state stay close at hand.", color: "#0f766e", paper: "#d1fae5", link: projectLink("flowstate") },
      { title: "Inspectable systems", body: "The architecture is meant to be understood, changed, and owned by its user.", color: "#1d4ed8", paper: "#dbeafe", link: projectLink("malcom") },
    ],
  },
  "Surprise me": {
    heading: "Luke once built a market-making system for fun",
    aside: "apparently normal hobbies were unavailable",
    nodes: [
      { title: "Market making", body: "Quote both sides with enough discipline to manage inventory and risk.", color: "#10b981", paper: "#d1fae5", link: projectLink("hftc") },
      { title: "Momentum", body: "Layer directional signals on top when the simulated market starts moving.", color: "#3b82f6", paper: "#dbeafe", link: projectLink("hftc") },
      { title: "Competition loop", body: "Test, observe, adjust—the same practical loop behind Luke's product work.", color: "#b45309", paper: "#fef3c7", link: projectLink("hftc") },
    ],
  },
};

const fallbackResponse: SampleResponse = {
  heading: "Three good places to start",
  aside: "a small map is better than a wall of links",
  nodes: ["malcom", "orca-mail", "dispatch"].flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [{ title: project.title, body: project.description.slice(0, 108), color: project.primaryColor, paper: "#fff3bf", link: projectLink(project.slug) }] : [];
  }),
};

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
  const response = sampleResponses[question] ?? fallbackResponse;
  const baseY = 140 + turn * (isMobile ? 720 : 330);
  const cardWidth = isMobile ? 300 : 270;
  const cardHeight = 175;
  const gap = isMobile ? 42 : 55;
  const startX = isMobile ? 70 : 110 + (3 - response.nodes.length) * 160;
  const cards = response.nodes.map((node, index) => ({
    id: `${prefix}-card-${index}`,
    type: "rectangle" as const,
    x: isMobile ? startX : startX + index * (cardWidth + gap),
    y: baseY + 78 + (isMobile ? index * (cardHeight + gap) : 0),
    width: cardWidth,
    height: cardHeight,
    strokeColor: node.color,
    backgroundColor: node.paper,
    fillStyle: "solid" as const,
    roughness: 1,
    roundness: { type: 3 as const },
    link: node.link,
    label: {
      text: `${node.title}\n\n${node.body}`,
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
      text: `✦ ${isMobile ? wrapQuestion(response.heading, 14) : response.heading}`,
      width: isMobile ? 430 : 900,
      height: isMobile ? 84 : 42,
      fontSize: isMobile ? 22 : 28,
      fontFamily: 1,
      strokeColor: "#e4573e",
      textAlign: "left",
    },
    ...cards,
    ...arrows,
    {
      id: `${prefix}-aside`,
      type: "text",
      x: startX + (isMobile ? 10 : 120),
      y: baseY + 278 + (isMobile ? response.nodes.length * (cardHeight + gap) - 210 : 0),
      text: `↳ ${response.aside}`,
      fontSize: 17,
      fontFamily: 1,
      strokeColor: "#777168",
      textAlign: "left",
    },
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
              <PencilLine size={17} /> pick a thread or write your own
            </div>
            <h1 className={lukesFont.className}>
              What do you want
              <br />
              <span>to explore?</span>
            </h1>
            <p>
              Choose a note for a quick sketch, or ask for a different path
              through Luke’s work.
            </p>

            <form className={styles.promptForm} onSubmit={submit}>
              <label htmlFor="vision-prompt" className="sr-only">
                What would you like to explore?
              </label>
              <input
                id="vision-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask Luke's canvas anything…"
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
              {starterPrompts.map((item, index) => (
                <button
                  key={item.prompt}
                  type="button"
                  onClick={() => explore(item.prompt)}
                  style={{ "--prompt-tilt": item.tilt } as React.CSSProperties}
                >
                  <span className={styles.promptNumber}>0{index + 1}</span>
                  <strong>{item.prompt}</strong>
                  <small>{item.note} ↗</small>
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
