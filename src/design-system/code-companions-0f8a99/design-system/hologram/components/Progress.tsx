import { cn } from "../lib/cn";

export type ProgressTone = "indigo" | "mint" | "amber";

export interface ProgressProps {
  /** Completed amount. */
  value: number;
  max?: number;
  tone?: ProgressTone;
  /** Label shown above the bar. */
  label?: string;
  /** Show the percentage next to the label. */
  showValue?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  tone = "indigo",
  label,
  showValue = false,
  className,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="holo-progress__meta">
          <span>{label}</span>
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="holo-progress"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn("holo-progress__fill", tone !== "indigo" && `holo-progress__fill--${tone}`)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
