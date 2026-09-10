import type {
  AcademicTerm,
  AppUser,
  Assignment,
  AuditEvent,
  Course,
  EvidenceArtifact,
  InterventionDraft,
  MasteryRecord,
  Organization,
  Section,
  Student,
  Submission,
} from "@/types/domain";

export const ORGANIZATION: Organization = {
  id: "org-hologram-pilot",
  name: "Hologram Pilot District — Demo",
  schools: [{ id: "school-north-valley", name: "North Valley Middle School — Demo" }],
};

export const TERM: AcademicTerm = { id: "term-fall-2026", name: "Fall 2026 — Demo" };

export const USERS: AppUser[] = [
  { id: "user-chen", name: "Ms. Chen", role: "teacher", title: "Mathematics teacher" },
  { id: "user-sophia", name: "Sophia Martinez", role: "student", title: "Grade 6 student" },
  { id: "user-rivera", name: "Dr. Rivera", role: "leader", title: "Instructional leader" },
  { id: "user-taylor", name: "Jordan Taylor", role: "district", title: "District administrator" },
];

export const COURSES: Course[] = [
  {
    id: "course-math6-p3",
    slug: "math-6-period-3",
    name: "Math 6 — Period 3",
    subject: "Mathematics",
    gradeLevel: "Grade 6",
    teacherId: "user-chen",
    schoolId: "school-north-valley",
    termId: "term-fall-2026",
    studentCount: 27,
    needSupportCount: 14,
    prioritySkillsRange: "3–7 priority skills",
    classSignal: "2 sigma below recent class median",
    isPrimary: true,
  },
  {
    id: "course-math6-p5",
    slug: "math-6-period-5",
    name: "Math 6 — Period 5",
    subject: "Mathematics",
    gradeLevel: "Grade 6",
    teacherId: "user-chen",
    schoolId: "school-north-valley",
    termId: "term-fall-2026",
    studentCount: 25,
    needSupportCount: 9,
    prioritySkillsRange: "2–4 priority skills",
    classSignal: "Near recent class median",
    isPrimary: false,
  },
];

export const SECTIONS: Section[] = [
  { id: "section-p3", courseId: "course-math6-p3", name: "Period 3" },
  { id: "section-p5", courseId: "course-math6-p5", name: "Period 5" },
];

const NAMED_STUDENTS: Student[] = [
  {
    id: "stu-sophia",
    slug: "sophia-martinez",
    name: "Sophia Martinez",
    gradeLevel: "Grade 6",
    mastery: "developing",
    confidence: 0.62,
    risk: "moderate",
    evidenceCount: 4,
    recentEvidence: "Expressions and Equations Checkpoint",
    group: "Distributive-property group",
    named: true,
  },
  {
    id: "stu-marcus",
    slug: "marcus-lee",
    name: "Marcus Lee",
    gradeLevel: "Grade 6",
    mastery: "developing",
    confidence: 0.58,
    risk: "moderate",
    evidenceCount: 4,
    recentEvidence: "Expressions and Equations Checkpoint",
    group: "Distributive-property group",
    named: true,
  },
  {
    id: "stu-olivia",
    slug: "olivia-carter",
    name: "Olivia Carter",
    gradeLevel: "Grade 6",
    mastery: "beginning",
    confidence: 0.41,
    risk: "high",
    evidenceCount: 3,
    recentEvidence: "Expressions and Equations Checkpoint",
    group: "Distributive-property group",
    named: true,
  },
  {
    id: "stu-daniel",
    slug: "daniel-kim",
    name: "Daniel Kim",
    gradeLevel: "Grade 6",
    mastery: "developing",
    confidence: 0.6,
    risk: "moderate",
    evidenceCount: 4,
    recentEvidence: "Expressions and Equations Checkpoint",
    group: "Distributive-property group",
    named: true,
  },
  {
    id: "stu-maya",
    slug: "maya-patel",
    name: "Maya Patel",
    gradeLevel: "Grade 6",
    mastery: "secure",
    confidence: 0.88,
    risk: "low",
    evidenceCount: 4,
    recentEvidence: "Expressions and Equations Checkpoint",
    named: true,
  },
  {
    id: "stu-noah",
    slug: "noah-williams",
    name: "Noah Williams",
    gradeLevel: "Grade 6",
    mastery: "secure",
    confidence: 0.85,
    risk: "low",
    evidenceCount: 4,
    recentEvidence: "Expressions and Equations Checkpoint",
    named: true,
  },
];

/** Anonymous filler records so the roster reaches the seeded class size of 27. */
const ANONYMOUS_STUDENTS: Student[] = Array.from({ length: 21 }, (_, index) => {
  const n = index + 7;
  const pattern = index % 3;
  const mastery = pattern === 0 ? "developing" : pattern === 1 ? "secure" : "approaching";
  const risk = pattern === 0 ? "moderate" : pattern === 1 ? "low" : "moderate";
  return {
    id: `stu-demo-${n}`,
    slug: `demo-student-${n}`,
    name: `Demo Student ${n}`,
    gradeLevel: "Grade 6",
    mastery,
    confidence: pattern === 1 ? 0.83 : pattern === 0 ? 0.6 : 0.71,
    risk,
    evidenceCount: 4,
    recentEvidence: "Expressions and Equations Checkpoint",
    named: false,
  } as Student;
});

export const STUDENTS: Student[] = [...NAMED_STUDENTS, ...ANONYMOUS_STUDENTS];

