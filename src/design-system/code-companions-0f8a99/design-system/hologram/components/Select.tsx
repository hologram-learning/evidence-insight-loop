import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  return (
    <span className="holo-select-wrap">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn("holo-select", invalid && "holo-select--invalid", className)}
        {...rest}
      >
        {children}
      </select>
      <span className="holo-select-wrap__chevron" aria-hidden="true">
        <ChevronDown size={16} />
      </span>
    </span>
  );
});
