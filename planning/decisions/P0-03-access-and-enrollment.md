# P0-03: Identity, access, enrollment and teacher verification

**Issue:** [#4](https://github.com/Haadiyah-Zafar/InSyncc/issues/4) · **Prepared:** 7 Nov 2026 · **Start after:** none
**Status:** Decisions A–E and the mid-activity group rule confirmed by Anum on 7 Nov 2026 (§9). Still open: the schema review for the new `declined` status (#9), and any design for the notice shown to students.

**Review references:** Q03 (explicitly kept pending by the human), Q12 (enrollment and session flows), Q13 (UI-only details).

---

## At a glance

| | |
|---|---|
| **Question** | Who can see and change each kind of data, how a person becomes a teacher, and how a student joins and leaves a class. |
| **Already fixed** | Supabase Authentication is the identity service. FastAPI validates requests and enforces authorization. Supabase service-role keys stay server-side only (`INSYNC_CODEX_CONTEXT.md`). A student cannot grant themselves teacher rights (issue #4). A hidden UI control is not authorization (`AGENTS.md`). Issue #2 amendment: access extends to Python source, run/result, whiteboard objects, separate control grants, removed members and teacher observation (P0-01). Class dissolved: class data deleted, teacher account kept (P0-07, S15). Archiving retains records (use case). |
| **Still open** | Q03 read/write matrix and RLS; teacher role verification; the join-request approval and rejection flow; removal and mid-activity group changes (Q12); who may read group-derived evidence (Q03). |

---

## 1. Current source positions

- **Identity:** Supabase Authentication with a profile mapped to the user (`INSYNC_SCHEMA_INVENTORY.md` USER table, candidate).
- **Role choice:** the UI prototype shows a self-selected teacher role at signup. This is listed as a UI detail pending Q13 (not a current commitment). It conflicts with the rule that students cannot grant themselves teacher rights.
- **Class membership:** `CLASS_MEMBER` has `status` `pending` or `enrolled`, and `joined_at`. The approval and rejection workflow is not described. The inventory says not to invent `rejected` or `removed` states without review (Q04, Q12).
- **Class:** owned by one teacher (`teacher_id`), with a unique join code. Archive keeps records; deletion on class dissolution is approved (P0-07, S15).
- **Student data:** students access only their own records. Group and class work needs some shared data (Q03; `INSYNC_CODEX_CONTEXT.md` §§6.7.4 and 6.4.9).

---

## 2. Decision A: teacher role verification

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A1. Seeded teacher accounts (recommended for the pilot)** | Teacher accounts are created by the developer through the backend, using the service key. Self-signup always creates a student. | Students cannot grant themselves the role. Fits one teacher in the pilot. | Manual setup for each new teacher. |
| **A2. Self-selected role with approval** | Anyone can ask for the teacher role, and an approved teacher or the developer approves it. | Scales to more teachers. | Needs an approver and a review screen. No approver role is defined in the docs. |
| **A3. Self-selected role, verified by email domain** | Teacher role granted if the email is on an approved school domain. | Automatic. | Domain list must be maintained. Not in any source document. |

**Recommendation: A1 for the pilot.** It is the only option that meets the rule without inventing a new approver role. A2 or A3 can follow with its own decision.

**Human decision:** choose A1, A2 or A3. If A2, name the approver.

---

## 3. Decision B: class joining and enrollment lifecycle

| Option | Description |
|---|---|
| **B1. Teacher approves join requests (recommended)** | Student enters the join code, creating `pending`. Teacher approves (`enrolled`) or rejects. A rejected request is deleted, not stored as a new state. |
| **B2. Automatic join with the code** | Code alone enrols the student. No review. |
| **B3. Teacher adds students by email** | Teacher lists student emails. Students accept. |

**Recommendation: B1.** It matches the pending state in the schema and the teacher-control rule. Rejection by deleting the pending row avoids adding a state the inventory says not to invent. Removal of an enrolled student deletes the membership row and ends their access at once.

**Human decision:** choose B1, B2 or B3. Confirm that rejection deletes the pending row, or ask for a `rejected` state (which needs review first).

**Mid-activity changes (Q12), decided 7 Nov 2026:** group membership is frozen while a session is running (option a). A student removed from a class still loses access immediately, as §6 states.

---

## 4. Decision C: read and write matrix

Recommended matrix. "Teacher" means the teacher who owns the class. "Member" means an enrolled student in the same class or group. Every cell is enforced in FastAPI, and in RLS where marked.

| Data | Student (own) | Member of same group | Teacher of the class | Other students | Other class teachers | Agents / backend |
|---|---|---|---|---|---|---|
| Own quiz attempts and answers | Read | — | Read | No | No | Write (through owning agent) |
| Own tutoring evidence | Read | — | Read | No | No | Write (Tutor Agent) |
| Personal performance measures | Read own | — | Read | No | No | Write (Progress Agent) |
| Class materials and extracted text | Read (enrolled) | Read | Read, write | No | No | Write (upload service) |
| Quiz questions (students see them) | Read when assigned | Read when assigned | Read, write | No | No | — |
| **Quiz answer keys and hidden solutions** | **No** | **No** | Read | **No** | **No** | Read (server only) |
| Discussion problem text | — | Read | Read | No | No | — |
| **Discussion hidden solutions** | **No** | **No** | Read | **No** | **No** | Read (server only) |
| Group messages and hints | — | Read, write (own messages) | Read (monitor) | No | No | Write (Discussion Agent) |
| Python source, run output, whiteboard objects | — | Read; edit only with control grant | Read (observe) | No | No | Write (runner, board service) |
| Group-derived performance evidence | — | — | Read | No | No | Write (backend only) |

**Decision for Q03:** whether a student may read group-derived evidence. Recommendation: **no**. Group-level results are visible to the group and teacher. Individual measures are only ever visible to that student and the teacher.

**Human decision:** approve the matrix, and the answer on group-derived evidence.

---

## 5. Decision D: how the rules are enforced

| Option | Description |
|---|---|
| **D1. FastAPI only** | All checks in application code. Simple. A bug in one route exposes data. |
| **D2. FastAPI plus RLS on personal and class tables (recommended)** | FastAPI is the main check. RLS on tables reachable from client-side queries is a second layer. The service key is used only by the backend and bypasses RLS on purpose, so backend code must enforce the matrix itself. |
| **D3. RLS only** | Database decides everything. Hard to test across WebSockets and agents. |

**Recommendation: D2.** Supabase exposes tables through its client, so RLS is a real second layer. WebSockets and agents go through FastAPI, so the matrix must also live there.

**Hidden fields:** each response has an allowlist of fields per role. Answer keys and hidden solutions are never in a student-facing model, so they cannot leak through serialization.

**Human decision:** choose D1, D2 or D3.

---

## 6. Decision E: sessions, expiry and removal

- **Expired login:** requests with an expired token are refused. WebSocket connections are closed when the token expires, and reconnection needs a fresh token. Recommendation: this.
- **Removed member:** access ends on the next request and on any open WebSocket, the moment the removal is saved.
- **Teacher observation:** teachers see live group activity only for their own classes, and the observation is logged. Students are not told the teacher is observing unless the teacher approves that rule. This last point is not in any source document and needs a decision.

**Human decision:** approve these rules, and decide the student-notification question.

---

## 7. Negative-access examples (become test fixtures)

1. A student calls the teacher-only endpoint to approve a join request. → Refused.
2. A student sets their own role to teacher at signup or by request. → Stays a student.
3. Teacher B opens class A's materials or quiz results. → Refused.
4. A student from another group requests the group's messages over WebSocket, supplying the group ID. → Refused. The client-supplied ID is not authority.
5. A removed student reconnects with an old token. → Refused.
6. A student's token expires during a live session. → Connection closed. Reconnect needs a fresh login.
7. A student requests a quiz response containing the answer key, or any hidden field. → Field absent from the response.
8. A student reads another student's personal performance measures. → Refused.
9. A student attempts to start a run on a surface they do not hold the control grant for. → Refused (run permission and control are separate).

---

## 8. Questions for Anum

1. Teacher role (Decision A): seeded accounts for the pilot (A1), or a different method?
2. Enrollment (Decision B): join requests approved by the teacher (B1), with rejection deleting the row?
3. Matrix (Decision C): approve as drafted, and confirm that students cannot read group-derived evidence?
4. Enforcement (Decision D): FastAPI plus RLS (D2)?
5. Teacher observation (Decision E): should students be told when a teacher observes live activity?

---

## 9. Approval (to be completed by Anum only)

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| A — Teacher role verification | A1 (seeded accounts for pilot) | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| B — Enrollment lifecycle | B3 chosen (teacher adds students by email; student accepts). Pending = invitation. A declined invitation is kept with a **declined** status. This adds a status to CLASS_MEMBER, so #9 must review the schema change. | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | New `declined` status needs schema review in #9 |
| B — Mid-activity group change | (b), teacher informed | | | |
| C — Read and write matrix | §4 as drafted | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| C — Group-derived evidence | No student access (part of §4) | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| D — Enforcement | D2 (backend plus row-level security) | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| E — Expiry and removal | §6 as drafted | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| E — Student notice of observation | Visible notice to students while a teacher observes | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Notice design for implementation |
| Mid-activity group change (Q12) | Group membership is frozen while a session is running (option a) | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
