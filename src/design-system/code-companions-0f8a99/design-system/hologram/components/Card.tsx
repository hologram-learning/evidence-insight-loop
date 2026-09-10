import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type CardElevation = "flat" | "raised" | "sunken";
export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padding?: CardPadding;
  /** Adds hover affordance for cards that act as a link or button. */
  interactive?: boolean;
  /** Optional heading rendered above the content. */
  title?: string;
  /** Optional supporting line under the title. */
  description?: string;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    elevation = "flat",
    padding = "md",
    interactive = false,
    title,
    description,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "holo-card",
        `holo-card--${elevation}`,
        `holo-card--pad-${padding}`,
        interactive && "holo-card--interactive",
        className,
      )}
      {...rest}
    >
      {title && <div className="holo-card__title">{title}</div>}
      {description && <div className="holo-card__desc">{description}</div>}
      {children}
    </div>
  );
});
