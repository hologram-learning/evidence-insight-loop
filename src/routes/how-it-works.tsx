import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Hologram Learning evidence chain" },
      {
        name: "description",
        content:
          "From a student artifact to a standard, an evidence record, an ordinal mastery estimate, a drafted next step, and a teacher decision that is logged.",
      },
      { property: "og:title", content: "How it works — Hologram Learning" },
      {
        property: "og:description",
        content: "The full evidence chain behind every mastery estimate and every recommended action.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  {
    label: "Artifact captured",
    body: "A student's submitted work is stored as written. Hologram does not overwrite or paraphrase the response.",
  },
  {
    label: "Aligned to a standard",
    body: "The artifact is filed against the standard the assignment targets, with the capture date attached.",
  },
  {
    label: "Evidence accumulated",
    body: "Repeated artifacts build a record. A single item never determines mastery on its own.",
  },
  {
    label: "Mastery estimated",
    body: "Mastery is expressed on a fixed five-step ordinal scale with a stated confidence value and prerequisite risk.",
  },
  {
    label: "Prerequisite context",
    body: "Where the record suggests an earlier skill is unstable, the prerequisite standards are shown alongside the target.",
  },
  {
    label: "Action drafted",
    body: "Hologram drafts a short, specific instructional move tied to the observed error — never a generic recommendation.",
  },
  {
    label: "Teacher decision",
    body: "The teacher edits, approves, or declines with a reason. Nothing is applied automatically.",
  },
  {
    label: "Recorded",
    body: "Actor, role, timestamp, target, and description are written to the activity history.",
  },
];

function HowItWorksPage() {
  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "How it works" }]}
          title="Every estimate can be walked backwards"
          subtitle="If a teacher cannot see why Hologram said something, Hologram should not have said it."
        />
        <div className="evidence-rail" style={{ marginTop: "var(--s-32)" }}>
          {STEPS.map((step, index) => (
            <div
              key={step.label}
              className="evidence-rail__node"
              data-tone={index >= STEPS.length - 2 ? "signal" : undefined}
            >
              <span className="micro-label">{`Step ${index + 1}`}</span>
              <h2 style={{ fontSize: "var(--fs-h4)", margin: "var(--s-4) 0" }}>{step.label}</h2>
              <p className="prose-measure" style={{ color: "var(--fg-muted)", margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="section section--tight">
        <div className="housing">
          <div className="housing-inner" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>Limits of this pilot build</Eyebrow>
            <p className="prose-measure" style={{ color: "var(--fg-muted)", marginBottom: 0 }}>
              The pilot workspace uses seeded demo data and does not perform live inference. Drafted
              actions in the demo are pre-written examples that illustrate the review workflow.
            </p>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
