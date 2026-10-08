# InSync schema inventory

**Review draft, 8 October 2026. Candidate data dictionary, not an approved migration specification.**

Read with [the master context](INSYNC_CODEX_CONTEXT.md) and [the review register](INSYNC_REVIEW_REQUIRED.md). The human explicitly approved preserving the data dictionary as a **candidate** while blocking all conflicting details. This does not select it over every diagram detail or authorize schema changes.

Source: F26-148.pdf, §4.9.2, Table 4.17, printed pp. 66–71 / PDF pp. 80–85. Field names are rendered below with underscores for readability, consistent with the diagram's identifier style. The PDF's dictionary extraction displays spaces in identifiers; SQL naming/casing still requires confirmation. Types, nullability and listed meanings are transcribed from the dictionary, not inferred from ORM conventions.

`No` under nullable means the dictionary requires a value; it does not supply a default. PK = primary key; FK = foreign key. Relationship/cardinality, check constraints, indexes, cascade rules and uniqueness beyond explicitly stated rules are not invented. The ER diagram in Figure 4.18 differs from this inventory (Q04).

## 1. USER

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| user_id | uuid | No | PK linked to login account |
| full_name | text | No | User's full name |
| email | text | No | Unique login email |
| role | enum(student, teacher) | No | Account type |
| created_at | timestamptz | No | Account creation |

Authentication is assigned to Supabase Authentication in the architecture. No application password field is listed. Teacher-role verification and identity/profile mapping require decisions (Q03/Q13).

## 2. CLASS

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| class_id | uuid | No | PK |
| teacher_id | uuid | No | Owner; FK to USER |
| name | text | No | Class name |
| join_code | text | No | Unique class join code |
| status | enum(active, archived) | No | Class state |
| created_at | timestamptz | No | Creation |

Archiving retains records and requires user confirmation in the use case. Deletion/cascade behavior is not established.

## 3. CLASS_MEMBER

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| class_id | uuid | No | Composite PK component; FK to CLASS |
| student_id | uuid | No | Composite PK component; FK to USER |
| status | enum(pending, enrolled) | No | Join request state |
| joined_at | timestamptz | Yes | Set once enrolled |

The entry implies join requests, but their approval/rejection workflow is not fully described. Do not invent rejected/removed states or a surrogate key (Q04/Q12).

## 4. TOPIC

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| topic_id | uuid | No | PK |
| class_id | uuid | No | FK to CLASS |
| name | text | No | Topic name |
| description | text | Yes | Short topic description |

## 5. CONCEPT

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| concept_id | uuid | No | PK |
| topic_id | uuid | No | FK to TOPIC |
| name | text | No | Concept name |

## 6. LEARNING_MATERIAL

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| material_id | uuid | No | PK |
| topic_id | uuid | No | FK to TOPIC |
| title | text | No | Material title |
| file_path | text | No | Storage path |
| status | enum(processing, ready, failed) | No | Processing state |
| uploaded_at | timestamptz | No | Upload time |

Class association is obtainable through topic; uploader attribution, file type/size metadata, versioning and replacement semantics are not specified in this dictionary (Q04/Q14).

## 7. MATERIAL_CHUNK

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| chunk_id | uuid | No | PK |
| material_id | uuid | No | FK to LEARNING_MATERIAL |
| chunk_index | integer | No | Chunk position in source |
| chunk_text | text | No | Extracted chunk text |
| embedding | vector(1536) | No | Retrieval vector |

1536 is a stored-vector dimension in the candidate dictionary, not approval of a particular embedding model. Chunk length/overlap, index strategy, model/version tracking and uniqueness of chunk position require decisions.

## 8. LEARNING_SESSION

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| session_id | uuid | No | PK |
| topic_id | uuid | No | FK to TOPIC |
| status | enum(active, ended) | No | Session state |
| started_at | timestamptz | No | Start |
| ended_at | timestamptz | Yes | Set on end |

Teacher controls the learning session. Individual student tutoring-session start/end, class association, number of active sessions and repeated end-trigger handling are Q04/Q12/Q15.

## 9. QUIZ

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| quiz_id | uuid | No | PK |
| session_id | uuid | No | FK to LEARNING_SESSION |
| generated_by | enum(ai, teacher) | No | Origin |
| status | enum(draft, approved) | No | Approval state |
| created_at | timestamptz | No | Creation |
| approved_at | timestamptz | Yes | Teacher approval time |

