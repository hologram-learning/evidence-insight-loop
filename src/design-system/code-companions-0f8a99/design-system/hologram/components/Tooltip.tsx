import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface TooltipProps {
  /** Tooltip text. */
  label: string;
  /** The element the tooltip describes. */
  children: ReactNode;
  className?: string;
}

/** Hover- and focus-triggered tooltip. Keyboard users get it via focus. */
export function Tooltip({ label, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className={cn("holo-tooltip", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}
      {open && (
        <span className="holo-tooltip__bubble" role="tooltip" id={id}>
          {label}
        </span>
      )}
    </span>
  );
}
