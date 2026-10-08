# InSync review and dependency register

**Status: unresolved items prevent finalization. Prepared 8 October 2026.**

Read with [the master context](INSYNC_CODEX_CONTEXT.md) and [the candidate schema](INSYNC_SCHEMA_INVENTORY.md). Items below are questions for human decision, not new requirements or permission to change the project. No answer has been inferred from silence.

## Decisions already confirmed in this chat

| Item | Human decision | Consequence |
|---|---|---|
| Source precedence | Use latest conversation decisions over conflicting old local report content; flag conflicts. | Do not revive old architecture from the local template. |
| Subject/audience | Programming Fundamentals pilot; retain school and university audiences now. | Update only this handoff's scope; report/UI examples and evaluation wording need separately approved changes. |
| State terminology | Keep the proposed clarification pending. | Q01 remains blocked. |
| LLM/prompt wording | Keep the proposed clarification pending. | Q02 remains blocked. |
| Access wording | Keep the proposed clarification pending. | Q03 remains blocked. |
| Schema inventory | Preserve the dictionary as a candidate; block conflicts. | Q04 is not resolved into an executable schema. |
| New question during a quiz | Allow use only after additional teacher approval. | Approval gate settled; Q05 records unresolved workflow/schema consequences. |

## Source completeness — approval required before claiming exhaustiveness

The original **Multiagent Collaboration Ideas** chat was described as very long. The conversation reader returned only five latest exchanges, three incomplete Chapter 6 attachments, and no cursor for older turns. The newly supplied **F26-148.pdf** provides a complete 135-page report, including the detailed methodology and design that those excerpts omitted. It does not establish every decision or removal in the unavailable history.

**Required choice:** provide the complete conversation export/earlier decision material, or explicitly accept that this handoff covers the available report and accessible chats rather than every historical agreement. Missing conversational history must never be presented as having been reviewed.

## Q01 — LearnerContext, InSyncState, ownership and checkpoint contract

**Status: explicitly kept pending by the human.**

Evidence: R §§5.2, 5.9 and 6.1.2 use “shared learner context” in overlapping senses. R §6.6.1 (PDF p. 126) describes persistent `LearnerContext` and loading evidence into active state; §6.6.2 describes `InSyncState`. Figure 5.1 (PDF p. 105) specifies checkpointing to Supabase after every agent step, while other text is less specific. C's latest review proposes clearer separation, but the human has not approved it.

**Human decision needed:** define the authoritative meaning and scope of both types; per-student versus topic/class/workflow scope; field owners and multi-writer evidence rules; load/save timing; and checkpoint store/frequency. The one-context-per-student dictionary does not establish whether explanation/difficulty values should transfer across classes/topics.

**Downstream:** database/ORM models, graph state schema, reducers/merge rules, event routing, checkpoints, concurrency/recovery, data access, tests, glossary, Figures 5.1/6.1/6.4/6.5, Chapters 1/5/6.

## Q02 — LLM responsibilities, deterministic calculations and AI labeling

**Status: explicitly kept pending by the human.**

Evidence: R §1.3 defines an agent using an LLM; §6.7.5 says all five agents use prompt templates. R §§5.4–5.7 and supporting heuristic classes specify formulas/rules. Language generation of explanations, questions, hints and recommendation text is clearly described, but this does not settle every operation or the Progress Agent's LLM use. Figure 6.4 says external AI is used “if required.”

**Human decision needed:** identify each LLM-supported operation and deterministic operation; decide whether all five agents use any LLM capability; approve exact prompt-template and AI-generated-label wording. Preserve the documented numeric rules while this remains open.

**Downstream:** prompts, providers, cost/latency expectations, failure isolation, model evaluation, output schemas, tests, glossary, agent definitions and UI transparency.

## Q03 — Student shared access and hidden data

**Status: explicitly kept pending by the human.**

