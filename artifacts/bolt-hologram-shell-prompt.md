# Bolt prompt — Hologram Learning app shell (dual-rail + command stage)

**How to use**

1. Attach the Acme/Stripe rail screenshot to the Bolt chat (text alone gets radius and shadow wrong).
2. Paste everything below the horizontal rule.
3. If Bolt drifts, reply with the matching correction:
   - Chat column appears → `Delete the chat panel. Agent output lives in the stage as GhostCard + DecisionBar.`
   - Email-style inbox appears → `Communication is artifact-anchored. Every row binds to a student, a standard code, and a status. No subject lines.`
   - Dark theme or theme toggle appears → `Obsidian-on-parchment is the only theme. Remove the toggle.`
   - shadcn or a UI kit appears → `Remove the UI kit. Hand-written headless primitives only.`
   - Page scrolls → `html, body, #root are 100dvh overflow hidden. Only the stage scrolls.`

---

Build a production-quality React + Vite + TypeScript + Tailwind CSS app shell for **Hologram Learning**, an AI-native K–12 LMS. Recreate the visual language of the attached Stripe Dashboard / "Acme" left sidebar (rounded floating rail, parchment field, hairline borders, compact 14px labels, workspace switcher pinned to the rail footer) and implement it as the Hologram dual-rail + anchored command canvas.

Do not build a generic SaaS dashboard. Do not build a chat panel or an email client. Do not create a separate "accessible mode." Accessibility is the default DOM.

## Stack (do not change)

- React 18, Vite, TypeScript
- Tailwind CSS
- lucide-react for icons
- No UI kit. Write your own small headless primitives; add a library only if focus management genuinely requires it
- Client-only mock data. No backend, no auth, no persistence layer

## Conflict resolutions (do not re-litigate)

- **Parchment wins.** Any dark reference imagery is cited for *layout* only. The palette is obsidian-on-parchment.
- **"No scrolling" means a fixed frame, not clipped content.** The outer frame is 100dvh with `overflow: hidden`; the stage is the single region with `overflow-y: auto`. This satisfies WCAG 2.1 SC 1.4.10 Reflow.
- **The inbox is not an inbox.** Communication is an artifact-anchored hub ranked by pedagogical urgency, never chronological mail.

## Visual system

Palette
- Page / parchment: `#F9F8F5`
- Rail / card surface: `#FFFFFF`
- Hairline border: `rgba(13,17,23,0.08)`
- Obsidian text: `#0D1117`
- Secondary text: `#5C6370`
- Hover fill: `rgba(13,17,23,0.04)`
- Active fill: `rgba(13,17,23,0.06)`
- Focus ring: `2px solid #0D1117`, offset `2px`
- Draft / AI-ghost: 1px dotted `#0D1117` border over `#F3F1EC`
- Approval-pending chip: `#0D1117` text on parchment
- No box-shadow anywhere. Separation comes from hairlines and surface contrast only.

Typography
- Humanist / geometric sans; use Inter as the web-safe stand-in
- Rail labels: 13.5–14px, weight 450–500, tracking `-0.01em`
- Brand wordmark: 14px, weight 600
- Workspace name: 13px weight 600; plan line: 11px `#5C6370`
- Line-height 1.45 in the rail, 1.55 in the stage

Geometry (screenshot fidelity)
- App background: full parchment. `html, body, #root { height: 100%; overflow: hidden }`
- Primary rail: floating left column, `width: 240px`, `margin: 10px 0 10px 10px`, `border-radius: 16px`, white surface, 1px hairline, **no** drop shadow
- Rail inner padding: 10px
- Logo row: 28px mark + "Hologram" wordmark; right cluster = bell + panel-collapse, 28×28 hit targets, 1px hairline buttons, 8px radius
- Nav rows: 36px tall, 8px radius, 8px gap between 16px icon and label; chevron-down only on expandable rows
- Rail footer: 44px workspace card, 8px radius, 1px hairline, sun-mark + "Lincoln Middle" / "Free", chevron-up-down on the right
- Secondary drawer: 260px, white surface, 1px hairline, 16px radius, 8px gap from the primary rail
- Command dock: anchored to the bottom of the stage column (not the rail), 48px tall, 12px radius, 1px hairline, white surface

