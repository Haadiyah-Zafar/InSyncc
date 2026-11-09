# P0-08: Canonical schema and domain model

**Issue:** [#9](https://github.com/Haadiyah-Zafar/InSyncc/issues/9) · **Prepared:** 9 Nov 2026 · **Owner:** Anum (assigned on GitHub)
**Status:** **Draft: options and recommendations only. Nothing is approved.** Approval is recorded only in §10 by Anum.
**Start after (live):** #2 (closed), #3 (open: Q01 pending), #4 (closed), #5 (closed), #6 (closed), #7 (open: decisions H and I pending with Haadiyah Zafar), #8 (closed).
**Review references:** Q04 (dictionary vs ER diagram), Q16 (diagram sync).
**Source:** `INSYNC_SCHEMA_INVENTORY.md` (candidate, not a migration specification), context §§9–12, report Table 4.17 and Figure 4.18.

---

## 1. Purpose and limits

This record turns the candidate inventory into a set of decisions. It does not create migrations, constraints, defaults, RLS policies or API payloads. Per the inventory, those need approval first.

The inventory has 21 entities. Most are usable as drafted. The decisions below are the places where the approved behaviour in P0-02 to P0-07 needs a field, table or state the dictionary does not contain, or where the dictionary and the ER diagram disagree.

Decisions that depend on #3 (Q01) or #7 (H and I) are marked **blocked**. They cannot be approved until those are settled.

---

## 2. Decisions at a glance

| ID | Area | Recommended option | Blocked by |
|---|---|---|---|
| S1 | User identity | `USER.user_id` equals the Supabase Auth user ID; role from seeded accounts | No |
| S2 | Class membership keys | Keep composite key `(class_id, student_id)`; no surrogate key | No |
| S3 | Learner context scope | Defer the shape of `LEARNER_CONTEXT` | **#3 (Q01)** |
| S4 | Concept mastery | Add `unassessed` to the enum; keep `weak_flag` as aggregate only; quiz flag as separate evidence | No |
| S5 | Question concepts | Join table `QUESTION_CONCEPT`; a question may have more than one concept | No |
| S6 | Question approval and versions | Add `QUESTION_VERSION` with approval per version | No |
| S7 | Quiz assignment | Add `QUIZ_ASSIGNMENT` (quiz to student or group) | Q12 (partly open) |
| S8 | Attempt ordering and timing | Add `answered_at` and `sequence` to `ATTEMPT_ANSWER`; add attempt state | P0-04 (read record for exact fields) |
| S9 | Tutoring session identity | Add `TUTORING_SESSION` with optional `class_session_id` | No (P0-05 H answered) |
| S10 | Recommendation lifecycle | Add `reviewed_by`, `executor`, `evidence_refs`; keep pending/approved/dismissed | P0-05 I (approved in chat) |
| S11 | Progress analysis window | Add `topic_id` and an explicit evidence-window reference | No |
| S12 | Group strategy | Add `manual` to `strategy`; record `approved_by` | No (P0-06 F) |
| S13 | Group messages | `sender_id` must be a student for `student` messages and empty for `ai_hint` | No |
| S14 | Discussion problem lifecycle | Add `status` (draft, approved, open, closed); approval record | P0-06 problem lifecycle (not yet approved) |
| S15 | Workspace and surfaces | Add workspace-document and per-surface holder tables; snapshots | #7 (H and I) |
| S16 | Job and checkpoint storage | Add `job` table with lease expiry and idempotency key | Already approved in P0-07 (S7, S10) |
| S17 | Python runs | Add source revision and run result tables | #64 scope; P0-01 amendment |
| S18 | Content reports | Add `content_report` table | P7-01 (#54) scope |
| S19 | Identifier and naming conflicts | Use the names in §4 below; resolve the ER conflicts in §5 | Q04 approval |

---

## 3. Decision details

### S1. User identity (Q03 resolved; Q13 open)

- **Options:** (a) `user_id` is the Supabase Auth user ID; `role` is the application role. (b) A separate profile table keyed by a new UUID, linked to Auth.
- **Recommended: (a).** It avoids two identifiers for one person. Teacher role comes from seeded accounts (P0-03, Decision C).
- **Open:** the dictionary's `full_name` and `email` must be kept in step with Supabase Auth. Do not store passwords.

### S2. Class membership keys (P0-03, Decision B)

- **Options:** (a) composite key `(class_id, student_id)`. (b) surrogate key with a unique constraint.
- **Recommended: (a).** The inventory already shows it, and P0-03 says no surrogate key without review. Removing an enrolled student deletes the row; no `removed` state.

### S3. Learner context scope (**blocked by #3, Q01**)

- **Options:** (a) one `LEARNER_CONTEXT` per student, as the dictionary states; (b) one per student and topic, so difficulty and explanation level do not carry across topics.
- **Recommended:** do not choose yet. Q01 is still pending, and the inventory says not to assume a global personalization scope.
- **Downstream:** `quiz_difficulty` and `explanation_level` scope; checkpoint design (P0-07 Q15).

### S4. Concept mastery and weak signals (P0-05 B and C)

- **Options:** (a) add `unassessed` to `mastery`; (b) omit the row when `attempted_count = 0`.
- **Recommended: (a).** A row with `attempted_count = 0` and `mastery = unassessed` is explicit and easy to test.
- **Weak flag:** `weak_flag` is true only when aggregate `mastery = weak` (P0-05 B). The quiz-level two-wrong-answers signal is evidence derived from `ATTEMPT_ANSWER`. It is shown as a warning, not stored as a mastery state.
- **Downstream:** `CONCEPT_MASTERY` enum; progress view; recommendations.

### S5. Question concepts (Q04)

- **Problem:** `QUESTION` has one `concept_id`, but Hard questions can combine concepts (report).
- **Recommended:** `QUESTION_CONCEPT(question_id, concept_id)`, with at least one row per question. Keep `QUESTION.concept_id` only if the reviewer wants a primary concept; that choice is open.

### S6. Question versions and approval (P0-04, Decision B)

- **Problem:** approval attaches to the exact question version, not to the question row.
- **Recommended:** `QUESTION_VERSION(version_id, question_id, question_text, options, correct_answer, difficulty, approved_by, approved_at, status)`. `QUESTION` keeps identity and quiz linkage.
- **Hidden field:** `correct_answer` and hidden solutions are server-only (P0-03).

### S7. Quiz assignment (Q12, partly open)

- **Problem:** the dictionary has no assignment table. Use cases assign quizzes to selected learners or groups.
- **Recommended:** `QUIZ_ASSIGNMENT(assignment_id, quiz_id, target_type enum(student, group), target_id, assigned_at)`.
- **Open:** availability windows and whether a group assignment fixes group membership (P0-03 mid-activity rule).

### S8. Attempt ordering and timing (P0-04; Q08)

- **Problem:** `ATTEMPT_ANSWER` has no time or order, but recurring-mistake evidence needs both (P0-05 E).
- **Recommended:** add `answered_at timestamptz not null` and `sequence smallint not null` to `ATTEMPT_ANSWER`, unique on `(attempt_id, sequence)`. Add `status enum(in_progress, completed, interrupted)` to `QUIZ_ATTEMPT`, which is needed by P0-04's interruption and resume rules.
- **Check before approving:** read P0-04 §§4, 7 and 8 for the exact states and fields. This draft does not restate them.

### S9. Tutoring session identity (P0-05 H)

- **Options:** (a) reuse `LEARNING_SESSION` for tutoring; (b) separate `TUTORING_SESSION`, with optional `class_session_id`.
- **Recommended (b), as P0-05 H records:** a learner's tutoring session can exist outside a class session. Add `TUTORING_SESSION(tutoring_session_id, context_id, topic_id, class_session_id nullable, started_at, ended_at)`, and link `TUTORING_INTERACTION` to it.
- **Open:** whether `TUTORING_INTERACTION` keeps `concept_id` as a single value.

### S10. Recommendation lifecycle (P0-05 I and K)

- **Add:** `reviewed_by uuid` (teacher), `action_executor enum(tutor, quiz, teacher, teacher_assistant)`, `evidence_refs jsonb` (IDs of attempts, interactions and analyses), and `dismissed_evidence_key` to prevent re-raising dismissed evidence (P0-05 K).
- **Keep:** `status enum(pending, approved, dismissed)`.
- **Downstream:** router events for approved actions only (P0-05 I).

### S11. Progress analysis window (P0-05 D)

- **Add:** `topic_id` and `window_end_at`. Keep `average_accuracy numeric(5,4)`, but store the no-data case as a null, not 0.
- **Open:** the trend fields the dictionary lacks (previous analysis reference).

### S12. Group strategy and approval (P0-06 F)

- **Add:** `manual` to `strategy`, since manual groups are approved (P0-06 F).
- **Add:** `approved_by uuid` (teacher) next to `approved_at`.
- **Open:** group-size fields and proposal revisions (Q06, which P0-06 says is pending until H and I are settled).

### S13. Group messages

- **Recommended:** a check constraint: `sender_id` is required when `message_type = student` and null when `message_type = ai_hint`. Keep `hint_level` and `hint_trigger` for AI hints only.
- **Open:** whether teacher messages exist (not in the dictionary). The inactivity rule counts student messages only (P0-06 J1).

### S14. Discussion problem lifecycle (Q10; P0-06)

- **Add:** `status enum(draft, approved, open, closed)` and an approval record.
- **Blocked:** P0-06's problem lifecycle is not yet approved (it is part of the pending H and I work).

### S15. Workspace and control holders (P0-06 G; #7 H and I)

- **Add:** `WORKSPACE_DOCUMENT(document_id, group_id, surface enum(python_editor, whiteboard), current_snapshot_id)`, `DOCUMENT_SNAPSHOT`, and `CONTROL_HOLDER(document_id, holder_user_id, granted_at, expires_at)`. One holder per surface (P0-06 G1).
- **Blocked:** the grant and take-over rules are H and I.

### S16. Job and checkpoint storage (P0-07 S7 and S10, approved)

- **Add:** `JOB(job_id, kind, status, lease_expires_at, idempotency_key unique, attempts, created_at)`. This is already approved in P0-07.

### S17. Python source and runs (P0-01 amendment; #64)

- **Add:** `SOURCE_REVISION` (immutable), `PYTHON_RUN(run_id, revision_id, requested_by, status, result_ref, started_at, finished_at)`.
- **Blocked:** run permissions and runtime limits are in #64, not this record.

### S18. Content reports (P7-01, #54)

- **Add:** `CONTENT_REPORT(report_id, reporter_id, target_type, target_id, reason, status, created_at)`.
- **Open:** scope and retention; this is a P7 issue, so the table may be deferred.

---

## 4. Naming

Use the dictionary's snake_case names and the inventory's entity names. Where the ER diagram disagrees, the dictionary wins until §5 is approved.

---

## 5. Conflicts between the dictionary and the ER diagram (Q04, Q16)

From `INSYNC_SCHEMA_INVENTORY.md` §22, to be resolved and approved one by one:

- Membership keys: composite (dictionary) vs other forms (ER). Recommended: S2.
- User and student identifiers: S1.
- Class join-code naming and session fields: not yet decided.
- Learner context difficulty naming: `quiz_difficulty` (dictionary) vs ER name. Blocked by S3.
- Mastery representation: S4.
- Tutoring evidence: S9.
- Quiz score and completion fields: S8.
- Recommendation fields: S10.
- Group and message attributes: S12 and S13.
- Two boxes labelled QUESTION in the ER figure with different contents. Needs the figure corrected after this decision (Q16).

---

## 6. Downstream impact (if approved)

- **#16 migrations:** these decisions become the migration spec. Nothing is generated before approval.
- **#10 contracts:** every new table above shows up in an API or event payload.
- **#21 access policies:** the new tables need RLS decisions (for example, `correct_answer` and hidden solutions).
- **#19 jobs:** S16.
- **Tests:** the boundary cases from P0-05 and P0-04 become fixtures for the new states.

---

## 7. Open questions for Anum

1. Approve S1, S2, S4, S5, S6, S9, S10, S11, S12, S13 as recommended?
2. S3 (learner context scope) waits for Q01 in #3. Do you want to decide Q01 first?
3. S7: approve `QUIZ_ASSIGNMENT`, or keep assignment out of the pilot?
4. S8: confirm the attempt states after reading P0-04 §§4, 7 and 8.
5. S14 and S15: waiting for Haadiyah's H and I, or defer those tables?
6. Approve adding the tables in S7, S9, S15, S16, S17 and S18 (new tables, not only new columns)?

---

## 8. Approval (to be completed by Anum only)

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| S1 User identity | (a) | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S2 Membership keys | (a) | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S3 Learner context scope | A3: student × topic × class | Anum (chat) | 9 Nov 2026 | Matches Q01 as approved on 9 Nov |
| S4 Mastery and weak signals | (a) | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S5 Question concepts | Join table | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S6 Question versions | `QUESTION_VERSION` | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S7 Quiz assignment | `QUIZ_ASSIGNMENT` | Anum (chat) | 9 Nov 2026 | Approved. Availability: when the teacher approves the quiz (Q12, 9 Nov) |
| S8 Attempt ordering | Record time and order | Anum (chat) | 9 Nov 2026 | Reverses the first answer ("no") in the same round; check P0-04 for exact fields |
| S9 Tutoring session | Separate table, can link to a class | Anum (chat) | 9 Nov 2026 | Reverses the first answer ("no") in the same round; matches the 7 Nov P0-05 answer |
| S10 Recommendation lifecycle | Add fields | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S11 Progress window | Add fields | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S12 Group strategy and approval | Add `manual` | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S13 Group messages | Constraint | Anum (chat) | 9 Nov 2026 | Approved as recommended |
| S14 Problem lifecycle | Draft, approved, open, closed; teacher approves | Anum (chat) | 9 Nov 2026 | Approved; groups see only approved, open problems |
| S15 Workspace and holders | Add WORKSPACE_DOCUMENT, DOCUMENT_SNAPSHOT, CONTROL_HOLDER | Anum (chat) | 9 Nov 2026 | Approved as drafted; H1 and I recorded 9 Nov |
| S16 Job storage | Already approved in P0-07 | Anum (P0-07) | 3 Nov 2026 | Confirmed as already approved |
| S17 Python runs | Add SOURCE_REVISION and PYTHON_RUN | Anum (chat) | 9 Nov 2026 | Approved. Run permissions and limits stay in #64 |
| S18 Content reports | Add CONTENT_REPORT | Anum (chat) | 9 Nov 2026 | Approved. Scope and retention still follow #54 |
| S19 Naming and conflicts | Dictionary names win (§4) | Anum (chat) | 9 Nov 2026 | Approved. ER diagram and report corrections (Q16) are not handled in this project |
