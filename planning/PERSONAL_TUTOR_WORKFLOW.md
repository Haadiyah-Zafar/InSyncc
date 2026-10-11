# Personal tutor module: sequential development workflow

Requested by the human on 11 October 2026 (Asia/Karachi). Target:
[#68 — Deliver a tutor-led personal whiteboard session](https://github.com/Haadiyah-Zafar/InSyncc/issues/68).

The user wants this module developed one issue at a time, with commit/push commands
provided for each reviewable change. The user creates the PR and merges into `main`.
Ask about unresolved product choices; do not silently choose an alternative. Routine
implementation details within approved contracts follow normal engineering judgment.

## Per-issue loop

1. Read current task/AGENTS, live issue/comments, approved decisions, and start/close
   dependencies. Check clean/dirty files and fetch latest `main`; preserve user changes.
2. Select one ready issue or scoped decision slice. Use a dedicated branch from the
   merged baseline. If a dependency remains unapproved, prepare its concrete decision
   record while continuing independent inspection; do not bypass the blocker.
3. Implement the issue scope, run relevant checks, and inspect the resulting diff.
   Read-only agent reviews may help within the active issue; do not concurrently take
   ownership of a different implementation issue.
4. Provide exact staging/commit/push commands and a PR description with actual evidence.
   Use `Closes #N` only for a complete issue; partial decision slices use `Related to #N`.
5. Leave commit, push, PR creation and merge to the user as requested. On the next
   continuation, verify the PR merged and refresh `main` before the next issue. Never
   treat an unmerged branch or “checked” checkbox alone as proof of complete acceptance.
6. Keep the parent open until all required sub-issues and the real integrated journey
   are complete. This is a conversation workflow, not a background task that keeps
   running after the response or a daemon that merges automatically.

## Verified starting state

Latest fetched main: `e522a8e` (merged frontend-shell PR #67). Backend/tooling/shell
are available. Current scoped work: #6, personal tutor behavior decision record.
See [the decision and exact human answers](decisions/P0-05-personal-tutor-interaction.md).
PT1–PT3 now confirm approval before every tutor board change, Ask tool + circle,
and structured objects first with images later. Remaining contracts retain their gates.
The ten module sub-issues were verified open on 11 October 2026; check live state
again on each continuation. This snapshot is not an implementation-completion claim.

| Sub-issue | Work | Start versus closure notes |
|---|---|---|
| #17 | LangGraph state/routing/review infrastructure | Existing approved contracts/database/backend prerequisites stay intact. |
| #18 | OpenRouter/provider validation and fallback | Requires service decisions and interfaces; includes the existing 10–15-model requirement. |
| #28 | Extraction, chunking and embeddings | Requires material access/upload #27 and provider integration #18. |
| #29 | Authorized course retrieval | Requires #28 and backend access #21. |
| #30 | Tutor Agent and persistence | Requires #29, #17, and class/session backend #24. |
| #32 | Student tutoring screens | May start against approved contracts after existing shell/class prerequisites; close after real #30 integration. |
| #69 | Personal whiteboard and tutor panel | Start after #13 and approved #10 contracts (including #6/#9 decisions); close after real #30 integration. |
| #70 | Tutor-started activities | Requires #30/#10; close after #69 integration. |
| #71 | Circle-to-ask and inline help | Requires #69/#30/#10 plus relevant modality/access/state decisions. |
| #72 | Integrated personal learning loop | Requires #69/#70/#71/#30/#32 and their real underlying integrations. |

## Work order and external prerequisites

First prepare the personal Tutor choices in #6, with relevant state/access/provider
choices from #3/#4/#8. Canonical persistence #9 and contracts #10 retain their existing
review prerequisites, including other required portions of #5/#6/#7. Approving one
personal-tutor slice is not closure of those broader issues.

After contracts allow it, #69 is the first visible UI target. It can be reviewed in
an explicitly labeled fixture stage while backend/RAG work is still in progress,
but it cannot close until real integration works. A staged PR is not a new promise
that its whole issue is complete. The next eligible implementation is selected from
actual dependencies, rather than blindly iterating the parent’s issue-number order.

Supporting work may also be needed outside the parent: #14/#16/#19 services/database/
jobs; #21–#25 access/classes/sessions; and #27 material upload. These are not optional
just because the parent groups a smaller list. The chosen module priority does not
rewrite their acceptance checks or require all other agents to be complete first.

If the current full contracts/schema gates make an early visual milestone too broad,
prepare an explicit scope/dependency amendment for human review. Do not quietly remove
blockers or claim a mock-only prototype satisfies the real learning-loop milestone.
