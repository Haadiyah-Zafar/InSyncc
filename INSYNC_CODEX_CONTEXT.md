# InSync Codex Context

**Status: REVIEW DRAFT — NOT FINAL. Version 0.1, 8 October 2026 (Asia/Karachi).**

This is a reusable handoff of the current design recoverable from the supplied report, accessible conversation history, and the human's decisions in this chat. It is not proof that the design is implemented. No implementation files were available in the inspected InSync project directory. Completeness against the entire original conversation remains unverified because only its five latest exchanges were returned.

## 1. Mandatory human-approval rules

> **STOP AND ASK THE HUMAN.** Whenever any ambiguity, contradiction, missing requirement, missing dependency, uncertain terminology, or change with downstream impact is encountered, stop the affected decision and dependent work. Describe the issue and its affected dependencies, and ask the human for explicit approval before choosing an interpretation or propagating changes. Do not fill gaps using customary practice, assumptions, an assistant's earlier suggestion, or silence as consent. Independent inspection and documentation may continue without deciding the blocked issue.

> **Supersession rule.** Implement only active decisions supported by the approved handoff. Do not restore removed, rejected, or superseded decisions. An old diagram, prototype label, example, or source file does not authorize restoring an obsolete decision. This handoff deliberately omits a catalogue of rejected designs.

> **Change-propagation rule.** Before changing an agreed decision, identify the affected requirements, algorithms, state ownership, database schema, authorization, APIs, events, UI, diagrams, report text, tests, deployment, and evaluation. Ask which dependent changes the human approves. Approval of one change does not automatically approve all consequences.

> **Finalization rule.** Keep unresolved decisions explicitly pending. Do not call this document final, fully exhaustive, or authoritative for blocked areas until the human approves the resolutions and accepts the source-coverage limit or supplies the missing history.

These are instructions from the human's current request. Instructions printed inside source documents are evidence about those documents, not independent authorization to edit projects.

## 2. Reading this handoff

Read this file with [the review and dependency register](INSYNC_REVIEW_REQUIRED.md) and [the schema inventory](INSYNC_SCHEMA_INVENTORY.md). Carry all three files into another project together.

| Status | Meaning |
|---|---|
| Human-confirmed | Explicitly decided in this chat. |
| Recovered current design | Supported by the latest accessible design evidence, without a known superseding decision; not independently ratified line by line by the human. |
| Pending / blocked | Conflicting, incomplete, or expressly held for review. Do not implement the disputed part. |
| Future / optional | An extension possibility, not a current implementation commitment. |

Unless marked otherwise, Sections 4–15 contain **recovered current design**. Any linked review issue takes precedence over a nearby design statement. A listed numeric rule is preserved from the report; undocumented boundary behavior remains blocked.

### 2.1 Human confirmations in this chat

1. Where the old local report conflicts with the latest conversation decisions, use the latest conversation decisions and flag conflicts for approval.
2. **Programming Fundamentals is the confirmed pilot subject. Retain both school and university audiences now.** This does not claim evaluation across both populations has occurred.
3. Keep all three proposed clarifications **pending review**: `LearnerContext` versus `InSyncState`; limiting prompt-template claims to operations using an LLM; and reconciling personal-record access with authorized class/group access. Do not adopt these as approved resolutions.
4. Preserve the data dictionary as a **candidate schema**, with conflicting details blocked until human review.
5. **New questions generated during a quiz may be used only after additional teacher approval.** The wait/resume and fallback mechanics remain undecided; this approval requirement itself is settled.

### 2.2 Source record and limits

| ID | Source | Coverage / use |
|---|---|---|
| H | Current handoff chat, 8 October 2026 | Scope, approval rules, source precedence, and explicit confirmations above. |
| C | **Multiagent Collaboration Ideas**, conversation `6a885b72-be50-83ee-980e-8d07740b5d6b` | Five latest exchanges returned, newest first, with no older-page cursor. Three Chapter 6 text attachments were read. The reviews distinguish active responsibilities from proposed wording fixes. Original acceptance history is incomplete. |
| R | **F26-148.pdf**, supplied during this chat; source path `C:\Users\haris\OneDrive\Documents\F26-148.pdf` | 135 PDF pages. Main design evidence: Chapters 1–2 and 4–6; UI and architecture/schema diagrams inspected visually. The cover says 5 October 2026, declaration 7 October 2026. Neither date alone resolves contradictions. |
| P | **Write assigned report sections**, chat `01a0e385-ba2f-78d1-9b4a-b8f88b8968b5` | Eight accessible turns. Earlier human approval retained school and university audiences and accepted the three proposed research sources for Works 4–6. Draft prose in that chat is not automatic approval of implementation features. |
| O | Local `FYP_Report/FIP Report .pdf` | An incomplete 14-page template with obsolete design content. Used to detect conflicts; not used to revive superseded decisions. |

