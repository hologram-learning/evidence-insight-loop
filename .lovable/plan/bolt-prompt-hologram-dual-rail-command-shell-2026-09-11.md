# Bolt prompt: Hologram dual-rail command shell

Produce one copy-ready prompt file you can paste into Bolt. Nothing in the pilot app changes.

## Deliverable

`artifacts/bolt-hologram-shell-prompt.md` — a single markdown file. Everything below a horizontal rule is the paste-into-Bolt block; a short header above it tells you how to use it (attach the Acme rail screenshot, paste, then reject any chat panel or inbox).

## What the prompt will contain

Consolidated from your four briefs, deduplicated, with contradictions resolved:

1. **Framing** — AI-native K-12 LMS shell, Stripe/Acme rail chrome, Hologram behavior. Explicit "do not build": chat column, email client, generic SaaS dashboard, separate accessible mode, dark-mode toggle, shadow elevation, auto-commit of any record.
2. **Stack lock** — React 18, Vite, TypeScript, Tailwind, lucide-react, client-only mock data.
3. **Visual system** — obsidian-on-parchment palette (spec wins over the dark chat screenshot; that screenshot is cited only for composer layout), Inter stand-in typography, exact rail/drawer/dock geometry, transform-and-opacity-only motion with reduced-motion fallback.
4. **Information architecture** — the eight primary destinations in order, Triage and Settings children only, gate-count badges instead of notification dots.
5. **Dual-rail behavior** — 240px primary, 260px secondary drawer, Escape/click-outside collapse with focus return, Student Retrieval and Teacher Triage focus modes, overlay drawer below 1280px so the stage never drops under 720px at 1366x768.
6. **Stage and command anchor** — top context bar, three real stage states (Teacher Triage Bento, Student Retrieval Canvas, Compact Agenda), persistent command dock that projects into the stage rather than expanding, action chips instead of prose.
7. **Agent mechanics** — ghost/diff treatment, Decision Bar (Approve / Edit / Dismiss), the scripted happy path: type the grouping command, ghost card appears, Approve commits and decrements the badge, Dismiss writes nothing.
8. **Composer spec drawn from your chat screenshot** — header row with agent name plus status dot, New chat and settings icon buttons, suggestion chips above the input, attach and quick-action glyphs, round send button — restated in parchment tones and wired to the dock, explicitly not a transcript.
9. **Accessibility contract** — landmarks, aria-label on every icon button, tab order, Enter/Space expand with focus move, Escape restore, aria-expanded/controls/current, aria-live draft announcement, 4.5:1 minimum, 320px and 200% zoom reflow with stage-only scroll.
10. **Mock data, file structure, acceptance criteria, build order** — as you specified, verbatim where you already fixed values (Lincoln Middle, the four students and BKT values, 3 pending drafts, 2 action-required threads).

## Notes

- Where the briefs conflict, the resolution is stated inline in the prompt so Bolt cannot drift: parchment beats the dark screenshot; "zero scrolling" becomes fixed 100dvh frame with stage-only vertical overflow; the inbox becomes the artifact-anchored Communication Hub.
- A short "if Bolt drifts" correction list goes above the rule, outside the paste block.
