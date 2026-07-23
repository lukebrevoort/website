"use client";

import Link from "next/link";
import { CSSProperties, FormEvent, KeyboardEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";
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
import TurnstileChallenge from "./turnstile-challenge";
import {
  CANVAS_STARTER_PROMPTS,
  type CanvasStarterId,
} from "@/lib/canvas-agent/starter-prompts";
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

type LivePolicy = {
  live: {
    available: boolean;
    verificationRequired: boolean;
    turnstileSiteKey: string | null;
  };
  limits: { sessionDaily: number; cooldownSeconds: number };
  usage: { sessionUsed: number } | null;
};

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
  const followUpInputRef = useRef<HTMLInputElement | null>(null);
  const followUpLauncherRef = useRef<HTMLButtonElement | null>(null);
  const restoreLauncherFocusRef = useRef(false);
  const shellRef = useRef<HTMLElement | null>(null);
  const [contractLabActive, setContractLabActive] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  const [pendingPatch, setPendingPatch] = useState<PendingAgentPatch | null>(null);
  const priorTurns = useRef<PriorCanvasTurn[]>([]);
  const [boardHasContent, setBoardHasContent] = useState(false);
  const [livePolicy, setLivePolicy] = useState<LivePolicy | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpShouldFocus, setFollowUpShouldFocus] = useState(false);

  const handleSnapshot = useCallback((snapshot: CanvasSnapshot) => {
    canvasSnapshot.current = snapshot;
    setBoardHasContent(snapshot.sceneElements.length > 0);
  }, []);

  useEffect(() => {
    // Narrow phones OR short coarse viewports (typical phone landscape).
    const media = window.matchMedia(
      "(max-width: 760px), ((max-height: 500px) and (pointer: coarse))",
    );
    const sync = () => setIsCompactViewport(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has("loadingPreview");
    if (preview) return;
    const timer = window.setTimeout(() => setAgentState("idle"), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    const viewport = window.visualViewport;
    if (!shell || !viewport) return;

    const syncKeyboardInset = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      shell.style.setProperty("--keyboard-inset", `${inset}px`);
    };

    syncKeyboardInset();
    viewport.addEventListener("resize", syncKeyboardInset);
    viewport.addEventListener("scroll", syncKeyboardInset);
    window.addEventListener("resize", syncKeyboardInset);
    return () => {
      viewport.removeEventListener("resize", syncKeyboardInset);
      viewport.removeEventListener("scroll", syncKeyboardInset);
      window.removeEventListener("resize", syncKeyboardInset);
    };
  }, []);

  useEffect(() => {
    if (!isCompactViewport) {
      setFollowUpOpen(false);
      setFollowUpShouldFocus(false);
      restoreLauncherFocusRef.current = false;
      return;
    }
    if (agentState === "thinking" || agentState === "error") {
      setFollowUpOpen(true);
      setFollowUpShouldFocus(false);
      restoreLauncherFocusRef.current = false;
    } else if (agentState === "active") {
      setFollowUpOpen(false);
      setFollowUpShouldFocus(false);
      // Restore after a completed follow-up turn, not on first board activation.
      if (turn.current > 0) {
        restoreLauncherFocusRef.current = true;
      }
    }
  }, [agentState, isCompactViewport]);

  useEffect(() => {
    if (!followUpOpen || !followUpShouldFocus || !isCompactViewport) return;
    const frame = window.requestAnimationFrame(() => {
      followUpInputRef.current?.focus();
      setFollowUpShouldFocus(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [followUpOpen, followUpShouldFocus, isCompactViewport]);

  const showFollowUpSurface =
    agentState === "active" ||
    ((agentState === "thinking" || agentState === "error") && turn.current > 0);
  const showFollowUpTray = showFollowUpSurface && (!isCompactViewport || followUpOpen);
  const showFollowUpLauncher = showFollowUpSurface && isCompactViewport && !followUpOpen;

  useEffect(() => {
    if (!showFollowUpLauncher || !restoreLauncherFocusRef.current) return;
    restoreLauncherFocusRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      followUpLauncherRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showFollowUpLauncher]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/canvas-agent", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((policy: LivePolicy | null) => policy && setLivePolicy(policy))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const recordTurn = (prompt: string, summary: string) => {
    priorTurns.current = [...priorTurns.current, { prompt, summary }].slice(-2);
  };

  const explore = async (value: string, starterId?: CanvasStarterId) => {
    const nextQuestion = value.trim();
    if (!nextQuestion) return;
    setQuestion(nextQuestion);
    setAgentMessage("");
    setPendingPatch(null);

    if (!navigator.onLine) {
      setAgentMessage("The vision agent is offline. Your canvas was not changed.");
      setAgentState("error");
      return;
    }

    if (!starterId && livePolicy?.live.verificationRequired && !turnstileToken) {
      setAgentMessage(
        livePolicy.live.turnstileSiteKey
          ? "Complete the quick human check, then send that thought again."
          : "Live verification is not configured yet. The authored starting points still work.",
      );
      setAgentState("error");
      return;
    }

    setPrompt("");
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
          ...(starterId ? { starterId } : {}),
          ...(!starterId && turnstileToken ? { turnstileToken } : {}),
        }),
      });
      const payload = await response.json().catch(() => ({
        ok: false,
        message: response.status === 429
          ? "Too many questions from this connection. Wait a few minutes and try again."
          : "The vision agent could not read that response. Your canvas was not changed.",
      })) as {
        ok: boolean;
        message?: string;
        patch?: CanvasPatch;
        usage?: { counted?: boolean; sessionUsed?: number; sessionLimit?: number };
      };
      if (!response.ok || !payload.ok || !payload.patch) {
        setAgentMessage(payload.message || "The vision agent is resting. Your canvas was not changed.");
        setAgentState("error");
        return;
      }

      if (payload.usage?.counted) {
        setLivePolicy((current) => current ? {
          ...current,
          usage: { sessionUsed: payload.usage?.sessionUsed || current.usage?.sessionUsed || 0 },
        } : current);
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
    } finally {
      if (!starterId && livePolicy?.live.verificationRequired) {
        setTurnstileToken(null);
        setTurnstileResetKey((current) => current + 1);
      }
    }
  };

  useEffect(() => {
    if (boardHasContent && turn.current === 0 && agentState === "idle") {
      setAgentState("active");
    }
  }, [agentState, boardHasContent]);

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
    if (isCompactViewport) {
      // Thinking will auto-reopen the tray; don't yank focus to the launcher.
      setFollowUpOpen(false);
      setFollowUpShouldFocus(false);
      restoreLauncherFocusRef.current = false;
      followUpInputRef.current?.blur();
    }
  };

  const closeFollowUp = () => {
    setFollowUpOpen(false);
    setFollowUpShouldFocus(false);
    followUpInputRef.current?.blur();
    if (isCompactViewport) {
      restoreLauncherFocusRef.current = true;
    }
  };

  const openFollowUpComposer = () => {
    setFollowUpOpen(true);
    setFollowUpShouldFocus(true);
    restoreLauncherFocusRef.current = false;
  };

  const dismissKeyboardOnCanvas = (event: PointerEvent<HTMLElement>) => {
    if (!isCompactViewport || !followUpOpen) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("form, button, a, input, textarea, label")) return;
    closeFollowUp();
  };

  const onFollowUpKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Escape" || !isCompactViewport) return;
    event.preventDefault();
    closeFollowUp();
  };

  const startNewBoard = () => {
    if (boardHasContent && !window.confirm("Start a new board? This clears the locally saved canvas on this device.")) return;
    canvasSnapshot.current?.resetBoard();
    priorTurns.current = [];
    turn.current = 0;
    setBoardHasContent(false);
    setPendingPatch(null);
    setQuestion("");
    setPrompt("");
    setAgentMessage("");
    setFollowUpOpen(false);
    setAgentState("idle");
  };

  const liveUsageLabel = livePolicy?.usage
    ? `${livePolicy.usage.sessionUsed} of ${livePolicy.limits.sessionDaily} live sketches used today`
    : "authored notes don't use the live allowance";

  const followUpStatusLabel =
    agentState === "thinking"
      ? "adding to the board…"
      : agentState === "error"
        ? "connection lost — try again"
        : "ask a follow-up";
  const announceFollowUpStatus =
    showFollowUpSurface && (agentState === "thinking" || agentState === "error");

  return (
    <main
      ref={shellRef}
      className={`${styles.shell} ${satoshi.variable}`}
      onPointerDown={dismissKeyboardOnCanvas}
    >
      <header className={styles.topbar}>
        <Link href="/" className={`${styles.signature} ${lukesFont.className}`}>
          <ArrowLeft size={15} strokeWidth={1.8} />
          <span>luke.brev</span>
        </Link>
        <div className={styles.topbarActions}>
          <button type="button" className={styles.newBoardButton} onClick={startNewBoard}>
            <RotateCcw size={13} /> new board
          </button>
          <div className={styles.presence} aria-label="Vision agent status">
            <span className={styles.presenceDot} /> vision agent
          </div>
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
            <span className={styles.agentGlyph} aria-hidden="true">✦</span>
            <span>unrolling the canvas…</span>
            <span className={styles.loadingLine} aria-hidden="true" />
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
                enterKeyHint="go"
                inputMode="text"
              />
              <button type="submit" disabled={!prompt.trim()} aria-label="Explore">
                <Send size={18} />
              </button>
            </form>

            <div className={styles.usageNote}>{liveUsageLabel}</div>

            {agentState === "error" && (
              <div className={styles.errorNote} role="alert">
                {agentMessage || "The agent lost the thread. Your canvas is still here—try again."}
              </div>
            )}

            <div className={styles.promptList} aria-label="Suggested starting points">
              {CANVAS_STARTER_PROMPTS.map((item, index) => (
                <button
                  key={item.prompt}
                  type="button"
                  onClick={() => explore(item.prompt, item.id)}
                  style={{ "--prompt-tilt": item.tilt } as CSSProperties}
                >
                  <span className={styles.promptNumber}>0{index + 1}</span>
                  <strong>{item.prompt}</strong>
                  <small>{item.note} ↗</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {agentState === "thinking" && turn.current === 0 && (
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

        {livePolicy?.live.verificationRequired && livePolicy.live.turnstileSiteKey &&
          prompt.trim() && agentState !== "thinking" && (
          <div className={styles.verificationNote}>
            <span>quick human check for live prompts</span>
            <TurnstileChallenge
              siteKey={livePolicy.live.turnstileSiteKey}
              resetKey={turnstileResetKey}
              onToken={setTurnstileToken}
            />
          </div>
        )}

        {announceFollowUpStatus && !showFollowUpTray && (
          <div className="sr-only" role="status" aria-live="polite">
            {agentState === "thinking"
              ? `Adding to the board: ${question}`
              : agentMessage || "Connection lost — try again"}
          </div>
        )}

        {showFollowUpLauncher && (
          <button
            ref={followUpLauncherRef}
            type="button"
            className={styles.followUpLauncher}
            onClick={openFollowUpComposer}
          >
            <span className={styles.agentGlyph} aria-hidden="true">✦</span>
            ask a follow-up
          </button>
        )}

        {showFollowUpTray && (
          <form
            className={styles.followUpTray}
            onSubmit={submit}
            onKeyDown={onFollowUpKeyDown}
          >
            <div
              role={announceFollowUpStatus ? "status" : undefined}
              aria-live={announceFollowUpStatus ? "polite" : undefined}
            >
              <span className={styles.agentGlyph} aria-hidden="true">✦</span>
              <label htmlFor="follow-up-prompt">
                {followUpStatusLabel}
              </label>
            </div>
            <input
              ref={followUpInputRef}
              id="follow-up-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="What should we explore next?"
              autoComplete="off"
              enterKeyHint="send"
              inputMode="text"
              disabled={agentState === "thinking"}
            />
            <button
              type="submit"
              disabled={agentState === "thinking" || !prompt.trim()}
              aria-label="Add follow-up to canvas"
            >
              <Send size={17} />
            </button>
            {isCompactViewport && (
              <button
                type="button"
                className={styles.followUpDismiss}
                onClick={closeFollowUp}
                aria-label="Done editing follow-up"
              >
                done
              </button>
            )}
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
