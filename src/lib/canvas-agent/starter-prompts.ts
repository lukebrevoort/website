export const CANVAS_STARTER_PROMPTS = [
  {
    id: "malcom",
    prompt: "Sketch how MALCOM works",
    note: "controller + sessions",
    tilt: "-1.4deg",
    followUps: [
      "Add the policy check before every tool call",
      "Show where workspaces and logs actually live",
    ],
  },
  {
    id: "dispatch",
    prompt: "Show me the architecture of Dispatch",
    note: "agents + worktrees",
    tilt: ".8deg",
    followUps: [
      "Zoom in on the xterm ↔ tmux pairing",
      "Add how pins and personas bring evidence home",
    ],
  },
  {
    id: "orca",
    prompt: "How does Orca Mail decide what matters?",
    note: "signal, not noise",
    tilt: "-0.5deg",
    followUps: [
      "Split human threads from automation more clearly",
      "Show Zen Mode beside the attention queue",
    ],
  },
  {
    id: "flowstate",
    prompt: "Explain FlowState visually",
    note: "context + action",
    tilt: "1.2deg",
    followUps: [
      "Highlight the approval gate for risky actions",
      "Add the daily plan loop with human override",
    ],
  },
  {
    id: "thread",
    prompt: "What connects Luke's projects?",
    note: "follow the thread",
    tilt: "-.8deg",
    followUps: [
      "Compare MALCOM and Dispatch on the same board",
      "Call out the shared design principles in the middle",
    ],
  },
  {
    id: "mytra",
    prompt: "What's Luke doing at Mytra?",
    note: "airgapped debugging",
    tilt: "1.5deg",
    followUps: [
      "Show the airgap boundary more clearly",
      "Add how agent-native pipelines differ from traditional ETL",
    ],
  },
  {
    id: "zen80",
    prompt: "Explain Zen80's Signal vs. Noise",
    note: "focus, not lists",
    tilt: "-1.2deg",
    followUps: [
      "Show the intent-vs-actual ratio in action",
      "Add how calendar protection works",
    ],
  },
  {
    id: "canvas-notion",
    prompt: "How does Canvas-Notion work?",
    note: "LMS to planning sync",
    tilt: ".6deg",
    followUps: [
      "Show the scheduled sync cycle",
      "Map one assignment to its Notion row",
    ],
  },
  {
    id: "hftc",
    prompt: "Walk through the HFTC trading system",
    note: "market making + momentum",
    tilt: "-.7deg",
    followUps: [
      "Draw the dual-strategy lane",
      "Show how bid-ask spread discipline works",
    ],
  },
  {
    id: "while-unemployed",
    prompt: "What was while_unemployed?",
    note: "AI mock interviewer",
    tilt: "1.1deg",
    followUps: [
      "Show the real-time interview loop",
      "Map how live code analysis flows",
    ],
  },
  {
    id: "sga-finance",
    prompt: "Show the SGA Finance platform",
    note: "$2.5M automation",
    tilt: "-.9deg",
    followUps: [
      "Draw one input fanning to two outputs",
      "Add how CampusGroups feeds the pipeline",
    ],
  },
  {
    id: "about",
    prompt: "Tell me about Luke",
    note: "quick intro",
    tilt: "0.4deg",
    followUps: [
      "Highlight the thread across his work",
      "Show where he was educated and what he cares about",
    ],
  },
  {
    id: "working-style",
    prompt: "How does Luke actually work?",
    note: "tools and flow",
    tilt: "-.6deg",
    followUps: [
      "Show MALCOM in his daily loop",
      "Add how he moves between async and synchronous",
    ],
  },
  {
    id: "principles",
    prompt: "What principles run through Luke's work?",
    note: "shared philosophy",
    tilt: ".3deg",
    followUps: [
      "Give examples from each project",
      "Show where agency gets returned to people",
    ],
  },
  {
    id: "website",
    prompt: "Walk through this website",
    note: "portfolio + experiments",
    tilt: "-1.0deg",
    followUps: [
      "Show the Explore experience",
      "Add how the canvas agent works",
    ],
  },
  {
    id: "surprise",
    prompt: "Surprise me",
    note: "dealer's choice",
    tilt: ".5deg",
    followUps: [
      "Annotate where a human should stay in the loop",
      "Turn this into a before/after of agency returned",
    ],
  },
] as const;

export type CanvasStarterId = typeof CANVAS_STARTER_PROMPTS[number]["id"];

export function isMatchingStarterPrompt(id: CanvasStarterId, prompt: string) {
  return CANVAS_STARTER_PROMPTS.some((starter) => starter.id === id && starter.prompt === prompt);
}

export function getStarterFollowUps(id: CanvasStarterId): readonly string[] {
  const starter = CANVAS_STARTER_PROMPTS.find((item) => item.id === id);
  return starter?.followUps ?? [];
}
