export const CANVAS_STARTER_PROMPTS = [
  { id: "malcom", prompt: "Sketch how MALCOM works", note: "controller + sessions", tilt: "-1.4deg" },
  { id: "dispatch", prompt: "Show me the architecture of Dispatch", note: "agents + worktrees", tilt: ".8deg" },
  { id: "orca", prompt: "How does Orca Mail decide what matters?", note: "signal, not noise", tilt: "-0.5deg" },
  { id: "flowstate", prompt: "Explain FlowState visually", note: "context + action", tilt: "1.2deg" },
  { id: "thread", prompt: "What connects Luke's projects?", note: "follow the thread", tilt: "-.8deg" },
  { id: "surprise", prompt: "Surprise me", note: "dealer's choice", tilt: ".5deg" },
] as const;

export type CanvasStarterId = typeof CANVAS_STARTER_PROMPTS[number]["id"];

export function isMatchingStarterPrompt(id: CanvasStarterId, prompt: string) {
  return CANVAS_STARTER_PROMPTS.some((starter) => starter.id === id && starter.prompt === prompt);
}
