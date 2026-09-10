import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, Card, PageHeader, StatCard } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES } from "@/data/seed";

export const Route = createFileRoute("/app/leader/overview")({
  component: LeaderOverview,
});

function LeaderOverview() {
  return (
    <RoleGate allow={["leader"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Overview" }]}
        title="Instructional leader overview"
        subtitle="Patterns across sections, without taking decisions away from teachers."
        actions={<Badge tone="amber">Read-only demo</Badge>}
      />
      <ReadOnlyNotice />

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <StatCard eyebrow="Sections" value={COURSES.length} sub="in this demo organization" />
        <StatCard eyebrow="Priority standard" value="6.EE.A.3" sub="most common gap" />
        <StatCard eyebrow="Drafts awaiting teachers" value="1" sub="teacher decision pending" />
      </div>

      <div className="stack-16" style={{ marginTop: "var(--s-24)" }}>
        {COURSES.map((course) => (
          <div key={course.id} className="housing">
            <div className="housing-inner row-16" style={{ padding: "var(--s-24)", justifyContent: "space-between" }}>
              <div>
                <span className="micro-label">{course.gradeLevel}</span>
                <h2 className="display-type" style={{ fontSize: "var(--fs-h4)", margin: "var(--s-4) 0" }}>
                  {course.name}
                </h2>
                <span className="micro-label">{course.classSignal}</span>
              </div>
              <Link
                to="/app/courses/$courseSlug/insights"
                params={{ courseSlug: course.slug }}
                className="holo-btn holo-btn--ghost holo-btn--sm"
              >
                View insights
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <Card
          elevation="raised"
          title="Standards view"
          description="Where mastery clusters and where prerequisites are holding students back."
        >
          <Link to="/app/leader/standards" className="holo-btn holo-btn--ghost holo-btn--sm">Open standards</Link>
        </Card>
        <Card
          elevation="raised"
          title="Intervention posture"
          description="How many drafts are proposed, edited, approved, or declined."
        >
          <Link to="/app/leader/interventions" className="holo-btn holo-btn--ghost holo-btn--sm">Open interventions</Link>
        </Card>
      </div>
    </RoleGate>
  );
}
