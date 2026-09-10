import { createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  MasteryPill,
  PageHeader,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import { STANDARDS } from "@/data/standards";
import { STUDENTS } from "@/data/seed";
import { MASTERY_LABEL, masteryLevel } from "@/lib/mastery";
import type { MasteryState } from "@/types/domain";

export const Route = createFileRoute("/app/leader/standards")({
  component: LeaderStandards,
});

function LeaderStandards() {
  const counts = STUDENTS.reduce<Record<MasteryState, number>>(
    (acc, student) => ({ ...acc, [student.mastery]: acc[student.mastery] + 1 }),
    { beginning: 0, developing: 0, approaching: 0, secure: 0 },
  );

  return (
    <RoleGate allow={["leader", "district"]}>
      <PageHeader
        crumbs={[{ label: "Workspace", href: "/app" }, { label: "Standards" }]}
        title="Standards coverage"
        subtitle="Ordinal distribution across the demo cohort, with prerequisite context."
        actions={<Badge tone="amber">Read-only demo</Badge>}
      />
      <ReadOnlyNotice />

      <div className="row-16" style={{ marginTop: "var(--s-24)", flexWrap: "wrap" }}>
        {(Object.keys(counts) as MasteryState[]).map((stateKey) => (
          <div key={stateKey} className="inset-plane row-8" style={{ padding: "var(--s-12) var(--s-16)" }}>
            <MasteryPill level={masteryLevel(stateKey)} label={MASTERY_LABEL[stateKey]} />
            <strong>{counts[stateKey]}</strong>
          </div>
        ))}
      </div>

      <div className="housing" style={{ marginTop: "var(--s-24)" }}>
        <div className="housing-inner" style={{ padding: "var(--s-12)" }}>
          <Table>
            <THead>
              <Tr>
                <Th>Standard</Th>
                <Th>Description</Th>
                <Th>Cluster</Th>
              </Tr>
            </THead>
            <TBody>
              {STANDARDS.map((standard) => (
                <Tr key={standard.code}>
                  <Td>{standard.code}</Td>
                  <Td style={{ color: "var(--fg-muted)" }}>{standard.label}</Td>
                  <Td>{standard.cluster}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </div>
    </RoleGate>
  );
}
