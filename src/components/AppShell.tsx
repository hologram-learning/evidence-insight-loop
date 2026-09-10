import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  History,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Share2,

  Table2,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Badge,
  Button,
  Modal,
  PersonaSidebar,
  Select,
} from "@/design-system/code-companions-0f8a99";
import { PILOT_CONTENT } from "@/data/pilotContent";
import { useDemo } from "@/lib/demo-state";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/permissions";
import type { DemoRole } from "@/types/domain";

const TEACHER_NAV = [
  { label: "Course overview", href: "/app/courses/math-6-period-3/overview", icon: <LayoutDashboard size={16} /> },
  { label: "Students", href: "/app/courses/math-6-period-3/students", icon: <Users size={16} /> },
  { label: "Class patterns", href: "/app/courses/math-6-period-3/insights", icon: <ListChecks size={16} /> },
  { label: "Decisions", href: "/app/courses/math-6-period-3/interventions", icon: <BookOpen size={16} /> },
  { label: "Gradebook", href: "/app/courses/math-6-period-3/gradebook", icon: <Table2 size={16} /> },
  { label: "Records · assignments", href: "/app/courses/math-6-period-3/assignments", icon: <ClipboardList size={16} /> },
  { label: "Records · simulated passback", href: "/app/courses/math-6-period-3/passback", icon: <Share2 size={16} /> },
  { label: "Records · activity history", href: "/app/activity", icon: <History size={16} /> },
];


const STUDENT_NAV = [
  { label: "Home", href: "/app/student/home", icon: <LayoutDashboard size={16} /> },
  { label: "Assignments", href: "/app/student/assignments", icon: <ClipboardList size={16} /> },
  { label: "My progress", href: "/app/student/progress", icon: <GraduationCap size={16} /> },
  { label: "Feedback", href: "/app/student/feedback", icon: <MessageSquare size={16} /> },
];

const LEADER_NAV = [
  { label: "School overview", href: "/app/leader/overview", icon: <LayoutDashboard size={16} /> },
  { label: "Standards", href: "/app/leader/standards", icon: <ListChecks size={16} /> },
  { label: "Interventions", href: "/app/leader/interventions", icon: <BookOpen size={16} /> },
  { label: "Activity history", href: "/app/activity", icon: <History size={16} /> },
];

const DISTRICT_NAV = [
  { label: "District overview", href: "/app/district/overview", icon: <LayoutDashboard size={16} /> },
  { label: "Implementation", href: "/app/district/implementation", icon: <ListChecks size={16} /> },
  { label: "Activity history", href: "/app/activity", icon: <History size={16} /> },
];

const NAV_BY_ROLE: Record<DemoRole, typeof TEACHER_NAV> = {
  teacher: TEACHER_NAV,
  student: STUDENT_NAV,
  leader: LEADER_NAV,
  district: DISTRICT_NAV,
};

const PERSONA: Record<DemoRole, "student" | "teacher" | "admin"> = {
  teacher: "teacher",
  student: "student",
  leader: "admin",
  district: "admin",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, launchContext, endLaunchContext, resetDemo, theme, setTheme } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);

  const items = NAV_BY_ROLE[role].map((item) => ({
    ...item,
    active: location.pathname === item.href,
  }));

  function handleRoleChange(next: DemoRole) {
    setRole(next);
    navigate({ to: ROLE_HOME[next] });
  }

  return (
    <div className="app-frame">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>
      <div className="app-topbar">
        <Link to="/app" className="wordmark" aria-label="Hologram Learning — pilot workspace">
          <span className="wordmark__mark" aria-hidden="true" />
          <span>
            Hologram<span className="wordmark__thin"> Workspace</span>
          </span>
        </Link>
        <Badge tone="amber" dot>
          {PILOT_CONTENT.demoBadge}
        </Badge>
        <div className="app-topbar__spacer" />
        <label className="hrow-8" style={{ fontSize: "var(--fs-caption)", color: "var(--fg-muted)" }}>
          <span>Demo role</span>
          <Select
            value={role}
            onChange={(event) => handleRoleChange(event.target.value as DemoRole)}
            aria-label="Demo role"
          >
            {(Object.keys(ROLE_LABEL) as DemoRole[]).map((value) => (
              <option key={value} value={value}>
                {ROLE_LABEL[value]}
              </option>
            ))}
          </Select>
        </label>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light field" : "Dark field"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
          Reset demo
        </Button>
      </div>

      <div className="demo-strip">
        <strong style={{ color: "var(--fg)" }}>Simulated pilot environment.</strong>
        <span>
          {launchContext
            ? `Launched from ${launchContext.platformLabel} · ${launchContext.contextTitle} · ${launchContext.sectionLabel}. No LMS was contacted.`
            : "No launch context is active. Everything shown is seeded demo data stored in this browser."}
        </span>
        {launchContext ? (
          <Button variant="ghost" size="sm" onClick={endLaunchContext}>
            Clear launch context
          </Button>
          <Link to="/launch" className="holo-btn holo-btn--ghost holo-btn--sm">
            Open simulated launch
          </Link>
        )}
      </div>

      <div className="app-body">
        <PersonaSidebar
          persona={PERSONA[role]}
          zoneLabel={ROLE_LABEL[role]}
          items={items}
          footer={
            <Link
              to="/launch"
              className="holo-btn holo-btn--ghost holo-btn--sm"
              style={{ margin: "var(--s-12)" }}
            >
              Simulated launch
            </Link>
          }
        />
        <main id="workspace" className="app-main">
          <div className="app-main__inner">{children}</div>
        </main>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset the demo?"
        description="This restores the original seeded state: assignments, submissions, intervention decisions, simulated passbacks, and activity history."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
              }}
            >
              Reset demo state
            </Button>
          </>
        }
      >
        <p style={{ color: "var(--fg-muted)" }}>
          Nothing outside this browser is affected — the pilot demo keeps all state locally.
        </p>
      </Modal>
    </div>
  );
}
