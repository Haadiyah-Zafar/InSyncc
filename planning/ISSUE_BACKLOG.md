# InSync implementation issue drafts

**Status: proposed; no GitHub issues have been created.**

Read [the implementation plan](IMPLEMENTATION_PLAN.md) first. IDs below are local planning IDs, not GitHub issue numbers. Dependencies will become issue links after approved publication.

60 issues across eight phase milestones. Start dependencies permit coding; close dependencies permit parallel mock/contract work but require real integration before completion.

## P0 — Decisions and contracts

### [P0-01] Approve pilot scope, screen inventory, and evaluation baseline

<!-- insync-plan-id: P0-01; plan-version: 0.2 -->
**Outcome:** Approve pilot scope, screen inventory, and evaluation baseline
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q13, Q16, Q17, Q18.
**Source:** Context §§2–5, 7, 13–16; review register source-completeness note.

**Scope**

- Prepare a current-scope checklist for all five agents, the Programming Fundamentals pilot, both school and university audiences, and the fifteen documented use cases.
- Classify every prototype-only control as required, deferred, or illustrative; propose pilot topics, sample-data plan, evaluation questions, success measures, and approved report/diagram edits.
- Ask the human to accept the available-source coverage or supply missing decisions; record the exact acceptance and affected documents.

**Acceptance checks**

- [ ] The human approves the scope checklist and coverage limit; disputed features remain explicitly pending.
- [ ] Approved acceptance measures distinguish usability, learning-support quality, response time, cost, and coordination; no invented participant numbers or outcome claims.
- [ ] A traceability map connects the fifteen use cases to implementation and verification issues; evaluation includes teacher-review delay and the value of shared evidence.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-02] Approve learner state, graph ownership, and recovery contracts

<!-- insync-plan-id: P0-02; plan-version: 0.2 -->
**Outcome:** Approve learner state, graph ownership, and recovery contracts
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q01, Q15.
**Source:** Context §§8.4, 9–11; report §§5.2, 5.9, 6.4.1.

**Scope**

- Compare persistent LearnerContext and active InSyncState and propose their scopes across student, topic, class, session, and workflow.
- Specify field owners, source-tagged multi-writer evidence, concurrency rules, load/save boundaries, checkpoints, teacher-review interruption, and replay.
- Coordinate checkpoint and job failure behavior with P0-07 without selecting the unresolved interpretation silently.

**Acceptance checks**

- [ ] An approved state matrix names each field owner, reader, scope, persistence location, and merge rule.
- [ ] Sequence examples cover concurrent evidence, restart while awaiting a teacher, repeated events, and unavailable agents.
- [ ] The human approves the exact state/recovery decisions and downstream schema, graph, API, test, and diagram changes.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-03] Approve identity, access, enrollment, and teacher verification

<!-- insync-plan-id: P0-03; plan-version: 0.2 -->
**Outcome:** Approve identity, access, enrollment, and teacher verification
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q03, Q12, Q13.
**Source:** Context §§7, 8.2, 11–13; candidate USER, CLASS, CLASS_MEMBER.

**Scope**

- Specify Supabase identity/profile mapping, registration and password-reset flow, teacher-role verification, and class joining/review.
- Produce a read/write matrix for personal evidence, class materials, groups/messages, question answers, problem text, hidden solutions, and teacher monitoring.
- Define FastAPI authorization, database RLS, privileged backend operations, storage access, and WebSocket authorization together.

**Acceptance checks**

- [ ] The human approves the access matrix and enrollment lifecycle; a student cannot grant themselves teacher privileges.
- [ ] Examples cover another student, another class teacher, a removed member, expired authentication, and hidden-field serialization.
- [ ] Approved negative-access cases become fixtures for API, database, retrieval, storage, and WebSocket tests.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-04] Approve quiz lifecycle, adaptation edge cases, and in-attempt review

<!-- insync-plan-id: P0-04; plan-version: 0.2 -->
**Outcome:** Approve quiz lifecycle, adaptation edge cases, and in-attempt review
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q05, Q08, Q12.
**Source:** Context §§5, 6.2, 7; report §5.4; review Q05/Q08/Q12.

**Scope**

- Specify manual/AI quiz ownership, assignment, question versions, concept tags, attempt length/termination, repeats, interruption, and resumption.
- Present explicit choices for an exhausted question bank: waiting for review, an approved nearest-level question, or another human-selected path; include rejection, teacher absence, timeout, and resume behavior.
- Define opposite-answer and boundary streak resets, target versus actual question difficulty, duplicate submissions, rounding, and zero-attempt results.

**Acceptance checks**

- [ ] The human approves the attempt state machine and examples without weakening additional teacher approval for newly generated questions.
- [ ] Examples preserve Medium cold start, two-answer changes, Easy/Medium/Hard weights 1/2/3, and separate raw and weighted scores.
- [ ] Every transition states authorization, persistence, user feedback, event effects, and retry behavior.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-05] Approve tutor, progress, and recommendation semantics

<!-- insync-plan-id: P0-05; plan-version: 0.2 -->
**Outcome:** Approve tutor, progress, and recommendation semantics
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** C; **Size:** L; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q07, Q08, Q09, Q12.
**Source:** Context §§6.1, 6.3–6.4, 10–11; report §§5.3, 5.5–5.6.

**Scope**

- Identify which operations in each agent use an LLM and which use the documented calculations; settle prompt and AI-label wording.
- Resolve quiz weakness versus aggregated mastery, evidence windows, no-data cases, comparable quizzes, normalized recurring mistakes, and analysis triggers.
- Specify tutoring session identity, adaptation bounds/reset/precedence, repeated-question recognition, missing-retrieval behavior, and ongoing-quiz answer protection.
- Define recommendation priorities, non-overlapping thresholds, action payloads and agent routing, student feedback ownership, teacher precedence, and dismissal/pending behavior.

**Acceptance checks**

- [ ] Approved worked examples cover exact .50/.70 mastery boundaries, ±.10 trend changes, three-of-five mistakes, and conflicting weak signals.
- [ ] The human approves an operation-by-operation LLM matrix and tutor/recommendation behavior, including cold starts and insufficient evidence.
- [ ] Each recommendation action maps to an accountable executor and evidence references; no activity runs from a pending or dismissed recommendation.
- [ ] Decisions can be reviewed in smaller Q-specific records; unresolved subdecisions keep their dependent issues blocked.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-06] Approve grouping, discussion, and shared workspace behavior

<!-- insync-plan-id: P0-06; plan-version: 0.2 -->
**Outcome:** Approve grouping, discussion, and shared workspace behavior
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** A; **Size:** L; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q06, Q10, Q11.
**Source:** Context §§6.5–6.6, 8.2; report §§5.7–5.8.

**Scope**

- Specify balanced group initialization/remainders/ties and a complete strength-based construction procedure, missing-data handling, manual groups, and post-approval edits.
- Use Yjs for shared-document synchronization, as clarified by the human on 9 October 2026. Define the editable object/editor binding and controlled-editing policy: who may edit, what scope they control, how control is granted/transferred, and when it expires.
- Define authenticated Yjs document/awareness transport through the FastAPI WebSocket architecture, persistence of document updates/snapshots, reconnect/offline behavior, and meaningful learning events. Yjs convergence does not itself enforce edit permissions.
- Specify problem authoring/approval/open-close lifecycle, hint trigger windows, cooldowns, overlapping triggers, correct-discussion detection, and group-to-learner evidence attribution.

**Acceptance checks**