Motion
- Animate `opacity` and `transform` only. 160–200ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Never animate `width`, `height`, `top`, `left` on large regions
- `@media (prefers-reduced-motion: reduce)`: instant state swaps, no springs
- Target mid-tier Chromebook hardware (Celeron, 4GB): no unthrottled vector redraws, no deeply nested flex morphs

## Information architecture

Primary rail destinations, in this exact order:

1. Stage — `home` — default
2. Triage — `list-checks` — expandable, badge = count of teacher-gated drafts
3. Retrieval — `repeat` — student spaced-retrieval queue
4. Standards — `git-branch` — mastery graph
5. Communication — `inbox` — Actionable Communication Hub, not email
6. Students — `users`
7. Analytics — `trending-up`
8. Settings — `settings` — expandable

Expandable children (invent no others):

- Triage → Priority Risks · Pending Approvals · Intervention Groups
- Settings → Workspace · Accessibility · Integrations

Do not include Products, Usage Billing, Benefits, Sales, Storefront, or Finance.

Badging: replace notification dots with gate counts that name an editorial action, e.g. `3 Drafts`.

## Dual-rail behavior

The primary rail is 240px in default teacher/admin mode.

Selecting Communication, Standards, or an expandable parent that needs a list slides in the 260px secondary drawer between the rail and the stage.

Communication Hub (never chronological)
- Action Required
- Teacher Approvals
- Artifact Threads

Every row binds a student name, a standard code (e.g. `7.EE.B.4a`), and a status. No email-style subject lines.

Triage secondary — ranked by pedagogical urgency, not recency
- Tier 1: system-flagged prerequisite failures needing an intervention decision
- Tier 2: agent-drafted feedback awaiting approval
- Tier 3: direct student/parent notes

Escape or click-outside collapses the drawer and returns focus to the originating primary-rail control.

Focus modes
- **Student Retrieval Mode**: the primary rail collapses to an 8px inactive parchment sliver, all badges hide, the command dock stays. The rail returns only on Pause or Submit.
- **Teacher Triage Mode**: the secondary drawer is locked open on the triage queue.

Chromebook constraint: the stage must never fall below 720px at 1366×768. Below a 1280px viewport, the secondary drawer becomes an overlay instead of a push drawer.

## Stage + command anchor

```
[ Primary rail ] [ Secondary drawer? ] [ Stage column                  ]
                                        [ Top context bar              ]
                                        [ Morphing stage (scrolls)     ]
                                        [ Command dock                 ]
```

Top context bar — 40px, parchment, 1px bottom rule
- Role badge: Teacher | Student | Admin
- Workspace: Lincoln Middle
- Current standard or queue title
- Pending approvals count

Implement all three stage states as real views, not placeholders.

**State A — Teacher Triage Bento**
- CSS grid, 2×2 on desktop, single column when narrow
- Card: Priority Risks (student name + BKT probability + standard)
- Card: Pending Gating (draft count)
- Card: Interleaved Review Queue (full width)
- Every AI-drafted block uses the ghost treatment plus a Decision Bar: Approve / Edit / Dismiss. Nothing commits without an explicit click.

**State B — Student Retrieval Canvas**
- Single-focus workspace, target standard at top (`7.EE.B.4a`)
- Problem stem, student input, and reference criteria co-located on one plane — no tab switching, no split attention
- Socratic hint chip appears only after a failed retrieval attempt, and isolates the prerequisite misconception instead of giving the answer
- No decorative dashboard widgets

**State C — Compact Agenda**
- Daily queue ordered by retention urgency, not calendar due date
- Each row: standard, last evidence date, next retrieval window

## Command dock (persistent anchor)

The dock is a stable control anchor that projects state changes into the stage. It never expands to swallow the viewport, and it never renders a chat transcript.

