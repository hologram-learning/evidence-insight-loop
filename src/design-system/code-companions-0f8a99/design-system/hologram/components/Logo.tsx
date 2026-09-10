import { cn } from "../lib/cn";
import markUrl from "../assets/logos/hologram-mark.svg";
import markUiUrl from "../assets/logos/hologram-mark-ui.svg";
import lockupUrl from "../assets/logos/hologram-lockup-horizontal.svg";

export type LogoVariant = "mark" | "mark-ui" | "lockup";

export interface LogoProps {
  /** `mark` is the full crystal mark, `mark-ui` the simplified small-size mark, `lockup` mark + wordmark. */
  variant?: LogoVariant;
  /** Rendered height in px. */
  height?: number;
  className?: string;
}

const SOURCES: Record<LogoVariant, string> = {
  mark: markUrl,
  "mark-ui": markUiUrl,
  lockup: lockupUrl,
};

/** The Hologram brand mark. The only place a gradient is allowed in the system. */
export function Logo({ variant = "lockup", height = 28, className }: LogoProps) {
  return (
    <span className={cn("holo-logo", className)} style={{ height }}>
      <img src={SOURCES[variant]} alt="Hologram" height={height} />
    </span>
  );
}