- [ ] The human approves grouping examples covering remainders, equal scores, insufficient data, invalid sizes, and membership changes.
- [ ] Workspace and problem state machines include unauthorized actions and disconnect/reconnect behavior; single-editor, section-based, or other control semantics are explicitly approved rather than inferred from the use of Yjs.
- [ ] The control policy states how the server rejects unauthorized/stale Yjs updates before application/broadcast/persistence and how the client recovers any rejected local edits after control changes.
- [ ] Hint cases preserve levels 1–3, three-minute inactivity, five off-topic messages, five-minute proactive cooldown, and no private individual weakness in hints; unresolved timing interpretations are explicitly decided.
- [ ] Raw cursor and mouse movement are excluded from learning evidence; group events are not silently treated as individual performance.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-07] Approve service choices, background execution, and operations

<!-- insync-plan-id: P0-07; plan-version: 0.2 -->
**Outcome:** Approve service choices, background execution, and operations
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** None.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q14, Q15, Q18.
**Source:** Context §§8, 12, 14; report §§6.4.5–6.4.9.

**Scope**

- Compare concrete LLM/embedding providers and models, storage, accepted upload formats/limits, chunking/retrieval settings, and vector dimension compatibility.
- Choose and approve the background mechanism, checkpoint integration with P0-02, timeout/retry/backoff rules, validation regeneration budget, cancellation, and pending-work recovery.
- Specify development/test service topology, hosting target, API budget, monitoring, content-report handling, learner-data consent/retention/deletion, backups, and restore expectations.
- List required variable names and provider access; check existing bindings before requesting secure configuration.

**Acceptance checks**

- [ ] The human approves choices with cost, complexity, privacy, and recovery trade-offs; no provider, queue, or hosting platform is silently assumed.
- [ ] Embedding dimension and database/re-indexing implications agree; the documented 20-second timeout/two-retry rule has an approved precise interpretation.
- [ ] An operations record identifies required services, deployment permissions, secret names, backup/restore criteria, and numerical pilot targets agreed in P0-01.
- [ ] Credentials are supplied through secure settings when needed, never issue bodies or source files.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-08] Approve the canonical schema and domain model

<!-- insync-plan-id: P0-08; plan-version: 0.2 -->
**Outcome:** Approve the canonical schema and domain model
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** B; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P0-01, P0-02, P0-03, P0-04, P0-05, P0-06, P0-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q04, Q16.
**Source:** Entire candidate schema; context §§9–12; report Table 4.17 and Figure 4.18.

**Scope**

- Reconcile the 21 candidate entities with the ER diagram and approved behavior; preserve a conflict-resolution record.
- Resolve assignment, per-question approval/versioning, attempt ordering, evidence provenance, teacher decision execution audit, Yjs document identity/update/snapshot persistence and group/problem linkage, content reports, and checkpoint/job storage.
- Specify names, types, keys, constraints, null/default rules, indexes, authorization policies, history retention, and migration ownership; produce an updated ER diagram.

**Acceptance checks**

- [ ] The human approves the canonical schema and exact additions/removals; the candidate inventory is not automatically promoted to a migration specification.
- [ ] Every approved lifecycle in P0-02 through P0-07 can be represented without an undocumented state or relation.
- [ ] Feature migration boundaries and a single migration integration owner are documented; report/schema conflicts are tracked explicitly.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P0-09] Approve API, event, agent, and screen contracts

<!-- insync-plan-id: P0-09; plan-version: 0.2 -->
**Outcome:** Approve API, event, agent, and screen contracts
**Milestone:** P0 — Decisions and contracts
**Suggested workstream:** A; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P0-08.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q12, Q13, Q16, Q17.
**Source:** Context §§7–10, 13; report §§6.3, 6.6–6.7.

**Scope**

- Define application REST operations, request/response/error schemas, authorization, pagination where required, and duplicate/replay handling.
- Define WebSocket payloads/reconnection, Yjs synchronization/awareness protocol and control-grant messages, domain events, agent input/output contracts, state ownership, and teacher-review transitions. Preserve Yjs protocol compatibility; do not treat it as arbitrary JSON chat messages.
- Map approved screens and empty/loading/error/review states to contracts, and create fixtures that frontend and backend contributors can share.
- Record approved interface signatures and figure/text changes; preserve exact agent names and Approve/Dismiss versus Approve/Edit.

**Acceptance checks**

- [ ] Versioned contracts and fixtures cover all approved use cases, including unapproved quiz/group denial and pending teacher actions.
- [ ] Frontend mocks and backend schemas can be checked against the same examples; no client API exposes an individual agent or hidden solutions.
- [ ] The human approves remaining product-visible contract choices; peer review verifies consistency with the approved schema and decision records.

**Approval boundary**

Requires explicit human approval of the listed decision and affected downstream changes. Preparing options is allowed; selecting an unresolved design is not authorized by backlog approval.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P1 — Development foundation

### [P1-01] Establish repository tooling and contribution workflow

<!-- insync-plan-id: P1-01; plan-version: 0.2 -->
**Outcome:** Establish repository tooling and contribution workflow
**Milestone:** P1 — Development foundation
**Suggested workstream:** B; **Size:** S; one accountable owner, a different reviewer.
**Start after:** P0-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §§8.1, 14; report §6.7.2–6.7.3.

**Scope**

- Create the documented frontend/ and backend/ layout with pinned compatible Node/Python tooling and package-manager policy.
- Document install, branch, PR, review, test, and one-active-issue conventions; define shared-file and migration ownership.

**Acceptance checks**

- [ ] Tool versions and dependency-lock policy are reproducible; development commands have explicit working directories.
- [ ] A PR template links its issue, acceptance evidence, contract changes, and reviewer; main is the integration branch.
- [ ] Required branch protection is documented and configured only with repository-admin authorization; capability limitations are reported.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-02] Create the FastAPI application foundation

<!-- insync-plan-id: P1-02; plan-version: 0.2 -->
**Outcome:** Create the FastAPI application foundation
**Milestone:** P1 — Development foundation
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P1-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §8.1; report §§6.3.1.2–6.3.1.3.

**Scope**

- Create app initialization, validated environment configuration, routing/service boundaries, common errors, request correlation, and health/readiness checks.
- Keep backend application services and backend/agents/ in one FastAPI application.

**Acceptance checks**

- [ ] The application starts from documented commands and serves meaningful health/readiness responses.
- [ ] Missing required configuration fails clearly; secrets are redacted from logs/errors.
- [ ] Backend test fixtures exercise startup and a representative error response.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-03] Create the React/TypeScript application shell

<!-- insync-plan-id: P1-03; plan-version: 0.2 -->
**Outcome:** Create the React/TypeScript application shell
**Milestone:** P1 — Development foundation
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P1-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §§8.1, 12–13.

**Scope**

- Create app bootstrap, navigation, shared accessible form/status components, API client boundary, and provisional role-layout slots.
- Keep feature modules separate so later issues can add routes without rewriting the application shell.

**Acceptance checks**

- [ ] Development startup, production build, and type checking succeed.
- [ ] Shared controls support keyboard use, labels, loading, empty, and error states.
- [ ] No mock feature or hard-coded role is represented as authenticated application behavior.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-04] Provide reproducible development and test services

<!-- insync-plan-id: P1-04; plan-version: 0.2 -->
**Outcome:** Provide reproducible development and test services
**Milestone:** P1 — Development foundation
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P1-01, P0-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §8; onboarding environment requirements.

**Scope**

- Configure the approved PostgreSQL/pgvector, Redis, Supabase authentication/storage, and background-service setup.
- Provide non-secret environment examples, start/stop/readiness instructions, test isolation, and a synthetic-data reset process.
- Prepare reusable Codex cloud install/start configuration after commands are validated; use the existing isolated checkout rather than creating worktrees by default.

**Acceptance checks**

