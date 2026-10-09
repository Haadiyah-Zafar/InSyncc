# InSync agent instructions

These instructions apply throughout this repository. Use them at the start of every new Codex task. A new task does not automatically inherit earlier chats: recover context from repository documents, the assigned issue, and recorded human decisions.

## Start every task with the right context

1. Read the user's task and the assigned GitHub issue, including its comments, linked prerequisites, acceptance checks, and relevant PRs. Repository: `Haadiyah-Zafar/InSyncc`. For example: `gh issue view <number> --repo Haadiyah-Zafar/InSyncc --comments`.
2. Read these documents together:
   - [Project context](INSYNC_CODEX_CONTEXT.md)
   - [Open decisions and review requirements](INSYNC_REVIEW_REQUIRED.md)
   - [Candidate schema inventory](INSYNC_SCHEMA_INVENTORY.md)
   - [Implementation plan and subsequent amendments](planning/IMPLEMENTATION_PLAN.md)
   - [Decision records and approval status](planning/decisions/README.md)
3. Find the assigned issue in [the published issue index](planning/PUBLISHED_ISSUES.md) and read its section in [the detailed backlog](planning/ISSUE_BACKLOG.md). Read relevant report sections or diagrams when needed; do not assume the PDF overrides later decisions.
4. Inspect the actual checkout: branch, `git status`, relevant source, manifests, lockfiles, tests, CI, and any more specific `AGENTS.md` instructions. Plans and report prose are not proof that a feature or command exists.
5. Briefly state the issue's intended outcome, applicable decisions, dependencies, and validation approach before editing. Continue authorized work without asking for a second approval of an already settled choice.

If GitHub is unavailable, use the local issue snapshot to continue independent inspection or preparation. State that live status/comments could not be verified. Do not assume a dependency is complete because of a cached label, or claim to have read inaccessible discussion.

## Source authority and decisions

- Follow the current user's explicit instructions and recorded human approvals. Later explicit decisions supersede conflicting older text only within their approved scope.
- The plan and linked issues contain approved amendments, including Yjs, OpenRouter, and the 10–15-model fallback requirement. An older handoff saying a choice is pending does not undo a documented later approval.
- An agent suggestion, issue comment, merged implementation, prototype control, or report example alone does not establish human approval of a disputed requirement. Verify the decision's author, scope, and evidence.
- Plan/backlog approval authorizes the work organization; it does not resolve every Q01–Q18 design question. Issue closure alone is insufficient evidence of a required design approval.
- Preserve unresolved decisions explicitly. For a requirement ambiguity or proposed change with downstream effects, pause the affected decision and dependent implementation, identify the relevant question and affected schema/API/UI/agent/test/report work, and request a concrete human decision. Continue independent authorized work.
- Resolve routine implementation details within approved contracts using engineering judgment. Do not repeatedly reopen settled choices or ask for blanket permission to proceed.
- Record new approvals and affected scope in the relevant issue or decision document when that update is authorized. Keep approved changes consistent across code, contracts, tests, planning artifacts, and authorized report edits. Never describe missing historical conversations as reviewed.

## Work one issue at a time

- Own one active issue and keep the change focused. A/B/C are suggested workstreams, not named people or permission to assign accounts.
- Check both **Start after** and **Integrate/close after** prerequisites. Frontend work may begin against approved contract fixtures while its backend is unfinished, but cannot close until real integration passes. Native GitHub blockers include both kinds of dependency; read the issue body for the distinction.
- P0 issues are decision tasks: prepare options, a recommendation, examples, and downstream impacts for human approval. Do not implement an assumed resolution.
- Phases are delivery checkpoints, not a requirement to wait for every earlier-phase issue when the assigned issue's own prerequisites are satisfied.
- Use a dedicated issue branch and focused PR. Coordinate shared API/types, graph state/routing, root configuration, and migration ordering with their current owners. Do not independently create conflicting migration revisions.
- Preserve existing changes and other contributors' work. Inspect the branch before switching; never reset, discard, or overwrite unrelated work to obtain a clean tree.
- Cloud tasks already have isolated checkouts. Use the existing checkout; do not clone the repository again or create a worktree unless explicitly requested. Local contributors can use their existing clone and an issue branch.
- Use GitHub comments, status changes, assignments, PRs, commits, and pushes within the user's authorized scope. Do not close an issue until its acceptance checks and required review/approval are satisfied. A normal implementation task should end with a concrete change and evidence for review, not a claim of unreviewed completion.

