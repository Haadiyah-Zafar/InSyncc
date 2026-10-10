# React/TypeScript shell

This workspace contains the application bootstrap, navigation, accessible shared
controls, API boundary, and a provisional workspace layout. `/` is a public welcome
page; `/status` checks the real backend's application readiness. Unknown routes show
an honest not-found page. No user, role, session, class, or learning activity is mocked
as authenticated behavior. Sign-in and role authorization remain in #4/#21/#22.

## Install and start

From the repository root, with the tools in [CONTRIBUTING.md](../CONTRIBUTING.md):

```bash
npm ci
npm run dev:frontend
```

The frontend serves at `http://127.0.0.1:5173`. In a separate terminal, start the
backend from the repository root to use the status page:

```bash
uv sync --project backend --locked
INSYNC_ENVIRONMENT=development npm run dev:backend
```

The development server proxies `/api/*` to `http://127.0.0.1:8000/*`. No CORS or
authentication policy has been invented for this shell. Without the backend, the
status page displays an error and retry action. Readiness only covers application
startup; it does not prove authentication, database, or AI-service availability.

## Build and test

All commands below run from the repository root:

```bash
npm run typecheck:frontend
npm run build:frontend
npm run test:frontend
npm run check
```

The production bundle is `frontend/dist/`. For local inspection only:
`npm run preview --workspace @insync/frontend` serves it on port 4173.
Production hosting must serve `index.html` for frontend deep links and route
`/api/*` to the backend with the prefix removed. Vite's development proxy is not
production deployment configuration. Do not use the preview server as production
hosting. Deployment is a later issue.

The browser suite starts its own frontend and real backend on ports 5173 and 8000;
stop your manual servers first. Install a test browser once from the root:

```bash
npm exec --workspace @insync/frontend -- playwright install chromium
npm run test:frontend:e2e
```

If downloads are restricted and a compatible Chromium is already installed:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:frontend:e2e
```

The optional executable override is local test configuration, not bundled client
configuration. Restricted cloud shells may also need the writable npm/uv caches
from the root README. Browser reports/screenshots stay in ignored output folders.
Unit tests use controlled API doubles; browser tests verify the real `/ready`
response, keyboard navigation, deep-link reload, offline/retry, and narrow layout.

## Extension boundaries

- `src/app/` owns shell navigation and route registration. Add feature routes here
  while keeping feature logic under `src/features/<feature>/`.
- `WorkspaceLayout` offers title/navigation/action/content slots for later teacher
  and student screens. It is not mounted as a privileged route, infers no role,
  and is not an authorization guard. Wire actual identity and access contracts
  before mounting protected features; server authorization remains mandatory.
- `src/components/` contains native buttons/inputs with associated labels,
  descriptions, required/error state, disabled/busy controls, and loading/empty/error
  feedback. Inputs preserve caller-provided descriptions. Route changes focus main
  content; a skip link and visible focus styles support keyboard navigation.
- `src/lib/api.ts` provides same-origin JSON GET calls with a 10-second transport
  bound, cancellation, safe public failures, and validated correlation IDs. Each
  operation supplies a runtime decoder rather than casting unknown JSON. API
  responses and exception contents are never rendered raw. This HTTP timeout is
  not the pending AI request/fallback policy.
- Authentication is not implemented: calls omit credentials, attach no fabricated
  token, and do not use browser storage to choose roles. Extend this boundary under
  approved auth contracts. No private keys belong in Vite/client environment values.
- `src/features/status/` consumes the actual backend readiness contract. Its state
  handles loading, success, failure, retry, cancellation, and stale completions.

Visual styling is a provisional shell, not approval of final domain screens in #10.
No new domain schema, quiz/group behavior, Yjs binding, or model provider is selected.
