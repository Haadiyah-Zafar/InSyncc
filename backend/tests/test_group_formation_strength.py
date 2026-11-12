"""Tests for issue #46: strength-based group formation (report 5.7.3, P0-06 D1)."""

import copy
import random
from fractions import Fraction
from itertools import combinations

import pytest
from agents.heuristics.group_formation import (
    GroupFormationHeuristic,
    LearnerPerformance,
    PlacedLearner,
    TopicResult,
    complementarity,
)


def learner(student_id, **topics):
    return LearnerPerformance(
        student_id=student_id,
        topic_results=tuple(
            TopicResult(topic_id=topic, correct=correct, attempted=total)
            for topic, (correct, total) in topics.items()
        ),
    )


def placed(item):
    return PlacedLearner(
        student_id=item.student_id,
        overall_score=item.overall_score,
        total_correct=item.total_correct,
        total_attempted=item.total_attempted,
        strong_topics=item.strong_topics,
        weak_topics=item.weak_topics,
    )


def propose(learners, max_group_size):
    return GroupFormationHeuristic().propose_strength_based(learners, max_group_size)


def group_ids(proposal):
    return [list(group.student_ids) for group in proposal.groups]


def test_strong_and_weak_thresholds_are_inclusive():
    item = learner(
        "s",
        at_70=(7, 10),
        at_69=(69, 100),
        at_51=(51, 100),
        at_50=(5, 10),
        unassessed=(0, 0),
    )

    assert item.strong_topics == {"at_70"}
    assert item.weak_topics == {"at_50"}


def test_report_pair_example_complements_in_both_topics():
    # Report 5.7.3: A strong in Programming, weak in Databases; B the reverse.
    a = learner("a", programming=(9, 10), databases=(4, 10))
    b = learner("b", programming=(3, 10), databases=(8, 10))

    assert complementarity(placed(a), placed(b)) == 2
    assert complementarity(placed(b), placed(a)) == 2


@pytest.mark.parametrize(
    ("first", "second", "expected"),
    [
        ((9, 10), (3, 10), 1),  # strong and weak
        ((9, 10), (8, 10), 0),  # both strong
        ((3, 10), (4, 10), 0),  # both weak
        ((9, 10), (6, 10), 0),  # strong and average
        ((3, 10), (6, 10), 0),  # weak and average
        ((9, 10), (0, 0), 0),  # strong and unassessed
        ((3, 10), (0, 0), 0),  # weak and unassessed
    ],
)
def test_only_strong_weak_pairs_count(first, second, expected):
    a = learner("a", loops=first, other=(1, 1))
    b = learner("b", loops=second, other=(1, 1))

    assert complementarity(placed(a), placed(b)) == expected


def test_group_score_sums_every_pair():
    a = learner("a", loops=(9, 10), lists=(2, 10))
    b = learner("b", loops=(2, 10), lists=(9, 10))
    c = learner("c", loops=(3, 10), lists=(3, 10))
    proposal = propose([a, b, c], 3)

    (group,) = proposal.groups
    # a-b: 2, a-c: 1 (loops), b-c: 1 (lists).
    assert group.complementarity_score == 4
    assert proposal.total_complementarity == 4


def test_learners_join_the_group_they_complement_most():
    # Overall order: s2 (0.60), s1 (0.55), s3 (0.55), s4 (0.50); size 2.
    learners = [
        learner("s1", programming=(9, 10), databases=(2, 10)),
        learner("s2", programming=(3, 10), databases=(9, 10)),
        learner("s3", programming=(8, 10), databases=(3, 10)),
        learner("s4", programming=(2, 10), databases=(8, 10)),
    ]
    proposal = propose(learners, 2)

    assert group_ids(proposal) == [["s2", "s1"], ["s3", "s4"]]
    assert [g.complementarity_score for g in proposal.groups] == [2, 2]

    # The balanced rule pairs alike learners here, with no complementarity.
    balanced = GroupFormationHeuristic().propose_balanced(learners, 2)
    assert balanced.total_complementarity == 0


def test_equal_complementarity_goes_to_fewer_members_then_lower_number():
    # No strong/weak topics, so every gain is 0. "b" sees equal scores and
    # chooses the empty group 2; "c" can only join group 1.
    learners = [
        learner("a", loops=(6, 10)),
        learner("b", loops=(6, 10)),
        learner("c", loops=(6, 10)),
    ]
    proposal = propose(learners, 2)

    assert group_ids(proposal) == [["a", "c"], ["b"]]
    assert proposal.total_complementarity == 0


