import { cn } from "../lib/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn("holo-divider", orientation === "vertical" && "holo-divider--vertical", className)}
    />
  );
}
