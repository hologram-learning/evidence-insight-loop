import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. Primary is indigo; accent (amber) is reserved for the single most important action on a surface. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label — Lucide icons only. */
  icon?: ReactNode;
  /** Icon rendered after the label. */
  iconAfter?: ReactNode;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
  /** Stretch to the width of the container. */
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    icon,
    iconAfter,
    loading = false,
    block = false,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "holo-btn",
        `holo-btn--${variant}`,
        `holo-btn--${size}`,
        block && "holo-btn--block",
        className,
      )}
      {...rest}
    >
      {loading ? <span className="holo-btn__spinner" aria-hidden="true" /> : icon}
      {children}
      {iconAfter}
    </button>
  );
});
