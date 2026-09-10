import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Eyebrow,
  Modal,
  PageHeader,
  Textarea,
} from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { isReadOnly } from "@/lib/permissions";

export const Route = createFileRoute("/app/courses/$courseSlug/interventions")({
  component: InterventionsPage,
});

function InterventionsPage() {
  const { courseSlug } = Route.useParams();
  const navigate = useNavigate();
  const { state, role, updateIntervention } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const drafts = state.interventions.filter((draft) => draft.courseId === course?.id);
  const readOnly = isReadOnly(role);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [objective, setObjective] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Interventions" },
        ]}
        title="Intervention review"
        subtitle="Hologram recommends. The teacher decides."
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {readOnly && <ReadOnlyNotice />}

      {drafts.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState
            title="No interventions awaiting review"
            description="Drafted next steps appear here when the evidence record suggests a targeted move."
          />
        </div>
      ) : (
        <div className="stack-24" style={{ marginTop: "var(--s-24)" }}>
          {drafts.map((draft) => {
            const students = STUDENTS.filter((s) => draft.studentIds.includes(s.id));
            return (
              <div key={draft.id} className="housing">
                <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
                  <div className="row-16">
                    <Eyebrow>{`${draft.standardCode} · ${draft.durationMinutes} minutes`}</Eyebrow>
                    <Badge
                      tone={draft.status === "approved" ? "mint" : draft.status === "declined" ? "danger" : "neutral"}
                      dot
                    >
                      {draft.status}
                    </Badge>
                  </div>
                  <h2 className="display-type" style={{ fontSize: "var(--fs-h3)", margin: 0 }}>
                    {draft.title}
                  </h2>
                  <p className="prose-measure" style={{ margin: 0 }}>{draft.objective}</p>

                  <div className="inset-plane stack-8" style={{ padding: "var(--s-16)" }}>
                    <span className="micro-label">Evidence signal</span>
                    <p style={{ margin: 0, color: "var(--fg-muted)" }}>{draft.evidenceSignal}</p>
                  </div>

                  <div>
                    <span className="micro-label">Instructional moves</span>
                    <ol className="prose-measure" style={{ color: "var(--fg-muted)" }}>
                      {draft.moves.map((move) => (
                        <li key={move}>{move}</li>
                      ))}
                    </ol>
                    <span className="micro-label">Exit check</span>
                    <p className="prose-measure" style={{ color: "var(--fg-muted)", margin: "var(--s-4) 0 0" }}>
                      {draft.exitCheck}
                    </p>
                  </div>

                  <div className="row-8">
                    <span className="micro-label">Students</span>
                    {students.map((student) => (
                      <Badge key={student.id} tone="indigo">{student.name}</Badge>
                    ))}
                  </div>

                  {draft.status === "declined" && draft.declineReason && (
                    <Alert tone="warning" title="Declined">{draft.declineReason}</Alert>
                  )}

                  {!readOnly && (
                    <div className="row-16">
                      <Button
                        variant="accent"
                        disabled={draft.status === "approved"}
                        onClick={() =>
                          updateIntervention(
                            draft.id,
                            { status: "approved", decidedOn: new Date().toISOString(), decidedBy: "Ms. Chen" },
                            {
                              action: "Intervention approved",
                              target: draft.title,
                              description: `The teacher approved the drafted ${draft.durationMinutes}-minute move for ${students.length} students.`,
                            },
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingId(draft.id);
                          setObjective(draft.objective);
                        }}
                      >
                        Edit objective
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDeclineId(draft.id);
                          setDeclineReason("");
                        }}
                      >
                        Decline
                      </Button>
                      {draft.status === "approved" && (
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate({
                              to: "/app/courses/$courseSlug/passback",
                              params: { courseSlug },
                            })
                          }
                        >
                          Prepare simulated passback
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="micro-label" style={{ marginTop: "var(--s-16)" }}>
        Every decision is written to the{" "}
        <Link to="/app/activity">activity history</Link>.
      </p>

      <Modal
        open={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Edit the drafted objective"
        description="Your wording replaces the draft and is recorded as a teacher edit."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!editingId) return;
                updateIntervention(
                  editingId,
                  { objective },
                  {
                    action: "Intervention edited",
                    target: "Distributive-property error analysis",
                    description: "The teacher rewrote the objective before deciding.",
                  },
                );
                setEditingId(null);
              }}
            >
              Save edit
            </Button>
          </>
        }
      >
        <Textarea rows={4} value={objective} onChange={(event) => setObjective(event.target.value)} aria-label="Objective" />
      </Modal>

      <Modal
        open={declineId !== null}
        onClose={() => setDeclineId(null)}
        title="Decline this draft"
        description="A short reason helps future drafts match your class."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeclineId(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!declineId) return;
                updateIntervention(
                  declineId,
                  {
                    status: "declined",
                    declineReason: declineReason || "No reason given.",
                    decidedOn: new Date().toISOString(),
                    decidedBy: "Ms. Chen",
                  },
                  {
                    action: "Intervention declined",
                    target: "Distributive-property error analysis",
                    description: `The teacher declined the drafted move. Reason: ${declineReason || "none given"}.`,
                  },
                );
                setDeclineId(null);
              }}
            >
              Decline draft
            </Button>
          </>
        }
      >
        <Textarea
          rows={3}
          value={declineReason}
          onChange={(event) => setDeclineReason(event.target.value)}
          aria-label="Reason for declining"
          placeholder="Already covered this in Tuesday's small group."
        />
      </Modal>
    </RoleGate>
  );
}