Evidence: R §6.7.4 says students access only their own records. R §6.4.9 and collaborative use cases describe necessary group data. The text also describes the discussion-problem table as not visible to clients, while students need its problem text; hidden solutions and correct quiz answers must remain protected. Privileged backend updates and RLS coexist in the design without a final enforcement contract.

**Human decision needed:** approve the read/write matrix for private learner evidence, class membership, materials, group membership/messages, problems and hidden fields; define how backend authorization and RLS apply with privileged credentials. Decide teacher-role verification and who can read group-derived performance evidence. Do not broaden student access by inference.

**Downstream:** RLS, endpoint serializers, storage access, service-role handling, WebSocket authorization, role onboarding, retrieval filtering, security tests and report wording.

## Q04 — Candidate data dictionary versus ER diagram and missing relations

**Status: dictionary preserved as candidate by human approval; conflicting schema details blocked.**

Evidence: R Table 4.17, PDF pp. 80–85, conflicts with Figure 4.18, PDF p. 79. Examples include composite versus surrogate membership keys; user/student references; class-code naming; session attributes; difficulty naming; mastery fields; tutoring history; score/completion fields; progress/recommendation fields; and membership/message metadata. The ER figure contains two boxes labeled QUESTION with incompatible contents.

The schema also lacks clear representations for selected student/group quiz assignment, approval of new individual questions, learner evidence windows, recurring-mistake records, reviewer/execution audit, meaningful workspace state, and discussion-problem lifecycle. Manual group creation exists, but the dictionary's strategy enum contains only the two algorithmic strategies. A question has one concept FK even though Hard questions may combine concepts. The narrative question bank and quiz-owned questions need reconciliation.

**Human decision needed:** approve a canonical field/relationship model and a list of necessary additions or deletions; decide identifiers, keys, uniqueness, null/default rules, foreign-key behavior and versioning. Preserving the dictionary does not authorize adding missing tables automatically.

**Downstream:** migrations, ORM/Pydantic models, REST/WebSocket payloads, RLS, algorithms, retained history, diagrams, tests and report data dictionary.

## Q05 — Additional teacher approval for questions generated during an attempt

**Status: approval requirement resolved by the human; dependent implementation choices pending.**

Human decision: **new questions may be used only after additional teacher approval**. R §5.4 allows generation when no suitable unanswered question exists; R §§4.2.2, 4.6.12 and 6.4.4 require question review before assignment. The human's decision now governs that boundary.

**Human decision still needed:** should the attempt wait while a question is reviewed, use an already-approved nearest-level question, or offer another explicit path? What happens on rejection, teacher unavailability or timeout? Is approval attached to the exact question version? How is an in-progress attempt resumed? Does actual selected difficulty or target level govern streak updates when a fallback is used?

**Downstream:** question/quiz approval records, teacher queue/UI, attempt state, bank selection, notifications, event routing, retries/idempotency, question versioning, scoring tests, §§5.4/5.9/6.4.4 and sequence diagrams. Do not implement these mechanics from the approval gate alone.

## Q06 — Group construction details and edge cases

**Status: pending.**

Preserve balanced descending-score placement into the lowest-total non-full group, size limit, fewer-members tie-break, topic complementarity and teacher review. R §5.7 also states that a remainder creates an additional group. The exact group initialization and interaction between that remainder rule and greedy placement are not established. Strength-based scoring is given, but a complete multi-group construction algorithm is not.

**Human decision needed:** group count/initialization; remaining ties; minimum group size and singleton leftovers; missing/insufficient data; strength-based optimization/greedy procedure; manual group strategy representation; duplicate membership scope; and edits after approval/activity start. Decide whether topic scores are scoped to the selected class/session.

**Downstream:** `GroupFormationHeuristic`, candidate group records, enrollment filters, teacher editing UI, membership constraints, access, event handoff, examples and tests.

## Q07 — Weak flags, mastery and recommendation threshold boundaries

**Status: pending.**

