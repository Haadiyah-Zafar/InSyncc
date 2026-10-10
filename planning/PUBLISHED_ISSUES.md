# Published InSync implementation backlog

Plan v0.2 was approved/published on 9 October 2026. The v0.3 scope/runtime amendment was approved and published on 10 October 2026 (Asia/Karachi).

[All issues](https://github.com/Haadiyah-Zafar/InSyncc/issues) · [Phase milestones](https://github.com/Haadiyah-Zafar/InSyncc/milestones) · [Approved scope record](decisions/P0-01-pilot-scope.md)

61 planned issues; eight milestones; 196 verified native dependency relationships. Other repository issues are outside this count. A/B/C are suggested streams, not assigned users. Status is a snapshot; check live prerequisites before starting. Native blockers include both start and closure dependencies.

Issue #2 is approved and closed; #11 is Ready. Runtime issue #64 is Blocked on its approved contracts/foundations. Other P0 design decisions remain pending. OpenRouter and the verified 10–15-model chain remain required; exact routes/models/budgets and live qualification remain pending.

| Plan ID | GitHub issue | Phase | Suggested stream | Recorded status |
|---|---|---|---|---|
| P0-01 | [#2 — Approve pilot scope, screen inventory, and evaluation baseline](https://github.com/Haadiyah-Zafar/InSyncc/issues/2) | P0 | A | Done |
| P0-02 | [#3 — Approve learner state, graph ownership, and recovery contracts](https://github.com/Haadiyah-Zafar/InSyncc/issues/3) | P0 | C | Ready |
| P0-03 | [#4 — Approve identity, access, enrollment, and teacher verification](https://github.com/Haadiyah-Zafar/InSyncc/issues/4) | P0 | B | Ready |
| P0-04 | [#5 — Approve quiz lifecycle, adaptation edge cases, and in-attempt review](https://github.com/Haadiyah-Zafar/InSyncc/issues/5) | P0 | C | Ready |
| P0-05 | [#6 — Approve tutor, progress, and recommendation semantics](https://github.com/Haadiyah-Zafar/InSyncc/issues/6) | P0 | C | Ready |
| P0-06 | [#7 — Approve grouping, discussion, and shared workspace behavior](https://github.com/Haadiyah-Zafar/InSyncc/issues/7) | P0 | A | Ready |
| P0-07 | [#8 — Approve service choices, background execution, and operations](https://github.com/Haadiyah-Zafar/InSyncc/issues/8) | P0 | B | Ready |
| P0-08 | [#9 — Approve the canonical schema and domain model](https://github.com/Haadiyah-Zafar/InSyncc/issues/9) | P0 | B | Blocked |
| P0-09 | [#10 — Approve API, event, agent, and screen contracts](https://github.com/Haadiyah-Zafar/InSyncc/issues/10) | P0 | A | Blocked |
| P1-01 | [#11 — Establish repository tooling and contribution workflow](https://github.com/Haadiyah-Zafar/InSyncc/issues/11) | P1 | B | Ready |
| P1-02 | [#12 — Create the FastAPI application foundation](https://github.com/Haadiyah-Zafar/InSyncc/issues/12) | P1 | B | Blocked |
| P1-03 | [#13 — Create the React/TypeScript application shell](https://github.com/Haadiyah-Zafar/InSyncc/issues/13) | P1 | A | Blocked |
| P1-04 | [#14 — Provide reproducible development and test services](https://github.com/Haadiyah-Zafar/InSyncc/issues/14) | P1 | C | Blocked |
| P1-05 | [#15 — Run build and tests in pull-request CI](https://github.com/Haadiyah-Zafar/InSyncc/issues/15) | P1 | A | Blocked |
| P1-06 | [#16 — Implement core database migrations and access-policy foundation](https://github.com/Haadiyah-Zafar/InSyncc/issues/16) | P1 | B | Blocked |
| P1-07 | [#17 — Implement LangGraph state, routing, and review infrastructure](https://github.com/Haadiyah-Zafar/InSyncc/issues/17) | P1 | C | Blocked |
| P1-08 | [#18 — Implement model-provider wrappers and validated outputs](https://github.com/Haadiyah-Zafar/InSyncc/issues/18) | P1 | C | Blocked |
| P1-09 | [#19 — Implement background execution and recovery](https://github.com/Haadiyah-Zafar/InSyncc/issues/19) | P1 | B | Blocked |
| P1-10 | [#20 — Verify Yjs synchronization and controlled editing with FastAPI](https://github.com/Haadiyah-Zafar/InSyncc/issues/20) | P1 | C | Blocked |
| P2-01 | [#21 — Implement backend authentication and authorization](https://github.com/Haadiyah-Zafar/InSyncc/issues/21) | P2 | B | Blocked |
| P2-02 | [#22 — Build login, account recovery, and role-aware navigation](https://github.com/Haadiyah-Zafar/InSyncc/issues/22) | P2 | A | Blocked |
| P2-03 | [#23 — Implement classes, enrollment, topics, and concepts](https://github.com/Haadiyah-Zafar/InSyncc/issues/23) | P2 | B | Blocked |
| P2-04 | [#24 — Implement class learning sessions and lifecycle events](https://github.com/Haadiyah-Zafar/InSyncc/issues/24) | P2 | B | Blocked |
| P2-05 | [#25 — Build class, enrollment, and session screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/25) | P2 | A | Blocked |
| P2-06 | [#26 — Verify the core teacher/student journey with pilot fixtures](https://github.com/Haadiyah-Zafar/InSyncc/issues/26) | P2 | C | Blocked |
| P3-01 | [#27 — Implement learning-material upload and access](https://github.com/Haadiyah-Zafar/InSyncc/issues/27) | P3 | B | Blocked |
| P3-02 | [#28 — Implement extraction, chunking, and embeddings](https://github.com/Haadiyah-Zafar/InSyncc/issues/28) | P3 | C | Blocked |
| P3-03 | [#29 — Implement authorized top-three material retrieval](https://github.com/Haadiyah-Zafar/InSyncc/issues/29) | P3 | C | Blocked |
| P3-04 | [#30 — Implement the Tutor Agent and tutoring persistence](https://github.com/Haadiyah-Zafar/InSyncc/issues/30) | P3 | C | Blocked |
| P3-05 | [#31 — Build teacher material management screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/31) | P3 | A | Blocked |
| P3-06 | [#32 — Build and integrate student tutoring screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/32) | P3 | A | Blocked |
| P4-01 | [#33 — Implement manual quiz authoring, review, and assignment](https://github.com/Haadiyah-Zafar/InSyncc/issues/33) | P4 | B | Blocked |
| P4-02 | [#34 — Implement adaptive difficulty, question selection, and scoring](https://github.com/Haadiyah-Zafar/InSyncc/issues/34) | P4 | C | Blocked |
| P4-03 | [#35 — Implement Quiz Agent draft generation and question review requests](https://github.com/Haadiyah-Zafar/InSyncc/issues/35) | P4 | C | Blocked |
| P4-04 | [#36 — Implement durable adaptive quiz attempts](https://github.com/Haadiyah-Zafar/InSyncc/issues/36) | P4 | B | Blocked |
| P4-05 | [#37 — Build teacher quiz authoring and review screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/37) | P4 | A | Blocked |
| P4-06 | [#38 — Build and integrate adaptive student quiz screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/38) | P4 | A | Blocked |
| P5-01 | [#39 — Implement the Progress Agent and evidence analysis](https://github.com/Haadiyah-Zafar/InSyncc/issues/39) | P5 | C | Blocked |
| P5-02 | [#40 — Implement Teacher Assistant recommendations and group-performance inputs](https://github.com/Haadiyah-Zafar/InSyncc/issues/40) | P5 | C | Blocked |
| P5-03 | [#41 — Implement teacher decisions and approved-action execution](https://github.com/Haadiyah-Zafar/InSyncc/issues/41) | P5 | B | Blocked |
| P5-04 | [#42 — Build learner progress and teacher performance dashboards](https://github.com/Haadiyah-Zafar/InSyncc/issues/42) | P5 | A | Blocked |
| P5-05 | [#43 — Build recommendation evidence and teacher review screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/43) | P5 | A | Blocked |
| P5-06 | [#44 — Verify the complete tutoring-to-teacher-review learning cycle](https://github.com/Haadiyah-Zafar/InSyncc/issues/44) | P5 | B | Blocked |
| P6-01 | [#45 — Implement balanced group formation](https://github.com/Haadiyah-Zafar/InSyncc/issues/45) | P6 | C | Blocked |
| P6-02 | [#46 — Implement strength-based group formation](https://github.com/Haadiyah-Zafar/InSyncc/issues/46) | P6 | C | Blocked |
| P6-03 | [#47 — Implement group proposals, manual groups, approval, and problems](https://github.com/Haadiyah-Zafar/InSyncc/issues/47) | P6 | B | Blocked |
| P6-04 | [#48 — Build teacher group and problem management screens](https://github.com/Haadiyah-Zafar/InSyncc/issues/48) | P6 | A | Blocked |
| P6-05 | [#49 — Implement authenticated group chat and presence](https://github.com/Haadiyah-Zafar/InSyncc/issues/49) | P6 | B | Blocked |
| P6-06 | [#50 — Implement Yjs workspace synchronization, controlled editing, and recovery](https://github.com/Haadiyah-Zafar/InSyncc/issues/50) | P6 | B | Blocked |
| P6-07 | [#52 — Build the Yjs shared editor, student workspace, and teacher monitoring](https://github.com/Haadiyah-Zafar/InSyncc/issues/52) | P6 | A | Blocked |
| P6-08 | [#51 — Implement Discussion Agent hints and trigger coordination](https://github.com/Haadiyah-Zafar/InSyncc/issues/51) | P6 | C | Blocked |
| P6-09 | [#53 — Verify collaboration and its evidence-to-progress loop](https://github.com/Haadiyah-Zafar/InSyncc/issues/53) | P6 | C | Blocked |
| P6-10 | [#64 — Implement isolated Python execution and run results](https://github.com/Haadiyah-Zafar/InSyncc/issues/64) | P6 | B | Blocked |
| P7-01 | [#54 — Implement content reporting and approved data controls](https://github.com/Haadiyah-Zafar/InSyncc/issues/54) | P7 | A | Blocked |
| P7-02 | [#55 — Integrate operational visibility and pilot cost tracking](https://github.com/Haadiyah-Zafar/InSyncc/issues/55) | P7 | B | Blocked |
| P7-03 | [#56 — Run authorization, isolation, and recovery regression tests](https://github.com/Haadiyah-Zafar/InSyncc/issues/56) | P7 | B | Blocked |
| P7-04 | [#57 — Run educational quality and pilot evaluation](https://github.com/Haadiyah-Zafar/InSyncc/issues/57) | P7 | C | Blocked |
| P7-05 | [#58 — Verify accessibility, browser compatibility, and performance](https://github.com/Haadiyah-Zafar/InSyncc/issues/58) | P7 | A | Blocked |
| P7-06 | [#59 — Prepare deployment and demonstrate backup restoration](https://github.com/Haadiyah-Zafar/InSyncc/issues/59) | P7 | B | Blocked |
| P7-07 | [#60 — Synchronize approved report, diagrams, and developer documentation](https://github.com/Haadiyah-Zafar/InSyncc/issues/60) | P7 | A | Blocked |
| P7-08 | [#61 — Accept the pilot release and finalize the handoff](https://github.com/Haadiyah-Zafar/InSyncc/issues/61) | P7 | C | Blocked |

Suggested parallel tasks: #11 (tooling), #4 (identity/access), and #3 (state/recovery). Streams are suggestions; distribute these three tasks across available contributors without assuming account assignments.

Publication helpers: `python planning/publish_github_issues.py` validates locally; `--check-access` reads GitHub; `--publish` reconciles issue bodies; `--link-dependencies` reconciles native blockers. `PUBLICATION_STATE.json` records publication evidence. Review live changes before publishing.

Current-instance GitHub access is verified. The previously saved environment draft is separate from environment publication.
