import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label text shown beside the switch. */
  label: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn("holo-switch", disabled && "holo-switch--disabled", className)}>
      <input ref={ref} type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="holo-switch__track" aria-hidden="true">
        <span className="holo-switch__thumb" />
      </span>
      <span>{label}</span>
    </label>
  );
});
