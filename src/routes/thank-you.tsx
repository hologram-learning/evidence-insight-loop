import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EmptyState, PageHeader } from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";
import { formatDemoTimestamp } from "@/lib/mastery";
import { readPilotRequest } from "@/lib/storage";
import type { PilotRequest } from "@/types/domain";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Pilot request received — Hologram Learning" },
      {
        name: "description",
        content: "Your pilot review request was saved locally in this demonstration build.",
      },
      { property: "og:title", content: "Pilot request received — Hologram Learning" },
      { property: "og:description", content: "What happens next in a Hologram pilot review." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const [request, setRequest] = useState<PilotRequest | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRequest(readPilotRequest());
    setLoaded(true);
  }, []);

  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Pilot request" }]}
          title="Request received"
          subtitle={PILOT_CONTENT.timelineLabel}
        />

        {!loaded ? (
          <p className="micro-label" style={{ marginTop: "var(--s-24)" }}>
            Loading your saved request…
          </p>
        ) : request ? (
          <div className="housing" style={{ marginTop: "var(--s-24)", maxWidth: "720px" }}>
            <div className="housing-inner stack-12" style={{ padding: "var(--s-24)" }}>
              <span className="micro-label">Saved locally · {formatDemoTimestamp(request.submittedOn)}</span>
              <p style={{ margin: 0 }}>
                <strong>{request.fullName}</strong> · {request.organization} · {request.role}
              </p>
              <p className="prose-measure" style={{ color: "var(--fg-muted)", margin: 0 }}>
                {request.goals}
              </p>
              <p className="prose-measure" style={{ color: "var(--fg-subtle)", margin: 0 }}>
                In a real deployment this would reach the Hologram team. In this demonstration it stays
                in your browser.
              </p>
              <div className="row-16">
                <Link to="/launch" className="holo-btn holo-btn--primary holo-btn--sm">
                  Open the pilot workspace
                </Link>
                <Link to="/pilot-launch" className="holo-btn holo-btn--ghost holo-btn--sm">
                  Read the launch model
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "var(--s-24)" }}>
            <EmptyState
              title="No pilot request saved"
              description="Nothing is stored in this browser yet. Send a request and it will appear here."
              action={
                <Link to="/contact" className="holo-btn holo-btn--primary holo-btn--sm">
                  {PILOT_CONTENT.primaryCta}
                </Link>
              }
            />
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
