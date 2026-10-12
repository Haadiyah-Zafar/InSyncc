import { describe, expect, it } from "vitest";
import {
  boardReducer,
  initialBoard,
  selectInside,
  type BoardObject,
  type Point,
  type Proposal,
} from "./model";

const object: BoardObject = {
  id: "sample-code",
  kind: "code",
  content: "print(1)",
  x: 40,
  y: 48,
  width: 340,
  height: 240,
  author: "sample-tutor",
};
const proposal: Proposal = {
  id: "activity",
  object,
  revision: 0,
  status: "pending",
};

describe("preview board approval boundary", () => {
  it("requires explicit approval, applies once, and does not replay approval after undo", () => {
    const proposed = boardReducer(initialBoard, { type: "propose", proposal });
    expect(proposed.objects).toEqual([]);
    expect(boardReducer(initialBoard, { type: "add", object }).objects).toEqual(
      [],
    );
    const approved = boardReducer(proposed, {
      type: "approve",
      id: proposal.id,
    });
    expect(approved.objects).toEqual([object]);
    expect(
      boardReducer(approved, { type: "approve", id: proposal.id }).objects,
    ).toEqual([object]);
    const undone = boardReducer(approved, { type: "undo" });
    expect(undone.objects).toEqual([]);
    expect(
      boardReducer(undone, { type: "approve", id: proposal.id }).objects,
    ).toEqual([]);
    expect(boardReducer(undone, { type: "redo" }).objects).toEqual([object]);
  });

  it("dismisses without changing learner work and rejects late approval", () => {
    const withNote = boardReducer(initialBoard, {
      type: "add",
      object: { ...object, id: "note", author: "learner" },
    });
    const proposed = boardReducer(withNote, {
      type: "propose",
      proposal: { ...proposal, revision: withNote.revision },
    });
    const dismissed = boardReducer(proposed, {
      type: "dismiss",
      id: proposal.id,
    });
    expect(dismissed.objects).toEqual(withNote.objects);
    expect(dismissed.revision).toBe(withNote.revision);
    expect(
      boardReducer(dismissed, { type: "approve", id: proposal.id }).objects,
    ).toEqual(withNote.objects);
  });

  it("invalidates pending changes after learner edits even if the edit is undone", () => {
    const withNote = boardReducer(initialBoard, {
      type: "add",
      object: { ...object, id: "note", author: "learner" },
    });
    const proposed = boardReducer(withNote, {
      type: "propose",
      proposal: { ...proposal, revision: withNote.revision },
    });
    const edited = boardReducer(proposed, {
      type: "edit",
      id: "note",
      content: "My updated reasoning",
    });
    expect(edited.proposals[0].status).toBe("stale");
    const staleApproval = boardReducer(edited, {
      type: "approve",
      id: proposal.id,
    });
    expect(staleApproval.objects).toHaveLength(1);
    expect(staleApproval.objects[0].content).toBe("My updated reasoning");
    const undone = boardReducer(staleApproval, { type: "undo" });
    expect(
      boardReducer(undone, { type: "approve", id: proposal.id }).objects,
    ).toHaveLength(1);
  });

  it("preserves independent editing, deletion and redo history", () => {
    const added = boardReducer(initialBoard, {
      type: "add",
      object: { ...object, author: "learner" },
    });
    const moved = boardReducer(added, {
      type: "move",
      id: object.id,
      point: { x: -20, y: 200 },
    });
    expect(moved.objects[0]).toMatchObject({ x: 0, y: 200 });
    const deleted = boardReducer(moved, { type: "delete", ids: [object.id] });
    expect(deleted.objects).toEqual([]);
    const restored = boardReducer(deleted, { type: "undo" });
    expect(restored.objects).toEqual(moved.objects);
    const edited = boardReducer(restored, {
      type: "edit",
      id: object.id,
      content: "print(2)",
    });
    expect(boardReducer(edited, { type: "redo" }).objects[0].content).toBe(
      "print(2)",
    );
  });
});

function circle(x: number, y: number, radius: number): Point[] {
  return Array.from({ length: 33 }, (_, i) => ({
    x: x + radius * Math.cos((i * Math.PI) / 16),
    y: y + radius * Math.sin((i * Math.PI) / 16),
  }));
}
it("selects centers inside the actual circle, not just its rectangular bounds", () => {
  const centered = {
    ...object,
    id: "center",
    x: 80,
    y: 80,
    width: 40,
    height: 40,
  };
  const corner = { ...centered, id: "corner", x: 170, y: 170 };
  expect(
    selectInside(circle(100, 100, 100), [centered, corner]).map((o) => o.id),
  ).toEqual(["center"]);
});
it("does not submit a click, an open stroke, or an empty circle", () => {
  expect(selectInside([{ x: 40, y: 40 }], [object])).toEqual([]);
  expect(selectInside(circle(210, 168, 200).slice(0, 18), [object])).toEqual(
    [],
  );
  expect(selectInside(circle(800, 800, 40), [object])).toEqual([]);
});