- Left: `>_` glyph + input, placeholder "Ask Hologram to draft, group, or retrieve…"
- A slim header line above the input carries the agent name and a status dot: `Idle | Drafting | Awaiting approval`
- Right of the header line: a `New session` text button and a settings icon button, both 28×28 hit targets with hairline borders — same treatment as the rail's bell/collapse cluster
- Suggestion chips sit directly above the input, max three, e.g. `Group by prerequisite` · `Draft feedback batch` · `Show retrieval gaps`
- Inside the input row: attach (`paperclip`) and quick-action (`zap`) glyphs on the left, round send button (`arrow-up`) on the right
- Far right of the dock: `Pending Approvals (n)` button that opens Triage
- Agent responses are action chips inside the stage, never prose:
  `[Regenerate with lower Lexile]` · `[Target Prerequisite: 6.EE.A.2]` · `[Submit to Teacher for Review]`

All of this is rendered in parchment tones — white surface, hairline borders, obsidian text. No dark bubble treatment, no message list.

Ship this happy path end to end:
1. Teacher types `group students failing 7.EE.B.4a by prerequisite`
2. The stage renders a ghosted proposed intervention-group card
3. A Decision Bar appears on that card
4. Approve commits the card to a `Live` state and decrements the badge
5. Dismiss removes the ghost and writes nothing

## Accessibility (non-negotiable)

- Landmarks: `banner`, `navigation` (primary rail), complementary (drawer), `main` (stage), `search` or `form` (command dock)
- Every icon button has an `aria-label`
- Tab order: logo → rail items → drawer (when open) → stage → command dock
- Enter/Space on an expandable rail item expands it and moves focus to the first child
- Escape collapses the drawer or unexpands the item and restores focus to the trigger
- `aria-expanded`, `aria-controls`, and `aria-current="page"` on the active destination
- When the agent inserts a draft, announce via `aria-live="polite"`: "Draft intervention ready for review"
- Contrast ≥ 4.5:1 on all text; no gray-on-gray
- Reflow: at 320 CSS px and at 200% zoom the outer frame stays 100dvh and the stage is the only scrolling region. No two-dimensional scrolling, no clipped controls
- No "accessible view" toggle. Font size, contrast boost, and reduced motion layer over the same compliant DOM (surface these under Settings → Accessibility)

## What not to build

- No chat panel, no sidebar ChatGPT column, no email client
- No multi-page marketing site
- No dark-mode theme switch
- No box-shadow elevation system
- No auto-commit of grades, mastery, groups, or student-facing text
- No Lorem ipsum — use the roster below

## Mock data (use exactly)

Workspace: **Lincoln Middle** · plan label "Free"
Default role: **Teacher**

| Student | Standard | BKT | Flag |
|---|---|---|---|
| Maya Chen | 7.EE.B.4a | 0.41 | prerequisite 6.EE.A.2 |
| Jordan Hale | 7.EE.B.4a | 0.58 | — |
| Priya Shah | 7.RP.A.2 | 0.73 | — |
| Luis Ortega | 7.EE.B.4a | 0.36 | failed retrieval ×2 |

Pending drafts: 3 · Action-required threads: 2

## File structure

```
src/
  App.tsx
  main.tsx
  index.css
  data/mock.ts
  shell/
    AppShell.tsx
    PrimaryRail.tsx
    SecondaryDrawer.tsx
    TopBar.tsx
    CommandDock.tsx
    WorkspaceSwitcher.tsx
  stage/
    TeacherTriage.tsx
    StudentRetrieval.tsx
    CompactAgenda.tsx
    DecisionBar.tsx
    GhostCard.tsx
  a11y/
    live-region.tsx
    focus.ts
```

## Acceptance criteria

- Pixel-near match to the reference rail: floating rounded white column on parchment, logo + bell + collapse, 14px rows, chevrons only on expandable rows, workspace switcher pinned to the footer, no shadow
- Dual-rail and focus-mode behavior work with mouse and keyboard alike
- All three stage states switch from the rail with no page reload
- AI drafts are visually ghosted and cannot mutate mock "live" records without Approve
- `prefers-reduced-motion` disables animation
- Usable at 320px width, at 200% zoom, and with Tab-only navigation
- No horizontal scroll at 1366×768 or 1280×800; no document-level vertical scroll at any size

## Build order

1. Shell + primary rail at screenshot fidelity
2. Secondary drawer with Escape / click-outside and focus return
3. The three stage states
4. Command dock and the draft → ghost → Approve/Dismiss loop

Stop when the acceptance criteria pass.