- [ ] A fresh developer environment connects to each required service and runs a functional database/vector/Redis/storage/auth smoke check as applicable.
- [ ] A restart preserves intended data and restores required processes through documented commands.
- [ ] Mocked services are clearly distinguished from real integration checks; missing credentials block only dependent checks.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-05] Run build and tests in pull-request CI

<!-- insync-plan-id: P1-05; plan-version: 0.2 -->
**Outcome:** Run build and tests in pull-request CI
**Milestone:** P1 — Development foundation
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P1-02, P1-03, P1-04.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §14; report §6.7.3.

**Scope**

- Add frontend build/type checks, backend checks, service-backed tests, contract checks when available, and test result artifacts.
- Use isolated synthetic data and deterministic provider doubles for routine CI; separate opt-in credentialed smoke tests.

**Acceptance checks**

- [ ] An intentional failing assertion causes the PR check to fail and its test result is visible.
- [ ] The normal suite runs actual tests; passing with zero collected tests does not satisfy this issue.
- [ ] Fork PRs cannot access deployment or provider secrets; setup uses lockfiles and verified downloads.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-06] Implement core database migrations and access-policy foundation

<!-- insync-plan-id: P1-06; plan-version: 0.2 -->
**Outcome:** Implement core database migrations and access-policy foundation
**Milestone:** P1 — Development foundation
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-08, P1-02, P1-04.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q03, Q04.
**Source:** Approved P0-08 schema; candidate USER/CLASS/CLASS_MEMBER/TOPIC/CONCEPT/LEARNING_SESSION.

**Scope**

- Implement only approved core identity/class/topic/session tables, database access, and relevant constraints/RLS policies.
- Provide migration runner, clean-test-database fixtures, and feature migration conventions; later issues own their feature tables.

**Acceptance checks**

- [ ] Migrations apply to an empty test database and upgrade a supported earlier state predictably.
- [ ] Database access checks cover own versus foreign class/student and the approved privileged-operation rules.
- [ ] One integration owner reviews migration ordering; tests do not rely on manually edited hosted tables.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-07] Implement LangGraph state, routing, and review infrastructure

<!-- insync-plan-id: P1-07; plan-version: 0.2 -->
**Outcome:** Implement LangGraph state, routing, and review infrastructure
**Milestone:** P1 — Development foundation
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-09, P1-02, P1-06.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q01, Q15.
**Source:** Approved P0-02/P0-09 contracts; context §§9–11.

**Scope**

- Implement BaseAgent, InSyncState, EventRouter, validated state writes, persistence/checkpoint adapters, and teacher-review interruption/resumption.
- Use test nodes to verify infrastructure; feature issues register real agent nodes later.

**Acceptance checks**

- [ ] Routing tests verify registered events, unknown-event errors, producer ownership, and source-tagged evidence merge behavior.
- [ ] A pending review survives process restart and resumes only for an authorized decision under approved replay rules.
- [ ] A repeated event/approval does not duplicate its intended effect; infrastructure tests do not claim that all five agents are implemented.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-08] Implement model-provider wrappers and validated outputs

<!-- insync-plan-id: P1-08; plan-version: 0.2 -->
**Outcome:** Implement model-provider wrappers and validated outputs
**Milestone:** P1 — Development foundation
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-07, P0-09, P1-02.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q14, Q15.
**Source:** Approved provider/operation matrix; context §§8.4, 12.

**Scope**

- Implement provider-independent LLMClient and embedding adapters with typed schemas, approved prompt templates, filtering, and minimum necessary context.
- Implement approved timeouts, transport retries, regeneration limits, usage/cost metadata, and deterministic doubles.

**Acceptance checks**

- [ ] Tests cover malformed output, provider timeout, rate limit, exhausted retry budget, and invalid embedding dimension.
- [ ] One credentialed LLM request and one embedding request verify the chosen providers when securely configured; failures are reported distinctly from double-based tests.
- [ ] Unvalidated output never writes state; logs and client responses contain no privileged credential or unnecessary learner history.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-09] Implement background execution and recovery

<!-- insync-plan-id: P1-09; plan-version: 0.2 -->
**Outcome:** Implement background execution and recovery
**Milestone:** P1 — Development foundation
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-07, P0-09, P1-02, P1-04, P1-06.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q15.
**Source:** Approved P0-07 runtime contract; report §6.4.8.

**Scope**

- Implement the approved job mechanism, job/status persistence where selected, retry/cancellation rules, and recovery of interrupted work.
- Expose the agreed processing status contract and reusable job hooks for material processing, quiz generation, and progress analysis.

**Acceptance checks**

- [ ] A slow job does not block ordinary requests; completion/failure is visible through the approved interface.
- [ ] Restart and duplicate-delivery tests follow the approved recovery contract without duplicate learning records.
- [ ] Exhausted work remains diagnosable/retryable as specified; the implementation does not introduce an unapproved queue topology.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P1-10] Verify Yjs synchronization and controlled editing with FastAPI

<!-- insync-plan-id: P1-10; plan-version: 0.2 -->
**Outcome:** Verify Yjs synchronization and controlled editing with FastAPI
**Milestone:** P1 — Development foundation
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-03, P0-06, P0-09, P1-02, P1-03.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q11.
**Source:** Human clarification, 9 October 2026; context §8.2; approved Q11 contract.

**Scope**

- Build a small two-client technical proof using a Yjs document/editor binding and a compatible provider/server adapter over the approved FastAPI WebSocket architecture.
- Check protocol/library compatibility, document and awareness synchronization, approved control enforcement, disconnect/reconnect, and snapshot/update round trips.
- Record supported package versions and the integration approach. If compatibility needs a different transport/service or changes the approved contract, bring that concrete change for approval before adoption.

**Acceptance checks**

- [ ] Two real Yjs clients converge for permitted edits, reconnect, and reconstructed persisted state; the test exercises Yjs updates rather than plain-text WebSocket echo.
- [ ] An unauthorized or stale-control update is rejected before changing the authoritative document, broadcasting, or persistence; the approved client recovery behavior is demonstrated.
- [ ] Temporary awareness/control state is distinguished from durable document state; disconnected control holders follow the approved expiry/recovery policy.
- [ ] A short compatibility report unblocks P6-06/P6-07 or identifies a specific design change for approval. This technical proof does not claim the full workspace is implemented.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P2 — Identity, classes, and sessions

### [P2-01] Implement backend authentication and authorization

<!-- insync-plan-id: P2-01; plan-version: 0.2 -->
**Outcome:** Implement backend authentication and authorization
**Milestone:** P2 — Identity, classes, and sessions
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-09, P1-06.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q03, Q13.
**Source:** Approved P0-03; context §§7, 12.

**Scope**

- Validate Supabase sessions/tokens, map profiles and verified roles, and implement reusable role/class/group permission checks.
- Implement approved account onboarding and server-side identity operations.

**Acceptance checks**

- [ ] Valid, expired, malformed, wrong-audience, and unauthorized credentials are covered.
- [ ] Student role escalation and cross-user/class access fail; database policy and API behavior agree.
- [ ] No service-role credential is required in the browser; public errors do not expose sensitive token data.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P2-02] Build login, account recovery, and role-aware navigation

<!-- insync-plan-id: P2-02; plan-version: 0.2 -->
**Outcome:** Build login, account recovery, and role-aware navigation
**Milestone:** P2 — Identity, classes, and sessions
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-09, P1-03.
**Integrate/close after:** P2-01 (in addition to start dependencies).
**Review references:** Q03, Q13.
**Source:** Approved screen inventory and P0-03 identity flow.

**Scope**

- Implement the approved login, registration/onboarding, logout, and password-reset screens using Supabase Authentication.
- Connect authenticated API requests and student/teacher navigation, including session expiry and access-denied feedback.

