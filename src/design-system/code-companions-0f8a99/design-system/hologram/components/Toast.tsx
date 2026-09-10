import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./IconButton";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastProps {
  tone?: ToastTone;
  title: string;
  description?: string;
  /** Renders a dismiss control when provided. */
  onDismiss?: () => void;
  className?: string;
}

export function Toast({ tone = "info", title, description, onDismiss, className }: ToastProps) {
  return (
    <div className={cn("holo-toast", tone !== "info" && `holo-toast--${tone}`, className)} role="status">
      <div style={{ flex: 1 }}>
        <div className="holo-toast__title">{title}</div>
        {description && <div className="holo-toast__desc">{description}</div>}
      </div>
      {onDismiss && <IconButton icon={<X size={14} />} label="Dismiss" size="sm" onClick={onDismiss} />}
    </div>
  );
}
