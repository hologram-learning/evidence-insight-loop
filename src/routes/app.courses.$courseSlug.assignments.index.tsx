import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Textarea,
  Tr,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { COURSES } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { formatDemoDate } from "@/lib/mastery";
import type { Assignment } from "@/types/domain";

export const Route = createFileRoute("/app/courses/$courseSlug/assignments/")({
  component: AssignmentsPage,
});

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "assignment";
}

function AssignmentsPage() {
  const { courseSlug } = Route.useParams();
  const { state, addAssignment } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const assignments = state.assignments.filter((a) => a.courseId === course?.id);

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const standards = String(form.get("standards") ?? "").trim();
    if (!title || !standards) {
      setError("A title and at least one standard code are required.");
      return;
    }
    const assignment: Assignment = {
      id: `asg-${Date.now().toString(36)}`,
      slug: slugify(title),
      courseId: course!.id,
      title,
      instructions: String(form.get("instructions") ?? "").trim(),
      dueDate: String(form.get("dueDate") ?? "") || new Date().toISOString().slice(0, 10),
      standardCodes: standards.split(",").map((code) => code.trim()).filter(Boolean),
      status: "published",
      visibleToStudents: true,
      rubric: [],
      submissionCount: 0,
      createdInDemo: true,
    };
    addAssignment(assignment);
    setError("");
    setOpen(false);
  }

  return (
    <RoleGate allow={["teacher"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Assignments" },
        ]}
        title="Assignments"
        subtitle="Each assignment carries the standards it is meant to produce evidence for."
        actions={<Button variant="primary" onClick={() => setOpen(true)}>New assignment</Button>}
      />

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner" style={{ padding: "var(--s-12)" }}>
          {assignments.length === 0 ? (
            <EmptyState
              title="No assignments yet"
              description="Create one to see how evidence flows into standards and mastery."
              action={<Button variant="primary" onClick={() => setOpen(true)}>New assignment</Button>}
            />
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th>Assignment</Th>
                  <Th>Standards</Th>
                  <Th>Due</Th>
                  <Th numeric>Submissions</Th>
                  <Th>Status</Th>
                </Tr>
              </THead>
              <TBody>
                {assignments.map((assignment) => (
                  <Tr key={assignment.id}>
                    <Td>
                      <Link
                        to="/app/courses/$courseSlug/assignments/$assignmentSlug"
                        params={{ courseSlug, assignmentSlug: assignment.slug }}
                      >
                        {assignment.title}
                      </Link>
                    </Td>
                    <Td>{assignment.standardCodes.join(", ")}</Td>
                    <Td>{formatDemoDate(assignment.dueDate)}</Td>
                    <Td numeric>{assignment.submissionCount}</Td>
                    <Td>
                      <Badge tone={assignment.status === "reviewed" ? "mint" : "neutral"}>
                        {assignment.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New assignment"
        description="Demo only — saved in this browser and recorded in the activity history."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="new-assignment">
              Create assignment
            </Button>
          </>
        }
      >
        <form id="new-assignment" className="stack-12" onSubmit={handleCreate}>
          <Field label="Title" htmlFor="title" required error={error || undefined}>
            <Input id="title" name="title" />
          </Field>
          <Field label="Standard codes" htmlFor="standards" required help="Comma separated, e.g. 6.EE.A.3">
            <Input id="standards" name="standards" defaultValue="6.EE.A.3" />
          </Field>
          <Field label="Due date" htmlFor="dueDate">
            <Input id="dueDate" name="dueDate" type="date" />
          </Field>
          <Field label="Instructions" htmlFor="instructions">
            <Textarea id="instructions" name="instructions" rows={3} />
          </Field>
        </form>
      </Modal>
    </RoleGate>
  );
}
