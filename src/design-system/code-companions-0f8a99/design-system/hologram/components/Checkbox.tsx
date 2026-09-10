import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text shown beside the box. */
  label: string;
  /** Secondary line under the label. */
  help?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, help, className, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn("holo-choice", disabled && "holo-choice--disabled", className)}>
      <input ref={ref} type="checkbox" disabled={disabled} {...rest} />
      <span>
        {label}
        {help && (
          <span className="holo-choice__help" style={{ display: "block" }}>
            {help}
          </span>
        )}
      </span>
    </label>
  );
});
