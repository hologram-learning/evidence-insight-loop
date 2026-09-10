import { type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Eyebrow } from "./Typography";

export type Persona = "student" | "teacher" | "admin";

export interface SidebarItem {
  label: string;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  onSelect?: () => void;
}

export interface PersonaSidebarProps {
  /** Product area — tints the sidebar with that persona's surface zone. */
  persona: Persona;
  /** Zone name shown at the top, e.g. "Teacher". */
  zoneLabel?: string;
  items: SidebarItem[];
  /** Content pinned under the item list. */
  footer?: ReactNode;
  className?: string;
}

export function PersonaSidebar({ persona, zoneLabel, items, footer, className }: PersonaSidebarProps) {
  return (
    <nav
      className={cn("holo-sidebar", `holo-sidebar--${persona}`, className)}
      aria-label={zoneLabel ? `${zoneLabel} navigation` : "Section navigation"}
    >
      {zoneLabel && (
        <div className="holo-sidebar__zone">
          <Eyebrow>{zoneLabel}</Eyebrow>
        </div>
      )}
      {items.map((item) =>
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn("holo-sidebar__item", item.active && "holo-sidebar__item--active")}
          >
            {item.icon}
            {item.label}
          </a>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={item.onSelect}
            aria-current={item.active ? "page" : undefined}
            className={cn("holo-sidebar__item", item.active && "holo-sidebar__item--active")}
          >
            {item.icon}
            {item.label}
          </button>
        ),
      )}
      {footer && <div style={{ marginTop: "auto" }}>{footer}</div>}
    </nav>
  );
}