Evidence: R §5.4 flags two wrong answers on one concept within a quiz. §5.5 classifies aggregated concept accuracy as weak at <= 0.50. The dictionary says `weak_flag` is automatically true when mastery is weak. A learner can have two recent wrong answers while cumulative accuracy remains strong. The recommendation table uses “between 0.50 and 0.70,” which overlaps other rules if endpoints are inclusive.

**Human decision needed:** are quiz weakness and aggregated mastery distinct signals, and how do they affect tutoring/recommendations? Confirm accuracy window, clearing/retention of weakness, precedence, provenance and exact non-overlapping recommendation boundaries. Decide how an unassessed concept is represented when the enum has no unassessed value.

**Downstream:** mastery schema, state reducers, analytics, Tutor Agent selection, Teacher Assistant recommendations, grouping, UI labels, formulas/examples and tests.

## Q08 — Analytics evidence windows and quiz bookkeeping

**Status: pending.**

Preserve weights 1/2/3, two-answer streaks, 0.50/0.70 mastery boundaries, 0.10 trend threshold and three-of-five recurring-mistake rule. These numeric choices are documented; the following implementation details are not.

**Human decision needed:** define comparable quizzes; historical/topic windows; normalized mistake taxonomy; whether repeated instances inside one interaction count separately; what constitutes the five “relevant interactions”; and how many new events warrant progress analysis. Specify zero-attempt/first-result behavior, attempts versus completed quizzes in group scores, quiz length/termination, repeat-attempt policy, ordering/timestamps, streak reset on opposite answers/bounds, rounding and storage precision. Specify priority classification and what “repeated tutoring”/“continued decline after support” means.

**Downstream:** evidence schema, analysis triggers, score calculation, state ownership, dashboards, recommendation rules, tests, evaluation and report examples.

## Q09 — Tutor adaptation and retrieval failure

**Status: pending.**

Preserve three levels, top-three retrieval, explanation/example/check-question structure, one-step decreases and two-correct increases, topic checks, validation and fallback. R §5.3 does not fully define limits and counter reset, weak-concept override precedence, or how asking the “same question” is recognized. Absence of retrieved material is described as indicating a course-material mismatch, but the cause could also be processing failure or insufficient coverage.

**Human decision needed:** exact bounds/reset/override rules; scope/classification thresholds; missing-material behavior and instructor flag workflow; how current quiz-answer protection is enforced; when a check question is optional; history granularity and retention.

**Downstream:** prompts/validation, retrieval, session/context fields, check-question counters, instructor UI, privacy, failure tests and tutoring methodology.

## Q10 — Discussion triggers, problem lifecycle and individual attribution

**Status: pending.**

R §5.8 specifies three minutes of inactivity, five off-topic messages, misconception detection and manual requests; proactive cooldown is five minutes. A use case says “few minutes.” The dictionary has no explicit problem-open state. Group hints are directed to the group, yet progress analysis is learner-oriented.

**Human decision needed:** confirm the precise timing rule across use cases; count student versus AI/teacher messages; define correct-discussion/misconception detection; requested-hint limits; cooldown reset/overlapping-trigger behavior; per-group/per-problem hint sequencing; problem authoring/approval/assignment; and how group evidence affects an individual's analysis without unsupported attribution.

**Downstream:** `HintGenerator`, timers/Redis, problem schema, hint logs, event protocol, Progress Agent evidence, teacher monitoring, prompts and tests.

## Q11 — Collaborative workspace and controlled editing

**Status: pending.**

The architecture names real-time collaborative workspace events, presence, controlled-editing locks and live teacher observation. The report does not fully specify the editable object, editing permissions, lock lifecycle, persistent document state or meaningful-event schema.

**Human decision needed:** define exactly what students edit together and teachers can observe/control; lock ownership/expiry; reconnect/concurrency conflict behavior; event ordering; persistence; completion signals and learner attribution. Distinguish temporary presence from learning evidence. Raw cursor/mouse data is not recorded as learning evidence in §5.5.1.

