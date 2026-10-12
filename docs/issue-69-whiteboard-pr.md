## Working whiteboard preview

Related to #69, #71 and parent #68. This is a partial frontend preview, not closure
of those issues or approval of their remaining contracts.

The app previously offered a welcome page and service status only. The new
`/whiteboard-preview` route lets a user add/edit/move text, Python-code cards,
rectangles and ellipses; delete objects; and undo/redo board changes. Navigation
and the welcome page link to it.

The tutor panel offers a clearly labeled sample Python-loops activity. Starting it
shows a proposed addition; only Approve changes the board. Ask + circle captures
structured objects and offers a sample explanation, with a keyboard selection
alternative. Dismiss leaves work unchanged. Pending proposals become stale after
any board mutation, including undo/redo, and repeated approval cannot replay them.
The conversation preserves the selected content snapshot. Learner edits to sample
content are labeled, and arbitrary content gets an honest fixture response instead
of an invented explanation.

## Scope and review boundary

The user explicitly requested implementation and resumed it on 12 October 2026.
The branch starts from `0384159` on main after merged decision PR #73. Live #69,
#10, #9 and #6 and their comments were inspected before coding. The pending
production contracts remain pending; this local interaction preview is a concrete
way to review the confirmed interaction without defining an API or database schema.
It does not make #69 Ready for production integration or remove its prerequisites.

- Native React/HTML objects and an SVG circle overlay; no tldraw package or new
  dependencies. The final SDK/licensing choice remains open.
- State and history exist only while this page is mounted. Reload/navigation clears
  them, as the visible banner states. No authenticated role, browser-storage account,
  production persistence or backend authorization is fabricated.
- Sample responses are fixtures. No live Tutor, LangGraph, OpenRouter, RAG, citations,
  assessment, Python execution, image interpretation or Yjs collaboration is claimed.
- Circle selection uses object centers inside a closed path. Conservative revision
  invalidation, keyboard controls, dimensions and the 50-change undo limit are local
  preview mechanics, not approved production contracts for #10.
- Full #69 closure still needs approved contracts, durable save/reload, real authorized
  Tutor integration and required review. #70/#71/#72 retain their integration gates.

## Try it

From the repository root, run `npm run dev:frontend`, then use **Whiteboard preview**
in navigation. No backend or API key is needed for this page.

1. Start sample activity. Check that the board stays empty until Approve addition.
2. Activate Ask + circle; draw around the code card and release. Review the sample
   explanation in the panel, then approve or dismiss its proposed board addition.
3. Add a note or shape; edit via the form below the board. Drag its header, or focus
   the header and use arrow keys. Use the object list to select without drawing.
4. Try Undo/Redo, deletion, and modifying the board with a pending proposal.
5. Reload to confirm the preview's explicitly stated session-only behavior.

## Validation

Verified on 12 October 2026:

- `npm run test:frontend`: 25 tests passed, including 10 whiteboard tests.
- `npm run build:frontend`: TypeScript check and production build passed.
- `UV_CACHE_DIR=/tmp/insync-uv-cache PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:frontend:e2e`:
  7 browser tests passed (4 whiteboard and 3 real-backend shell checks).
- `UV_CACHE_DIR=/tmp/insync-uv-cache npm run check`: pinned toolchain, repository
  formatting, Ruff lint and Python formatting passed.
- `git diff --check` and local documentation links passed. Desktop and narrow-screen
  screenshots were inspected; the inspected journey reported no browser page errors.

One browser rerun initially found the manually started inspection server still on
port 5173. Stopping that server and rerunning the unchanged suite passed. No test
assertions or isolation settings were weakened. Screenshots are local inspection
artifacts; fixture success does not establish live tutoring or RAG integration.

Do not use a closing keyword for #69, #71 or #68 in this PR.
