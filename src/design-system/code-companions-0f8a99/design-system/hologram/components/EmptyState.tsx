import { type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface EmptyStateProps {
  /** Lucide icon element. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Primary action, usually a Button. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("holo-empty", className)}>
      {icon && <span className="holo-empty__icon">{icon}</span>}
      <span className="holo-empty__title">{title}</span>
      {description && <span className="holo-empty__desc">{description}</span>}
      {action}
    </div>
  );
}
