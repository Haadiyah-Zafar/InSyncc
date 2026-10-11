## Issue and outcome

Related to #6 and #68. This is a partial decision record; it must not close either issue.

Record the user's confirmed requirement that every tutor-proposed personal-board
change needs approval before application, Ask tool + circle sends the request, and
initial inputs are structured text/code/board objects with image interpretation later. Define the requested one-issue development,
verification, commit/push handoff, user PR/merge, and latest-main continuation workflow.

The new decision record distinguishes confirmed PT1–PT3 scope and proposed approval/action/revision contracts. It includes a concrete
Python-loop learning example and downstream references. No application behavior,
full #6 decision, schema, state, provider route, or interface contract is implemented
or approved by merging this documentation alone.

## Validation and dependencies

Local documentation links and `git diff --check` were checked. Live #6 and parent
#68, children and dependencies were inspected on 11 October 2026. Base `main` is
`e522a8e`, containing merged frontend-shell PR #67. Two independent read-only reviews
cross-checked the Tutor rules and dependency gates; these are agent reviews, not
human design approval.

#69 can start after its approved #10 contracts, including the relevant #6/#9 decisions.
Its #30 dependency is a closure gate. #9/#10 currently retain their broader P0 blockers;
no dependency is deleted to accelerate a mock-only demo.

## Review

- [ ] Human confirms any pending product choices before their implementation.
- [ ] A different contributor reviews the documentation.
- [ ] Preserve partial status; use Related to #6, not a closing keyword.
