"""Tests for issue #45: balanced group formation (report 5.7, P0-06 A-F)."""

import copy
import random
from fractions import Fraction

import pytest
from agents.heuristics.group_formation import (
    GroupFormationHeuristic,
    LearnerPerformance,
    TopicResult,
)


def learner(student_id, *results):
    return LearnerPerformance(
        student_id=student_id,
        topic_results=tuple(
            TopicResult(topic_id=f"topic-{index}", correct=correct, attempted=total)
            for index, (correct, total) in enumerate(results)
        ),
    )


def propose(learners, max_group_size):
    return GroupFormationHeuristic().propose_balanced(learners, max_group_size)


def group_ids(proposal):
    return [list(group.student_ids) for group in proposal.groups]


# Report 5.7.4 worked example: 0.90, 0.82, 0.75, 0.60, 0.48, 0.40 with size 3.
REPORT_LEARNERS = [
    learner("s-090", (9, 10)),
    learner("s-082", (41, 50)),
    learner("s-075", (3, 4)),
    learner("s-060", (3, 5)),
    learner("s-048", (12, 25)),
    learner("s-040", (2, 5)),
]


def test_report_worked_example():
    proposal = propose(REPORT_LEARNERS, 3)

    assert group_ids(proposal) == [
        ["s-090", "s-060", "s-048"],
        ["s-082", "s-075", "s-040"],
    ]
    first, second = proposal.groups
    assert first.mean_score == Fraction(66, 100)
    assert second.mean_score == Fraction(197, 300)
    assert proposal.balance_measure == Fraction(1, 300)
    assert proposal.no_data_student_ids == ()
    assert proposal.singleton_group_numbers == ()


def test_result_is_only_an_inactive_proposal():
    proposal = propose(REPORT_LEARNERS, 3)

    assert proposal.strategy == "balanced"
    assert proposal.status == "proposed"
    assert not hasattr(proposal, "approve")
    assert not hasattr(proposal, "activate")


def test_overall_score_is_pooled_not_averaged():
    # Topic accuracies 1/1 and 0/9 average to 0.5, but pooled the score is 1/10.
    pooled = learner("pooled", (1, 1), (0, 9))
    assert pooled.overall_score == Fraction(1, 10)

    proposal = propose([pooled, learner("other", (3, 10))], 2)
    (group,) = proposal.groups
    assert [m.overall_score for m in group.members] == [
        Fraction(3, 10),
        Fraction(1, 10),
    ]


def test_topics_without_attempts_are_ignored():
    with_empty_topic = learner("a", (4, 5), (0, 0))
    assert with_empty_topic.overall_score == Fraction(4, 5)


