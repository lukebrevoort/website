# BRE-145 Curated Agent Knowledge Packs Handoff

Last updated: 2026-07-20

## What this delivers

Authored, structured knowledge packs for the four featured/projects of interest — **MALCOM**, **Dispatch**, **Orca Mail**, **FlowState** — plus a lazy-selection loader, JSON API for agent consumption, and a dev-only viewer for local testing. Packs are **data files**, so updating project knowledge does not require editing the canvas UI (acceptance criterion).

## Where the implementation lives

Branch: `luke/bre-145` (worktree at `../personal-website-bre-145`). Branched from `origin/main`. The packs are foundational content/data and are independent of the canvas compiler machinery on `homepage-canvas`; integrating them into the vision-agent request flow is a follow-up on the `homepage-canvas` branch (see "Integration" below).

Key files:

- `src/data/knowledge-packs/schema.ts` — `KnowledgePack` type and the slug registry.
- `src/data/knowledge-packs/<slug>.ts` — one authored pack per project (`malcom`, `dispatch`, `orca-mail`, `flowstate`).
- `src/data/knowledge-packs/index.ts` — registry + `listKnowledgePacks`, `getKnowledgePack`, and `buildAgentPromptContext(slug)` (renders the pack into a single markdown context string for a model).
- `src/app/api/knowledge-packs/route.ts` — `GET /api/knowledge-packs` lists pack summaries.
- `src/app/api/knowledge-packs/[slug]/route.ts` — `GET /api/knowledge-packs/<slug>` returns the full pack **and** the pre-rendered agent prompt context.
- `src/components/knowledge-pack-viewer.tsx` + `src/app/knowledge-packs/page.tsx` — dev-only viewer at `/knowledge-packs` (redirects to `/projects` in production; visible in dev and Vercel preview).

## Pack schema

Each `KnowledgePack` includes exactly the sections the ticket requires:

- `summary` / `purpose` / `intendedUser`
- `architecture` + `components[]`
- `designDecisions[]` (decision + rationale)
- `status` + honest `limitations[]`
- `technologies[]` + `links[]`
- `visualVocabulary[]` (tokens, colors, motifs) — shared with diagram generation
- `diagramPatterns[]` (name, description, nodes, style) — starter diagrams and dynamic generation read the **same facts**
- `relationships[]` to the other projects
- `followUpQA[]` — answers to likely follow-up questions

## Acceptance criteria mapping

- **Accurate and consistent with portfolio pages** — authored directly from `src/data/projects.ts`, `src/app/projects/[slug]/page.tsx` highlights, and the dedicated `flowstate` page.
- **Selectable without placing every project in every prompt** — agents fetch one slug via the API or import one pack; `buildAgentPromptContext(slug)` returns only that project's context.
- **Starter diagrams and dynamic generation use the same facts** — `diagramPatterns` and the rest of the pack share one authored source; a model generates diagrams from the same `architecture`/`components` facts the starter patterns use.
- **Updating project knowledge does not require editing the canvas UI** — edits go in `src/data/knowledge-packs/<slug>.ts` (or future Markdown sources); the canvas never needs to change.

## Local testing

```bash
npm install
npm run dev     # open http://localhost:3000/knowledge-packs
```

Verify:

- The viewer lists all four packs; selecting each loads the full pack and the generated agent prompt.
- The "Agent prompt" tab renders the same context a model would receive; "Copy" works.
- `GET /api/knowledge-packs` and `GET /api/knowledge-packs/malcom` return JSON (test with `curl`).
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass.

## Integration (follow-up, on `homepage-canvas`)

When wiring into the vision-agent request flow (BRE-144 and beyond), fetch the relevant pack for the active project context and prepend its `buildAgentPromptContext(slug)` to the model prompt. Keep the same sequence the canvas lab uses; do not bypass the `CanvasPatchV1` contract.

```text
active project slug
  -> GET /api/knowledge-packs/<slug>   (or server-side import)
  -> prepend prompt context to the Gemini request
  -> CanvasPatchV1 -> validate -> compile -> confirm -> apply
```

## Optional: ingesting Malcolm chat history over Tailscale (NOT done in this PR)

The ticket discussion suggested indexing chat logs from Malcolm over Tailscale, scrubbing sensitive data, vectorizing, and offering the synthesis to the model. This was **not executed** from this environment — opencode has no network path to Malcolm and no Tailscale access here. Instead, an opt-in ingestion + scrubbing script is provided so it can be run from a machine that can reach Malcolm:

- `scripts/ingest-malcom-chats.ts` — reads exported chat log files from a local directory, scrubs obvious secrets (API keys, bearer tokens, emails, phone numbers, credit-card-shaped strings), and writes a scrubbed JSONL chunk index plus a simple keyword index. It does **not** embed by default (no embeddings dependency added); it documents where to plug in an embeddings provider. Always review scrubbed output before using it as agent context.

Run it from a host that can reach Malcolm (e.g. the Mac Malcolm runs on, or a machine on the same Tailnet):

```bash
tsx scripts/ingest-malcom-chats.ts --input <exported-chats-dir> --output .private/malcom-index.jsonl
```

Review `.private/malcom-index.jsonl` for residual sensitive content before exposing it to any model. `.private/` is already outside the public web root.

## Gotchas

- The viewer is gated to non-production (`NODE_ENV !== "production"` or `VERCEL_ENV === "preview"`), mirroring the BRE-143 canvas lab convention. A local `next build && next start` hides it; use `npm run dev`.
- `force-static` on the API routes means packs are baked at build time — fine for authored content; update by editing the data file and redeploying.
- Builds can modify `next-env.d.ts` / `tsconfig.tsbuildinfo`; stage source paths explicitly rather than `git add -A`.