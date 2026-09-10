import { type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type BadgeTone = "neutral" | "indigo" | "amber" | "mint" | "danger" | "solid";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Shows a leading status dot. */
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn("holo-badge", `holo-badge--${tone}`, className)} {...rest}>
      {dot && <span className="holo-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
