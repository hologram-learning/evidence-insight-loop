import { cn } from "../lib/cn";
import { Card } from "./Card";
import { Eyebrow } from "./Typography";

export interface StatCardProps {
  /** Uppercase label above the number. */
  eyebrow: string;
  value: string | number;
  /** Small unit shown next to the value, e.g. "%" or "students". */
  unit?: string;
  /** Supporting line under the value. */
  sub?: string;
  /** Trend note appended to the supporting line. */
  trend?: string;
  trendDirection?: "up" | "down";
  className?: string;
}

export function StatCard({
  eyebrow,
  value,
  unit,
  sub,
  trend,
  trendDirection = "up",
  className,
}: StatCardProps) {
  return (
    <Card padding="lg" className={cn("holo-stat", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <span className="holo-stat__row">
        <span className="holo-stat__value">{value}</span>
        {unit && <span className="holo-stat__unit">{unit}</span>}
      </span>
      {(sub || trend) && (
        <span className="holo-stat__sub">
          {sub}
          {trend && (
            <>
              {sub ? " · " : ""}
              <span className={`holo-stat__trend--${trendDirection}`}>{trend}</span>
            </>
          )}
        </span>
      )}
    </Card>
  );
}
