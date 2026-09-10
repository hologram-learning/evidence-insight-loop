import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Workflow } from "lucide-react";
import { Badge, Card, Eyebrow, StatCard } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hologram Learning — standards-based LMS pilot" },
      {
        name: "description",
        content:
          "A standards-based LMS being built around traceable learning evidence. During pilot evaluation it is designed to launch alongside an existing LMS.",
      },
      { property: "og:title", content: "Hologram Learning — standards-based LMS pilot" },
      {
        property: "og:description",
        content:
          "Evidence to mastery to a reviewed teacher decision. Explore the pilot workspace with seeded demo data.",
      },
    ],
  }),
  component: HomePage,
});

const CHAIN = [
  { label: "Artifact", body: "A student's actual response is kept intact, not reduced to a score." },
  { label: "Standard", body: "The response is organized against the standard it addresses." },
  { label: "Evidence", body: "Repeated artifacts form the record behind a mastery estimate." },
  { label: "Mastery", body: "Mastery is ordinal, with stated confidence and prerequisite risk." },
  { label: "Draft action", body: "Hologram drafts a targeted next step for the teacher." },
  { label: "Teacher decision", body: "The teacher edits, approves, or declines. Every step is logged." },
];

function HomePage() {
  return (
    <SiteChrome>
      <section className="section">
        <div className="stack-24" style={{ maxWidth: "var(--hero-max)" }}>
          <Badge tone="indigo" dot>
            {PILOT_CONTENT.cohortName}
          </Badge>
          <h1 className="display-type" style={{ fontSize: "var(--fs-hero)", margin: 0 }}>
            Learning evidence you can follow from a student's work to the decision it changed.
          </h1>
          <p className="prose-measure" style={{ fontSize: "var(--fs-body-lg)", color: "var(--fg-muted)" }}>
            {PILOT_CONTENT.qualifiedPositioning} Teachers see the artifact, the standard, the
            prerequisite gap, and a drafted next step — then decide.
          </p>
          <div className="row-16">
            <Link to="/launch" className="holo-btn holo-btn--accent">
              {PILOT_CONTENT.secondaryCta}
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="holo-btn holo-btn--secondary">
              {PILOT_CONTENT.primaryCta}
            </Link>
          </div>
          <p className="micro-label">{PILOT_CONTENT.demoNotice}</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="grid-auto">
          <StatCard eyebrow="Governance" value="Teacher" sub="decides every recommended action" />
          <StatCard eyebrow="Mastery scale" value="5" unit="steps" sub="ordinal, never a hidden score" />
          <StatCard eyebrow="Every action" value="Logged" sub="actor, role, time, target, description" />
        </div>
      </section>

      <section className="section">
        <Eyebrow>The evidence chain</Eyebrow>
        <h2 className="display-type" style={{ fontSize: "var(--fs-h1)" }}>
          Six links, none of them hidden
        </h2>
        <div className="evidence-rail" style={{ marginTop: "var(--s-24)" }}>
          {CHAIN.map((node, index) => (
            <div
              key={node.label}
              className="evidence-rail__node"
              data-tone={index === CHAIN.length - 1 ? "signal" : undefined}
            >
              <span className="micro-label">{`0${index + 1} · ${node.label}`}</span>
              <p className="prose-measure" style={{ margin: "var(--s-4) 0 0" }}>
                {node.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="grid-auto">
          <Card
            elevation="raised"
            title="Runs alongside your LMS during pilot"
            description={PILOT_CONTENT.pilotPositioning}
          >
            <Link to="/pilot-launch" className="holo-btn holo-btn--ghost holo-btn--sm">
              <Workflow size={16} /> See the pilot launch model
            </Link>
          </Card>
          <Card
            elevation="raised"
            title="Implementation readiness, stated plainly"
            description="Data handling, roles, retention, and teacher control are documented as implementation readiness — not as certification."
          >
            <Link to="/security" className="holo-btn holo-btn--ghost holo-btn--sm">
              <ShieldCheck size={16} /> Read the governance notes
            </Link>
          </Card>
        </div>
      </section>

      <section className="section section--tight">
        <div className="housing">
          <div className="housing-inner" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>What Hologram does not claim</Eyebrow>
            <ul className="prose-measure" style={{ color: "var(--fg-muted)", marginBottom: 0 }}>
              {PILOT_CONTENT.notClaimed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
