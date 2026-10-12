// Local preview state only. These types are not approved API/persistence contracts.
export type ObjectKind = "text" | "code" | "rectangle" | "ellipse";
export type Point = { x: number; y: number };
export type BoardObject = Point & {
  id: string;
  kind: ObjectKind;
  content: string;
  width: number;
  height: number;
  author: "learner" | "sample-tutor";
  editedByLearner?: boolean;
  anchorId?: string;
};
export type Proposal = {
  id: string;
  object: BoardObject;
  revision: number;
  status: "pending" | "approved" | "dismissed" | "stale";
};
export type BoardState = {
  objects: BoardObject[];
  past: BoardObject[][];
  future: BoardObject[][];
  revision: number;
  proposals: Proposal[];
};
export type BoardAction =
  | { type: "add"; object: BoardObject }
  | { type: "edit"; id: string; content: string }
  | { type: "move"; id: string; point: Point }
  | { type: "delete"; ids: string[] }
  | { type: "undo" | "redo" }
  | { type: "propose"; proposal: Proposal }
  | { type: "approve" | "dismiss"; id: string };

export const BOARD_WIDTH = 1200;
export const initialBoard: BoardState = {
  objects: [],
  past: [],
  future: [],
  revision: 0,
  proposals: [],
};

function invalidate(proposals: Proposal[]): Proposal[] {
  return proposals.map((p) =>
    p.status === "pending" ? { ...p, status: "stale" } : p,
  );
}
function commit(state: BoardState, objects: BoardObject[]): BoardState {
  return {
    ...state,
    objects,
    past: [...state.past.slice(-49), state.objects],
    future: [],
    revision: state.revision + 1,
    proposals: invalidate(state.proposals),
  };
}
export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case "add":
      if (
        action.object.author !== "learner" ||
        state.objects.some((o) => o.id === action.object.id)
      )
        return state;
      return commit(state, [...state.objects, action.object]);
    case "edit": {
      if (
        !state.objects.some(
          (o) => o.id === action.id && o.content !== action.content,
        )
      )
        return state;
      return commit(
        state,
        state.objects.map((o) =>
          o.id === action.id
            ? { ...o, content: action.content, editedByLearner: true }
            : o,
        ),
      );
    }
    case "move": {
      const object = state.objects.find((o) => o.id === action.id);
      if (
        !object ||
        !Number.isFinite(action.point.x) ||
        !Number.isFinite(action.point.y)
      )
        return state;
      const point = {
        x: Math.max(0, Math.min(BOARD_WIDTH - object.width, action.point.x)),
        y: Math.max(0, action.point.y),
      };
      if (object.x === point.x && object.y === point.y) return state;
      return commit(
        state,
        state.objects.map((o) => (o.id === action.id ? { ...o, ...point } : o)),
      );
    }
    case "delete": {
      const objects = state.objects.filter((o) => !action.ids.includes(o.id));
      return objects.length === state.objects.length
        ? state
        : commit(state, objects);
    }
    case "undo": {
      const previous = state.past.at(-1);
      return previous
        ? {
            ...state,
            objects: previous,
            past: state.past.slice(0, -1),
            future: [state.objects, ...state.future],
            revision: state.revision + 1,
            proposals: invalidate(state.proposals),
          }
        : state;
    }
    case "redo": {
      const next = state.future[0];
      return next
        ? {
            ...state,
            objects: next,
            past: [...state.past, state.objects],
            future: state.future.slice(1),
            revision: state.revision + 1,
            proposals: invalidate(state.proposals),
          }
        : state;
    }
    case "propose":
      if (state.proposals.some((p) => p.id === action.proposal.id))
        return state;
      return {
        ...state,
        proposals: [
          ...state.proposals,
          {
            ...action.proposal,
            status:
              action.proposal.revision === state.revision ? "pending" : "stale",
          },
        ],
      };
    case "dismiss":
      return {
        ...state,
        proposals: state.proposals.map((p) =>
          p.id === action.id && p.status === "pending"
            ? { ...p, status: "dismissed" }
            : p,
        ),
      };
    case "approve": {
      const proposal = state.proposals.find((p) => p.id === action.id);
      if (
        !proposal ||
        proposal.status !== "pending" ||
        proposal.revision !== state.revision ||
        state.objects.some((o) => o.id === proposal.object.id)
      )
        return state;
      const next = commit(state, [...state.objects, proposal.object]);
      return {
        ...next,
        proposals: next.proposals.map((p) =>
          p.id === proposal.id ? { ...p, status: "approved" } : p,
        ),
      };
    }
  }
}

// The preview selects object centers inside a deliberately closed freehand loop.
// Production selection semantics remain subject to the interface decision.
export function isClosedCircle(points: Point[]): boolean {
  if (points.length < 8) return false;
  const first = points[0];
  const last = points[points.length - 1];
  const width =
    Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x));
  const height =
    Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
  return (
    width >= 24 &&
    height >= 24 &&
    Math.hypot(last.x - first.x, last.y - first.y) <=
      Math.max(24, Math.hypot(width, height) * 0.2)
  );
}
export function selectInside(
  points: Point[],
  objects: BoardObject[],
): BoardObject[] {
  if (!isClosedCircle(points)) return [];
  return objects.filter((object) => {
    const x = object.x + object.width / 2;
    const y = object.y + object.height / 2;
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i];
      const b = points[j];
      if (
        a.y > y !== b.y > y &&
        x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x
      )
        inside = !inside;
    }
    return inside;
  });
}

export function placeObject(
  objects: BoardObject[],
  anchor?: BoardObject,
): Point {
  const candidates: Point[] = anchor
    ? [
        { x: anchor.x + anchor.width + 32, y: anchor.y },
        { x: anchor.x, y: anchor.y + anchor.height + 32 },
      ]
    : [];
  for (let row = 0; row <= objects.length; row++) {
    for (let column = 0; column < 3; column++)
      candidates.push({ x: 40 + column * 380, y: 48 + row * 280 });
  }
  return (
    candidates.find(
      (p) =>
        p.x + 340 <= BOARD_WIDTH &&
        !objects.some(
          (o) =>
            p.x < o.x + o.width + 16 &&
            p.x + 356 > o.x &&
            p.y < o.y + o.height + 16 &&
            p.y + 256 > o.y,
        ),
    ) ?? { x: 40, y: Math.max(0, ...objects.map((o) => o.y + o.height)) + 32 }
  );
}
