import { useEffect, useState } from "react";
import { ErrorState, LoadingState } from "../../components/Status";
import { Button } from "../../components/Button";
import { readReadiness } from "./api";
import { ApiError } from "../../lib/api";

type State =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string; requestId?: string };
export function ServiceStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ kind: "loading" });
    readReadiness(controller.signal)
      .then(() => {
        if (!controller.signal.aborted) setState({ kind: "ready" });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            kind: "error",
            message:
              error instanceof ApiError
                ? error.message
                : "The service is unavailable.",
            requestId: error instanceof ApiError ? error.requestId : undefined,
          });
      });
    return () => controller.abort();
  }, [attempt]);
  const retry = () => setAttempt((value) => value + 1);
  return (
    <section className="page status-page">
      <p className="eyebrow">Connection check</p>
      <h1>Service status</h1>
      <p className="lead">
        Check whether the InSync application is responding.
      </p>
      {state.kind === "loading" && (
        <LoadingState message="Checking the application…" />
      )}
      {state.kind === "ready" && (
        <div className="notice success">
          <h2>Application ready</h2>
          <p role="status">The application is responding.</p>
          <p>
            This does not confirm that sign-in or learning services are
            available.
          </p>
          <Button onClick={retry}>Check again</Button>
        </div>
      )}
      {state.kind === "error" && (
        <>
          <ErrorState message={state.message} onRetry={retry} />
          {state.requestId && (
            <p className="muted">Support reference: {state.requestId}</p>
          )}
        </>
      )}
    </section>
  );
}
