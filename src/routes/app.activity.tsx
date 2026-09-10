import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  EmptyState,
  Eyebrow,
  PageHeader,
  Select,
} from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { useDemo } from "@/lib/demo-state";
import { formatDemoTimestamp } from "@/lib/mastery";
import { ROLE_LABEL } from "@/lib/permissions";

export const Route = createFileRoute("/app/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const { state } = useDemo();
  const [filter, setFilter] = useState("all");

  const events = [...state.audit]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .filter((event) => filter === "all" || event.role === filter);

  return (
    <RoleGate allow={["teacher", "leader", "district"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Activity history" }]}
        title="Activity history"
        subtitle="Every state change in this demo, with actor, role, and target."
        actions={<Badge tone="amber">Local only</Badge>}
      />

      <div className="stack-8" style={{ marginTop: "var(--s-16)", maxWidth: 280 }}>
        <label className="micro-label" htmlFor="activity-role-filter">Filter by role</label>
        <Select
          id="activity-role-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All roles</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="leader">Instructional leader</option>
          <option value="district">District admin</option>
        </Select>
      </div>


      <div className="housing" style={{ marginTop: "var(--s-16)" }}>
        <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
          {events.length === 0 ? (
            <EmptyState
              title="No activity recorded"
              description="Reviewing evidence, editing a draft, or confirming a simulated passback writes an entry here."
            />
          ) : (
            <ol className="audit-list">
              {events.map((event) => (
                <li key={event.id} className="audit-item">
                  <div className="audit-item__meta">
                    <Eyebrow>{event.action}</Eyebrow>
                    <span className="micro-label">{formatDemoTimestamp(event.timestamp)}</span>
                  </div>
                  <p style={{ margin: "var(--s-4) 0" }}>{event.description}</p>
                  <div className="row-8">
                    <Badge tone="indigo">{event.actor}</Badge>
                    <Badge tone="neutral">{ROLE_LABEL[event.role]}</Badge>
                    <span className="micro-label">{event.target}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
