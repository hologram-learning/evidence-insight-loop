import { type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface TopNavItem {
  label: string;
  href?: string;
  active?: boolean;
  onSelect?: () => void;
}

export interface TopNavProps {
  /** Brand slot — usually the Hologram Logo component. */
  brand?: ReactNode;
  items?: TopNavItem[];
  /** Right-aligned controls (search, account, actions). */
  actions?: ReactNode;
  className?: string;
}

export function TopNav({ brand, items = [], actions, className }: TopNavProps) {
  return (
    <nav className={cn("holo-topnav", className)} aria-label="Primary">
      {brand}
      <div className="holo-topnav__links">
        {items.map((item) =>
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn("holo-topnav__link", item.active && "holo-topnav__link--active")}
            >
              {item.label}
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={item.onSelect}
              aria-current={item.active ? "page" : undefined}
              className={cn("holo-topnav__link", item.active && "holo-topnav__link--active")}
              style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
      <span className="holo-topnav__spacer" />
      {actions}
    </nav>
  );
}