**Downstream:** UI, WebSocket contracts, Redis, persistence, access control, Discussion/Progress Agent inputs, performance/recovery tests and deployment.

## Q12 — Session, enrollment, quiz assignment and student feedback flows

**Status: pending.**

R §4.6.2 lets a student start/end tutoring, while teachers start/end `LearningSession` and ending it triggers a draft quiz. Membership includes pending/enrolled states without a complete join-review flow. Quiz assignment to selected learners/groups is described but not modeled. Student-facing study suggestions are described separately from teacher-reviewed recommendations without a clear generating owner/review boundary.

**Human decision needed:** distinguish tutoring-session and class-session identity/lifecycle; define enrollment approval; map manual quizzes to sessions; define quiz availability/assignment scope; clarify ownership and approval for personal study suggestions; and whether already-approved group membership can change mid-activity.

**Downstream:** domain/schema, APIs, dashboards, authentication/onboarding, router triggers, teacher-review boundaries, access and use-case tests.

## Q13 — UI prototype scope versus approved features

**Status: pending.**

R Figures 4.1–4.17 include extra controls not fully specified elsewhere: role selection, password hints, optional class code, profile settings, notification preferences/weekly email, appearance and text size, personalization opt-out, quiz hints/exit, calendars, milestones, global search, help/assistant panels and activity pause. Mockups also show subject examples beyond Programming Fundamentals. Figure 4.17 uses a recommendation action label inconsistent with the confirmed terminology.

**Human decision needed:** identify which are current requirements, future options, or illustrative controls. Approve UI wording consistent with **Approve / Dismiss** and **Approve / Edit**. Decide whether mockup subjects should be replaced with pilot examples; determine whether profile-data opt-out is compatible with the assumed learning workflow and retention requirements. Do not infer quiz hints are permitted from a mockup.

**Downstream:** feature scope, schema, APIs, role verification, notifications/email service, consent behavior, assessment integrity, design assets, accessibility and tests.

## Q14 — Providers, storage, retrieval configuration and upload limits

**Status: pending.**

PostgreSQL/Supabase and pgvector are selected. The report alternatively specifies Supabase Storage or compatible storage, and no concrete LLM/embedding model. The dictionary gives 1536 embedding dimensions. Upload validation requires file-size/type limits without values. Retrieval specifies three chunks without chunking/relevance details.

**Human decision needed:** confirm providers/models and storage; approve vector-dimension compatibility, extraction formats, size limits, chunk size/overlap, metadata, similarity acceptance, re-upload/version/deletion behavior, caching and index setup. Identify model-change dependencies before provider replacement.

**Downstream:** storage permissions, processing jobs, schema/indexes, embeddings/re-indexing, query validation, prompts, cost, latency, evaluation and deployment secrets.

## Q15 — Background execution, timeouts, recovery and checkpoints

**Status: pending implementation dependencies.**

The report adopts asynchronous work but defers the mechanism. §5.9 supplies a 20-second LLM timeout and two retries; §6.4.6 discusses broader external AI/embedding failures with a configured timeout. Tutor/hint validation separately permits one regeneration. Checkpoint guarantees/frequency vary in text and diagrams.

**Human decision needed:** select background execution; define retry/backoff and whether timeout covers each attempt; clarify embedding behavior; cap interactions between network retries and content regeneration; define unavailable-agent recovery, pending analysis replay, duplicate prevention, cancellation and UI status. Confirm checkpoint store/frequency alongside Q01; define backup/restore separately from workflow checkpoints.

**Downstream:** job model, API response states, Redis/infrastructure, graph execution, persistence transactions, idempotency, costs, error UI, monitoring and failure tests.

## Q16 — Diagrams and class interfaces need synchronized revision

**Status: discrepancies identified; no diagram edits authorized or performed.**