## Product and architecture boundaries

- Product name: **InSync**. Pilot: **Programming Fundamentals with broader foundational CS content**, including data structures and database concepts, retaining school and university audiences and English web use on laptop/desktop browsers. The exact first-demo syllabus remains proposed in the issue #2 decision package. Do not silently add mobile apps, unrelated non-CS subjects, external student-information integrations, or emotion/sensor collection.
- Selected structure: React/TypeScript in `frontend/`; one Python/FastAPI backend in `backend/`; LangGraph agent modules in `backend/agents/`. These are planned paths: check what actually exists before using commands.
- Selected foundations: SQLAlchemy/Pydantic; Supabase PostgreSQL and pgvector; Supabase Authentication; FastAPI WebSockets; Redis for temporary real-time state; Yjs for shared-document synchronization.
- Preserve five agents and their ownership:
  - **Tutor Agent:** material-grounded explanations and tutoring evidence.
  - **Quiz Agent:** quiz drafting, approved-question selection, answer evaluation, adaptation, and quiz evidence.
  - **Progress Agent:** performance analysis and supporting evidence.
  - **Teacher Assistant Agent:** recommendations and teacher-requested group proposals.
  - **Discussion Agent:** group hints and hint evidence.
- Coordinate agents through LangGraph routing and approved shared state. Clients use application APIs; do not expose individual agents directly or replace routing with direct agent-to-agent calls.
- `LearnerContext`/`InSyncState` scope, ownership, and persistence must follow their approved decision. The schema inventory is a candidate, not permission to generate migrations from unresolved fields or missing relationships.
- Preserve documented numerical rules and distinguish topic from concept, raw accuracy from weighted score, and average quiz accuracy from pooled grouping accuracy. Undocumented edge cases require their relevant decision; do not invent defaults from examples.

## Teacher control, access, and evidence

- Recommendations use **Approve / Dismiss**. Pending or dismissed recommendations cause no automatic learning activity. Approved recommendations route to the responsible agent under the approved execution contract.
- Group proposals use **Approve / Edit**; activation requires teacher approval. Group formation belongs to the Teacher Assistant Agent.
- AI-generated quiz questions require review before student use. Newly generated questions during an attempt require **additional teacher approval**. Waiting, fallback, and resumption follow the approved Q05 decision.
- Backend authorization must enforce the approved student/class/group/teacher matrix, including storage, retrieval, and WebSockets. A hidden UI control or client-provided group ID is not authorization.
- Keep answer keys, hidden discussion solutions, privileged credentials, and private learner evidence out of unauthorized payloads. Filter retrieval by authorized class/current topic before similarity selection.
- Retain evidence provenance and producer ownership. Do not attribute group hints to individual performance without an approved attribution rule. Cursor/mouse movement is not learning evidence.

## Yjs and controlled editing

- Yjs synchronizes shared documents; backend permission checks enforce who may edit. Yjs convergence alone is not controlled editing.
- Confirmed surfaces are a shared **Python editor with execution and displayed output**, and a **shared whiteboard**, with a separate editing-control holder for each surface. Exact board tools, bindings, grant/transfer/expiry, offline/reconnect, and persistence contracts remain in #7/#9/#10. Do not collapse both surfaces into one shared control grant.
- Python runtime/provider, isolation limits, package/file/network policies, and run permissions remain in #4/#7/#8. See the proposed dedicated runtime issue in the issue #2 decision package; it has not yet been published. Do not execute learner code inside the FastAPI application process.
- Verify provider/protocol compatibility with FastAPI WebSockets. Generic JSON chat messages are not a Yjs synchronization protocol; the early compatibility proof is issue #20.
- Reject unauthorized or stale-control updates before authoritative application, broadcast, or persistence. Browser read-only state complements server enforcement.
- Redis holds temporary presence/control state; durable Yjs document reconstruction uses the approved persistence design. Test convergence, revoked control, reconnect, and restart. Main implementation issues: #50 and #52.

