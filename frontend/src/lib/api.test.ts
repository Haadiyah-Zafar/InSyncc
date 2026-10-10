import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getJson } from "./api";
import { readReadiness } from "../features/status/api";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const ready = {
  status: "ready",
  scope: "application",
  checks: { application: "ready" },
};

describe("API boundary", () => {
  it("uses the same-origin boundary without pretending to authenticate", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(ready)));
    vi.stubGlobal("fetch", fetcher);
    await expect(readReadiness(new AbortController().signal)).resolves.toEqual({
      status: "ready",
    });
    expect(fetcher).toHaveBeenCalledWith(
      "/api/ready",
      expect.objectContaining({
        credentials: "omit",
        headers: { Accept: "application/json" },
      }),
    );
  });
  it("does not display raw server errors and preserves valid support references", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("private credentials", {
          status: 503,
          headers: { "X-Request-ID": "d77c921c-6f2c-4d29-99cc-6db7bcf49e72" },
        }),
      ),
    );
    await expect(getJson("/ready", (value) => value)).rejects.toMatchObject({
      status: 503,
      requestId: "d77c921c-6f2c-4d29-99cc-6db7bcf49e72",
      message: "The service is unavailable. Please try again.",
    });
  });
  it.each(["<html>not JSON</html>", JSON.stringify({ status: "ready" })])(
    "rejects malformed payloads (%s)",
    async (value) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(value)));
      await expect(
        readReadiness(new AbortController().signal),
      ).rejects.toBeInstanceOf(ApiError);
    },
  );
  it("does not treat network failure as readiness", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("private URL")));
    await expect(readReadiness(new AbortController().signal)).rejects.toThrow(
      "Could not reach the service.",
    );
  });
  it("bounds slow requests", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options: RequestInit) =>
          new Promise((_resolve, reject) =>
            options.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            ),
          ),
      ),
    );
    const result = expect(getJson("/ready", (value) => value)).rejects.toThrow(
      "The request took too long.",
    );
    await vi.advanceTimersByTimeAsync(10_000);
    await result;
  });
  it("preserves caller cancellation", async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options: RequestInit) =>
          new Promise((_resolve, reject) =>
            options.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            ),
          ),
      ),
    );
    const result = expect(
      getJson("/ready", (value) => value, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
    controller.abort();
    await result;
  });
  it("rejects absolute paths", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(
      getJson("https://example.com", (value) => value),
    ).rejects.toThrow("Invalid API path");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
