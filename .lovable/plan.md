# Hologram Phase 1 — Teacher Decision Workspace

Rebind the six existing teacher screens around one chain: evidence → recommendation → teacher decision → audit. No new public pages, no new homes, no rewrite of the working demo state.

## Verified current state

- `/app/courses/$courseSlug/overview` is a four-stat grid plus three equal cards (confirmed in the route file).
- There is no `/app/courses/$courseSlug/interventions/$draftSlug` route — only the interventions list.
- The roster lives at `/roster`; there is no `/students` path.
- Teacher sidebar currently lists eight peer destinations.
- Seed, demo state, storage, LTI context, permissions and role gates all exist and work; they are reused as-is.

## Visual direction (locked, not re-asked)

The attached heatmap is spatial grammar only: evidence plane left, one decision plane right, prerequisite chain under the grid, letter+color mastery cells, flat instrument housings, parchment/ink. Specimen names, `5.OA.A.1` focus, "31% class mastery", live-presence chrome and the second quiz-risk CTA are treated as defects. Seeded truth wins: Sophia Martinez, Marcus Lee, Olivia Carter, Daniel Kim; `6.EE.A.3`; 14 of 27; 2σ below median; 12-minute distributive-property warm-up.

## Screens

1. **Overview (Pulse)** — one dominant priority signal (`6.EE.A.3` · 14 of 27 · 2σ), decision KPIs (open decisions, blocked skills, review SLA — no class-mastery %), compact at-risk-first heatmap beside one pending draft, prerequisite chain beneath, evidence rail as lower seam. Single primary: Review draft. No assign control.
2. **Insights (Pattern)** — real standards/prerequisite map, signal summary, grouped evidence ledger with the four named students first, thick inset draft tray at the bottom linking straight to the draft. Heatmap cells become buttons. Removes the synthetic 8-row grid.
3. **Roster (People)** — canonical `/students` with `/roster` redirecting. Full-width table, search plus mastery/risk/group filters, columns for mastery, risk, recent evidence, evidence count, next review, group. Every named row opens evidence.
4. **Sophia dossier** — two panes with a central gutter: artifact and flagged distributive-property error left; standard, Developing, teacher-only confidence 0.62, Moderate risk, 4 artifacts, draft chip right. Four tabs with genuinely distinct content. Primary: Review linked draft.
5. **Decision workspace (new route)** — `interventions/draft-warm-up`. Frozen evidence left, decision right: immutable original recommendation, editable objective/moves/exit check, why-this, status chip (Draft / Teacher-edited / Approved / Declined), controls Edit · Approve · Decline · Reset Demo, on-page audit receipt. Decline requires a reason. Passback appears only after approval.
6. **Gradebook (Record)** — standards matrix with a Standards / Assignment toggle (checkpoint, not letter grades), cell drawer showing evidence, rationale and decision history, simulated passback preview only post-approval.

## Shared work

- Teacher rail collapses to five: Pulse, Pattern, People, Record, Review. Assignments, Passback and Activity stay reachable as overflow from the workspace, not as homes.
- New composed components: ContextBar, IconRail, EvidenceRail, DecisionSplit, MasteryCell, HeatmapPlane, PrerequisiteChain, PrioritySignal, DraftTray, AuditReceipt, StatusChip, DemoDisclosure, PassbackPreview.
- Required copy everywhere it applies: "Hologram recommends. The teacher decides." and "Demo only — no data is sent to an LMS."

## Technical details

- Tokens: raise muted foreground for AA, complete the dark ramp, add `--brand-primary` / `--brand-accent` school hooks. Mastery ordinals and danger are never retinted. Cells carry letter + label + non-color marker and an `aria-label` of student, standard, code, trend.
- Query state on overview/insights: `course`, `focus`, `sel`, `draft`, `tab`, `from`. Lens changes replace history.
- `InterventionDraft` gains `originalObjective`, `originalMoves`, `originalExitCheck`, `edited`, and a `status` of draft | approved | declined | overridden. `AuditEvent` gains `evidenceContext`, `recommendationSnapshot`, `decision`, `resultingState`.
- Writes only through gated verbs: Approve, Edit, Decline, Reset, Prepare passback, Confirm passback. Existing storage keys unchanged.
- Excluded: student/leader/district redesign, real LTI or passback, auto-assign, chat tutor, authoring, compliance board, any certification or compliance claim.

## Order

0. Tokens, icon rail, `/students` alias, query state, demo disclosures.
1. Overview Pulse. 2. Insights Pattern. 3. Roster + Sophia. 4. Decision workspace. 5. Gradebook drawer. 6. End-to-end walk of the 13-step journey, checking every CTA, persistence across refresh, reset, and that the student role never sees drafts, peers, confidence or audit detail.
