import { useId, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "aria-invalid"> & {
  label: string;
  hint?: string;
  error?: string;
};
export function TextField({
  label,
  hint,
  error,
  id,
  "aria-describedby": describedBy,
  ...props
}: Props) {
  const generated = useId();
  const fieldId = id ?? generated;
  const descriptions =
    [describedBy, hint && `${fieldId}-hint`, error && `${fieldId}-error`]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={fieldId}>
        {`${label}${props.required ? " (required)" : ""}`}
      </label>
      {hint && (
        <p id={`${fieldId}-hint`} className="muted">
          {hint}
        </p>
      )}
      <input
        {...props}
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptions}
      />
      {error && (
        <p id={`${fieldId}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
