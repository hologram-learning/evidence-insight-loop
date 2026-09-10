import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Modal,
  PageHeader,
  Textarea,
} from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import {
  AUTHORITY_LINE,
  AgentReasoningPanel,
  AuditReceipt,
  DemoDisclosure,
  EvidenceRail,
  Housing,
  MasteryCellButton,
  PrerequisiteChain,
  StatusChip,
  WhyThisIsHere,
} from "@/components/workspace";
import { COURSES, EVIDENCE, SUBMISSIONS } from "@/data/seed";
import { useDemo, type DraftPlan } from "@/lib/demo-state";
import { isReadOnly } from "@/lib/permissions";
import { MASTERY_LABEL, formatDemoTimestamp } from "@/lib/mastery";
import { masteryFor, studentsById } from "@/lib/records";

export const Route = createFileRoute("/app/courses/$courseSlug/interventions/$draftSlug")({
  component: DecisionWorkspace,
});

function DecisionWorkspace() {
  const { courseSlug, draftSlug } = Route.useParams();
  const { state, role, editDraft, approveDraft, declineDraft, resetDraft, preparePassbackBatch } =
    useDemo();
  const course = COURSES.find((item) => item.slug === courseSlug);
  const draft = state.interventions.find(
    (item) => item.slug === draftSlug && item.courseId === course?.id,
  );

  const [editOpen, setEditOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [plan, setPlan] = useState<DraftPlan | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [override, setOverride] = useState(false);

  const students = useMemo(() => studentsById(draft?.studentIds ?? []), [draft?.studentIds]);
  const receipt = useMemo(
    () =>
      [...state.audit]
        .reverse()
        .find((event) => event.context?.recommendationId === draft?.id),
    [state.audit, draft?.id],
  );
  const prepared = state.passbacks.filter((record) => record.interventionId === draft?.id);

  if (!draft || !course) {
    return (
      <RoleGate allow={["teacher", "leader"]}>
        <EmptyState
          title="That draft is not in this course"
          description="Return to the decision queue to pick a drafted next step."
        />
      </RoleGate>
    );
  }

  const readOnly = isReadOnly(role);
  const edited = draft.teacherEdits.length > 0;
  const artifacts = EVIDENCE.filter(
    (item) => draft.studentIds.includes(item.studentId) && item.standardCode === draft.standardCode,
  );
  const sophiaSubmission = SUBMISSIONS.find((item) => item.studentId === "stu-sophia");

  const openEditor = (asOverride: boolean) => {
    setPlan({ objective: draft.objective, moves: [...draft.moves], exitCheck: draft.exitCheck });
    setOverride(asOverride);
    setEditOpen(true);
  };

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course.name, href: `/app/courses/${courseSlug}/overview` },
          { label: "Decisions", href: `/app/courses/${courseSlug}/interventions` },
          { label: draft.title },
        ]}
        title={draft.title}
        subtitle={AUTHORITY_LINE}
        actions={
          <div className="row-8">
            <StatusChip status={draft.status} edited={edited} />
            <Badge tone="amber">Demo data</Badge>
          </div>
        }
      />
      {readOnly && <ReadOnlyNotice />}

      <div style={{ marginTop: "var(--s-16)" }}>
        <EvidenceRail
          active="Teacher action"
          values={{
            Artifact: `${artifacts.length} captured responses`,
            Standard: draft.standardCode,
            Mastery: "Developing across the group",
            Risk: "Prerequisite gap: 5.OA.A.1",
            "Teacher action": draft.status === "draft" ? "Awaiting your decision" : draft.status,
          }}
        />
      </div>

      <div className="planes" style={{ marginTop: "var(--s-24)" }}>
        {/* Evidence plane */}
        <div className="stack-16">
          <Housing>
            <div className="stack-8">
              <span className="micro-label">Evidence · what happened</span>
              <p className="prose-measure" style={{ margin: 0 }}>
                {draft.evidenceSignal}
              </p>
              {sophiaSubmission && (
                <div className="inset-plane stack-8" style={{ padding: "var(--s-16)" }}>
                  <span className="micro-label">Sophia Martinez · checkpoint response</span>
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--fs-body-sm)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {sophiaSubmission.lines.join("\n")}
                  </pre>
                  <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-body-sm)" }}>
                    {sophiaSubmission.identifiedIssue}
                  </p>
                </div>
              )}
            </div>
          </Housing>

          <Housing>
            <div className="stack-8">
              <span className="micro-label">Learners in this group</span>
              <table className="grid-plane">
                <thead>
                  <tr>
                    <th scope="col">Learner</th>
                    <th scope="col">{draft.standardCode}</th>
                    <th scope="col">Prerequisite 5.OA.A.1</th>
                    <th scope="col">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
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
                          state={masteryFor(student, draft.standardCode)}
                          studentName={student.name}
                          standardCode={draft.standardCode}
                        />
                      </td>
                      <td>
                        <MasteryCellButton
                          state={masteryFor(student, "5.OA.A.1")}
                          studentName={student.name}
                          standardCode="5.OA.A.1"
                        />
                      </td>
                      <td style={{ color: "var(--fg-muted)" }}>{student.recentEvidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Housing>

          <Housing>
            <div className="stack-8">
              <span className="micro-label">Prerequisite chain</span>
              <PrerequisiteChain
                codes={["4.NBT.B.5", "5.OA.A.1", "6.EE.A.3", "6.EE.B.7"]}
                focusCode={draft.standardCode}
              />
              <WhyThisIsHere>
                Four learners repeat one error class on {draft.standardCode}, and the upstream
                standard 5.OA.A.1 is the shared gap.
              </WhyThisIsHere>
            </div>
          </Housing>
        </div>

        {/* Decision plane */}
        <div className="stack-16">
          <AgentReasoningPanel
            rationale={draft.originalRecommendation.rationale}
            confidence={draft.originalRecommendation.confidence}
            limitations={draft.originalRecommendation.limitations}
          >
            <div className="stack-8">
              <span className="micro-label">Original recommendation · never overwritten</span>
              <p className="prose-measure" style={{ margin: 0 }}>
                {draft.originalRecommendation.objective}
              </p>
              <ol className="prose-measure" style={{ color: "var(--fg-muted)", margin: 0 }}>
                {draft.originalRecommendation.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ol>
              <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-body-sm)" }}>
                Exit check: {draft.originalRecommendation.exitCheck}
              </p>
            </div>
          </AgentReasoningPanel>

          <Housing>
            <div className="stack-8">
              <div className="row-16">
                <span className="micro-label">
                  {edited ? "Teacher plan · edited" : "Teacher plan · unchanged from the draft"}
                </span>
                <span className="micro-label">{draft.durationMinutes} minutes</span>
              </div>
              <p className="prose-measure" style={{ margin: 0 }}>
                {draft.objective}
              </p>
              <ol className="prose-measure" style={{ color: "var(--fg-muted)", margin: 0 }}>
                {draft.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ol>
              <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-body-sm)" }}>
                Exit check: {draft.exitCheck}
              </p>

              {draft.status === "declined" && draft.declineReason && (
                <Alert tone="warning" title="Declined">
                  {draft.declineReason}
                </Alert>
              )}

              {!readOnly && (
                <div className="row-8">
                  <Button
                    variant="accent"
                    disabled={draft.status === "approved"}
                    onClick={() => approveDraft(draft.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={draft.status === "approved"}
                    onClick={() => openEditor(false)}
                  >
                    Edit plan
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={draft.status === "approved"}
                    onClick={() => openEditor(true)}
                  >
                    Override with my own
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={draft.status === "approved"}
                    onClick={() => {
                      setDeclineReason("");
                      setDeclineOpen(true);
                    }}
                  >
                    Decline
                  </Button>
                  <Button variant="ghost" onClick={() => resetDraft(draft.id)}>
                    Reset to original
                  </Button>
                </div>
              )}
            </div>
          </Housing>

          {edited && (
            <Housing>
              <div className="stack-8">
                <span className="micro-label">Edit history</span>
                {draft.teacherEdits.map((edit) => (
                  <div key={edit.id} className="stack-8" style={{ gap: "var(--s-4)" }}>
                    <span className="micro-label">
                      {edit.field} · {formatDemoTimestamp(edit.editedOn)} · {edit.editedBy}
                    </span>
                    <p style={{ margin: 0, color: "var(--fg-subtle)", fontSize: "var(--fs-body-sm)" }}>
                      Was: {edit.previous}
                    </p>
                    <p style={{ margin: 0, fontSize: "var(--fs-body-sm)" }}>Now: {edit.next}</p>
                  </div>
                ))}
              </div>
            </Housing>
          )}

          {receipt && <AuditReceipt event={receipt} />}

          {draft.status === "approved" && !readOnly && (
            <Housing>
              <div className="stack-8">
                <span className="micro-label">Simulated passback</span>
                {prepared.length === 0 ? (
                  <>
                    <p style={{ margin: 0, color: "var(--fg-muted)" }}>
                      Prepare one preview batch of {draft.studentIds.length} rows for review.
                    </p>
                    <div>
                      <Button variant="primary" onClick={() => preparePassbackBatch(draft.id)}>
                        Prepare simulated passback
                      </Button>
                    </div>
                  </>
                ) : (
                  <p style={{ margin: 0, color: "var(--fg-muted)" }}>
                    A batch of {prepared.length} rows is already prepared.{" "}
                    <Link to="/app/courses/$courseSlug/passback" params={{ courseSlug }}>
                      Review the preview
                    </Link>
                    .
                  </p>
                )}
                <DemoDisclosure />
              </div>
            </Housing>
          )}
        </div>
      </div>

      <Modal
        open={editOpen && plan !== null}
        onClose={() => setEditOpen(false)}
        title={override ? "Override this recommendation" : "Edit the drafted plan"}
        description="The agent's original recommendation stays visible next to your version."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (plan) editDraft(draft.id, plan, override ? "override" : "edit");
                setEditOpen(false);
              }}
            >
              Save {override ? "override" : "edit"}
            </Button>
          </>
        }
      >
        {plan && (
          <div className="stack-16">
            <Textarea
              rows={3}
              value={plan.objective}
              onChange={(event) => setPlan({ ...plan, objective: event.target.value })}
              aria-label="Objective"
            />
            <Textarea
              rows={5}
              value={plan.moves.join("\n")}
              onChange={(event) =>
                setPlan({ ...plan, moves: event.target.value.split("\n").filter(Boolean) })
              }
              aria-label="Instructional moves, one per line"
            />
            <Textarea
              rows={2}
              value={plan.exitCheck}
              onChange={(event) => setPlan({ ...plan, exitCheck: event.target.value })}
              aria-label="Exit check"
            />
          </div>
        )}
      </Modal>

      <Modal
        open={declineOpen}
        onClose={() => setDeclineOpen(false)}
        title="Decline this draft"
        description="A short reason helps future drafts match your class."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeclineOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                declineDraft(draft.id, declineReason || "No reason given.");
                setDeclineOpen(false);
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

      <p className="micro-label" style={{ marginTop: "var(--s-16)" }}>
        Mastery vocabulary: {Object.values(MASTERY_LABEL).join(" · ")}
      </p>
    </RoleGate>
  );
}
