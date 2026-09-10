import { EVIDENCE, MASTERY_RECORDS, STANDARD_COLUMNS, STUDENTS } from "@/data/seed";
import type { MasteryState, PrerequisiteRisk, Student } from "@/types/domain";

/**
 * Seeded per-standard mastery for the named learners. Demo data — these are the
 * values the workspace reports everywhere, so the grid, the roster, the dossier
 * and the gradebook can never disagree with each other.
 */
const NAMED_MATRIX: Record<string, Partial<Record<string, MasteryState>>> = {
  "stu-sophia": {
    "5.OA.A.1": "approaching",
    "6.EE.A.2": "secure",
    "6.EE.A.3": "developing",
    "6.EE.B.7": "beginning",
  },
  "stu-marcus": {
    "5.OA.A.1": "approaching",
    "6.EE.A.2": "approaching",
    "6.EE.A.3": "developing",
    "6.EE.B.7": "beginning",
  },
  "stu-olivia": {
    "5.OA.A.1": "developing",
    "6.EE.A.2": "developing",
    "6.EE.A.3": "beginning",
    "6.EE.B.7": "beginning",
  },
  "stu-daniel": {
    "5.OA.A.1": "secure",
    "6.EE.A.2": "approaching",
    "6.EE.A.3": "developing",
    "6.EE.B.7": "beginning",
  },
  "stu-maya": {
    "5.OA.A.1": "secure",
    "6.EE.A.2": "secure",
    "6.EE.A.3": "secure",
    "6.EE.B.7": "approaching",
  },
  "stu-noah": {
    "5.OA.A.1": "secure",
    "6.EE.A.2": "secure",
    "6.EE.A.3": "secure",
    "6.EE.B.7": "approaching",
  },
};

const ORDER: MasteryState[] = ["beginning", "developing", "approaching", "secure"];

/** Deterministic: the same student and standard always return the same state. */
export function masteryFor(student: Student, standardCode: string): MasteryState | null {
  const named = NAMED_MATRIX[student.id]?.[standardCode];
  if (named) return named;
  if (!student.named) {
    const column = STANDARD_COLUMNS.indexOf(standardCode);
    if (column === -1) return null;
    // The last column is a downstream standard: not yet assessed for filler rows.
    if (column === STANDARD_COLUMNS.length - 1) return null;
    const base = ORDER.indexOf(student.mastery);
    const shift = column === 0 ? 1 : column === 1 ? 0 : -0;
    const index = Math.max(0, Math.min(ORDER.length - 1, base + shift));
    return ORDER[index] ?? null;
  }
  return null;
}

export function focusMastery(student: Student, focusCode = "6.EE.A.3"): MasteryState | null {
  return masteryFor(student, focusCode);
}

export function riskFor(student: Student): PrerequisiteRisk {
  return student.risk;
}

export function evidenceFor(studentId: string, standardCode?: string) {
  return EVIDENCE.filter(
    (item) => item.studentId === studentId && (!standardCode || item.standardCode === standardCode),
  );
}

export function masteryRecordFor(studentId: string, standardCode: string) {
  return MASTERY_RECORDS.find(
    (record) => record.studentId === studentId && record.standardCode === standardCode,
  );
}

export function studentsById(ids: string[]): Student[] {
  return ids
    .map((id) => STUDENTS.find((student) => student.id === id))
    .filter((student): student is Student => Boolean(student));
}

/** At-risk rows first, then the rest of the roster in seeded order. */
export function atRiskFirst(students: Student[], groupIds: string[]): Student[] {
  const weight = (student: Student) => {
    if (groupIds.includes(student.id)) return 0;
    if (student.risk === "high") return 1;
    if (student.risk === "moderate") return 2;
    return 3;
  };
  return [...students].sort((a, b) => weight(a) - weight(b));
}
