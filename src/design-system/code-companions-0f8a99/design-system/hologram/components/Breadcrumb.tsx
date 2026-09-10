import { Fragment } from "react";
import { cn } from "../lib/cn";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: Crumb[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("holo-breadcrumb", className)} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={item.label}>
            {i > 0 && (
              <span className="holo-breadcrumb__sep" aria-hidden="true">
                →
              </span>
            )}
            {item.href && !last ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span className={last ? "holo-breadcrumb__current" : undefined} aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
