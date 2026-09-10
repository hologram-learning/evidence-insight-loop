import type { LtiLaunchContext } from "@/types/lti";

/**
 * Simulated pilot launch context.
 * Nothing here contacts, authenticates against, or receives data from a real LMS.
 * The context is generated in the browser and stored locally for the demo only.
 */
export const LTI_CONTEXT_KEY = "hologram_demo_lti_launch_context";

export function createDemoLaunchContext(): LtiLaunchContext {
  return {
    isDemo: true,
    issuer: "https://lms.demo.invalid",
    clientId: "demo-client-0001",
    deploymentId: "demo-deployment-01",
    platformLabel: "Existing LMS — demo context",
    contextTitle: "Math 6",
    sectionLabel: "Period 3",
    resourceLinkTitle: "Standards Evidence Workspace",
    userName: "Ms. Chen",
    ltiRole: "Instructor",
    courseSlug: "math-6-period-3",
    launchedAt: new Date().toISOString(),
  };
}

export function readLaunchContext(): LtiLaunchContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LTI_CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LtiLaunchContext;
    return parsed?.isDemo ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLaunchContext(context: LtiLaunchContext): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LTI_CONTEXT_KEY, JSON.stringify(context));
}

export function clearLaunchContext(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LTI_CONTEXT_KEY);
}
