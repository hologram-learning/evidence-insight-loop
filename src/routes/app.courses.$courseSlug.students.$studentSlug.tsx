import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  Card,
  EmptyState,
  Eyebrow,
  MasteryPill,
  PageHeader,
  Progress,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { COURSES, EVIDENCE, MASTERY_RECORDS, STUDENTS } from "@/data/seed";
import { PREREQUISITES, standardByCode } from "@/data/standards";
import { useDemo } from "@/lib/demo-state";
import { MASTERY_LABEL, RISK_LABEL, formatDemoDate, masteryLevel } from "@/lib/mastery";

export const Route = createFileRoute("/app/courses/$courseSlug/students/$studentSlug")({
  component: StudentEvidencePage,
});

function StudentEvidencePage() {
  const { courseSlug, studentSlug } = Route.useParams();
  const { state } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const student = STUDENTS.find((s) => s.slug === studentSlug);

  if (!student) {
    return (
      <EmptyState
        title="Student not found"
        description="This demo roster does not include that student."
        action={
          <Link to="/app/courses/$courseSlug/roster" params={{ courseSlug }} className="holo-btn holo-btn--primary holo-btn--sm">
            Back to roster
          </Link>
        }
      />
    );
  }

  const record = MASTERY_RECORDS.find((r) => r.studentId === student.id);
  const evidence = EVIDENCE.filter((e) => e.studentId === student.id);
  const submission = state.submissions.find((s) => s.studentId === student.id);
  const prerequisites = PREREQUISITES.filter((p) => p.toCode === "6.EE.A.3");

  return (
    <RoleGate allow={["teacher"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Students", href: `/app/courses/${courseSlug}/students` },
          { label: student.name },
        ]}
        title={student.name}
        subtitle={`${student.gradeLevel} · evidence profile for 6.EE.A.3`}
        actions={<MasteryPill level={masteryLevel(student.mastery)} label={MASTERY_LABEL[student.mastery]} />}
      />

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <Card elevation="raised" title="Mastery estimate">
          <div className="stack-8">
            <MasteryPill level={masteryLevel(student.mastery)} label={MASTERY_LABEL[student.mastery]} />
            <Progress
              value={Math.round(student.confidence * 100)}
              label="Confidence"
              showValue
              tone={student.confidence > 0.75 ? "mint" : "amber"}
            />
            <span className="micro-label">{RISK_LABEL[student.risk]}</span>
            <p style={{ color: "var(--fg-muted)", margin: 0 }}>{record?.rationale}</p>
          </div>
        </Card>

        <Card elevation="raised" title="Prerequisite context">
          <ul className="stack-8" style={{ margin: 0, paddingLeft: "var(--s-16)" }}>
            {prerequisites.map((relation) => {
              const standard = standardByCode(relation.fromCode);
              return (
                <li key={relation.fromCode} style={{ color: "var(--fg-muted)" }}>
                  <strong style={{ color: "var(--fg)" }}>{relation.fromCode}</strong> — {standard?.label}
                  <br />
                  {relation.description}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          <div className="hrow-16">
            <Eyebrow>Submitted response</Eyebrow>
            <Badge tone="amber">Demo artifact</Badge>
          </div>
          {submission ? (
            <>
              <div className="inset-plane stack-8" style={{ padding: "var(--s-16)" }}>
                {submission.lines.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className="artifact-line"
                    data-flagged={index === submission.errorLineIndex ? "true" : "false"}
                  >
                    {line}
                    {index === submission.errorLineIndex && (
                      <span className="micro-label" style={{ marginLeft: "var(--s-8)" }}>
                        {submission.identifiedIssue}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="prose-measure" style={{ color: "var(--fg-muted)", margin: 0 }}>
                The factor was applied to the first term only. Equality is preserved elsewhere, so the
                gap is specific to distribution rather than to solving equations generally.
              </p>
            </>
          ) : (
            <EmptyState title="No submission recorded" description="This student has not submitted the checkpoint in the demo." />
          )}
        </div>
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Evidence record</Eyebrow>
          {evidence.length === 0 ? (
            <EmptyState title="No evidence yet" description="Artifacts appear here as work is reviewed." />
          ) : (
            <div className="evidence-rail" style={{ marginTop: "var(--s-16)" }}>
              {evidence.map((item) => (
                <div key={item.id} className="evidence-rail__node" data-tone={item.standardCode === "6.EE.A.3" ? "signal" : undefined}>
                  <span className="micro-label">
                    {item.standardCode} · {formatDemoDate(item.capturedOn)}
                  </span>
                  <p className="prose-measure" style={{ margin: "var(--s-4) 0 0", color: "var(--fg-muted)" }}>
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hrow-16" style={{ marginTop: "var(--s-24)" }}>
        <Link
          to="/app/courses/$courseSlug/interventions/$draftSlug"
          params={{ courseSlug, draftSlug: "draft-warm-up" }}
          className="holo-btn holo-btn--accent holo-btn--sm"
        >
          Review the drafted next step
        </Link>
        <Link to="/app/courses/$courseSlug/students" params={{ courseSlug }} className="holo-btn holo-btn--ghost holo-btn--sm">
          Back to students
        </Link>
      </div>

    </RoleGate>
  );
}
