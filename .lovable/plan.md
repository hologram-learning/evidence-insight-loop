# Hologram Learning — pilot site + standards-based LMS workspace

Two connected products in one project: a public pilot site that positions Hologram as a standards-based LMS, and a working pilot LMS workspace that stakeholders can use with seeded demo data and browser persistence.

Positioning: "Hologram is a standards-based LMS built around traceable learning evidence." During pilot, it is described as designed to launch alongside an existing LMS. No claims of LTI certification, compliance, integrations, customers, outcomes, or LMS replacement today.

## The journey that must feel real

Mock LMS launch → teacher lands in Math 6 — Period 3 → sees the class signal → opens Sophia's actual response → sees 6.EE.A.3 evidence and prerequisite context → reviews the draft warm-up → edits or approves it → sees the audit event → prepares a clearly simulated passback.

## Public site

Home, how it works, product, pilot, research, security (implementation readiness), FAQ, contact, thank you, launch, plus about, privacy, terms, status so no link breaks.

- Home H1: "The LMS that keeps evidence attached to every decision." Two calls to action: "Explore the pilot workspace" (launch) and "Request a pilot review" (contact).
- Header: Product, How it works, Pilot, Research, Launch demo, Sign in dialog ("Pilot access is issued to participating schools. Use the launch preview to explore the pilot workspace."), primary button "Request a pilot review".
- Product page lists Evidence Console, Mastery & Prerequisite Map, Teacher Action Workspace, standards-first gradebook, assignment & submission workflow, and pilot launch context — each linking into a real app route.
- Pilot scope copy (cohort size, school count) comes from one editable content file, not hard-coded in pages.
- Contact form gains optional "Existing LMS or learning environment" and "Which workflow are you evaluating?" fields; saves locally, toast, then thank-you page with a summary and a link into the workspace.

## Launch boundary (simulated)

`/launch` shows a mock LMS launch card (platform: existing LMS demo context, Math 6, Period 3, Ms. Chen, Instructor, "Standards Evidence Workspace"). Launching writes a mock launch context to browser storage and lands on the course overview, with a persistent banner: "Launched in pilot context · Existing LMS demo context · Math 6 — Period 3". An integration page diagrams the coexistence model and lists simulated passback history. No real token exchange, deep linking, or LMS services.

Simulated passback: available only on approved evidence, opens a preview (student, assignment, standard, mastery status, teacher-entered status, destination label), needs explicit confirmation, writes an audit event, and is labeled "Demo only — no data is sent to an LMS."

## Pilot LMS workspace (`/app`)

Shell: left sidebar, responsive collapse, top bar with demo role switcher, course context, "Demo data" label, reset control, theme switcher (system/light/dark, persisted), and the launch banner when present.

Roles (demo only, visibly change navigation and permissions):
- Teacher (Ms. Chen) — course overview, roster, student profile, assignments (including creating one), submission review, gradebook, class insights, intervention drafts, review workspace with Edit/Approve/Decline/Reset, activity timeline, simulated passback.
- Student (Sophia Martinez) — home, assignments, editable demo submission, standards progress in words (Beginning/Developing/Secure), teacher feedback and approved next steps. No roster, no other students' mastery, no teacher controls.
- Instructional leader (Dr. Rivera) — aggregate course signals, intervention statuses, readiness checklist. No editing of decisions.
- District admin (Jordan Taylor) — organization overview, participating sections, workflow coverage, audit summary, implementation checklist. No editing of decisions.

Routes: `/app`, `/app/courses`, and under `math-6-period-3`: overview, students, students/sophia-martinez, assignments, assignments/expressions-checkpoint, gradebook, insights, interventions, interventions/draft-warm-up, activity. Plus `/app/leader/overview`, `/app/district/overview`, `/app/integration`, `/app/launch-preview`, `/app/settings`, and the student routes `/app/student/home`, `/assignments`, `/assignments/expressions-checkpoint`, `/progress`, `/feedback`.

Every write (edit, approve, decline, assignment created, submission saved, passback prepared/confirmed) records an audit event with actor, timestamp, action, and object.

## Data and persistence

One typed seed source and a local-storage repository layer behind a narrow interface so it can later be swapped for a hosted database and real authentication. Domain types cover organization, school, term, course, section, user, enrollment, student, assignment, standards alignment, submission, evidence artifact, rubric criterion, mastery record, prerequisite relation, intervention draft, teacher decision, gradebook entry, audit event, pilot request, and launch context.

