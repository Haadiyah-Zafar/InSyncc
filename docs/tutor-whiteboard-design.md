# Personal tutor whiteboard: Figma design handoff

Recorded 7 November 2026 (Asia/Karachi). Related to [personal tutor module #68](https://github.com/Haadiyah-Zafar/InSyncc/issues/68).

Status: **four editable Figma screens saved; implementation and design review remain pending**. This document records the user's requested screen flow and the saved design references so another task can recover context without the original chat.

## Design source and screens

[Figma design file](https://www.figma.com/design/AYHEalqIyTPjrxt7V87275/Insyncc)

| State | Direct frame link | Intended presentation |
| --- | --- | --- |
| 01: Before session | [Frame 11:2](https://www.figma.com/design/AYHEalqIyTPjrxt7V87275/Insyncc?node-id=11-2) | Class/study-group navigation, blank board, Start session button, corner mascot. Tutor panel closed. |
| 02: Session started | [Frame 36:111](https://www.figma.com/design/AYHEalqIyTPjrxt7V87275/Insyncc?node-id=36-111) | Board fills the application viewport; main navigation disappears. Left tool rail, topic milestones, exit control, corner mascot. No lesson objects yet. |
| 03: Topic selected | [Frame 36:167](https://www.figma.com/design/AYHEalqIyTPjrxt7V87275/Insyncc?node-id=36-167) | Selected topic's content is visible on the board. Tutor panel remains closed. |
| 04: Tutor open | [Frame 36:244](https://www.figma.com/design/AYHEalqIyTPjrxt7V87275/Insyncc?node-id=36-244) | Topic stays visible beside a floating tutor window with a close control. An illustrative circled node shows the selection-help use case. |

Each main frame is 1440 × 900. The earlier three-column layout is retained in Figma as an archived reference, not the current design target. These URLs point to live frames, not immutable version snapshots; later Figma edits can change their appearance.

## User-requested experience

The prior design felt cluttered because the session plan, tutor chat and board were all open together. The user requested:

1. Before starting, retain the navigation list (classes, study groups and related destinations) beside an empty board.
2. Keep the tutor conversation closed by default. Use the existing pencil mascot as a corner launcher.
3. Start session enters a focused board workspace with the main application menu hidden.
4. Show topic milestones. Selecting a topic reveals the relevant lesson content on the board.
5. Let the student draw, circle/select content and ask for help.
6. Open or close the tutor window through the mascot/close control while retaining the board context.

The full-screen state means the board fills the application viewport; it does not require the browser Fullscreen API. Colors are intentionally provisional and neutral. Final palette and exact placements remain open for user review.

## Mascot and visual foundation

The actual retro pencil artwork from the earlier mascot work is embedded in the Figma launcher, not a substitute avatar. It is a static image in these designs; animation has not been wired.

The Figma file contains reusable navigation and button components and named neutral color variables. It uses Inter. The application should retain reusable theme roles when implementing the screens so the palette can be changed later.

The binary-search-tree example, three topic titles and sample tutor reply are illustrative design content, not real retrieval output or a finalized syllabus. The annotation is illustrative, not evidence of working handwriting interpretation.

## Interaction contract to implement

| Action | Intended result |
| --- | --- |
| Start session | Enter state 02; hide app navigation; keep the tutor closed and board free of lesson objects. |
| Select a topic milestone | Show that topic's eligible content as illustrated in state 03, subject to the board-write approval boundary below. |
| Click the mascot | Open tutor help in the current context. Opening chat must not silently choose a topic, start a session or mutate the board. |
| Close the tutor | Hide the panel and retain the current topic, board work and conversation. |
| Use Ask tool + circle | Request help about selected structured objects under the existing selection contract. Ordinary pen strokes alone do not send a tutoring request. |
| Leave focused view | Provide a route back to navigation. Exact end-session, saving and resumption semantics remain with the existing session contracts. |

These are intended interactions. The saved frames are not a verified click-through prototype, and this PR does not implement them in the frontend.

## Existing requirements still apply

Read [the personal tutor interaction record](../planning/decisions/P0-05-personal-tutor-interaction.md) alongside these designs:

- **PT1:** every tutor-proposed addition, edit, replacement or deletion needs explicit learner approval before application. Starting a session, opening the tutor or selecting a milestone must not be treated as blanket permission for new AI board writes.
- **PT2:** Ask tool + circle is the deliberate selection-help trigger. Add a clear Ask mode and keyboard alternative during implementation; the current mockups' pen/circle affordances do not fully specify that interaction.
- **PT3:** initial help uses structured text/code/board objects. Image and raw-handwriting interpretation remain later work.
- Preserve course-grounded retrieval, the application API and minimal LangGraph Tutor path. Sample chat copy is not a substitute for integrated tutoring.
- This is the personal workspace; shared group editing permissions and teacher review gates are unchanged.

The transition between choosing a topic and displaying newly generated content needs review: the user's desired topic navigation does not explicitly revoke PT1. Existing approved lesson content may be presented under its agreed contract; new tutor-generated changes still require a separate Approve / Dismiss step. These four frames do not yet show that approval state or define an API/schema for it.

## Delivery status and follow-up

Completed in Figma:
- Four editable screen layouts with a blank initial board, focused session view, topic example and tutor-open example.
- Existing pencil mascot embedded as the launcher.
- Earlier layout retained as an archive.

Still required:
- Final screenshot/layout review. Figma's Starter-plan tool-call limit blocked this after the four frames were saved.
- Prototype links for Start session, topic selection, mascot open/close and exit. The initial wiring attempt was rejected; the subsequent attempt was blocked by the tool limit. Do not assume the buttons are wired.
- Approval-preview, loading, unavailable, error, stale-selection and recovery states under the approved contracts.
- Frontend implementation, session persistence, authorized retrieval and real Tutor integration.
- Asset export/versioning and a fixed visual snapshot once the design is reviewed. This PR contains links and textual context; it does not contain a .fig archive, exported screenshots or the mascot binary.

## Review checklist

- [ ] Confirm the four Figma layouts and placements visually.
- [ ] Confirm navigation is present before starting and hidden during a focused session.
- [ ] Confirm both initial states have no prefilled lesson objects or open tutor panel.
- [ ] Confirm the mascot opens/closes help without changing the session or board.
- [ ] Specify the topic-content transition while preserving PT1 approval.
- [ ] Verify Ask mode, structured selection and keyboard access.
- [ ] Review palette, responsive layout and accessible focus/contrast before implementation completion.

This documentation does not close #68 or its implementation children. No application runtime behavior is changed by this PR.
