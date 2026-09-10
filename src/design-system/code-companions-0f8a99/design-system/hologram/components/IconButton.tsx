import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type IconButtonVariant = "plain" | "outline" | "solid";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The Lucide icon element to render. */
  icon: ReactNode;
  /** Required accessible name — icon-only controls have no visible label. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "plain", size = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn("holo-iconbtn", `holo-iconbtn--${variant}`, `holo-iconbtn--${size}`, className)}
      {...rest}
    >
      {icon}
    </button>
  );
});
