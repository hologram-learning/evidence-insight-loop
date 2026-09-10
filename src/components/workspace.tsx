import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { MASTERY_LABEL, formatDemoTimestamp } from "@/lib/mastery";
import { standardByCode } from "@/data/standards";
import type { AuditEvent, DecisionStatus, MasteryState } from "@/types/domain";

export const DEMO_DISCLOSURE = "Demo only — no data is sent to an LMS.";
export const AUTHORITY_LINE = "Hologram recommends. The teacher decides.";

/** Mounted instrument frame. Everything on a stage sits inside one of these. */
export function Housing({
  children,
  padding = "var(--s-24)",
  className,
}: {
  children: ReactNode;
  padding?: string;
  className?: string;
}) {
  return (
    <div className={className ? `housing ${className}` : "housing"}>
      <div className="housing-inner" style={{ padding }}>
        {children}
      </div>
    </div>
  );
}

/* --- Evidence rail ---------------------------------------------------------- */

export type RailSegmentName = "Artifact" | "Standard" | "Mastery" | "Risk" | "Teacher action";

const RAIL_ORDER: RailSegmentName[] = [
  "Artifact",
  "Standard",
  "Mastery",
  "Risk",
  "Teacher action",
];

export function EvidenceRail({
  active,
  values,
}: {
  active: RailSegmentName;
  values: Partial<Record<RailSegmentName, string>>;
}) {
  return (
    <div className="rail-seam" aria-label="Evidence rail: artifact, standard, mastery, risk, teacher action">
      {RAIL_ORDER.map((name) => (
        <div key={name} className="rail-seam__segment" data-state={name === active ? "active" : "idle"}>
          <span className="rail-seam__name">{name}</span>
          <span className="rail-seam__value">{values[name] ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}

/* --- Explanations ----------------------------------------------------------- */

export function WhyThisIsHere({ children }: { children: ReactNode }) {
  return (
    <p className="why-note" style={{ margin: 0 }}>
      <span className="micro-label" style={{ display: "block" }}>
        Why this is here
      </span>
      {children}
    </p>
  );
}

export function DemoDisclosure({ children }: { children?: ReactNode }) {
  return (
    <p className="demo-note" style={{ margin: 0, display: "flex", gap: "var(--s-6)", alignItems: "center" }}>
      <Info size={13} aria-hidden="true" />
      {children ?? DEMO_DISCLOSURE}
    </p>
  );
}

/* --- Chips ------------------------------------------------------------------ */

const DECISION_LABEL: Record<DecisionStatus, string> = {
  draft: "Draft · AI-proposed",
  approved: "Approved",
  declined: "Declined",
  overridden: "Overridden",
};

export function StatusChip({ status, edited }: { status: DecisionStatus; edited?: boolean }) {
  const tone =
    status === "approved"
      ? "approved"
      : status === "declined"
        ? "declined"
        : edited || status === "overridden"
          ? "edited"
          : "draft";
  const label =
    status === "draft" && edited ? "Draft · Teacher-edited" : DECISION_LABEL[status];
  return (
    <span className="chip" data-tone={tone}>
      {label}
    </span>
  );
}

export function ProvenanceLabel({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}

/* --- Mastery cell ----------------------------------------------------------- */

const CODE: Record<MasteryState, string> = {
  beginning: "B",
  developing: "D",
  approaching: "A",
  secure: "S",
};

/** Non-colour marker so the state survives greyscale and colour-blindness. */
const MARK: Record<MasteryState, string> = {
  beginning: "▁",
  developing: "▃",
  approaching: "▅",
  secure: "▇",
};

export function MasteryCellButton({
  state,
  studentName,
  standardCode,
  selected,
  onSelect,
  compact,
}: {
  state: MasteryState | null;
  studentName: string;
  standardCode: string;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}) {
  const label = state ? MASTERY_LABEL[state] : "Not yet assessed";
  const content = (
    <>
      <span className="mcell__code">{state ? CODE[state] : "–"}</span>
      {!compact && <span>{label}</span>}
      <span className="mcell__mark" aria-hidden="true">
        {state ? MARK[state] : "·"}
      </span>
    </>
  );
  const aria = `${studentName}, ${standardCode}, ${label}`;
  if (!onSelect) {
    return (
      <span className="mcell" data-state={state ?? "none"} aria-label={aria} role="img">
        {content}
      </span>
    );
  }
  return (
    <button
      type="button"
      className="mcell"
      data-state={state ?? "none"}
      data-selected={selected ? "true" : "false"}
      aria-label={aria}
      aria-pressed={selected ? true : false}
      onClick={onSelect}
    >
      {content}
    </button>
  );
}

export function MasteryLegend() {
  return (
    <div className="row-16" style={{ gap: "var(--s-12)" }}>
      {(["beginning", "developing", "approaching", "secure"] as MasteryState[]).map((state) => (
        <span key={state} className="micro-label" style={{ display: "inline-flex", gap: "var(--s-6)" }}>
          <span className="mcell" data-state={state} style={{ width: "auto" }}>
            <span className="mcell__code">{CODE[state]}</span>
            <span>{MASTERY_LABEL[state]}</span>
            <span className="mcell__mark" aria-hidden="true">
              {MARK[state]}
            </span>
          </span>
        </span>
      ))}
      <span className="micro-label">– Not yet assessed</span>
    </div>
  );
}

/* --- Prerequisite chain ------------------------------------------------------ */

export function PrerequisiteChain({
  codes,
  focusCode,
}: {
  codes: string[];
  focusCode: string;
}) {
  return (
    <div className="chain">
      {codes.map((code, index) => (
        <div key={code} style={{ display: "contents" }}>
          <div className="chain__node" data-focus={code === focusCode ? "true" : "false"}>
            <span className="micro-label">{code}</span>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-muted)", whiteSpace: "normal" }}>
              {standardByCode(code)?.label ?? "Standard"}
            </span>
          </div>
          {index < codes.length - 1 && (
            <span className="chain__arrow" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* --- Agent panel ------------------------------------------------------------- */

export function AgentReasoningPanel({
  rationale,
  confidence,
  limitations,
  showConfidence = true,
  children,
}: {
  rationale: string;
  confidence: number;
  limitations: string;
  showConfidence?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="inset-plane stack-8" style={{ padding: "var(--s-16)" }}>
      <div className="row-8">
        <span className="micro-label">Agent reasoning</span>
        <ProvenanceLabel>AI-proposed</ProvenanceLabel>
      </div>
      <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>
        {rationale}
      </p>
      {showConfidence && (
        <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)" }}>
          Confidence {confidence.toFixed(2)}{" "}
          <span className="micro-label">teacher-facing</span>
        </p>
      )}
      {children}
      <p className="demo-note" style={{ margin: 0 }}>
        {limitations}
      </p>
    </div>
  );
}

/* --- Audit receipt ------------------------------------------------------------ */

export function AuditReceipt({ event }: { event: AuditEvent }) {
  const context = event.context;
  return (
    <div className="receipt">
      <div className="row-8">
        <span className="micro-label">Audit receipt</span>
        <ProvenanceLabel>Local demo only</ProvenanceLabel>
      </div>
      <div className="receipt__row">
        <span className="receipt__key">Actor</span>
        <span>{event.actor}</span>
      </div>
      <div className="receipt__row">
        <span className="receipt__key">Timestamp</span>
        <span>{formatDemoTimestamp(event.timestamp)}</span>
      </div>
      <div className="receipt__row">
        <span className="receipt__key">Action</span>
        <span>{event.action}</span>
      </div>
      <div className="receipt__row">
        <span className="receipt__key">Evidence context</span>
        <span>
          {[context?.standardCode, context?.studentIds ? `${context.studentIds.length} learners` : null]
            .filter(Boolean)
            .join(" · ") || event.target}
        </span>
      </div>
      <div className="receipt__row">
        <span className="receipt__key">Resulting state</span>
        <span>{context?.resultingState ?? "recorded in this browser"}</span>
      </div>
      <p className="demo-note" style={{ margin: 0 }}>
        Written to the <Link to="/app/activity">activity history</Link>. {DEMO_DISCLOSURE}
      </p>
    </div>
  );
}
