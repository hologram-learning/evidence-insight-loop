import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Eyebrow,
  PageHeader,
  Textarea,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { ASSIGNMENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { formatDemoDate } from "@/lib/mastery";

export const Route = createFileRoute("/app/student/assignments/expressions-checkpoint")({
  component: StudentCheckpoint,
});

function StudentCheckpoint() {
  const { state, saveSubmission } = useDemo();
  const assignment =
    state.assignments.find((a) => a.slug === "expressions-checkpoint") ?? ASSIGNMENTS[0]!;
  const submission = state.submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === "stu-sophia",
  );
  const [work, setWork] = useState((submission?.lines ?? []).join("\n"));
  const [saved, setSaved] = useState(false);

  return (
    <RoleGate allow={["student"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: "Assignments", href: "/app/student/assignments" },
          { label: assignment.title },
        ]}
        title={assignment.title}
        subtitle={`Due ${formatDemoDate(assignment.dueDate)} · ${assignment.standardCodes.join(", ")}`}
        actions={<Badge tone="amber">Demo data</Badge>}
      />

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-12" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Prompt</Eyebrow>
          <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>
            {assignment.instructions}
          </p>
        </div>
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          <label className="stack-8">
            <span className="micro-label">Show each step on its own line</span>
            <Textarea
              rows={7}
              value={work}
              onChange={(event) => {
                setWork(event.target.value);
                setSaved(false);
              }}
              placeholder={"3(x + 4) = 21\n..."}
            />
          </label>
          <div className="row-16">
            <Button
              variant="accent"
              disabled={work.trim().length === 0}
              onClick={() => {
                saveSubmission(
                  "stu-sophia",
                  assignment.id,
                  work.split("\n").map((line) => line.trim()).filter(Boolean),
                );
                setSaved(true);
              }}
            >
              Save my response
            </Button>
            {saved && <span className="micro-label">Saved to this browser</span>}
          </div>
          {submission?.teacherFeedback && (
            <Alert tone="info" title="Teacher feedback">{submission.teacherFeedback}</Alert>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