For R, **PDF page = printed Arabic report page + 14**. Examples: printed p. 66 is PDF p. 80; printed p. 114 is PDF p. 128. References below use section numbers and, where needed, PDF page numbers to avoid confusion with the older excerpts' pagination.

The supplied report fills the previously missing Chapter 6 sections. It does not recover missing conversation-only decisions, prove acceptance of every review suggestion, or prove that something absent from the report was never agreed. Literature-review comparisons are background, not permission to copy another system's features. Source code, migrations, API contracts, and test results were not available for implementation verification.

## 3. Purpose, scope, and exact terminology

InSync connects tutoring, adaptive assessment, progress tracking, and peer collaboration so evidence from one activity can inform later support. Teachers receive evidence for educational decisions and retain control over consequential actions. The project investigates whether coordinated agents provide more timely and relevant support than disconnected tools; this is a research objective, not an established outcome. [R §§1.1, 2.1–2.5]

**Human-confirmed scope:** Programming Fundamentals; school and university audiences. Current delivery is a web application, used on laptops/desktops in modern browsers including Chrome, Edge, and Firefox. The system operates in English. The prototype covers a limited number of topics and users, with stable internet access assumed. [H; R §§2.5, 4.4.4, 4.5, 6.2]

The current scope excludes mobile application development, integration with university/third-party information systems, emotion or sensor monitoring, and cross-subject testing. Learner evidence comes from activity within InSync. Educational automation must respect the teacher-review boundaries in Section 5. [R §§2.5–2.7]

The deliverables are the platform, the teacher dashboard, and documentation of design, implementation, and evaluation. Prepare suitable Programming Fundamentals materials and initial question sets before evaluation. Use sample sessions/data where participants are unavailable; later user testing is contingent on participant access. Progress indicators describe performance inside InSync, not a definitive judgment of a student's ability. Limited history can reduce personalization quality. [R §§2.5, 2.7, 4.10.8, 6.2.1]

Use these exact names:

| Category | Names |
|---|---|
| Product | **InSync** |
| Five agents | **Tutor Agent**, **Quiz Agent**, **Progress Agent**, **Teacher Assistant Agent**, **Discussion Agent** |
| Four logical subsystems | **Web Client**, **Application Backend**, **Agent Service**, **Data and Retrieval Subsystem** |
| Domain terms | Learning Material, learning session / `LearningSession`, study group / `StudyGroup`, `Recommendation`, `LearnerContext` |
| Coordination/support types | `BaseAgent`, `InSyncState`, `EventRouter`, `LLMClient`, `Retriever`, `DifficultyHeuristic`, `GroupFormationHeuristic`, `HintGenerator` |
| Review actions | Recommendation: **Approve / Dismiss**. Proposed study group: **Approve / Edit**. |

The teacher dashboard is an interface, not a sixth agent. Use full agent names in prose and class names in class-model discussions. Topic and Concept are distinct: a Concept is a finer-grained unit within a Topic. Do not casually substitute topic accuracy for concept accuracy. “Learning material” refers to uploaded course content; AI-generated explanations, hints, and recommendations are generated content. The ambiguous state terms are documented in Section 11, not resolved by this terminology list. [C; R §§4.9, 6.6]

## 4. Responsibility boundaries

| Component | Responsibility and output | Boundary |
|---|---|---|
| Tutor Agent | Topic-related explanations, examples, check questions, adapting explanation level; records tutoring evidence. | Uses teacher-provided material and learner evidence. Does not own teacher recommendations or group formation. |
| Quiz Agent | Topic quizzes, answer evaluation, adaptive difficulty, answer/result records and quiz-derived weak-concept evidence. | Draft AI questions require teacher review; newly generated in-attempt questions require additional teacher approval. Q05 covers remaining mechanics. |
| Progress Agent | Performance metrics, topic/concept analysis, trends, weak areas, recurring mistakes, and supporting evidence. | Produces analysis; does not choose teacher-facing educational actions. |
| Teacher Assistant Agent | Interprets Progress Agent analysis; generates insights and evidence-based recommendations; proposes balanced or strength-based groups on teacher request. | Recommendations and group proposals need the distinct teacher actions below. |
| Discussion Agent | Observes group discussion and relevant workspace activity; generates topic-specific group hints; logs hints. | Supports approved groups. Hints must not reveal answers or expose an individual's weakness. |
| Teacher | Class/material/session management; quiz review and assignment; recommendation decisions; group review and monitoring. | Final authority over significant educational actions. |

