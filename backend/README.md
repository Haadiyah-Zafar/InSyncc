# Backend environment

One Python/FastAPI backend owns application services and agent modules. Issue #12
introduces the application foundation and tests. The current manifest installs only
development tooling; it does not provide a running API.

From the repository root, run `uv sync --project backend --locked`. Run tools with
`uv run --project backend --locked ...` to use `backend/.venv` without activation.
Commit `pyproject.toml` and `uv.lock` together when changing dependencies.
