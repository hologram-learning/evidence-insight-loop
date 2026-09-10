import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { Alert, Badge, Button, Eyebrow, PageHeader } from "@/design-system/code-companions-0f8a99";

import { PILOT_CONTENT } from "@/data/pilotContent";
import { useDemo } from "@/lib/demo-state";
import { formatDemoTimestamp } from "@/lib/mastery";

export const Route = createFileRoute("/launch")({
  head: () => ({
    meta: [
      { title: "Simulated pilot launch — Hologram Learning" },
      {
        name: "description",
        content:
          "Open the Hologram pilot workspace through a simulated LTI-style launch context generated in your browser. No LMS is contacted.",
      },
      { property: "og:title", content: "Simulated pilot launch — Hologram Learning" },
      {
        property: "og:description",
        content: "Preview the launch context, then enter the teacher workspace for Math 6 — Period 3.",
      },
    ],
  }),
  component: LaunchPage,
});

function LaunchPage() {
  const navigate = useNavigate();
  const { launchContext, launchDemoContext, endLaunchContext, setRole } = useDemo();

  function handleLaunch() {
    const context = launchDemoContext();
    setRole("teacher");
    navigate({ to: `/app/courses/${context.courseSlug}/overview` });
  }

  const fields = launchContext
    ? ([
        ["Issuer", launchContext.issuer],
        ["Client ID", launchContext.clientId],
        ["Deployment ID", launchContext.deploymentId],
        ["Platform", launchContext.platformLabel],
        ["Context", `${launchContext.contextTitle} · ${launchContext.sectionLabel}`],
        ["Resource link", launchContext.resourceLinkTitle],
        ["User", `${launchContext.userName} (${launchContext.ltiRole})`],
        ["Created", formatDemoTimestamp(launchContext.launchedAt)],
      ] as const)
    : null;

  return (
    <div className="site-frame">
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Simulated launch" }]}
          title="Simulated pilot launch"
          subtitle={PILOT_CONTENT.pilotPositioning}
          actions={<Badge tone="amber" dot>{PILOT_CONTENT.simulatedBadge}</Badge>}
        />

        <Alert tone="warning" title="Nothing here touches a real LMS" className="mt-6">
          This launch context is generated locally for demonstration. No credentials are exchanged, no
          platform authenticates the request, and no data is returned to any system.
        </Alert>

        <div className="housing" style={{ marginTop: "var(--s-24)", maxWidth: "820px" }}>
          <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
            <Eyebrow>Launch preview</Eyebrow>
            {fields ? (
              <>
                <dl className="grid-auto">
                  {fields.map(([label, value]) => (
                    <div key={label} className="inset-plane" style={{ padding: "var(--s-12)" }}>
                      <dt className="micro-label">{label}</dt>
                      <dd style={{ margin: "var(--s-4) 0 0", fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)" }}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="hrow-16">
                  <Link
                    to="/app/courses/$courseSlug/overview"
                    params={{ courseSlug: launchContext!.courseSlug }}
                    className="holo-btn holo-btn--accent"
                  >
                    Continue to Math 6 — Period 3
                  </Link>
                  <Button variant="ghost" onClick={endLaunchContext}>
                    Clear launch context
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="prose-measure" style={{ color: "var(--fg-muted)", margin: 0 }}>
                  No launch context is active. Create a simulated one to enter the teacher workspace the
                  way a pilot teacher would arrive from their existing LMS.
                </p>
                <div>
                  <Button variant="accent" icon={<Rocket size={16} />} onClick={handleLaunch}>
                    Create simulated launch
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
