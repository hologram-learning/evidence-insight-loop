import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, PageHeader } from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { useDemo } from "@/lib/demo-state";
import { formatDemoDate } from "@/lib/mastery";

export const Route = createFileRoute("/app/student/assignments/")({
  component: StudentAssignments,
});

function StudentAssignments() {
  const { state } = useDemo();
  const assignments = state.assignments.filter((a) => a.courseId === "course-math-6-p3");

  return (
    <RoleGate allow={["student"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Assignments" }]}
        title="Your assignments"
        subtitle="Only your own work is shown here."
        actions={<Badge tone="amber">Demo data</Badge>}
      />

      {assignments.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState title="No assignments yet" description="Your teacher has not published anything for this section." />
        </div>
      ) : (
        <div className="stack-16" style={{ marginTop: "var(--s-24)" }}>
          {assignments.map((assignment) => {
            const submitted = state.submissions.some(
              (s) => s.assignmentId === assignment.id && s.studentId === "stu-sophia",
            );
            const isCheckpoint = assignment.slug === "expressions-checkpoint";
            return (
              <div key={assignment.id} className="housing">
                <div className="housing-inner hrow-16" style={{ padding: "var(--s-24)", justifyContent: "space-between" }}>
                  <div>
                    <span className="micro-label">{assignment.standardCodes.join(" · ")}</span>
                    <h2 className="display-type" style={{ fontSize: "var(--fs-h4)", margin: "var(--s-4) 0" }}>
                      {assignment.title}
                    </h2>
                    <span className="micro-label">Due {formatDemoDate(assignment.dueDate)}</span>
                  </div>
                  <div className="hrow-8">
                    <Badge tone={submitted ? "mint" : "neutral"} dot>
                      {submitted ? "Submitted" : "Not started"}
                    </Badge>
                    {isCheckpoint && (
                      <Link
                        to="/app/student/assignments/expressions-checkpoint"
                        className="holo-btn holo-btn--primary holo-btn--sm"
                      >
                        Open
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </RoleGate>
  );
}
