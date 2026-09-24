# Hologram connected teacher-decision slice

## Verified baseline

- The working tree is clean. The earlier `src/styles.css` work is already committed: it adds design-system source detection plus token-backed Tailwind shortcuts; the current automatic build is OK.
- `bunx tsgo --noEmit` passes. `bun run lint` reaches project code but fails on two pre-existing empty-interface rules inside the attached design-system source; that managed source will not be edited.
- The simulated launch, course overview, Sophia dossier, seeded mastery history, prerequisite context, editable intervention, approval/decline/reset, browser persistence, receipt, and activity filter already work. These behaviors will be preserved rather than rebuilt.
- Light and dark fields render the Hologram surfaces, status colors, shadows, and components. The attached ABC Oracle font URLs return 404 locally, so the documented fallbacks render; this is an attached-design-system asset issue, not caused by the stylesheet shortcuts.
- Current credibility gaps: the Sophia page always links to one hardcoded draft; the evidence-to-decision relationship is split across separate panels; mastery estimates are not consistently labeled as seeded; several views repeat the same records without strong cross-links; the phone shell stacks the entire navigation above the workspace; the account label says Ms. Rivera while the active teacher is Ms. Chen.

## Implementation

### 1. Make the evidence path contextual

- Add a reusable, token-backed relationship surface that reads actual records and visually connects:
  `student work → focus standard → prerequisite → proposed teacher action`.
- On Sophia’s dossier, derive the relevant intervention from the selected course, student, and standard instead of linking to `draft-warm-up` by name.
- Keep the existing accessible “Seeded mastery history (demo)” table and add a compact ordinal trend treatment only where it helps comparison; dates and full text remain available.
- Label mastery and recommendation provenance consistently as seeded demo information, never calculated BKT or live AI inference.

### 2. Strengthen the decision workspace without changing its state model

- Recompose the existing intervention detail into a clearer evidence plane and teacher-control plane using the current Hologram components, tokens, and records.
- Connect every artifact, learner state, prerequisite count, and recommendation to that draft’s `standardCode` and `studentIds`; retain the truthful no-prerequisite and no-history states.
- Keep the immutable original recommendation, before/after edits, explicit approve/decline, required decline reason, reset confirmation, receipt, idempotent simulated passback, and single browser-stored activity log.
- Make the current next action visually dominant and ensure approved/declined/edited states visibly change the decision surface.

### 3. Unify the surrounding course views

- Add meaningful cross-links between overview, students, class patterns, gradebook evidence, the relevant draft, and filtered activity so they read as views of the same course record.
- Replace static or hardcoded teacher-facing labels used in this journey with values derived from existing course, standard, student, and intervention records.
- Fix the teacher identity mismatch in the shell and prevent leader-visible links from leading to teacher-only dead ends.
- Do not merge routes or create new pages; stable navigation and existing information architecture remain intact.

### 4. Refine the Hologram visual hierarchy and responsive shell

- Use the existing crystal mark and token palette for restrained causal connectors, focus states, and decision transitions; no new palette, gradients, glass effects, or decorative charts.
- Improve evidence density, alignment, current-state emphasis, empty states, and before/after readability in light and dark fields.
- Replace the phone layout’s full stacked sidebar with a compact, keyboard-accessible navigation treatment using existing controls, while keeping the workspace vertically scrollable and tables internally scrollable.
- Preserve reduced-motion behavior and visible focus treatment.

### 5. Metadata and verification

- Add unique route metadata to every content route touched in this slice, including title, description, Open Graph text, `og:type`, and `twitter:card`.
- Run `bunx tsgo --noEmit`, `bun run lint`, and rely on the automatic build result. Report the managed design-system lint errors separately if they remain.
- Browser-test the real path: create simulated launch → overview → Sophia → evidence/history/prerequisite → relevant draft → edit → approve → receipt/history → reload persistence.
- Separately test decline requires a reason, reset confirmation restores seed state, student-role restriction, keyboard operation and focus, light/dark fields, desktop at 1280×800, phone width, internal table overflow, console errors, and relevant network requests.

## Acceptance criteria

- Sophia’s work, mastery history, prerequisite, and intervention are connected from actual seeded relationships, with no hardcoded unrelated draft link.
- The intervention page shows one coherent, draft-specific record from evidence through teacher decision and history.
- Edit, approval, decline, reset, persistence, receipt, and simulated passback behavior remain functional and truthful.
- The primary next action is evident on each screen and causes a visible state change.
- Student mode cannot render teacher decision/history controls; this remains described as a demo UI restriction, not security.
- No unintended horizontal page overflow at phone width or 1280×800; dense tables scroll within their own containers.
- No backend, real AI, LTI connection, batch approval, messaging, publishing, deployment, new framework, or real student data is introduced.
