import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, PageHeader } from "@/design-system/code-companions-0f8a99";
import { ReadOnlyNotice, RoleGate } from "@/components/RoleGate";
import {
  DemoDisclosure,
  Housing,
  MasteryCellButton,
  MasteryLegend,
  PrerequisiteChain,
  WhyThisIsHere,
} from "@/components/workspace";
import { COURSES, GROUP_STUDENT_IDS, STANDARD_COLUMNS, STUDENTS } from "@/data/seed";
import { useDemo } from "@/lib/demo-state";
import { MASTERY_LABEL } from "@/lib/mastery";
import { isReadOnly } from "@/lib/permissions";
import { atRiskFirst, masteryFor } from "@/lib/records";

export const Route = createFileRoute("/app/courses/$courseSlug/insights")({
  component: PatternConsole,
});

function PatternConsole() {
  const { courseSlug } = Route.useParams();
  const { state, role } = useDemo();
  const course = COURSES.find((item) => item.slug === courseSlug);
  const draft = state.interventions.find((item) => item.courseId === course?.id);
  const rows = atRiskFirst(STUDENTS, GROUP_STUDENT_IDS);
  const [selected, setSelected] = useState<{ student: string; code: string } | null>(null);

  return (
    <RoleGate allow={["teacher", "leader"]}>
      <PageHeader
        crumbs={[
          { label: "Workspace", href: "/app" },
          { label: course?.name ?? "Course", href: `/app/courses/${courseSlug}/overview` },
          { label: "Class patterns" },
        ]}
        title="Class patterns"
        subtitle="Where the class sits on the Expressions and Equations cluster, and why."
        actions={<Badge tone="amber">Demo data</Badge>}
      />
      {isReadOnly(role) && <ReadOnlyNotice />}

      <div className="planes" style={{ marginTop: "var(--s-24)" }}>
        <Housing>
          <div className="stack-8">
            <div className="hrow-16">
              <span className="micro-label">Mastery by standard · {rows.length} learners</span>
              <MasteryLegend />
            </div>
            <div className="plane-scroll"><table className="grid-plane">
              <thead>
                <tr>
                  <th scope="col">Learner</th>
                  {STANDARD_COLUMNS.map((code) => (
                    <th key={code} scope="col">
                      {code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((student) => (
                  <tr key={student.id}>
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
                          selected={selected?.student === student.id && selected.code === code}
                          onSelect={() => setSelected({ student: student.id, code })}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        </Housing>

        <div className="stack-16">
          <Housing>
            <div className="stack-8">
              <span className="micro-label">Selected cell</span>
              {selected ? (
                <>
                  <p style={{ margin: 0 }}>
                    {STUDENTS.find((item) => item.id === selected.student)?.name} ·{" "}
                    {selected.code} ·{" "}
                    {(() => {
                      const student = STUDENTS.find((item) => item.id === selected.student);
                      const stateValue = student ? masteryFor(student, selected.code) : null;
                      return stateValue ? MASTERY_LABEL[stateValue] : "Not yet assessed";
                    })()}
                  </p>
                  <Link
                    to="/app/courses/$courseSlug/students/$studentSlug"
                    params={{
                      courseSlug,
                      studentSlug:
                        STUDENTS.find((item) => item.id === selected.student)?.slug ?? "sophia-martinez",
                    }}
                  >
                    Open the learner dossier
                  </Link>
                </>
              ) : (
                <p style={{ margin: 0, color: "var(--fg-muted)" }}>
                  Choose a cell in the grid to read the state behind it.
                </p>
              )}
            </div>
          </Housing>

          <Housing>
            <div className="stack-8">
              <span className="micro-label">Dominant error</span>
              <p className="prose-measure" style={{ margin: 0 }}>
                Partial distribution — the factor is applied to the first term only. Equality is
                preserved elsewhere, so the gap is specific and teachable in a short block.
              </p>
              <PrerequisiteChain
                codes={["4.NBT.B.5", "5.OA.A.1", "6.EE.A.3", "6.EE.B.7"]}
                focusCode="6.EE.A.3"
              />
              <WhyThisIsHere>
                6.EE.A.3 is surfaced first because it has the most recent evidence and the widest
                spread of Developing or below.
              </WhyThisIsHere>
              {draft && (
                <Link
                  to="/app/courses/$courseSlug/interventions/$draftSlug"
                  params={{ courseSlug, draftSlug: draft.slug }}
                  className="holo-btn holo-btn--accent holo-btn--sm"
                >
                  Review the drafted next step
                </Link>
              )}
              <DemoDisclosure />
            </div>
          </Housing>
        </div>
      </div>
    </RoleGate>
  );
}
