import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, EmptyState, Input, PageHeader, Select } from "@/design-system/code-companions-0f8a99";
import { RoleGate } from "@/components/RoleGate";
import { Housing, MasteryCellButton, MasteryLegend } from "@/components/workspace";
import { COURSES, GROUP_STUDENT_IDS, STANDARD_COLUMNS, STUDENTS } from "@/data/seed";
import { atRiskFirst, masteryFor } from "@/lib/records";
import { MASTERY_LABEL } from "@/lib/mastery";

export const Route = createFileRoute("/app/courses/$courseSlug/students/")({
  component: StudentsPage,
});

function StudentsPage() {
  const { courseSlug } = Route.useParams();
  const course = COURSES.find((item) => item.slug === courseSlug);
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("all");

  const rows = atRiskFirst(STUDENTS, GROUP_STUDENT_IDS).filter((student) => {
    const matchesQuery = student.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesRisk = risk === "all" ? true : student.risk === risk;
    return matchesQuery && matchesRisk;
  });

  return (
    <RoleGate allow={["teacher"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Students" },
        ]}
        title="Students"
        subtitle="Learners ordered by who needs a decision first."
        actions={<Badge tone="amber">Demo data</Badge>}
      />

      <div className="row-16" style={{ marginTop: "var(--s-16)" }}>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search learners"
          aria-label="Search learners by name"
        />
        <Select value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Filter by prerequisite risk">
          <option value="all">All risk levels</option>
          <option value="high">High risk</option>
          <option value="moderate">Moderate risk</option>
          <option value="low">Low risk</option>
        </Select>
      </div>

      <div style={{ marginTop: "var(--s-16)" }}>
        <MasteryLegend />
      </div>

      {rows.length === 0 ? (
        <div style={{ marginTop: "var(--s-24)" }}>
          <EmptyState
            title="No learners match this search"
            description="Clear the search box or choose a different risk level."
          />
        </div>
      ) : (
        <Housing className="stack-16">
          <table className="grid-plane">
            <thead>
              <tr>
                <th scope="col">Learner</th>
                {STANDARD_COLUMNS.map((code) => (
                  <th key={code} scope="col">
                    {code}
                  </th>
                ))}
                <th scope="col">Risk</th>
                <th scope="col">Most recent evidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student) => (
                <tr key={student.id} data-group={GROUP_STUDENT_IDS.includes(student.id) ? "true" : "false"}>
                  <th scope="row">
                    <Link
                      to="/app/courses/$courseSlug/students/$studentSlug"
                      params={{ courseSlug, studentSlug: student.slug }}
                    >
                      {student.name}
                    </Link>
                  </th>
                  {STANDARD_COLUMNS.map((code) => (
                    <td key={code}>
                      <MasteryCellButton
                        compact
                        state={masteryFor(student, code)}
                        studentName={student.name}
                        standardCode={code}
                      />
                    </td>
                  ))}
                  <td style={{ textTransform: "capitalize" }}>{student.risk}</td>
                  <td style={{ color: "var(--fg-muted)" }}>{student.recentEvidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Housing>
      )}

      <p className="micro-label" style={{ marginTop: "var(--s-16)" }}>
        Mastery states: {Object.values(MASTERY_LABEL).join(" · ")}
      </p>
    </RoleGate>
  );
}
