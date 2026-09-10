import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Alert, Badge, EmptyState, PageHeader } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import {
  AUTHORITY_LINE,
  DemoDisclosure,
  EvidenceRail,
  Housing,
  MasteryCellButton,
  PrerequisiteChain,
  StatusChip,
  WhyThisIsHere,
} from "@/components/workspace";
import { COURSES, EVIDENCE, GROUP_STUDENT_IDS, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { isReadOnly } from "@/lib/permissions";
import { masteryFor, studentsById } from "@/lib/records";

export const Route = createFileRoute("/app/courses/$courseSlug/overview")({
  component: CourseOverview,
});

function CourseOverview() {
  const { courseSlug } = Route.useParams();
  const { state, role, launchContext } = useDemo();
  const course = COURSES.find((item) => item.slug === courseSlug);

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="This demo includes Math 6 — Period 3 and Period 5 only."
        action={
          <Link
            to="/app/courses/$courseSlug/overview"
            params={{ courseSlug: "math-6-period-3" }}
            className="holo-btn holo-btn--primary holo-btn--sm"
          >
            Go to Math 6 — Period 3
          </Link>
        }
      />
    );
  }

  const drafts = state.interventions.filter((draft) => draft.courseId === course.id);
  const pending = drafts.filter((draft) => draft.status === "draft");
  const focus = drafts[0];
  const group = studentsById(GROUP_STUDENT_IDS);
  const flagged = STUDENTS.filter((student) => student.risk !== "low").length;

  return (
    <RoleGate allow={["teacher", "leader", "district"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: course.name }]}
        title={course.name}
        subtitle={AUTHORITY_LINE}
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      {!launchContext && (
        <Alert tone="info" title="No launch context" className="mt-6">
          You opened the workspace directly. A simulated launch shows how a teacher would arrive from
          an existing LMS during pilot evaluation. <Link to="/launch">Open the simulated launch</Link>.
        </Alert>
      )}

      <div style={{ marginTop: "var(--s-16)" }}>
        <EvidenceRail
          active="Standard"
          values={{
            Artifact: `${EVIDENCE.length} captured responses`,
            Standard: "6.EE.A.3",
            Mastery: `${course.needSupportCount} of ${course.studentCount} developing or below`,
            Risk: `${flagged} flagged prerequisites`,
            "Teacher action": pending.length
              ? `${pending.length} awaiting your decision`
              : "Queue is clear",
          }}
        />
      </div>

      <div className="priority-well" style={{ marginTop: "var(--s-24)" }}>
        <div className="stack-8">
          <span className="micro-label">Priority signal · today</span>
          <h2 className="display-type" style={{ fontSize: "var(--fs-h2)", margin: 0 }}>
            {course.classSignal} on the Expressions and Equations cluster
          </h2>
          <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>
            {course.needSupportCount} of {course.studentCount} learners need targeted support on
            6.EE.A.3. The pattern concentrates on distributing a factor across both terms.
          </p>
          {focus ? (
            <div className="hrow-16">
              <StatusChip status={focus.status} edited={focus.teacherEdits.length > 0} />
              <Link
                to="/app/courses/$courseSlug/interventions/$draftSlug"
                params={{ courseSlug, draftSlug: focus.slug }}
                className="holo-btn holo-btn--accent holo-btn--sm"
              >
                Open the decision <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                to="/app/courses/$courseSlug/insights"
                params={{ courseSlug }}
                className="holo-btn holo-btn--ghost holo-btn--sm"
              >
                See the class pattern
              </Link>
            </div>
          ) : (
            <EmptyState
              title="No interventions awaiting review"
              description="Drafted next steps appear here when the evidence record suggests a targeted move."
            />
          )}
          <WhyThisIsHere>
            This signal is at the top because four learners repeat one error class on the same
            standard, and the upstream prerequisite 5.OA.A.1 is shared across them.
          </WhyThisIsHere>
        </div>
      </div>

      <div className="planes" style={{ marginTop: "var(--s-24)" }}>
        <Housing>
          <div className="stack-8">
            <span className="micro-label">Named group · 6.EE.A.3</span>
            <table className="grid-plane">
              <thead>
                <tr>
                  <th scope="col">Learner</th>
                  <th scope="col">6.EE.A.3</th>
                  <th scope="col">Most recent evidence</th>
                </tr>
              </thead>
              <tbody>
                {group.map((student) => (
                  <tr key={student.id}>
                    <th scope="row">
                      <Link
                        to="/app/courses/$courseSlug/students/$studentSlug"
                        params={{ courseSlug, studentSlug: student.slug }}
                      >
                        {student.name}
                      </Link>
                    </th>
                    <td>
                      <MasteryCellButton
                        state={masteryFor(student, "6.EE.A.3")}
                        studentName={student.name}
                        standardCode="6.EE.A.3"
                      />
                    </td>
                    <td style={{ color: "var(--fg-muted)" }}>{student.recentEvidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/app/courses/$courseSlug/students" params={{ courseSlug }}>
              View all {course.studentCount} learners
            </Link>
          </div>
        </Housing>

        <Housing>
          <div className="stack-8">
            <span className="micro-label">Prerequisite chain</span>
            <PrerequisiteChain
              codes={["4.NBT.B.5", "5.OA.A.1", "6.EE.A.3", "6.EE.B.7"]}
              focusCode="6.EE.A.3"
            />
            <p style={{ margin: 0, color: "var(--fg-muted)" }}>
              Progress on 6.EE.B.7 stays blocked while the distributive step is unstable.
            </p>
            <DemoDisclosure />
          </div>
        </Housing>
      </div>
    </RoleGate>
  );
}
