import { type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export interface PageHeaderProps {
  crumbs?: Crumb[];
  title: string;
  subtitle?: string;
  /** Action cluster aligned to the right of the title. */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ crumbs, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("holo-pagehead", className)}>
      {crumbs && crumbs.length > 0 && <Breadcrumb items={crumbs} />}
      <div className="holo-pagehead__row">
        <div>
          <h1 className="holo-pagehead__title">{title}</h1>
          {subtitle && <div className="holo-pagehead__sub">{subtitle}</div>}
        </div>
        {actions && <div className="holo-pagehead__actions">{actions}</div>}
      </div>
    </header>
  );
}
