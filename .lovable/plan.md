# Hologram Phase 1 — Teacher Decision Workspace

Rebind the six teacher screens around one chain: evidence → recommendation → teacher decision → audit. Keep the engine (types, seed, demo state, storage, permissions, role gates) and rebuild the route bodies on a two-plane workspace grammar.

## Verified current state

- The overview route is a four-stat grid plus three equal cards.
- There is no `/app/courses/$courseSlug/interventions/$draftSlug` route — only the interventions list.
- The roster lives at `/roster`; no `/students` path exists.
- The teacher sidebar lists eight peer destinations.
- Seed data, demo state, storage, LTI context, permissions and role gates exist and work; they are reused.

Items from your audit I have not re-verified myself (dark-mode `--ink` contrast, the "18 flagged" mismatch, synthetic heatmap offsets, `6.EE.B.5`, duplicate passback rows, the missing disclosure string) are treated as findings to confirm and fix in step 0 — each gets a check before its repair.

## Visual direction (locked)

The attached heatmap supplies spatial grammar only: evidence plane left, one decision plane right, prerequisite chain under the grid, letter+label mastery cells, flat instrument housings, parchment/ink. Specimen names, `5.OA.A.1` focus, "31% class mastery", live-presence chrome and the second quiz-risk CTA are defects. Seeded truth wins: Sophia Martinez, Marcus Lee, Olivia Carter, Daniel Kim; `6.EE.A.3`; 14 of 27; 2σ below median; 12-minute distributive-property warm-up.

## Screens

1. **Overview (Pulse)** — one dominant priority signal (`6.EE.A.3` · 14 of 27 · 2σ), a numbered review queue instead of stat cards, a recent-evidence strip, prerequisite chain, evidence rail lit at Artifact. Single primary: Review draft. No assign control, no class-mastery hero.
2. **Insights (Pattern)** — prerequisite map with the focal node emphasized, signal summary, grouped evidence ledger with the four named learners first, thick inset draft tray at the bottom going straight to the draft. Real seeded mastery values replace synthetic offsets; legend uses the product's four states.
3. **Roster (People)** — canonical `/students`, `/roster` redirects. Full-width table with search plus mastery, risk and group filters; columns for mastery, prerequisite risk, recent evidence, next review, evidence profile. Suggested-group rows marked.
4. **Sophia dossier** — two panes with a central gutter: artifact and flagged distributive-property error left; standard, Developing, teacher-facing confidence 0.62, Moderate risk, 4 artifacts, draft chip right. Tabs Evidence · Mastery · Prerequisites · Activity, each with distinct seeded content.
5. **Decision workspace (new route)** — `interventions/draft-warm-up`. Frozen evidence left; right holds the immutable original recommendation, editable draft fields, agent reasoning with limitations, status chip (Draft · AI-proposed / Teacher-edited / Approved / Declined / Overridden), controls Edit · Approve · Decline · Override · Reset draft, and an on-page audit receipt. Decline requires a reason and is disabled after approval. Passback appears only after approval, prepares exactly once, and always carries "Demo only — no data is sent to an LMS."
6. **Gradebook (Record)** — standards matrix with a Standards / Assignment toggle (the checkpoint, not letter grades), cell drawer with evidence, rationale, decision history and a provenance label, simulated passback preview only post-approval.

## Shared work

- Teacher rail: Overview · Class pattern · Students · Gradebook · Decision workspace, with Assignments and Activity below a Records divider. Passback lives inside the workspace and gradebook.
- New components over existing primitives: InstrumentHousing, DecisionPlanes, EvidenceRail, EvidenceArtifact, StatusChip, ProvenanceLabel, AgentReasoningPanel, AuditReceipt, WhyThisIsHere, RecordDrawer, LedgerTable.
- Required copy: "Hologram recommends. The teacher decides." and "Demo only — no data is sent to an LMS."

## Technical details

- Tokens in three layers: existing primitives → semantic roles (`--fg`, `--fg-muted`, surfaces, rules, status and decision colours) → brand layer (`--brand-accent`, `--brand-accent-fg`, mark slot). Component CSS references semantic roles only; the raw `--ink` usages get replaced. Target WCAG 2.2 AA in both modes; status never colour-only; no compliance claim.
- Query state on overview and insights: `course`, `focus`, `sel`, `draft`, `tab`, `from`. Lens changes replace history.
- `InterventionDraft` gains `originalRecommendation`, `teacherEdits[]`, `overridden`, `decisionNote`, and a status of draft | approved | declined | overridden. `AuditEvent` gains structured context (course, standard, student ids, artifact ids, recommendation id, decision, resulting state). New actions: `editDraft`, `overrideDraft`, `resetDraft`; `preparePassback` becomes idempotent per intervention. Existing storage keys stay; missing fields backfill from seed on load.
- Composition is deterministic: same inputs produce the same layout; high-consequence controls keep fixed positions and evidence is never hidden.
- Out of scope: student, leader, district and public route redesign; real LTI or passback; auto-assign; authoring; compliance board; letter grades as a product surface.

## Order

0. Token and dark-mode fix, semantic and brand layers, shared components, `/students` and `draft-warm-up` routes with redirects, state extensions, passback idempotency and disclosure.
1. Decision workspace. 2. Sophia dossier. 3. Overview. 4. Class pattern. 5. Students. 6. Gradebook drawer. 7. End-to-end walk of the 13-step journey in both modes, keyboard-only, role switching, hard-refresh persistence, reset, and no dead links.
