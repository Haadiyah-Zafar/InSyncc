import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { Button } from "../../components/Button";
import {
  BOARD_WIDTH,
  boardReducer,
  initialBoard,
  isClosedCircle,
  placeObject,
  selectInside,
  type BoardObject,
  type ObjectKind,
  type Point,
  type Proposal,
} from "./model";
import { SAMPLE_ACTIVITY, SAMPLE_CODE, sampleExplanation } from "./samples";
import "./whiteboard.css";

type Message = {
  id: string;
  text: string;
  from: "you" | "sample";
  selection?: BoardObject[];
  proposalId?: string;
};
type Gesture =
  | { kind: "circle"; pointerId: number; points: Point[] }
  | {
      kind: "move";
      pointerId: number;
      id: string;
      start: Point;
      origin: Point;
      point: Point;
    };
const names: Record<ObjectKind, string> = {
  text: "Note",
  code: "Python code",
  rectangle: "Rectangle",
  ellipse: "Ellipse",
};

function ObjectContent({ object }: { object: BoardObject }) {
  return object.kind === "code" ? (
    <pre>{object.content}</pre>
  ) : (
    <p className="object-text">{object.content || "Empty object"}</p>
  );
}

function ObjectEditor({
  object,
  onSave,
}: {
  object: BoardObject;
  onSave: (content: string) => void;
}) {
  const [draft, setDraft] = useState(object.content);
  return (
    <form
      className="object-editor"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
      }}
    >
      <label htmlFor="object-content">
        Edit selected {names[object.kind].toLowerCase()}
      </label>
      <textarea
        id="object-content"
        value={draft}
        maxLength={4000}
        rows={4}
        spellCheck={object.kind !== "code"}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button type="submit" disabled={draft === object.content}>
        Save object
      </Button>
    </form>
  );
}

function ProposalReview({
  proposal,
  onApprove,
  onDismiss,
}: {
  proposal: Proposal;
  onApprove: () => void;
  onDismiss: () => void;
}) {
  return (
    <section className="proposal" aria-label="Proposed board addition">
      <p className="proposal-label">
        Proposed {names[proposal.object.kind].toLowerCase()} · sample
      </p>
      <ObjectContent object={proposal.object} />
      {proposal.status === "pending" ? (
        <>
          <p>Review this content. It is not on your board yet.</p>
          <div className="proposal-actions">
            <Button onClick={onApprove}>Approve addition</Button>
            <Button className="secondary-button" onClick={onDismiss}>
              Dismiss
            </Button>
          </div>
        </>
      ) : (
        <p className="proposal-result">
          {proposal.status === "approved"
            ? "Approved and added. You can undo it on the board."
            : proposal.status === "dismissed"
              ? "Dismissed. Your board was not changed."
              : "Board changed. Ask again or restart the sample activity to review a fresh proposal."}
        </p>
      )}
    </section>
  );
}