Information passes through LangGraph routing and shared state; prose such as “passed to another agent” does not authorize direct agent-to-agent calls. [R §§5.1, 5.5–5.9, 6.3, 6.6.2; C]

## 5. Teacher review and learning lifecycle

### 5.1 Distinct review contracts

| Item | Decision | Result |
|---|---|---|
| Recommendation | **Approve** | Accept without modification; route the approved instruction to the appropriate agent. Collect and analyze the resulting learning evidence afterward. |
| Recommendation | **Dismiss** | Generate no automatic learning activity; retain the dismissed record for teacher reference; do not alter the learner's current activities from it. |
| Recommendation awaiting response | Pending | Remain pending on the dashboard; no automatic action. |
| Proposed study groups | **Approve / Edit** | Teacher may move learners between groups; approved composition is saved and made accessible for collaboration. |
| AI quiz questions | Review and approve before assignment | Save/publish only after the teacher has approved the questions. Manual question authoring is supported. |

Teacher decisions take priority when a recommendation conflicts with another agent's automatic action. Bounded explanation-level adaptation and next-question difficulty adaptation are described as automatic and visible to the teacher; they do not require approval for every adjustment. The exact conflict-resolution enforcement remains a dependency to specify, not a license for autonomous interventions. [R §§4.6.12–13, 5.6.1, 5.9, 6.4.4]

### 5.2 End-to-end sequence

1. Teacher logs in, manages a class, uploads learning material, selects a topic, and starts a learning session.
2. Students join and obtain tutoring on that topic, during or after the lecture where supported.
3. Teacher ends the learning session. This triggers a **draft** quiz on the covered topic.
4. Teacher reviews and approves the quiz before students can attempt it.
5. The Quiz Agent evaluates answers, adjusts difficulty by the streak rules, and records weak-concept evidence.
6. On completion, save results and final difficulty; run Progress Agent analysis.
7. The Teacher Assistant Agent converts analysis into evidence-based recommendations; pause the affected action for teacher review.
8. Approved recommendations are routed to their responsible agent; dismissed or unanswered ones generate no automatic activity.
9. When collaboration is needed, the teacher requests groups and selects size and strategy. The Teacher Assistant Agent proposes groups; the teacher approves or edits them before students obtain access.
10. Students discuss a problem. The Discussion Agent supplies requested or qualifying proactive hints and logs them for later analysis.
11. Relevant accumulated evidence supports subsequent learning activities.

Student-ended tutoring and teacher-ended class learning sessions are separately described in the report. Their lifecycle mapping must not be collapsed without resolving Q12. [R §§4.6.2, 4.6.15, 5.10]

## 6. Detailed agent procedures and numerical rules

### 6.1 Tutor Agent

Inputs: learner question; current difficulty, weak concepts, related mistakes and recent tutoring summary; relevant teacher-provided topic material. [R §5.3]

1. Classify the question as on-topic, off-topic, or unclear by reference to the session topic/material.
2. Read relevant learner evidence and retrieve the **three most relevant material sections/chunks**.
3. Choose explanation level; generate a short explanation, **one worked example**, and **one check question**.
4. Validate topic relevance, protection of ongoing quiz answers, and provider content filtering. On validation failure, regenerate once; if validation fails again, show a default message.
5. Save a brief tutoring record: concept, explanation level, repeated confusion where observed, summary, and check-question result when available.

| Level | Explanation | Initial selection |
|---|---|---|
| 1 | Short sentences, analogy, step-by-step explanation | Easy quiz stage or concept on the weak list |
| 2 | Complete explanation with an example | Medium stage |
| 3 | Concise explanation, corner cases, connections to other concepts | Hard stage |

Decrease the level by one after the same question is asked twice or a check question is answered incorrectly. Increase by one after **two consecutive correct check answers**. Address a recurring misconception directly. There are three levels; exact clamping/reset behavior and weak-concept precedence during subsequent adaptation remain Q09.

Off-topic: politely redirect to the session topic. Unclear: ask one clarification question. No retrieved information: the report calls for a brief response, a course-material limitation message, and an instructor-review flag; wording must not equate retrieval failure with proof of being off-topic without approval (Q09). External service failure: show an understandable error and keep history accessible.

### 6.2 Quiz Agent

Current levels: **Easy, Medium, Hard**. Easy tests a definition/fact with one step; Medium applies one concept over two steps; Hard combines concepts over multiple steps. Questions carry a concept and difficulty label. Weights are **1, 2, 3**, respectively. New learners start at **Medium**; returning learners start at their stored current level. [R §§5.2, 5.4]

