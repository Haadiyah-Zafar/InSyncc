"""Balanced group formation for the Teacher Assistant Agent (issue #45, P6-01).

Source rules: report section 5.7 and ``INSYNC_CODEX_CONTEXT.md`` section 6.5.
Approved edge cases: ``planning/decisions/P0-06-grouping-workspace.md`` section 7.

- Overall score is pooled: total correct answers / total attempted answers
  (report 5.7.1). It is never an average of per-topic or per-quiz accuracies.
- Topics with no attempts are left out and are not treated as weaknesses.
- Learners are sorted from highest to lowest overall score. Each learner goes
  into the non-full group with the lowest current total score (report 5.7.2).
- Tie on the total score: the group with fewer members (report 5.7.4). Remaining
  tie: the lower group number, so every run gives the same result (P0-06 C).
- Group count and leftovers follow P0-06 A2, which replaces the report's single
  smaller remainder group: the fewest groups that respect the maximum size, with
  sizes that differ by at most one (10 learners, size 3: 3, 3, 2, 2). When the
  learners do not divide evenly, the lower-numbered groups have the one extra
  place.
- Two separate orderings: learners with equal overall scores are ordered by
  student_id; groups with equal totals and sizes are chosen by group number.
- A group of one is kept and flagged for teacher review (P0-06 B1).
- Learners with no attempted answers are not placed. They are returned as
  "no data" for the teacher to place (P0-06 C1).
- The result is only a proposal. Nothing here saves, approves or activates a
  group or gives a student access; that belongs to #47 and teacher approval.

Which attempts are counted (one class, or all of a student's classes) is chosen
by the caller that builds the input. This module only applies the rules to the
counts it receives.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction
from typing import Iterable, Literal

BALANCED_STRATEGY: Literal["balanced"] = "balanced"
PROPOSED_STATUS: Literal["proposed"] = "proposed"


def _require_count(value: object, name: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an int")
    if value < 0:
        raise ValueError(f"{name} must not be negative")
    return value


@dataclass(frozen=True)
class TopicResult:
    """Answer counts for one topic, as supplied by progress analysis."""

    topic_id: str
    correct: int
    attempted: int

    def __post_init__(self) -> None:
        if not isinstance(self.topic_id, str) or not self.topic_id:
            raise ValueError("topic_id must be a non-empty string")
        _require_count(self.correct, "correct")
        _require_count(self.attempted, "attempted")
        if self.correct > self.attempted:
            raise ValueError("correct must not be greater than attempted")


@dataclass(frozen=True)
class LearnerPerformance:
    """One learner's topic results used as grouping input."""

    student_id: str
    topic_results: tuple[TopicResult, ...] = ()

    def __post_init__(self) -> None:
        if not isinstance(self.student_id, str) or not self.student_id:
            raise ValueError("student_id must be a non-empty string")
        if not isinstance(self.topic_results, tuple):
            raise TypeError("topic_results must be a tuple of TopicResult")
        seen: set[str] = set()
        for result in self.topic_results:
            if not isinstance(result, TopicResult):
                raise TypeError("topic_results must contain TopicResult items")
            if result.topic_id in seen:
                raise ValueError(f"duplicate topic_id {result.topic_id!r}")
            seen.add(result.topic_id)

    @property
    def total_correct(self) -> int:
        return sum(result.correct for result in self.topic_results)

    @property
    def total_attempted(self) -> int:
        return sum(result.attempted for result in self.topic_results)

    @property
    def has_data(self) -> bool:
        return self.total_attempted > 0

    @property
    def overall_score(self) -> Fraction | None:
        """Pooled score O_i, or None when the learner has no attempts."""
        if not self.has_data:
            return None
        return Fraction(self.total_correct, self.total_attempted)


@dataclass(frozen=True)
class PlacedLearner:
    student_id: str
    overall_score: Fraction
    total_correct: int
    total_attempted: int


