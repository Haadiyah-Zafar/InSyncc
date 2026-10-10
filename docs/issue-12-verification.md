# Issue #12 verification

Verified on 11 October 2026 (Asia/Karachi), branch
`feat/12-fastapi-foundation`, based on latest fetched `main` at `7d64284`.

## Prerequisite evidence

Live #12 had no comments and names #11 as its only prerequisite. The repository
owner merged tooling PR #65 into `main` on 10 October 2026. Its files are present
on this branch. Issue #11 was still open when inspected; GitHub returned no PR
review records, so this task does not claim peer approval or silently close #11.
The merged tooling is used as the implementation prerequisite. The scope decision
record for #2 has D1–D5 and §9.1 explicitly approved. Other product decisions stay
with their owning issues.

## Implementation and checks

| Acceptance                                     | Evidence                                                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Documented startup and meaningful probes       | Application factory; validated settings; lifespan sets/clears readiness; real Uvicorn process served `/health` and `/ready` successfully                                 |
| Missing config fails clearly; secrets excluded | Missing and invalid `INSYNC_ENVIRONMENT` caused real server startup failure with a field-only message; synthetic rejected value absent from captured output              |
| Fixtures exercise startup and error responses  | 20 pytest cases passed, including lifespan, 404/405/401/422/500, protocol headers, malformed JSON, request-ID validation and concurrent isolation, and streaming failure |
| Routing/service boundaries                     | `app/api/` delegates readiness state to `app/services/`; `agents/` remains within the single backend; no domain/state/provider decisions introduced                      |

Commands from the repository root:

```bash
uv sync --project backend --locked
npm run test:backend
npm run check
git diff --check
```

The real-process check launched the documented Uvicorn factory with production
configuration and an available loopback port. It asserted exact health/readiness
payloads, 404 for production docs and unknown routes, matching error-body/header
request IDs, startup/shutdown lifecycle logs, and absence of a synthetic credential
in query strings from captured logs. The process was terminated and awaited after
the check. Separate subprocesses verified nonzero startup with missing/invalid config.
No application process was left running.

The 20-test suite emits one upstream Starlette deprecation warning about its current
HTTPX TestClient adapter. Tests pass; the warning is not filtered or suppressed.
Application runtime HTTP checks are separate from that adapter. Package versions
and artifact hashes are recorded in `backend/uv.lock`.

## Limits and review

Readiness covers application initialization only. Database, Redis, AI providers,
workers, authentication, and the learner Python runtime have no integration here.
No external service credentials or calls were needed. Common error formats are
foundation conventions; domain API contracts remain in #10. Production deployment,
proxy logging, CORS/auth policies, and external-service telemetry are separate work.

The documented server command uses `--no-access-log` to avoid query-string logging.
Application logs deliberately omit request input and exception contents; future
third-party integrations must follow that policy themselves. Error headers are
server-supplied and must never carry secrets. A failure after streaming headers
cannot replace the status/body and instead raises a sanitized abort exception.

Issue #12 remains open for review and merge. No commit, push, PR, peer approval,
or issue closure is claimed by this local verification record.