**Acceptance checks**

- [ ] Tests cover approved account journeys and failed login/reset behavior without leaking account secrets.
- [ ] A refreshed session retains appropriate navigation; logout/expiry removes protected client state.
- [ ] Integration with P2-01 succeeds; hiding a route is not treated as backend authorization.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P2-03] Implement classes, enrollment, topics, and concepts

<!-- insync-plan-id: P2-03; plan-version: 0.2 -->
**Outcome:** Implement classes, enrollment, topics, and concepts
**Milestone:** P2 — Identity, classes, and sessions
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-09, P2-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q12.
**Source:** Context §7; approved core schema and enrollment contract.

**Scope**

- Implement teacher class creation/update/archive, approved join-code/enrollment flow, membership operations, and topic/concept management.
- Retain archived records and enforce teacher ownership and enrolled-student reads.

**Acceptance checks**

- [ ] Teacher and student journeys cover valid/invalid/duplicate enrollment and unauthorized changes.
- [ ] Archiving requires the approved confirmation flow and preserves records.
- [ ] Topics and Concepts remain distinct; validation and empty-state responses match the shared contract.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P2-04] Implement class learning sessions and lifecycle events

<!-- insync-plan-id: P2-04; plan-version: 0.2 -->
**Outcome:** Implement class learning sessions and lifecycle events
**Milestone:** P2 — Identity, classes, and sessions
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-03, P1-07, P1-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q12, Q15.
**Source:** Context §§5.2, 7, 10; approved P0-04/P0-09 session contracts.

**Scope**

- Implement teacher start/end operations, authorized student session visibility, and the approved distinction from individual tutoring sessions.
- Persist a session-ended event for later Quiz Agent registration; handle repeated end requests predictably.

**Acceptance checks**

- [ ] Only the owning teacher can start/end a session on a valid topic.
- [ ] A repeated end does not emit duplicate logical work; session state persists across restart.
- [ ] The event is contract-valid; actual draft-quiz generation is explicitly verified in P4-03.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P2-05] Build class, enrollment, and session screens

<!-- insync-plan-id: P2-05; plan-version: 0.2 -->
**Outcome:** Build class, enrollment, and session screens
**Milestone:** P2 — Identity, classes, and sessions
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-02, P0-09.
**Integrate/close after:** P2-03, P2-04 (in addition to start dependencies).
**Review references:** Q12, Q13.
**Source:** Context §7; approved screen inventory.

**Scope**

- Build teacher class/topic/concept management and session controls, plus student class list/join/detail views.
- Use approved API fixtures during parallel development and integrate the real services before closure.

**Acceptance checks**

- [ ] Teacher creates a class/topic and starts/ends a session through the UI; student follows approved enrollment flow.
- [ ] Invalid membership, archived class, no topic, no active session, loading, and failure cases are visible.
- [ ] Integration tests verify server permissions and retained records after archive.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P2-06] Verify the core teacher/student journey with pilot fixtures

<!-- insync-plan-id: P2-06; plan-version: 0.2 -->
**Outcome:** Verify the core teacher/student journey with pilot fixtures
**Milestone:** P2 — Identity, classes, and sessions
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-04, P2-05, P1-05.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §§3, 7, 14; approved P0-01 pilot.

**Scope**

- Create repeatable synthetic teacher/student/class/topic/concept fixtures and a core browser/API smoke journey.
- Document the phase demo and isolate data so three developers can test independently.

**Acceptance checks**

- [ ] A real auth/database-backed test covers login, class creation, enrollment, session start/end, and cross-class denial.
- [ ] Fixtures are safe to reset in the designated development/test environment and never target production by default.
- [ ] The demo records actual checks and remaining configuration needs; no AI behavior is claimed yet.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P3 — Learning materials and Tutor Agent

### [P3-01] Implement learning-material upload and access

<!-- insync-plan-id: P3-01; plan-version: 0.2 -->
**Outcome:** Implement learning-material upload and access
**Milestone:** P3 — Learning materials and Tutor Agent
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-03, P1-09, P0-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q04, Q14.
**Source:** Context §§7, 8.3; approved material schema/storage contract.

**Scope**

- Add feature migrations and upload/list/access operations with approved metadata, file limits, type validation, and storage permissions.
- Persist processing status and enqueue ingestion using the agreed job contract.

**Acceptance checks**

- [ ] An authorized teacher uploads a supported file; invalid/oversized files and foreign-class access are rejected.
- [ ] Stored originals are traceable to material/topic/class and have the approved access policy.
- [ ] Upload/storage/job failures give actionable states; duplicates/replacements follow the approved policy.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P3-02] Implement extraction, chunking, and embeddings

<!-- insync-plan-id: P3-02; plan-version: 0.2 -->
**Outcome:** Implement extraction, chunking, and embeddings
**Milestone:** P3 — Learning materials and Tutor Agent
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P3-01, P1-08.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q14, Q15.
**Source:** Context §8.3; approved retrieval configuration.

**Scope**

- Process each approved file format into source-linked chunks and embeddings; persist approved metadata and vector dimensions.
- Implement retry/reprocessing behavior and clear ready/failed transitions.

**Acceptance checks**

- [ ] Real sample Programming Fundamentals materials produce retrievable, source-traceable chunks.
- [ ] Empty/corrupt/unsupported input, provider failure, dimension mismatch, and repeated processing are tested.
- [ ] Failed or partial ingestion is not exposed as ready; updated material follows the approved version/deletion rules.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P3-03] Implement authorized top-three material retrieval

<!-- insync-plan-id: P3-03; plan-version: 0.2 -->
**Outcome:** Implement authorized top-three material retrieval
**Milestone:** P3 — Learning materials and Tutor Agent
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P3-02, P2-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q03, Q09, Q14.
**Source:** Context §§6.1, 8.3; report §6.7.4.

**Scope**

- Implement Retriever using pgvector with authorization and current-topic filtering before similarity selection.
- Return up to the three relevant chunks under the approved threshold and missing-material behavior.

**Acceptance checks**

- [ ] Known questions retrieve expected sources from the allowed class/topic.
- [ ] A closer vector from a foreign class can never be returned; changed membership is respected.
- [ ] No-match, fewer-than-three matches, and ingestion/provider failures remain distinguishable.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P3-04] Implement the Tutor Agent and tutoring persistence

<!-- insync-plan-id: P3-04; plan-version: 0.2 -->
**Outcome:** Implement the Tutor Agent and tutoring persistence
**Milestone:** P3 — Learning materials and Tutor Agent
**Suggested workstream:** C; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P3-03, P1-07, P2-04.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q09, Q12.
**Source:** Context §6.1; approved P0-02/P0-05/P0-09.

**Scope**

- Implement on-topic/off-topic/unclear handling, explanation level adaptation, explanation/example/check-question output, and evidence persistence.
- Add approved tutoring/context migrations and session APIs; protect ongoing quiz answers and register the tutoring graph path.
- Implement instructor review flags and fallback behavior exactly as approved.

**Acceptance checks**

- [ ] Tests cover three levels, approved repeat/confusion/streak rules, clarification, retrieval failure, and accessible history after provider failure.
- [ ] Invalid or answer-leaking content regenerates once, then uses the approved fallback; private state is not exposed.
- [ ] A real provider-backed material-to-tutor journey stores valid source-linked evidence; deterministic tests cover failure paths.
- [ ] The ongoing-quiz protection interface is tested against contract fixtures here and real attempts in P5-06.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P3-05] Build teacher material management screens

