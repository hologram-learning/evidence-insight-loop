/** Simulated launch context. Nothing here touches a real LMS or a real LTI service. */
export interface LtiLaunchContext {
  /** Always true. This context is generated locally for pilot demonstration. */
  isDemo: true;
  issuer: string;
  clientId: string;
  deploymentId: string;
  platformLabel: string;
  contextTitle: string;
  sectionLabel: string;
  resourceLinkTitle: string;
  userName: string;
  ltiRole: string;
  courseSlug: string;
  launchedAt: string;
}
