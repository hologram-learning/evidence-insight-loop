import { createFileRoute } from "@tanstack/react-router";
import { Alert, Badge, Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { PILOT_CONTENT } from "@/data/pilotContent";

export const Route = createFileRoute("/app/district/implementation")({
  component: DistrictImplementation,
});

const READINESS = [
  {
    title: "Identity and roles",
    body: "Teacher, student, instructional leader, and district roles are modelled in the demo. Production identity, SSO, and multi-tenancy are not built.",
  },
  {
    title: "Launch boundary",
    body: "The workspace is designed to launch alongside an existing LMS. This build uses a simulated launch context only — no LTI implementation and no certification.",
  },
  {
    title: "Data boundaries",
    body: "All records in this environment are synthetic and stored locally in your browser. Nothing is transmitted to a server.",
  },
  {
    title: "Auditability",
    body: "Evidence review, intervention edits, decisions, and simulated passback are all written to an inspectable activity history with actor, role, and timestamp.",
  },
  {
    title: "Grade return",
    body: "Passback is previewed and confirmed locally to show exactly what would be returned. Production passback is not implemented.",
  },
];

function DistrictImplementation() {
  return (
    <RoleGate allow={["district", "leader"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Implementation readiness" }]}
        title="Implementation readiness"
        subtitle="What this build demonstrates, and what would still need to be established."
        actions={<Badge tone="amber">Read-only demo</Badge>}
      />
      <ReadOnlyNotice />

      <Alert tone="warning" title="Not a compliance statement" className="mt-6">
        This page describes implementation posture in a demonstration environment. It is not a
        certification, an audit result, or a guarantee of compliance.
      </Alert>

      <div className="stack-16" style={{ marginTop: "var(--s-24)" }}>
        {READINESS.map((item) => (
          <div key={item.title} className="housing">
            <div className="housing-inner stack-8" style={{ padding: "var(--s-24)" }}>
              <Eyebrow>{item.title}</Eyebrow>
              <p className="prose-measure" style={{ margin: 0, color: "var(--fg-muted)" }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner stack-8" style={{ padding: "var(--s-24)" }}>
          <Eyebrow>Not claimed</Eyebrow>
          <ul className="prose-measure" style={{ color: "var(--fg-muted)" }}>
            {PILOT_CONTENT.notClaimed.map((claim) => (
              <li key={claim}>{claim}</li>
            ))}
          </ul>
        </div>
      </div>
    </RoleGate>
  );
}
