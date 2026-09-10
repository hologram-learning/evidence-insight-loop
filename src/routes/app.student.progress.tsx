import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, MasteryPill, PageHeader, Progress } from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { STUDENTS } from "@/data/seed";
import { PREREQUISITES, STANDARDS } from "@/data/standards";
import { MASTERY_LABEL, masteryLevel } from "@/lib/mastery";

export const Route = createFileRoute("/app/student/progress")({
  component: StudentProgress,
});

function StudentProgress() {
  const student = STUDENTS.find((s) => s.id === "stu-sophia")!;
  const prereqs = PREREQUISITES.filter((relation) => relation.toCode === "6.EE.A.3");

  return (
    <RoleGate allow={["student"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Progress" }]}
        title="Your progress"
        subtitle="What you can do, what is still forming, and what leads into it."
        actions={<Badge tone="amber">Demo data</Badge>}
      />

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          <div className="hrow-16" style={{ justifyContent: "space-between" }}>
            <div>
              <span className="micro-label">6.EE.A.3</span>
              <h2 className="display-type" style={{ fontSize: "var(--fs-h3)", margin: "var(--s-4) 0 0" }}>
                Apply properties of operations
              </h2>
            </div>
            <MasteryPill level={masteryLevel(student.mastery)} label={MASTERY_LABEL[student.mastery]} />
          </div>
          <Progress value={student.confidence * 100} label="Evidence strength" />
          <p className="micro-label">
            Based on {student.evidenceCount} pieces of your own work. No peer data is shown.
          </p>
        </div>
      </div>

      <div className="grid-auto" style={{ marginTop: "var(--s-24)" }}>
        {prereqs.map((relation) => {
          const standard = STANDARDS.find((s) => s.code === relation.fromCode);
          return (
            <Card
              key={relation.fromCode}
              elevation="raised"
              title={standard?.code ?? relation.fromCode}
              description={standard?.label ?? relation.description}
            >
              <span className="micro-label">{relation.description}</span>
            </Card>
          );
        })}

      </div>
    </RoleGate>
  );
}