<!-- insync-plan-id: P3-05; plan-version: 0.2 -->
**Outcome:** Build teacher material management screens
**Milestone:** P3 — Learning materials and Tutor Agent
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P3-01, P3-02 (in addition to start dependencies).
**Review references:** Q14.
**Source:** Context §7; approved upload screens.

**Scope**

- Implement topic material upload/list, validation, progress/status, permitted access, and approved retry/replacement actions.

**Acceptance checks**

- [ ] A teacher uploads material and observes processing become ready through real services.
- [ ] Invalid file, storage failure, ingestion failure, and empty list have useful feedback.
- [ ] Access and available controls reflect server permissions; no privileged storage credential reaches the client.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P3-06] Build and integrate student tutoring screens

<!-- insync-plan-id: P3-06; plan-version: 0.2 -->
**Outcome:** Build and integrate student tutoring screens
**Milestone:** P3 — Learning materials and Tutor Agent
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P3-04 (in addition to start dependencies).
**Review references:** Q09, Q12.
**Source:** Context §§6.1, 7, 12.

**Scope**

- Build approved tutoring start/history/question/check-answer/end flow with visible AI content and source information where approved.
- Connect tutoring API, adaptation feedback, instructor flags, and unavailable/no-material states.

**Acceptance checks**

- [ ] A student in an authorized session asks a material-grounded question and answers a check question; evidence persists.
- [ ] Off-topic/unclear/failed requests and reload/history behavior follow approved contracts.
- [ ] Keyboard and readable status behavior work; a foreign student cannot read another learner’s history.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P4 — Approved adaptive assessment

### [P4-01] Implement manual quiz authoring, review, and assignment

<!-- insync-plan-id: P4-01; plan-version: 0.2 -->
**Outcome:** Implement manual quiz authoring, review, and assignment
**Milestone:** P4 — Approved adaptive assessment
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-04, P0-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q04, Q05, Q12.
**Source:** Context §§5, 7; approved quiz schema/state machine.

**Scope**

- Add quiz/question/assignment/review migrations and teacher operations for manual authoring, edit, approval, and assignment.
- Implement approved question version/concept/difficulty representation and student availability checks.

**Acceptance checks**

- [ ] Only authorized teachers can author/review/assign; students can discover only their approved assigned quizzes.
- [ ] Editing reviewed content obeys version/reapproval rules; hidden answers never appear in student payloads.
- [ ] Manual authoring remains usable when external AI generation is unavailable.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P4-02] Implement adaptive difficulty, question selection, and scoring

<!-- insync-plan-id: P4-02; plan-version: 0.2 -->
**Outcome:** Implement adaptive difficulty, question selection, and scoring
**Milestone:** P4 — Approved adaptive assessment
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-04, P0-05, P0-09, P1-02.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q05, Q07, Q08.
**Source:** Context §6.2; report §5.4; approved edge-case decisions.

**Scope**

- Implement DifficultyHeuristic and pure scoring/selection functions using approved inputs, outputs, and exhausted-bank behavior.
- Preserve unanswered-question selection, cold/returning start levels, weakness evidence, and raw/weighted score distinction.

**Acceptance checks**

- [ ] The six-question report example yields 3/6 raw accuracy, 6/14 weighted score, final Medium, and Concept B weakness.
- [ ] Boundary/opposite-answer streaks, no attempts, repeats, ties, fallback difficulty, and all-approved-bank-exhausted cases match approved examples.
- [ ] An unapproved question can never be selected; arithmetic tests do not depend on model responses.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P4-03] Implement Quiz Agent draft generation and question review requests

<!-- insync-plan-id: P4-03; plan-version: 0.2 -->
**Outcome:** Implement Quiz Agent draft generation and question review requests
**Milestone:** P4 — Approved adaptive assessment
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P4-01, P1-07, P1-08, P3-03, P1-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q05, Q15.
**Source:** Context §§5.2, 6.2, 10.

**Scope**

- Register session-ended draft generation, validate generated question structure/concept/difficulty, and persist reviewable drafts.
- Implement the approved new-question review request path for an exhausted in-progress attempt.

**Acceptance checks**

- [ ] Ending a real session creates a teacher-visible draft, never an automatically available student quiz.
- [ ] Repeated events and generation retries do not duplicate logical quizzes or publish unapproved questions.
- [ ] Provider failure supports the approved retry/manual-authoring path; newly generated questions require additional teacher approval.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P4-04] Implement durable adaptive quiz attempts

<!-- insync-plan-id: P4-04; plan-version: 0.2 -->
**Outcome:** Implement durable adaptive quiz attempts
**Milestone:** P4 — Approved adaptive assessment
**Suggested workstream:** B; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P4-01, P4-02, P4-03, P1-07, P1-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q04, Q05, Q08.
**Source:** Approved P0-04; context §§6.2, 10.

**Scope**

- Add attempt/answer/evidence migrations and start/answer/next/complete/resume APIs through the Quiz Agent route.
- Implement approved in-attempt review waits/fallbacks, additional approval, rejected/unavailable-teacher behavior, and saved scores/final difficulty.
- Persist a quiz-completed event for progress analysis; isolate result storage from later agent failures.

**Acceptance checks**

- [ ] A complete adaptive attempt produces expected scores, evidence, and a single logical completion event.
- [ ] Duplicate/concurrent answers, reload/restart, exhausted bank, teacher approval/rejection, and unauthorized attempts are tested.
- [ ] No unapproved question or hidden answer reaches the learner; saved results remain available if downstream analysis fails.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P4-05] Build teacher quiz authoring and review screens

<!-- insync-plan-id: P4-05; plan-version: 0.2 -->
**Outcome:** Build teacher quiz authoring and review screens
**Milestone:** P4 — Approved adaptive assessment
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P4-01, P4-03, P4-04 (in addition to start dependencies).
**Review references:** Q05, Q12.
**Source:** Context §§5.1, 7.

**Scope**

- Build manual/AI draft review, edit/remove questions, approve/assign, and the additional in-attempt question review queue.
- Present processing, invalid-output, empty-draft, unavailable-provider, and already-reviewed states.

**Acceptance checks**

- [ ] A teacher can manually author and assign a quiz and review an AI-generated draft through real services.
- [ ] Additional question approval is visible and tied to the approved content version.
- [ ] Repeated review clicks and stale drafts are handled without unintentionally publishing new content.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P4-06] Build and integrate adaptive student quiz screens

<!-- insync-plan-id: P4-06; plan-version: 0.2 -->
**Outcome:** Build and integrate adaptive student quiz screens
**Milestone:** P4 — Approved adaptive assessment
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P4-04 (in addition to start dependencies).
**Review references:** Q05, Q08, Q13.
**Source:** Context §§6.2, 7; approved quiz UI scope.

**Scope**

- Build available-quiz/start/question/submit/results flow and approved interruption/review-wait/resume behavior.
- Show raw accuracy and weighted score distinctly; implement only approved hints, exit, and feedback behavior.

**Acceptance checks**

- [ ] A student completes the adaptive example through real APIs and sees correct results/final difficulty.
- [ ] Double submit, reload, lost connection, unavailable teacher, and rejection follow the approved state machine.
- [ ] Browser payloads do not expose answer keys; students cannot access unassigned/unapproved quizzes.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P5 — Progress and teacher-reviewed interventions

### [P5-01] Implement the Progress Agent and evidence analysis

<!-- insync-plan-id: P5-01; plan-version: 0.2 -->
**Outcome:** Implement the Progress Agent and evidence analysis
**Milestone:** P5 — Progress and teacher-reviewed interventions
**Suggested workstream:** C; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P4-04, P3-04, P1-07, P1-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q07, Q08, Q10.
**Source:** Context §6.3; approved analysis/state schema.

**Scope**

