import { Button } from "./Button";

export function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <p role="status" aria-live="polite" className="notice">
      {message}
    </p>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="notice">
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
}
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="notice error">
      <p role="alert">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
