import type {
  CanvasElementSpec,
  CanvasOperation,
  CanvasPatch,
  CanvasStyle,
  NewCanvasElementRef,
  NormalizedBox,
} from "./contract";
import type { CanvasPatchContext } from "./validation";
import type { CanvasStarterId } from "./starter-prompts";

type StoryPatch = {
  summary: string;
  operations: CanvasOperation[];
};

function box(x: number, y: number, width: number, height: number): NormalizedBox {
  return { x, y, width, height };
}

function create(ref: NewCanvasElementRef, element: CanvasElementSpec): CanvasOperation {
  return { op: "create", ref, element };
}

function note(
  ref: NewCanvasElementRef,
  geometry: NormalizedBox,
  text: string,
  style?: CanvasStyle,
): CanvasOperation {
  return create(ref, { kind: "note", box: geometry, text, ...(style ? { style } : {}) });
}

function textNode(
  ref: NewCanvasElementRef,
  geometry: NormalizedBox,
  text: string,
  style?: CanvasStyle,
): CanvasOperation {
  return create(ref, { kind: "text", box: geometry, text, ...(style ? { style } : {}) });
}

function connect(
  ref: NewCanvasElementRef,
  from: NewCanvasElementRef,
  to: NewCanvasElementRef,
  label?: string,
  style?: CanvasStyle,
): CanvasOperation {
  return {
    op: "connect",
    ref,
    from,
    to,
    ...(label ? { label } : {}),
    ...(style ? { style } : {}),
  };
}

