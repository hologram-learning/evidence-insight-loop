import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  MasteryPill,
  PageHeader,
  Table,
  TBody,
  Tabs,
  Td,
  Th,
  THead,
  Tr,
} from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { COURSES, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { MASTERY_LABEL, masteryLevel } from "@/lib/mastery";
import { isReadOnly } from "@/lib/permissions";
import type { MasteryState } from "@/types/domain";

export const Route = createFileRoute("/app/courses/$courseSlug/gradebook")({
  component: GradebookPage,
});

const CONVENTIONAL: Record<MasteryState, string> = {
  beginning: "D",
  developing: "C",
  approaching: "B−",
  secure: "A−",
};

function GradebookPage() {
  const { courseSlug } = Route.useParams();
  const { role } = useDemo();
  const course = COURSES.find((c) => c.slug === courseSlug);
  const [view, setView] = useState("standards");

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Gradebook" },
        ]}
        title="Standards gradebook"
        subtitle="Ordinal mastery with the evidence count behind every cell."
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      <div style={{ marginTop: "var(--s-16)" }}>
        <Tabs
          value={view}
          onChange={setView}
          items={[
            { id: "standards", label: "Standards view" },
            { id: "conventional", label: "Conventional comparison" },
          ]}
        />
      </div>

      <div className="housing" style={{ marginTop: "var(--s-16)" }}>
        <div className="housing-inner" style={{ padding: "var(--s-12)" }}>
          <Table>
            <THead>
              <Tr>
                <Th>Student</Th>
                <Th>6.EE.A.3</Th>
                {view === "standards" ? (
                  <>
                    <Th numeric>Evidence</Th>
                    <Th numeric>Confidence</Th>
                  </>
                ) : (
                  <>
                    <Th>Conventional equivalent</Th>
                    <Th>What it hides</Th>
                  </>
                )}
              </Tr>
            </THead>
            <TBody>
              {STUDENTS.map((student) => (
                <Tr key={student.id}>
                  <Td>{student.name}</Td>
                  <Td>
                    <MasteryPill level={masteryLevel(student.mastery)} label={MASTERY_LABEL[student.mastery]} />
                  </Td>
                  {view === "standards" ? (
                    <>
                      <Td numeric>{student.evidenceCount}</Td>
                      <Td numeric>{student.confidence.toFixed(2)}</Td>
                    </>
                  ) : (
                    <>
                      <Td>{CONVENTIONAL[student.mastery]}</Td>
                      <Td style={{ color: "var(--fg-muted)" }}>
                        {student.mastery === "secure"
                          ? "Nothing pending on this standard."
                          : "The specific step the student misses."}
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </div>
      <p className="micro-label" style={{ marginTop: "var(--s-8)" }}>
        Conventional equivalents are illustrative only and are not returned to any system.
      </p>
    </RoleGate>
  );
}
