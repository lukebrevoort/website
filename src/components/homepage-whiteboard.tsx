"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FolderOpen,
  PencilLine,
  RotateCcw,
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

const malcomPrompt = "Sketch how MALCOM works";
const malcomFollowUps = [
  "Add a policy check before every tool call",
  "Show me where the work actually lives",
] as const;
type ResponseNode = {
  title: string;
  body: string;
  color: string;
  paper: string;
  link: string;
  shape?: "rectangle" | "ellipse" | "diamond";
};

type DiagramLayout =
  | "pipeline"
  | "hub"
  | "funnel"
  | "loop"
  | "constellation"
  | "timeline";

type SampleResponse = {
  heading: string;
  aside: string;
  layout: DiagramLayout;
  nodes: ResponseNode[];
  edges: [number, number][];
};

type NodeBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const projectLink = (slug: string) => `/projects/${slug}`;

const sampleResponses: Record<string, SampleResponse> = {
  "Sketch how MALCOM works": {
    heading: "MALCOM keeps the work legible",
    aside: "more air-traffic control than robot brain",
    layout: "pipeline",
    nodes: [
      { title: "Controller", body: "One stable CLI receives every command.", color: "#1d4ed8", paper: "#dbeafe", link: projectLink("malcom") },
      { title: "Policy gate", body: "Approve before action.", color: "#b45309", paper: "#fef3c7", link: projectLink("malcom"), shape: "diamond" },
      { title: "Session registry", body: "Long-running work stays named and inspectable.", color: "#0f766e", paper: "#d1fae5", link: projectLink("malcom") },
      { title: "Workspace", body: "Files + state", color: "#7c3aed", paper: "#ede9fe", link: projectLink("malcom") },
      { title: "Coding agents", body: "Codex + Cursor", color: "#be185d", paper: "#fce7f3", link: projectLink("malcom") },
      { title: "Tool adapters", body: "GitHub + Notion + Linear", color: "#0369a1", paper: "#e0f2fe", link: projectLink("malcom") },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5]],
  },
  "Show me the architecture of Dispatch": {
    heading: "Dispatch is a control plane for parallel work",
    aside: "the browser is the cockpit; the work stays local",
    layout: "hub",
    nodes: [
      { title: "Dispatch", body: "The control plane", color: "#7c3aed", paper: "#ede9fe", link: projectLink("dispatch"), shape: "ellipse" },
      { title: "Browser workspace", body: "Terminals, status, and shared media.", color: "#be185d", paper: "#fce7f3", link: projectLink("dispatch") },
      { title: "tmux agents", body: "Sessions survive beyond one request.", color: "#0369a1", paper: "#e0f2fe", link: projectLink("dispatch") },
      { title: "Git worktrees", body: "Each agent gets an isolated lane.", color: "#0f766e", paper: "#d1fae5", link: projectLink("dispatch") },
      { title: "Jobs + data", body: "Shared state makes work observable.", color: "#b45309", paper: "#fef3c7", link: projectLink("dispatch") },
    ],
    edges: [[0, 1], [0, 2], [0, 3], [0, 4]],
  },
  "How does Orca Mail decide what matters?": {
    heading: "Orca listens for human signal",
    aside: "an inbox should know the difference between a person and a receipt",
    layout: "funnel",
    nodes: [
      { title: "A person wrote", body: "Relationship context", color: "#0f766e", paper: "#d1fae5", link: projectLink("orca-mail") },
      { title: "Needs a reply", body: "Conversation state", color: "#0369a1", paper: "#e0f2fe", link: projectLink("orca-mail") },
      { title: "Automated mail", body: "Receipts + campaigns", color: "#777168", paper: "#f1f0ed", link: projectLink("orca-mail") },
      { title: "Human Signal", body: "Who? Why? Next?", color: "#e4573e", paper: "#fee2e2", link: projectLink("orca-mail"), shape: "diamond" },
      { title: "Now", body: "A decision or reply is waiting.", color: "#be185d", paper: "#fce7f3", link: projectLink("orca-mail") },
      { title: "Later", body: "Useful context without urgency.", color: "#7c3aed", paper: "#ede9fe", link: projectLink("orca-mail") },
      { title: "Zen writer", body: "Focus on the human response.", color: "#b45309", paper: "#fef3c7", link: projectLink("orca-mail") },
    ],
    edges: [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6]],
  },
  "Explain FlowState visually": {
    heading: "FlowState turns context into approved action",
    aside: "the useful bit is the handoff, not another chat window",
    layout: "loop",
    nodes: [
      { title: "Connected context", body: "Mail, calendar, notes, and school work.", color: "#d06224", paper: "#ffedd5", link: projectLink("flowstate") },
      { title: "Focused agent", body: "Interpret one concrete workflow.", color: "#9eab57", paper: "#ecfccb", link: projectLink("flowstate") },
      { title: "Human approval", body: "Pause. Review. Approve.", color: "#7c3aed", paper: "#ede9fe", link: projectLink("flowstate"), shape: "diamond" },
      { title: "Action + feedback", body: "Do the work, then return useful state.", color: "#0369a1", paper: "#e0f2fe", link: projectLink("flowstate") },
      { title: "FlowState", body: "Context stays local; control stays human.", color: "#e4573e", paper: "#fee2e2", link: projectLink("flowstate"), shape: "ellipse" },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 0], [4, 2]],
  },
  "What connects Luke's projects?": {
    heading: "The same instincts keep showing up",
    aside: "build the missing tool, keep the seams visible",
    layout: "constellation",
    nodes: [
      { title: "Personal friction", body: "A real workflow feels harder than it should.", color: "#e4573e", paper: "#fee2e2", link: "/projects", shape: "ellipse" },
      { title: "MALCOM", body: "Inspectable orchestration", color: "#1d4ed8", paper: "#dbeafe", link: projectLink("malcom") },
      { title: "Dispatch", body: "Parallel work with visible state", color: "#7c3aed", paper: "#ede9fe", link: projectLink("dispatch") },
      { title: "Orca Mail", body: "Human signal over volume", color: "#0f766e", paper: "#d1fae5", link: projectLink("orca-mail") },
      { title: "FlowState", body: "Approval-gated action", color: "#d06224", paper: "#ffedd5", link: projectLink("flowstate") },
      { title: "Small tools", body: "Ownership beats opacity", color: "#b45309", paper: "#fef3c7", link: "/projects" },
    ],
    edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  },
  "Surprise me": {
    heading: "Luke once built a market-making system for fun",
    aside: "apparently normal hobbies were unavailable",
    layout: "timeline",
    nodes: [
      { title: "Quote", body: "Place both sides", color: "#10b981", paper: "#d1fae5", link: projectLink("hftc") },
      { title: "Observe", body: "Read the market", color: "#3b82f6", paper: "#dbeafe", link: projectLink("hftc") },
      { title: "Rebalance", body: "Manage inventory", color: "#e4573e", paper: "#fee2e2", link: projectLink("hftc") },
      { title: "Add momentum", body: "Act when direction appears", color: "#7c3aed", paper: "#ede9fe", link: projectLink("hftc") },
      { title: "Repeat", body: "Test → observe → adjust", color: "#b45309", paper: "#fef3c7", link: projectLink("hftc"), shape: "ellipse" },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
};

const fallbackProjects = ["malcom", "orca-mail", "dispatch", "flowstate"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const fallbackResponse: SampleResponse = {
  heading: "Four good places to start",
  aside: "a small map is better than a wall of links",
  layout: "hub",
  nodes: fallbackProjects.map((project, index) => ({
    title: project.title,
    body: project.description.slice(0, 74),
    color: project.primaryColor,
    paper: ["#dbeafe", "#d1fae5", "#ede9fe", "#ffedd5"][index],
    link: projectLink(project.slug),
    ...(index === 0 ? { shape: "ellipse" as const } : {}),
  })),
  edges: [[0, 1], [0, 2], [0, 3]],
};

const wrapQuestion = (question: string, maxLineLength = 27) =>
  question
    .split(" ")
    .reduce<string[]>((lines, word) => {
      const current = lines.at(-1);
      if (!current || `${current} ${word}`.length > maxLineLength) {
        lines.push(word);
      } else {
        lines[lines.length - 1] = `${current} ${word}`;
      }
      return lines;
    }, [])
    .map((line) => `${line}  `)
    .join("\n");

const connectorOffset = (
  box: NodeBox,
  vectorX: number,
  vectorY: number,
  shape: ResponseNode["shape"],
) => {
  const halfWidth = box.width / 2;
  const halfHeight = box.height / 2;
  const safeX = Math.abs(vectorX) < 0.001 ? 0.001 : vectorX;
  const safeY = Math.abs(vectorY) < 0.001 ? 0.001 : vectorY;
  let scale: number;

  if (shape === "ellipse") {
    scale = 1 / Math.sqrt(
      (safeX * safeX) / (halfWidth * halfWidth) +
      (safeY * safeY) / (halfHeight * halfHeight),
    );
  } else if (shape === "diamond") {
    scale = 1 / (
      Math.abs(safeX) / halfWidth + Math.abs(safeY) / halfHeight
    );
  } else {
    scale = Math.min(
      halfWidth / Math.abs(safeX),
      halfHeight / Math.abs(safeY),
    );
  }

  return { x: vectorX * scale, y: vectorY * scale };
};

const desktopBoxes: Record<DiagramLayout, NodeBox[]> = {
  pipeline: [
    { x: 0, y: 110, width: 210, height: 118 },
    { x: 275, y: 102, width: 190, height: 132 },
    { x: 530, y: 100, width: 220, height: 138 },
    { x: 795, y: 0, width: 190, height: 96 },
    { x: 795, y: 125, width: 190, height: 96 },
    { x: 795, y: 250, width: 190, height: 96 },
  ],
  hub: [
    { x: 390, y: 135, width: 210, height: 125 },
    { x: 25, y: 0, width: 245, height: 110 },
    { x: 720, y: 0, width: 245, height: 110 },
    { x: 25, y: 285, width: 245, height: 110 },
    { x: 720, y: 285, width: 245, height: 110 },
  ],
  funnel: [
    { x: 0, y: 0, width: 190, height: 88 },
    { x: 0, y: 120, width: 190, height: 88 },
    { x: 0, y: 240, width: 190, height: 88 },
    { x: 285, y: 100, width: 180, height: 145 },
    { x: 560, y: 45, width: 190, height: 100 },
    { x: 560, y: 205, width: 190, height: 100 },
    { x: 825, y: 45, width: 190, height: 100 },
  ],
  loop: [
    { x: 80, y: 20, width: 235, height: 108 },
    { x: 680, y: 20, width: 235, height: 108 },
    { x: 680, y: 285, width: 235, height: 108 },
    { x: 80, y: 285, width: 235, height: 108 },
    { x: 390, y: 145, width: 215, height: 125 },
  ],
  constellation: [
    { x: 390, y: 145, width: 215, height: 125 },
    { x: 25, y: 0, width: 205, height: 94 },
    { x: 760, y: 0, width: 205, height: 94 },
    { x: 0, y: 295, width: 205, height: 94 },
    { x: 785, y: 295, width: 205, height: 94 },
    { x: 395, y: 340, width: 205, height: 94 },
  ],
  timeline: [
    { x: 0, y: 55, width: 170, height: 100 },
    { x: 210, y: 190, width: 170, height: 100 },
    { x: 420, y: 55, width: 170, height: 100 },
    { x: 630, y: 190, width: 180, height: 100 },
    { x: 850, y: 55, width: 170, height: 100 },
  ],
};

const buildProjectResponse = (
  question: string,
  turn: number,
  isMobile: boolean,
): ExcalidrawElementSkeleton[] => {
  const prefix = `agent-${turn}-${Date.now()}`;
  const response = sampleResponses[question] ?? fallbackResponse;
  const baseX = isMobile ? 70 : 95;
  const baseY = 140 + turn * (isMobile ? 1250 : 620);
  const boxes = isMobile
    ? response.nodes.map((node, index) => ({
        x: node.shape === "diamond" ? 55 : 0,
        y: 92 + index * 176,
        width: node.shape === "diamond" ? 190 : 300,
        height: node.shape === "diamond" ? 126 : 124,
      }))
    : desktopBoxes[response.layout].map((box) => ({
        ...box,
        y: box.y + 82,
      }));
  const visibleBoxes = boxes.slice(0, response.nodes.length);

  const arrows: ExcalidrawElementSkeleton[] = response.edges.flatMap(
    ([fromIndex, toIndex], index) => {
      const from = visibleBoxes[fromIndex];
      const to = visibleBoxes[toIndex];
      if (!from || !to) return [];

      const fromX = baseX + from.x + from.width / 2;
      const fromY = baseY + from.y + from.height / 2;
      const toX = baseX + to.x + to.width / 2;
      const toY = baseY + to.y + to.height / 2;
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.max(Math.hypot(deltaX, deltaY), 1);
      const unitX = deltaX / distance;
      const unitY = deltaY / distance;
      const fromOffset = connectorOffset(
        from,
        deltaX,
        deltaY,
        response.nodes[fromIndex]?.shape,
      );
      const toOffset = connectorOffset(
        to,
        -deltaX,
        -deltaY,
        response.nodes[toIndex]?.shape,
      );
      const startX = fromX + fromOffset.x + unitX * 7;
      const startY = fromY + fromOffset.y + unitY * 7;
      const endX = toX + toOffset.x - unitX * 11;
      const endY = toY + toOffset.y - unitY * 11;

      return [{
        id: `${prefix}-arrow-${index}`,
        type: "arrow" as const,
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
        points: [[0, 0], [endX - startX, endY - startY]],
        strokeColor: "#5f5a51",
        strokeStyle: response.layout === "constellation" ? "dashed" as const : "solid" as const,
        strokeWidth: 2,
        roughness: 1,
        endArrowhead: "arrow" as const,
      }];
    },
  );

  const nodes = response.nodes.flatMap((node, index) => {
    const box = visibleBoxes[index];
    if (!box) return [];
    const x = baseX + box.x;
    const y = baseY + box.y;

    return [
      {
        id: `${prefix}-node-${index}`,
        type: node.shape ?? "rectangle",
        x,
        y,
        width: box.width,
        height: box.height,
        strokeColor: "#292721",
        strokeWidth: 2,
        backgroundColor: node.paper,
        fillStyle: "solid" as const,
        roughness: 1,
        ...(node.shape ? {} : { roundness: { type: 3 as const } }),
        link: node.link,
        label: {
          text: `${node.title}\n\n${node.body}`,
          fontSize: isMobile ? 16 : 17,
          fontFamily: 1 as const,
          textAlign: node.shape === "diamond" ? "center" as const : "left" as const,
          verticalAlign: "middle" as const,
        },
      },
      {
        id: `${prefix}-accent-${index}`,
        type: "line" as const,
        x: x + box.width * 0.18,
        y: y + 13,
        width: box.width * 0.32,
        height: 0,
        points: [[0, 0], [box.width * 0.32, 0]],
        strokeColor: node.color,
        strokeWidth: 5,
        roughness: 1,
      },
    ];
  });

  const diagramBottom = Math.max(...visibleBoxes.map((box) => box.y + box.height));

  return [
    ...arrows,
    ...nodes,
    {
      id: `${prefix}-question`,
      type: "text",
      x: baseX,
      y: baseY,
      text: `✦ ${isMobile ? wrapQuestion(response.heading, 18) : response.heading}`,
      width: isMobile ? 330 : 980,
      height: isMobile ? 72 : 42,
      fontSize: isMobile ? 22 : 28,
      fontFamily: 1,
      strokeColor: "#c83f2f",
      textAlign: "left",
    },
    {
      id: `${prefix}-aside`,
      type: "text",
      x: baseX + (isMobile ? 10 : 170),
      y: baseY + diagramBottom + 26,
      text: `↳ ${response.aside}`,
      fontSize: 17,
      fontFamily: 1,
      strokeColor: "#3f3b34",
      textAlign: "left",
    },
  ];
};

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const buildMalcomFollowUp = (
  question: string,
  turn: number,
  isMobile: boolean,
): ExcalidrawElementSkeleton[] => {
  const prefix = `malcom-follow-up-${turn}-${Date.now()}`;
  const baseX = isMobile ? 70 : 95;
  const baseY = 140;
  const policyX = baseX + (isMobile ? 55 : 275);
  const workspaceX = baseX + (isMobile ? 0 : 795);

  if (question === malcomFollowUps[0]) {
    return [
      {
        id: `${prefix}-note`, type: "text", x: policyX, y: baseY + (isMobile ? 48 : 38),
        text: "✓ credentials, scope, then approval", fontSize: isMobile ? 16 : 18,
        fontFamily: 1, strokeColor: "#047857", textAlign: "left",
      },
      {
        id: `${prefix}-arrow`, type: "arrow", x: policyX + 95, y: baseY + 76,
        width: 0, height: 87, points: [[0, 0], [0, 87]], strokeColor: "#047857",
        strokeWidth: 2, strokeStyle: "dashed", roughness: 1, endArrowhead: "arrow",
      },
      {
        id: `${prefix}-aside`, type: "text", x: baseX, y: baseY + (isMobile ? 1170 : 475),
        text: "↳ MALCOM: 'I check the door before anyone touches the knobs.'", fontSize: 17,
        fontFamily: 1, strokeColor: "#3f3b34", textAlign: "left",
      },
    ];
  }

  return [
    {
      id: `${prefix}-ring`, type: "ellipse", x: workspaceX - 12, y: baseY + (isMobile ? 585 : 70),
      width: isMobile ? 325 : 214, height: isMobile ? 148 : 120, strokeColor: "#7c3aed",
      strokeWidth: 3, strokeStyle: "dashed", roughness: 1, backgroundColor: "transparent",
    },
    {
      id: `${prefix}-note`, type: "text", x: workspaceX, y: baseY + (isMobile ? 750 : 210),
      text: "↳ repos, artifacts, logs & recovery live here", fontSize: isMobile ? 16 : 18,
      fontFamily: 1, strokeColor: "#6d28d9", textAlign: "left",
    },
    {
      id: `${prefix}-aside`, type: "text", x: baseX, y: baseY + (isMobile ? 1230 : 505),
      text: "↳ nothing disappears into the void. pinky promise.", fontSize: 17,
      fontFamily: 1, strokeColor: "#3f3b34", textAlign: "left",
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
  const agentElementIds = useRef<string[]>([]);
  const usedMalcomFollowUps = useRef<Set<string>>(new Set());
  const [malcomShowcase, setMalcomShowcase] = useState(false);
  const [completedFollowUps, setCompletedFollowUps] = useState<string[]>([]);

  const handleSnapshot = useCallback((snapshot: CanvasSnapshot) => {
    canvasSnapshot.current = snapshot;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setAgentState("idle"), 650);
    timers.current.push(timer);
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  const insertAndTrack = async (elements: ExcalidrawElementSkeleton[]) => {
    const inserted = await canvasSnapshot.current?.insertElements(elements);
    agentElementIds.current.push(...(inserted ?? []).map((element) => element.id));
  };

  const clearAgentSketch = () => {
    canvasSnapshot.current?.removeElements(agentElementIds.current);
    agentElementIds.current = [];
    turn.current = 0;
    usedMalcomFollowUps.current.clear();
    setCompletedFollowUps([]);
    setMalcomShowcase(false);
    setQuestion("");
    setAgentState("idle");
  };

  const explore = (value: string) => {
    const nextQuestion = value.trim();
    if (!nextQuestion) return;
    if (usedMalcomFollowUps.current.has(nextQuestion)) return;

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
        const isMalcomStart = nextQuestion === malcomPrompt && turn.current === 0;
        const isMalcomFollowUp = malcomShowcase && malcomFollowUps.includes(nextQuestion as (typeof malcomFollowUps)[number]);

        if (isMalcomStart) {
          setMalcomShowcase(true);
          const elements = buildProjectResponse(nextQuestion, turn.current, isMobile);
          const headingAndController = elements.filter((element) => /-(question|node-0|accent-0)$/.test(element.id ?? ""));
          const policyAndRegistry = elements.filter((element) => /-(node-[12]|accent-[12]|arrow-[01])$/.test(element.id ?? ""));
          const workingParts = elements.filter((element) => /-(node-[3-5]|accent-[3-5]|arrow-[2-4]|aside)$/.test(element.id ?? ""));
          await insertAndTrack(headingAndController);
          await wait(360);
          await insertAndTrack(policyAndRegistry);
          await wait(360);
          await insertAndTrack(workingParts);
        } else if (isMalcomFollowUp) {
          await insertAndTrack(buildMalcomFollowUp(nextQuestion, turn.current, isMobile));
          usedMalcomFollowUps.current.add(nextQuestion);
          setCompletedFollowUps((current) => [...current, nextQuestion]);
        } else {
          await insertAndTrack(buildProjectResponse(nextQuestion, turn.current, isMobile));
        }
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
          <ArrowLeft size={15} strokeWidth={1.8} />
          <span>luke.brev</span>
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

        {malcomShowcase && agentState === "active" && (
          <div className={styles.showcaseActions} aria-label="MALCOM sketch controls">
            <span>Try a real follow-up:</span>
            {malcomFollowUps.map((followUp) => (
              <button
                key={followUp}
                type="button"
                onClick={() => explore(followUp)}
                disabled={completedFollowUps.includes(followUp)}
              >
                {completedFollowUps.includes(followUp) ? `✓ ${followUp}` : followUp}
              </button>
            ))}
            <button type="button" className={styles.clearSketch} onClick={clearAgentSketch}>
              <RotateCcw size={14} /> clear sketch
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
