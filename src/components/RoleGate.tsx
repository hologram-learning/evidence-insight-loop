import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/design-system/code-companions-0f8a99";
import { useDemo } from "@/lib/demo-state";
import { ROLE_HOME, ROLE_SHORT } from "@/lib/permissions";
import type { DemoRole } from "@/types/domain";

/**
 * Renders children only for the allowed demo roles. Other roles see a polite
 * explanation and a link back to a view they may use — never a blank page.
 */
export function RoleGate({
  allow,
  children,
}: {
  allow: DemoRole[];
  children: ReactNode;
}) {
  const { role } = useDemo();
  if (allow.includes(role)) return <>{children}</>;

  return (
    <EmptyState
      icon={<Lock size={18} />}
      title="This view is not available for the selected demo role"
      description={`You are viewing Hologram as ${ROLE_SHORT[role]}. This screen belongs to ${allow
        .map((r) => ROLE_SHORT[r])
        .join(" or ")}.`}
      action={
        <Link to={ROLE_HOME[role]} className="holo-btn holo-btn--primary holo-btn--sm">
          Go to your workspace
        </Link>
      }
    />
  );
}

/** Read-only banner for leader and district roles. */
export function ReadOnlyNotice() {
  return (
    <p className="micro-label" style={{ marginTop: "var(--s-8)" }}>
      Read-only view · decisions stay with the teacher
    </p>
  );
}
