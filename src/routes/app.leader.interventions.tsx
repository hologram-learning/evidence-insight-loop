import { createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, Eyebrow, PageHeader, StatCard } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";

export const Route = createFileRoute("/app/leader/interventions")({
  component: LeaderInterventions,
});

function LeaderInterventions() {
  const { state } = useDemo();
  const drafts = state.interventions;
  const byStatus = (status: string) => drafts.filter((d) => d.status === status).length;

  return (
    <RoleGate allow={["leader", "district"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Interventions" }]}
        title="Intervention posture"
        subtitle="Whether drafted moves are being edited, approved, or declined by teachers."
        actions={<Badge tone="amber">Read-only demo</Badge>}
      />
      <ReadOnlyNotice />

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <StatCard eyebrow="Proposed" value={byStatus("proposed")} sub="awaiting a teacher" />
        <StatCard eyebrow="Approved" value={byStatus("approved")} sub="teacher accepted" />
        <StatCard eyebrow="Declined" value={byStatus("declined")} sub="teacher overruled" />
      </div>

      {drafts.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState title="No interventions recorded" description="Drafts appear once evidence suggests a targeted move." />
        </div>
      ) : (
        <div className="stack-16" style={{ marginTop: "var(--s-24)" }}>
          {drafts.map((draft) => {
            const course = COURSES.find((c) => c.id === draft.courseId);
            const names = STUDENTS.filter((s) => draft.studentIds.includes(s.id)).length;
            return (
              <div key={draft.id} className="housing">
                <div className="housing-inner stack-8" style={{ padding: "var(--s-24)" }}>
                  <Eyebrow>{`${course?.name ?? "Course"} · ${draft.standardCode}`}</Eyebrow>
                  <div className="row-16" style={{ justifyContent: "space-between" }}>
                    <h2 className="display-type" style={{ fontSize: "var(--fs-h4)", margin: 0 }}>
                      {draft.title}
                    </h2>
                    <Badge
                      tone={draft.status === "approved" ? "mint" : draft.status === "declined" ? "danger" : "neutral"}
                      dot
                    >
                      {draft.status}
                    </Badge>
                  </div>
                  <span className="micro-label">{`${names} students · ${draft.durationMinutes} minutes`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </RoleGate>
  );
}