- Two consecutive correct answers **at the current level** raise difficulty by one, up to Hard.
- Two consecutive incorrect answers **at the current level** lower difficulty by one, down to Easy.
- Otherwise keep the level; reset the streak count when difficulty changes.
- Two wrong answers on the **same concept in one quiz** flag that concept as weak.
- Select an unanswered question at the current level, preferably on a weak or previously untested concept.
- Save each answer, correctness, concept, difficulty, applicable mistake evidence, and final results.
- Persist final difficulty for later quizzes and provide results to the Progress Agent.

**Human-confirmed approval gate; mechanics pending Q05:** when no suitable question exists, newly generated questions require additional teacher approval before use. The report also mentions nearest-level selection, but precedence, wait/resume behavior and teacher unavailability are undecided. Do not select a fallback silently. The relation between the quiz's weak flag and aggregated mastery is also blocked (Q07).

Scoring: `raw_accuracy = correct_answers / attempted_answers`; `weighted_score = sum(weights of correct answers) / sum(weights of all attempted answers)`. Preserve the distinction between them. The report's six-question example gives 3/6 = 50% raw accuracy, 6/14 ≈ 42.9% weighted score, and final Medium difficulty. Zero-attempt behavior, rounding for storage, quiz length/termination and resumption are not established (Q08).

### 6.3 Progress Agent

Use multiple quizzes plus relevant tutoring and collaborative evidence, not only the newest score. Quiz evidence includes answers, correctness, tested concepts, difficulty, weights, accuracy, weighted score, final difficulty and weak concepts. Tutoring evidence includes requested concept, explanation level, repeated confusion, check-question result and summary. Collaborative evidence includes hint topic/problem, level and reason, and meaningful task events where available. **Raw cursor positions and mouse movements are not learning evidence and are not recorded as such.** [R §5.5.1]

Analysis runs after major events such as quiz completion, enough new interaction evidence, or a request for an updated view. “Enough” and event scheduling remain unspecified.

| Measure | Preserved rule |
|---|---|
| Quiz raw accuracy | `Aq = Cq / Nq` |
| Concept accuracy | `Tc = Cc / Nc` |
| Strong concept | `Tc >= 0.70` |
| Weak concept | `Tc <= 0.50` |
| Developing / Average | `0.50 < Tc < 0.70` |
| No assessment data | Do not classify as weak or assign a mastery classification from zero attempts |
| Average quiz accuracy | Arithmetic mean of completed quiz accuracies: `A = sum(Aq) / n` |
| Trend | Difference between latest and previous **comparable** accuracy; at least +0.10 is improving, at most -0.10 declining, smaller absolute changes stable |
| Recurring mistake | Same normalized mistake occurs **at least three times in the five most recent relevant interactions** |

Average quiz accuracy is not the same measure as overall grouping accuracy, which pools all attempted answers. Keep their distinct formulas. Thresholds may be refined later only through approved changes. The definition of comparable quizzes and relevant interactions, normalization of mistakes, evidence windows, and cold-start outputs remain Q08. [R §§5.5.2–3]

A mistake event needs affected topic/concept, normalized type, activity, timestamp, and an assessment/interaction reference. A recurring finding includes concept, type, count, latest occurrence and evidence. Weak concepts and recurring mistakes are distinct findings. Evidence from tutoring/group activity supplements the analysis; do not invent individual attribution from group hints (Q10).

### 6.4 Teacher Assistant Agent recommendations

Inputs include concept accuracy, strengths/weaknesses, trends, recurring mistakes, recent quiz results, tutoring history and relevant collaboration. Each recommendation contains learner identifier, topic/concept, relevant analysis, evidence, proposed action and priority. [R §5.6]

| Condition in the report | Suggested action |
|---|---|
| Concept accuracy <= 0.50 | Revise using additional explanation |
| Concept accuracy between 0.50 and 0.70 | Additional practice; exact endpoint wording conflicts with adjacent rules (Q07) |
| Recurring mistake | Targeted tutoring on the misconception |
| Decline continues after support | Direct teacher attention |
| Repeated tutoring on one concept | Additional explanation or practice |
| Accuracy >= 0.70 without recurring difficulty | More advanced practice |
| Shared weakness across learners | Consider class-level revision or collaborative activity |

These are suggested teacher-reviewed actions, not automatic dispatch rules. Priorities are high, medium, low in the dictionary; assignment thresholds, class-level representation, and action-to-agent mapping need specification.

### 6.5 Group formation owned by the Teacher Assistant Agent

Inputs: selected students, desired group size, and **balanced** or **strength-based** strategy. Use relevant topic accuracy supplied by progress analysis. [R §5.7]

