# P0-09: API, event, agent and screen contracts

**Issue:** [#10](https://github.com/Haadiyah-Zafar/InSyncc/issues/10) · **Prepared:** 9 Nov 2026 · **Owner:** Anum (assigned on GitHub)
**Status:** **Draft outline: options and open dependencies only. Nothing is approved.** Approval is recorded only in §8 by Anum.
**Start after (live):** [#9 (P0-08)](P0-08-canonical-schema.md), which is still open and not yet approved. This draft cannot be approved before #9.
**Review references:** Q12 (session identity, partly resolved), Q13 (UI prototype scope, pending), Q16 (diagram sync), Q17 (report wording).

---

## 1. Purpose

Define the contracts that frontend and backend both build against: REST operations, WebSocket and Yjs messages, domain events, agent input and output, and the screen states that map to them. The issue asks for versioned fixtures that both sides can check.

This outline lists what each contract must cover and what is still undecided. It does not define payloads. Payloads follow the approved schema (#9) and the decision records.

---

## 2. Fixed constraints (already approved; do not reopen)

| Constraint | Source |
|---|---|
| Five agents keep their names; clients use application APIs, never individual agents | `AGENTS.md`, context §4 |
| Recommendations use Approve / Dismiss; group proposals use Approve / Edit | `AGENTS.md`, teacher control |
| Pending or dismissed recommendations cause no learning activity | P0-05 K |
| Backend authorization covers REST, storage and WebSockets; hidden UI controls are not authorization | `AGENTS.md`, P0-03 |
| Answer keys and hidden discussion solutions never appear in client payloads | `AGENTS.md`, P0-03 |
| Yjs syncs documents; generic JSON chat messages are not a Yjs protocol | `AGENTS.md`, Yjs section |
| Two surfaces, a Python editor and a whiteboard, each with its own control holder; run permission is separate from editing control | P0-01 amendment (10 Oct 2026), P0-06 G1 |
| Personal tutor board changes need learner approval before they apply | P0-05 PT1 |
| Failover, deadlines and retries are backend concerns, not client contracts | P0-07 |

---

## 3. Contract areas and open points

### 3.1 REST operations

- **Scope:** auth/profile, classes and enrollment, topics and concepts, materials, sessions, quizzes and attempts, progress, recommendations, groups and problems, tutoring sessions, Python source and runs.
- **Each operation needs:** request schema, response schema, error codes, authorization rule, and duplicate-request handling (idempotency key where a retry can duplicate work).
- **Open:** pagination where lists can grow (materials, messages); the error envelope format (the backend already uses `{"error": {...}}` per `backend/README.md`, which is a foundation convention, not an approved domain contract).

### 3.2 WebSocket and Yjs

- **Channels:** group workspace (Yjs document per surface), group chat, presence, teacher observation, and personal whiteboard approval flow.
- **Control messages:** request control, grant, take over, release, expire. Each carries the document ID, surface, holder and revision.
- **Errors:** stale control, unauthorized, and reconnect-required, each with a stable code.
- **Open:** control grant and take-over rules are P0-06 H and I, which Haadiyah Zafar owns. Until those are decided, the control message set is incomplete.
- **Compatibility:** the Yjs sync and awareness protocol is kept as-is; the early proof is #20.

### 3.3 Domain events

- **Examples to define:** quiz answer recorded, quiz completed, analysis requested, recommendation created, recommendation approved or dismissed, group proposed or approved, hint posted, job completed or failed.
- **Each event needs:** type, version, source, idempotency key, actor and payload schema.
- **Open:** replay behaviour and ordering guarantees. The inventory says event ordering is not established.

### 3.4 Agent input and output

- **Tutor:** input is the authorized question, concept, topic and recent tutoring summary; output is an explanation, one worked example and one check question, with source references (P0-05 A, context §6.1).
- **Quiz:** draft requests and answer-evaluation results; no answer key in any output sent to a student.
- **Progress:** analysis results with the calculated numbers and the AI-labelled summary separately (P0-05 A).
- **Teacher Assistant:** recommendation records with `action_type`, executor, evidence references and priority (P0-05 I; S10 in #9).
- **Discussion:** hint messages with `hint_level`, trigger and the AI label.
- **Open:** the exact action vocabulary is in P0-05 I. The table has seven rows; row 7 (class-level revision) has an unapproved threshold.

### 3.5 Screens and states

- **Mapped screens:** login, reset password, signup, student dashboard, class list and detail, adaptive quiz, progress, settings, teacher dashboard, class creation, material upload, student performance, group monitoring, recommendation review (context §13).
- **Each screen needs:** loading, empty, error and teacher-review states mapped to a contract.
- **Q13 (answered 9 Nov 2026):** UI-only extras from the report mockups (figures 4.1–4.17) are left out of the contracts. Any extra needs its own approval later.

### 3.6 Fixtures

- **Required:** one fixture set shared by frontend mocks and backend schema tests.
- **Must include:** unapproved quiz denial, group denial when not a member, pending teacher action, dismissed recommendation (no learning action), and a request with a hidden field that must be rejected.

---

## 4. Decisions needed before approval

| ID | Question | Options | Blocked by |
|---|---|---|---|
| C1 | Error envelope for domain APIs | Reuse the foundation envelope / define a new one | Anum |
| C2 | Idempotency keys | Required on every mutating operation / only on retry-prone ones | Anum |
| C3 | Control messages | Full set after H and I are decided | Haadiyah (H, I) |
| C4 | Event ordering and replay | Per-channel sequence number / none for pilot | Anum |
| C5 | Teacher-observation channel | Read-only stream / shared with the control messages | Q12, Haadiyah |
| C6 | Pagination | Cursor for messages and materials / none for pilot | Anum |

---

## 5. Downstream impact (if approved)

- **#16 and #9:** every payload references a table or state from the approved schema.
- **#22, #25, #37:** frontend screens build against these fixtures.
- **#21:** authorization rules attach to each operation.
- **#19 and #64:** job and run events.
- **#20 and #50:** Yjs and control messages.

---

## 6. Questions for Anum

1. Choose the options in §4 (C1, C2, C4, C6).
2. C3 and C5 wait for Haadiyah's H and I decisions and Q12.
3. Approve the fixed constraints in §2 as the baseline (they come from approved records, so this is confirmation, not a new decision).

---

## 7. Dependencies that must close first

- #9 approved (canonical schema, S1–S19).
- #7 H and I decided by Haadiyah Zafar, then #7 approved.
- Q13 (UI prototype scope) decided, or the UI-only extras excluded from the contracts.

---

## 8. Approval (to be completed by Anum only)

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| Fixed constraints (§2) | Confirm as baseline | | | |
| C1 Error envelope | Short: code and message only | Anum (chat) | 9 Nov 2026 | Replaces the foundation format for domain APIs. Changes the current backend error envelope; a code change is needed later |
| C2 Idempotency keys | Required on every change | Anum (chat) | 9 Nov 2026 | Approved |
| C3 Control messages | Approved as drafted | Anum (chat) | 9 Nov 2026 | Follows H1 and I (recorded 9 Nov from Haadiyah's answers in chat) |
| C4 Event ordering | Numbered per channel | Anum (chat) | 9 Nov 2026 | Approved |
| C5 Teacher observation | Separate read-only stream | Anum (chat) | 9 Nov 2026 | Taking control still uses C3 (H1) |
| C6 Pagination | Cursor for messages and materials | Anum (chat) | 9 Nov 2026 | Approved |
| Q13 UI-only extras | Left out of the contracts | Anum (chat) | 9 Nov 2026 | From report mockups; any extra needs its own approval |
| Q12 quiz availability and manual quiz sessions | Visible when the teacher approves it; one class session per quiz | Anum (chat) | 9 Nov 2026 | Settles the open Q12 quiz items |
| Q16 diagrams and Q17 report wording | Not in this project's scope | Anum (chat) | 9 Nov 2026 | Report and diagram edits are not handled here |
