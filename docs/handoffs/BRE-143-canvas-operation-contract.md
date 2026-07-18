# BRE-143 Canvas Operation Contract Handoff

Last updated: 2026-07-14

## Where the implementation lives

BRE-143 was implemented in PR [#25](https://github.com/lukebrevoort/website/pull/25) and squash-merged into the long-lived `homepage-canvas` integration branch at commit `92d5676c1acf1037271658d52c105ada7c010129`.

The implementation is intentionally **not on `main` yet**. Repository guidance routes canvas tickets through `homepage-canvas` until the complete canvas experience is ready for promotion. Start future canvas-agent work from an up-to-date `homepage-canvas`, not from `main`.

Key implementation files on `homepage-canvas`:

- `src/lib/canvas-agent/contract.ts`: strict Zod `CanvasPatchV1` contract and JSON Schema.
- `src/lib/canvas-agent/validation.ts`: semantic validation and confirmation risk classification.
- `src/lib/canvas-agent/compiler.ts`: deterministic semantic-patch to Excalidraw compilation.
- `src/lib/canvas-agent/apply.ts`: immutable updates, grouping, connections, and deletion application.
- `src/components/excalidraw-canvas.tsx`: live scene context, confirmation boundary, and atomic scene update.
- `src/components/canvas-contract-lab.tsx`: preview/local-only manual acceptance harness.

## What BRE-143 does and does not prove

The ticket proves that untrusted, model-shaped JSON can be validated, risk-classified, compiled deterministically, and applied as one undoable Excalidraw action. It does not call Gemini, inspect screenshots with a model, enforce public quotas, or choose between Gemini and WebLLM.

Follow-up ownership remains:

- BRE-144: Gemini request and vision-model integration.
- BRE-147: public quota, abuse, and bot controls.
- BRE-150: browser-local WebLLM feasibility/fallback spike.

Do not bypass the contract from a provider adapter. The provider should produce `CanvasPatchV1`; validation and risk confirmation must happen before `applyCompiledPatch` mutates the scene.

## Manual contract lab

The diagnostic drawer is available at:

```text
/explore?canvasDebug=1
```

It is gated twice:

1. The component is only included during local development or a Vercel Preview build.
2. The drawer only appears when `canvasDebug=1` is present.

It should not appear on a production Vercel deployment, even with the query parameter. The drawer includes three fixtures:

- `safe apply`: validates, compiles, and applies model-authored shapes and a connection.
- `needs approval`: remains blocked with `large-created-area` until `confirm mutation` is clicked.
- `invalid payload`: rejects an out-of-bounds box without changing the scene.

After accepted fixtures, Excalidraw Undo should reverse each accepted patch as one action.

## Gotchas encountered

### Excalidraw counts are not operation counts

A semantic note or labeled connector can compile into multiple Excalidraw elements because bound text and labels are separate scene elements. The safe fixture has three semantic operations but reports six created elements. Assert scene behavior and stable IDs; do not assume one operation equals one Excalidraw element.

### Confirmation is a two-step application flow

`applyCompiledPatch(patch)` returns `confirmation-required` for risky patches without mutating the canvas. After explicit approval, call the same compiled patch with `{ confirmed: true }`. Recompiling after scene state changes can change the scene version or coordinate context.

### Scene versions are intentionally live

The canvas gateway hashes active Excalidraw element IDs and versions. Fixtures are bound to the current scene when loaded. If the scene changes before Run, the patch becomes stale and correctly requires confirmation. Provider requests should capture context and submit against that exact `baseSceneVersion`.

### Coordinates are viewport-normalized

The provider contract uses a `0..1000` normalized visible-canvas coordinate system. `getPatchContext()` derives visible scene bounds from Excalidraw scroll and zoom state. Avoid sending raw screen pixels or assuming a fixed desktop canvas size.

### Vercel previews are authentication-protected

Opening an immutable preview URL in a clean Playwright session redirects to Vercel login. Use an authenticated browser session or Vercel's temporary share/access URL, then retain the resulting cookie while navigating to `/explore?canvasDebug=1`.

### Preview gating is evaluated at build time

The server page enables the lab when `NODE_ENV !== "production"` or `VERCEL_ENV === "preview"`. A local `next build && next start` behaves like production and hides the drawer; use `npm run dev` for local harness checks. A Vercel Preview build exposes it.

### Builds modify generated tracked files

`npm run build`, `npm run dev`, and `npx tsc --noEmit` can modify `next-env.d.ts` and `tsconfig.tsbuildinfo`. Playwright CLI also creates `.playwright-cli/`. Restore or exclude those incidental files before committing. Stage source paths explicitly rather than using `git add -A`.

### Wait for the exact preview commit

The Vercel build took roughly one minute after the push. Confirm the deployment metadata references the expected head SHA before testing or merging. A green older branch preview is not evidence for the latest commit.

## Verification recipe

From a branch containing the BRE-143 implementation:

```bash
npm test
npx tsc --noEmit
npm run build
```

Expected contract suite: 11 passing tests.

For browser acceptance, run local development and open the gated route:

```bash
npm run dev
```

Then validate all three fixtures and confirm:

- the invalid fixture leaves the mark count unchanged;
- the risky fixture does not mutate before approval;
- accepted patches add editable native Excalidraw objects;
- one Undo reverses one accepted patch;
- the browser console has no application errors.

Always inspect the screenshot rather than trusting command success alone. In the first pass, the normal Explore invitation remained over the generated fixture; the final implementation hides that invitation after a lab patch succeeds so the result is visually inspectable.

## Recommended next integration step

BRE-144 should reuse the same sequence exercised by the lab:

```text
capture image + CanvasPatchContext
  -> request structured CanvasPatchV1 from Gemini
  -> validateCanvasPatch
  -> compileCanvasPatch
  -> show confirmation when required
  -> applyCompiledPatch
```

Keep the diagnostic fixtures available on preview deployments while provider integration is being tuned. They distinguish a model-quality problem from a contract/compiler/canvas problem quickly.