export function WhiteboardPreview() {
  const [state, dispatch] = useReducer(boardReducer, initialBoard);
  const [tool, setTool] = useState<"select" | "ask">("select");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [notice, setNotice] = useState(
    "Add your own objects, or start the sample activity in the tutor panel.",
  );
  useEffect(() => {
    // Keep the latest reply visible without moving keyboard focus or the page.
    if (conversation.current)
      conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [messages.length]);
  const selected = state.objects.filter((object) =>
    selectedIds.includes(object.id),
  );
  const canvasHeight = Math.max(
    900,
    ...state.objects.map((o) => o.y + o.height + 80),
    gesture?.kind === "move" ? gesture.point.y + 320 : 0,
  );

  function updateGesture(next: Gesture | null) {
    gestureRef.current = next;
    setGesture(next);
  }
  function coordinates(event: PointerEvent): Point {
    const rect = surface.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function makeObject(
    kind: ObjectKind,
    content: string,
    author: BoardObject["author"],
    anchor?: BoardObject,
  ): BoardObject {
    return {
      id: crypto.randomUUID(),
      kind,
      content,
      author,
      width: 340,
      height: 240,
      ...placeObject(state.objects, anchor),
      ...(anchor ? { anchorId: anchor.id } : {}),
    };
  }
  function addObject(kind: ObjectKind) {
    const object = makeObject(
      kind,
      kind === "code"
        ? "# Write your Python here"
        : kind === "text"
          ? "Write your idea here…"
          : "Label this concept",
      "learner",
    );
    dispatch({ type: "add", object });
    setSelectedIds([object.id]);
    setTool("select");
    setNotice(
      `${names[kind]} added. Select its header to move it; edit its content below the board.`,
    );
  }
  function propose(
    text: string,
    object: BoardObject,
    selection?: BoardObject[],
    request?: string,
  ) {
    const id = crypto.randomUUID();
    dispatch({
      type: "propose",
      proposal: { id, object, revision: state.revision, status: "pending" },
    });
    setMessages((previous) => [
      ...previous,
      ...(selection
        ? [
            {
              id: crypto.randomUUID(),
              from: "you" as const,
              text: request || "Help me understand this selection.",
              selection: selection.map((o) => ({ ...o })),
            },
          ]
        : []),
      { id: crypto.randomUUID(), from: "sample", text, proposalId: id },
    ]);
    setNotice(
      "Sample response ready in the tutor panel. Approve its proposed addition to place it on the board.",
    );
  }
  function ask(objects: BoardObject[]) {
    if (!objects.length) {
      setNotice(
        "No object selected. Circle an object’s center, or use the object list below the board.",
      );
      return;
    }
    setSelectedIds(objects.map((o) => o.id));
    const text = sampleExplanation(objects);
    propose(
      text,
      makeObject("text", text, "sample-tutor", objects[0]),
      objects,
      question.trim(),
    );
    setQuestion("");
  }
  function startCircle(event: PointerEvent<HTMLDivElement>) {
    if (
      tool !== "ask" ||
      event.button !== 0 ||
      !event.isPrimary ||
      gestureRef.current
    )
      return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateGesture({
      kind: "circle",
      pointerId: event.pointerId,
      points: [coordinates(event)],
    });
  }
  function startMove(
    event: PointerEvent<HTMLButtonElement>,
    object: BoardObject,
  ) {
    if (
      tool !== "select" ||
      event.button !== 0 ||
      !event.isPrimary ||
      gestureRef.current
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedIds([object.id]);
    updateGesture({
      kind: "move",
      pointerId: event.pointerId,
      id: object.id,
      start: coordinates(event),
      origin: { x: object.x, y: object.y },
      point: { x: object.x, y: object.y },
    });
  }
  function movePointer(event: PointerEvent) {
    const current = gestureRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const point = coordinates(event);
    if (current.kind === "circle") {
      // Bound preview rendering work during very long gestures.
      const points =
        current.points.length >= 1000
          ? current.points.filter((_, i) => i % 2 === 0)
          : current.points;
      updateGesture({ ...current, points: [...points, point] });
    } else {
      updateGesture({
        ...current,
        point: {
          x: Math.max(
            0,
            Math.min(
              BOARD_WIDTH - 340,
              current.origin.x + point.x - current.start.x,
            ),
          ),
          y: Math.max(0, current.origin.y + point.y - current.start.y),
        },
      });
    }
  }
  function endPointer(event: PointerEvent) {
    const current = gestureRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    updateGesture(null);
    if (current.kind === "move")
      dispatch({ type: "move", id: current.id, point: current.point });
    else {
      const points = [...current.points, coordinates(event)];
      if (!isClosedCircle(points)) {
        setNotice(
          "Finish a closed circle around an object to ask. Your board is unchanged.",
        );
        return;
      }
      ask(selectInside(points, state.objects));
    }
  }

  return (
    <div className="whiteboard-page">
      <header className="whiteboard-heading">
        <div>
          <p className="eyebrow">Your space to understand</p>
          <h1>Think it through.</h1>
          <p>
            A whiteboard for ideas, questions, and the next small discovery.
          </p>
        </div>
        <span className="preview-tag">Interactive preview</span>
      </header>
      <p className="preview-notice">
        Sample tutor responses · No live AI or course retrieval · Work lasts
        until you leave or reload this page.
      </p>
      <div className="learning-workspace">
        <section className="board-workspace" aria-label="Personal whiteboard">
          <div
            className="board-toolbar"
            role="group"
            aria-label="Whiteboard tools"
          >
            <div className="tool-group">
              <Button
                aria-pressed={tool === "select"}
                onClick={() => {
                  setTool("select");
                  updateGesture(null);
                }}
              >
                Select / move
              </Button>
              <Button
                aria-pressed={tool === "ask"}
                onClick={() => {
                  setTool("ask");
                  updateGesture(null);
                  setNotice(
                    "Draw a closed circle around object centers. Release to send the selection to the sample tutor.",
                  );
                }}
              >
                Ask + circle
              </Button>
            </div>
            <div className="tool-group">
              <Button onClick={() => addObject("text")}>+ Note</Button>
              <Button onClick={() => addObject("code")}>+ Code</Button>
              <Button onClick={() => addObject("rectangle")}>
                + Rectangle
              </Button>
              <Button onClick={() => addObject("ellipse")}>+ Ellipse</Button>
            </div>
            <div className="tool-group">
              <Button
                disabled={!state.past.length}
                onClick={() => dispatch({ type: "undo" })}
              >
                Undo
              </Button>
              <Button
                disabled={!state.future.length}
                onClick={() => dispatch({ type: "redo" })}
              >
                Redo
              </Button>
              <Button
                disabled={!selected.length}
                onClick={() => {
                  dispatch({ type: "delete", ids: selectedIds });
                  setSelectedIds([]);
                }}
              >
                Delete selected
              </Button>
            </div>
          </div>
          <p id="board-help" className="board-help">
            {tool === "ask"
              ? "ASK MODE · Circle object centers, then release. Images and handwriting are not interpreted."
              : "SELECT MODE · Drag an object’s header to move it. Focus a header and use arrow keys for keyboard movement."}
          </p>
          <div
            className="board-scroll"
            tabIndex={0}
            aria-label="Scrollable whiteboard"
            aria-describedby="board-help"
          >
            <div
              ref={surface}
              className={`board-surface ${tool === "ask" ? "asking" : ""}`}
              style={{ width: BOARD_WIDTH, height: canvasHeight }}
              onPointerDown={startCircle}
              onPointerMove={movePointer}
              onPointerUp={endPointer}
              onPointerCancel={() => updateGesture(null)}
              onLostPointerCapture={() => updateGesture(null)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  updateGesture(null);
                  setTool("select");
                }
              }}
            >
              {!state.objects.length && (
                <div className="board-empty">
                  <span aria-hidden="true">✦</span>
                  <h2>A little room for a big idea.</h2>
                  <p>
                    Add a note, sketch a concept with shapes, or approve a
                    sample activity to begin.
                  </p>
                </div>
              )}
              {state.objects.map((object, index) => {
                const position =
                  gesture?.kind === "move" && gesture.id === object.id
                    ? gesture.point
                    : object;
                return (
                  <article
                    key={object.id}
                    data-object-id={object.id}
                    className={`board-object object-${object.kind} ${selectedIds.includes(object.id) ? "is-selected" : ""} ${object.author === "sample-tutor" ? "sample-object" : ""}`}
                    aria-label={`${names[object.kind]} ${index + 1}`}
                    style={{
                      left: position.x,
                      top: position.y,
                      width: object.width,
                      height: object.height,
                    }}
                  >
                    <button
                      type="button"
                      className="object-handle"
                      aria-label={`Select and move ${names[object.kind].toLowerCase()} ${index + 1}`}
                      aria-pressed={selectedIds.includes(object.id)}
                      onClick={() => setSelectedIds([object.id])}
                      onPointerDown={(event) => startMove(event, object)}
                      onKeyDown={(event) => {
                        const delta: Record<string, Point> = {
                          ArrowLeft: { x: -10, y: 0 },
                          ArrowRight: { x: 10, y: 0 },
                          ArrowUp: { x: 0, y: -10 },
                          ArrowDown: { x: 0, y: 10 },
                        };
                        if (delta[event.key]) {
                          event.preventDefault();
                          dispatch({
                            type: "move",
                            id: object.id,
                            point: {
                              x: object.x + delta[event.key].x,
                              y: object.y + delta[event.key].y,
                            },
                          });
                        }
                      }}
                    >
                      <span>{names[object.kind]}</span>
                      <span>
                        {object.author === "sample-tutor"
                          ? object.editedByLearner
                            ? "Sample · edited by you"
                            : "Sample tutor"
                          : "You"}{" "}
                        <span aria-hidden="true">⠿</span>
                      </span>
                    </button>
                    {object.anchorId && (
                      <span className="anchor-label">
                        {state.objects.some((o) => o.id === object.anchorId)
                          ? "About your selection"
                          : "Original selection removed"}
                      </span>
                    )}
                    <ObjectContent object={object} />
                  </article>
                );
              })}
              {tool === "ask" && (
                <div className="ask-overlay" aria-hidden="true" />
              )}
              {gesture?.kind === "circle" && (
                <svg
                  className="circle-overlay"
                  width={BOARD_WIDTH}
                  height={canvasHeight}
                  aria-hidden="true"
                >
                  <polyline
                    points={gesture.points
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                  />
                </svg>
              )}
            </div>
          </div>
          <p className="board-status" role="status">
            {notice}
          </p>
          <div className="board-details">
            <section aria-label="Object selection" className="object-list">
              <h2>
                Objects <span>{state.objects.length}</span>
              </h2>
              <p>Select objects here to ask without drawing.</p>
              {state.objects.length === 0 ? (
                <p className="muted">Your board is empty.</p>
              ) : (
                state.objects.map((object, index) => (
                  <label key={object.id}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(object.id)}
                      onChange={(event) =>
                        setSelectedIds((ids) =>
                          event.target.checked
                            ? [...ids, object.id]
                            : ids.filter((id) => id !== object.id),
                        )
                      }
                    />
                    <span>
                      {names[object.kind]} {index + 1}:{" "}
                      {object.content.slice(0, 40) || "Empty"}
                    </span>
                  </label>
                ))
              )}
            </section>
            {selected.length === 1 && (
              <ObjectEditor
                key={`${selected[0].id}:${selected[0].content}`}
                object={selected[0]}
                onSave={(content) => {
                  dispatch({ type: "edit", id: selected[0].id, content });
                  setNotice(
                    "Object saved in this preview. Earlier pending tutor additions need a fresh review.",
                  );
                }}
              />
            )}
          </div>
        </section>
        <aside className="tutor-panel" aria-labelledby="tutor-heading">
          <header className="tutor-heading">
            <span className="tutor-mark" aria-hidden="true">
              ✦
            </span>
            <div>
              <h2 id="tutor-heading">Tutor panel</h2>
              <p>Sample conversation</p>
            </div>
          </header>
          <div className="tutor-intro">
            <h3>One idea at a time.</h3>
            <p>
              Try a Python loops activity. Sample responses let you explore the
              interaction before live tutoring is connected.
            </p>
            <Button
              onClick={() =>
                propose(
                  SAMPLE_ACTIVITY,
                  makeObject("code", SAMPLE_CODE, "sample-tutor"),
                )
              }
            >
              Start sample activity
            </Button>
          </div>
          <div
            ref={conversation}
            className="tutor-messages"
            aria-label="Tutor conversation"
            tabIndex={0}
          >
            {messages.map((message) => {
              const proposal = state.proposals.find(
                (p) => p.id === message.proposalId,
              );
              return (
                <article
                  key={message.id}
                  className={`tutor-message message-${message.from}`}
                >
                  <p className="message-author">
                    {message.from === "you" ? "You" : "Sample tutor · fixture"}
                  </p>
                  <p>{message.text}</p>
                  {message.selection && (
                    <details>
                      <summary>
                        Selected content ({message.selection.length})
                      </summary>
                      {message.selection.map((object) => (
                        <div key={object.id}>
                          <strong>{names[object.kind]}</strong>
                          <ObjectContent object={object} />
                        </div>
                      ))}
                    </details>
                  )}
                  {proposal && (
                    <ProposalReview
                      proposal={proposal}
                      onApprove={() => {
                        dispatch({ type: "approve", id: proposal.id });
                        setNotice(
                          "Approved sample addition placed on the board.",
                        );
                      }}
                      onDismiss={() => {
                        dispatch({ type: "dismiss", id: proposal.id });
                        setNotice(
                          "Sample addition dismissed. Your board is unchanged.",
                        );
                      }}
                    />
                  )}
                </article>
              );
            })}
          </div>
          <form
            className="ask-form"
            onSubmit={(event) => {
              event.preventDefault();
              ask(selected);
            }}
          >
            <label htmlFor="tutor-question">
              What feels unclear? <span>(optional)</span>
            </label>
            <textarea
              id="tutor-question"
              rows={3}
              maxLength={1000}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Add a question about your selection…"
            />
            <Button type="submit" disabled={!selected.length}>
              Ask about selection ({selected.length})
            </Button>
            <p>
              Circle with Ask, or select objects using the list. Every tutor
              addition needs your approval.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}
