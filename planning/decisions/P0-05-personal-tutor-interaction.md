# Personal tutor interaction — scoped decision record for #6

Prepared 11 October 2026 (Asia/Karachi). Parent: [#68](https://github.com/Haadiyah-Zafar/InSyncc/issues/68).
Related decision: [#6](https://github.com/Haadiyah-Zafar/InSyncc/issues/6).
Status: **PT1–PT3 confirmed; further tutoring and implementation contracts remain pending**.

This records the personal whiteboard learning flow, not the full Progress Agent or
Teacher Assistant decision package. It cannot close all of #6 or approve #3/#4/#8/#9/#10.
Read with [project context](../../INSYNC_CODEX_CONTEXT.md), [review register](../../INSYNC_REVIEW_REQUIRED.md),
[candidate schema](../../INSYNC_SCHEMA_INVENTORY.md), and [approved pilot scope](P0-01-pilot-scope.md).

## Confirmed scope

The human requested a usable personal learning module: start a Tutor session, receive
work through chat/the board, work on it, circle/select a confusing part, receive help
inline, and continue the learning conversation. Chat and board belong to the same
session. Use actual course RAG and the minimal LangGraph Tutor path; do not build a
parallel direct-to-model chatbot. Other agents may be integrated later under their
contracts. Preserve the OpenRouter/10–15-model requirement and existing budget gates.

The group workspace with Yjs/separate surface holders and Discussion Agent hints
remains a separate scope in #7/#50/#51/#52. This record does not change its permissions.
Python execution remains #64 and is not implied by rendering code in a tutor card.

## Explicit choices

| ID | Choice | Status and evidence |
|---|---|---|
| PT1 | Every tutor-proposed board change requires learner approval before it takes effect. | **Confirmed** on 11 October 2026. Exact answer: “Ask for approval before every board change”. The question concerned whether the tutor may place new activity/explanation cards automatically. |
| PT2 | Activate the Ask tool, then circle the content to send the tutoring request. | **Confirmed** on 11 October 2026: “for the selection ask tool + cirrcle”. Ordinary drawing outside Ask mode is not a tutoring request. |
| PT3 | Start with structured text/code/board objects, using tldraw-like objects as the reference. Add image understanding later. | **Confirmed** on 11 October 2026: “in the start use structured objects as in tldrraw then we will move to adding the images”. Raw handwriting/image interpretation is outside the initial structured-content phase. |

PT1 applies to adding a tutor activity, adding an inline explanation, editing/replacing
an object, or deleting content. Starting a session or requesting help is not itself
approval to mutate the board. Learner drawing and typing remain learner actions;
this choice concerns tutor-initiated changes. Existing teacher approval gates for
quizzes, recommendations, and group activation remain separate.

The tutor may provide help in chat without writing it onto the board. An inline
explanation is a proposed board addition until approved. No response, request retry,
reload, model fallback, or restored session supplies missing approval.

## Structured selection boundary

The initial Tutor input is structured object content and relevant relationships/context,
not an OCR or vision interpretation of a screenshot. Text/code stored in objects can
be extracted exactly. Diagram meaning is limited to the structured types, labels,
geometry and relationships actually available; unknown symbols or handwritten strokes
must not be confidently interpreted as recognized text. Drawing a circle is the
selection gesture, not itself a request to recognize handwriting.

Images are a later extension, with separate provider, cost, privacy and interpretation
checks before claiming support. The exact quote names tldraw as the object-model
reference; installing/selecting the tldraw SDK is still subject to its suitability and
license review. No dependency was installed by recording this choice.

Suitability check on 11 October 2026: published `tldraw@5.5.2` declares React/React
DOM `^18.2.0 || ^19.2.1` and Node `>=22.12.0`, which include this repository's
React `19.3.0` and Node `24.19.0`. This is metadata compatibility, not a tested
integration. The SDK supports custom shapes/tools, but uses the tldraw license,
not MIT: internal development/testing is permitted, while production requires a
separate license. Its documented hobby license is discretionary and retains the
watermark. Do not assume a public demo is covered by internal-development terms.
Sources: [published metadata](https://registry.npmjs.org/tldraw/5.5.2),
[official package with bundled documentation/license](https://registry.npmjs.org/tldraw/-/tldraw-5.5.2.tgz),
and [upstream license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md).
The SDK/deployment choice remains open before #69 adopts a library.

The Ask tool initiates the help request, but does not approve a board mutation.
A generated inline explanation still requires PT1 approval before insertion.
Precise hit testing (enclosed/intersected objects), selection limits, keyboard
alternatives and revision payloads remain part of the #10 contract.

## Recommended behavior and contract consequences

The following makes PT1–PT3 concrete for implementation review. These are **proposals**
for the relevant contract owners, not an approved API/schema or hidden additional
product decision.

| Concern | Recommended behavior | Owner / downstream |
|---|---|---|
| Proposal review | Display the exact proposed addition/edit/deletion in a review area separate from the authoritative board, with Approve and Dismiss. Do not auto-apply a preview. | #6/#10; #69/#70/#71 |
| Approval identity | Bind approval to an immutable action payload, authorized session/document, actor, action ID and source revision. Approval of one change does not approve later changed payloads. | #3/#4/#9/#10 |
| Board execution | The backend validates permission, the approved payload and target/revision before the client applies the persisted result. A model emits structured proposals, never executable arbitrary UI code. | #10/#30/#69/#70 |
| Concurrent/stale edits | If content changed since the proposed action, preserve learner work and request a refreshed proposal/review instead of silently overwriting it. Exact rebase policy awaits #10. | #3/#9/#10/#71 |
| Duplicate delivery | Repeated approval/network retry applies the same authorized action at most once; reload must not replay it as a new action. | #3/#9/#10/#70/#72 |
| Persistence | Persist proposal state and application outcome so history distinguishes generated, pending, dismissed and applied content. Exact lifecycle/retention/schema remains unapproved. | #3/#8/#9/#30 |
| Learning evidence | Merely approving or dismissing a card, circling content, or moving the cursor does not establish mastery or an incorrect answer. Keep content provenance; check-answer evidence follows approved tutor rules. | #3/#6/#30/#72 |
| Alternative input | Provide a keyboard-operable way to select content/request help; pointer drawing alone is insufficient. Ask mode is confirmed by PT2; exact keyboard controls follow #10. | #69/#71 |
| Content interpretation | Use exact structured content plus relevant context in the initial phase. Images/handwriting interpretation is deferred under PT3; later support requires a selected and tested OCR/vision route. Uncertain object meaning requires clarification rather than a confident guess. | #6/#8/#10/#18/#71 |
| Privacy and grounding | Retrieve only authorized class/topic material; do not send the whole board or unrelated history by default. Preserve current quiz-answer protection. | #4/#6/#29/#30/#71 |

The approval interaction is not a reason to defer chat assistance: the learner can
read a response before deciding to insert it into the board. Whether a batch of
changes may share an approval, preview placement, and undo semantics need explicit
contract review; PT1 does not authorize blanket approval for an entire session.

## Concrete learning example

1. Learner starts an authorized Python loops topic session.
2. Tutor retrieves the relevant course passages and prepares an explanation, worked
   example and check question according to the existing Tutor procedure. Placement
   into chat/board and initial selection rules are finalized through #6/#10.
3. Proposed board activity: trace `for i in range(1, 4)` and accumulated `total`.
   It is visible for review but is not yet part of the saved board.
4. Learner approves that activity addition. The approved action is applied once.
5. Learner activates the Ask tool and circles the structured code object containing `range(1, 4)`. The selection sends its content and relevant context through the application API.
6. Tutor explains that the stop value is excluded, supported by retrieved material,
   and proposes an anchored inline explanation. The original board remains intact.
7. Learner approves the explanation addition; it appears at the validated anchor.
   Dismissing it leaves the board unchanged and preserves the chat explanation.
8. Learner submits a check-question answer. The Tutor follows the approved assessment
   and adaptation procedure; another proposed board change requires another approval.
9. Reload restores the approved session history/board; pending changes remain pending.

## Recovered Tutor rules to preserve, not silently redesign

Context §6.1 specifies top-three retrieval; on-topic/off-topic/unclear handling; three
explanation levels; explanation/one worked example/one check question; one-step
explanation decreases on repeated-question/incorrect checks and increases after two
correct checks; one validation regeneration; protected ongoing quiz answers; and
history availability after provider failure.

Q09 still needs exact clamps/resets, initial cold-start treatment, weak-signal
precedence, same-question recognition, check-question optionality, missing-retrieval
behavior and instructor-review flag handling. Q01/Q03/Q07/Q12 state/access/session/
evidence questions remain with #3/#4/#6. This file does not invent numeric thresholds,
close broad progress/recommendation semantics, or bypass their dependencies.

## Review and verification scenarios

Before the owning implementation issues close, verify:

- A generated activity/explanation does not change the board before explicit approval.
- Dismissal, inactivity, reconnect and failed requests never count as approval.
- Approved additions/changes match the reviewed payload and authorized document.
- Double-click/retry does not duplicate actions; another learner cannot approve/access them.
- Deleted/moved/revised selection handling preserves work and provides clear feedback.
- Every supported PT3 content type has real extraction/interpretation tests; unsupported
  or ambiguous selection does not produce fabricated confident tutoring.
- Inline help uses real source-linked RAG; request/response can be followed in the same
  session/panel; output validation and failure/exhaustion behavior preserve prior work.
- Check-answer feedback has approved attribution and learning semantics.

## Remaining decisions and completion boundary

PT1–PT3 are confirmed. The contract recommendations above
need review in their owning decisions before becoming implementation requirements.
Issue #6 explicitly permits smaller decision records, but unapproved subdecisions
continue to block their dependent work. Keep #6 open for its other acceptance checks.
The implementation sequence and merge checkpoint are recorded in
[the module workflow](../PERSONAL_TUTOR_WORKFLOW.md).
