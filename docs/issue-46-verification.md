# Issue #46 verification

Prepared on 12 November 2026 (Asia/Karachi), branch
`feat/46-strength-based-group-formation`, based on `main` at `18daea7` (after
#45 merged in PR #84).

## Prerequisite evidence

#46 starts after #7 (P0-06), #10 (P0-09) and #12 (P1-02), which are closed, and
has no close-after dependencies. GitHub does not report it as blocked, although
the `status:blocked` label is still present. P0-06 §7 records D1 (balanced
placement, best complement) as approved by Anum on 7 November 2026.

## Implementation and checks

`GroupFormationHeuristic.propose_strength_based` is added to
`backend/agents/heuristics/group_formation.py`, next to the balanced rule from
#45. Both strategies share input checks, learner order, group sizes, tie rules
and no-data handling. It returns a proposal with status `proposed` and strategy
`strength_based` (P0-08 S12 names).

- Strong topic: accuracy of 0.70 or above; weak topic: 0.50 or below; values in
  between are neither (report §5.7.3). Topics with no attempts are neither.
  Exact fractions are used for the thresholds.
- Pairwise complementarity counts the topics where one learner is strong and the
  other is weak. The report's pair example (strong and weak in opposite topics)
  gives 2. A group's complementarity is the sum over every pair.
- D1: learners are taken in the balanced order (highest overall score first,
  equal scores by `student_id`). Each learner goes into the non-full group where
  it adds the most complementarity with the current members. Ties go to the group
  with fewer members, then the lower group number (report §5.7.4, P0-06 C).
- Group count and sizes are the same as #45 (P0-06 A2, extra place to the
  lower-numbered groups). B1 singletons are flagged. C1 learners with no topic
  data are returned as "no data".
- Each proposed learner carries its strong and weak topics, and each group its
  complementarity score, so the teacher can see why a group was formed.

`backend/tests/test_group_formation_strength.py` adds 22 pytest cases, including
300 random cases compared against a literal reading of D1 and checked for size,
uniqueness and pair sums. The balanced rule's output was compared with the
version merged in #84 in 5,000 random cases and is unchanged; all 27 #45 tests
still pass.

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

1. Topic-score scope: P0-06 E1 (a student's topic results across all of their
   classes), chosen by Areej (team member) on 12 November 2026; Anum informed.
   P0-02 A3 says cross-class transfer needs its own approval, so P0-02 should
   record E1 as that approval. The heuristic does not read classes itself; the
   caller that builds the input (#40/#47) applies the scope.
2. Learner order for D1: the balanced order (overall score, then `student_id`),
   read from D1's "same placement as the balanced rule".
3. Group sizes and the extra place follow #45 so both strategies give the same
   group sizes.
4. Explanation shown per proposal: each group's complementarity total and each
   learner's strong and weak topics.

## Limits and review

Only `group_formation.py` changed among existing files; the balanced method
keeps its name, inputs and results. No shared file, schema, migration, lock file
or frontend file changed. No optimizer or search (P0-06 D2) is used. Saving
proposals, teacher approval and activation belong to #47; screens belong to #48.

Issue #46 remains open for review and merge. No peer approval or issue closure is
claimed by this verification record.
