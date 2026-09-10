import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  help?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, help, className, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn("holo-choice", disabled && "holo-choice--disabled", className)}>
      <input ref={ref} type="radio" disabled={disabled} {...rest} />
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
