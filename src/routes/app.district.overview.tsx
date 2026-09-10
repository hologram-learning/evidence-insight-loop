import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, Card, PageHeader, StatCard } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES, ORGANIZATION, STUDENTS, TERM } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";

export const Route = createFileRoute("/app/district/overview")({
  component: DistrictOverview,
});

function DistrictOverview() {
  const { state } = useDemo();

  return (
    <RoleGate allow={["district"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Overview" }]}
        title="District administration"
        subtitle={`${ORGANIZATION.name} · ${TERM.name}`}
        actions={<Badge tone="amber">Read-only demo</Badge>}
      />
      <ReadOnlyNotice />

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <StatCard eyebrow="Sections" value={COURSES.length} sub="configured in demo" />
        <StatCard eyebrow="Students" value={STUDENTS.length} sub="synthetic records only" />
        <StatCard eyebrow="Recorded events" value={state.audit.length} sub="in local activity history" />
      </div>

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <Card
          elevation="raised"
          title="Implementation readiness"
          description="Roles, data boundaries, retention posture, and what remains to be established before a real deployment."
        >
          <Link to="/app/district/implementation" className="holo-btn holo-btn--ghost holo-btn--sm">
            Open readiness
          </Link>
        </Card>
        <Card
          elevation="raised"
          title="Activity history"
          description="Every state change in this environment, with actor and role."
        >
          <Link to="/app/activity" className="holo-btn holo-btn--ghost holo-btn--sm">Open activity</Link>
        </Card>
      </div>

      <p className="micro-label" style={{ marginTop: "var(--s-16)" }}>
        This environment contains no real student data and is not connected to any external system.
      </p>
    </RoleGate>
  );
}
