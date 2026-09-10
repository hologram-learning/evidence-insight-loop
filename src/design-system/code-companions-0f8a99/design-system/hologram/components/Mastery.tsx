import { cn } from "../lib/cn";

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  0: "Beginning",
  1: "Developing",
  2: "Approaching",
  3: "Proficient",
  4: "Mastered",
};

export interface MasteryPillProps {
  level: MasteryLevel;
  /** Override the standard level label. */
  label?: string;
  className?: string;
}

const PILL_TONE: Record<MasteryLevel, string> = {
  0: "holo-badge--neutral",
  1: "holo-badge--amber",
  2: "holo-badge--amber",
  3: "holo-badge--mint",
  4: "holo-badge--solid",
};

/** Ordinal mastery status pill using the locked 5-step mastery scale. */
export function MasteryPill({ level, label, className }: MasteryPillProps) {
  return (
    <span className={cn("holo-badge", PILL_TONE[level], className)}>
      <span className="holo-badge__dot" aria-hidden="true" />
      {label ?? MASTERY_LABELS[level]}
    </span>
  );
}

export interface MasteryCellProps {
  level: MasteryLevel;
  /** Accessible description, e.g. "Ratios — Proficient". */
  title?: string;
  className?: string;
}

/** One square in a mastery heatmap. */
export function MasteryCell({ level, title, className }: MasteryCellProps) {
  return (
    <span
      role="img"
      aria-label={title ?? MASTERY_LABELS[level]}
      title={title ?? MASTERY_LABELS[level]}
      className={cn("holo-mastery-cell", `holo-mastery-cell--${level}`, className)}
    />
  );
}

export interface MasteryHeatmapRow {
  label: string;
  levels: MasteryLevel[];
}

export interface MasteryHeatmapProps {
  /** Column headings, e.g. standard codes. */
  columns: string[];
  rows: MasteryHeatmapRow[];
  /** Render the 5-step legend under the grid. */
  legend?: boolean;
  className?: string;
}

/** Standards-by-student mastery grid. Ordinal colour only — never categorical. */
export function MasteryHeatmap({ columns, rows, legend = true, className }: MasteryHeatmapProps) {
  const template = `minmax(120px, max-content) repeat(${columns.length}, 28px)`;
  return (
    <div className={cn(className)} style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
      <div className="holo-heatmap" style={{ gridTemplateColumns: template }}>
        <span />
        {columns.map((c) => (
          <span key={c} className="holo-heatmap__label" style={{ textAlign: "center" }}>
            {c}
          </span>
        ))}
        {rows.map((row) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: template, gap: "var(--s-4)", gridColumn: `1 / span ${columns.length + 1}` }}>
            <span className="holo-heatmap__label">{row.label}</span>
            {row.levels.map((level, i) => (
              <MasteryCell key={columns[i] ?? i} level={level} title={`${row.label} — ${columns[i] ?? ""} — ${MASTERY_LABELS[level]}`} />
            ))}
          </div>
        ))}
      </div>
      {legend && (
        <div className="holo-heatmap__legend">
          {([0, 1, 2, 3, 4] as MasteryLevel[]).map((l) => (
            <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: "var(--s-6)" }}>
              <MasteryCell level={l} className="holo-mastery-cell" />
              {MASTERY_LABELS[l]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
