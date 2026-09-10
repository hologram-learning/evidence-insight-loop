import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Eyebrow,
  PageHeader,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { DemoDisclosure } from "@/components/workspace";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { MASTERY_LABEL, formatDemoTimestamp } from "@/lib/mastery";

export const Route = createFileRoute("/app/courses/$courseSlug/passback")({
  component: PassbackPage,
});

function PassbackPage() {
  const { courseSlug } = Route.useParams();
  const { state, preparePassbackBatch, confirmPassback } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const approved = state.interventions.filter(
    (draft) => draft.courseId === course?.id && draft.status === "approved",
  );
  const draft = approved[0];
  const alreadyPrepared = draft
    ? state.passbacks.some((record) => record.interventionId === draft.id)
    : false;

  return (
    <RoleGate allow={["teacher"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Simulated passback" },
        ]}
        title="Simulated passback"
        subtitle="Exactly what would be returned to a connected LMS — prepared, previewed, and confirmed by you."
        actions={<Badge tone="amber" dot>Simulated</Badge>}
      />

      <Alert tone="warning" title="Nothing is transmitted" className="mt-6">
        Demo only — no data is sent to an LMS. Preparing and confirming a passback writes entries to
        the local activity history only.
      </Alert>

      {approved.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState
            title="Nothing approved yet"
            description="Approve an intervention first — only teacher-approved outcomes can be prepared for return."
            action={
              <Link to="/app/courses/$courseSlug/interventions" params={{ courseSlug }} className="holo-btn holo-btn--primary holo-btn--sm">
                Go to intervention review
              </Link>
            }
          />
        </div>
      ) : (
        <div className="housing" style={{ marginTop: "var(--s-24)" }}>
          <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>Prepare a preview</Eyebrow>
            <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>
              Builds a row per student showing the standard, the ordinal mastery level, and the teacher
              status that would accompany it.
            </p>
            <div className="stack-8">
              <Button
                variant="accent"
                disabled={alreadyPrepared || !draft}
                onClick={() => draft && preparePassbackBatch(draft.id)}
              >
                {alreadyPrepared ? "Batch already prepared" : "Prepare simulated passback"}
              </Button>
              {alreadyPrepared && (
                <p className="micro-label" style={{ margin: 0 }}>
                  One preview batch exists for this approved decision. Preparing again would not add
                  duplicate rows.
                </p>
              )}
              <DemoDisclosure />
            </div>
          </div>
        </div>
      )}

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner" style={{ padding: "var(--s-12)" }}>
          {state.passbacks.length === 0 ? (
            <EmptyState title="No passback prepared" description="Prepared previews appear here before confirmation." />
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th>Student</Th>
                  <Th>Standard</Th>
                  <Th>Mastery</Th>
                  <Th>Destination</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </THead>
              <TBody>
                {state.passbacks.map((record) => {
                  const student = STUDENTS.find((s) => s.id === record.studentId);
                  return (
                    <Tr key={record.id}>
                      <Td>{student?.name ?? record.studentId}</Td>
                      <Td>{record.standardCode}</Td>
                      <Td>{MASTERY_LABEL[record.masteryState]}</Td>
                      <Td>{record.destinationLabel}</Td>
                      <Td>
                        {record.confirmed ? (
                          <span className="micro-label">
                            Confirmed {record.confirmedOn ? formatDemoTimestamp(record.confirmedOn) : ""}
                          </span>
                        ) : (
                          <Badge tone="neutral">Preview</Badge>
                        )}
                      </Td>
                      <Td>
                        {!record.confirmed && (
                          <Button size="sm" variant="primary" onClick={() => confirmPassback(record.id)}>
                            Confirm (simulated)
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