@pytest.mark.parametrize(
    ("count", "max_size", "expected_sizes"),
    [
        (6, 3, [3, 3]),
        (7, 3, [3, 2, 2]),
        (8, 3, [3, 3, 2]),
        (9, 4, [3, 3, 3]),
        (10, 3, [3, 3, 2, 2]),
        (10, 4, [4, 3, 3]),
        (3, 5, [3]),
    ],
)
def test_group_count_and_leftovers_follow_a2(count, max_size, expected_sizes):
    learners = [learner(f"s{index:02d}", (index + 1, 20)) for index in range(count)]
    proposal = propose(learners, max_size)

    # Lower-numbered groups take the extra place, so sizes never increase.
    assert [g.size for g in proposal.groups] == expected_sizes
    assert len(proposal.groups) == -(-count // max_size)


def test_extra_place_goes_to_the_lower_numbered_group():
    # Five learners, size 3: groups of three and two. Group 1 (which starts
    # with the strongest learner) has the extra place.
    learners = [
        learner("s-09", (9, 10)),
        learner("s-07", (7, 10)),
        learner("s-06", (6, 10)),
        learner("s-05", (5, 10)),
        learner("s-04", (4, 10)),
    ]
    proposal = propose(learners, 3)

    assert group_ids(proposal) == [["s-09", "s-05", "s-04"], ["s-07", "s-06"]]
    first, second = proposal.groups
    assert first.mean_score == Fraction(6, 10)
    # The group of two divides by its two members (1.3 / 2), not by the maximum 3.
    assert second.mean_score == Fraction(65, 100)
    assert proposal.balance_measure == Fraction(5, 100)


def test_singleton_group_is_kept_and_flagged():
    learners = [learner(f"s{index}", (index + 1, 10)) for index in range(5)]
    proposal = propose(learners, 2)

    assert [g.size for g in proposal.groups] == [2, 2, 1]
    assert proposal.singleton_group_numbers == (3,)

    alone = propose([learner("only", (1, 2))], 3)
    assert group_ids(alone) == [["only"]]
    assert alone.singleton_group_numbers == (1,)


def test_equal_totals_go_to_the_group_with_fewer_members():
    # All three learners have data with a score of zero. The third learner sees
    # equal totals and equal sizes, so the lower group number is used.
    # The second learner sees equal totals but group 2 is empty: fewer members.
    learners = [learner("a", (0, 4)), learner("b", (0, 4)), learner("c", (0, 4))]
    proposal = propose(learners, 2)

    assert group_ids(proposal) == [["a", "c"], ["b"]]
    assert proposal.no_data_student_ids == ()


def test_remaining_ties_use_the_lower_group_number():
    # After "a" and "b", both groups total 0.5 with one member each, so "c"
    # goes to group 1. Equal scores are ordered by student_id, whatever the
    # input order ("b" is given before "a" here).
    learners = [
        learner("b", (1, 2)),
        learner("a", (1, 2)),
        learner("d", (1, 5)),
        learner("c", (1, 5)),
    ]
    proposal = propose(learners, 2)

    assert group_ids(proposal) == [["a", "c"], ["b", "d"]]


def test_no_data_learners_are_left_for_the_teacher():
    learners = [
        learner("new-1"),
        learner("scored-1", (3, 4)),
        learner("new-2", (0, 0)),
        learner("scored-2", (1, 4)),
    ]
    proposal = propose(learners, 2)

    assert proposal.no_data_student_ids == ("new-1", "new-2")
    assert proposal.needs_teacher_placement is True
    placed = [sid for group in proposal.groups for sid in group.student_ids]
    assert sorted(placed) == ["scored-1", "scored-2"]

    only_new = propose([learner("new-3")], 3)
    assert only_new.groups == ()
    assert only_new.no_data_student_ids == ("new-3",)
    assert only_new.balance_measure is None


def test_empty_input_gives_an_empty_proposal():
    proposal = propose([], 3)

    assert proposal.groups == ()
    assert proposal.no_data_student_ids == ()
    assert proposal.needs_teacher_placement is False


def test_input_is_not_mutated():
    learners = list(REPORT_LEARNERS)
    before = copy.deepcopy(learners)

    propose(learners, 3)

    assert learners == before


def test_same_learners_in_any_order_give_the_same_proposal():
    expected = group_ids(propose(REPORT_LEARNERS, 3))
    shuffled = list(REPORT_LEARNERS)
    random.Random(45).shuffle(shuffled)

    assert group_ids(propose(shuffled, 3)) == expected


def test_size_limit_and_unique_membership_hold_for_many_inputs():
    rng = random.Random(2026)
    for _ in range(300):
        count = rng.randint(1, 30)
        max_size = rng.randint(1, 6)
        learners = []
        for index in range(count):
            attempted = rng.randint(0, 12)
            correct = rng.randint(0, attempted)
            learners.append(learner(f"s{index:02d}", (correct, attempted)))

        proposal = propose(learners, max_size)

        sizes = [group.size for group in proposal.groups]
        placed = [sid for group in proposal.groups for sid in group.student_ids]
        scored = [item.student_id for item in learners if item.has_data]
        assert all(1 <= size <= max_size for size in sizes)
        if sizes:
            assert max(sizes) - min(sizes) <= 1
            assert sizes == sorted(sizes, reverse=True)
            assert len(sizes) == -(-len(scored) // max_size)
        assert len(placed) == len(set(placed))
        assert sorted(placed) == sorted(scored)
        assert set(proposal.no_data_student_ids).isdisjoint(placed)
        numbers = [group.group_number for group in proposal.groups]
        assert numbers == list(range(1, len(numbers) + 1))


@pytest.mark.parametrize("max_size", [0, -1])
def test_rejects_group_size_below_one(max_size):
    with pytest.raises(ValueError):
        propose(REPORT_LEARNERS, max_size)


@pytest.mark.parametrize("max_size", [2.0, "3", True])
def test_rejects_non_integer_group_size(max_size):
    with pytest.raises(TypeError):
        propose(REPORT_LEARNERS, max_size)


def test_rejects_duplicate_students():
    with pytest.raises(ValueError):
        propose([learner("same", (1, 2)), learner("same", (2, 2))], 2)


def test_rejects_invalid_counts_and_topics():
    with pytest.raises(ValueError):
        TopicResult(topic_id="t", correct=3, attempted=2)
    with pytest.raises(ValueError):
        TopicResult(topic_id="t", correct=-1, attempted=2)
    with pytest.raises(TypeError):
        TopicResult(topic_id="t", correct=True, attempted=2)
    with pytest.raises(ValueError):
        TopicResult(topic_id="", correct=1, attempted=2)
    with pytest.raises(ValueError):
        LearnerPerformance(
            student_id="s",
            topic_results=(
                TopicResult(topic_id="t", correct=1, attempted=2),
                TopicResult(topic_id="t", correct=1, attempted=2),
            ),
        )
    with pytest.raises(ValueError):
        LearnerPerformance(student_id="", topic_results=())
    with pytest.raises(TypeError):
        propose([("not", "a learner")], 2)
