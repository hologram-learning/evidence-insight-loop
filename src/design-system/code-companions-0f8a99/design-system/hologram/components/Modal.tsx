import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./IconButton";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Footer actions, usually Buttons. */
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="holo-modal__scrim" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn("holo-modal", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="holo-modal__head">
          <div>
            <div className="holo-modal__title">{title}</div>
            {description && <div className="holo-modal__desc">{description}</div>}
          </div>
          <IconButton icon={<X size={16} />} label="Close" onClick={onClose} />
        </div>
        {children}
        {footer && <div className="holo-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