- Topic vector: `Pi = [pi1, ..., pin]`, where each available topic score is correct/attempted answers for that topic. Omit topics with no attempts.
- Overall score: `Oi = total correct answers / total attempted answers`.
- Group mean: `Ak = sum(Oi in group k) / group_size`.
- Balance measure: `B = max(Ak) - min(Ak)`; smaller means closer group averages.
- Balanced procedure: sort descending by overall score; place each learner into the non-full group with lowest current **total** score. A tied selection score favors fewer members.
- Strength-based procedure: strong topic >= 0.70, weak <= 0.50, intermediate values neither. Pairwise complementarity counts topics where one is strong and the other weak. Group complementarity sums pairwise scores.
- Respect selected maximum group size. The report specifies an additional remainder group when students do not divide evenly. Show all proposals for teacher approval/editing; save and activate only approved groups.

Preserved example: scores 0.90, 0.82, 0.75, 0.60, 0.48, 0.40 and size three produce groups [0.90, 0.60, 0.48] and [0.82, 0.75, 0.40], with means 0.66 and approximately 0.66. Initial group creation, remainder handling versus greedy allocation, remaining ties, no-data learners and the exact strength-based construction algorithm remain Q06. An example involving other subject names does not expand the confirmed pilot.

### 6.6 Discussion Agent hints

Four triggers: a learner clicks the hint button; **three minutes without a chat message while the problem remains open**; the **last five messages** are off-topic; or a misconception is detected. The latter three are proactive. Proactive hints are limited to **one every five minutes** and are never posted while the group is discussing correctly. [R §5.8]

Read recent discussion to determine progress or misconception. Start each problem at Level 1 and advance successive hints up to Level 3; reset on a new problem. Level 1 asks learners to clarify the problem; Level 2 points to a relevant concept/rule; Level 3 supplies a general structure, without the answer or direct solution steps. Validate against the hidden solution; if the answer is revealed, regenerate once. A second failure produces a more general prompt inviting learners to explain their next-step ideas.

Post in group chat, mark it as an AI hint, and record level/reason/evidence for later analysis. Address the whole group and never mention an individual's weakness. Requested-hint cooldown, simultaneous triggers, message-window definitions, misconception detection, problem lifecycle and per-learner attribution remain Q10. “Few minutes” in a use case has not been silently rewritten; the precise methodology rule is preserved for review.

## 7. User-facing workflows and exception behavior

[R §§4.2, 4.6; UI inventory subject to Q13]

| Workflow | Expected behavior and exceptions |
|---|---|
| Login | Registered user provides email/password; establish role and show the correct dashboard. Incorrect credentials produce an error and retry/password-reset path. Supabase Authentication is the selected identity service. |
| Tutoring | Student selects a supported topic, asks/answers questions, ends their tutoring session; save summary/evidence. Simplify explanations when confused. Relationship to the teacher's learning session is Q12. |
| Adaptive quiz | Only an approved available quiz can be started. Show questions and save results. New questions require additional teacher approval; exhausted-bank and wait/resume mechanics are Q05. |
| Personal progress | Show understandable strengths, weaknesses, completed activities and progress over time; insufficient evidence yields a helpful message instead of a misleading summary. |
| Student feedback | Show recent, actionable concept feedback; when no clear weak area exists, general suggestions may be shown. Ownership and approval boundary for these suggestions are Q12. |
| Join workspace | Student sees their assigned approved group; if absent, show that no group is assigned. |
| Group chat | Show members/messages, persist discussion, deliver requested/qualifying proactive hints. |
| Class dashboard | Teacher views class performance and filters by learner or topic. Missing records produce a no-data message. |
| Recommendation review | Present evidence and Approve/Dismiss actions; no recommendations yields an empty-state message. |
| Material upload | Select class, file and title/topic; validate type, size and metadata; store/process; allow authorized access. Reject unsupported/oversized files; offer retry after upload/processing failure. Exact limits are Q14. |
| Quiz creation | Enter topic, difficulty and question settings; author manually or request AI drafts; review and assign to students/groups. Missing settings prevent assignment. Failed/unsuitable generation permits retry, edit, removal or manual authoring. Assignment persistence is Q04. |
| Group management | Manual grouping or Teacher Assistant proposals; teacher can edit membership and approve; warn on invalid/duplicate membership; permit manual creation after rejecting a proposal. Do not infer a third AI-group review button from an alternative-flow description. |
| Class management | Authorized teacher creates/updates class; unique class identifier/join code; validate required information. Archiving requests confirmation and retains existing records. |
| Learning session | Teacher selects an available topic and starts a session; absent topic prevents start. Ending triggers draft quiz creation. |

The narrative says sixteen use cases but lists fifteen. This is a report consistency issue, not permission to invent a missing use case. [Q17]

## 8. Architecture and implementation choices

### 8.1 Selected stack

