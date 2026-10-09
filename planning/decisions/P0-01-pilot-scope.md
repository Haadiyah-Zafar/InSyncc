# P0-01: pilot scope, screen inventory, and evaluation baseline

**Issue:** [#2](https://github.com/Haadiyah-Zafar/InSyncc/issues/2)  
**Prepared:** 9 October 2026, Asia/Karachi  
**Status:** Proposed decision package — awaiting explicit human approval.  
**Branch:** `docs/issue-2-pilot-scope`

This package completes the preparation work for issue #2. It does not claim that its recommendations, numerical targets, or sample counts have been approved or implemented. The existing plan approval and the subsequent Yjs/OpenRouter/fallback decisions remain valid.

**Human clarification, 9 October 2026:** the subject will include foundational CS topics such as variables, loops, file handling, data structures, and some database concepts. Initially the shared code editor supports **Python**, and learners will also use a **shared whiteboard**. The human then confirmed **Python execution with displayed output**, **a separate control holder for each surface**, and **a broader first-demo syllabus**. These choices supersede the older narrow-topic proposal and database-content exclusion. Exact syllabus depth, runner technology/limits, board tools, and control handover rules remain pending. Database learning content does not by itself authorize a separate SQL execution interface.

## 1. Decisions requested

| Decision | Recommendation for approval | What approval permits |
|---|---|---|
| D1 — Source coverage | Use the available repository handoff/report, recorded approvals in this project, and current GitHub issues as the working baseline; acknowledge that earlier conversation history is incomplete. | Proceed with the documented scope without claiming an exhaustive reconstruction of all past agreements. Later supplied evidence is reviewed explicitly. |
| D2 — Pilot scope and fixtures | Retain all five agents and the full learning cycle. Honor the human's broader foundational CS content, Python-only initial shared code editor, and shared whiteboard. Python execution/output and separate code/whiteboard control holders are also confirmed. A concrete broader twelve-area syllabus is proposed in §4 for approval. | Define pilot content and fixtures; it does not settle runner implementation/limits, control handover mechanics, quiz length, schema, grouping rules, or real-participant recruitment. |
| D3 — Screens and prototype controls | Adopt the required/deferred/illustrative classifications in §5. | Build the required pilot journeys and omit the specifically deferred extras from this pilot; detailed behavior remains subject to the linked decision issues. |
| D4 — Evaluation baseline | Adopt the procedure, proposed numerical targets, and explicit later-budget gate in §7. | Use these criteria to evaluate the pilot. It does not authorize spending, claim results, or approve unrelated operational choices in #8. |
| D5 — Documentation alignment | Authorize the limited correction set in §8, using an editable correction pack until the report source is supplied. | Align terminology, ownership, examples, captions, and implementation claims; preserve Q01–Q03 and unresolved schema/access/interface decisions. |

The user may approve D1–D5 together, approve individual rows, or request changes. Silence, starting this issue, or committing this draft is not approval. Record the exact response in §10 before closing #2.

## 2. Sources and current approved baseline

Read with [the context](../../INSYNC_CODEX_CONTEXT.md), [the review register](../../INSYNC_REVIEW_REQUIRED.md), [the candidate schema](../../INSYNC_SCHEMA_INVENTORY.md), and [the implementation plan](../IMPLEMENTATION_PLAN.md). Source references below use those files' section numbers and the report sections cited there.

Source limits: the original long conversation is not available in full; the handoff itself declares that limit. This task uses the available handoff, its review register, and current approved amendments. The prototype inventory below covers the controls identified in those sources; it does not claim a fresh visual audit of every PDF diagram. The report's implementation tense is not evidence of working code. The separate ChatGPT login screenshot is not an InSync UI requirement.

The following decisions are already recorded and are **not being reopened**:

- Product name **InSync**; school and university audiences; English web use on desktop/laptop browsers. The subject called Programming Fundamentals now includes broader foundational CS topics per the current clarification, including introductory data structures and database concepts.
- Five agents: **Tutor Agent**, **Quiz Agent**, **Progress Agent**, **Teacher Assistant Agent**, **Discussion Agent**. The teacher dashboard is an interface.
- One React/TypeScript client; one FastAPI backend containing application services and LangGraph modules; Supabase PostgreSQL/pgvector and authentication; FastAPI WebSockets; Redis for temporary real-time state.
- Teacher Assistant Agent owns group proposals. Teacher actions are **Approve / Dismiss** for recommendations and **Approve / Edit** for group proposals. Pending/dismissed recommendations cause no automatic learning activity.
- AI quiz questions require review; newly generated questions during an attempt require **additional teacher approval**.
- **Yjs** is selected for shared-document synchronization. A shared **Python code editor and whiteboard** are now confirmed; execution with output and separate control holders are confirmed; exact handover, synchronization, persistence, contracts remain in [#7](https://github.com/Haadiyah-Zafar/InSyncc/issues/7), with runner infrastructure/limits in #8.
- **OpenRouter** is selected as the initial text-generation gateway. A ranked, tested **10–15 distinct generation-model chain** is required. Exact models/routes, budgets, and embedding choices remain in [#8](https://github.com/Haadiyah-Zafar/InSyncc/issues/8).
- The schema inventory is still a candidate. Q01–Q03 and the remaining unresolved design questions are not implicitly approved by this package.

## 3. Pilot scope checklist

These are required capability groups for the proposed pilot; linked unresolved details must be decided before implementation. All are planned, not completed.

- [ ] Identity and class access: login, approved onboarding/account recovery, teacher-owned classes, enrollment, topics/concepts, and role-specific navigation.
- [ ] Teacher Learning Material upload, validation, processing status, authorized access, and source-traceable retrieval.
- [ ] Teacher learning-session start/end and the separately defined student tutoring lifecycle.
- [ ] Tutor Agent explanations, worked examples, check questions, adaptation, evidence/history, and understandable no-material/provider-failure behavior.
- [ ] Manual and AI draft quizzes; teacher review/assignment; adaptive attempts, durable answers/results, and additional in-attempt question review.
- [ ] Progress Agent analysis with approved no-data behavior, mastery/trend/mistake rules, and personal/class evidence views.
- [ ] Teacher Assistant recommendations with evidence and review, followed by approved execution and further evidence collection.
- [ ] Teacher-requested balanced and strength-based group proposals, manual grouping, membership editing, and activation after approval.
- [ ] Approved-group discussion problems, persistent chat, a Python-only shared code editor with execution/output and a shared whiteboard, separate editing-control holders per surface, presence, reconnect/recovery, and authorized teacher observation. Integrate approved shared-state synchronization with Yjs.
- [ ] Discussion Agent requested/proactive hints with answer protection, approved timing, and traceable collaboration evidence.
- [ ] Content reporting, collection notices/data controls, operational visibility, and recovery under the policies subsequently approved in #8.
- [ ] The complete tested demo, model fallback qualification, browser/accessibility checks, and reproducible setup/restore evidence.

The intermediate individual-learning demo at P5 does not remove P6 collaboration or P7 evaluation from final pilot scope. The three-person team can work concurrently according to issue prerequisites.

Keep the current exclusions: mobile app, unrelated non-CS subject evaluation, external student-information-system integration, emotion/sensor monitoring, and model training/fine-tuning on course files. The current clarification expands learning content into foundational CS, including database concepts. Python execution/output and the whiteboard are included, with one control holder per surface. A separate SQL runtime, additional executable languages, unrestricted editing by everyone, or arbitrary host/network access are not implied.

## 4. Proposed topic and synthetic-data plan

**All counts below are proposed development/evaluation fixtures, not actual participants or completed outcomes.** The human selected Python as the only initially editable code language and broadened the learning content. The user chose a broader first-demo syllabus. The following twelve-area proposal makes that request concrete for review; it is not an approved exhaustive definition of “every fundamental CS subject.”

| Pilot topic | Two proposed concept units | Representative exercises |
|---|---|---|
| Variables | Assignment/value updates; basic types/operators | Trace Python variable changes and explain type/value mistakes. |
| Loops | Iteration/state updates; termination/bounds | Trace Python iterations and identify an off-by-one error. |
| File handling | Reading/writing; modes and resource handling | Explain Python file operations and trace an example using synthetic files. Run approved examples against isolated per-run synthetic files; do not expose the application host filesystem. |
| Introductory data structures | Lists/sequences; dictionaries/key-value lookup | Compare storage choices and trace Python access/update examples. Exact depth is pending. |
| Basic database concepts | Tables/rows/keys; relationships and simple query concepts | Explain data organization and sketch a relationship on the whiteboard. No SQL execution interface is selected. |
| Conditionals | Boolean logic; branch selection | Run Python branches and reason about boundary values. |
| Functions and modularity | Parameters/return values; decomposition | Edit/run Python functions and discuss interfaces on the board. |
| Recursion | Base case; recursive step | Trace a small recursive function; runner limits handle runaway examples. |
| Object-oriented basics | Classes/objects; methods/state | Edit a simple Python class and sketch object relationships. |
| Algorithms and efficiency | Search/sort examples; basic complexity | Compare simple Python algorithms and annotate their steps. |
| Sets and mappings | Membership/uniqueness; key-value operations | Choose between Python list/set/dictionary representations. |
| Relational querying and design | Simple queries/joins; introductory normalization | Discuss read-only query examples and diagram relationships; no separate SQL runtime is inferred. |

The twelve areas are a proposed broader first-demo syllabus, not a hard-coded limit on teacher-created topics. Confirm the desired depth and whether operating systems, networking, or computer architecture must also be included in the first demo. Those subjects have not been silently added or excluded from the final syllabus; the exact list needs D2 approval.

Recommended fixtures after the relevant schema/content decisions:

- **Two synthetic teachers, two isolated classes, and twelve synthetic students** (six per class). This is enough for positive/negative access scenarios and two three-person group examples per class. The group size is a chosen test input, not a global grouping rule.
- **Twelve source materials**, one per proposed area, plus a deliberately inaccessible foreign-class material for retrieval-isolation checks. Formats and size limits follow #8; editable code examples use Python.
- **Twenty-four concept units** and **144 reviewed candidate questions**: two questions per concept per Easy/Medium/Hard level. These are bank fixtures, not a 144-question attempt requirement. Tagging of multi-concept questions follows #5/#9.
- **Twelve discussion problems** with teacher-only reference solutions and expected hint boundaries, one per area. Include Python-editing and whiteboard reasoning cases; problem lifecycle, board tools, and assignment follow #7/#9.
- Synthetic evidence scenarios for a new learner, improving learner, declining learner, recurring misconception, weak/recent versus strong/historical evidence, no assessment data, and missing grouping data. Approve expected results under #5/#6 before turning them into seed records.
- Controlled scenarios for exhausted question bank, no teacher response, rejected review, missing material, model rate limiting, unavailable providers, stale editor control, and reconnect. No real service quota is intentionally exhausted.

The same functional journeys should support both intended audiences; this does not assert age-specific pedagogy or that either population has been evaluated. Use synthetic data for initial demonstrations. Any real-participant study, especially involving school learners, needs a separately approved participant/consent/data protocol in #8/#57. Do not recruit or upload real learner records from this approval alone.

## 5. Screens and prototype-only controls

### Required pilot screen families

| Screen family | Required experience | Detailed contract owner |
|---|---|---|
| Account/access | Login, logout, recovery, the approved onboarding flow, role routing, and expired/denied-session feedback | #4; implementation #21/#22 |
| Teacher class/topic/session | Create/update/archive classes; enrollment management as approved; topics/concepts; session start/end | #4/#5/#10; #23–#25 |
| Student class/session | Join/list/detail, active learning entry, and absent enrollment/session states | #4/#5/#10; #22/#25 |
| Teacher materials | Upload/list, processing/ready/failed states, permitted retry and access | #8/#10; #27/#28/#31 |
| Student tutoring | History/question/check-answer flow, explanatory output, failure/clarification states | #6/#10; #30/#32 |
| Teacher quiz | Manual authoring, AI draft review, question edit/remove, approve/assign, additional question review | #5/#10; #33/#35/#37 |
| Student quiz/results | Approved-quiz entry, answer/next/result flow, additional-review and recovery states as approved | #5/#10; #36/#38 |
| Progress/class performance | Personal evidence and approved feedback; teacher learner/topic filters; insufficient-data states | #6/#10; #39/#40/#42 |
| Teacher recommendations | Evidence, priority, Approve/Dismiss, pending/reviewed/execution states | #6/#10; #40/#41/#43 |
| Teacher groups/problems | Strategy/size selection, manual groups, proposal editing/approval, approved problem management | #7/#10; #45–#48 |
| Student workspace/teacher observation | Approved-group entry, problem/chat/Python editor/Run/output/shared whiteboard, per-surface edit-control feedback, hint request, connection states | #7/#10; #49–#53 |
| Content reporting/data notices | Report wrong/inappropriate output; authorized review; approved collection/data-control information | #8/#10; #54 |

These are screen families, not fixed routes or a count of pages to implement. #10 defines precise navigation and payloads.

### Proposed classification of controls identified in the handoff

**Required** means include in the pilot after the linked contract is approved. **Deferred** means leave the extra feature out of this pilot if D3 is accepted. **Illustrative** means the prototype text/data does not define behavior.

| Control/detail | Proposed classification | Rationale and boundary |
|---|---|---|
| Signup/onboarding entry | Required, contract pending #4 | Users need the approved account-entry path; this does not choose public signup or teacher verification. |
| Self-selected teacher role granting immediate privilege | Deferred as depicted; role workflow pending #4 | A role selector is not permission to grant teacher access. #4 must define verification and whether role requests appear. |
| Optional class code on the signup form | Deferred placement | Class joining remains required through the approved enrollment flow; signup-field placement need not be adopted. |
| Eight-character/numeric password hint | Illustrative | Do not turn mockup text into a password policy. Follow the approved authentication policy. |
| Profile-editing controls | Deferred | Not needed to demonstrate the complete learning cycle; approved onboarding identity data remains required. |
| General settings page | Deferred except required account/data actions | Logout and approved notices/data actions stay accessible; no broad settings module is implied. |
| Notification preferences/toggles | Deferred | Do not introduce a notification subsystem from mockup controls. Necessary in-app review/status feedback remains required. |
| Weekly email summaries | Deferred | Avoid adding email scheduling/content/consent scope to the initial pilot. Account-recovery messages are separate. |
| Theme/appearance preferences | Deferred | Readable contrast and usable default styling remain required. |
| Application text-size preference | Deferred | Browser zoom, readable text, and keyboard accessibility remain required. |
| Personalization opt-out switch | Deferred pending #8 policy | Do not add a nonfunctional toggle or infer it settles consent/retention. Required collection notices and approved data controls stay in scope. |
| Quiz hint button | Deferred | Group hints and Tutor check questions remain required; assessment hint policy cannot be inferred from a mockup. |
| Quiz exit/resume buttons | Defer final controls to #5 | Durable answers and defined interruption/recovery remain required; no silent deletion, extra attempt, or fallback is authorized. |
| Class activity pause | Deferred | Teacher learning-session start/end remain required; pause adds a separate lifecycle state. |
| Milestone badges | Deferred | Do not add achievement logic without an approved definition. |
| Sample course-progress percentages | Illustrative | Display only defined, evidence-backed measures; approved quiz/progress metrics remain required. |
| Calendar | Deferred | Scheduling/reminders are not needed for the current session-driven demo. |
| Global search | Deferred | Required class/learner/topic filtering remains in scope. |
| Generic AI assistant/help panel | Deferred | The five named agents remain the AI interfaces. Basic instructions/error guidance are required. |
| Subject labels outside the final approved CS syllabus | Illustrative; replace in pilot examples | Database and data-structure content are now included by the human; use the approved first-demo boundary when selected. |
| Example learner names, dates, scores, and progress values | Illustrative | Synthetic fixtures must be labeled and cannot be cited as evaluation results. |
| Recommendation action inconsistent with Approve/Dismiss | Illustrative error to correct | Use the already agreed Approve/Dismiss contract. |
| Group Approve/Edit and membership editor | Required | This is the teacher-controlled group workflow, not recommendation editing. |
| Group hint button | Required | It is a documented trigger for Discussion Agent support. |
| Shared Python editor, editing-control indication, reconnect feedback | Required, handover/runner details pending #7/#8 | Python editing/execution/output and separate surface control holders are confirmed; grants, transfer, runner limits, and offline rules need their decision. |
| Shared whiteboard | Required, tool/control policy pending #7 | Separate whiteboard and code control holders are confirmed. Define drawing/text/erase tools, shared objects, persistence, permissions, and handover. Its presence does not select a particular board library. |
| Live teacher observation | Required, access/control details pending #4/#7 | Do not add arbitrary teacher editing powers from the word “monitor.” |
| AI-generated-content labels | Required for generated content | How deterministic agent outputs are described remains Q02/#6. |

Approval of D3 adopts these scope recommendations only. It does not close Q03/Q05/Q10/Q11/Q12/Q14/Q18 or choose API/schema details.

## 6. Fifteen-use-case traceability

IDs below follow the report's listed use cases; the reported count of sixteen is a documentation inconsistency, not a missing feature to invent. Each proposed acceptance path includes the relevant failure/access checks from its implementation issue.

| Use case | Pilot acceptance scenario | Implementation issues | Integration evidence |
|---|---|---|---|
| UC01 — Log in | Valid user reaches the correct role view; invalid/expired credentials and unauthorized access fail clearly | #21, #22 | #26, #56 |
| UC02 — Attend AI tutoring | Authorized student receives material-grounded help and persists check-question evidence; no-material/provider failure is explicit | #29, #30, #32 | #44, #57 |
| UC03 — Adaptive quiz | Student attempts only assigned/approved questions, sees adaptation/results, and respects additional question approval | #34, #35, #36, #38 | #44, #56 |
| UC04 — Personal progress | Stored evidence produces understandable measures; absent evidence is not labeled weak | #39, #42 | #44 |
| UC05 — Feedback/study recommendations | Personal feedback follows the owner/review policy approved in #6; evidence and limits are visible | #40, #42 | #44, #57 |
| UC06 — Join workspace | Student enters only their approved group; no group/proposed-only/foreign group is handled correctly | #47, #50, #52 | #53, #56 |
| UC07 — Group chat | Authorized clients exchange persisted messages and recover history after reconnect | #49, #52 | #53 |
| UC08 — AI-guided group hints | Requested/qualifying proactive hints obey approved timing and never expose the hidden solution or private weakness | #51, #52 | #53, #57 |
| UC09 — Class dashboard | Owning teacher filters learner/topic performance; unrelated class data is denied | #25, #42 | #44, #56 |
| UC10 — Review AI recommendation | Evidence is reviewable; approval routes the action, while pending/dismissed decisions cause no activity | #40, #41, #43 | #44, #56 |
| UC11 — Upload material | Teacher uploads an allowed file; processing status and authorized source retrieval work; invalid input fails | #27, #28, #31 | #32, #56 |
| UC12 — Create/assign quiz | Manual and AI draft paths work; approval/version/assignment rules control student availability | #33, #35, #37 | #38, #44 |
| UC13 — Manage study groups | Teacher requests either strategy or creates manually, edits, and approves valid membership before access | #45, #46, #47, #48 | #53 |
| UC14 — Manage class | Owner creates/updates/archive-confirms a class and retains its records under approved enrollment rules | #23, #25 | #26, #56 |
| UC15 — Start/end learning session | Authorized teacher starts a valid topic and ends once; one logical draft-generation flow follows | #24, #25, #35 | #26, #44 |

Shared Python editing and whiteboard behavior are verified within UC06/UC07 and #50/#52/#53; neither is omitted because the original use-case list lacks separate rows. Board tools/control/persistence are detailed in #7/#9/#10. Executable Python is now required. Its distinct runtime work item and additional acceptance checks are proposed in §9.1 before implementation. Operational/model fallback requirements cross-cut these cases through #18/#55–#59/#61.

## 7. Proposed evaluation baseline

**Everything in this section is a proposed evaluation design, not a measured result or already approved service-level agreement.** Approval of D4 sets pilot acceptance criteria; it does not authorize model spending or implementation of unresolved state/access rules.

### Procedure and sample definitions

1. Freeze an evaluation revision: commit, approved decision IDs, model/provider IDs and routing, prompts, material/question fixtures, environment, load, and run date.
2. Run deterministic contract/algorithm/access/failure tests using approved expected outcomes and controlled clocks/providers. Report passed/failed/skipped separately.
3. Execute all fifteen use-case journeys and the integrated individual and collaboration flows on the two-class synthetic dataset. Record request/evidence IDs and teacher decisions.
4. Run **twenty-four paired coordination scenarios**, two per proposed area, comparing the same task with a defined prior-evidence fixture versus its cold-start/control fixture. This is an evaluation harness, not a new product toggle. Keep task/material/model configuration aligned and record unavoidable stochastic differences. Assess appropriate use of evidence and traceability, not causal proof of learning improvement. Adjust the count explicitly if the approved syllabus differs.
5. Qualify each of the 10–15 text-model candidates on its eligible operations with at least **three fixed cases per eligible operation**: ordinary task, ambiguity/insufficient evidence, and an operation-specific boundary/protection case. Record every raw outcome, including invalid outputs and fallback use. The baseline call count is `sum(3 × eligible operation count per model)` before retries/embeddings; approve its priced budget in #8 before live runs.
6. Have the **three team members** perform an internal usability walkthrough of ten scripted tasks each, using brief documented instructions. These are proposed internal reviewers, not recruited student/teacher participants. Tasks: teacher class/enrollment, material/session, quiz review, recommendation review, group review; student join, tutoring, quiz/results, progress, workspace/hint.
7. Run load/browser/reconnect checks using **14 simulated authenticated sessions** (12 students and two teachers), with **100 ordinary API operations** and **100 permitted chat/editor updates** per measured run. Report network/hosting conditions, cold starts, errors, and sample sizes. Run timing only on implemented applicable operations, not a placeholder health endpoint.
8. Before a scheduled demo, repeat secure access checks and representative live calls across the configured chain. Simulate primary/multiple-provider failures and full exhaustion locally without consuming real quotas deliberately.

### Proposed success measures

| Dimension | Proposed acceptance target | Measurement and owner |
|---|---|---|
| Functional scope | All 15 use-case journeys and both integrated learning cycles pass; no required path silently skipped | #26/#44/#53/#61; attach actual run evidence and unresolved failures. |
| Teacher control and isolation | Zero observed unauthorized disclosures/actions, unapproved question deliveries, or duplicate approved side effects in the defined test matrix | #56; failure blocks acceptance regardless of other scores. This is a test result, not a universal security guarantee. |
| Coordination | All twenty-four proposed paired scenarios retain correct producer provenance and show the approved evidence-sensitive behavior; all tested pending/dismissed decisions create no activity | #44/#53/#57; explain expected behavior from #3/#6/#7 rather than assuming a specific outcome here. |
| AI educational quality | Each candidate/eligible-operation set averages at least **1.5/2** on the rubric below, with no critical answer leak, unsafe action, materially incorrect accepted answer, or missing teacher gate in tested cases | #57; quality-failing candidates are not working fallbacks. Fix/replace and requalify through #8/#18. |
| Structured output | Every accepted/stored output passes its required schema/content checks; invalid attempts are counted and never silently stored as success | #18/#57; report first-attempt validity separately from eventual success and unavailable outcomes. |
| Internal usability | Each of three team reviewers completes at least **9 of 10** tasks without another developer performing the task for them; all core teacher-review/access tasks must succeed | #57/#58; record guidance, errors, task times, and familiarity bias. No claim of external user validation. |
| Ordinary backend latency | **p95 ≤ 2 seconds** for the defined authenticated, non-AI request mix under 14 simulated sessions | #58; nearest-rank p95 over 100 operations, with error/timeout counts reported separately. |
| Chat/editor propagation | **p95 ≤ 1 second** for permitted updates appearing in another authorized client under the same test load | #50/#53/#58; measure receiver-visible propagation, not only an acknowledgement to the sender. |
| Interactive AI response | **p95 ≤ 30 seconds** for a complete validated ordinary response without failover; fallback requests must return a valid result or explicit unavailable state within a proposed **60-second total deadline** | #8/#18/#58; test at least 20 representative ordinary requests on the primary route, report all failures separately; the deadline is a proposed constraint for the later retry policy. |
| Teacher-review delay | Measure creation→decision and decision→dispatch separately, reporting actual median/range and pending counts; do not impose an automatic teacher-response deadline | #55/#57; waiting must not trigger an unapproved action. |
| Model-chain readiness | All 10–15 selected candidates have dated live qualification for their eligible operations; tested transient failures reach a valid survivor when available, while full exhaustion is bounded and explicit | #18/#55–#57/#61; platform/account shared-failure limits remain disclosed. |
| Cost | Record all model/embedding attempts, retries, total and per-journey cost; actual spend must remain within a **human-approved numeric budget set in #8 before live evaluation** | #8/#55/#57; no dollar allowance, free-tier availability, or unlimited retry spending is invented by this issue. Unknown pricing blocks a budget claim. |
| Accessibility/browser behavior | Required journeys work in Chrome, Edge, and Firefox with keyboard operation, visible focus, labels, readable contrast, and no color-only essential meaning | #58; record actual versions and checks; do not claim certification. |
| Recovery | All selected duplicate/restart/reconnect/control-revocation scenarios preserve records and match the recovery contract approved in #3/#7/#8 | #56/#59; do not promise zero data loss without that demonstrated contract. |

The timing/load values are recommendations for a modest demo, not facts from the original report. If the human prefers different targets, replace them explicitly before closing #2. Long material-ingestion/batch-analysis deadlines and deployment resource targets remain in #8; ordinary requests must remain usable during those jobs. If the 60-second interactive budget conflicts with the report's 20-second/two-retry language, #8 must approve the precise combined policy rather than multiplying retries across 15 models.

Quality rubric per applicable output: **0 = unacceptable**, **1 = usable with a substantive correction**, **2 = meets the expected answer/behavior**. Score correctness, support from supplied material/evidence, task relevance, explanation usefulness, and operation-specific constraints. Mark genuinely inapplicable dimensions with a reason, not an automatic pass. Use a second team reviewer for a critical failure or disputed score; report that these are internal educational judgments. A refusal/unavailable result is not scored as a successful answer and its frequency is reported separately.

A candidate operation set needs at least one successful validated ordinary answer and no hidden removal of failed cases to meet the proposed readiness gate. Small samples provide a reproducible initial screen, not statistical proof of reliability. Real learner-outcome improvements or superiority over other systems require a separately approved study; the paired scenarios demonstrate software coordination only.

## 8. Proposed documentation correction authorization

The task has not edited the report, its figures, the candidate schema, or the master review register. The only available report source is a PDF. Recommend authorizing a Markdown replacement-text/figure change pack first, with application to the editable report source later under #60 after that source is provided.

| Correction set | Concrete proposed change | Boundary / dependent work |
|---|---|---|
| C1 — Names and ownership | Use InSync and the five exact agent names; state that Teacher Assistant Agent proposes groups and Discussion Agent provides group hints | Executive summary, responsibility tables, affected Figure 6.5 ownership; retain unresolved method signatures for #10. |
| C2 — Teacher review | Use Approve/Dismiss for recommendations and Approve/Edit for proposed groups; show activation/execution only after approval | Figure 6.4, captions, UI examples, requirements; no implicit resolution of in-attempt quiz waiting in #5. |
| C3 — Retrieval and storage language | Replace claims of training on uploads/guaranteed correctness with retrieval-grounded generation; distinguish relational/vector persistence, original file storage, temporary Redis state, and approved checkpoints | Storage/provider details remain #8; state meaning remains #3. |
| C4 — Evidence and claims | Replace unsupported completed/evaluated/zero-loss/zero-training/zero-change claims with wording tied to actual implementation/test evidence | No invented research outcomes or rewritten bibliography claims. |
| C5 — Examples and counts | Align demo examples with the approved foundational CS syllabus and Python editor; identify synthetic data; correct the listed use-case count to fifteen; use the Figure 6.4 caption “Detailed System Interaction Sequence Diagram” | Whiteboard/editor details follow #7; do not invent another use case merely to match an incorrect count. |
| C6 — Cross-document consistency | Track changes to approved terminology in requirements, methodology, captions, and tests together | “Developing / Average,” broad personal-data hashing wording, Q01–Q03, canonical ER/schema, and class signatures remain with their own decisions; do not blanket-correct them here. |

Approval of D5 authorizes C1–C6 within these limits. It does not approve editing unrelated research comparisons, deleting unresolved questions, promoting the schema to final, or silently changing diagram semantics outside settled ownership/review actions.

## 9. Boundaries, downstream work, and issue acceptance mapping

| Issue #2 acceptance requirement | Prepared evidence | Remaining requirement |
|---|---|---|
| Approved scope checklist and available-source coverage | D1–D3; §§2–5 | Human acceptance of coverage, exact broader syllabus/fixtures, and remaining control classifications; Python and per-surface control-holder choices are already confirmed. |
| Approved measures distinguishing usability, quality, time, cost, and coordination | D4; §7 | Human approval/revision of proposed targets and explicit recognition of the later numeric budget gate in #8; no runtime results are claimed. |
| Fifteen-use-case mapping including teacher delay and shared evidence | §6 and paired-scenario/delay measures in §7 | Human review of the mapping; implementation/testing occurs in linked issues. |

After approval, record the decision and update the issue/plan's scope references. #11 can then begin once issue #2's acceptance/closure is recorded. Approving this issue alone does not unblock canonical schema/API work waiting on #3–#8, or authorize implementing disputed requirements.

Still pending elsewhere: learner/workflow state (#3), identity/access/enrollment (#4), quiz lifecycle (#5), tutor/analytics/LLM-operation semantics (#6), grouping/Yjs/control/hint semantics (#7), service/model/storage/background/data/operational choices (#8), schema (#9), and exact interface/navigation contracts (#10). Q13, Q16, Q17, and Q18 are only partially addressed by this package; they are not globally marked resolved.

### 9.1 Required scope propagation and proposed runtime issue

The user-approved changes affect #7 (surface/control behavior), #8 (runner infrastructure and limits), #9 (surface/run persistence), #10 (editor/board/run contracts), #20 (two-surface compatibility proof), #50/#52 (backend/frontend), #51/#53 (agent inputs and collaboration tests), and #56–#59 (isolation, content, performance, and deployment). Existing shared-state/access decision work in #3/#4 must account for these surfaces without reopening unrelated decisions.

Propose adding **P6-10 — Implement isolated Python execution and run results** as a distinct backend/runtime issue. It has no GitHub number yet; do not mistake this proposal for a published or completed task.

- **Owner:** backend/runtime workstream B; A owns Run/output integration in #52; C reviews learning-event attribution and fault tests.
- **Start prerequisites:** approved runner/control/access/API decisions in #4/#7/#8/#9/#10; backend/service/job foundations #12/#14/#19; group/problem authorization #47 and document identity/version contract #50. The implementation must not wait for the completed frontend it will unblock.
- **Completion dependents:** #52 integrates real Run/output; #53 verifies the combined collaboration journey; #56/#58/#59 validate isolation, performance, and deployment. Preserve the existing issue dependencies when this additive issue is approved.
- **Scope:** take an authorized Python source snapshot tied to a group/problem/document revision; execute in the approved isolated runtime; return bounded stdout/stderr/status and handle failure, timeout, cancellation, and duplicate requests. The backend application process itself is not the untrusted-code execution environment.
- **Required protections to specify in #8:** separate credentials and files from learner code; bounded CPU/memory/wall time/process count/output/storage; approved network policy; cleanup and cross-run/group isolation. File-handling exercises need isolated temporary files and approved input/output handling. Exact numeric limits, Python version, package policy, interactive input, runtime provider, and run-history retention are pending decisions.
- **Permissions to specify in #7/#4:** whether only the code-control holder or other group members may run, who may cancel/view output, whether control changes affect an in-flight run, and how concurrent run requests are queued/rejected. Separate editing-control holders alone do not answer these questions.
- **Acceptance:** valid Python displays correct output; syntax/runtime errors display appropriately; infinite-loop/excessive-output/resource cases terminate within approved limits; a foreign group and a revoked permission cannot access source/results; no host credentials/files or unintended network access are exposed; reruns/retries cannot duplicate learning records; output is tied to the exact source revision.
- **Whiteboard acceptance additions:** each surface enforces its own control holder; two different learners can control the two surfaces concurrently; neither control grant authorizes editing the other surface; edits synchronize/persist/reconstruct; stale/revoked grants and reconnect are tested. Board tool set and grant/transfer/expiry/teacher-override policy remain #7 decisions.

Approval of this propagation proposal permits the additive issue and those updates to existing issue descriptions. It does not select the runtime or settle the pending permission/resource policies. The existing 60-issue count remains accurate until the additional issue is actually published.

## 10. Approval record

| Item | Status | Exact human decision / date |
|---|---|---|
| D1 — available-source coverage | Awaiting approval | — |
| Broader foundational CS content, Python editor, shared whiteboard | Confirmed clarification | Human statement, 9 October 2026: include variables, loops, file handling, data structures and some DB concepts; initial code editor access only for Python, with shared code and whiteboard editing. |
| D2 — exact broader syllabus and synthetic fixtures | Awaiting approval | The human chose a broader syllabus; the twelve-area list and counts are recommendations awaiting approval. |
| Python execution and displayed output | Confirmed | Human answer, 9 October 2026: “Execute Python and display output.” |
| Editing control across code and whiteboard | Confirmed | Human answer, 9 October 2026: “Separate control holder for each surface.” |
| D3 — screen/control classification | Awaiting approval | — |
| D4 — evaluation design/targets and later #8 budget gate | Awaiting approval | — |
| D5 — limited correction-pack authorization | Awaiting approval | — |
| Additive runtime issue and affected backlog updates (§9.1) | Awaiting approval | Python execution is already required; this row reviews its concrete task breakdown and propagation. |

Suggested response: “Approve D1–D5 and the runtime issue/backlog updates in §9.1 for issue #2,” or list the specific changes/rows to keep pending. A broad approval of this package does not override the explicitly excluded decisions above. Do not close #2 or label dependent work Ready until the required decisions are recorded.
