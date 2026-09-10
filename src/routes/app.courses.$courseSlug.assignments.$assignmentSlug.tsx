import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Eyebrow,
  PageHeader,
  Textarea,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { formatDemoDate } from "@/lib/mastery";

export const Route = createFileRoute("/app/courses/$courseSlug/assignments/$assignmentSlug")({
  component: AssignmentDetailPage,
});

function AssignmentDetailPage() {
  const { courseSlug, assignmentSlug } = Route.useParams();
  const { state, addAudit } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const assignment = state.assignments.find(
    (a) => a.slug === assignmentSlug && a.courseId === course?.id,
  );
  const submission = state.submissions.find((s) => s.assignmentId === assignment?.id);
  const student = STUDENTS.find((s) => s.id === submission?.studentId);
  const [feedback, setFeedback] = useState(submission?.teacherFeedback ?? "");
  const [saved, setSaved] = useState(false);

  if (!assignment) {
    return (
      <EmptyState
        title="Assignment not found"
        description="It may have been removed by a demo reset."
        action={
          <Link to="/app/courses/$courseSlug/assignments" params={{ courseSlug }} className="holo-btn holo-btn--primary holo-btn--sm">
            Back to assignments
          </Link>
        }
      />
    );
  }

  return (
    <RoleGate allow={["teacher"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Assignments", href: `/app/courses/${courseSlug}/assignments` },
          { label: assignment.title },
        ]}
        title={assignment.title}
        subtitle={`Due ${formatDemoDate(assignment.dueDate)} · ${assignment.standardCodes.join(", ")}`}
        actions={<Badge tone="amber">Demo data</Badge>}
      />

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-12" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Instructions</Eyebrow>
          <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>
            {assignment.instructions || "No instructions were entered for this demo assignment."}
          </p>
        </div>
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Rubric criteria</Eyebrow>
          {assignment.rubric.length === 0 ? (
            <p className="micro-label">No rubric criteria on this assignment.</p>
          ) : (
            <div className="stack-8">
              {assignment.rubric.map((criterion) => (
                <div key={criterion.id} className="inset-plane" style={{ padding: "var(--s-12)" }}>
                  <Checkbox
                    label={criterion.label}
                    checked={criterion.met}
                    readOnly
                    aria-readonly="true"
                  />
                  <p className="micro-label" style={{ marginTop: "var(--s-4)" }}>{criterion.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Seeded submission</Eyebrow>
          {submission && student ? (
            <>
              <p style={{ margin: 0 }}>
                <strong>{student.name}</strong> · submitted {formatDemoDate(submission.submittedOn)}
              </p>
              <div className="inset-plane stack-8" style={{ padding: "var(--s-16)" }}>
                {submission.lines.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className="artifact-line"
                    data-flagged={index === submission.errorLineIndex ? "true" : "false"}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <label className="stack-8">
                <span className="micro-label">Teacher feedback</span>
                <Textarea
                  rows={3}
                  value={feedback}
                  onChange={(event) => {
                    setFeedback(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="Name the specific step to revisit."
                />
              </label>
              <div className="row-16">
                <Button
                  variant="primary"
                  onClick={() => {
                    addAudit({
                      action: "Evidence reviewed",
                      target: `${student.name} · ${assignment.title}`,
                      description: feedback
                        ? "The teacher recorded feedback on the submitted response."
                        : "The teacher reviewed the submitted response.",
                    });
                    setSaved(true);
                  }}
                >
                  Record review
                </Button>
                {saved && <span className="micro-label">Recorded in activity history</span>}
                <Link
                  to="/app/courses/$courseSlug/students/$studentSlug"
                  params={{ courseSlug, studentSlug: student.slug }}
                  className="holo-btn holo-btn--ghost holo-btn--sm"
                >
                  Open evidence profile
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title="No submissions yet"
              description="Submissions from the student role appear here once saved."
            />
          )}
        </div>
      </div>
    </RoleGate>
  );
}
