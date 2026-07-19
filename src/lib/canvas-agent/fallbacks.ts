import type { CanvasPatch } from "./contract";
import type { CanvasPatchContext } from "./validation";
import type { CanvasStarterId } from "./starter-prompts";

type Story = {
  title: string;
  nodes: [string, string, string];
  labels: [string, string];
  summary: string;
};

const STORIES: Record<CanvasStarterId, Story> = {
  malcom: {
    title: "MALCOM turns intent into supervised agent work",
    nodes: ["Controller\ninterprets the goal", "Sessions\nisolate each worker", "Review loop\nkeeps humans in control"],
    labels: ["dispatch", "verify"],
    summary: "An authored map of MALCOM's controller, isolated sessions, and review loop.",
  },
  dispatch: {
    title: "Dispatch makes parallel work visible",
    nodes: ["One task\nwith clear context", "Agents + worktrees\nmove independently", "Pins + review\nbring evidence home"],
    labels: ["fan out", "reconcile"],
    summary: "An authored sketch of Dispatch from task context through isolated work to review.",
  },
  orca: {
    title: "Orca Mail separates signal from inbox noise",
    nodes: ["Incoming mail\narrives unranked", "Context + intent\nscore what matters", "Focused queue\ninvites the next action"],
    labels: ["interpret", "surface"],
    summary: "An authored sketch of Orca Mail's signal-to-action decision path.",
  },
  flowstate: {
    title: "FlowState keeps context close to action",
    nodes: ["Capture\nthe working context", "Shape\nthe next useful move", "Act + learn\nwithout losing the thread"],
    labels: ["focus", "feedback"],
    summary: "An authored loop showing how FlowState turns context into action and learning.",
  },
  thread: {
    title: "A shared thread runs through Luke's projects",
    nodes: ["Messy inputs\nfrom real work", "Human-centered systems\nmake intent legible", "Calm interfaces\nreturn agency"],
    labels: ["translate", "empower"],
    summary: "An authored map of the human-agency thread connecting Luke's projects.",
  },
  surprise: {
    title: "The interesting part is the handoff",
    nodes: ["Human curiosity\nsets direction", "Agents explore\nwith bounded freedom", "Artifacts return\nfor judgment + play"],
    labels: ["delegate", "make tangible"],
    summary: "An authored surprise about the handoff between curiosity, agents, and tangible work.",
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
    operations: [
      {
        op: "create",
        ref: "new:authored-title",
        element: { kind: "text", box: { x: 105, y: 115, width: 790, height: 70 }, text: story.title, style: { theme: "accent", weight: "bold" } },
      },
      ...story.nodes.map((text, index) => ({
        op: "create" as const,
        ref: `new:authored-node-${index + 1}` as `new:${string}`,
        element: {
          kind: "note" as const,
          box: { x: 90 + index * 315, y: 330, width: 220, height: 210 },
          text,
          style: { theme: index === 1 ? "info" as const : "warning" as const, fill: "hachure" as const },
        },
      })),
      {
        op: "connect",
        ref: "new:authored-link-1",
        from: "new:authored-node-1",
        to: "new:authored-node-2",
        label: story.labels[0],
        style: { theme: "muted", stroke: "dashed" },
      },
      {
        op: "connect",
        ref: "new:authored-link-2",
        from: "new:authored-node-2",
        to: "new:authored-node-3",
        label: story.labels[1],
        style: { theme: "accent", stroke: "dashed" },
      },
    ],
  };
}
