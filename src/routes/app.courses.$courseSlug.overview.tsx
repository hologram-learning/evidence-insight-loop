import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Alert,
  Badge,
  Card,
  Eyebrow,
  EmptyState,
  PageHeader,
  StatCard,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate, ReadOnlyNotice } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { isReadOnly } from "@/lib/permissions";

export const Route = createFileRoute("/app/courses/$courseSlug/overview")({
  component: CourseOverview,
});

function CourseOverview() {
  const { courseSlug } = Route.useParams();
  const { state, role, launchContext } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="This demo includes Math 6 — Period 3 and Period 5 only."
        action={
          <Link to="/app/courses/$courseSlug/overview" params={{ courseSlug: "math-6-period-3" }} className="holo-btn holo-btn--primary holo-btn--sm">
            Go to Math 6 — Period 3
          </Link>
        }
      />
    );
  }

  const pending = state.interventions.filter(
    (draft) => draft.courseId === course.id && draft.status === "draft",
  );
  const flagged = STUDENTS.filter((s) => s.risk !== "low").length;

  return (
    <RoleGate allow={["teacher", "leader", "district"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: course.name }]}
        title={course.name}
        subtitle={`${course.subject} · ${course.gradeLevel} · Fall 2026 — Demo`}
        actions={<Badge tone="indigo">{course.classSignal}</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      {!launchContext && (
        <Alert tone="info" title="No launch context" className="mt-6">
          You opened the workspace directly. A simulated launch shows how a teacher would arrive from
          an existing LMS during pilot evaluation.{" "}
          <Link to="/launch">Open the simulated launch</Link>.
        </Alert>
      )}

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <StatCard eyebrow="Students" value={course.studentCount} sub="enrolled in this section" />
        <StatCard eyebrow="Need support" value={course.needSupportCount} sub={course.prioritySkillsRange} />
        <StatCard eyebrow="Flagged prerequisites" value={flagged} sub="moderate or high risk" />
        <StatCard eyebrow="Awaiting your review" value={pending.length} sub="drafted instructional moves" />
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-12" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Class signal</Eyebrow>
          <p className="prose-measure" style={{ margin: 0 }}>
            Recent work on the Expressions and Equations cluster sits {course.classSignal.toLowerCase()}.
            The pattern concentrates on distributing a factor across both terms.
          </p>
          <div className="row-16">
            <Link
              to="/app/courses/$courseSlug/insights"
              params={{ courseSlug }}
              className="holo-btn holo-btn--primary holo-btn--sm"
            >
              Open class insights <ArrowRight size={14} />
            </Link>
            <Link
              to="/app/courses/$courseSlug/roster"
              params={{ courseSlug }}
              className="holo-btn holo-btn--ghost holo-btn--sm"
            >
              View roster
            </Link>
          </div>
        </div>
      </div>

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <Card
          elevation="raised"
          title="Assignments"
          description={`${state.assignments.filter((a) => a.courseId === course.id).length} in this section`}
        >
          <Link to="/app/courses/$courseSlug/assignments" params={{ courseSlug }} className="holo-btn holo-btn--ghost holo-btn--sm">
            Open assignments
          </Link>
        </Card>
        <Card
          elevation="raised"
          title="Interventions"
          description={pending.length ? `${pending.length} awaiting your decision` : "No drafts awaiting review"}
        >
          <Link to="/app/courses/$courseSlug/interventions" params={{ courseSlug }} className="holo-btn holo-btn--ghost holo-btn--sm">
            Review drafts
          </Link>
        </Card>
        <Card elevation="raised" title="Standards gradebook" description="Ordinal mastery with evidence counts">
          <Link to="/app/courses/$courseSlug/gradebook" params={{ courseSlug }} className="holo-btn holo-btn--ghost holo-btn--sm">
            Open gradebook
          </Link>
        </Card>
      </div>
    </RoleGate>
  );
}
