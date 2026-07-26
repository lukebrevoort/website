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

  mytra: {
    summary:
      "Summer 2026 at Mytra: building an agentic debugging agent that works inside airgapped Fortune 500 environments using a locally trained open-source model.",
    operations: [
      textNode("new:title", box(55, 35, 890, 55), "Mytra — debugging agents inside the airgap", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:intern", box(55, 120, 200, 140), "Luke Brevoort\nSummer 2026\nIn-office Brisbane", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:agent", box(300, 120, 240, 140), "Debugging agent\ninternal + customer\nairgapped modes", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:airgap", box(580, 120, 360, 140), "Airgap boundary\nno external APIs\nlocal open-source model", {
        theme: "danger",
        fill: "hachure",
      }),
      note("new:k8s", box(55, 340, 220, 130), "Kubernetes\ndeployment\nboth modes", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:pipeline", box(320, 340, 260, 130), "Agent-native\ndata pipelines\nstructured for agents", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:entity", box(620, 340, 280, 130), "Entity-based\noverhaul\ncomposable model", {
        theme: "info",
        fill: "solid",
      }),
      textNode(
        "new:aside",
        box(55, 520, 890, 70),
        "Two modes, one agent: connected for internal diagnostics, airgapped for Fortune 500 customers with no external network.",
        { theme: "ink" },
      ),
      connect("new:l1", "new:intern", "new:agent", "builds", { theme: "info", stroke: "dashed" }),
      connect("new:l2", "new:agent", "new:airgap", "deploy", { theme: "danger" }),
      connect("new:l3", "new:agent", "new:k8s", "hosted on", { theme: "muted", stroke: "dashed" }),
      connect("new:l4", "new:agent", "new:pipeline", "restructures", { theme: "success", stroke: "dashed" }),
    ],
  },

  zen80: {
    summary:
      "Zen80: pick the Signal tasks, protect time on the calendar, measure whether the day matched your intent.",
    operations: [
      textNode("new:title", box(60, 35, 880, 55), "Zen80 — Signal vs. Noise, measured", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:signal", box(60, 120, 200, 140), "Signal tasks\npick the few\nthat matter", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:noise", box(60, 320, 200, 130), "Noise\nthe churn\nlet it fade", {
        theme: "muted",
        fill: "hachure",
      }),
      note("new:protect", box(310, 120, 220, 140), "Calendar\nprotection\nGoogle blocks", {
        theme: "info",
        fill: "solid",
      }),
      note("new:ratio", box(310, 320, 220, 130), "Day-match\nintent vs actual\nratio", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:flutter", box(580, 120, 200, 140), "Flutter + Dart\nHive local\nProvider state", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:oauth", box(580, 320, 200, 130), "OAuth2\nGoogle Calendar\nwrite access", {
        theme: "info",
        fill: "hachure",
      }),
      textNode(
        "new:aside",
        box(60, 510, 880, 70),
        "A good day is not 'did everything' — it's 'spent time on what I said mattered'. Now you can measure it.",
        { theme: "ink" },
      ),
      connect("new:z1", "new:signal", "new:protect", "defend", { theme: "success" }),
      connect("new:z2", "new:protect", "new:ratio", "measure", { theme: "warning", stroke: "dashed" }),
      connect("new:z3", "new:signal", "new:noise", "vs", { theme: "muted", stroke: "dotted" }),
      connect("new:z4", "new:protect", "new:oauth", "via", { theme: "info", stroke: "dashed" }),
    ],
  },

  "canvas-notion": {
    summary:
      "Canvas-Notion: one-way sync from Canvas LMS to Notion so deadlines, grades, and status flow into your planning system automatically.",
    operations: [
      textNode("new:title", box(55, 35, 890, 55), "Canvas → Notion — academic sync that removes copy-paste", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:canvas", box(55, 120, 200, 140), "Canvas LMS\nsource of truth\nread-only", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:api", box(290, 120, 200, 140), "Canvas API\nassignments\ndue dates grades", {
        theme: "info",
        fill: "solid",
      }),
      note("new:mapper", box(530, 120, 200, 140), "Entity mapper\ntranslate to\nNotion rows", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:notion", box(760, 120, 180, 140), "Notion DB\nplanning hub\nwrite target", {
        theme: "accent",
        fill: "solid",
      }),
      note("new:schedule", box(290, 330, 200, 130), "Scheduled sync\nnot live events\nacademic pace", {
        theme: "muted",
        fill: "hachure",
      }),
      note("new:fields", box(530, 330, 410, 130), "Fields: priority, due date,\ngrade, submission status\nsemantics preserved", {
        theme: "info",
        fill: "solid",
      }),
      textNode(
        "new:aside",
        box(55, 510, 890, 70),
        "Python + Canvas API + Notion API. One-way sync: Canvas is the source, Notion is where you plan.",
        { theme: "ink" },
      ),
      connect("new:c1", "new:canvas", "new:api", "export", { theme: "warning", stroke: "dashed" }),
      connect("new:c2", "new:api", "new:mapper", "map", { theme: "info" }),
      connect("new:c3", "new:mapper", "new:notion", "sync", { theme: "accent" }),
      connect("new:c4", "new:schedule", "new:api", "triggers", { theme: "muted", stroke: "dotted" }),
    ],
  },

  hftc: {
    summary:
      "HFTC trading: market-making plus momentum strategies running on Backtrader against the SHIFT competition platform.",
    operations: [
      textNode("new:title", box(60, 35, 880, 55), "HFTC — market making meets momentum", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:mm", box(60, 120, 200, 140), "Market-making\ntwo-sided quotes\nspread discipline", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:mom", box(60, 320, 200, 130), "Momentum\ndirectional\nprice signals", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:shell", box(310, 120, 220, 140), "Risk shell\nshared by both\nposition limits", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:backtest", box(310, 320, 220, 130), "Backtrader\nbacktest + live\none framework", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:shift", box(570, 120, 200, 140), "SHIFT platform\ncompetition\nexchange", {
        theme: "accent",
        fill: "hachure",
      }),
      note("new:spread", box(570, 320, 200, 130), "Bid-ask\nspread capture\ninventory risk", {
        theme: "info",
        fill: "hachure",
      }),
      textNode(
        "new:aside",
        box(60, 510, 880, 70),
        "Python + Backtrader. Stability from the spread, directional upside from momentum — balanced for competition.",
        { theme: "ink" },
      ),
      connect("new:h1", "new:mm", "new:shell", "feeds", { theme: "info" }),
      connect("new:h2", "new:mom", "new:shell", "feeds", { theme: "success" }),
      connect("new:h3", "new:shell", "new:shift", "route orders", { theme: "accent" }),
      connect("new:h4", "new:shell", "new:backtest", "test", { theme: "muted", stroke: "dashed" }),
    ],
  },

  "while-unemployed": {
    summary:
      "while_unemployed: AI mock interviewer with live code analysis and voice — earned a 100% class evaluation.",
    operations: [
      textNode("new:title", box(50, 35, 900, 55), "while_unemployed — AI interviewer reacts to your code in real time", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:next", box(50, 120, 200, 140), "Next.js UI\ncandidate experience\ncode editor", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:fastapi", box(290, 120, 200, 140), "FastAPI backend\ninterviewer logic\nOpenAI", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:socket", box(530, 120, 220, 140), "Socket.IO\nlive events\nas you code", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:voice", box(790, 120, 160, 140), "Voice input\nspoken answers\nrealistic practice", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:supabase", box(290, 330, 200, 130), "Supabase\nsessions\nauth", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:react", box(530, 330, 220, 130), "Live analysis\nreacts as you type\nnot after submit", {
        theme: "warning",
        fill: "solid",
      }),
      textNode(
        "new:aside",
        box(50, 510, 900, 70),
        "Next.js + FastAPI + Socket.IO + OpenAI. MVP earned 100%. Live at while-unemployed.vercel.app",
        { theme: "ink" },
      ),
      connect("new:w1", "new:next", "new:socket", "code stream", { theme: "info" }),
      connect("new:w2", "new:socket", "new:fastapi", "realtime", { theme: "warning" }),
      connect("new:w3", "new:voice", "new:socket", "voice", { theme: "muted", stroke: "dashed" }),
      connect("new:w4", "new:fastapi", "new:react", "analysis", { theme: "success", stroke: "dashed" }),
      connect("new:w5", "new:next", "new:supabase", "persist", { theme: "info", stroke: "dotted" }),
    ],
  },

  "sga-finance": {
    summary:
      "SGA Finance Platform: CampusGroups exports become review-ready Sheets and Senate-ready Slides — now handling over $2.5M.",
    operations: [
      textNode("new:title", box(50, 35, 900, 55), "SGA Finance — $2.5M automated, one export at a time", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:cg", box(50, 120, 200, 140), "CampusGroups\nSGA financial\nexports", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:model", box(290, 120, 220, 140), "Financial data\nmodel\nnormalize once", {
        theme: "info",
        fill: "solid",
      }),
      note("new:sheets", box(550, 120, 220, 140), "Google Sheets\nweekly review\nformatted", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:slides", box(810, 120, 140, 140), "Google Slides\nSenate budget\npresentations", {
        theme: "accent",
        fill: "solid",
      }),
      note("new:web", box(290, 330, 220, 130), "Next.js web app\noperator UI\nVercel hosted", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:scale", box(550, 330, 400, 130), "Production use\n$2.5M+ handled\nno more manual formatting", {
        theme: "warning",
        fill: "hachure",
      }),
      textNode(
        "new:aside",
        box(50, 510, 900, 70),
        "Automate the formatting, not the judgment. Reviewers spend time on numbers, not slides.",
        { theme: "ink" },
      ),
      connect("new:s1", "new:cg", "new:model", "import", { theme: "warning" }),
      connect("new:s2", "new:model", "new:sheets", "weekly", { theme: "success" }),
      connect("new:s3", "new:model", "new:slides", "Senate", { theme: "accent" }),
      connect("new:s4", "new:web", "new:model", "operator", { theme: "muted", stroke: "dashed" }),
    ],
  },

  about: {
    summary:
      "Luke Brevoort: software engineer at Mytra, builder of developer tools and workflow automation. Stevens CS grad.",
    operations: [
      textNode("new:title", box(55, 40, 890, 55), "Luke Brevoort — software engineer, builder", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:now", box(55, 130, 220, 140), "Now\nMytra (Brisbane)\nSummer 2026 internship", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:education", box(315, 130, 220, 140), "Education\nStevens CS\ngraduated 2026", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:projects", box(575, 130, 370, 140), "Projects\nMALCOM · Dispatch\nOrca Mail · FlowState\nZen80 · +more", {
        theme: "warning",
        fill: "hachure",
      }),
      note("new:focus", box(55, 350, 890, 120), "Focus: developer tools, workflow automation, and the question that runs through everything — how does software hand agency back to people instead of taking it away?",
        { theme: "accent", fill: "solid" },
      ),
      textNode(
        "new:aside",
        box(55, 520, 890, 60),
        "This site is a portfolio and a sketchbook. Pick a thread above, or ask anything.",
        { theme: "ink" },
      ),
      connect("new:a1", "new:education", "new:projects", "leads to", { theme: "muted", stroke: "dashed" }),
      connect("new:a2", "new:now", "new:focus", "working on", { theme: "info" }),
      connect("new:a3", "new:projects", "new:focus", "built around", { theme: "warning", stroke: "dashed" }),
    ],
  },

  "working-style": {
    summary:
      "How Luke works: MALCOM for remote execution, Dispatch for parallel agents, Obsidian for linked thinking, Excalidraw for early ideas.",
    operations: [
      textNode("new:title", box(50, 40, 900, 55), "Working style — tools for durable, inspectable work", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:malcom-use", box(50, 130, 200, 140), "MALCOM\nphone-to-PR\ncommute coding", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:dispatch-use", box(290, 130, 200, 140), "Dispatch\nparallel agents\nworktrees", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:obsidian", box(530, 130, 200, 140), "Obsidian\nlinked notes\nZettelkasten", {
        theme: "muted",
        fill: "hachure",
      }),
      note("new:excalidraw", box(770, 130, 180, 140), "Excalidraw\nearly ideas\ndiagrams", {
        theme: "success",
        fill: "solid",
      }),
      note("new:loop", box(170, 350, 660, 110), "Async-first: ideas in Excalidraw → fleshed in Obsidian → built with MALCOM/Dispatch → shipped.\nMobile review, desktop build.",
        { theme: "accent", fill: "solid" },
      ),
      textNode(
        "new:aside",
        box(50, 510, 900, 60),
        "Visible seams matter: know what the system is doing, where it's uncertain, and when to override.",
        { theme: "ink" },
      ),
      connect("new:ws1", "new:excalidraw", "new:obsidian", "capture", { theme: "muted", stroke: "dashed" }),
      connect("new:ws2", "new:obsidian", "new:malcom-use", "inform", { theme: "info", stroke: "dashed" }),
      connect("new:ws3", "new:malcom-use", "new:dispatch-use", "execute", { theme: "warning" }),
      connect("new:ws4", "new:dispatch-use", "new:excalidraw", "iterate", { theme: "success", stroke: "dotted" }),
    ],
  },

  principles: {
    summary:
      "Six principles across Luke's work: local ownership, visible seams, recoverable state, calm interfaces, constrained automation, human approval for consequential moves.",
    operations: [
      textNode("new:title", box(50, 40, 900, 55), "Principles — the philosophy that runs through every project", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:p1", box(50, 130, 180, 110), "Local ownership\ntools live close\nto the person", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:p2", box(270, 130, 180, 110), "Visible seams\nknow what the\nsystem is doing", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:p3", box(490, 130, 180, 110), "Recoverable state\ndisconnect-tolerant\nnever lose work", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:p4", box(710, 130, 180, 110), "Calm interfaces\nquiet motion\nno noise", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:p5", box(120, 300, 200, 110), "Constrained\nautomation\ndo less, better", {
        theme: "accent",
        fill: "hachure",
      }),
      note("new:p6", box(370, 300, 200, 110), "Human approval\nfor consequential\nmoves", {
        theme: "danger",
        fill: "solid",
      }),
      note("new:question", box(610, 300, 300, 110), "The core question:\nhow does software hand agency back,\nnot take it away?",
        { theme: "ink", fill: "solid" },
      ),
      textNode(
        "new:aside",
        box(50, 460, 900, 60),
        "From Orca Mail to MALCOM to Zen80: same instinct applied to different friction points.",
        { theme: "ink" },
      ),
      connect("new:pr1", "new:p1", "new:question", undefined, { theme: "info", stroke: "dashed" }),
      connect("new:pr2", "new:p2", "new:question", undefined, { theme: "warning", stroke: "dashed" }),
      connect("new:pr3", "new:p3", "new:question", undefined, { theme: "success", stroke: "dashed" }),
      connect("new:pr4", "new:p4", "new:question", undefined, { theme: "muted", stroke: "dashed" }),
    ],
  },

  website: {
    summary:
      "This website: a portfolio and an experiment. The Explore page is a live canvas that answers questions about Luke's work.",
    operations: [
      textNode("new:title", box(50, 40, 900, 55), "This website — portfolio + living sketchbook", {
        theme: "accent",
        weight: "bold",
      }),
      note("new:portfolio", box(50, 130, 200, 140), "Portfolio\nprojects\nwriting", {
        theme: "info",
        fill: "hachure",
      }),
      note("new:explore", box(290, 130, 220, 140), "Explore\nlive canvas\nask anything", {
        theme: "warning",
        fill: "solid",
      }),
      note("new:agent", box(550, 130, 200, 140), "Canvas agent\nExcalidraw\nvision AI", {
        theme: "success",
        fill: "hachure",
      }),
      note("new:tech", box(790, 130, 160, 140), "Next.js\nVercel\nWebLLM", {
        theme: "muted",
        fill: "solid",
      }),
      note("new:experiment", box(170, 340, 660, 110), "You're standing on an experiment right now. The canvas is real — it responds to questions, draws diagrams, and remembers what you explored.",
        { theme: "accent", fill: "solid" },
      ),
      textNode(
        "new:aside",
        box(50, 500, 900, 60),
        "Built with Next.js, deployed on Vercel. The canvas runs in your browser — no server required for drawing.",
        { theme: "ink" },
      ),
      connect("new:ww1", "new:portfolio", "new:explore", "leads to", { theme: "info" }),
      connect("new:ww2", "new:explore", "new:agent", "powered by", { theme: "warning" }),
      connect("new:ww3", "new:agent", "new:tech", "built on", { theme: "muted", stroke: "dashed" }),
      connect("new:ww4", "new:portfolio", "new:experiment", "is", { theme: "accent", stroke: "dotted" }),
    ],
  },

  surprise: {
    summary:
      "A dealer's-choice sketch of the handoff: curiosity sets direction, agents explore with bounds, artifacts return for judgment.",
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
        "Dealer's choice tonight: treat the canvas like a living sketchbook, not a chatbot transcript.",
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
