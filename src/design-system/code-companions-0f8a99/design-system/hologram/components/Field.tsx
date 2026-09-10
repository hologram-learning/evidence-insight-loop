import { type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface FieldProps {
  /** Visible label text. */
  label?: string;
  /** id of the control this label describes. */
  htmlFor?: string;
  /** Helper text shown below the control. */
  help?: string;
  /** Error message — replaces the helper text and marks the field invalid. */
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + help/error wrapper used by every form control in the system. */
export function Field({ label, htmlFor, help, error, required, className, children }: FieldProps) {
  return (
    <div className={cn("holo-field", className)}>
      {label && (
        <label className="holo-field__label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="holo-field__req" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <span className="holo-field__error" role="alert">
          {error}
        </span>
      ) : (
        help && <span className="holo-field__help">{help}</span>
      )}
    </div>
  );
}
