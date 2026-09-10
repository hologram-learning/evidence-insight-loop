import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, Card, MasteryPill, PageHeader, StatCard } from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { ASSIGNMENTS, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { MASTERY_LABEL, formatDemoDate, masteryLevel } from "@/lib/mastery";

export const Route = createFileRoute("/app/student/home")({
  component: StudentHome,
});

function StudentHome() {
  const { state } = useDemo();
  const student = STUDENTS.find((s) => s.id === "stu-sophia")!;
  const assignment = ASSIGNMENTS[0]!;
  const submission = state.submissions.find((s) => s.studentId === student.id);

  return (
    <RoleGate allow={["student"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Home" }]}
        title={`Hello, ${student.name.split(" ")[0]}`}
        subtitle="Your work, your standards, and what to practice next."
        actions={<Badge tone="amber">Demo student</Badge>}
      />

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <StatCard eyebrow="Current standard" value="6.EE.A.3" sub="Apply properties of operations" />
        <StatCard eyebrow="Evidence pieces" value={student.evidenceCount} sub="responses recorded" />
        <StatCard
          eyebrow="Next due"
          value={formatDemoDate(assignment.dueDate)}
          sub={assignment.title}
        />
      </div>

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        <Card
          elevation="raised"
          title="Where you are on 6.EE.A.3"
          description="Your level comes from the work you submitted, not from an average of points."
        >
          <MasteryPill level={masteryLevel(student.mastery)} label={MASTERY_LABEL[student.mastery]} />
        </Card>
        <Card
          elevation="raised"
          title={assignment.title}
          description={submission ? "You have saved a response." : "Not started yet."}
        >
          <Link
            to="/app/student/assignments/expressions-checkpoint"
            className="holo-btn holo-btn--accent holo-btn--sm"
          >
            {submission ? "Review your response" : "Start the checkpoint"}
          </Link>
        </Card>
      </div>
    </RoleGate>
  );
}