export const GROUP_STUDENT_IDS = ["stu-sophia", "stu-marcus", "stu-olivia", "stu-daniel"];

export const ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-expressions-checkpoint",
    slug: "expressions-checkpoint",
    courseId: "course-math6-p3",
    title: "Expressions and Equations Checkpoint",
    instructions:
      "Rewrite each expression using the properties of operations, then solve. Show every step so your reasoning can be reviewed.",
    dueDate: "2026-09-08",
    standardCodes: ["6.EE.A.3"],
    status: "reviewed",
    visibleToStudents: true,
    rubric: [
      {
        id: "rc-1",
        label: "Applies the distributive property correctly",
        note: "Both terms inside the parentheses must be multiplied by the factor.",
        met: false,
      },
      {
        id: "rc-2",
        label: "Maintains equality across steps",
        note: "Each rewritten line preserves the value of the original equation.",
        met: true,
      },
      {
        id: "rc-3",
        label: "Shows reasoning in sequence",
        note: "Steps are legible and ordered.",
        met: true,
      },
    ],
    submissionCount: 27,
  },
];

export const SUBMISSIONS: Submission[] = [
  {
    id: "sub-sophia-checkpoint",
    assignmentId: "asg-expressions-checkpoint",
    studentId: "stu-sophia",
    submittedOn: "2026-09-08",
    lines: ["3(x + 4) = 21", "3x + 4 = 21"],
    identifiedIssue: "Distributive property error",
    errorLineIndex: 1,
    teacherFeedback: "",
    reviewed: true,
  },
];

export const EVIDENCE: EvidenceArtifact[] = [
  {
    id: "ev-1",
    studentId: "stu-sophia",
    assignmentId: "asg-expressions-checkpoint",
    standardCode: "6.EE.A.3",
    capturedOn: "2026-09-08",
    summary: "Checkpoint response: 3(x + 4) rewritten as 3x + 4.",
    reviewed: true,
  },
  {
    id: "ev-2",
    studentId: "stu-sophia",
    assignmentId: "asg-expressions-checkpoint",
    standardCode: "6.EE.A.3",
    capturedOn: "2026-09-04",
    summary: "Exit ticket: distributed the factor over the first term only.",
    reviewed: true,
  },
  {
    id: "ev-3",
    studentId: "stu-sophia",
    assignmentId: "asg-expressions-checkpoint",
    standardCode: "6.EE.A.2",
    capturedOn: "2026-09-02",
    summary: "Warm-up: read and evaluated a variable expression correctly.",
    reviewed: true,
  },
  {
    id: "ev-4",
    studentId: "stu-sophia",
    assignmentId: "asg-expressions-checkpoint",
    standardCode: "5.OA.A.1",
    capturedOn: "2026-08-28",
    summary: "Diagnostic: grouped-expression item answered with partial reasoning.",
    reviewed: true,
  },
];

export const MASTERY_RECORDS: MasteryRecord[] = [
  {
    id: "mr-sophia-6eea3",
    studentId: "stu-sophia",
    standardCode: "6.EE.A.3",
    state: "developing",
    confidence: 0.62,
    risk: "moderate",
    evidenceCount: 4,
    updatedOn: "2026-09-08",
    rationale:
      "Four reviewed artifacts show the factor applied to the first term only. Equality is preserved elsewhere, so the gap is specific to distribution.",
  },
];

export const INTERVENTION_DRAFTS: InterventionDraft[] = [
  {
    id: "int-draft-warm-up",
    slug: "draft-warm-up",
    courseId: "course-math6-p3",
    title: "Distributive-property error analysis",
    standardCode: "6.EE.A.3",
    durationMinutes: 12,
    objective:
      "Students distribute a factor across both terms, then explain where a partial distribution changes the value of an expression.",
    evidenceSignal:
      "2 sigma below recent class median on the Expressions and Equations cluster; 14 of 27 students need targeted support.",
    moves: [
      "Model 3(x + 4) with an area diagram and name each product aloud.",
      "Students distribute two paired expressions and compare results with a partner.",
      "Error analysis: given 3x + 4 = 21, students explain the missing product and correct it.",
    ],
    exitCheck: "Each student rewrites 5(y + 2) and states what the second product represents.",
    studentIds: GROUP_STUDENT_IDS,
    status: "draft",
  },
];

export const AUDIT_SEED: AuditEvent[] = [
  {
    id: "aud-seed-1",
    actor: "Hologram",
    role: "teacher",
    timestamp: "2026-09-08T14:02:00.000Z",
    action: "Evidence reviewed",
    target: "Sophia Martinez · 6.EE.A.3",
    description: "Four artifacts were organized against 6.EE.A.3 for teacher review.",
  },
  {
    id: "aud-seed-2",
    actor: "Hologram",
    role: "teacher",
    timestamp: "2026-09-08T14:03:00.000Z",
    action: "Mastery updated",
    target: "Sophia Martinez · 6.EE.A.3",
    description: "Mastery estimated as Developing with confidence 0.62 and moderate prerequisite risk.",
  },
  {
    id: "aud-seed-3",
    actor: "Hologram",
    role: "teacher",
    timestamp: "2026-09-08T14:05:00.000Z",
    action: "Draft generated",
    target: "Distributive-property error analysis",
    description: "A 12-minute warm-up was drafted for Ms. Chen to review, edit, approve, or decline.",
  },
];
