import { createFileRoute } from "@tanstack/react-router";
import { Alert, Card, PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research basis — Hologram Learning" },
      {
        name: "description",
        content:
          "The instructional principles behind Hologram: ordinal mastery, prerequisite reasoning, error analysis, and teacher judgment as the decision point.",
      },
      { property: "og:title", content: "Research basis — Hologram Learning" },
      {
        property: "og:description",
        content: "Design principles, stated openly, with no efficacy or outcome claims.",
      },
    ],
  }),
  component: ResearchPage,
});

const PRINCIPLES = [
  {
    title: "Mastery is ordinal, not a percentage",
    body: "A five-step scale keeps the meaning of a level stable across assignments and avoids implying precision that the evidence does not support.",
  },
  {
    title: "Prerequisites explain more than scores",
    body: "A wrong answer is more useful when it is read against the earlier skills the task depends on.",
  },
  {
    title: "Error analysis beats re-teaching in general",
    body: "Short targeted moves aimed at a specific misconception are easier to schedule and easier to evaluate.",
  },
  {
    title: "Teacher judgment is the decision point",
    body: "Recommendations are proposals. Teachers hold context that no evidence record contains.",
  },
  {
    title: "Traceability is a design requirement",
    body: "Any claim about a student must be walkable back to the artifacts that produced it.",
  },
];

function ResearchPage() {
  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
          title="Principles the product is built on"
          subtitle="These are design commitments, not findings."
        />
        <Alert tone="info" title="No efficacy claims" className="mt-6">
          Hologram has no published outcome results, adoption data, or comparative effectiveness
          evidence. Nothing on this page should be read as such.
        </Alert>
        <div className="grid-auto" style={{ marginTop: "var(--s-32)" }}>
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title} elevation="raised" title={principle.title} description={principle.body} />
          ))}
        </div>
      </div>
    </SiteChrome>
  );
}
