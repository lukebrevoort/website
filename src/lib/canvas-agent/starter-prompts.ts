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
