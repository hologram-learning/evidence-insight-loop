import { type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {}

/** Small uppercase label used above headings and inside cards. */
export function Eyebrow({ className, children, ...rest }: EyebrowProps) {
  return (
    <span className={cn("holo-eyebrow", className)} {...rest}>
      {children}
    </span>
  );
}

export interface DataValueProps extends HTMLAttributes<HTMLSpanElement> {}

/** Tabular-figure numeric emphasis. Weight 700 is reserved for data like this. */
export function DataValue({ className, children, ...rest }: DataValueProps) {
  return (
    <span className={cn("holo-datavalue", className)} {...rest}>
      {children}
    </span>
  );
}