- Add mastery/analysis/evidence migrations and graph processing for quiz completion, tutoring evidence, and approved analysis triggers; coordinate migration integration with B.
- Compute concept mastery, average quiz accuracy, comparable-result trends, and recurring mistakes; expose a contract for later group evidence.
- Implement authorized personal/class/learner/topic progress query APIs and evidence serializers for the dashboards, following the shared contracts.
- Implement only the approved LLM-supported portions, with numeric calculations following approved formulas.

**Acceptance checks**

- [ ] Tests cover .50/.70 boundaries, ±.10 trends, three-of-five normalized mistakes, first/no result, differing quiz lengths, and evidence windows.
- [ ] Average quiz accuracy is distinct from pooled grouping accuracy; no-data topics are not labeled weak.
- [ ] Replayed events do not double count; analysis failure preserves original learning evidence and supports later recovery.
- [ ] Collaboration input uses approved fixtures here; real group attribution is validated in P6-09.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P5-02] Implement Teacher Assistant recommendations and group-performance inputs

<!-- insync-plan-id: P5-02; plan-version: 0.2 -->
**Outcome:** Implement Teacher Assistant recommendations and group-performance inputs
**Milestone:** P5 — Progress and teacher-reviewed interventions
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P5-01, P1-08.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q07, Q08, Q12.
**Source:** Context §§6.4–6.5; approved recommendation policy.

**Scope**

- Add recommendation records and Teacher Assistant graph logic for approved actions, evidence, priorities, and targets.
- Provide pooled overall/topic performance inputs for later grouping; preserve provenance and missing-data semantics.

**Acceptance checks**

- [ ] Every recommendation references real evidence and uses approved thresholds/priorities/action types.
- [ ] No recommendation triggers an activity on creation; deduplication and insufficient evidence follow approved policy.
- [ ] Group inputs compute total correct/total attempts and omit unassessed topics; analysis responsibility remains with Progress Agent.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P5-03] Implement teacher decisions and approved-action execution

<!-- insync-plan-id: P5-03; plan-version: 0.2 -->
**Outcome:** Implement teacher decisions and approved-action execution
**Milestone:** P5 — Progress and teacher-reviewed interventions
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P5-02, P1-07, P4-04, P3-04.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q01, Q12, Q15.
**Source:** Context §§5.1, 10; approved execution/audit contracts.

**Scope**

- Implement authenticated Approve/Dismiss, retained decision evidence, execution status, and LangGraph resume to the responsible agent.
- Implement approved teacher precedence, conflict handling, retries, and recovery without directly calling one agent from another.

**Acceptance checks**

- [ ] Pending/dismissed recommendations cause no automatic activity and remain visible as specified.
- [ ] An approved action executes through the router; repeated/concurrent approvals and process restart do not duplicate the effect. Downstream quiz/group creation still respects its separate content/membership approval gates.
- [ ] Another teacher cannot decide the recommendation; approved downstream failures remain visible and recoverable.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P5-04] Build learner progress and teacher performance dashboards

<!-- insync-plan-id: P5-04; plan-version: 0.2 -->
**Outcome:** Build learner progress and teacher performance dashboards
**Milestone:** P5 — Progress and teacher-reviewed interventions
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P5-01, P5-02 (in addition to start dependencies).
**Review references:** Q07, Q08, Q12.
**Source:** Context §§6.3, 7, 12.

**Scope**

- Implement personal progress/feedback and teacher class/learner/topic views with source-linked evidence and approved terminology.
- Show unknown/insufficient data separately from weak performance and apply approved personal-suggestion ownership.

**Acceptance checks**

- [ ] Dashboards reflect real stored attempts/analysis and distinguish raw accuracy, weighted scores, and trends.
- [ ] Class filters and authorization prevent private learner information crossing the approved boundary.
- [ ] No-data/loading/analysis-unavailable cases are informative; color is not the only way to understand performance.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P5-05] Build recommendation evidence and teacher review screens

<!-- insync-plan-id: P5-05; plan-version: 0.2 -->
**Outcome:** Build recommendation evidence and teacher review screens
**Milestone:** P5 — Progress and teacher-reviewed interventions
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P5-03 (in addition to start dependencies).
**Review references:** Q12.
**Source:** Context §§5.1, 6.4, 7.

**Scope**

- Display recommendation evidence, approved priorities/targets, Approve/Dismiss actions, and pending/reviewed/execution states.
- Provide feedback for repeated/stale decisions and downstream failures.

**Acceptance checks**

- [ ] A teacher inspects evidence, approves one recommendation, and dismisses another using real services.
- [ ] Only the approved action executes; pending and dismissed records remain represented correctly.
- [ ] No Edit action is added to recommendations; group editing remains a separate flow.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P5-06] Verify the complete tutoring-to-teacher-review learning cycle

<!-- insync-plan-id: P5-06; plan-version: 0.2 -->
**Outcome:** Verify the complete tutoring-to-teacher-review learning cycle
**Milestone:** P5 — Progress and teacher-reviewed interventions
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P3-05, P3-06, P4-05, P4-06, P5-04, P5-05, P1-05.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §§5.2, 10, 14; report §5.10.

**Scope**

- Create an end-to-end pilot journey: material → tutoring → session end → reviewed quiz → adaptive attempt → progress → recommendation → teacher decision → follow-up evidence.
- Exercise real integration of ongoing-quiz answer protection and agent state ownership.

**Acceptance checks**

- [ ] Quiz weakness demonstrably influences later tutoring according to the approved rules; the evidence trail is inspectable.
- [ ] Pending/dismissed recommendations generate no activity; approved follow-up generates evidence for subsequent analysis.
- [ ] Provider/downstream failures and restart during review preserve results and obey recovery contracts.
- [ ] Record passed/failed/skipped checks and any credentialed-provider limitations; this milestone does not claim collaboration is complete.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P6 — Groups, shared workspace, and Discussion Agent

### [P6-01] Implement balanced group formation

<!-- insync-plan-id: P6-01; plan-version: 0.2 -->
**Outcome:** Implement balanced group formation
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-06, P0-09, P1-02.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q06.
**Source:** Context §6.5; report §5.7.

**Scope**

- Implement GroupFormationHeuristic balanced strategy against approved performance-input contracts and edge cases.
- Return proposed membership and explainable scores without activating groups.

**Acceptance checks**

- [ ] The report example and approved initialization/remainder/tie/no-data cases pass.
- [ ] Maximum size and unique membership hold; inputs are not mutated and grouping uses pooled performance.
- [ ] Output is a proposal for the Teacher Assistant Agent; no student gains access before approval.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-02] Implement strength-based group formation

<!-- insync-plan-id: P6-02; plan-version: 0.2 -->
**Outcome:** Implement strength-based group formation
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-06, P0-09, P1-02.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q06.
**Source:** Context §6.5; approved strength-based construction algorithm.

**Scope**

- Implement topic complementarity scoring and the explicitly approved multi-group construction procedure.
- Handle approved tie, size, remainder, missing-data, and reproducibility cases.

**Acceptance checks**

- [ ] Pairwise examples use strong ≥.70 and weak ≤.50; unassessed/intermediate topics do not create false matches.
- [ ] Group scores sum the approved pairwise contributions and memberships meet capacity/uniqueness constraints.
- [ ] No unapproved optimizer or heuristic replaces the selected algorithm; proposals remain inactive.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-03] Implement group proposals, manual groups, approval, and problems

<!-- insync-plan-id: P6-03; plan-version: 0.2 -->
**Outcome:** Implement group proposals, manual groups, approval, and problems
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** B; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P5-02, P6-01, P6-02, P2-04, P1-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q04, Q06, Q10.
**Source:** Context §§5.1, 6.5, 7; approved collaboration schema.

