/**
 * Editable pilot scope and claims copy.
 * Every number, cohort size, and timeline shown publicly comes from here — never hard-coded
 * in a page. Keep every statement qualified: Hologram is being built, not certified or adopted.
 */
export const PILOT_CONTENT = {
  copyrightYear: 2026,
  cohortName: "Fall 2026 founding cohort",
  cohortTermLabel: "Fall 2026",
  cohortSizeLabel: "a small founding cohort of schools",
  cohortScopeStatement:
    "Hologram is inviting a small founding cohort of schools to evaluate a standards-based learning evidence workflow alongside existing instructional practice.",
  timelineLabel: "Pilot scheduling is set with each participating school.",
  primaryCta: "Request a pilot review",
  secondaryCta: "Open the pilot workspace",
  positioning: "Hologram is being built as a standards-based LMS organized around traceable learning evidence.",
  qualifiedPositioning:
    "Hologram is being built as a standards-based LMS. During pilot evaluation it is designed to launch alongside an existing LMS.",
  pilotPositioning:
    "During pilot evaluation, Hologram is designed to launch alongside an existing LMS while teams evaluate its standards-based learning workflow.",
  governance: "Hologram recommends. The teacher decides.",
  demoNotice: "Every screen uses seeded demo data. No real student records are present.",
  demoBadge: "Demo data",
  simulatedBadge: "Simulated pilot context",
  noCommitment: "No production-data commitment is required for an initial review.",
  notClaimed: [
    "No LTI certification or verified interoperability conformance is claimed.",
    "No live integration with any LMS is present in this pilot build.",
    "No compliance certification, audit outcome, or attestation is claimed.",
    "No customer adoption, learning outcomes, or efficacy results are claimed.",
    "Hologram does not replace an existing LMS today.",
  ],
} as const;
