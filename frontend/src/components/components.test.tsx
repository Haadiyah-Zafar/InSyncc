import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { TextField } from "./TextField";
import { EmptyState, ErrorState, LoadingState } from "./Status";
import { WorkspaceLayout } from "../app/WorkspaceLayout";

describe("shared accessible controls", () => {
  it("labels fields, associates hint/error text, and supports keyboard input", async () => {
    const user = userEvent.setup();
    render(
      <TextField
        label="Name"
        hint="Your preferred name"
        error="Please enter a name"
        required
      />,
    );
    const input = screen.getByRole("textbox", { name: "Name (required)" });
    expect(input).toHaveAccessibleDescription(
      "Your preferred name Please enter a name",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard("Sam");
    expect(input).toHaveValue("Sam");
  });
  it("gives repeated fields distinct IDs", () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
      </>,
    );
    expect(screen.getByLabelText("First").id).not.toBe(
      screen.getByLabelText("Second").id,
    );
  });
  it("supports keyboard activation and prevents duplicate actions while busy", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const { rerender } = render(<Button onClick={action}>Save</Button>);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(action).toHaveBeenCalledTimes(1);
    rerender(
      <Button busy onClick={action} busyLabel="Saving…">
        Save
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    await user.click(screen.getByRole("button"));
    expect(action).toHaveBeenCalledTimes(1);
  });
  it("announces loading/error and offers keyboard retry", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const { rerender } = render(<LoadingState message="Loading classes…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading classes…");
    rerender(<ErrorState message="Could not load" onRetry={retry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load");
    await user.tab();
    await user.keyboard(" ");
    expect(retry).toHaveBeenCalledOnce();
    rerender(
      <EmptyState title="No activities">Nothing has been assigned.</EmptyState>,
    );
    expect(
      screen.getByRole("heading", { name: "No activities" }),
    ).toBeInTheDocument();
  });
  it("keeps workspace slots separate without assigning a role or session", () => {
    render(
      <WorkspaceLayout
        title="Learning"
        navigation={<a href="/">Home</a>}
        actions={<Button>Action</Button>}
      >
        <p>Content slot</p>
      </WorkspaceLayout>,
    );
    expect(
      screen.getByRole("navigation", { name: "Workspace" }),
    ).toContainElement(screen.getByRole("link"));
    expect(
      screen.getByRole("heading", { name: "Learning" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Content slot")).toBeInTheDocument();
  });
});
