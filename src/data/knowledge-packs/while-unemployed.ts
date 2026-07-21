import type { KnowledgePack } from "./schema";

export const whileUnemployedPack: KnowledgePack = {
  slug: "while-unemployed",
  title: "while_unemployed",
  summary:
    "A completed class MVP for technical-interview practice, pairing an AI interviewer, live code analysis, and voice interaction; the MVP and demo earned a 100% evaluation.",
  purpose:
    "Give technical-interview candidates a realistic practice loop: an AI interviewer asks questions, analyzes live code, and converses by voice — turning passive interview prep into a simulated, interactive conversation that can be evaluated.",
  intendedUser:
    "Developers preparing for technical interviews who want a mock interviewer that reacts to their code and answers in real time, not just a question bank.",
  architecture:
    "A Next.js + TypeScript frontend (Tailwind CSS) hosts the candidate experience. A FastAPI backend hosts the AI interviewer logic and OpenAI integration. Socket.IO carries live conversation and code-analysis events between client and server so the interviewer can react as the candidate types and speaks. Supabase backs persistence and auth. The build earned a 100% evaluation as a class MVP.",
  components: [
    { name: "Next.js candidate UI", role: "Frontend for the interview session: code editor, prompts, and voice interaction." },
    { name: "FastAPI interviewer backend", role: "Hosts the AI interviewer logic and OpenAI calls on the server." },
    { name: "OpenAI integration", role: "Powers question generation, response evaluation, and the conversational interviewer." },
    { name: "Socket.IO live channel", role: "Streams conversation and live code-analysis events so the interviewer reacts in real time." },
    { name: "Supabase persistence/auth", role: "Stores sessions and handles authentication." },
    { name: "Voice interaction", role: "Lets the candidate speak with the interviewer rather than only typing." },
  ],
  designDecisions: [
    { decision: "AI interviewer over a question bank", rationale: "Real prep needs reactive follow-ups and pushback on answers; a static bank cannot simulate that." },
    { decision: "Live code analysis via Socket.IO", rationale: "The interviewer should react as the candidate writes — not only after submission — which needs streaming events." },
    { decision: "Voice interaction included", rationale: "Spoken interviews are a different skill than written ones; including voice made the practice more realistic." },
    { decision: "FastAPI + OpenAI on the backend", rationale: "Keeps the API key server-side and lets Python host the interviewer orchestration cleanly." },
    { decision: "Next.js + Supabase for the frontend", rationale: "Fast UI delivery plus lightweight persistence/auth for a class MVP scope." },
  ],
  status: "Completed (2025). Class MVP; the demo earned a 100% evaluation.",
  limitations: [
    "MVP scope: interview richness is bounded by a single OpenAI-backed interviewer flow, not a platform of mock interviewers.",
    "Class project — not maintained as a product; no active user base.",
    "Live code analysis depends on Socket.IO reliability and OpenAI latency; not tuned for scale.",
    "Voice interaction adds complexity that an MVP-grade deployment may not harden.",
  ],
  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "Socket.IO", "Supabase", "OpenAI"],
  links: [
    { label: "Source", url: "https://github.com/lukebrevoort/while_unemployed" },
    { label: "Demo", url: "https://while-unemployed.vercel.app" },
  ],
  visualVocabulary: [
    { token: "Primary near-black", usage: "Editor/interviewer surfaces", value: "#0f172a" },
    { token: "Sky-blue accent", usage: "Live events, voice, AI responses", value: "#0284c7" },
    { token: "Conversation loop motif", usage: "Depict candidate ↔ AI interviewer as a real-time loop, not one-shot Q&A" },
    { token: "Live code-analysis glyph", usage: "Represent the editor streaming analysis to the interviewer" },
  ],
  diagramPatterns: [
    {
      name: "Real-time interview loop",
      description: "Candidate ↔ AI interviewer with code and voice flowing over Socket.IO in a live loop.",
      nodes: ["Candidate UI (Next.js)", "Socket.IO channel", "FastAPI interviewer", "OpenAI"],
      style: "Bidirectional loop between client and server; code editor and voice feed into the channel, OpenAI drives the interviewer's replies.",
    },
    {
      name: "Live code analysis",
      description: "As the candidate types, code is streamed to the backend and the interviewer reacts.",
      nodes: ["Code editor", "Socket.IO", "Live code analysis", "AI interviewer reaction"],
      style: "Streaming arrow from editor → backend → interviewer reaction, emphasizing the in-flight (not post-submit) analysis.",
    },
    {
      name: "Voice + code session",
      description: "A session combines spoken answers and live coding in one experience.",
      nodes: ["Voice input", "Code editor", "Interviewer (AI)", "Session state (Supabase)"],
      style: "Two inputs (voice + code) converging on the interviewer, with session state persisted.",
    },
  ],
  relationships: [],
  followUpQA: [
    { question: "Did it pass the class?", answer: "Yes — the MVP and demo earned a 100% evaluation." },
    { question: "Is there a live demo?", answer: "Yes, deployed at while-unemployed.vercel.app, with source on GitHub." },
    { question: "Why a live interviewer instead of a question bank?", answer: "Real interviews are reactive — the interviewer follows up and pushes back. A static bank cannot simulate that, so the MVP streams code and voice to the AI interviewer in real time." },
    { question: "Is it still maintained?", answer: "No — it is a completed class MVP, not an active product." },
  ],
  brandColor: "#0f172a",
  accentColor: "#0284c7",
  lastAuthored: "2026-07-20",
};