| Layer | Current selected technology / purpose |
|---|---|
| Client | React + TypeScript; one web client with role-specific views |
| Backend | Python + FastAPI; REST application endpoints and FastAPI WebSockets |
| Agent coordination | LangGraph within the same FastAPI backend; event routing and teacher-review interrupts |
| Relational and vector persistence | PostgreSQL hosted through Supabase; pgvector in the same database |
| Authentication | Supabase Authentication; FastAPI validates requests and enforces authorization |
| ORM and validation | SQLAlchemy; Pydantic for request/response/AI-output schemas |
| Temporary real-time state | Redis for presence, locks, short-lived collaboration state and applicable caching |
| Material files | Supabase Storage / compatible object storage; exact final selection is Q14 |
| AI services | External LLM and embedding APIs/models through provider-independent interfaces; exact providers/models are not established |
| Development | GitHub, Docker, Visual Studio Code |

[R §§4.7.2, 6.2–6.4]

The **Application Backend** handles classes, membership, topics, sessions, materials, quizzes, progress, teacher decisions, groups and collaborative operations. The **Agent Service** handles agent execution, orchestration, relevant state updates, retrieval and language-model access. These are logical modules in **one FastAPI application**. Clients call application APIs; they do not directly invoke individual agents. Do not treat a diagram's separate agent box as a separate deployment. [R §§6.3.1.2–3, 6.4.3]

Selected organization: `frontend/` for React/TypeScript; `backend/` for FastAPI application services, routes, data access and authorization; `backend/agents/` for agents and LangGraph coordination. This is a design organization, not a verified existing file tree. [R §6.7.2]

### 8.2 Real-time and persistence boundaries

Use FastAPI WebSockets for chat messages, Discussion Agent hints, workspace events, presence and live teacher monitoring. Redis holds temporary collaboration state and controlled-editing locks. PostgreSQL persists group/message/application records. These are distinct storage responsibilities. Real-time access is authenticated and the backend checks student group membership or teacher ownership of the class. A client-supplied group identifier is not authorization. [R §§6.3.1, 6.4.7, 6.7.4]

The actual editing model, workspace document persistence, event contracts, lock ownership/lifetime, disconnect recovery and synchronization semantics remain Q11. The report names locks but does not establish a complete collaborative-editor implementation.

### 8.3 Retrieval and material processing

Store original file → extract text → split into chunks → generate chunk embeddings → store in PostgreSQL/pgvector with source/chunk metadata. Preserve traceability to teacher-uploaded material. Convert the learner query to an embedding, restrict retrieval to authorized class/current topic, and retrieve relevant chunks for the Tutor Agent. The tutoring method specifies three relevant chunks. [R §§5.3, 6.3.2, 6.7.4; Figures 6.2–6.3]

The report describes retrieval-based grounding and updating material without retraining. Some remaining wording makes a contradictory training/correctness claim; do not turn that into a model-training requirement. Its correction remains visible under Q17. Chunk size, overlap, extraction formats, retrieval threshold, reprocessing/version behavior and embedding provider are undecided. The dictionary's `vector(1536)` couples embedding choice to storage (Q14).

### 8.4 Background work and failures

Material extraction/chunking/embedding, quiz generation and performance analysis must not block ordinary user requests. Show processing feedback and results when ready. **The background execution mechanism is intentionally deferred**; no queue/worker mechanism is selected by this handoff. [R §6.4.8]

The coordination method specifies **20 seconds** for an LLM request timeout and **two retries** after failure. If failure persists, show an understandable fallback/error and mark the affected agent unavailable. Continue independent functions where possible; for example, retain quiz results for later analysis while Progress Agent processing is unavailable. Preserve learner records independently of individual AI requests. Agent-specific validation regeneration rules are separate from transport retries; their interaction must be defined (Q15). [R §§5.9, 6.4.6]

Validate structured outputs before writing state or database records. LangGraph checkpoints support recovery; exact checkpoint storage/frequency and the relationship to application persistence remain under Q01/Q15. Do not promise zero loss or automatic recovery beyond what is implemented and verified.

## 9. Domain and class inventory

Domain classes named in §6.6.1: `User`, `Student`, `Teacher`, `Class`, `Topic`, `Concept`, `LearningSession`, `Quiz`, `Question`, `QuizAttempt`, `LearnerContext`, `StudyGroup`, `GroupMessage`, `Hint`, `Recommendation`.

Teacher owns classes; students join through membership; classes contain topics, topics contain concepts; learning sessions relate to class/topic; a session can have a quiz and study groups; quizzes contain concept/difficulty-tagged questions; attempts record student participation and results. Recommendations derive from progress analysis, and messages/hints support approved groups. Domain classes do not necessarily correspond one-to-one with database tables: the dictionary represents hints within `GROUP_MESSAGE`. [R §§4.9, 6.6.1]

Agent support responsibilities:

