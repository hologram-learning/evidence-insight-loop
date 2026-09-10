/** Hologram pilot domain model. Demo-only: no production identity or student data. */

export type DemoRole = "teacher" | "student" | "leader" | "district";

export type MasteryState = "beginning" | "developing" | "approaching" | "secure";

export type PrerequisiteRisk = "low" | "moderate" | "high";

export type DecisionStatus = "draft" | "approved" | "declined";

export type AssignmentStatus = "draft" | "published" | "collecting" | "reviewed";

export interface Organization {
  id: string;
  name: string;
  schools: School[];
}

export interface School {
  id: string;
  name: string;
}

export interface AcademicTerm {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  subject: string;
  gradeLevel: string;
  teacherId: string;
  schoolId: string;
  termId: string;
  studentCount: number;
  needSupportCount: number;
  prioritySkillsRange: string;
  classSignal: string;
  isPrimary: boolean;
}

export interface Section {
  id: string;
  courseId: string;
  name: string;
}

export interface AppUser {
  id: string;
  name: string;
  role: DemoRole;
  title: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
}

export interface Student {
  id: string;
  slug: string;
  name: string;
  gradeLevel: string;
  mastery: MasteryState;
  confidence: number;
  risk: PrerequisiteRisk;
  evidenceCount: number;
  recentEvidence: string;
  group?: string;
  named: boolean;
}

export interface Standard {
  id: string;
  code: string;
  label: string;
  cluster: string;
}

export interface PrerequisiteRelation {
  fromCode: string;
  toCode: string;
  description: string;
}

export interface RubricCriterion {
  id: string;
  label: string;
  note: string;
  met: boolean;
}

export interface Assignment {
  id: string;
  slug: string;
  courseId: string;
  title: string;
  instructions: string;
  dueDate: string;
  standardCodes: string[];
  status: AssignmentStatus;
  visibleToStudents: boolean;
  rubric: RubricCriterion[];
  submissionCount: number;
  createdInDemo?: boolean;
}

export interface EvidenceArtifact {
  id: string;
  studentId: string;
  assignmentId: string;
  standardCode: string;
  capturedOn: string;
  summary: string;
  reviewed: boolean;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedOn: string;
  lines: string[];
  identifiedIssue: string;
  errorLineIndex: number;
  teacherFeedback: string;
  reviewed: boolean;
}

export interface MasteryRecord {
  id: string;
  studentId: string;
  standardCode: string;
  state: MasteryState;
  confidence: number;
  risk: PrerequisiteRisk;
  evidenceCount: number;
  updatedOn: string;
  rationale: string;
}

export interface InterventionDraft {
  id: string;
  slug: string;
  courseId: string;
  title: string;
  standardCode: string;
  durationMinutes: number;
  objective: string;
  evidenceSignal: string;
  moves: string[];
  exitCheck: string;
  studentIds: string[];
  status: DecisionStatus;
  declineReason?: string;
  decidedOn?: string;
  decidedBy?: string;
}

export interface PassbackRecord {
  id: string;
  interventionId: string;
  studentId: string;
  assignmentId: string;
  standardCode: string;
  masteryState: MasteryState;
  teacherStatus: string;
  destinationLabel: string;
  confirmed: boolean;
  preparedOn: string;
  confirmedOn?: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  role: DemoRole;
  timestamp: string;
  action: string;
  target: string;
  description: string;
}

export interface PilotRequest {
  fullName: string;
  workEmail: string;
  organization: string;
  role: string;
  region: string;
  scale: string;
  goals: string;
  currentLms?: string;
  workflow?: string;
  timeline?: string;
  additional?: string;
  submittedOn: string;
}