**Scope**

- Add group/member/problem migrations and Teacher Assistant routing for teacher-requested proposals.
- Implement manual groups, membership editing/validation, approval/activation, and approved discussion-problem authoring/assignment/open-close flow.
- Implement approved proposal versions, review audit, and post-activation membership changes.

**Acceptance checks**

- [ ] Both grouping strategies and manual creation are available to the authorized teacher.
- [ ] Editing a proposal does not activate it; only approved membership provides student access.
- [ ] Duplicate/invalid members and stale approvals are handled; hidden solutions are excluded from student responses.
- [ ] Approved problems and membership lifecycle events are available to WebSocket/hint consumers.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-04] Build teacher group and problem management screens

<!-- insync-plan-id: P6-04; plan-version: 0.2 -->
**Outcome:** Build teacher group and problem management screens
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09.
**Integrate/close after:** P6-03 (in addition to start dependencies).
**Review references:** Q06, Q10.
**Source:** Context §§5.1, 7.

**Scope**

- Build strategy/size/student selection, proposed groups, manual composition, membership editing, and Approve/Edit flow.
- Build approved discussion-problem authoring/assignment and state controls.

**Acceptance checks**

- [ ] A teacher creates, edits, and approves a proposal from real performance data and can create a manual group.
- [ ] Invalid membership, no-data students, empty results, and proposal changes receive clear feedback.
- [ ] Students cannot enter a merely proposed group; problem solutions remain restricted.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-05] Implement authenticated group chat and presence

<!-- insync-plan-id: P6-05; plan-version: 0.2 -->
**Outcome:** Implement authenticated group chat and presence
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P6-03, P1-04.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q03, Q10, Q11.
**Source:** Context §8.2; report §6.4.7.

**Scope**

- Add persistent message storage and authenticated FastAPI WebSocket connections for group members and owning teachers.
- Implement approved delivery/order/reconnect semantics and Redis-backed temporary presence.

**Acceptance checks**

- [ ] Two clients exchange persisted messages; reconnect retrieves appropriate history without duplicate logical posts.
- [ ] Foreign-group users, expired sessions, and revoked membership cannot keep unauthorized access.
- [ ] Temporary presence expires correctly and is excluded from learner-performance evidence.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-06] Implement Yjs workspace synchronization, controlled editing, and recovery

<!-- insync-plan-id: P6-06; plan-version: 0.2 -->
**Outcome:** Implement Yjs workspace synchronization, controlled editing, and recovery
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** B; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P6-05, P1-10.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q11.
**Source:** Human Yjs clarification; approved P0-06 workspace contract; P1-10 compatibility evidence; context §8.2.

**Scope**

- Implement authenticated Yjs document synchronization through the verified FastAPI provider/adapter, with document identity bound to the approved group/problem model.
- Enforce the approved editing grants/locks in the backend using Redis for temporary control state; check authorization on incoming updates rather than relying on a read-only browser editor.
- Implement approved PostgreSQL document update/snapshot persistence, reconstruction, control expiry/transfer/revocation, rejected-update recovery, and teacher observation controls.
- Publish only approved meaningful task events for later discussion/progress use.

**Acceptance checks**

- [ ] Two Yjs clients converge for permitted edits and exercise approved lock contention/expiry/transfer, disconnect, and reconnect behavior.
- [ ] An expired/revoked control holder or foreign-group client cannot mutate the authoritative document, broadcast rejected changes, or persist them; stale/offline updates follow the approved policy.
- [ ] Persisted Yjs updates/snapshots reconstruct the shared document after the specified restart; awareness/presence and Redis locks are not treated as durable document storage.
- [ ] Raw mouse/cursor data is not recorded as learning evidence and events preserve approved attribution.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-07] Build the Yjs shared editor, student workspace, and teacher monitoring

<!-- insync-plan-id: P6-07; plan-version: 0.2 -->
**Outcome:** Build the Yjs shared editor, student workspace, and teacher monitoring
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** A; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P2-05, P0-09, P1-10.
**Integrate/close after:** P6-05, P6-06, P6-08 (in addition to start dependencies).
**Review references:** Q10, Q11.
**Source:** Context §§7, 8.2, 12.

**Scope**

- Build approved-group access, members/history/chat, problem display, and the approved editor bound to a Yjs document/provider.
- Display current editing control, approved request/release/transfer controls, read-only states, presence/awareness, and connection/recovery feedback; only implement the control actions approved in P0-06.
- Add hint request/display states and the approved teacher monitoring view.

**Acceptance checks**

- [ ] Two student browsers collaborate on an approved problem and the authorized teacher can monitor the permitted activity.
- [ ] No group assignment, proposed-only membership, lost connection, lock contention/revocation, rejected local updates, and unavailable hints have useful states; read-only UI complements server enforcement.
- [ ] AI hints are labeled; hidden solutions and individual weaknesses never appear in group content.
- [ ] Real chat, editing, and hint integrations pass before issue closure.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-08] Implement Discussion Agent hints and trigger coordination

<!-- insync-plan-id: P6-08; plan-version: 0.2 -->
**Outcome:** Implement Discussion Agent hints and trigger coordination
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** C; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P6-05, P6-06, P1-07, P1-08, P1-09.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q02, Q10, Q11.
**Source:** Context §6.6; report §5.8; approved trigger contract.

**Scope**

- Implement requested and proactive hints, approved discussion/misconception classification, per-problem level progression, and cooldown coordination.
- Validate against the hidden solution, regenerate once on leakage, use the approved fallback, and persist hint reason/evidence.
- Register Discussion Agent graph events and integrate job/timer recovery.

**Acceptance checks**

- [ ] A controlled clock verifies three-minute inactivity, five off-topic messages, five-minute proactive cooldown, and suppression during correct discussion.
- [ ] Overlapping triggers/request cooldowns/restart obey approved rules; hints progress 1→2→3 and reset on a new problem.
- [ ] Leakage/regeneration/fallback tests and provider-backed samples verify group-directed hints without revealing answers or private weaknesses.
- [ ] Logs retain approved source attribution for later analysis without assigning unsupported individual performance.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P6-09] Verify collaboration and its evidence-to-progress loop

<!-- insync-plan-id: P6-09; plan-version: 0.2 -->
**Outcome:** Verify collaboration and its evidence-to-progress loop
**Milestone:** P6 — Groups, shared workspace, and Discussion Agent
**Suggested workstream:** C; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P6-04, P6-07, P5-01, P5-06.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q10, Q11.
**Source:** Context §§5.2, 6.3, 6.6, 14.

**Scope**

- Connect real hint/workspace evidence to Progress Agent under approved attribution rules.
- Run multi-user teacher-request → proposal → edit/approve → problem/chat/workspace → hint → updated analysis/recommendation flow.

**Acceptance checks**

- [ ] Only approved groups participate; group hints remain private to the authorized audience.
- [ ] Resulting analysis uses real collaboration evidence with traceable source and approved individual/group attribution.
- [ ] Yjs convergence/reconstruction, reconnect with stale edits, edit-control transfer/revocation, membership change, simultaneous hint triggers, and provider failure retain correct state.
- [ ] All five real agent paths are exercised across this demo and P5-06.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

## P7 — Evaluation, operations, and pilot release

### [P7-01] Implement content reporting and approved data controls

<!-- insync-plan-id: P7-01; plan-version: 0.2 -->
**Outcome:** Implement content reporting and approved data controls
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P5-06, P6-09, P0-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q18.
**Source:** Context §§12, 14; approved privacy/reporting policy.

**Scope**

- Implement the approved wrong-content reporting and teacher review flow with evidence references and appropriate UI; B reviews backend/data changes.
- Implement approved collection notice/consent, retention/deletion controls, and audit access.