- `BaseAgent`: shared execution, output validation and error handling.
- `EventRouter`: event-to-agent routing and workflow resumption after teacher review.
- `LLMClient`: provider interface, request validation and retries.
- `Retriever`: retrieve relevant teacher-material chunks through pgvector.
- `DifficultyHeuristic`: increase/decrease/retain quiz level.
- `GroupFormationHeuristic`: balanced and strength-based group rules used by the Teacher Assistant Agent.
- `HintGenerator`: trigger detection, hint progression/generation and validation.
- `InSyncState`: shared agent/workflow state as described in the agent-layer section; reconciliation with other context terminology is pending Q01.

The class diagram's conflicting group method and omitted support classes are not imported as approved methods. See Q04/Q16 before choosing signatures or implementing from the diagram. [R §§6.6.2, Table 6.2, Figure 6.5]

## 10. Routing and data ownership

| Trigger | Route / result |
|---|---|
| Learner tutoring question | Tutor Agent |
| Quiz answer | Quiz Agent evaluates and selects next question |
| Completed quiz | Save quiz results → Progress Agent → Teacher Assistant Agent → teacher review |
| Teacher ends learning session | Quiz Agent creates draft → teacher review before availability |
| Teacher requests groups | Teacher Assistant Agent proposes → teacher review → approved groups to Discussion Agent activity |
| Requested/qualifying proactive hint | Discussion Agent |
| Approved recommendation | Router dispatches the approved action to responsible agent |
| Dismissed/pending recommendation | No learning action from that recommendation |

The router, five agent nodes and Teacher Review Node/interrupt are described explicitly. Exact event names, payloads, action enumeration and replay behavior are not specified. [R §§5.9, 6.3.1.3]

Preserve producer ownership: Quiz Agent owns quiz outputs; Tutor Agent owns tutoring outputs; Progress Agent owns analysis; Teacher Assistant Agent owns recommendation/group-proposal outputs and approved grouping information; Discussion Agent owns hint logs. Shared evidence such as weak concepts must retain source-tagged contributions without one agent overwriting another's evidence. Precise field-level write permissions and merge/persistence rules are pending Q01/Q04/Q07. [R §§5.2, 5.9]

## 11. Three clarifications expressly pending human review

**The human chose to keep every item in this section pending. Do not interpret nearby report quotations as approval to resolve them.**

1. **`LearnerContext` versus `InSyncState` (Q01).** §6.6.1 explicitly describes persistent learner information loaded into agent workflows; §6.6.2 describes shared state through `InSyncState`. Other sections use learner context and workflow state interchangeably. Keep both identifiers and their source descriptions, but do not finalize a unified field model, scope, loading, persistence or checkpoint contract.
2. **LLM use and prompt templates (Q02).** §6.7.5 says each of five agents uses a reusable prompt template; Chapters 5–6 also specify arithmetic and heuristics. Whether every agent invokes an LLM, which operations do so, and whether to adopt the review's narrower wording remain unresolved. Preserve explicit formulas without assuming all analysis is performed by an LLM or that an entire agent is LLM-free.
3. **Student access scope (Q03).** §6.7.4 restricts students to their own records; §6.4.9 and group workflows allow necessary shared group information. Preserve authenticated membership checks and privacy requirements, but do not implement a reconciled RLS matrix or broaden access from an inferred clarification.

## 12. Privacy, safety, and interface requirements

Use internal learning activity only; do not collect emotional-state/sensor data or external learner records. Explain collection, purpose and use of learning data to students and teachers; consent is an operating assumption. Send external AI services only the learner information required for the task. Keep private learner information out of other students' access and out of group hint wording. [R §§4.4, 4.5, 5.8, 6.4.9]

Application database operations run through the backend. Database changes use migrations. Secrets, API keys, connection strings and privileged Supabase service-role credentials are server-side and stored through environment variables, never committed or exposed to the client. Protect hidden quiz answers and discussion reference solutions from student-facing disclosure. Exact RLS, hidden-field serialization and service-role policy are pending Q03/Q04. [R §§4.9, 6.7.3–4]

AI outputs need appropriate structural/content validation and educational boundaries. Tutoring must protect ongoing quiz answers. Hints must be checked against the hidden solution. AI-generated user-facing content must be distinguishable from teacher/student content; breadth of labeling for deterministic outputs remains Q02. Conclusions with insufficient evidence must be presented as uncertain. Provide ways to report wrong content and for teachers to monitor inappropriate output; detailed workflows/storage are Q18. [R §§4.4.6, 4.10.1–4]

UI requirements include plain-language labels/explanations, readable text, adequate contrast, meaningful labels, consistent navigation, understandable feedback, distinct interactive controls, and no color-only essential information. Collaboration is text-based and does not depend on audio. Do not claim a certified accessibility standard or an interface requiring zero training from these general goals. [R §§4.3.1, 4.4.5, 6.7.6]

