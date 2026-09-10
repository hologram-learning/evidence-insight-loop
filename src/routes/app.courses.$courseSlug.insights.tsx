import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  Card,
  Eyebrow,
  MasteryHeatmap,
  PageHeader,
  StatCard,
} from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { masteryLevel } from "@/lib/mastery";
import { isReadOnly } from "@/lib/permissions";

export const Route = createFileRoute("/app/courses/$courseSlug/insights")({
  component: InsightsPage,
});

const COLUMNS = ["5.OA.A.1", "6.EE.A.2", "6.EE.A.3", "6.EE.B.5"];

function InsightsPage() {
  const { courseSlug } = Route.useParams();
  const { role } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);

  const rows = STUDENTS.slice(0, 8).map((student) => {
    const base = masteryLevel(student.mastery);
    return {
      label: student.name,
      levels: [
        Math.min(4, base + 2) as 0 | 1 | 2 | 3 | 4,
        Math.min(4, base + 1) as 0 | 1 | 2 | 3 | 4,
        base,
        Math.max(0, base - 1) as 0 | 1 | 2 | 3 | 4,
      ],
    };
  });

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Class insights" },
        ]}
        title="Class insights"
        subtitle="Where the class sits on the Expressions and Equations cluster, and why."
        actions={<Badge tone="indigo">{course?.classSignal}</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <StatCard eyebrow="Priority standard" value="6.EE.A.3" sub="Apply properties of operations" />
        <StatCard eyebrow="Need support" value={course?.needSupportCount ?? 0} sub={`of ${course?.studentCount ?? 0} students`} />
        <StatCard eyebrow="Dominant error" value="Partial distribution" sub="factor applied to one term only" />
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Mastery by standard</Eyebrow>
          <MasteryHeatmap columns={COLUMNS} rows={rows} />
          <p className="micro-label">First eight roster rows shown. Demo data.</p>
        </div>
      </div>

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <Card
          elevation="raised"
          title="What the evidence shows"
          description="Students preserve equality across steps but drop the second product when distributing. The error is specific and teachable in a short block."
        />
        <Card
          elevation="raised"
          title="Suggested next step"
          description="A 12-minute error-analysis warm-up drafted for four students, awaiting teacher review."
        >
          <Link
            to="/app/courses/$courseSlug/interventions"
            params={{ courseSlug }}
            className="holo-btn holo-btn--accent holo-btn--sm"
          >
            Review the draft
          </Link>
        </Card>
      </div>
    </RoleGate>
  );
}
