import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Hologram Learning pilot" },
      {
        name: "description",
        content:
          "Answers about the Hologram pilot: what it is, how it runs next to an existing LMS, what data is involved, and what is not yet claimed.",
      },
      { property: "og:title", content: "FAQ — Hologram Learning pilot" },
      {
        property: "og:description",
        content: "Straight answers about scope, data, and the limits of the current pilot build.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Is Hologram an LMS?",
    a: "Hologram is being built as a standards-based LMS. During pilot evaluation it is designed to launch alongside the LMS a school already uses. It does not replace an existing LMS today.",
  },
  {
    q: "Does this build integrate with our LMS?",
    a: "No. The launch context in this build is simulated in the browser for demonstration. No LTI certification, conformance, or live integration is claimed.",
  },
  {
    q: "Does it grade for teachers?",
    a: "No. Hologram organizes evidence, estimates mastery on a fixed ordinal scale, and drafts a next step. Teachers edit, approve, or decline.",
  },
  {
    q: "Is there real student data here?",
    a: "No. Every student, submission, and figure in the workspace is seeded demo data stored locally in your browser.",
  },
  {
    q: "Who can join the pilot?",
    a: PILOT_CONTENT.cohortScopeStatement,
  },
  {
    q: "What is the timeline?",
    a: PILOT_CONTENT.timelineLabel,
  },
  {
    q: "Does a pilot require real student records?",
    a: PILOT_CONTENT.noCommitment,
  },
  {
    q: "Can a student see other students' work or mastery?",
    a: "No. The student role shows only that student's own assignments, progress, and teacher feedback.",
  },
];

function FaqPage() {
  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
          title="Questions schools ask first"
        />
        <div className="stack-16" style={{ marginTop: "var(--s-32)" }}>
          {FAQS.map((item) => (
            <details key={item.q} className="housing">
              <summary
                style={{
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-h4)",
                  padding: "var(--s-4)",
                }}
              >
                {item.q}
              </summary>
              <p className="prose-measure" style={{ color: "var(--fg-muted)", padding: "var(--s-8) var(--s-4) 0" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SiteChrome>
  );
}