Use cases also permit manual quizzes and selected student/group assignment. No assignment table is supplied. The human's requirement for additional approval of in-attempt generated questions needs a question-level/versioned approval design; quiz status alone does not settle that mechanism (Q04/Q05).

## 10. QUESTION

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| question_id | uuid | No | PK |
| quiz_id | uuid | No | FK to QUIZ |
| concept_id | uuid | No | FK to CONCEPT |
| question_text | text | No | Question wording |
| options | jsonb | No | Answer choices |
| correct_answer | text | No | Correct option; hidden from students |
| difficulty | enum(easy, medium, hard) | No | Question difficulty |

Dictionary questions belong to one quiz and one concept; methodology describes a question bank and Hard questions combining concepts. Reuse, tagging, approval version and answer-choice encoding require confirmation. Do not expose hidden answers in student APIs.

## 11. QUIZ_ATTEMPT

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| attempt_id | uuid | No | PK |
| quiz_id | uuid | No | FK to QUIZ |
| student_id | uuid | No | FK to USER |
| started_at | timestamptz | No | Start |
| completed_at | timestamptz | Yes | Empty while in progress |
| raw_accuracy | numeric(5,4) | Yes | Correct fraction, 0–1 |
| weighted_score | numeric(5,4) | Yes | Difficulty-weighted fraction, 0–1 |
| final_difficulty | enum(easy, medium, hard) | Yes | Difficulty for next quiz |

No explicit interrupted/abandoned state, answer sequence, difficulty/streak snapshot, or per-quiz attempt limit is defined. Do not infer them from UI controls (Q05/Q08).

## 12. ATTEMPT_ANSWER

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| answer_id | uuid | No | PK |
| attempt_id | uuid | No | FK to QUIZ_ATTEMPT |
| question_id | uuid | No | FK to QUESTION |
| selected_answer | text | No | Selected option |
| is_correct | boolean | No | Correctness |
| mistake_type | text | Yes | Error category for wrong answers only |

The recurring-mistake algorithm requires time/order and evidence references. The dictionary has no answer timestamp; the ER figure differs. Duplicate submission, revision and question snapshots are not specified (Q04/Q08/Q15).

## 13. LEARNER_CONTEXT

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| context_id | uuid | No | PK |
| student_id | uuid | No | One context per student; FK to USER |
| quiz_difficulty | enum(easy, medium, hard) | No | Current quiz level |
| explanation_level | smallint | No | Tutor level 1–3 |
| tutoring_summary | text | Yes | Summary so far |
| updated_at | timestamptz | No | Last update |

**Q01 is explicitly pending.** Do not infer that this row equals all LangGraph state, or settle how difficulty is scoped across topics/classes. The dictionary's “one per student” is recorded as source evidence, not a newly approved global personalization scope.

## 14. CONCEPT_MASTERY

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| mastery_id | uuid | No | PK |
| context_id | uuid | No | FK to LEARNER_CONTEXT |
| concept_id | uuid | No | FK to CONCEPT |
| correct_count | integer | No | Correct answers |
| attempted_count | integer | No | Total answers |
| mastery | enum(strong, developing, weak) | No | Classification |
| weak_flag | boolean | No | Automatically true when mastery is weak |

The methodology does not classify unassessed concepts and separately flags two wrong answers within a quiz. Reconcile missing-data representation and those weak signals before computing/writing this row. Uniqueness per learner/concept and recalculation windows are not specified (Q07/Q08).

## 15. TUTORING_INTERACTION

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| interaction_id | uuid | No | PK |
| context_id | uuid | No | FK to LEARNER_CONTEXT |
| concept_id | uuid | No | FK to CONCEPT |
| explanation_level | smallint | No | Level 1–3 used |
| repeated_confusion | boolean | No | Repeated concept confusion |
| check_correct | boolean | Yes | Check question result, if asked |
| summary | text | No | Brief exchange summary |
| created_at | timestamptz | No | Interaction time |

Nullable check result does not decide when the otherwise specified check question may be omitted. Full transcript retention, session grouping and mistake normalization are unresolved.