## OpenRouter and model failover

- **OpenRouter is the selected initial text-generation gateway.** Preserve a provider-independent adapter boundary. A second gateway such as Hugging Face is not required by this choice.
- The demo requires **10–15 distinct generation models total**, one primary plus 9–14 alternatives, with ranked and verified routes. Exact models, licenses, underlying providers, per-operation eligibility, and numerical budgets remain decisions in #8; implementation is #18.
- Do not count aliases or multiple routes for one model as additional models. Verify live access, output compatibility, quality, latency, and cost; distinguish open-source from open-weight licensing.
- Track shared model/provider/account/platform limits. A list of models on one exhausted OpenRouter account does not provide independent availability.
- Failover must honor approved Retry-After/cooldowns, total deadline, maximum attempts, aggregate cost/retry/regeneration budget, and cancellation. Account for provider routing retries as well as application retries; do not blindly apply 20 seconds and two retries to every candidate.
- Every fallback preserves output validation, educational constraints, teacher-review gates, and logical request identity. Prevent duplicate persisted side effects. Exhaustion produces an explicit bounded unavailable state while preserving saved work.
- Embeddings are separate: model/hosting selection remains pending. Equal vector dimensions do not make embedding spaces interchangeable. A model/version change requires the approved compatibility or re-embedding/index migration.
- Use controlled fault injection for rate-limit/outage tests, not deliberate exhaustion of real quotas. Live model checks and pre-demo qualification are separate from deterministic doubles. Follow #55, #56, #57, and #61 for operational and acceptance evidence.

## Implementation and validation

- Derive commands from current manifests, pinned versions, scripts, and CI. Do not invent `npm test`, Python entry points, or Docker services that are not present. During foundation tasks, create and document the required commands within scope.
- Prefer lockfile-respecting installation; preserve TLS, package signatures, and checksums. Inspect existing configuration and credential presence before requesting missing values. Never print secrets or put credentials in files, issues, prompts, or logs; use secure settings.
- Implement the issue's acceptance criteria with relevant tests. Cover normal, boundary, unauthorized, and failure/recovery behavior where applicable. Run builds/type checks and meaningful service-backed checks required by the affected workflow.
- Use deterministic provider doubles for routine tests and fault injection. Label real-provider checks separately; mocked success is not evidence of working hosted inference, authentication, storage, or deployment.
- Pure algorithm tests should use approved worked examples. Integration checks must demonstrate actual behavior, not only a running process, open port, or zero-test result.
- Test access isolation, hidden-field serialization, duplicate requests/events, teacher-review pause/resume, and restart/reconnect behavior for changes that touch those boundaries. Preserve learner records independently of model availability.
- For documentation-only changes, verify links, identifiers, consistency, and whitespace; do not fabricate an application test result or add trivial tests.
- Stop expanding unrelated checks once relevant validation passes. Report failures and missing external prerequisites accurately; do not disable assertions or silently weaken acceptance criteria.

## Planning artifacts and completion report

- `planning/GITHUB_ISSUES.json` contains issue drafts and actual GitHub mappings. `planning/PUBLICATION_STATE.json` records publication evidence, not product implementation progress.
- The issue publisher changes GitHub only in its explicit publish/link modes. Do not rerun an old planning generator that could overwrite approved amendments or actual issue mappings. Read live issues before editing and preserve teammate changes.
- Keep planning and issue descriptions synchronized when the task authorizes a requirement change. Do not mark a model, feature, phase, or deployment ready merely because its issue was created.
- Finish with the issue addressed, concrete changes, checks actually run and their outcomes, unresolved blockers/decisions, and PR/branch details when applicable. State whether local work is uncommitted, committed, pushed, or published accurately. A human/peer review is still required where the issue specifies it.
