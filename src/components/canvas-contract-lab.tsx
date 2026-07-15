"use client";

import { useEffect, useState } from "react";
import { Braces, Check, ChevronDown, Play, ShieldAlert, X } from "lucide-react";
import {
  compileCanvasPatch,
  validateCanvasPatch,
  type CanvasPatch,
  type CanvasPatchContext,
  type CompiledCanvasPatch,
} from "@/lib/canvas-agent";
import type { CanvasSnapshot } from "./excalidraw-canvas";
import styles from "./canvas-contract-lab.module.css";

type CanvasContractLabProps = {
  getSnapshot: () => CanvasSnapshot | null;
  onPatchApplied?: () => void;
};

type Fixture = "safe" | "confirmation" | "invalid";
type ResultState = {
  tone: "neutral" | "success" | "warning" | "error";
  title: string;
  detail: string;
  issues?: string[];
};

const resultIcon = {
  neutral: Braces,
  success: Check,
  warning: ShieldAlert,
  error: X,
} as const;

function samplePatch(fixture: Fixture, context: CanvasPatchContext): unknown {
  if (fixture === "invalid") {
    return {
      version: "1",
      baseSceneVersion: context.sceneVersion,
      summary: "This malformed patch must be rejected",
      operations: [{
        op: "create",
        ref: "new:off-canvas-note",
        element: {
          kind: "note",
          box: { x: 900, y: 160, width: 240, height: 180 },
          text: "I should never reach the canvas",
        },
      }],
    };
  }

  if (fixture === "confirmation") {
    return {
      version: "1",
      baseSceneVersion: context.sceneVersion,
      summary: "Attempt an unusually large canvas change",
      operations: [{
        op: "create",
        ref: "new:large-change",
        element: {
          kind: "note",
          box: { x: 150, y: 140, width: 700, height: 680 },
          text: "This patch is valid, but its footprint requires human confirmation.",
          style: { theme: "warning", fill: "hachure", weight: "bold" },
        },
      }],
    };
  }

  return {
    version: "1",
    baseSceneVersion: context.sceneVersion,
    summary: "Render a safe model-to-canvas handoff",
    operations: [
      {
        op: "create",
        ref: "new:model-output",
        element: {
          kind: "note",
          box: { x: 70, y: 250, width: 230, height: 220 },
          text: "Model JSON\n(untrusted)",
          style: { theme: "info", fill: "solid", weight: "bold" },
        },
      },
      {
        op: "create",
        ref: "new:contract-gate",
        element: {
          kind: "ellipse",
          box: { x: 370, y: 250, width: 240, height: 220 },
          text: "Validated patch\n(bounded + typed)",
          style: { theme: "success", fill: "solid", weight: "bold" },
        },
      },
      {
        op: "connect",
        ref: "new:validation-arrow",
        from: "new:model-output",
        to: "new:contract-gate",
        label: "validate → compile",
        style: { theme: "accent", stroke: "dashed", weight: "bold" },
      },
    ],
  } satisfies CanvasPatch;
}