## 16. PROGRESS_ANALYSIS

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| analysis_id | uuid | No | PK |
| context_id | uuid | No | FK to LEARNER_CONTEXT |
| average_accuracy | numeric(5,4) | No | Average accuracy, 0–1 |
| trend | enum(improving, declining, stable) | No | Direction |
| summary | text | No | Written analysis |
| created_at | timestamptz | No | Analysis time |

No explicit topic/window key, structured recurring-mistake evidence, collaborative attribution or no-data value is supplied. These are gaps to resolve, not permission to add columns without review.

## 17. RECOMMENDATION

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| recommendation_id | uuid | No | PK |
| analysis_id | uuid | No | FK to PROGRESS_ANALYSIS |
| concept_id | uuid | Yes | Related concept; FK to CONCEPT |
| action_type | text | No | Suggested action |
| evidence | text | No | Supporting evidence |
| priority | enum(high, medium, low) | No | Urgency |
| status | enum(pending, approved, dismissed) | No | Teacher decision state |
| created_at | timestamptz | No | Creation |
| reviewed_at | timestamptz | Yes | Teacher decision time |

No explicit reviewing-teacher ID, execution state, action parameters, class/group target, or audit/version record is defined. Retaining a dismissed recommendation is a current behavior. Exact action vocabulary and deduplication require review.

## 18. STUDY_GROUP

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| group_id | uuid | No | PK |
| session_id | uuid | No | FK to LEARNING_SESSION |
| name | text | No | Group name |
| strategy | enum(balanced, strength_based) | No | Grouping strategy |
| status | enum(proposed, approved) | No | Approval state |
| approved_at | timestamptz | Yes | Approval time |

Manual grouping is supported in use cases but the strategy enum supplies only algorithmic strategies. Group size, proposal revisions, approving teacher and activation/version behavior are not specified (Q04/Q06).

## 19. GROUP_MEMBER

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| group_id | uuid | No | Composite PK component; FK to STUDY_GROUP |
| student_id | uuid | No | Composite PK component; FK to USER |

Uniqueness of membership across groups within a session and changes after activity begins need explicit rules. Do not infer the ER figure's different membership cardinality.

## 20. DISCUSSION_PROBLEM

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| problem_id | uuid | No | PK |
| session_id | uuid | No | FK to LEARNING_SESSION |
| problem_text | text | No | Task shown to groups |
| hidden_solution | text | No | Reference solution, never shown to students |

Problem authoring/approval, open/closed state, active-problem selection and group assignment are not represented. Those dependencies matter to hint timing, progression and validation (Q10). Student access to problem text versus protection of the hidden solution must be reconciled with the pending access policy (Q03).

## 21. GROUP_MESSAGE

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| message_id | uuid | No | PK |
| group_id | uuid | No | FK to STUDY_GROUP |
| sender_id | uuid | Yes | Student sender; empty for AI hints |
| problem_id | uuid | Yes | FK to DISCUSSION_PROBLEM |
| message_type | enum(student, ai_hint) | No | Student post or AI hint |
| content | text | No | Message text |
| hint_level | smallint | Yes | For AI hints only |
| hint_trigger | text | Yes | Reason, for AI hints only |
| created_at | timestamptz | No | Sent time |

Sender FK target is not explicitly stated in the dictionary entry. Sender/type consistency constraints, teacher messages, which posts reset inactivity and ordering/replay are not established. A separate domain `Hint` class does not authorize a separate hint table.

## 22. Known cross-source and missing-dependency conflicts

The ER figure and dictionary disagree over membership keys and user/student identifiers, class join-code naming, context difficulty naming, session fields, mastery representation, tutoring evidence, quiz scores/completion fields, recommendation fields, and group/message attributes. The figure also contains two boxes labeled QUESTION with inconsistent content. These are material conflicts, not typographical normalization to perform automatically.

Missing or incomplete dependencies include quiz assignment, incremental question approval, per-answer ordering/timestamps, structured recurring-mistake evidence, group approval audit, teacher decision execution state, discussion-problem lifecycle, meaningful workspace persistence and checkpoint storage. See Q01, Q03–Q12, Q14–Q16 for the approval required before choosing a solution.

Do not generate migrations, constraints, defaults, enum extensions, RLS policies or endpoint payloads from this inventory until the human approves the relevant decisions.