Figure 6.5, PDF p. 128, places a grouping operation under the wrong agent compared with the settled responsibility boundary. Its supporting classes do not fully match Table 6.2 (`EventRouter` and `GroupFormationHeuristic`). Figure 6.4, PDF p. 125, uses the wrong recommendation review action and combines several workflow/persistence concepts. Figure 5.1 and Figure 6.1 retain ambiguous shared-state labels. Figure 4.18 differs from the candidate dictionary (Q04). The executive summary also needs responsibility alignment.

**Human decision needed:** approve updating the figures and related summaries to the settled five-agent ownership and review actions, but defer state/access/schema changes until their respective decisions. Confirm class method names/signatures instead of treating all pictured methods as final APIs.

**Downstream:** executive summary, requirements, methodology, captions, class/sequence/architecture/ER diagrams, interface contracts and tests. Fixing only a paragraph would leave material contradictions.

## Q17 — Report terminology, claims and editorial consistency

**Status: proposed editorial corrections remain review items unless already covered by explicit decisions.**

The latest accessible review flags:

- Use exact agent/subsystem names and `InSync`; consistent Learning Material and learning session terminology.
- Teacher Assistant **proposes** groups; teacher approval/editing precedes activation.
- Describe backend authentication integration/authorization consistently with Supabase Authentication.
- Avoid claims that a single database contains all files, temporary data and workflow state.
- Replace retrieval “training”/guaranteed-correctness wording with approved grounding language; refer to upload to InSync/storage rather than to an agent.
- Do not claim agents learn from one another merely by recording information or imply retraining during normal use.
- Align the Figure 6.4 caption with **Detailed System Interaction Sequence Diagram**.
- Choose design/ongoing/completed tense based on actual implementation evidence; currently not verified.
- Describe CI checks before merge to main, peer review, validation in consistent academic tense, and teacher-review trade-offs without a guarantee of protection from every error.
- Qualify zero-training, zero-loss/checkpoint, and zero-change extensibility/provider-switching claims.
- Harmonize use-case count (fifteen listed versus sixteen claimed) and inconsistent “Developing / Average” display terminology.
- Resolve §4.10.3's broad “hashing ... other personal information” language rather than interpreting it as an approved data transformation policy.

**Human decision needed:** approve an editorial correction set and confirm which source report should receive it; keep Q01–Q03 out of any blanket approval because the human explicitly deferred them. Research comparisons/market claims and bibliography were not independently source-verified in this handoff task.

**Downstream:** abstract/executive summary, glossary, all affected chapters, captions, examples, diagrams and UI wording. No source document was edited.

## Q18 — Evaluation, reporting, monitoring and operational details

**Status: pending details, not license to invent targets.**

The report commits to usability checks, response-time testing, failure/coordination tests, API cost monitoring, content reporting/teacher monitoring, periodic backups and a feasible limited pilot. It does not establish numerical success criteria, participant counts, a complete evaluation protocol, a content-report data flow, retention/deletion policy, deployment topology or backup schedule.

**Human decision needed:** define the pilot population and topic set, evaluation measures/thresholds, sample-data versus real-user claims, report-content workflow, monitoring scope, operational budget, hosting and recovery expectations. Broad audience does not imply both populations have been tested. Hosted-service pricing/procurement/support remain future context.

**Downstream:** evaluation plan, consent/data handling, feedback UI/schema, logs, deployment, cost estimates, backup configuration, schedule and final report claims.

## Approval record for the next revision

Use issue IDs to avoid ambiguous blanket approval. An answer can approve a specific resolution, keep an issue pending, or provide replacement wording. For each issue, record the affected changes the human approves, not merely the preferred headline decision.

Suggested response structure:

```
Coverage: [provide complete history / accept available-source scope]
Qxx: [decision or keep pending]
Approved dependent changes: [specific areas/files, or handoff only]
Other changes: [details]
```

The master context can be reused as a review draft immediately, with these blocks intact. It must not be promoted into an unconditional implementation specification while unresolved issues apply.
