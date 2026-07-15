"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FolderOpen,
  PencilLine,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { lukesFont, satoshi } from "@/app/fonts";
import {
  compileCanvasPatch,
  validateCanvasPatch,
  type CanvasPatch,
  type CompiledCanvasPatch,
  type PriorCanvasTurn,
} from "@/lib/canvas-agent";
import ExcalidrawCanvas, { type CanvasSnapshot } from "./excalidraw-canvas";
import CanvasContractLab from "./canvas-contract-lab";
import styles from "./homepage-whiteboard.module.css";

type AgentState = "loading" | "idle" | "thinking" | "active" | "error";

type PendingAgentPatch = {
  compiled: CompiledCanvasPatch;
  prompt: string;
  summary: string;
  sceneVersion: string;
};

async function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

const starterPrompts = [
  { prompt: "Sketch how MALCOM works", note: "controller + sessions", tilt: "-1.4deg" },
  { prompt: "Show me the architecture of Dispatch", note: "agents + worktrees", tilt: ".8deg" },
  { prompt: "How does Orca Mail decide what matters?", note: "signal, not noise", tilt: "-0.5deg" },
  { prompt: "Explain FlowState visually", note: "context + action", tilt: "1.2deg" },
  { prompt: "What connects Luke's projects?", note: "follow the thread", tilt: "-.8deg" },
  { prompt: "Surprise me", note: "dealer's choice", tilt: ".5deg" },
] as const;

type HomepageWhiteboardProps = {
  canvasDebugEnabled?: boolean;
};

export default function HomepageWhiteboard({
  canvasDebugEnabled = false,
}: HomepageWhiteboardProps) {
  const [agentState, setAgentState] = useState<AgentState>("loading");
  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState("");
  const canvasSnapshot = useRef<CanvasSnapshot | null>(null);
  const turn = useRef(0);
  const [contractLabActive, setContractLabActive] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  const [pendingPatch, setPendingPatch] = useState<PendingAgentPatch | null>(null);
  const priorTurns = useRef<PriorCanvasTurn[]>([]);

  const handleSnapshot = useCallback((snapshot: CanvasSnapshot) => {
    canvasSnapshot.current = snapshot;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setAgentState("idle"), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const recordTurn = (prompt: string, summary: string) => {
    priorTurns.current = [...priorTurns.current, { prompt, summary }].slice(-4);
  };

  const explore = async (value: string) => {
    const nextQuestion = value.trim();
    if (!nextQuestion) return;
    setQuestion(nextQuestion);
    setPrompt("");
    setAgentMessage("");
    setPendingPatch(null);

    if (!navigator.onLine) {
      setAgentMessage("The vision agent is offline. Your canvas was not changed.");
      setAgentState("error");
      return;
    }

    setAgentState("thinking");
    const snapshot = canvasSnapshot.current;
    if (!snapshot) {
      setAgentMessage("The canvas is still opening. Give it a moment and try again.");
      setAgentState("error");
      return;
    }

    try {
      const capture = await snapshot.captureAgentContext();
      if (!capture) {
        setAgentMessage("That canvas view is too large to inspect safely. Select fewer marks and try again.");
        setAgentState("error");
        return;
      }

      const response = await fetch("/api/canvas-agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: nextQuestion,
          scope: capture.scope,
          context: capture.context,
          imageDataUrl: await blobToDataUrl(capture.image),
          priorTurns: priorTurns.current,
        }),
      });
      const payload = await response.json() as {
        ok: boolean;
        message?: string;
        patch?: CanvasPatch;
      };
      if (!response.ok || !payload.ok || !payload.patch) {
        setAgentMessage(payload.message || "The vision agent is resting. Your canvas was not changed.");
        setAgentState("error");
        return;
      }

      if (snapshot.getPatchContext()?.sceneVersion !== capture.context.sceneVersion) {
        setAgentMessage("The board changed while the agent was thinking, so its stale response was not applied.");
        setAgentState("error");
        return;
      }

      const validation = validateCanvasPatch(payload.patch, capture.context);
      if (!validation.ok) {
        setAgentMessage("The agent returned an unsafe canvas change, so nothing was applied.");
        setAgentState("error");
        return;
      }
      const compiled = compileCanvasPatch(
        validation.value.patch,
        capture.context,
        validation.value.risk,
      );
      const application = await snapshot.applyCompiledPatch(compiled);
      if (application.status === "confirmation-required") {
        setPendingPatch({
          compiled,
          prompt: nextQuestion,
          summary: validation.value.patch.summary,
          sceneVersion: capture.context.sceneVersion,
        });
        setAgentMessage(`This change needs your approval: ${application.reasons.join(", ")}.`);
        setAgentState("active");
        return;
      }
      if (application.status !== "applied") {
        setAgentMessage("The canvas was not ready to apply that change. Nothing was modified.");
        setAgentState("error");
        return;
      }

      recordTurn(nextQuestion, validation.value.patch.summary);
      turn.current += 1;
      setAgentState("active");
    } catch (error) {
      console.error("Canvas agent request failed", error);
      setAgentMessage("The vision agent lost the thread. Your canvas is untouched—please try again.");
      setAgentState("error");
    }
  };

  const confirmPendingPatch = async () => {
    if (!pendingPatch) return;
    if (canvasSnapshot.current?.getPatchContext()?.sceneVersion !== pendingPatch.sceneVersion) {
      setPendingPatch(null);
      setAgentMessage("The board changed during review, so the pending response is now stale and was not applied.");
      setAgentState("error");
      return;
    }
    const application = await canvasSnapshot.current?.applyCompiledPatch(
      pendingPatch.compiled,
      { confirmed: true },
    );
    if (!application || application.status !== "applied") {
      setAgentMessage("The approved change could not be applied. Your canvas was not modified.");
      setAgentState("error");
      return;
    }
    recordTurn(pendingPatch.prompt, pendingPatch.summary);
    turn.current += 1;
    setPendingPatch(null);
    setAgentMessage("");
    setAgentState("active");
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

        {canvasDebugEnabled && (
          <CanvasContractLab
            getSnapshot={() => canvasSnapshot.current}
            onPatchApplied={() => setContractLabActive(true)}
          />
        )}

        {agentState === "loading" && (
          <div className={styles.loading} role="status">
            <span className={styles.agentGlyph}>✦</span>
            <span>unrolling the canvas…</span>
            <span className={styles.loadingLine} />
          </div>
        )}

        {(agentState === "idle" || agentState === "error") &&
          turn.current === 0 &&
          !contractLabActive && (
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
                {agentMessage || "The agent lost the thread. Your canvas is still here—try again."}
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

        {pendingPatch && (
          <div className={styles.agentNotice} role="alert">
            <strong>Review before changing the board</strong>
            <span>{agentMessage}</span>
            <div>
              <button type="button" onClick={confirmPendingPatch}>apply change</button>
              <button type="button" onClick={() => {
                setPendingPatch(null);
                setAgentMessage("");
              }}>keep canvas as-is</button>
            </div>
          </div>
        )}

        {agentState === "error" && turn.current > 0 && agentMessage && (
          <div className={`${styles.agentNotice} ${styles.agentNoticeError}`} role="alert">
            <strong>Nothing changed</strong>
            <span>{agentMessage}</span>
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
