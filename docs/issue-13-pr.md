## Issue and outcome

Closes #13

Adds the React/TypeScript application shell with public navigation, accessible form
and status components, a same-origin API boundary, and reusable workspace layout
slots. The service-status page calls the actual backend readiness endpoint and
handles loading, errors, retry, and success. No user, role, session, class, or
learning feature is represented as authenticated behavior.

## Acceptance evidence

Implementation prepared on 11 October 2026 (Asia/Karachi), branch
`feat/13-react-shell`, based on `main` at `a42dfae`. Live #13 had no comments; its
prerequisite #11 was closed. The approved #2 decision record was read. The merged
backend from #12 is used by the status integration tests.

- Production build and strict TypeScript checks pass: `npm run build:frontend`.
- Component/API tests pass: `npm run test:frontend` — 15 tests. Covers labels,
  keyboard controls, busy/error/loading/empty states, layout slots, unknown routes,
  real-response decoding, safe failures, cancellation, timeouts, and retries.
- Browser integration passes: `npm run test:frontend:e2e` — three Chromium tests
  against a real FastAPI process. Covers skip link/focus, route reload, actual
  readiness, offline/retry, narrow layout, and no invented teacher route.
- Production preview was launched separately and inspected at 1280px and 390px;
  welcome/deep-link pages rendered with no page errors. This checks the built bundle,
  not a production deployment.
- `npm ci`, `npm run check`, local documentation links, and whitespace checks pass.

The cloud blocked downloading Playwright's bundled browser (`cdn.playwright.dev`,
HTTP 403). Browser verification used installed Chromium 151.0.7922.173 through
`PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium`. No network settings or TLS
verification were changed. README documents both bundled-browser and installed-browser
options. Test servers and production-preview processes were stopped after checks.

## Contracts and shared files

Frontend dependencies are pinned in its manifest and the shared root npm lock.
Root package scripts expose development/build/typecheck/unit/browser commands;
contribution/setup docs describe them. No backend routes, authentication policy,
state/schema/migrations, or agent contracts changed. The workspace slots are
provisional and do not implement authorization. Feature modules remain separate
from shell route registration.

Development proxies `/api/*` to the backend. Production hosting still needs explicit
SPA fallback and reverse-proxy routing. Readiness covers the application process
only, not database, sign-in, providers, or educational-feature availability. No
browser-stored roles, fabricated tokens, or secrets are added. The HTTP-client timeout
does not settle the pending AI fallback deadline. No accessibility certification is
claimed from these targeted checks.

## Review

Reviewer: assign a different contributor before merge.

- [ ] A different contributor has reviewed the change.
- [ ] Relevant checks pass on the PR and review conversations are resolved.
- [ ] Merge into `main` only after review; the closing reference above closes #13.

This description is prepared locally; no PR, commit, push, peer approval, or issue
closure is claimed by this file.
