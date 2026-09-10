import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge, EmptyState, PageHeader } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { AUTHORITY_LINE, DemoDisclosure, Housing, StatusChip } from "@/components/workspace";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { isReadOnly } from "@/lib/permissions";

export const Route = createFileRoute("/app/courses/$courseSlug/interventions/")({
  component: InterventionQueue,
});

function InterventionQueue() {
  const { courseSlug } = Route.useParams();
  const { state, role } = useDemo();
  const course = COURSES.find((item) => item.slug === courseSlug);
  const drafts = state.interventions.filter((draft) => draft.courseId === course?.id);

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Decisions" },
        ]}
        title="Decision queue"
        subtitle={AUTHORITY_LINE}
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      {drafts.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState
            title="No interventions awaiting review"
            description="Drafted next steps appear here when the evidence record suggests a targeted move."
          />
        </div>
      ) : (
        <div className="stack-16" style={{ marginTop: "var(--s-24)" }}>
          {drafts.map((draft) => {
            const students = STUDENTS.filter((student) => draft.studentIds.includes(student.id));
            return (
              <Housing key={draft.id}>
                <div className="stack-8">
                  <div className="row-16">
                    <span className="micro-label">{`${draft.standardCode} · ${draft.durationMinutes} min · ${students.length} learners`}</span>
                    <StatusChip status={draft.status} edited={draft.teacherEdits.length > 0} />
                  </div>
                  <h2 className="display-type" style={{ fontSize: "var(--fs-h3)", margin: 0 }}>
                    {draft.title}
                  </h2>
                  <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>
                    {draft.evidenceSignal}
                  </p>
                  <Link
                    to="/app/courses/$courseSlug/interventions/$draftSlug"
                    params={{ courseSlug, draftSlug: draft.slug }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "var(--s-6)" }}
                  >
                    Open decision workspace <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </Housing>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "var(--s-16)" }}>
        <DemoDisclosure />
      </div>
    </RoleGate>
  );
}
