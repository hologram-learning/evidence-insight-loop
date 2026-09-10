import { Link, createFileRoute } from "@tanstack/react-router";
import { Card, Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — Hologram Learning standards-based LMS" },
      {
        name: "description",
        content:
          "Courses, assignments, submissions, standards evidence, a standards gradebook, reviewed interventions, and an activity log — the pilot product surface.",
      },
      { property: "og:title", content: "Product — Hologram Learning" },
      {
        property: "og:description",
        content: "The standards-based workspace teachers use to move from evidence to a reviewed decision.",
      },
    ],
  }),
  component: ProductPage,
});

const SURFACES = [
  {
    title: "Courses and rosters",
    body: "Terms, courses, sections, and enrollments organize the class the way a school already thinks about it.",
  },
  {
    title: "Assignments and submissions",
    body: "Assignments carry standards and rubric criteria. Submissions keep the student's actual response intact.",
  },
  {
    title: "Standards evidence",
    body: "Each artifact is filed against a standard with a capture date, so a mastery estimate can always be traced back.",
  },
  {
    title: "Standards gradebook",
    body: "An ordinal mastery view with an evidence count per cell, plus a conventional-grade comparison for schools mid-transition.",
  },
  {
    title: "Intervention review",
    body: "Drafted next steps arrive as proposals. The teacher edits, approves, or declines with a reason.",
  },
  {
    title: "Activity history",
    body: "Actor, role, timestamp, action, target, and a plain-language description for every state change.",
  },
];

function ProductPage() {
  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Product" }]}
          title="A standards-based workspace, not a dashboard bolted on top"
          subtitle={PILOT_CONTENT.qualifiedPositioning}
        />
        <div className="grid-auto" style={{ marginTop: "var(--s-32)" }}>
          {SURFACES.map((surface) => (
            <Card key={surface.title} elevation="raised" title={surface.title} description={surface.body} />
          ))}
        </div>
      </div>

      <div className="section section--tight">
        <div className="housing">
          <div className="housing-inner" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>Governance</Eyebrow>
            <h2 className="display-type" style={{ fontSize: "var(--fs-h2)", marginTop: "var(--s-8)" }}>
              {PILOT_CONTENT.governance}
            </h2>
            <p className="prose-measure" style={{ color: "var(--fg-muted)" }}>
              No recommendation reaches a student until a teacher approves it, and no approval is
              recorded without an entry in the activity history.
            </p>
            <Link to="/launch" className="holo-btn holo-btn--primary holo-btn--sm">
              Open the pilot workspace
            </Link>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
