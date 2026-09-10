import type { DemoRole } from "@/types/domain";

export const ROLE_LABEL: Record<DemoRole, string> = {
  teacher: "Teacher · Ms. Chen",
  student: "Student · Sophia Martinez",
  leader: "Instructional leader · Dr. Rivera",
  district: "District admin · Jordan Taylor",
};

export const ROLE_SHORT: Record<DemoRole, string> = {
  teacher: "Teacher",
  student: "Student",
  leader: "Instructional leader",
  district: "District admin",
};

export const ROLE_ACTOR: Record<DemoRole, string> = {
  teacher: "Ms. Chen",
  student: "Sophia Martinez",
  leader: "Dr. Rivera",
  district: "Jordan Taylor",
};

/** Where each demo role belongs when it lands on a view it may not use. */
export const ROLE_HOME: Record<DemoRole, string> = {
  teacher: "/app/courses/math-6-period-3/overview",
  student: "/app/student/home",
  leader: "/app/leader/overview",
  district: "/app/district/overview",
};

export type Capability =
  | "viewRoster"
  | "viewPeerMastery"
  | "viewInterventions"
  | "decideIntervention"
  | "createAssignment"
  | "viewGradebook"
  | "viewAudit"
  | "preparePassback"
  | "submitWork"
  | "viewAggregate";

const MATRIX: Record<DemoRole, Capability[]> = {
  teacher: [
    "viewRoster",
    "viewPeerMastery",
    "viewInterventions",
    "decideIntervention",
    "createAssignment",
    "viewGradebook",
    "viewAudit",
    "preparePassback",
    "viewAggregate",
  ],
  student: ["submitWork"],
  leader: ["viewInterventions", "viewAggregate", "viewAudit"],
  district: ["viewAggregate", "viewAudit"],
};

export function can(role: DemoRole, capability: Capability): boolean {
  return MATRIX[role].includes(capability);
}

/** Read-only roles may look but never change a teacher decision. */
export function isReadOnly(role: DemoRole): boolean {
  return role === "leader" || role === "district";
}