export default function CanvasContractLab({
  getSnapshot,
  onPatchApplied,
}: CanvasContractLabProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [source, setSource] = useState("");
  const [pendingPatch, setPendingPatch] = useState<CompiledCanvasPatch | null>(null);
  const [result, setResult] = useState<ResultState>({
    tone: "neutral",
    title: "Awaiting a fixture",
    detail: "Load a sample to exercise the model operation boundary.",
  });

  useEffect(() => {
    setVisible(new URLSearchParams(window.location.search).get("canvasDebug") === "1");
  }, []);

  const ResultIcon = resultIcon[result.tone];
  if (!visible) return null;

  const getContext = () => getSnapshot()?.getPatchContext() ?? null;

  const loadFixture = (fixture: Fixture) => {
    const context = getContext();
    if (!context) {
      setResult({
        tone: "error",
        title: "Canvas unavailable",
        detail: "Wait for Excalidraw to finish opening, then try again.",
      });
      return;
    }

    setSource(JSON.stringify(samplePatch(fixture, context), null, 2));
    setPendingPatch(null);
    onPatchApplied?.();
    setResult({
      tone: "neutral",
      title: `${fixture[0].toUpperCase()}${fixture.slice(1)} fixture loaded`,
      detail: `Bound to ${context.sceneVersion}. Run it when ready.`,
    });
  };

  const applyPatch = async (patch: CompiledCanvasPatch, confirmed = false) => {
    const response = await getSnapshot()?.applyCompiledPatch(patch, { confirmed });
    if (!response || response.status === "unavailable") {
      setResult({
        tone: "error",
        title: "Canvas unavailable",
        detail: "The patch was valid, but Excalidraw was not ready to apply it.",
      });
      return;
    }

    if (response.status === "confirmation-required") {
      setPendingPatch(patch);
      setResult({
        tone: "warning",
        title: "Human confirmation required",
        detail: `Blocked before mutation: ${response.reasons.join(", ")}.`,
      });
      return;
    }

    setPendingPatch(null);
    setResult({
      tone: "success",
      title: "Patch applied as one action",
      detail: `${response.elementIds.length} model-authored elements reached the canvas. Use Excalidraw Undo to reverse them together.`,
    });
  };

  const runPatch = async () => {
    const context = getContext();
    if (!context) {
      setResult({
        tone: "error",
        title: "Canvas unavailable",
        detail: "Wait for Excalidraw to finish opening, then try again.",
      });
      return;
    }

    let input: unknown;
    try {
      input = JSON.parse(source);
    } catch (error) {
      setResult({
        tone: "error",
        title: "Invalid JSON",
        detail: error instanceof Error ? error.message : "The fixture could not be parsed.",
      });
      return;
    }

    const validation = validateCanvasPatch(input, context);
    if (!validation.ok) {
      setPendingPatch(null);
      setResult({
        tone: "error",
        title: "Rejected before canvas access",
        detail: "The contract stopped this payload without changing the scene.",
        issues: validation.issues,
      });
      return;
    }

    const compiled = compileCanvasPatch(
      validation.value.patch,
      context,
      validation.value.risk,
    );
    await applyPatch(compiled);
  };

  return (
    <aside className={`${styles.lab} ${open ? styles.open : ""}`} aria-label="Canvas contract lab">
      <button
        className={styles.handle}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Collapse canvas contract lab" : "Open canvas contract lab"}
      >
        <span><Braces size={15} /> contract lab</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.body}>
          <div className={styles.heading}>
            <div>
              <span>BRE-143 · debug only</span>
              <h2>Model operation boundary</h2>
            </div>
            <i>01 / validate</i>
          </div>

          <div className={styles.fixtures} aria-label="Contract fixtures">
            <button type="button" onClick={() => loadFixture("safe")}>safe apply</button>
            <button type="button" onClick={() => loadFixture("confirmation")}>needs approval</button>
            <button type="button" onClick={() => loadFixture("invalid")}>invalid payload</button>
          </div>

          <label className={styles.editorLabel} htmlFor="canvas-contract-json">
            model-shaped JSON
          </label>
          <textarea
            id="canvas-contract-json"
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              setPendingPatch(null);
            }}
            placeholder="Load a fixture or paste a CanvasPatch…"
            spellCheck={false}
          />

          <div className={`${styles.result} ${styles[result.tone]}`} role="status" aria-live="polite">
            <ResultIcon size={16} />
            <div>
              <strong>{result.title}</strong>
              <span>{result.detail}</span>
              {result.issues && (
                <ul>{result.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={runPatch} disabled={!source.trim()}>
              <Play size={14} fill="currentColor" /> validate + run
            </button>
            {pendingPatch && (
              <button
                type="button"
                className={styles.confirm}
                onClick={() => applyPatch(pendingPatch, true)}
              >
                confirm mutation
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
