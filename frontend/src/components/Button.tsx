import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  busy?: boolean;
  busyLabel?: string;
};
export function Button({
  busy = false,
  busyLabel = "Please wait…",
  disabled,
  children,
  type = "button",
  ...props
}: Props) {
  return (
    <button {...props} type={type} disabled={disabled || busy} aria-busy={busy}>
      {busy ? busyLabel : children}
    </button>
  );
}
