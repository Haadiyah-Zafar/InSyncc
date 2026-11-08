# P0-05: Tutor, progress and recommendation semantics

**Issue:** [#6](https://github.com/Haadiyah-Zafar/InSyncc/issues/6) · **Prepared:** 8 Nov 2026 · **Start after:** none · **Close after:** none
**Status:** **Approved by Anum on 8 Nov 2026 in chat, with the exact choices recorded in §11** (Decisions A–K; Q6 and Q7 answered in §13). Some choices differ from the recommendations, as noted in §11. Approval applies only to the listed choices.
**Companion record:** [P0-05 personal tutor interaction](P0-05-personal-tutor-interaction.md) (PT1–PT3 confirmed 11 Oct 2026; not changed by this record).
**Review references:** Q02 (LLM use), Q07 (weakness and mastery), Q08 (evidence windows and bookkeeping), Q09 (tutor adaptation), Q12 (session identity and study suggestions).

---

## At a glance

| Decision | Recommended option | Blocks |
|---|---|---|
| A. LLM operation matrix (Q02) | LLM only for generated language; all numbers, labels, thresholds and routing are deterministic | Prompts, provider routing (#18), agent tests |
| B. Quiz weakness vs aggregated mastery (Q07) | Two separate signals; the recommendation uses only aggregated concept accuracy | Mastery schema, Tutor selection, recommendations |
| C. Threshold boundaries (Q07) | Strong ≥ 0.70, developing strictly between, weak ≤ 0.50, unassessed when no attempts | Analytics, UI labels, worked examples |
| D. Evidence windows and comparability (Q08) | Comparable = completed quizzes on the same topic; trend from the two latest comparable quizzes | Analysis triggers, evidence schema |
| E. Recurring mistakes (Q08) | Count distinct questions within the last five relevant interactions for one concept; a fixed, approved mistake taxonomy | Evidence schema, tests |
| F. Tutor adaptation bounds (Q09) | Levels clamped to 1–3; counters reset on any level change; weak concept starts at Level 1 | Tutor prompts, session fields |
| G. Missing material and repeated questions (Q09) | No material: no level change, no off-topic label, instructor flag; repeat = same normalized question in the same session | Retrieval, instructor UI |
| H. Tutoring session identity (Q12) | Tutoring session is separate from class `LearningSession`, with an optional link | #9 schema, #10 API |
| I. Recommendation actions and executors | One accountable executor per action (§7 table); teacher-only action for decline | #10 action enumeration, router |
| J. Student study suggestions (Q12) | Defer; no student-facing suggestions until an owner and review path are approved | Student screens (#25 area) |
| K. Pending and dismissed behaviour | No learning activity from pending or dismissed items; dismissal is final for the same evidence | Recommendation lifecycle |

---

## 1. Current source positions

- **Tutor (context §6.1, report §5.3):** on-topic / off-topic / unclear; top three retrieved chunks; one explanation, one worked example, one check question; decrease one level after the same question twice or an incorrect check; increase one level after two consecutive correct checks; one validation regeneration.
- **Quiz (context §6.2, P0-04):** weights 1/2/3; streaks of two at the current level; two wrong answers on one concept in one quiz flag it weak.
- **Progress (context §6.3, report §§5.5.2–3):** `Aq = Cq / Nq`; `Tc = Cc / Nc`; strong `Tc >= 0.70`; weak `Tc <= 0.50`; developing `0.50 < Tc < 0.70`; no data is never weak; trend ±0.10 between comparable accuracies; recurring mistake is the same normalized mistake at least three times in the five most recent relevant interactions.
- **Recommendations (context §6.4):** six conditions, each with a suggested action; actions are teacher-reviewed suggestions, not automatic dispatch.
- **Router (context §10):** approved recommendations route to the responsible agent; dismissed or pending recommendations cause no learning action.

Open in the source, and therefore decided here as options: the LLM matrix, the quiz-versus-mastery relation, the 0.50–0.70 wording conflict, comparability, the mistake taxonomy, the adaptation clamps and reset rules, same-question recognition, missing-material handling, session identity, and student suggestions.

---

## 2. Decision A: LLM operation matrix (Q02)

Each operation is either deterministic or LLM-based. The LLM writes words; it does not decide scores, classifications, thresholds or routing.

| Agent / operation | Deterministic | LLM | Recommended label |
|---|---|---|---|
| Tutor: topic classification | Session topic check | Classify on/off/unclear, with the deterministic check as the gate | Not shown |
| Tutor: explanation, worked example, check question | Level choice, retrieval | Generate text from retrieved chunks only | "AI-generated" |
| Tutor: output validation | Quiz-answer protection, length and format rules | Relevance check, with failure falling back to the default message | Not shown |
| Quiz: scoring, streaks, level change, weak flag | All of it | None | Not applicable |
| Quiz: question drafting | Selection rules | Draft questions, which then need teacher review | "AI-generated, teacher-reviewed" |
| Progress: `Aq`, `Tc`, trend, average, recurring mistakes | All of it | None | "Calculated" |
| Progress: mistake normalization | Taxonomy lookup | Optional fallback for free text, only into the approved taxonomy | "AI-assisted classification" |
| Progress: narrative summary | Numbers come from the calculation | Optional prose summary, shown with the numbers beside it | "AI-generated summary" |
| Teacher Assistant: classify recommendation | Thresholds and precedence (§7) | None | "Calculated" |
| Teacher Assistant: recommendation wording | Action and evidence fixed | Draft wording only | "AI-generated" |
| Teacher Assistant: group proposals | Context §6.5 algorithm | None (wording only, if any) | "Calculated" |
| Discussion: hints | Trigger timing, level, cooldown | Hint text, validated against hidden solution | "AI hint" |
| Discussion: misconception detection | Trigger flag from its own rule | LLM may detect; treat as uncertain and needs an evaluation set before use | "AI hint" |

**Option A1 (recommended):** the matrix above. Every LLM-based output carries its label and the deterministic numbers it rests on.
**Option A2:** all five agents call an LLM for their main output. Rejected: it puts model variability into scores and thresholds, which the report's formulas do not allow.
**Option A3:** an LLM is used only for the Tutor and Discussion Agent, with Progress and Teacher Assistant fully deterministic. Acceptable fallback if the narrative summary is dropped from the pilot.

**Downstream:** the prompt-template list (#18), model routing per operation (P0-07), output schemas, the AI-label wording (Q02), and the evaluation set for misconception detection.

---

## 3. Decision B: quiz weakness versus aggregated mastery (Q07)

Two separate signals:

- **Quiz weak flag:** two wrong answers on one concept within one quiz. It is evidence from one attempt.
- **Aggregated concept state:** `Tc` over all attempted answers for the concept, from the window in Decision D.

**Approved 8 Nov 2026 (B1 variant):** aggregated state decides; the quiz flag is a visible warning, not a state change.
**Option B1 (recommended):** keep both. The quiz flag affects question selection and tutoring focus. The recommendation uses only the aggregated state (the boundary table in §4, Decision C). A quiz flag alone never produces a "revise" recommendation.
**Option B2:** a quiz flag immediately makes the concept weak. Rejected: the report's own example (two recent wrong answers, strong cumulative accuracy) would then be classified weak.
**Option B3:** quiz flag clears after one correct answer in a later quiz. Not recommended; it adds a second clearing rule without evidence. The flag can instead be marked *resolved* when a later quiz has no wrong answers on that concept.

**Conflicting-signal example:** concept "loops". Cumulative `Tc = 7/10 = 0.70` (strong). The latest quiz has two wrong answers on "loops" (quiz flag set).
- Tutor: the next question is selected on "loops"; Level 1 is not forced.
- Progress: state is *strong* with *quiz flag: active*, both shown.
- Recommendations: none produced for "loops" from the flag alone. If the next quiz also flags it, a targeted-practice recommendation (§7, row 3) is produced, with both pieces of evidence attached.

---

## 4. Decision C: boundaries and cold starts (Q07)

The report's "between 0.50 and 0.70" overlaps the weak rule at 0.50 and the strong rule at 0.70.

**Recommended partition (exact, non-overlapping):**

| State | Rule | Note |
|---|---|---|
| Unassessed | No attempts (`Nc = 0`) | New enum value (Q04 schema) |
| Weak | `Tc <= 0.50` | Includes 0.50 |
| Developing | `0.50 < Tc < 0.70` | Both endpoints excluded |
| Strong | `Tc >= 0.70` | Includes 0.70 |

**Worked examples (approved values to confirm):**

| Attempts correct / total | `Tc` | State |
|---|---|---|
| 0 / 0 | none | Unassessed |
| 5 / 10 | 0.50 | Weak |
| 51 / 100 | 0.51 | Developing |
| 9 / 13 | 0.6923… | Developing (just below 0.70) |
| 7 / 10 | 0.70 | Strong |
| 1 / 1 | 1.00 | Strong, but low evidence (see below) |

**Evidence sufficiency:** one attempt is data but not reliable. Recommended: a state is shown with a "low evidence" marker below two attempts, and no recommendation is produced from fewer than two attempts. The two-attempt minimum is a new threshold and needs approval.

**Comparison in code:** compare integers (`2 * Cc <= Nc` for weak, `10 * Cc >= 7 * Nc` for strong) to avoid floating-point errors at the boundaries.

**Option C1 (recommended):** the partition above.
**Option C2:** weak `< 0.50`, developing `0.50–0.70`, strong `> 0.70`. Rejected: it contradicts the documented 0.50 and 0.70 inclusions.

---

## 5. Decision D: evidence windows and comparability (Q08)

- **Comparable quizzes:** completed quizzes on the same topic, in the same class, for the same learner. A quiz with zero attempts on the concept is not comparable for that concept.
- **Trend:** the two latest comparable completed quizzes that include the concept. Difference `Aq_latest - Aq_previous`; `>= +0.10` improving, `<= -0.10` declining, otherwise stable. Compare with exact fractions, not rounded values.
- **Average quiz accuracy:** arithmetic mean of completed quiz accuracies for the topic (not pooled attempts). It is never shown as overall grouping accuracy.
- **Zero attempts / first result:** no accuracy, no trend, no average; the first result is shown without a trend arrow.
- **Quiz length and termination:** attempts count only when the quiz is completed or the attempt ends with a saved final result (P0-04).
- **Rounding:** stored at full precision; displayed to two decimals; thresholds compared unrounded.
- **Window length:** the whole history of the topic for the pilot (no time window). A time-based window is not recommended for a pilot of this size; revisit if history grows.

**Analysis trigger:** a quiz completion, an approved tutoring record, a teacher request, or *N* new evidence events since the last analysis. **N = 3** (learner-answer 8 Nov 2026; a new value, not yet approved; the recommended N = 5 was not chosen). Debounced so that one batch produces one analysis.

**Option D1 (recommended):** as above.
**Option D2:** comparable = same quiz *title* or same question set. Rejected for the pilot: quiz titles are teacher-authored and not normalized; question sets change with bank selection (P0-04).

---

## 6. Decision E: recurring mistakes (Q08)

- **Event:** one wrong answer or one tutoring-identified misconception, linked to one concept and one question or interaction ID.
- **Relevant interactions:** the five most recent *interactions* for that concept, where an interaction is one answered question or one tutoring exchange. Multiple wrong-answer events inside one interaction count as one (for example, a re-submission of the same answer).
- **Recurring:** the same normalized mistake type appears in at least three of those five.
- **Taxonomy:** a fixed list per concept, approved by a teacher-facing owner. It is not generated by an LLM at runtime. The taxonomy is a required approval item (see §11).

**Example (recurring):** last six interactions on "loops" are types `A, A, A, B, C, A` (A = off-by-one). The last five are `A, A, B, C, A`: A appears three times → recurring.
**Example (not recurring):** last five are `A, B, A, B, C`: A appears twice → not recurring.

**Option E1 (recommended):** as above.
**Option E2:** count every wrong event, including repeats within one interaction. Rejected: one stubborn answer re-submitted three times would be treated as a pattern.

---

## 7. Decision I: recommendations, executors and precedence (Q07, Q08, §6.4)

Each recommendation contains learner, topic, concept, analysis, evidence references, action, and priority. Pending and dismissed recommendations trigger nothing.

| # | Condition (context §6.4, made exclusive) | Action | Executor (accountable) | Priority |
|---|---|---|---|---|
| 1 | Continued decline after support (Decision D trend declining in two consecutive comparable quizzes that follow a tutoring or teacher action) | Direct teacher attention | Teacher only; no agent | High |
| 2 | Recurring mistake (Decision E) | Targeted tutoring on the misconception | Tutor Agent | High |
| 3 | Weak state (`Tc <= 0.50`) | Revise with additional explanation | Tutor Agent | High |
| 4 | Developing state (`0.50 < Tc < 0.70`) | Additional practice | Quiz Agent (draft practice; teacher-reviewed) | Medium |
| 5 | Repeated tutoring on one concept (three or more tutoring records in the last five interactions) | Additional explanation or practice | Tutor Agent | Medium |
| 6 | Strong state, no recurring mistake | More advanced practice | Quiz Agent (Hard-level draft) | Low |
| 7 | Same weak concept across several learners | Consider class-level revision | Teacher Assistant Agent (proposal only) | Low |

**Precedence:** the first matching row wins for each concept; rows 1 and 2 may both apply and are shown together.
**Threshold for "several learners" (row 7):** proposed at three or more learners in the class with a weak state on the same concept. New value, needs approval.
**Row 1 threshold:** "two consecutive" and "after support" are a proposal; the report does not define them.

**Option I1 (recommended):** the table above.
**Option I2:** every recommendation dispatches to Tutor Agent. Rejected: decline and advanced practice do not fit the Tutor's responsibilities.

---

## 8. Decision F: tutor adaptation bounds (Q09)

- **Levels:** 1, 2, 3. Decrease never goes below 1; increase never goes above 3. Clamping means the level stays where it is.
- **Counters:** the "same question twice" counter and the "two correct checks" counter reset whenever the level changes, and at the start of a new tutoring session.
- **Starting level:** from the quiz stage or concept (Level 1 easy, 2 medium, 3 hard, as in context §6.1). **Weak-concept override:** a weak concept (Decision C) starts at Level 1 regardless of quiz stage.
- **Precedence:** a weak-concept override sets the starting level; during the session, the check-answer rules (decrease on incorrect, increase after two correct) apply on top of that.
- **Recurring misconception:** addressed directly in the explanation; does not change the level on its own.

**Worked example:** a learner on Level 2 asks the same question twice → Level 1, counters reset. Two correct check answers at Level 1 → Level 2, counters reset. Level 3 with two correct checks → stays at Level 3.

**Option F1 (recommended):** as above.
**Option F2:** the weak-concept override stays at the quiz stage level. Rejected: the report's intent is to give more help to weak concepts.

---

## 9. Decision G: missing material, repeated questions, check questions (Q09)

- **Same question (repeated):** same concept, and the learner's question text is the same after normalization (case, whitespace, punctuation) within the same tutoring session. Paraphrases are not counted as the same question (conservative; avoids penalising a learner for rephrasing).
- **Missing material** (no chunks above the relevance threshold): a brief message that the course material does not cover this; no off-topic label; no level change; an instructor-review flag is created for the topic. The flag is shown to the teacher; wording must not imply the learner was off-topic.
- **Check question:** required for every explanation (per report); a learner may skip it. A skip does not count as correct or incorrect and does not change the level.
- **Ongoing quiz answers:** the Tutor refuses to reveal or confirm the answer to any question in an in-progress attempt (P0-04 attempt state), and says so.
- **History:** the session's messages and the tutoring record (concept, level, summary, check result) are kept with the session; retention follows the approved backup and retention rules (P0-07), not decided here.

**Option G1 (recommended):** as above.
**Option G2:** count paraphrases as the same question using a similarity score. Not recommended for the pilot: it needs a threshold that is not in the source and is hard to test.

---

## 10. Decision H and J: session identity and study suggestions (Q12)

- **H (recommended):** tutoring session is learner-initiated, belongs to one learner and one topic, and may optionally reference a class `LearningSession` when started from one. It is not a class session and does not change class membership.
- **J (recommended):** defer student-facing study suggestions. Until an owner and a teacher-review path are approved, the system does not show unreviewed study suggestions to students. The Tutor's own explanations and check questions are part of the tutoring session, not separate suggestions.

**Options for J:**
- J1 (recommended): defer.
- J2: Tutor Agent owns suggestions and they are shown without review. Rejected: it creates student-facing learning activity without teacher approval, which the pilot rules do not allow.
- J3: suggestions are generated only from approved recommendations. Possible later; it would need its own approval.

---

## 11. Decision K and approval table

**K (recommended):** a recommendation moves through *pending → approved | dismissed*. Only *approved* triggers a learning action. A dismissed recommendation does not reappear for the same evidence; new evidence after dismissal may create a new recommendation. Pending recommendations get the teacher reminder after one day (P0-02, approved 7 Nov 2026; confirm whether it covers quiz-related items, as noted in #5).

**Approval (Anum, in chat, 8 Nov 2026):** Anum replied "Yes, after Q6 and Q7 are answered" to the question on Decisions A–K. Q6 and Q7 are now answered (§13), so the approval applies. Rows F, G, I and K were not asked about separately and carry their recommended options under that same yes. The table notes state the exact choice for each row.

| Decision | Recommendation | Approved by | Date | Notes |
|---|---|---|---|---|
| A. LLM operation matrix | A1 + optional Progress narrative | Anum (chat) | 8 Nov 2026 | "Also LLM narrative summary" |
| B. Quiz weakness vs mastery | B1 variant: aggregate decides; quiz flag shown as warning | Anum (chat) | 8 Nov 2026 | Differs from the B2 answer first given; Q6 answered: aggregated state wins |
| C. Boundaries; two-attempt evidence minimum (new) | C1 | Anum (chat) | 8 Nov 2026 | 2 attempts |
| D. Comparability; trend; analysis-trigger N (new) | D1 with N = 3 | Anum (chat) | 8 Nov 2026 | N = 3, not the recommended 5 |
| E. Recurring mistakes; approved taxonomy required | E1 | Anum (chat) | 8 Nov 2026 | Teacher-approved fixed list per concept |
| F. Tutor adaptation bounds | F1 | | | |
| G. Missing material; same-question rule | G1 | | | |
| H. Tutoring session identity | H as recommended: optional link to a class session | Anum (chat) | 8 Nov 2026 | Q7 answered: tutoring sessions may exist outside a class session |
| I. Recommendation table, precedence, row 7 threshold (new), row 1 definition | I1 | | | |
| J. Student study suggestions | J1 (defer) | Anum (chat) | 8 Nov 2026 | Defer |
| K. Pending/dismissed lifecycle | K (as recommended) | | | |

---

## 12. Downstream impact (if approved)

- **#9 schema:** concept state enum gains *unassessed*; mistake taxonomy table; comparable-quiz keys; tutoring-session table with optional class-session reference; recommendation lifecycle states.
- **#10 contracts:** recommendation action enumeration with executors; router events for approved actions only; tutoring-session API.
- **#18 model pool:** per-operation LLM routing from Decision A; the misconception detector needs its own evaluation before use.
- **#19 background work:** progress analysis jobs triggered by the rule in Decision D.
- **Tests:** the boundary examples (0.50, 0.70, 0.51, 0.69), trend examples (±0.10 and ±0.09), the three-of-five examples, the conflicting-signal example, and the level clamps must be fixtures.
- **Report and glossary:** the 0.50–0.70 wording, the "between" rule and the study-suggestion wording need correction only after approval.

---

## 13. Questions for Anum

1. Approve the LLM matrix (A1), including the labels in §2?
2. Approve the three new thresholds: two-attempt evidence minimum (C), analysis trigger N = 5 (D), and "several learners" = 3 (I)?
3. Who owns the recurring-mistake taxonomy, and is a per-concept list acceptable for the pilot (E)?
4. Confirm the recommendation table and precedence (I), including that decline goes to the teacher only.
5. Defer student study suggestions (J1)? Answered 8 Nov 2026: defer. Not yet approved.
6. **Quiz flag vs mastery (B). Resolved 8 Nov 2026:** the aggregated state wins. A quiz flag is shown as a warning in Progress and never triggers a recommendation on its own. The earlier answer (quiz flag makes the concept weak) is superseded by this one.
7. **Session identity (H). Resolved 8 Nov 2026:** tutoring sessions may exist outside a class session. A session started from a class is linked to it; a learner's own session is not.