## 13. Interface inventory — prototype details require scope confirmation

The report includes login, reset-password and signup screens; student dashboard, class list/class detail, adaptive quiz, progress and settings; teacher dashboard, class creation/list/detail, material upload, student performance, group monitoring and recommendation review. These corroborate the main workflows. [R Figures 4.1–4.17]

**Additional UI-only details are pending Q13**, not automatically current commitments: self-selected teacher role during signup; optional class code; an eight-character/numeric password hint; profile editing; notification toggles and weekly email summaries; appearance/text-size settings; learner-data personalization opt-out; quiz hints and exit/resume controls; class activity pause; milestones/progress percentages; calendars, global search and assistant/help panels. The architecture and schemas must support any feature before it is adopted.

Prototype subject names, example learners, dates, scores and course progress values are illustrative. They do not expand the confirmed Programming Fundamentals scope. The recommendation prototype's inconsistent action label requires harmonization with **Approve / Dismiss**, not silent adoption of a new action. Do not treat mockups as screenshots of a working product.

## 14. Development, validation, and evaluation

Scrum with **two-week sprints**, a functional increment per sprint, **15–20 minute** end-of-sprint reviews/reflections, and regular supervisor consultation. Python follows PEP 8; React/TypeScript follows consistent TypeScript/ECMAScript conventions; explain non-obvious logic in comments. Use feature branches, pull requests, peer review, and basic CI checks/tests before merge to main. Keep source code in GitHub; back up important project/database data periodically. Exact backup schedule and deployment environment are not established. [R §§4.10.11–12, 6.2.4, 6.7.1–3]

Evaluation should examine coordination and teacher review as well as output quality: trace how evidence changes later support; evaluate task usability with students/teachers; measure response time; simulate slow/unavailable AI services; exercise different learning scenarios and ownership updates; assess whether hints support peer reasoning. Monitor API usage/cost within the project's budget and investigate inappropriate/misleading outputs. No participant count, latency target, success threshold, uptime guarantee, or completed evaluation result has been approved in the available evidence. [R §§2.7–2.9, 4.3, 4.10]

Document material trade-offs: simple explainable heuristics aid implementation and teacher understanding; teacher review introduces delay; external models add cost, latency and provider dependency. Mitigate scope growth through the agreed scope and team task review. Do not convert claimed benefits into measured outcomes.

## 15. Future / optional implementations — not current scope

| Possibility supported by sources | Conditions / dependencies |
|---|---|
| Additional subjects | Supply topics, concepts, learning material and assessment content; verify routing/state compatibility and evaluate the new subject. Current testing remains Programming Fundamentals only. |
| Additional agents or learning/collaboration features | Define roles, state ownership, routing, reviews and API/UI changes; obtain approval. Modularity does not mean zero dependent changes. |
| Alternative language-model provider | Preserve the provider-wrapper boundary; verify output schemas, quality, retries, cost, privacy and evaluation. No alternative model is selected here. |
| Separate deployment of Agent Service | Only if later needed; preserve educational responsibilities and approve service boundaries and deployment effects. Current design stays in one FastAPI backend. |
| Refined thresholds/agent rules | Evaluation may motivate changes; approve new thresholds and all affected examples, tests, stored interpretations and report sections. |
| Hosted institutional service | Requires evidence of usefulness, affordability and teacher manageability; pricing, procurement, support and market choices are outside current commitments. |

[R §§2.8, 4.3.5, 5.5.2, 6.2.1.3, 6.4.3, 6.7.7]

Deferred choices such as background processing, exact providers, storage, schemas and limits are **unresolved implementation dependencies**, not automatically optional enhancements. Do not restore rejected alternatives merely because a future section exists.

## 16. Change approval and finalization record

For each proposed decision/change, record: issue ID; current evidence; exact proposed resolution; rationale; affected dependencies; alternatives requiring a human choice; approval wording/date; approved scope; files/diagrams/tests changed; verification result. Keep superseded details out of the active handoff while retaining provenance in a separate change log if the human requests it.

Before finalizing:

1. Review Q01–Q18 in the companion register, including the three explicitly deferred clarifications.
2. Supply missing history or explicitly accept a handoff limited to the accessible sources.
3. Confirm which report-derived details are current and which UI-only items remain excluded/pending.
4. Resolve schema authority before creating migrations or treating the schema inventory as executable specification.
5. Approve dependent report/diagram/code changes separately from this context compilation.
6. Record acceptance and revise the status only to match what has actually been approved.

No source report, diagram, application file, database or project configuration was changed in compiling this draft.
