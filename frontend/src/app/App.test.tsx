import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { App } from "./App";

afterEach(() => vi.unstubAllGlobals());
it("shows honest unauthenticated content and recovers from unknown routes", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/student/private"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: "Page not found" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "Return home" }));
  expect(
    screen.getByText(/Sign-in and learning activities are not available yet/),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /sign in/i }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveFocus();
});
it("renders loading, failure, retry, and actual ready states", async () => {
  const user = userEvent.setup();
  const fetcher = vi
    .fn()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "ready",
          scope: "application",
          checks: { application: "ready" },
        }),
      ),
    );
  vi.stubGlobal("fetch", fetcher);
  render(
    <MemoryRouter initialEntries={["/status"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("status")).toHaveTextContent("Checking");
  expect(await screen.findByRole("alert")).toHaveTextContent("Could not reach");
  await user.click(screen.getByRole("button", { name: "Try again" }));
  expect(
    await screen.findByRole("heading", { name: "Application ready" }),
  ).toBeInTheDocument();
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
});
