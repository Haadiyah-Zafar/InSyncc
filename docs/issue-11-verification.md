# Issue #11 verification

Verified on 10 October 2026 (Asia/Karachi), on branch
`chore/11-repository-tooling`.

## Prerequisites and scope

Live issue #11 had no comments or open prerequisite: #2 was closed, and its D1–D5
and §9.1 approval was present in the decision record. This change establishes the
approved `frontend/`, `backend/`, and `backend/agents/` layout, package managers,
locks, checks, PR template, and contribution policy. It does not choose unresolved
product contracts or implement the React/FastAPI applications.

The branch starts at the user's approval-record commit `7a8f4cc`. GitHub `main`
was observed at `69a72a8`, so the approval-record commit still needs integration.
For a focused PR to `main`, merge that prerequisite documentation first, or identify
this as a stacked change and have the reviewer inspect issue #11's diff separately.
Do not discard the approval record to obtain a smaller diff.

## Checks and outcomes

| Check                                                                        | Result                                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `npm ci` from repository root                                                | Passed with the committed root lock                           |
| `uv sync --project backend --locked` from root                               | Passed; creates isolated backend environment                  |
| `npm run check` from root                                                    | Passed: exact executable pins, Prettier, Ruff lint and format |
| Separate temporary directory with no node_modules or backend virtualenv      | Both locked installs and all checks passed                    |
| Wrong Node version placed first on PATH in the temporary directory           | Checker failed with expected/found diagnostic                 |
| Changed Python dependency with unchanged uv lock in temporary directory      | Locked sync rejected drift                                    |
| Changed JavaScript dependency with unchanged npm lock in temporary directory | npm ci rejected drift                                         |
| `git diff --check` and local Markdown links                                  | Passed                                                        |

Verified tools: Node 24.19.0, npm 11.9.0, Python 3.12.14, uv 0.12.19,
Prettier 3.9.10, and Ruff 0.17.0. Existing Python was used successfully. An explicit
`uv python install` initially hit the cloud's read-only default installation directory;
it is unnecessary with the existing interpreter. README documents writable cache
and optional Python download paths for restricted shells.

These are tooling and failure-path checks, not application test results. Application
build/tests are introduced by #12/#13 and CI by #15. No live external AI/service
credentials, user data, database, or application server were needed.

## Acceptance and remaining review

- Reproducible tool versions, manifest/lock policy, and working directories are
  documented and checked.
- PR template includes issue, acceptance evidence, contract changes, and reviewer;
  contribution policy uses `main` for integration and defines shared-file/migration
  coordination and one-active-issue conventions.
- Required branch protection is documented. Reading it returned HTTP 403,
  “Resource not accessible by integration”; existing settings could not be verified.
  No administrator settings were changed and no authorization was requested for them.
- Issue #11 remains open until a different contributor reviews and the PR merges.
  This record does not claim peer approval or close dependent implementation issues.
