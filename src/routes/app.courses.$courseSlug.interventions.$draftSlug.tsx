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
import { chainFor, masteryFor, prerequisiteContext, studentsById } from "@/lib/records";
import { DraftActivityHistory, SeededMasteryHistory } from "@/components/DecisionHistory";
import { standardByCode } from "@/data/standards";

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
  const [resetOpen, setResetOpen] = useState(false);

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
  const submissions = SUBMISSIONS.filter((item) => draft.studentIds.includes(item.studentId));
  const prereqs = prerequisiteContext(draft.standardCode, students);
  // Primary prerequisite = the one with the most affected learners below Secure (ties keep data order).
  const primary = prereqs.reduce<(typeof prereqs)[number] | undefined>(
    (best, item) => (item.belowSecure > 0 && (!best || item.belowSecure > best.belowSecure) ? item : best),
    undefined,
  );
  const primaryCode = primary?.relation.fromCode;
  const focusStates = students.map((student) => masteryFor(student, draft.standardCode));
  const focusSummary = Object.entries(MASTERY_LABEL)
    .map(([key, label]) => [label, focusStates.filter((state) => state === key).length] as const)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${count} ${label}`)
    .join(" · ");

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
          <div className="hrow-8">
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
            Mastery: focusSummary || "Not assessed",
            Risk: primaryCode ? `Prerequisite gap: ${primaryCode}` : "No recorded prerequisite gap",
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
              {submissions.map((submission) => (
                <div key={submission.id} className="inset-plane stack-8" style={{ padding: "var(--s-16)" }}>
                  <span className="micro-label">
                    {students.find((student) => student.id === submission.studentId)?.name} · checkpoint response
                  </span>
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--fs-body-sm)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {submission.lines.join("\n")}
                  </pre>
                  <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-body-sm)" }}>
                    {submission.identifiedIssue}
                  </p>
                </div>
              ))}
            </div>
          </Housing>

          <Housing>
            <div className="stack-8">
              <span className="micro-label">Learners in this group</span>
              <div className="plane-scroll"><table className="grid-plane">
                <thead>
                  <tr>
                    <th scope="col">Learner</th>
                    <th scope="col">{draft.standardCode}</th>
                    {primaryCode && <th scope="col">Prerequisite {primaryCode}</th>}
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
                      {primaryCode && (
                        <td>
                          <MasteryCellButton
                            state={masteryFor(student, primaryCode)}
                            studentName={student.name}
                            standardCode={primaryCode}
                          />
                        </td>
                      )}
                      <td style={{ color: "var(--fg-muted)" }}>{student.recentEvidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          </Housing>

          <Housing>
            <div className="stack-8">
              <span className="micro-label">Prerequisites for {draft.standardCode}</span>
              {prereqs.length === 0 ? (
                <p style={{ margin: 0, color: "var(--fg-muted)" }}>
                  The standards data records no prerequisite for {draft.standardCode}, so none is shown.
                </p>
              ) : (
                <>
                  <PrerequisiteChain codes={chainFor(draft.standardCode, primaryCode)} focusCode={draft.standardCode} />
                  <ul className="stack-8" style={{ margin: 0, paddingLeft: "var(--s-16)" }}>
                    {prereqs.map(({ relation, assessed, belowSecure }) => (
                      <li key={relation.fromCode} style={{ color: "var(--fg-muted)", fontSize: "var(--fs-body-sm)" }}>
                        <strong style={{ color: "var(--fg)" }}>{relation.fromCode}</strong>{" "}
                        {standardByCode(relation.fromCode)?.label} — {belowSecure} of {assessed} learners in
                        this group below Secure. {relation.description}
                      </li>
                    ))}
                  </ul>
                  <WhyThisIsHere>
                    {primary
                      ? `${primary.belowSecure} of ${students.length} learners in this group are below Secure on ${primary.relation.fromCode}, the prerequisite shown in the chain.`
                      : `No learner in this group is below Secure on a recorded prerequisite of ${draft.standardCode}.`}
                  </WhyThisIsHere>
                </>
              )}
            </div>
          </Housing>
        </div>

        {/* Decision plane */}
        <div className="stack-16">
          <SeededMasteryHistory students={students} standardCode={draft.standardCode} />

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
              <div className="hrow-16">
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
                <div className="hrow-8">
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
                  <Button variant="ghost" onClick={() => setResetOpen(true)}>
                    Reset to original
                  </Button>
                </div>
              )}
            </div>
          </Housing>

          {!readOnly && <DraftActivityHistory draft={draft} events={state.audit} />}

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
              disabled={declineReason.trim().length === 0}
              onClick={() => {
                declineDraft(draft.id, declineReason.trim());
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
          aria-label="Reason for declining (required)"
          placeholder="Already covered this in Tuesday's small group."
        />
      </Modal>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset this draft to the original recommendation?"
        description="Your edits and decision on this draft are cleared. Earlier entries stay in the demo activity history."
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetDraft(draft.id);
                setResetOpen(false);
              }}
            >
              Reset draft
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, color: "var(--fg-muted)" }}>The original recommendation is never changed.</p>
      </Modal>

      <p className="micro-label" style={{ marginTop: "var(--s-16)" }}>
        Mastery vocabulary: {Object.values(MASTERY_LABEL).join(" · ")}
      </p>
    </RoleGate>
  );
}
