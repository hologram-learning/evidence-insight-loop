import { Badge, MasteryPill } from "@/design-system/code-companions-0f8a99";
import { Housing } from "@/components/workspace";
import { MASTERY_LABEL, formatDemoDate, formatDemoTimestamp, masteryLevel } from "@/lib/mastery";
import { historyFor } from "@/lib/records";
import type { AuditEvent, InterventionDraft, Student } from "@/types/domain";

export const HISTORY_LABEL = "Demo activity history — stored in this browser, not tamper-proof.";

/** True when an audit event belongs to this draft. */
export function eventBelongsToDraft(event: AuditEvent, draft: InterventionDraft) {
  return event.context?.recommendationId === draft.id || event.target === draft.title;
}

/** Seeded mastery history as a compact ordered row of pills plus an accessible table. */
export function SeededMasteryHistory({
  students,
  standardCode,
}: {
  students: Student[];
  standardCode: string;
}) {
  const rows = students
    .map((student) => ({ student, points: historyFor(student.id, standardCode) }))
    .filter((row) => row.points.length > 0);
  const dates = rows[0]?.points ?? [];

  return (
    <Housing>
      <div className="stack-8">
        <div className="hrow-8">
          <span className="micro-label">Seeded mastery history (demo) · {standardCode}</span>
          <Badge tone="amber">Synthetic</Badge>
        </div>
        {rows.length === 0 ? (
          <p style={{ margin: 0, color: "var(--fg-muted)" }}>
            No seeded history exists for these learners on {standardCode}.
          </p>
        ) : (
          <div className="plane-scroll">
            <table className="grid-plane">
              <caption className="sr-only">
                Seeded mastery history for {standardCode}, oldest to newest. Demo values.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Learner</th>
                  {dates.map((point) => (
                    <th scope="col" key={point.observedOn}>
                      {formatDemoDate(point.observedOn)}
                      <br />
                      <span className="micro-label">{point.source}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ student, points }) => (
                  <tr key={student.id}>
                    <th scope="row">{student.name}</th>
                    {points.map((point) => (
                      <td key={point.observedOn}>
                        <MasteryPill level={masteryLevel(point.state)} label={MASTERY_LABEL[point.state]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p style={{ margin: 0, color: "var(--fg-subtle)", fontSize: "var(--fs-body-sm)" }}>
          Hand-authored demo values. Not a calculated estimate and not evidence of learning gains.
        </p>
      </div>
    </Housing>
  );
}

/** Original recommendation → edits (before/after) → decisions, oldest first. */
export function DraftActivityHistory({
  draft,
  events,
}: {
  draft: InterventionDraft;
  events: AuditEvent[];
}) {
  const ordered = events
    .filter((event) => eventBelongsToDraft(event, draft))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return (
    <Housing>
      <div className="stack-8">
        <span className="micro-label">Decision history for this draft</span>
        <p style={{ margin: 0, color: "var(--fg-subtle)", fontSize: "var(--fs-body-sm)" }}>
          {HISTORY_LABEL}
        </p>
        <ol className="audit-list">
          <li className="audit-item">
            <span className="micro-label">1 · Original recommendation (seeded)</span>
            <p style={{ margin: 0, fontSize: "var(--fs-body-sm)" }}>
              {draft.originalRecommendation.objective}
            </p>
          </li>
          {ordered.map((event, index) => (
            <li key={event.id} className="audit-item">
              <span className="micro-label">
                {index + 2} · {event.action} · {formatDemoTimestamp(event.timestamp)} · {event.actor}
              </span>
              <p style={{ margin: 0, fontSize: "var(--fs-body-sm)" }}>{event.description}</p>
            </li>
          ))}
        </ol>
        {draft.teacherEdits.length > 0 && (
          <div className="stack-8">
            <span className="micro-label">Edits since the last reset · before and after</span>
            <div className="plane-scroll">
              <table className="grid-plane">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Before</th>
                    <th scope="col">After</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.teacherEdits.map((edit) => (
                    <tr key={edit.id}>
                      <th scope="row">
                        {edit.field}
                        <br />
                        <span className="micro-label">{formatDemoTimestamp(edit.editedOn)}</span>
                      </th>
                      <td style={{ color: "var(--fg-subtle)" }}>{edit.previous}</td>
                      <td>{edit.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Housing>
  );
}
