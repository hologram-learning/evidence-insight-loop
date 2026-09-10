import { Link, createFileRoute } from "@tanstack/react-router";
import { Alert, Card, Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";

export const Route = createFileRoute("/pilot-launch")({
  head: () => ({
    meta: [
      { title: "Pilot launch model — Hologram Learning" },
      {
        name: "description",
        content:
          "How Hologram is designed to launch alongside an existing LMS during pilot evaluation, and what this build simulates rather than integrates.",
      },
      { property: "og:title", content: "Pilot launch model — Hologram Learning" },
      {
        property: "og:description",
        content: "A simulated LTI-style launch boundary for pilot evaluation. No certification is claimed.",
      },
    ],
  }),
  component: PilotLaunchPage,
});

const CONTEXT_FIELDS = [
  ["Issuer", "https://lms.demo.invalid"],
  ["Client ID", "demo-client-0001"],
  ["Deployment ID", "demo-deployment-01"],
  ["Context", "Math 6"],
  ["Resource link", "Standards Evidence Workspace"],
  ["Role", "Instructor"],
];

function PilotLaunchPage() {
  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Pilot launch" }]}
          title="Designed to launch alongside the LMS a school already uses"
          subtitle={PILOT_CONTENT.pilotPositioning}
        />

        <Alert tone="warning" title="Simulated in this build" className="mt-6">
          The launch shown here is generated in your browser for demonstration. No LMS is contacted,
          no credentials are exchanged, and no LTI conformance or certification is claimed.
        </Alert>

        <div className="grid-auto" style={{ marginTop: "var(--s-32)" }}>
          <Card
            elevation="raised"
            title="1 · Teacher opens Hologram from a course"
            description="During pilot evaluation the teacher stays inside familiar navigation and opens Hologram as a course resource."
          />
          <Card
            elevation="raised"
            title="2 · Launch context identifies the class"
            description="Course, section, resource link, and the teacher's role determine which workspace opens."
          />
          <Card
            elevation="raised"
            title="3 · Work happens in Hologram"
            description="Evidence review, mastery, drafted actions, and teacher decisions all take place in the standards workspace."
          />
          <Card
            elevation="raised"
            title="4 · Results are prepared for return"
            description="A passback preview shows exactly what would be returned. In this build the return is simulated only."
          />
        </div>

        <div className="housing" style={{ marginTop: "var(--s-32)" }}>
          <div className="housing-inner" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>Simulated launch context fields</Eyebrow>
            <dl className="grid-auto" style={{ marginTop: "var(--s-12)" }}>
              {CONTEXT_FIELDS.map(([label, value]) => (
                <div key={label} className="inset-plane" style={{ padding: "var(--s-12)" }}>
                  <dt className="micro-label">{label}</dt>
                  <dd style={{ margin: "var(--s-4) 0 0", fontFamily: "var(--font-mono)" }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="row-16" style={{ marginTop: "var(--s-24)" }}>
          <Link to="/launch" className="holo-btn holo-btn--accent">
            Try the simulated launch
          </Link>
          <Link to="/contact" className="holo-btn holo-btn--secondary">
            {PILOT_CONTENT.primaryCta}
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}
