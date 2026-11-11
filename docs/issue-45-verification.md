# Issue #45 verification

Prepared on 12 November 2026 (Asia/Karachi), branch
`feat/45-balanced-group-formation`, based on `main` at `984b15a`.

## Prerequisite evidence

Live #45 had no comments, no linked PR, and was self-assigned by `aree22-hafeez`.
Its start prerequisites #7 (P0-06), #10 (P0-09) and #12 (P1-02) are closed, and it
has no close-after dependencies. GitHub no longer reports it as blocked, although
the `status:blocked` label is still present. The P0-06 approval table (§7) records
decisions A–F for group formation. #10 does not define a group-proposal payload,
so the input and output types here are internal to the heuristic.

## Implementation and checks

`backend/agents/heuristics/group_formation.py` adds
`GroupFormationHeuristic.propose_balanced`. It is a pure, deterministic function:
no model call, database, API route or activation. It returns a proposal with
status `proposed` and strategy `balanced` (P0-08 S12 names), with each group's
total score, mean score `A_k` and the balance measure `B`.

- Report §5.7.4 example: `[0.90, 0.60, 0.48]` and `[0.82, 0.75, 0.40]`, means
  0.66 and 197/300.
- Overall score is pooled (total correct / total attempted), never an average of
  topic or quiz accuracies. Topics with no attempts are left out. Exact fractions
  are used for all comparisons (P0-05 §5).
- P0-06 A2, which replaces the report's single smaller remainder group (A1): the
  fewest groups within the maximum size, sizes differing by at most one (for
  example 10 learners with size 3 give 3, 3, 2, 2). B1: a group of one is kept and
  flagged. C: a tie on the total score goes to the group with fewer members, then
  the lower group number. C1: learners with no topic data are returned as "no
  data" for the teacher to place.
- `A_k` divides by the group's actual number of members `|G_k|`, never by the
  selected maximum size.
- Duplicate students and invalid counts are rejected; inputs are frozen and are
  not changed.

`backend/tests/test_group_formation_balanced.py` adds 27 pytest cases, including a
300-case random check of size limits, size difference, unique membership and
numbering. A separate script written from the report text matched the result in
5,000 random evenly divisible cases (not added to the repository).

Commands from the repository root:

```bash
uv sync --project backend --locked
npm run check
npm run test:backend
npm run test:frontend
git diff --check
```

The exact results are recorded in the PR.

## Choices for review

P0-06 approves A2 but does not say which groups take the extra place when sizes
are uneven, or how to order learners with equal scores. These choices need the
reviewer's and the P0-06 owner's confirmation before they are recorded in the
decision record.

1. Seat allocation under A2: when the learners do not divide evenly, groups 1, 2,
   … take the one extra place, in group-number order. In 2,763 random uneven cases
   the average `B = max(A_k) - min(A_k)` was 0.134, against 0.236 when the extra
   place instead goes to whichever group has the lowest total.
2. Learner ordering: learners with equal overall scores are ordered by
   `student_id`, so the result does not depend on input order. This is separate
   from the approved group-selection tie-break in C (fewer members, then lower
   group number), which decides between groups, not between learners.
3. Data meaning: a learner with attempts but no correct answers has data and is
   placed with an overall score of 0. A topic with no attempts is left out of that
   learner's topic results. Only a learner with no attempted answers in any topic
   has no overall data and is "no data" under C1.

`A_k` is not a separate choice: it follows the report's `|G_k|`. The context
document (§6.5) writes "/ group_size"; this record reads that as the group's own
size, not the selected maximum.

Which attempts count (one class or all of a student's classes) is not decided
here: the caller that builds the input chooses it. P0-06 E1 and P0-02 A3 still
differ on this and need a decision before #46 and #47.

## Limits and review

No shared file, schema, migration, lock file or frontend file changed.
`backend/agents/__init__.py` was not added, so the agent package layout stays
with #17. Saving proposals, teacher approval, activation and membership freezing
belong to #47; screens and the "Calculated" label belong to #48.

Issue #45 remains open for review and merge. No peer approval or issue closure is
claimed by this verification record.
