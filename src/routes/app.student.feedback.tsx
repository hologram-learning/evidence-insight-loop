import { createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { useDemo } from "@/lib/demo-state";
import { formatDemoDate } from "@/lib/mastery";

export const Route = createFileRoute("/app/student/feedback")({
  component: StudentFeedback,
});

function StudentFeedback() {
  const { state } = useDemo();
  const items = state.submissions.filter(
    (s) => s.studentId === "stu-sophia" && s.teacherFeedback,
  );

  return (
    <RoleGate allow={["student"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Feedback" }]}
        title="Feedback from your teacher"
        subtitle="Written by your teacher, tied to a specific piece of your work."
        actions={<Badge tone="amber">Demo data</Badge>}
      />

      {items.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState
            title="No feedback yet"
            description="When your teacher reviews a response, their note appears here."
          />
        </div>
      ) : (
        <div className="stack-16" style={{ marginTop: "var(--s-24)" }}>
          {items.map((submission) => {
            const assignment = state.assignments.find((a) => a.id === submission.assignmentId);
            return (
              <div key={submission.id} className="housing">
                <div className="housing-inner stack-8" style={{ padding: "var(--s-24)" }}>
                  <Eyebrow>{assignment?.title ?? "Assignment"}</Eyebrow>
                  <span className="micro-label">Submitted {formatDemoDate(submission.submittedOn)}</span>
                  <p className="prose-measure" style={{ margin: 0 }}>{submission.teacherFeedback}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </RoleGate>
  );
}
