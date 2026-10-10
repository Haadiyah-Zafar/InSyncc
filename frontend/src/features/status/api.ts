import { getJson } from "../../lib/api";

export function readReadiness(signal: AbortSignal) {
  return getJson(
    "/ready",
    (value) => {
      if (
        typeof value !== "object" ||
        value === null ||
        !("status" in value) ||
        value.status !== "ready" ||
        !("scope" in value) ||
        value.scope !== "application" ||
        !("checks" in value) ||
        typeof value.checks !== "object" ||
        value.checks === null ||
        !("application" in value.checks) ||
        value.checks.application !== "ready"
      )
        throw new Error("Invalid readiness payload");
      return { status: "ready" as const };
    },
    signal,
  );
}
