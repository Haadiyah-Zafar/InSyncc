# InSync

InSync is a planned learning platform connecting tutoring, quizzes, progress evidence,
teacher review, and group collaboration. The approved pilot includes a shared Python
editor with execution/output and a whiteboard with independent editing control.

This checkout currently provides repository tooling and planning documents. Application
entry points, React/FastAPI dependencies, and application tests arrive in issues
[#12](https://github.com/Haadiyah-Zafar/InSyncc/issues/12) and
[#13](https://github.com/Haadiyah-Zafar/InSyncc/issues/13); CI is issue #15.

## Repository layout

| Path              | Purpose                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| `frontend/`       | React/TypeScript workspace; shell follows in #13                                     |
| `backend/`        | Python environment for the single FastAPI backend; foundation follows in #12         |
| `backend/agents/` | Agent/LangGraph modules within that backend; contracts remain in their owning issues |
| `scripts/`        | Repository development checks                                                        |
| `planning/`       | Approved scope, open decisions, issue/dependency records                             |
| `docs/`           | Contributor and tooling verification records                                         |

## Install and check

Use Linux, macOS, or WSL with Node **24.19.0**, npm **11.9.0**, and uv **0.12.19**
on PATH. Python **3.12.14** is pinned; `uv sync` uses an existing matching
interpreter or installs it when absent. See the
[contribution guide](CONTRIBUTING.md) for installation options and lockfile policy.

Run these commands from the repository root (the directory containing `AGENTS.md`):

```bash
# In this cloud checkout:
cd /workspace/InSyncc
# In a local checkout, cd to your own InSyncc directory instead.
npm ci
uv sync --project backend --locked
npm run check
```

`npm run check` verifies exact executable versions, Prettier formatting, and Ruff
lint/format checks. It is a tooling check, not an application test or build. No
application server or application test suite exists yet. Future feature PRs must add
and document meaningful tests; a zero-test run is not acceptance evidence.

In restricted cloud shells where the default cache directories are not writable,
set these before installing/checking (no credentials are needed):

```bash
export npm_config_cache=/tmp/insync-npm-cache
export UV_CACHE_DIR=/tmp/insync-uv-cache
# Only needed if the pinned Python is absent and uv must download it:
export UV_PYTHON_INSTALL_DIR=/tmp/insync-python
```

Read [AGENTS.md](AGENTS.md), the [contribution guide](CONTRIBUTING.md), and the
[approved decision records](planning/decisions/README.md) before taking an issue.