@pytest.mark.parametrize(
    ("count", "max_size", "expected_sizes"),
    [
        (6, 3, [3, 3]),
        (7, 3, [3, 2, 2]),
        (10, 3, [3, 3, 2, 2]),
        (5, 2, [2, 2, 1]),
    ],
)
def test_sizes_match_the_balanced_rule(count, max_size, expected_sizes):
    learners = [
        learner(f"s{index:02d}", loops=(index % 10, 9), lists=((index * 3) % 10, 9))
        for index in range(count)
    ]
    proposal = propose(learners, max_size)
    balanced = GroupFormationHeuristic().propose_balanced(learners, max_size)

    assert [g.size for g in proposal.groups] == expected_sizes
    assert [g.size for g in balanced.groups] == expected_sizes


def test_no_data_learners_are_left_for_the_teacher():
    learners = [
        learner("new", loops=(0, 0)),
        learner("a", loops=(9, 10)),
        learner("b", loops=(2, 10)),
    ]
    proposal = propose(learners, 2)

    assert proposal.no_data_student_ids == ("new",)
    assert proposal.needs_teacher_placement is True
    assert group_ids(proposal) == [["a", "b"]]


def test_result_is_only_an_inactive_proposal():
    proposal = propose([learner("a", loops=(1, 2))], 2)

    assert proposal.strategy == "strength_based"
    assert proposal.status == "proposed"
    assert not hasattr(proposal, "approve")
    assert not hasattr(proposal, "activate")


def test_input_is_not_mutated_and_order_does_not_matter():
    learners = [
        learner("a", loops=(9, 10), lists=(2, 10)),
        learner("b", loops=(2, 10), lists=(9, 10)),
        learner("c", loops=(8, 10), lists=(5, 10)),
        learner("d", loops=(4, 10), lists=(7, 10)),
    ]
    before = copy.deepcopy(learners)
    expected = group_ids(propose(learners, 2))

    shuffled = list(learners)
    random.Random(46).shuffle(shuffled)

    assert group_ids(propose(shuffled, 2)) == expected
    assert learners == before


def reference_strength_based(learners, max_size):
    """Literal reading of report 5.7.3 and P0-06 D1, used to check the module."""
    scored = [placed(item) for item in learners if item.has_data]
    scored.sort(key=lambda item: item.student_id)
    scored.sort(key=lambda item: item.overall_score, reverse=True)
    if not scored:
        return []
    k = -(-len(scored) // max_size)
    small, extra = divmod(len(scored), k)
    caps = [small + 1 if i < extra else small for i in range(k)]
    groups = [[] for _ in range(k)]
    for item in scored:
        best = None
        for i, group in enumerate(groups):
            if len(group) >= caps[i]:
                continue
            gain = sum(complementarity(item, other) for other in group)
            key = (-gain, len(group), i)
            if best is None or key < best[0]:
                best = (key, i)
        groups[best[1]].append(item)
    return [[item.student_id for item in group] for group in groups]


def test_matches_the_literal_rule_and_constraints_for_many_inputs():
    rng = random.Random(4646)
    topics = ["t1", "t2", "t3", "t4"]
    for _ in range(300):
        count = rng.randint(1, 20)
        max_size = rng.randint(1, 5)
        learners = []
        for index in range(count):
            results = {}
            for topic in topics:
                attempted = rng.choice([0, 4, 5, 10])
                results[topic] = (rng.randint(0, attempted), attempted)
            learners.append(learner(f"s{index:02d}", **results))

        proposal = propose(learners, max_size)

        assert group_ids(proposal) == reference_strength_based(learners, max_size)
        sizes = [group.size for group in proposal.groups]
        placed_ids = [sid for group in proposal.groups for sid in group.student_ids]
        scored = [item.student_id for item in learners if item.has_data]
        assert all(1 <= size <= max_size for size in sizes)
        if sizes:
            assert max(sizes) - min(sizes) <= 1
        assert sorted(placed_ids) == sorted(scored)
        assert len(placed_ids) == len(set(placed_ids))
        for group in proposal.groups:
            assert group.complementarity_score == sum(
                complementarity(x, y) for x, y in combinations(group.members, 2)
            )


def test_exposes_each_learners_strong_and_weak_topics():
    proposal = propose([learner("a", loops=(9, 10), lists=(1, 10), sets=(6, 10))], 2)
    (member,) = proposal.groups[0].members

    assert member.strong_topics == {"loops"}
    assert member.weak_topics == {"lists"}
    assert member.overall_score == Fraction(16, 30)


def test_rejects_invalid_input_like_the_balanced_rule():
    with pytest.raises(ValueError):
        propose([learner("a", loops=(1, 2))], 0)
    with pytest.raises(TypeError):
        propose([learner("a", loops=(1, 2))], 2.0)
    with pytest.raises(ValueError):
        propose([learner("a", loops=(1, 2)), learner("a", loops=(2, 2))], 2)
