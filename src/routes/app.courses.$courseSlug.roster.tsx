import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Badge,
  EmptyState,
  Input,
  MasteryPill,
  PageHeader,
  Select,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { masteryLevel, MASTERY_LABEL, RISK_LABEL } from "@/lib/mastery";
import { isReadOnly } from "@/lib/permissions";
import type { MasteryState } from "@/types/domain";

export const Route = createFileRoute("/app/courses/$courseSlug/roster")({
  component: RosterPage,
});

function RosterPage() {
  const { courseSlug } = Route.useParams();
  const { role } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | MasteryState>("all");

  const rows = useMemo(
    () =>
      STUDENTS.filter((student) => {
        const matchesQuery = student.name.toLowerCase().includes(query.trim().toLowerCase());
        const matchesFilter = filter === "all" || student.mastery === filter;
        return matchesQuery && matchesFilter;
      }),
    [query, filter],
  );

  return (
    <RoleGate allow={["teacher"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Roster" },
        ]}
        title="Roster"
        subtitle={`${STUDENTS.length} students · ordinal mastery on 6.EE.A.3`}
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      <div className="row-16" style={{ marginTop: "var(--s-16)" }}>
        <label className="stack-8" style={{ minWidth: "260px" }}>
          <span className="micro-label">Search students</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name"
            aria-label="Search students"
          />
        </label>
        <label className="stack-8">
          <span className="micro-label">Mastery</span>
          <Select
            value={filter}
            onChange={(event) => setFilter(event.target.value as typeof filter)}
            aria-label="Filter by mastery"
          >
            <option value="all">All levels</option>
            <option value="beginning">Beginning</option>
            <option value="developing">Developing</option>
            <option value="approaching">Approaching</option>
            <option value="secure">Secure</option>
          </Select>
        </label>
      </div>

      <div className="housing" style={{ marginTop: "var(--s-16)" }}>
        <div className="housing-inner" style={{ padding: "var(--s-12)" }}>
          {rows.length === 0 ? (
            <EmptyState
              title="No students match this search"
              description="Clear the search box or choose a different mastery level."
            />
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th>Student</Th>
                  <Th>Mastery · 6.EE.A.3</Th>
                  <Th numeric>Confidence</Th>
                  <Th>Prerequisite risk</Th>
                  <Th numeric>Evidence</Th>
                  <Th>Profile</Th>
                </Tr>
              </THead>
              <TBody>
                {rows.map((student) => (
                  <Tr key={student.id}>
                    <Td>{student.name}</Td>
                    <Td>
                      <MasteryPill level={masteryLevel(student.mastery)} label={MASTERY_LABEL[student.mastery]} />
                    </Td>
                    <Td numeric>{student.confidence.toFixed(2)}</Td>
                    <Td>{RISK_LABEL[student.risk]}</Td>
                    <Td numeric>{student.evidenceCount}</Td>
                    <Td>
                      <Link
                        to="/app/courses/$courseSlug/students/$studentSlug"
                        params={{ courseSlug, studentSlug: student.slug }}
                      >
                        Open evidence
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
