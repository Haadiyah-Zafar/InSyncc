import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { WhiteboardPreview } from "./WhiteboardPreview";

it("keeps sample activity off the board until approved, then asks and dismisses without a board change", async () => {
  const user = userEvent.setup();
  render(<WhiteboardPreview />);
  const board = screen.getByLabelText("Scrollable whiteboard");
  expect(
    screen.getByText(/No live AI or course retrieval/),
  ).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Start sample activity" }),
  );
  expect(within(board).queryAllByRole("article")).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "Approve addition" }));
  expect(within(board).getAllByRole("article")).toHaveLength(1);
  await user.click(screen.getByRole("checkbox", { name: /Python code 1/ }));
  await user.type(
    screen.getByLabelText(/What feels unclear/),
    "Why does it stop before 4?",
  );
  await user.click(
    screen.getByRole("button", { name: "Ask about selection (1)" }),
  );
  expect(screen.getByText("Why does it stop before 4?")).toBeInTheDocument();
  expect(
    screen.getAllByText(/the stop value 4 is excluded/).length,
  ).toBeGreaterThan(0);
  expect(within(board).getAllByRole("article")).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: "Dismiss" }));
  expect(within(board).getAllByRole("article")).toHaveLength(1);
  expect(
    screen.getByText("Dismissed. Your board was not changed."),
  ).toBeInTheDocument();
});

it("makes pending additions stale when the learner changes the board", async () => {
  const user = userEvent.setup();
  render(<WhiteboardPreview />);
  await user.click(
    screen.getByRole("button", { name: "Start sample activity" }),
  );
  await user.click(screen.getByRole("button", { name: "+ Note" }));
  expect(
    screen.queryByRole("button", { name: "Approve addition" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText(/Board changed. Ask again/)).toBeInTheDocument();
  const input = screen.getByLabelText("Edit selected note");
  await user.clear(input);
  await user.type(input, "My reasoning is still here.");
  await user.click(screen.getByRole("button", { name: "Save object" }));
  const board = screen.getByLabelText("Scrollable whiteboard");
  expect(
    within(board).getByText("My reasoning is still here."),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Undo" }));
  expect(within(board).getByText("Write your idea here…")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Redo" }));
  expect(
    within(board).getByText("My reasoning is still here."),
  ).toBeInTheDocument();
});

it("supports keyboard movement and selection without pretending to interpret arbitrary content", async () => {
  const user = userEvent.setup();
  render(<WhiteboardPreview />);
  await user.click(screen.getByRole("button", { name: "+ Rectangle" }));
  const handle = screen.getByRole("button", {
    name: "Select and move rectangle 1",
  });
  handle.focus();
  await user.keyboard("{ArrowRight}{ArrowDown}");
  const board = screen.getByLabelText("Scrollable whiteboard");
  expect(within(board).getByRole("article")).toHaveStyle({
    left: "50px",
    top: "58px",
  });
  await user.click(
    screen.getByRole("button", { name: "Ask about selection (1)" }),
  );
  expect(
    screen.getAllByText(/it does not interpret your content/).length,
  ).toBeGreaterThan(0);
  await user.click(screen.getByRole("button", { name: "Approve addition" }));
  expect(within(board).getAllByRole("article")).toHaveLength(2);
  expect(within(board).getByText("About your selection")).toBeInTheDocument();
});

it("labels learner edits to a sample and preserves the exact earlier selection", async () => {
  const user = userEvent.setup();
  render(<WhiteboardPreview />);
  await user.click(
    screen.getByRole("button", { name: "Start sample activity" }),
  );
  await user.click(screen.getByRole("button", { name: "Approve addition" }));
  await user.click(screen.getByRole("checkbox", { name: /Python code 1/ }));
  await user.click(
    screen.getByRole("button", { name: "Ask about selection (1)" }),
  );
  const input = screen.getByLabelText("Edit selected python code");
  await user.clear(input);
  await user.type(input, "print(42)");
  await user.click(screen.getByRole("button", { name: "Save object" }));
  const board = screen.getByLabelText("Scrollable whiteboard");
  expect(within(board).getByText("Sample · edited by you")).toBeInTheDocument();
  expect(within(board).getByText("print(42)")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Approve addition" }),
  ).not.toBeInTheDocument();
  const snapshot = screen.getByText("Selected content (1)").parentElement!;
  expect(snapshot).toHaveTextContent("range(1, 4)");
  expect(snapshot).not.toHaveTextContent("print(42)");
  await user.click(
    screen.getByRole("button", { name: "Ask about selection (1)" }),
  );
  expect(
    screen.getAllByText(/it does not interpret your content/).length,
  ).toBeGreaterThan(0);
});
