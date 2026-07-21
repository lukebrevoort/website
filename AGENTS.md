# Personal Website Agent Guide

These instructions apply to the entire repository. Preserve the intent behind them when implementing future Linear tickets; do not treat the current UI as frozen.

## Product architecture

- The established portfolio remains at `/`. Do not replace it with an experimental experience unless a ticket explicitly changes this decision.
- The vision-agent whiteboard lives at `/explore` and is implemented by `src/components/homepage-whiteboard.tsx` with styles in `src/components/homepage-whiteboard.module.css`.
- Visitors should have deliberate, visible paths into Explore:
  - the large EXPLORE control in the homepage hero;
  - the Explore item in the expanded desktop sidebar;
  - the Explore item in the mobile navigation dock.
- About, Projects, and Blog must remain discoverable from both the conventional portfolio and the Explore experience.
- The Models and Documentation routes still exist, but Explore replaces them in primary navigation. Do not delete the old routes as incidental cleanup.

## Explore experience principles

- Treat the canvas as the primary product surface, not an embedded widget or a chatbot page.
- Keep the agent transient. It may appear while loading, thinking, or recovering, but it should not become a permanent sidebar.
- A first-time visitor should understand how to begin without reading instructions. Prefer one strong invitation, a prompt field, and a few useful starting points.
- Preserve the living-sketchbook direction: warm paper, graphite/ink marks, Luke's handwritten font, restrained red accents, asymmetrical notes, and tactile movement. Avoid generic dashboard cards, purple-gradient AI styling, or stock chatbot chrome.
- Project suggestions should feel arranged on a board. Desktop notes may be spatial and draggable; small screens should use a readable, naturally scrolling stack rather than a miniature desktop canvas.
- Keep motion purposeful and brief. Respect `prefers-reduced-motion` and ensure the experience remains understandable with animation disabled.
- Every new interaction must account for loading, failure/offline recovery, reduced motion, and small screens.

## Ticket boundaries

- Read the complete Linear issue, comments, relations, and acceptance criteria before editing.
- BRE-139 established the visual-direction shell and route architecture.
- BRE-140 owns the deeper first-run prompt and project-suggestion experience.
- BRE-141 owns the full Excalidraw integration.
- Build the ticket in scope without prematurely absorbing linked follow-up tickets. It is fine to leave a deliberate shell or seam for the next ticket.
- Mark a Linear issue complete only after implementation and proportional verification. Leave a concise implementation/validation comment and link the PR when available.

## Git and PR workflow

- Canvas-experience tickets integrate through the long-lived `homepage-canvas` branch, not directly into `main`.
- Create one focused branch per ticket, preferably using the branch name supplied by Linear (for example, `luke/bre-140`).
- Open a draft PR from the ticket branch into `homepage-canvas`. Subsequent fixes for that ticket should update the existing branch and PR rather than create additional PRs.
- Keep `homepage-canvas` reasonably current with `main` so the eventual promotion PR is reviewable.
- Do not merge the integration branch into `main` until the complete canvas experience is ready for promotion.
- Stage files explicitly. Preserve unrelated user changes and never include generated build artifacts accidentally.

## Visual verification and media

- Run `npm run build` for production validation. TypeScript validation occurs during the build; a separate `npx tsc --noEmit` is useful while iterating.
- Verify important flows in a real browser at desktop and mobile sizes. At minimum, check:
  - the homepage entry point;
  - navigation into `/explore`;
  - prompt to thought-bubble to result transition;
  - desktop sidebar contents;
  - mobile navigation and result scrolling;
  - console/runtime errors.
- Local production mode may report a 404 for `/_vercel/speed-insights/script.js`; Vercel supplies that script in deployment. Do not confuse that isolated local warning with an application failure.
- Browser sessions may be shared with other local projects. Use a named Playwright session for this repository (for example, `-s=bre139`) and confirm the current URL before trusting a screenshot.
- Always inspect captured screenshots visually. A successful command is not proof that it captured the correct tab, route, viewport, or state.
- Capture temporary artifacts under `output/playwright/`. Move approved screenshots into `public/media/<ticket-id>/`, commit them, and embed them in the PR description.
- For stable PR images, use raw GitHub URLs pinned to a commit SHA and verify that each URL returns HTTP 200.
- After builds and screenshots, remove temporary browser output and restore incidental changes to generated files such as `next-env.d.ts` and `tsconfig.tsbuildinfo` before committing.
- Wait for the updated Vercel deployment and preview-comment checks to pass before handing the PR back.

## Documentation for the user

- Prefer custom HTML over plain Markdown when a plan, implementation, or manual test flow materially benefits from visual presentation.
- Do not create HTML for every response. Use the smallest format that communicates the work clearly.
