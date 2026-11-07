# P0-04: Quiz lifecycle, adaptation edge cases and in-attempt review

**Issue:** [#5](https://github.com/Haadiyah-Zafar/InSyncc/issues/5) · **Prepared:** 7 Nov 2026 · **Start after:** none
**Status:** Decisions A–G confirmed by Anum on 7 Nov 2026 (§12). The open Q05 mechanics, Q08 bookkeeping and Q12 quiz assignment items remain pending.

**Review references:** Q05 (approval requirement resolved; mechanics pending), Q08 (bookkeeping pending), Q12 (quiz assignment pending).

---

## At a glance

| | |
|---|---|
| **Question** | What happens when a student's attempt needs a question that is not ready, and how the attempt starts, runs, pauses and ends. |
| **Already fixed** | AI quiz questions need teacher review before use. Questions generated during an attempt need **additional teacher approval** (P0-01, §9; Q05 resolved by the human). Levels: Easy, Medium, Hard, with weights 1, 2, 3. New learners start at Medium. Two correct in a row at a level raises it; two wrong in a row lowers it. Two wrong answers on one concept in one quiz flags it as weak. Raw accuracy and weighted score are separate. Teacher reminder after 1 day for waiting reviews (P0-02, 7 Nov 2026). |
| **Still open** | Exhausted question bank; approval per question version; attempt length; repeat attempts; streak rules when a fallback question is used; rounding and zero-attempt results; quiz assignment (Q12). |

---

## 1. Current source positions

- **Quiz origin and approval:** a quiz is a draft when the session ends. The teacher reviews and approves it before students can attempt it (`INSYNC_CODEX_CONTEXT.md` §5.2, steps 3–4). Manual quizzes are also supported (schema §9).
- **Question fields:** each question has one concept, one difficulty, options, and a correct answer hidden from students (schema §10).
- **Attempt fields:** `started_at`, `completed_at` (empty while in progress), `raw_accuracy`, `weighted_score`, `final_difficulty` (schema §11).
- **Missing from the sources:** attempt length, repeat policy, what happens when no question is available, and the quiz-to-student assignment table (schema §9 note).

---

## 2. Decision A: exhausted question bank

When the next question at the current level is not available (no unanswered, approved question), the attempt must go on in some way.

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A1. Wait for teacher approval** | Attempt pauses. The teacher gets a question to review. The student sees a waiting state. | Strict: no new question is used without approval. | Student may wait a long time. Needs the teacher queue and waiting state. |
| **A2. Use an approved question at the nearest level** | The system uses an already-approved question at the next level up or down. Nothing new is generated. | Attempt continues. No new approval needed, because the question was approved earlier. | Streak rules must say which level counts (Decision E). |
| **A3. End the attempt early** | Attempt ends and reports partial results. | Simple. | Loses the student's place and may give misleading results. |

**Recommendation: A2 first, then A1 as the fallback.** A2 keeps the attempt moving using approved material only. A1 applies when even A2 has nothing. A3 is not recommended because it can give a misleading result.

**Rejection and absence:** if the teacher rejects a generated question, it is discarded and the attempt uses A2 again. If the teacher does not respond, the attempt stays waiting, and the teacher is reminded after 1 day (P0-02 rule). The student's answers are kept throughout.

**Human decision:** choose A1, A2 or A3, or a combination, and confirm the rejection and absence rules.

---

## 3. Decision B: approval tied to question version

| Option | Description |
|---|---|
| **B1. Approval per question version (recommended)** | Editing a question creates a new version that needs approval. Students only see approved versions. Attempts record which version they answered. |
| **B2. Approval per question** | Approval covers the question. Edits keep the old approval. |

**Recommendation: B1.** It means an edited question is never used without review, and the record shows exactly what the student answered.

**Human decision:** choose B1 or B2.

---

## 4. Decision C: attempt length and end

| Option | Description | Pros | Cons |
|---|---|---|---|
| **C1. Fixed length set by the teacher (recommended)** | The teacher sets the number of questions when approving the quiz. The attempt ends after that many answers. | Predictable. Results comparable across students. | Teacher must choose a number. |
| **C2. Until the bank runs out** | The attempt continues while approved questions exist. | Uses all material. | Unpredictable length; may run long. |
| **C3. Time limit** | Attempt ends at a set time. | Familiar to students. | Adds timing rules and interruption cases. |

**Recommendation: C1.** The sources do not give a length, so the teacher chooses it per quiz. No default length is assumed.

**Human decision:** choose C1, C2 or C3. If C1, confirm the teacher sets the number per quiz.

---

## 5. Decision D: repeat attempts

| Option | Description |
|---|---|
| **D1. One attempt per student per quiz (recommended)** | A completed attempt is final. The teacher may reopen it. |
| **D2. Repeats allowed** | Students may retake, and each attempt is recorded. |

**Recommendation: D1.** Repeats would change the progress evidence, and the sources do not describe a repeat rule (Q08). Repeats can be added later with a separate decision.

**Human decision:** choose D1 or D2.

---

## 6. Decision E: streak rules when a fallback is used

Rule as written: two correct answers at the current level raise it; two wrong lower it; a change resets the streak count.

| Option | Description |
|---|---|
| **E1. Count the level the question was served at (recommended)** | Streaks use the actual difficulty of the question the student answered. A fallback question counts at its own level. |
| **E2. Count the target level** | Streaks use the level the system was aiming for, even if a different question was served. |

**Recommendation: E1.** It records what the student really answered, so the level is accurate. E2 would credit or penalise the student for a question they did not face.

**Human decision:** choose E1 or E2.

---

## 7. Decision F: interruption, resume and duplicates

- **Save each answer** when it is submitted. An attempt can be resumed at the next unanswered question after a closed browser, a timeout or a lost login.
- **Duplicate submit:** the same answer sent twice is evaluated once. The second request returns the stored result. This uses the idempotency key from P0-07 (S10).
- **No silent deletion or extra attempt** (P0-01, screen table).

**Human decision:** approve these rules.

---

## 8. Decision G: numbers, rounding and zero attempts

- **Stored precision:** 4 decimal places (`numeric(5,4)` in the schema).
- **Display:** whole percentages for raw accuracy and weighted score. The record keeps the stored value.
- **Zero attempts:** the result is "no answers yet". It is not stored as 0%, because 0% would wrongly suggest a weak result. This follows the source rule that absent evidence is not labelled weak (P0-01).

**Human decision:** approve these rules.

---

## 9. Worked examples

**Example 1: cold start.** New student, starts at Medium (weight 2). Answers Medium correctly, then Medium correctly. Two correct in a row at Medium raises the level to Hard. The next question is Hard (weight 3).

**Example 2: two-answer change.** At Medium, answers Wrong, Right, Wrong, Wrong, in that order. The Right answer breaks the first pair, so the level stays Medium after the third answer. The fourth answer makes two wrong in a row at Medium, so the level drops to Easy. The streak count resets on the change.

**Example 3: weighted score.** Six questions answered. The source example gives 3 correct out of 6, so raw accuracy is 3/6 = 50%. Weighted score is 6/14 ≈ 42.9%, using the weights of the answered questions. Stored as 0.5000 and 0.4286.

**Example 4: zero attempts.** A student opens a quiz and leaves at once. Result shows "no answers yet". No score is stored.

**Example 5: exhausted bank (with A2 and E1).** At Hard, no unanswered Hard question is left. The system serves an approved Medium question (A2). The student answers it correctly. The streak counts it as a Medium answer (E1), not a Hard one. The Hard streak is not advanced.

**Example 6: exhausted bank with no approved fallback (A1).** No approved question is left at any level. The attempt pauses. The teacher is notified. The reminder is sent after 1 day if there is no answer. The student's answers are kept. When the teacher approves a new question, the attempt resumes at the same question.

---

## 10. Downstream impact (if approved)

| Area | Impact |
|---|---|
| Schema (#9) | Question versions and approval records. Attempt answers as rows with question version and served difficulty. Repeat rule if D2. |
| API and states (#10) | Attempt states: not started, in progress, waiting for teacher, completed. Waiting-for-teacher is visible to the student. |
| Quiz Agent (#33–#36) | Selection order: unanswered approved at current level, then A2, then A1. |
| Jobs (#19) | Waiting for review is a paused job with its checkpoint (P0-02). |
| Tests | Exhausted bank; rejection; teacher absence; duplicate submit; resume after lost login; streak across a fallback; zero-attempt display. |
| Report | Figures that show question flow need the chosen option. |

---

## 11. Questions for Anum

1. Exhausted bank (Decision A): A2 then A1, or another order?
2. Approval per question version (Decision B): B1?
3. Attempt length (Decision C): C1, with the teacher setting the number per quiz?
4. Repeats (Decision D): one attempt per student per quiz (D1)?
5. Streak rule with a fallback (Decision E): count the level served (E1)?

---

## 12. Approval (to be completed by Anum only)

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| A — Exhausted bank | A2 then A1: nearest approved question first, then wait for teacher | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| B — Approval per version | B1: each edit creates a version that needs approval | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| C — Attempt length | C1: teacher sets a fixed number per quiz | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| D — Repeat attempts | D1: one attempt; teacher can reopen | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Reopen rule for implementation |
| E — Streak with fallback | E1: count the level served | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | Confirm in record |
| F — Interruption and duplicates | §7 as drafted | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| G — Numbers and zero attempts | §8 as drafted | Anum (confirmed 7 Nov 2026) | 7 Nov 2026 | |
| Q05 mechanics | Pending until A–B confirmed | | | |
| Q08 bookkeeping | Pending | | | |
| Q12 quiz assignment | Pending | | | |
