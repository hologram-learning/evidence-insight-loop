import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, PageHeader, Tabs } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import {
  DemoDisclosure,
  Housing,
  MasteryCellButton,
  MasteryLegend,
} from "@/components/workspace";
import { ASSIGNMENTS, COURSES, GROUP_STUDENT_IDS, STANDARD_COLUMNS, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { MASTERY_LABEL, formatDemoTimestamp } from "@/lib/mastery";
import { isReadOnly } from "@/lib/permissions";
import { atRiskFirst, evidenceFor, masteryFor } from "@/lib/records";

export const Route = createFileRoute("/app/courses/$courseSlug/gradebook")({
  component: GradebookPage,
});

function GradebookPage() {
  const { courseSlug } = Route.useParams();
  const { role } = useDemo();
  const course = COURSES.find((item) => item.slug === courseSlug);
  const [view, setView] = useState("standards");
  const [cell, setCell] = useState<{ studentId: string; code: string } | null>(null);
  const readOnly = isReadOnly(role);
  const rows = atRiskFirst(STUDENTS, GROUP_STUDENT_IDS);
  const selected = cell ? STUDENTS.find((item) => item.id === cell.studentId) : undefined;
  const selectedState = selected && cell ? masteryFor(selected, cell.code) : null;
  const selectedEvidence = cell ? evidenceFor(cell.studentId, cell.code) : [];

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Gradebook" },
        ]}
        title="Standards gradebook"
        subtitle="Mastery states with the evidence behind every cell."
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {readOnly && <ReadOnlyNotice />}

      <div style={{ marginTop: "var(--s-16)" }}>
        <Tabs
          value={view}
          onChange={setView}
          items={[
            { id: "standards", label: "Standards view" },
            { id: "assignment", label: "Assignment view" },
          ]}
        />
      </div>

      <div style={{ marginTop: "var(--s-16)" }}>
        <MasteryLegend />
      </div>

      <Housing className="mt-6">
        <div className="plane-scroll"><table className="grid-plane">
          <thead>
            <tr>
              <th scope="col">Learner</th>
              {view === "standards" ? (
                STANDARD_COLUMNS.map((code) => (
                  <th key={code} scope="col">
                    {code}
                  </th>
                ))
              ) : (
                <>
                  {ASSIGNMENTS.filter((item) => item.courseId === course?.id).map((assignment) => (
                    <th key={assignment.id} scope="col">
                      {assignment.title}
                    </th>
                  ))}
                </>
              )}
              <th scope="col">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((student) => (
              <tr key={student.id}>
                <th scope="row">
                  <Link
                    to="/app/courses/$courseSlug/students/$studentSlug"
                    params={{ courseSlug, studentSlug: student.slug }}
                  >
                    {student.name}
                  </Link>
                </th>
                {view === "standards"
                  ? STANDARD_COLUMNS.map((code) => (
                      <td key={code}>
                        <MasteryCellButton
                          compact
                          state={masteryFor(student, code)}
                          studentName={student.name}
                          standardCode={code}
                          selected={cell?.studentId === student.id && cell.code === code}
                          onSelect={() => setCell({ studentId: student.id, code })}
                        />
                      </td>
                    ))
                  : ASSIGNMENTS.filter((item) => item.courseId === course?.id).map((assignment) => (
                      <td key={assignment.id}>
                        <MasteryCellButton
                          compact
                          state={masteryFor(student, assignment.standardCodes[0] ?? "6.EE.A.3")}
                          studentName={student.name}
                          standardCode={assignment.standardCodes[0] ?? "6.EE.A.3"}
                          selected={
                            cell?.studentId === student.id &&
                            cell.code === (assignment.standardCodes[0] ?? "6.EE.A.3")
                          }
                          onSelect={() =>
                            setCell({
                              studentId: student.id,
                              code: assignment.standardCodes[0] ?? "6.EE.A.3",
                            })
                          }
                        />
                      </td>
                    ))}
                <td style={{ color: "var(--fg-muted)" }}>{student.evidenceCount} artifacts</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Housing>

      {cell && selected && (
        <>
          <div className="drawer-scrim" onClick={() => setCell(null)} aria-hidden="true" />
          <aside className="drawer-panel stack-16" aria-label={`${selected.name}, ${cell.code} detail`}>
            <div className="hrow-16">
              <span className="micro-label">{cell.code}</span>
              <Button size="sm" variant="ghost" onClick={() => setCell(null)}>
                Close
              </Button>
            </div>
            <h2 className="display-type" style={{ fontSize: "var(--fs-h3)", margin: 0 }}>
              {selected.name}
            </h2>
            <p style={{ margin: 0 }}>
              {selectedState ? MASTERY_LABEL[selectedState] : "Not yet assessed"} · confidence{" "}
              {selected.confidence.toFixed(2)}
            </p>
            <div className="stack-8">
              <span className="micro-label">Evidence behind this cell</span>
              {selectedEvidence.length === 0 ? (
                <p style={{ margin: 0, color: "var(--fg-muted)" }}>
                  No captured artifacts for this standard yet.
                </p>
              ) : (
                selectedEvidence.map((artifact) => (
                  <p key={artifact.id} style={{ margin: 0, color: "var(--fg-muted)" }}>
                    {formatDemoTimestamp(artifact.capturedOn)} — {artifact.summary}
                  </p>
                ))
              )}
            </div>
            <Link
              to="/app/courses/$courseSlug/students/$studentSlug"
              params={{ courseSlug, studentSlug: selected.slug }}
            >
              Open the full dossier
            </Link>
            <DemoDisclosure />
          </aside>
        </>
      )}
    </RoleGate>
  );
}
