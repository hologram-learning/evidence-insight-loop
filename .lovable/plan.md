# Hologram Learning — pilot site and product demo

A desktop-first marketing site plus a clickable, no-login product demo for a standards-based-grading AI learning platform, built on seeded demo data only. No real AI, no student data, no accounts, no payments.

## Look and feel

An editorial, instrument-like system rather than a typical software site.

- Light: warm paper background, ink text, restrained accents (deep blue, forest green, muted gold, oxblood, slate).
- Dark: graphite/near-black field with recessed and raised planes, accents reserved for status meaning.
- Editorial display type for headlines, modern sans for interface and body copy, tiny technical labels.
- Product views sit mounted inside deep framed housings; a thin "evidence rail" connector runs from student work to standard to mastery to risk to teacher action across the site.
- Status is never communicated by color alone — every chip carries a label.
- No stock classroom photos, cartoon art, rainbow gradients, fake logos, fake testimonials, or invented results.

## Pages

Marketing: home, how it works, product, pilot, research, security (pilot readiness), FAQ, contact, thank you, plus simple About, Privacy, Terms, Status pages so no footer link breaks.

Demo (no sign-in): demo hub, Sophia Martinez student evidence view, Math 6 — Period 3 class view, and the teacher review workspace for the draft warm-up.

Shared header (sticky, transparent over the dark hero, blurred and bordered after scroll, clean mobile menu) with a non-functional Sign in dialog reading "Pilot access is issued to participating schools", and one primary call to action everywhere: "Request a pilot review". Shared five-column footer.

## Key behaviors

- Student view: working tabs for Evidence, Mastery, Prerequisites, Activity that change the visible content.
- Class view: roster table with mastery and prerequisite-risk chips, the four suggested students visually grouped, standards pattern panel, draft intervention panel.
- Teacher review: Edit (dialog with editable fields), Approve (status becomes Approved with a success state), Decline (reason capture, status becomes Declined), and Reset demo state. Wording makes clear the decision is recorded in the demo only.
- Contact form: all required fields with inline validation, role dropdown, consent checkbox, saves to browser storage, success toast, then the thank-you page shows a summary from the saved submission.
- Every page carries "Demo data" labeling where seeded content appears.

## Seed data

Exactly as specified: Sophia Martinez (6th grade math, "3(x + 4) = 21" → "3x + 4 = 21", distributive-property error, 6.EE.A.3, Developing, confidence 0.62, moderate prerequisite risk, 4 artifacts, 12-minute warm-up draft awaiting review); Math 6 — Period 3 with Ms. Chen, 27 students, 14 needing targeted support, 3–7 priority skills, "2 sigma below recent class median"; plus Marcus Lee, Olivia Carter, Daniel Kim, Maya Patel, Noah Williams.

## Claims discipline

No compliance certifications, customers, integrations, outcome guarantees, or metrics beyond the seeded demo. Research page includes an explicit "what Hologram does not claim" section; security page is framed as pilot readiness and implementation discussion.

## Technical notes

- Stack is React 19 + TypeScript on TanStack Start/Router (file-based routes in `src/routes`), which replaces React Router here.
- Install and configure Tailwind CSS v4 via the Vite plugin, with design tokens in `src/styles.css` under `@theme inline`; add the shadcn/ui primitives actually needed (dialog, tabs, accordion, select, checkbox, toast/sonner, table, button, input, textarea). Fonts loaded through a `<link>` in the root route.
- Reusable components split into layout (`SiteHeader`, `SiteFooter`, `PageHero`, `SectionHeader`, `EditorialSection`, `InstrumentHousing`, `EvidenceRail`, `ProductFrame`, `DemoHeader`), marketing (buttons, `EvidenceChip`, `TrustStrip`, `StepCard`, `FeatureStoryRow`, `StatBlock`, `PilotTimeline`, `FAQAccordion`, `CTASection`), demo (`StudentArtifactPanel`, `StandardsMasteryCard`, `PrerequisiteGraph`, `EvidenceTable`, `ClassRosterTable`, `InterventionDraftCard`, `TeacherReviewActions`, `StatusChip`, `DemoDataNotice`), and form (`PilotInterestForm`, `FormField`, `SubmitSuccessState`).
- Seeded data in a single typed module; demo state in React state/context, contact submission in localStorage.
- Zod validation on the contact form; per-route head metadata with unique titles and descriptions; reduced-motion respected.

## Build order

1. Tailwind + tokens, shared layout, routes, seed data.
2. Homepage sections A–K.
3. Demo hub and three interactive demo routes.
4. Contact → thank-you flow.
5. How it works and product.
6. Pilot, research, security, FAQ, placeholder legal pages.
7. Responsive, accessibility, and polish pass; verify every route and call to action.
