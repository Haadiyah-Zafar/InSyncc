# P0-02: Learner state, graph ownership, recovery

**Issue:** [#3](https://github.com/Haadiyah-Zafar/InSyncc/issues/3) · **Prepared:** 5 Nov 2026 · **Start after:** none
**Status:** Options and recommendation for review. **Not approved.** No decision below is recorded as approved until Anum records it.

**Review references:** Q01 (explicitly kept pending by the human), Q15 (checkpoint link).

---

## At a glance

| | |
|---|---|
| **Question** | What is the authoritative scope, ownership, merge rule, storage and recovery behaviour of `LearnerContext` (persistent) and `InSyncState` (active workflow state)? |
| **Already fixed by approved decisions** | Postgres job table with worker, lease with expiry, idempotency key (P0-07: S7, S10). Q15 limits: 20 s per attempt, 2 retries, max 3 models per operation, 45 s interactive and 5 min background deadlines, one validation regeneration inside the cap (P0-07). Surface identities and run-result provenance (P0-01, issue #2 amendment). Personal-tutor board changes need learner approval (P0-05). |
| **Still open** | Scope of each state type; field owners and merge rules; checkpoint frequency and store; attribution of run output and group hints to individuals; teacher-review timeout. |
| **Recommended first steps** | Scope key = student × topic (per Anum's answer 5 Nov 2026; class not in the key). Checkpoints saved after every graph step, in the same Postgres database as the job table. |

---

## 1. Current source positions

- **Persistent learner context:** the report describes `LearnerContext` as persistent learner information loaded into agent workflows (§6.6.1). The candidate schema has a `LEARNER_CONTEXT` table with child tables that reference `context_id`. The schema inventory says there is no topic/window key and no structured recurring-mistake evidence, and that these are gaps to resolve, not columns to add without review (`INSYNC_SCHEMA_INVENTORY.md` §13).
- **Active state:** `InSyncState` is the shared agent/workflow state in the agent layer (§6.6.2). The context document keeps it pending Q01 (`INSYNC_CODEX_CONTEXT.md` lines 36, 299, 324).
- **Checkpoints:** Figure 5.1 says to checkpoint to Supabase after every agent step. Other text is less specific (Q01 evidence; Q15).
- **Evidence rules already stated:** raw accuracy and weighted score are distinct; cursor and mouse movement are not learning evidence; group hints are not attributed to individual performance without an approved rule; run output is not automatically individual learning evidence (`AGENTS.md`; P0-01 amendment).

---

## 2. Decision A: scope of each state type

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A1. One student-wide context** | One `LearnerContext` per student; all topics and classes share it. | Simplest; matches the one-context-per-student dictionary. | Explanation and difficulty values can leak across topics and classes. The Q01 note says it is not established that they should transfer. |
| **A2. Student × topic** | One context per student and topic; class ignored. | Topic-specific difficulty and mastery stay separate. | A student in two classes studying the same topic shares values that may belong to one class. |
| **A3. Student × topic × class (recommended)** | One context per student, topic and class. | Values stay within the class that produced them; no cross-class transfer without a decision. | Duplicates values when a student changes class; needs a rule for moving evidence. |

**Recommendation: A3.** It is the most conservative choice and it does not decide the open transfer question. Cross-class or cross-topic transfer then needs its own approval.

**`InSyncState` scope:** one state per workflow run, keyed by session or job, not by student. It is not a long-term store. Its durable record is the checkpoint (section 4).

**Anum's answer (5 Nov 2026):** share progress for the same topic across the student's classes. This is option A2 (student × topic, class not in the key). Anum said values carry across classes for the same topic. The topic-to-topic transfer question is still open.

**Human decision:** confirm this answer in §9 before it counts as approved.

---

## 3. Decision B: field owners, merge rules and concurrency

Proposed matrix. Owners are the single writer for each field. Evidence is append-only and tagged with its source.

| Field group | Owner (writer) | Readers | Scope | Storage | Merge rule |
|---|---|---|---|---|---|
| Quiz attempt answers and evaluations | Quiz Agent (through the answer API) | Progress, Tutor, Teacher view (authorised) | student × topic × class | Postgres, append-only | Insert once per answer event key. Duplicates ignored. |
| Tutoring check-question evidence | Tutor Agent | Progress, student, teacher (authorised) | student × topic × class | Postgres, append-only | Insert once per event key. |
| Performance measures (mastery, trend, mistakes) | Progress Agent | Tutor, Teacher Assistant, student | student × topic × class | Postgres, derived | Recomputed from evidence rows, never edited by hand. Insufficient data is a state, not a value. |
| Difficulty and explanation preferences | Tutor Agent (via Progress recommendation after approval) | Tutor | student × topic × class | `LearnerContext` row | Version-checked update (compare-and-set). |
| Recommendation status (pending, approved, dismissed, executed) | Teacher Assistant (proposal), teacher (decision) | Progress, Tutor | class | Postgres | State machine. Only the teacher transition changes approval. |
| Group hint events | Discussion Agent | Group members, teacher (authorised) | group | Postgres, append-only | Group-level only. No individual attribution without the approved rule (Decision D). |
| Run output and whiteboard objects | Execution runner / board service | Group members, teacher (authorised) | surface × run | Postgres (provenance) | Stored with surface identity and run ID. Not learner evidence (Decision D). |
| `InSyncState` (active workflow) | The graph node that owns the current step | Graph router, that node | session / job | Checkpoint (Postgres) | Only the owning node writes its keys. Writes use the checkpoint version. |

**Concurrency rules (recommended):**
1. Every mutable row carries a version. An update succeeds only if the version it read is still current. A failed write reads the latest version and retries, or is rejected.
2. Evidence events are append-only and deduplicated on an event key (see scenario 3).
3. Derived measures are recomputed from evidence, so concurrent evidence does not need a merge.

**Human decision:** approve the owners and merge rules, or name changes.

---

## 4. Decision C: load/save points, checkpoint frequency and store

| Option | Description | Pros | Cons |
|---|---|---|---|
| **C1. After every graph step (recommended)** | Checkpoint `InSyncState` after each completed agent or node step, in the same Postgres database as the job table. | Matches Figure 5.1. Simple replay from the last completed step. Load is small for 12 learners. | More writes than the minimum. |
| **C2. Workflow boundaries only** | Checkpoint at start, end and before any teacher-review pause. | Fewer writes. | Replay may repeat several model calls, which costs budget and risks duplicate output. |
| **C3. Hybrid** | After steps that write or call an external service, and before teacher pauses. | Balanced. | More rules to test. |

**Recommendation: C1**, because replay and duplicate prevention are simpler and the pilot load is small. Two rules apply in every option:
- A checkpoint never writes `LearnerContext` directly. Each owner writes its own evidence or state in its own transaction.
- Model output is stored with the request's idempotency key before the step is marked complete, so a replay returns the stored result and does not call the model again.

**Load points:** load `LearnerContext` when a job starts (version recorded). Load `InSyncState` from the latest checkpoint on resume.

**Store:** Postgres in the Supabase database, the same store as the job table (S7). Redis is not used for durable state.

**Human decision:** approve C1 (or C2 or C3), and approve the store.

---

## 5. Decision D: attribution of run output and group hints

| Option | Description |
|---|---|
| **D1. Not individual evidence (recommended)** | Run output and group hints are stored at surface and group level. They count as learner evidence only through an approved rule. |
| **D2. Individual evidence for the editor's run** | A run by one learner counts toward that learner. Risks crediting a group's work to one person. |

**Recommendation: D1** until an attribution rule is approved. The P0-01 amendment requires an approved attribution rule and duplicate-event handling, and the human has not approved one.

**Human decision:** approve D1, or choose an attribution rule and its duplicate-handling method.

---

## 6. Sequence examples

1. **Concurrent evidence.** A student submits two answers from two tabs at once. Both are appended with distinct event keys. The Progress Agent recomputes measures from both. Nothing is overwritten.
2. **Restart while awaiting a teacher.** A recommendation reaches the teacher review interrupt. The checkpoint is saved before the pause. The backend restarts. On resume, `InSyncState` loads from the checkpoint and the job stays paused. The workflow does not continue until the teacher's decision is recorded.
3. **Repeated events.** The same answer event is delivered twice (for example a network retry). The second insert is rejected by the event key, and the measure is unchanged.
4. **Unavailable agent.** The Progress Agent fails on all three allowed models. The job is marked failed with its checkpoint kept. `LearnerContext` is unchanged. A later retry resumes from the last completed step, using the stored results for completed steps.

---

## 7. Downstream impact (if approved)

| Area | Impact |
|---|---|
| Schema (#9) | `LEARNER_CONTEXT` keyed by student and topic (A2, per Anum's answer). Version columns. Checkpoint table or LangGraph checkpointer tables in Postgres. Event keys on evidence tables. The candidate schema conflicts in Q04 are not resolved here. |
| API and contracts (#10) | Job states (pending, running, paused for review, failed, completed). Version conflict responses. |
| Graph state (#17, Member 1) | State keys per owner; checkpoint after every step; interrupt for teacher review. |
| Jobs and recovery (#19) | Lease and idempotency use the checkpoint. |
| Yjs (#20) | Shared document state stays separate from `InSyncState`. |
| Tests | Concurrency (two writers, one version); repeated event; restart while paused; unavailable agent; cross-class isolation under A3. |
| Report | Figure 5.1 wording must match C1 or the chosen option. |

---

## 8. Questions for Anum

1. Answered 5 Nov 2026: share progress for the same topic across classes (A2). Still open: should values transfer between different topics?
2. Approve the owner and merge matrix (Decision B).
3. Approve checkpoint frequency and store (Decision C).
4. Approve D1 for run output and group hints (Decision D).
5. Answered 5 Nov 2026: a teacher review that goes unanswered stays waiting, and the teacher is reminded after a set period. Still open: the reminder period and method.

---

## 9. Approval (to be completed by Anum only)

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| A — Scope | A2 (student × topic), per Anum's answer 5 Nov 2026 | | | Confirm |
| B — Owners and merge rules | Matrix in §3 | Anum (answer 5 Nov 2026: approved as drafted) | 5 Nov 2026 | Confirm in record |
| C — Checkpoints and store | C1 (after every step), Postgres | Anum (answer 5 Nov 2026) | 5 Nov 2026 | Confirm in record |
| D — Attribution | D1 (group level only) | Anum (answer 5 Nov 2026) | 5 Nov 2026 | Confirm in record |
| Teacher review timeout | Wait; remind after a set period (answer 5 Nov 2026) | Anum (answer 5 Nov 2026) | 5 Nov 2026 | Reminder period and method still open |
| Q01 (overall) | Remains explicitly pending until Anum records approval | | | |
