# Contributing to InSync

## Tools and installation

Use Node 24.19.0, npm 11.9.0, Python 3.12.14, and uv 0.12.19. These pins were
verified together for repository tooling; compatibility with application dependencies
must also be tested when #12/#13 introduce them. Exact patch pins avoid silent drift.

Install Node using your version manager (for example, `fnm install 24.19.0` followed
by `fnm use 24.19.0`) or the [official Node distribution](https://nodejs.org/en/download).
If needed, select npm with `npm install --global npm@11.9.0` in that managed Node
installation. Install uv **0.12.19** using its
[version-specific installation instructions](https://docs.astral.sh/uv/getting-started/installation/#installing-specific-versions).
Do not install a floating latest release as the project toolchain.

All commands below run from the repository root unless a step explicitly says
otherwise. Follow [README.md](README.md) for installation. uv uses `backend/.venv`;
activation is unnecessary with `uv run --project backend --locked ...`. Use
Linux/macOS or WSL for these shell examples. Docker/services are not prerequisites
for this tooling issue; development services are #14.

## Dependencies and checks

- npm is the sole JavaScript package manager. The root `package-lock.json` covers
  the `frontend` workspace. Use `npm ci` to install it; do not create a nested lock,
  Yarn lock, or pnpm lock. Add a frontend dependency from the root with
  `npm install --workspace @insync/frontend --save-exact package@version`.
- uv is the sole Python dependency manager. Commit `backend/pyproject.toml` and
  `backend/uv.lock` together. Install with `uv sync --project backend --locked`;
  do not hand-edit the lock or generate requirements files as a second authority.
  Add a dependency with `uv add --project backend --bounds exact package==version`.
- Commit reviewed lock changes with the manifest change and explain upgrades.
  Never delete locks to resolve conflicts. Merge manifest intent with the other
  owner, regenerate using the pinned manager, and review the resulting diff.
- A toolchain upgrade updates `.node-version`, `.python-version`, `package.json`,
  `backend/pyproject.toml`, locks, and docs together as applicable. Run clean installs
  and checks. `.npmrc` rejects incompatible engines; uv enforces Python/uv pins.
- Run `npm run check` before review. To fix formatting, use `npm run format` and
  `uv run --project backend --locked ruff format --config backend/pyproject.toml backend scripts`. Review the diff.
  Historical handoff/planning files are excluded from Prettier to avoid rewriting
  approved records; validate their links, identifiers, and whitespace separately.
- Run backend tests from the root with `npm run test:backend`. Use `npm run typecheck:frontend`, `npm run build:frontend`, and
  `npm run test:frontend` for frontend changes; `npm run test:frontend:e2e` checks
  browser/backend integration (see frontend README). CI remains in #15. Each
  feature must run its relevant real tests, including failure/access/recovery cases
  where applicable. Report actual counts and failures; do not claim that tooling
  checks prove application behavior. Use deterministic provider doubles for routine
  tests and identify credentialed integration checks separately.

## One issue, one branch, one reviewer

1. Read `AGENTS.md`, the live issue/comments, decisions, and both start/close
   prerequisites. Each contributor owns one active implementation issue; others
   can work on separate Ready issues. Name the owner and a different reviewer in
   the issue/PR; workstream letters are not GitHub account assignments.
2. Start a branch from current `main` in a clean checkout:

   ```bash
   git switch main
   git pull --ff-only origin main
   git switch -c chore/11-repository-tooling
   ```

   Use `feat/<issue>-description`, `fix/…`, `docs/…`, or `chore/…` for the actual task.
   Preserve existing changes. If a prerequisite exists only on another branch,
   declare that stacked base in the draft PR and integrate/rebase after it merges;
   do not silently include someone else's changes. Cloud tasks use their existing
   checkout, without another clone or worktree.

3. Keep the patch focused. Record contracts and coordinate shared files before
   concurrent changes. Frontend may use approved fixtures for start-after work;
   real integration is still required for close-after dependencies.
4. Commit explicit paths, push the issue branch, and open a PR targeting `main`.
   Fill in the PR template with issue, scope, actual checks, contract impacts, and
   reviewer. Use `Closes #<issue>` only when the acceptance work is complete.
5. Obtain a different contributor's review and passing relevant checks. Resolve
   conversations and synchronize with `main` before integration. Close the coding
   issue after the reviewed PR merges; implemented locally is not Done. If blocked,
   record the dependency before moving to another Ready issue.

## Shared-file and migration coordination

| Shared area                                                  | Coordination responsibility                                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Root tooling, shared configuration, package-manager pins, CI | Current tooling/CI issue owner coordinates with the affected frontend/backend owners before changes |
| Frontend routes, components, shared client types             | Workstream A coordinates; B reviews API compatibility                                               |
| Backend APIs, shared contracts, database schema/migrations   | B coordinates; A/C review affected clients and state                                                |
| Graph routing, shared learner state, agent interfaces        | C coordinates; B reviews persistence/recovery                                                       |
| Cross-cutting planning/decision records                      | Relevant decision owner records explicit approval and affected consumers                            |

These are coordination roles, not exclusive code ownership. Name real people in the
issue/PR when known; no accounts or CODEOWNERS entries are invented. B coordinates
migration ordering under approved #9/#16 conventions. Never independently edit the
same migration revision, modify an applied migration, or invent ordering/schema
before those decisions. Agree sequencing and review conflicts before merge.

## Main branch protection: administrator action

The required integration policy is: PRs to `main`; at least one approving reviewer
other than the author; dismiss stale approvals after new commits; resolve review
conversations; pass relevant CI checks before merging; disallow force-pushes and
branch deletion. Prefer applying these rules to administrators too, with any bypass
explicitly documented. Once #15 creates checks, select their actual reported names
and require an up-to-date branch. Do not require nonexistent check names, which
would prevent every merge. Until CI exists, reviewers inspect recorded local checks.

An authorized repository administrator configures this in GitHub **Settings → Rules →
Rulesets** (or branch protection), subject to the repository plan's capabilities.
Issue #11 authorizes documenting this policy; it does not grant permission to change
administration settings. On 10 October 2026 the connector's read of
`repos/Haadiyah-Zafar/InSyncc/branches/main/protection` returned HTTP 403,
“Resource not accessible by integration.” Existing protection could not be verified;
no settings were changed. This is an access limitation, not evidence that `main` is
unprotected. If protection is unavailable for the repository/plan, document that
limitation and follow the PR/review policy manually until an administrator resolves it.
