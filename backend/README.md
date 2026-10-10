# FastAPI backend

This is one FastAPI application. `app/api/` owns HTTP routing/validation,
`app/services/` owns application services, and `agents/` is reserved for the five
agents and LangGraph modules in the same backend process. Clients will use
application routes, not individual agent endpoints. Domain APIs, database/auth,
agent execution, and external dependency checks remain in their owning issues.

## Install, configure, and run

From the repository root with the pinned tools in [CONTRIBUTING.md](../CONTRIBUTING.md):

```bash
uv sync --project backend --locked
# First setup only; do not overwrite an existing .env:
cp -n backend/.env.example backend/.env
npm run dev:backend
```

The equivalent Python command from the repository root is:

```bash
uv run --project backend --locked uvicorn app.main:create_app --factory \
  --app-dir backend --host 127.0.0.1 --port 8000 --no-access-log
```

The server runs in the foreground. Stop it with Ctrl+C. No database, Redis, or AI
credentials are required by this application foundation. For restricted cloud
cache directories, use the environment variables documented in the root README.

`backend/.env` is resolved relative to the source directory, independent of the
shell's current directory. Process environment variables take precedence.
`INSYNC_ENVIRONMENT` is required and accepts only `development`, `test`, or
`production`. Missing/invalid configuration aborts before serving requests with
`Missing or invalid configuration: INSYNC_ENVIRONMENT`; rejected values are omitted.
A shell-only alternative is `INSYNC_ENVIRONMENT=development npm run dev:backend`.
The example contains no secrets; `.env` is ignored by Git.

## Operational endpoints

| Endpoint                 | Meaning                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `GET /health`            | 200 `{"status":"alive"}`: the HTTP application responds                                                                     |
| `GET /ready`             | 200 after lifespan startup; 503 before startup/after shutdown; includes `scope: "application"` and application check status |
| `/docs`, `/openapi.json` | Available only in development; disabled for test/production                                                                 |

From another terminal, run `curl -i http://127.0.0.1:8000/health` and
`curl -i http://127.0.0.1:8000/ready`. Ready means application initialization
completed. It does **not** assert Supabase, Redis, providers, workers, or the Python
runner are available. Add real checks during those integrations before claiming
readiness for them. Readiness is set false on lifespan shutdown. `/ready` responses
are not cacheable.

These operational paths and the internal error envelope are foundation conventions,
not approval of pending domain API contracts in #10. Services receive domain inputs;
HTTP transport concerns stay in routes. Agent/state contracts remain pending in #3/#6.

## Errors, correlation, and logging

Each HTTP response carries `X-Request-ID`. A single UUID-form request ID is
normalized and reused; absent, malformed, oversized, or duplicate values are replaced
with a generated UUID. IDs are correlation hints, not identity/authorization tokens.
Request state is local to each ASGI request, including concurrent requests.

HTTP errors and validation errors use:

```json
{
  "error": {
    "code": "http_error",
    "message": "Not Found",
    "request_id": "<same UUID as X-Request-ID>"
  }
}
```

Validation errors return 422 with `validation_error`; unexpected failures return
500 with `internal_error`. Public responses omit exception details and submitted
values. Server-provided protocol headers (such as `Allow`/`WWW-Authenticate`) are
preserved. Do not put credentials in response headers. No production test-only
failure route exists.

The `insync` logger emits lifecycle events and request ID/status/duration at INFO;
failures emit an ERROR event with the ID. It excludes URLs, query strings, headers,
bodies, settings dumps, exception text, and traceback contents. The documented
server command disables Uvicorn access logs because they can contain query strings.
Keep debug disabled. Future dependencies must apply the same policy to their own
logging and use secret-aware settings types for credentials; this foundation does
not implement those integrations or promise to sanitize arbitrary third-party logs.
A failure after streaming headers were sent aborts with a sanitized exception;
it cannot change an already-sent status into a JSON 500 response.

## Tests

From the repository root:

```bash
npm run test:backend
npm run check
```

Or from `backend/`: `uv run --locked pytest`.
Tests use an explicit test configuration and in-process HTTP fixtures with lifespan
startup/shutdown. They cover readiness, config validation, error redaction, protocol
headers, docs exposure, malformed input, request-ID validation/concurrency, and
streaming failures. They do not contact external services. Test-only routes are
registered only on fixture applications. Keep dependency changes and `uv.lock`
together; frozen installs use `uv sync --project backend --locked`.