**Acceptance checks**

- [ ] A learner reports generated content and the authorized teacher can inspect/handle it as approved.
- [ ] Data controls follow recorded requirements and preserve/restrict related records consistently.
- [ ] No new personalization opt-out, automatic deletion policy, or moderation action is invented beyond approval.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-02] Integrate operational visibility and pilot cost tracking

<!-- insync-plan-id: P7-02; plan-version: 0.2 -->
**Outcome:** Integrate operational visibility and pilot cost tracking
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P5-06, P6-09, P0-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q18.
**Source:** Context §§8.4, 14; approved operational targets.

**Scope**

- Connect request/job/graph tracing, approved error/availability metrics, provider latency, and API usage/cost records.
- Document diagnosis of processing failures, pending teacher review, retry exhaustion, and configured operational limits.

**Acceptance checks**

- [ ] A simulated failure can be traced from user request to job/agent outcome without exposing credentials or unnecessary learner content.
- [ ] Usage records reconcile with controlled test requests and approved budget/alert behavior.
- [ ] Metrics measure teacher-wait time separately from model/server latency.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-03] Run authorization, isolation, and recovery regression tests

<!-- insync-plan-id: P7-03; plan-version: 0.2 -->
**Outcome:** Run authorization, isolation, and recovery regression tests
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P7-01, P7-02, P6-09, P1-05.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §§12, 14; approved permission/recovery matrix.

**Scope**

- Automate cross-user/class/group access checks across REST, database policies, retrieval, storage, and WebSockets.
- Exercise hidden-answer serialization, role escalation, stale approvals, duplicate events, process/Redis/provider failures, and recovery.

**Acceptance checks**

- [ ] Required negative-access scenarios fail closed while legitimate teacher/student journeys still succeed.
- [ ] Pending approvals and durable records survive the approved failure cases; no duplicated learning activity occurs.
- [ ] Failures are linked to fixes and rerun; no blanket security/compliance certification is claimed.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-04] Run educational quality and pilot evaluation

<!-- insync-plan-id: P7-04; plan-version: 0.2 -->
**Outcome:** Run educational quality and pilot evaluation
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** C; **Size:** L; one accountable owner, a different reviewer.
**Start after:** P5-06, P6-09, P7-01, P0-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q18.
**Source:** Context §§3, 14; approved evaluation protocol.

**Scope**

- Prepare approved Programming Fundamentals material/questions and expected evidence examples for the pilot topic set.
- Evaluate grounding, question correctness/difficulty, hint answer leakage, grouping explanations, recommendation evidence, coordination, and teacher usability.
- Run the agreed comparison/evaluation protocol and record sample-only versus real-participant evidence, failures, limitations, and API cost.

**Acceptance checks**

- [ ] A reproducible evaluation dataset/procedure and rubric approved in P0-01 are used; results include actual sample counts.
- [ ] Teacher review and evidence transfer across activities are evaluated alongside individual output quality.
- [ ] Findings do not claim improved learning or coverage of both audiences without supporting data; failed agreed targets produce follow-up issues.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-05] Verify accessibility, browser compatibility, and performance

<!-- insync-plan-id: P7-05; plan-version: 0.2 -->
**Outcome:** Verify accessibility, browser compatibility, and performance
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P5-06, P6-09, P7-01, P7-02, P0-01.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q18.
**Source:** Context §§3, 12, 14; report §§4.3–4.4.

**Scope**

- Check approved journeys in Chrome, Edge, and Firefox on laptop/desktop layouts.
- Verify keyboard navigation, labels, readable contrast, focus/error feedback, and non-color-only meaning.
- Measure API/page/WebSocket/job performance under the approved pilot load, including slow providers and teacher waiting.

**Acceptance checks**

- [ ] A repeatable matrix records browsers, scenario/load, measured outcomes, failures, and approved thresholds.
- [ ] Core journeys remain usable with keyboard input and across named browsers; issues are linked and verified after fixes.
- [ ] Performance results distinguish application latency from external model/review delays and do not invent uptime or accessibility certification.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-06] Prepare deployment and demonstrate backup restoration

<!-- insync-plan-id: P7-06; plan-version: 0.2 -->
**Outcome:** Prepare deployment and demonstrate backup restoration
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** B; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P7-02, P7-03, P7-05, P0-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** Q18.
**Source:** Context §§8, 14; approved hosting/backup plan.

**Scope**

- Prepare approved deployment configuration, secure variables, service readiness, migration procedure, and rollback/runbook.
- Deploy to an explicitly authorized pilot/staging target and exercise database/material backups plus documented graph/job restart.
- Validate Codex/developer setup from a fresh environment using saved installation/start instructions.

**Acceptance checks**

- [ ] The target serves a functional authenticated pilot journey with real services after restart.
- [ ] A backup restores to an isolated test target and the agreed sample records/materials remain usable.
- [ ] Deployment and restoration evidence names limitations; production release waits for the phase acceptance decision and required credentials/access.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-07] Synchronize approved report, diagrams, and developer documentation

<!-- insync-plan-id: P7-07; plan-version: 0.2 -->
**Outcome:** Synchronize approved report, diagrams, and developer documentation
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** A; **Size:** M; one accountable owner, a different reviewer.
**Start after:** P0-09.
**Integrate/close after:** P7-04, P7-06 (in addition to start dependencies).
**Review references:** Q16, Q17.
**Source:** Context §§14, 16; review Q16/Q17 and approved changes.

**Scope**

- Maintain architecture, ER, class, sequence, agent ownership, setup, API, and operational documentation as implementation progresses.
- Apply only approved editorial corrections to the designated editable report source; if only a PDF is available, prepare a replacement-text/figure change pack and record the source requirement.
- Distinguish planned, implemented, tested, and evaluated claims using recorded evidence.

**Acceptance checks**

- [ ] Names, review actions, state/schema definitions, diagrams, and implementation agree for approved scope.
- [ ] A new contributor can use the documented setup and issue workflow; known limitations and reproducible demos are recorded.
- [ ] The human accepts the authorized report updates/change pack; unavailable original conversations or editable sources are not claimed reviewed or modified.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---

### [P7-08] Accept the pilot release and finalize the handoff

<!-- insync-plan-id: P7-08; plan-version: 0.2 -->
**Outcome:** Accept the pilot release and finalize the handoff
**Milestone:** P7 — Evaluation, operations, and pilot release
**Suggested workstream:** C; **Size:** S; one accountable owner, a different reviewer.
**Start after:** P7-03, P7-04, P7-05, P7-06, P7-07.
**Integrate/close after:** None (in addition to start dependencies).
**Review references:** None.
**Source:** Context §§14, 16; approved pilot acceptance criteria.

**Scope**

- Run the final teacher/student/collaboration demo, reconcile open defects and agreed measures, and prepare release notes and issue evidence.
- Present the concrete tested release for the human’s acceptance and authorized publication/deployment.

**Acceptance checks**

- [ ] All required phase gates and tests have recorded outcomes; blocking defects/credentials/approval gaps remain visible.
- [ ] The human explicitly accepts the pilot or identifies remaining work; unresolved decisions are not silently marked complete.
- [ ] Release handoff includes setup, operations, evaluation limits, issue/PR links, and next-scope backlog.

**Approval boundary**

Requires the approved design/contracts cited below. Plan approval authorizes tracking this work; it does not settle any unresolved design choice.

**Completion evidence**

- Link the PR or approved decision record, peer review, and relevant test/demo results.
- Document contract/schema changes and notify dependent issue owners through the issue/PR.
- Resolve all dependencies before closing; mock-only UI or infrastructure-only agent tests do not prove real feature integration.

---