const STORIES: Record<CanvasStarterId, StoryPatch> = {
  malcom: {
    summary:
      "MALCOM as the durable execution plane: Hermes talks, MALCOM runs sessions behind a policy gate on a remote Mac.",
    operations: [
      textNode("new:title", box(70, 40, 860, 55), "MALCOM — intent → supervised work on a remote Mac", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:hermes", box(70, 130, 220, 130), "Hermes\nconversational\norchestrator", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:malcom", box(390, 130, 240, 130), "MALCOM\ncontroller + CLI\nsession registry", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:policy", box(720, 130, 210, 130), "Policy gate\ncredentials,\nscope, approval", {
        theme: "danger",
        fill: "hachure",
      }),
      note("new:sessions", box(70, 360, 250, 150), "Isolated sessions\nCodex · OpenCode\nCursor · shell", {
        theme: "info",
        fill: "solid",
      }),
      note("new:workspace", box(390, 360, 250, 150), "Workspace layout\nworktrees, logs,\nrecovery paths", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:adapters", box(720, 360, 210, 150), "Adapters\nGitHub · Notion\nLinear", {
        theme: "muted",
        fill: "solid",
      }),
      textNode(
        "new:aside",
        box(70, 560, 860, 70),
        "Hermes sets direction. MALCOM owns what actually runs — and keeps it inspectable after disconnects.",
        { theme: "ink", weight: "regular" },
      ),
      connect("new:link-talk", "new:hermes", "new:malcom", "dispatch", { theme: "muted", stroke: "dashed" }),
      connect("new:link-gate", "new:malcom", "new:policy", "check first", { theme: "accent", stroke: "dashed" }),
      connect("new:link-run", "new:malcom", "new:sessions", "start / track", { theme: "info" }),
      connect("new:link-home", "new:sessions", "new:workspace", "stable FS", { theme: "warning", stroke: "dashed" }),
    ],
  },

  dispatch: {
    summary:
      "Dispatch fans one task into parallel worktree-isolated agents, then brings evidence home via pins and review.",
    operations: [
      textNode("new:title", box(60, 35, 880, 55), "Dispatch — parallel agents, one visible control plane", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:task", box(60, 120, 220, 150), "One task\nclear context\nscoped tools", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:agent-a", box(360, 110, 190, 130), "Agent A\ntmux session\nworktree A", {
        theme: "info",
        fill: "solid",
      }),
      note("new:agent-b", box(580, 110, 190, 130), "Agent B\ntmux session\nworktree B", {
        theme: "info",
        fill: "solid",
      }),
      note("new:agent-c", box(800, 110, 170, 130), "Agent C\n…or terminal", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:bridge", box(360, 310, 280, 130), "xterm.js ↔ tmux\ndisconnect-tolerant\nbrowser pairing", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:review", box(680, 310, 250, 130), "Pins · media\npersonas · review\nevidence returns", {
        theme: "accent",
        fill: "hachure",
      }),
      textNode(
        "new:aside",
        box(60, 490, 880, 70),
        "Close the browser — agents keep running. Reconnect the terminal, read the pins, reconcile the work.",
        { theme: "ink" },
      ),
      connect("new:fan-a", "new:task", "new:agent-a", "fan out", { theme: "muted", stroke: "dashed" }),
      connect("new:fan-b", "new:task", "new:agent-b", undefined, { theme: "muted", stroke: "dashed" }),
      connect("new:pair", "new:agent-a", "new:bridge", "live UI", { theme: "info", stroke: "dashed" }),
      connect("new:home", "new:bridge", "new:review", "reconcile", { theme: "accent" }),
    ],
  },

  orca: {
    summary:
      "Orca Mail pipelines read-only Gmail through Human Signal so attention and Zen writing stay on human conversations.",
    operations: [
      textNode("new:title", box(60, 35, 880, 55), "Orca Mail — signal first, then calm attention", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:gmail", box(50, 130, 200, 140), "Gmail\nread-only OAuth\nno send rights", {
        theme: "muted",
        fill: "hachure",
      }),
      note("new:normalize", box(290, 130, 200, 140), "Normalizer\nclean internal\nmail model", {
        theme: "info",
        fill: "solid",
      }),
      note("new:signal", box(530, 130, 220, 140), "Human Signal\npeople vs\nautomation", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:human", box(290, 360, 200, 140), "Human thread\nsurfaced next\naction", {
        theme: "success",
        fill: "solid",
      }),
      note("new:noise", box(530, 360, 200, 140), "Automation\nfiltered off\nthe main path", {
        theme: "danger",
        fill: "hachure",
      }),
      note("new:zen", box(770, 245, 180, 160), "Zen Mode\nfull-screen\nfocused reply", {
        theme: "info",
        fill: "hachure",
      }),
      textNode(
        "new:aside",
        box(50, 550, 900, 65),
        "Privacy by design: Orca can read and help you draft — it cannot send or alter mail on your behalf.",
        { theme: "ink" },
      ),
      connect("new:in", "new:gmail", "new:normalize", "ingest", { theme: "muted", stroke: "dashed" }),
      connect("new:score", "new:normalize", "new:signal", "interpret", { theme: "info" }),
      connect("new:keep", "new:signal", "new:human", "surface", { theme: "success" }),
      connect("new:drop", "new:signal", "new:noise", "filter", { theme: "danger", stroke: "dashed" }),
    ],
  },

  flowstate: {
    summary:
      "FlowState wrapped OpenCode with study agents and approval-gated app actions so context stayed close to the next move.",
    operations: [
      textNode("new:title", box(55, 35, 890, 55), "FlowState — local study context with human override", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:core", box(380, 120, 230, 140), "OpenCode core\nstreaming assistant\nlocal SQLite", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:agents", box(55, 160, 250, 140), "Specialized agents\nschedule · plan\ncourse context", {
        theme: "info",
        fill: "solid",
      }),
      note("new:apps", box(690, 160, 250, 140), "Connected apps\nNotion · Gmail\nCalendar · LMS", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:gate", box(380, 340, 230, 130), "Approval gate\nrisky actions\nwait for you", {
        theme: "danger",
        fill: "hachure",
      }),
      note("new:plan", box(55, 360, 250, 130), "Daily plan\nscannable moves\noverride anytime", {
        theme: "success",
        fill: "solid",
      }),
      note("new:calm", box(690, 360, 250, 130), "Calm UI\nquiet motion\nmobile replans", {
        theme: "info",
        fill: "hachure",
      }),
      textNode(
        "new:aside",
        box(55, 540, 890, 65),
        "Completed reference artifact (2025–2026): the idea was durable local context before connected tooling became default.",
        { theme: "ink" },
      ),
      connect("new:spoke-a", "new:agents", "new:core", "context", { theme: "info", stroke: "dashed" }),
      connect("new:spoke-b", "new:core", "new:apps", "integrate", { theme: "muted", stroke: "dashed" }),
      connect("new:risk", "new:core", "new:gate", "if risky", { theme: "accent" }),
      connect("new:day", "new:gate", "new:plan", "approved →", { theme: "success", stroke: "dashed" }),
    ],
  },

  thread: {
    summary:
      "A shared thread across Luke's projects: messy real-world inputs become legible systems that return agency.",
    operations: [
      textNode("new:title", box(55, 40, 890, 55), "The thread — systems that return judgment to people", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:malcom", box(55, 130, 200, 140), "MALCOM\ninspectable\nexecution", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:dispatch", box(285, 130, 200, 140), "Dispatch\nparallel work\nmade visible", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:orca", box(515, 130, 200, 140), "Orca Mail\nhuman signal\nover noise", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:flow", box(745, 130, 200, 140), "FlowState\ncontext next\nto action", {
        theme: "muted",
        fill: "hachure",
      }),
      note(
        "new:principle",
        box(170, 360, 660, 130),
        "Not automate everything — surface the right context,\nkeep seams visible, ask before consequential moves.",
        { theme: "accent", fill: "solid" },
      ),
      textNode(
        "new:aside",
        box(55, 540, 890, 60),
        "Same question in every project: how does software hand agency back, not take it away?",
        { theme: "ink" },
      ),
      connect("new:t1", "new:malcom", "new:principle", "recover", { theme: "muted", stroke: "dashed" }),
      connect("new:t2", "new:dispatch", "new:principle", "reconcile", { theme: "muted", stroke: "dashed" }),
      connect("new:t3", "new:orca", "new:principle", "attend", { theme: "muted", stroke: "dashed" }),
      connect("new:t4", "new:flow", "new:principle", "approve", { theme: "accent", stroke: "dashed" }),
    ],
  },

  surprise: {
    summary:
      "A dealer’s-choice sketch of the handoff: curiosity sets direction, agents explore with bounds, artifacts return for judgment.",
    operations: [
      textNode("new:title", box(60, 40, 880, 55), "Surprise — the interesting part is the handoff", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:curiosity", box(70, 140, 240, 160), "Human curiosity\nsets the aim\nasks the weird question", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:agents", box(380, 140, 240, 160), "Bounded agents\nexplore in lanes\nleave a trail", {
        theme: "info",
        fill: "solid",
      }),
      note("new:artifacts", box(690, 140, 240, 160), "Artifacts return\nsketches · pins\ndiffs · demos", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:judgment", box(230, 380, 540, 130), "You keep the judgment seat.\nPlay with the board — redraw, reject, ask again.", {
        theme: "accent",
        fill: "solid",
      }),
      textNode(
        "new:aside",
        box(70, 550, 860, 60),
        "Dealer’s choice tonight: treat the canvas like a living sketchbook, not a chatbot transcript.",
        { theme: "ink" },
      ),
      connect("new:s1", "new:curiosity", "new:agents", "delegate", { theme: "muted", stroke: "dashed" }),
      connect("new:s2", "new:agents", "new:artifacts", "make tangible", { theme: "info" }),
      connect("new:s3", "new:artifacts", "new:judgment", "review", { theme: "accent" }),
      connect("new:s4", "new:judgment", "new:curiosity", "next spark", { theme: "warning", stroke: "dotted" }),
    ],
  },
};

export function createAuthoredStarterPatch(
  starterId: CanvasStarterId,
  context: CanvasPatchContext,
): CanvasPatch {
  const story = STORIES[starterId];
  return {
    version: "1",
    baseSceneVersion: context.sceneVersion,
    summary: story.summary,
    operations: story.operations,
  };
}