Seeded exactly as specified: Hologram Pilot District — Demo, North Valley Middle School — Demo, Fall 2026 — Demo, Math 6 — Period 3 (Ms. Chen, 27 students, 14 needing targeted support, 3–7 priority skills, "2 sigma below recent class median"), Expressions and Equations Checkpoint on 6.EE.A.3, Sophia Martinez ("3(x + 4) = 21" → "3x + 4 = 21", distributive-property error, Developing, confidence 0.62, moderate risk, 4 artifacts, 12-minute warm-up draft awaiting review), Marcus Lee, Olivia Carter, Daniel Kim, Maya Patel, Noah Williams, plus anonymous filler records to reach 27. All labeled "Demo data".

Persisted across refresh: role, theme, launch context, intervention state, created assignment, student submission, audit history, contact submission.

## Design

Editorial, evidence-first, dimensional: warm paper light mode, graphite/ink dark mode, deep framed instrument housings, fine technical labels, evidence chips, restrained motion honoring reduced-motion. The evidence rail (artifact → standard → mastery → risk → teacher action) appears as an orientation device, not decoration. No stock classroom imagery, generic AI visuals, or flat rounded-card SaaS layouts. Every status chip carries an icon plus a text label — never color alone.

## Technical notes

- Stack stays React 19 + TypeScript on TanStack Start with file-based routes in `src/routes` (this replaces React Router). Zod for form validation, Lucide icons.
- The attached Hologram design system at `@/design-system/code-companions-0f8a99` supplies the theme foundation and primitives (Button, Card, Table, Tabs, Modal, Field, Input, Select, Badge, MasteryPill, MasteryHeatmap, StatCard, Toast, TopNav, PersonaSidebar); its `styles/theme.css` is the single token source, imported once at the root. Hologram-specific composed components (instrument housings, evidence rail, product frames, gradebook, review workspace) are built above those primitives. Tailwind v4 handles layout and composition only and maps to the existing tokens — no duplicate or competing theme variables, no default shadcn look, no flat card-grid dashboard.
- Folder layout: `src/data` (seed, standards, pilotContent), `src/types` (domain, lti), `src/lib` (storage, ltiContext, mastery, permissions, utils), `src/components/{layout,marketing,app,lms,demo,forms}`.
- Mock launch context is isolated in `src/lib/ltiContext.ts` (create/get/clear) under the key `hologram_demo_lti_launch_context`, always carrying `isDemo: true`. Every launch-related screen is labeled simulated pilot context; no wording implies a real LMS sent, authenticated, or received anything.
- Per-route head metadata with unique titles and descriptions on every public page.

## Permissions and states

- `src/lib/permissions.ts` gates each route by demo role. Teacher-only routes redirect other roles to their permitted landing view; where a redirect would be confusing, a polite "This view is not available for the selected demo role" panel renders instead of a blank page.
- Student role never renders roster data, peer mastery, intervention drafts, passback controls, audit detail, or teacher controls. Leader and district roles are read-only.
- Explicit empty/loading/error-style states for: no assignments yet, no interventions awaiting review, no activity recorded, no pilot request saved, missing or cleared launch context, and no roster search/filter results — all clearly demo-only.
- Audit events are written for assignment creation, submission save, evidence review, intervention edit, approval, decline, passback preview, and passback confirmation. Each carries actor, role, timestamp, action, target object, and a human-readable description.
- Reset demo state asks for confirmation, then restores the original seed exactly.

## Build order

1. Domain types, seed data, storage repository, permissions, theme foundation, shared layout, route files.
2. `/app` shell, role switcher, mock launch route, course context, demo reset.
3. Teacher vertical slice, complete before any breadth: launch preview, course overview, roster, Sophia evidence profile, assignment and seeded submission, class insights, intervention review, audit history, simulated passback.
4. Student slice at explicit routes: `/app/student/home`, `/app/student/assignments`, `/app/student/assignments/expressions-checkpoint`, `/app/student/progress`, `/app/student/feedback`.
5. Leader and district overviews.
6. Public pages wired to the workspace: home, how it works, product, pilot.
7. Contact → thank-you, FAQ, research, security, legal placeholders.
8. Accessibility, responsiveness, link/persistence verification, polish.

After each phase: verify routes, permissions, local persistence, reset behavior, call-to-action destinations, responsive behavior, and keyboard accessibility before moving on.

## Explicitly not built

Real LTI 1.3/Advantage, key management, deep linking, names-and-roles or grade services; production authentication, SSO, multi-tenancy; content authoring, quizzes, files, messaging, calendar, notifications; real AI inference; real student data; production grade passback; compliance guarantees; billing or payments.
