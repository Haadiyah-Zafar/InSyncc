# P0-06: Grouping, discussion and shared workspace

**Issue:** [#7](https://github.com/Haadiyah-Zafar/InSyncc/issues/7) · **Prepared:** 7 Nov 2026 · **Start after:** none
**Status:** Decisions A–G, J and K confirmed by Anum on 7 Nov 2026 (§7). Decisions H and I are deferred to Haadiyah Zafar, who owns the whiteboard issues. Q06, Q10 and Q11 stay pending until H and I are decided.

**Review references:** Q06 (group construction), Q10 (discussion triggers and attribution), Q11 (workspace and controlled editing).

---

## At a glance

| | |
|---|---|
| **Question** | How groups are formed, what a group works on together, who may edit it, and when hints are given. |
| **Already fixed** | Teacher approves or edits every group before students get access (Approve / Edit). The Teacher Assistant Agent proposes groups. Group membership is frozen while a session runs (P0-03). Two surfaces, a shared Python editor and a shared whiteboard, each with its own control holder. Run permission is separate from editing control (P0-01). Yjs syncs documents; the backend enforces who may edit (AGENTS.md). Hints: levels 1–3, three minutes of silence, five off-topic messages, five-minute proactive cooldown, never naming an individual's weakness (source §5.8). Group hints are not attributed to individuals without an approved rule (P0-02, Decision D). |
| **Still open** | Group count and leftovers; ties; students with no data; the strength-based construction; topic-score scope; manual groups and duplicates; control grant, transfer and expiry; behaviour when a change is rejected or the student is offline; which messages count toward hint triggers; requested-hint limits. |

---

## Part 1: Group formation (Q06)

Source rules (report §5.7): descending score order; place each student into the non-full group with the lowest total score; a tie on that score goes to the group with fewer members; respect the selected maximum size; a remainder creates an additional group. A worked example is given: scores 0.90, 0.82, 0.75, 0.60, 0.48, 0.40 with size 3 produce [0.90, 0.60, 0.48] and [0.82, 0.75, 0.40], with means 0.66 and 0.66.

### A. Group count and leftover students

| Option | Description |
|---|---|
| **A1. Literal remainder (recommended)** | Fill groups to the maximum size. Any leftover students form one smaller group. This is what the report says. |
| **A2. Spread evenly** | Choose the group count so sizes differ by at most one. No group exceeds the maximum. |

**Recommendation: A1**, because it follows the report's wording. A2 is more balanced but changes the rule, so it needs your approval. Either way the teacher sees and can edit the result.

**Human decision:** A1 or A2.

### B. Very small leftover groups

If the leftover is a single student, the group is a singleton.

| Option | Description |
|---|---|
| **B1. Allow, teacher reviews (recommended)** | Keep the singleton. The proposal flags it, and the teacher decides. |
| **B2. Merge into the smallest group** | Add the singleton to a group, which then exceeds the maximum by one. |

**Recommendation: B1**, because it never breaks the size limit, and the teacher approves anyway.

**Human decision:** B1 or B2.

### C. Ties and students with no data

- **Remaining ties** (same total score, same size): choose the group with the lower number, so the result is the same every run. Recommended.
- **Students with no topic data:** the source says no-data learners are not labelled weak (P0-01). Options:
  - **C1. Show as "no data" and let the teacher place them (recommended).** The proposal cannot be finalised with these students until the teacher places them.
  - **C2. Place by overall score.** Treated as if they had a neutral score.

**Human decision:** confirm the tie rule, and choose C1 or C2.

### D. Strength-based construction

The source gives the pairwise complementarity rule but no full algorithm. Strong topic is 0.70 or above; weak is 0.50 or below. Complementarity counts topics where one student is strong and the other weak.

| Option | Description |
|---|---|
| **D1. Balanced placement, complementarity as the selection score (recommended)** | Use the same placement as the balanced rule, but choose the group with the highest complementarity for each student. Simple and deterministic. |
| **D2. Full search** | Try many arrangements and keep the one with the highest total complementarity. More accurate but harder to explain and test. |

**Recommendation: D1.**

**Human decision:** choose D1 or D2.

### E. Topic-score scope

P0-02 (Decision A) says a student's progress on a topic is shared across their classes. Group formation needs a topic score.

| Option | Description |
|---|---|
| **E1. Student's topic score, across classes (recommended)** | Consistent with P0-02. A student's score on a topic is the same whichever class is being grouped. |
| **E2. Class-only score** | Only that class's attempts count. Keeps groups tied to their class. |

**Recommendation: E1**, for consistency with P0-02.

**Human decision:** E1 or E2.

### F. Manual groups, duplicates and edits

- **Manual groups:** the teacher can create a group without scores. The group is recorded with the strategy "manual".
- **Duplicates:** a student cannot be in two groups in the same class session. The proposal warns, and the teacher must fix it before approval. Across different sessions, duplicates are allowed.
- **Edits:** the teacher can edit a group before the session starts. Once the session is running, membership is frozen (P0-03).

**Recommendation:** approve all three as written.

**Human decision:** approve F as drafted, or change it.

---

## Part 2: Shared workspace and controlled editing (Q11)

### G. What is edited together

| Option | Description |
|---|---|
| **G1. One shared Python editor and one shared whiteboard per group (recommended)** | Matches the two surfaces approved in P0-01. Each has its own control holder. |
| **G2. Section-based editing** | The editor is split into sections, each with its own holder. |
| **G3. One holder for everything** | One student controls both surfaces. |

**Recommendation: G1**, since P0-01 already approves two surfaces with separate holders.

**Human decision:** choose G1, G2 or G3.

### H. Control grant, transfer and expiry

| Option | Description |
|---|---|
| **H1. Holder passes control; released on disconnect (recommended)** | A student asks to take control, and the current holder can pass it on or release it. Control is released automatically when the holder disconnects. The teacher can always take control of a surface. |
| **H2. Teacher assigns control** | Only the teacher grants control. |
| **H3. Time-limited control** | Control expires after a set idle time. The length is not in any source, so you would set it. |

**Recommendation: H1**, plus a rule that the teacher can take control at any time. H3 can be added with a number from you.

**Human decision:** choose H1, H2 or H3, and say whether the teacher can always take control.

### I. Rejected changes and offline edits

- **Rejected change:** the server checks the control holder on every change before it is applied, broadcast or saved. A change from a non-holder is rejected. The client discards that local edit and reloads the document.
- **Offline or reconnect:** edits made while disconnected are kept locally only if the student still holds control on reconnect. Otherwise they are discarded with a message.

**Recommendation:** approve as written. This matches the rule that Yjs convergence does not enforce permissions (AGENTS.md).

**Human decision:** approve I as drafted, or change it.

---

## Part 3: Discussion hints (Q10)

### J. Which messages count toward the triggers

| Option | Description |
|---|---|
| **J1. Student messages only (recommended)** | Silence and off-topic counts look only at student messages. Hints and teacher messages do not reset the silence timer. |
| **J2. All messages** | Any message resets the silence timer, including AI hints. |

**Recommendation: J1**, so hints cannot keep themselves from triggering, and a teacher's note does not suppress a needed hint.

**Human decision:** choose J1 or J2.

### K. Requested hints

The source sets a five-minute cooldown for proactive hints. It sets no limit on requested hints.

| Option | Description |
|---|---|
| **K1. No limit on requests (recommended for now)** | Students can request a hint at any level, so the cooldown applies only to proactive hints. |
| **K2. Cooldown on requests too** | A requested hint also starts a cooldown. Needs a length from you. |

**Recommendation: K1**, since the source sets no request limit, and the cooldown applies to proactive hints.

**Human decision:** choose K1 or K2.

### L. Attribution

Group hints stay at group level, as approved in P0-02 (Decision D). No individual attribution is added here.

---

## 4. Sequence examples

1. **Remainder.** Eight students, maximum group size three. Under A1: two full groups of three, and one group of two. Under A2: groups of three, three and two.
2. **No data.** A student has no topic score. Under C1, the proposal shows "no data" for that student, and the teacher places them before approving.
3. **Rejected edit.** Student B does not hold the Python editor's control. B's edit is rejected by the server. B's screen reloads the document and shows who holds control.
4. **Silence trigger.** Three minutes pass with no student message in an open problem. A proactive hint is posted to the group, and the five-minute cooldown starts. An AI hint posted during the silence does not reset the timer under J1.
5. **Frozen group.** A teacher tries to move a student into another group while the session is running. The change is refused, as P0-03 requires.

---

## 5. Downstream impact (if approved)

| Area | Impact |
|---|---|
| Group records (schema) | Group size, strategy, leftover flag, manual flag, no-data flag. |
| Teacher Assistant Agent and API contracts (#10) | Proposal and approve/edit contract; duplicate and frozen checks. |
| Workspace contracts (#10) | Two control holders per group; grant, release, teacher take-over; server rejection messages. |
| Yjs and WebSocket transport (#20) | Authenticated document transport; rejected update handling; offline reconciliation. |
| Discussion Agent | Trigger timers that count student messages only; cooldown; levels 1–3. |
| Tests | Remainder cases, ties, no-data, duplicate membership, frozen group, unauthorised control change, stale update, reconnect, silence trigger, cooldown. |
| Report | The grouping example and §5.7 wording must match A and D. |

---

## 6. Questions for Anum

1. Group count and leftovers (A): A1 or A2?
2. Singleton leftovers (B): B1 or B2?
3. Ties and no-data students (C): ties by lowest group number; no-data students as C1 or C2?
4. Strength-based construction (D): D1 or D2?
5. Topic-score scope (E): E1 (across classes) or E2 (class only)?
6. Manual groups and edits (F): approve as drafted?
7. Workspace surfaces (G): G1, G2 or G3?
8. Control grant and take-over (H): H1, H2 or H3, and can the teacher always take control?
9. Rejected and offline edits (I): approve as drafted?
10. Trigger messages (J): J1 or J2?
11. Requested-hint limits (K): K1 or K2?

---

## 7. Approval (to be completed by Anum only)

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| A — Group count and leftovers | A2: spread evenly, sizes differ by at most one | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Replaces the literal remainder reading in the report (A1) |
| B — Singleton leftovers | B1: keep and flag for teacher review | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Under A2 a singleton should not normally arise |
| C — Ties and no-data students | Ties to lowest group number; no-data students shown as "no data" and placed by the teacher (C1) | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| D — Strength-based construction | D1: balanced placement, best complement | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| E — Topic-score scope | E1: student's topic score across all classes | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Consistent with P0-02 Decision A |
| F — Manual groups, duplicates, edits | Approved as drafted (Part 1, F) | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| G — Surfaces | G1: shared Python editor and whiteboard, each with its own holder | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| H — Control grant and take-over | **Deferred to Haadiyah Zafar**, who owns the whiteboard issues (Anum, 7 Nov 2026). Not decided here. | Deferred | | Options H1–H3 kept for her decision |
| I — Rejected and offline edits | **Deferred to Haadiyah Zafar** (Anum, 7 Nov 2026). Not decided here. | Deferred | | Options kept for her decision |
| J — Trigger messages | J1: only student messages reset the silence timer | Anum (answer 7 Nov 2026, re-answered) | 7 Nov 2026 | |
| K — Requested-hint limits | K2: a requested hint starts a five-minute cooldown, same as proactive | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Length taken from Anum's answer; not in the source document |
| Q06, Q10, Q11 overall | Pending until A–K confirmed | | | |