@dataclass(frozen=True)
class ProposedGroup:
    """A proposed group with the scores that explain it."""

    group_number: int
    members: tuple[PlacedLearner, ...]

    @property
    def size(self) -> int:
        return len(self.members)

    @property
    def total_score(self) -> Fraction:
        return sum((member.overall_score for member in self.members), Fraction(0))

    @property
    def mean_score(self) -> Fraction:
        """Group average A_k = sum of O_i / |G_k| (report 5.7.2).

        |G_k| is this group's actual number of members, never the selected
        maximum group size.
        """
        return self.total_score / self.size

    @property
    def is_singleton(self) -> bool:
        return self.size == 1

    @property
    def student_ids(self) -> tuple[str, ...]:
        return tuple(member.student_id for member in self.members)


@dataclass(frozen=True)
class GroupProposal:
    """Inactive proposal for the Teacher Assistant Agent and teacher review."""

    strategy: Literal["balanced"]
    status: Literal["proposed"]
    max_group_size: int
    groups: tuple[ProposedGroup, ...]
    no_data_student_ids: tuple[str, ...]

    @property
    def balance_measure(self) -> Fraction | None:
        """B = max(A_k) - min(A_k); smaller means more even groups."""
        if not self.groups:
            return None
        means = [group.mean_score for group in self.groups]
        return max(means) - min(means)

    @property
    def singleton_group_numbers(self) -> tuple[int, ...]:
        return tuple(group.group_number for group in self.groups if group.is_singleton)

    @property
    def needs_teacher_placement(self) -> bool:
        """True while some learners still have to be placed by the teacher."""
        return bool(self.no_data_student_ids)


class GroupFormationHeuristic:
    """Group rules used by the Teacher Assistant Agent. Balanced strategy only."""

    def propose_balanced(
        self,
        learners: Iterable[LearnerPerformance],
        max_group_size: int,
    ) -> GroupProposal:
        if isinstance(max_group_size, bool) or not isinstance(max_group_size, int):
            raise TypeError("max_group_size must be an int")
        if max_group_size < 1:
            raise ValueError("max_group_size must be at least 1")

        learner_list = list(learners)
        seen: set[str] = set()
        for learner in learner_list:
            if not isinstance(learner, LearnerPerformance):
                raise TypeError("learners must contain LearnerPerformance items")
            if learner.student_id in seen:
                raise ValueError(f"duplicate student_id {learner.student_id!r}")
            seen.add(learner.student_id)

        no_data = tuple(
            learner.student_id for learner in learner_list if not learner.has_data
        )
        scored = [
            PlacedLearner(
                student_id=learner.student_id,
                overall_score=learner.overall_score,
                total_correct=learner.total_correct,
                total_attempted=learner.total_attempted,
            )
            for learner in learner_list
            if learner.has_data
        ]
        # Highest score first. Equal scores are ordered by student_id so that
        # the same learners always give the same proposal, whatever the input order.
        scored.sort(key=lambda learner: learner.student_id)
        scored.sort(key=lambda learner: learner.overall_score, reverse=True)

        groups = _place_balanced(scored, max_group_size)
        return GroupProposal(
            strategy=BALANCED_STRATEGY,
            status=PROPOSED_STATUS,
            max_group_size=max_group_size,
            groups=groups,
            no_data_student_ids=no_data,
        )


def _place_balanced(
    ordered: list[PlacedLearner], max_group_size: int
) -> tuple[ProposedGroup, ...]:
    count = len(ordered)
    if count == 0:
        return ()

    # P0-06 A2: fewest groups within the maximum size; sizes differ by at most one.
    group_count = -(-count // max_group_size)
    smaller_size, larger_groups = divmod(count, group_count)
    larger_size = smaller_size + 1

    # When the learners do not divide evenly, the lower-numbered groups take the
    # one extra place (chosen for #45: the strongest learner starts group 1, so
    # its extra place keeps group averages closer).
    capacities = [
        larger_size if index < larger_groups else smaller_size
        for index in range(group_count)
    ]
    members: list[list[PlacedLearner]] = [[] for _ in range(group_count)]
    totals = [Fraction(0)] * group_count

    for learner in ordered:
        open_indexes = [
            i for i in range(group_count) if len(members[i]) < capacities[i]
        ]
        # Lowest total score, then fewer members, then lower group number.
        target = min(open_indexes, key=lambda i: (totals[i], len(members[i]), i))
        members[target].append(learner)
        totals[target] += learner.overall_score

    return tuple(
        ProposedGroup(group_number=index + 1, members=tuple(group))
        for index, group in enumerate(members)
    )
