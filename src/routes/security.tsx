import { createFileRoute } from "@tanstack/react-router";
import { Alert, Card, Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Data governance and implementation readiness — Hologram Learning" },
      {
        name: "description",
        content:
          "How Hologram approaches roles, data minimization, retention, teacher control, and audit records during pilot evaluation. No compliance certification is claimed.",
      },
      { property: "og:title", content: "Data governance — Hologram Learning" },
      {
        property: "og:description",
        content: "Implementation readiness notes for school and district reviewers.",
      },
    ],
  }),
  component: SecurityPage,
});

const READINESS = [
  {
    title: "Role separation",
    body: "Teacher, student, instructional leader, and district administrator each see a different surface. Students never see roster data, peer mastery, or teacher controls.",
  },
  {
    title: "Data minimization",
    body: "Only the artifacts, standards alignments, and decisions needed to explain a mastery estimate are kept.",
  },
  {
    title: "Teacher control",
    body: "No recommendation reaches a student without an explicit teacher approval recorded in the activity history.",
  },
  {
    title: "Audit records",
    body: "Every state change records actor, role, timestamp, action, target, and a plain-language description.",
  },
  {
    title: "Retention and deletion",
    body: "Pilot data is scoped to the evaluation and removable on request. In this build all state is local to your browser and can be reset at any time.",
  },
  {
    title: "Access review",
    body: "Districts should expect a documented list of who can see what before any real data is discussed.",
  },
];

function SecurityPage() {
  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Data governance" }]}
          title="Implementation readiness, described honestly"
          subtitle="This page describes how Hologram is designed to handle data. It is not a compliance attestation."
        />
        <Alert tone="warning" title="What is not claimed here" className="mt-6">
          <ul style={{ margin: 0, paddingLeft: "var(--s-16)" }}>
            {PILOT_CONTENT.notClaimed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Alert>
        <div className="grid-auto" style={{ marginTop: "var(--s-32)" }}>
          {READINESS.map((item) => (
            <Card key={item.title} elevation="raised" title={item.title} description={item.body} />
          ))}
        </div>
        <div className="housing" style={{ marginTop: "var(--s-32)" }}>
          <div className="housing-inner" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>This demonstration build</Eyebrow>
            <p className="prose-measure" style={{ color: "var(--fg-muted)", marginBottom: 0 }}>
              {PILOT_CONTENT.demoNotice} Everything you change in the workspace is stored only in your
              own browser and never transmitted. {PILOT_CONTENT.noCommitment}
            </p>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
