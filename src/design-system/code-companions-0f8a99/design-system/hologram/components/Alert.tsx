import { type ReactNode } from "react";
import { Info, CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import { cn } from "../lib/cn";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  /** Hide the leading icon. */
  hideIcon?: boolean;
  className?: string;
}

const ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
} as const;

export function Alert({ tone = "info", title, children, hideIcon = false, className }: AlertProps) {
  const Icon = ICONS[tone];
  return (
    <div
      className={cn("holo-alert", `holo-alert--${tone}`, className)}
      role={tone === "danger" ? "alert" : "status"}
    >
      {!hideIcon && (
        <span className="holo-alert__icon" aria-hidden="true">
          <Icon size={16} />
        </span>
      )}
      <div>
        {title && <div className="holo-alert__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
