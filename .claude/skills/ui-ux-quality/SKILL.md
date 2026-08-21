---
name: ui-ux-quality
description: The numeric quality bar for UI work — contrast ratios, touch target sizes, breakpoints, motion durations, line length, z-index scale — plus a pre-delivery checklist. Use before delivering any UI work, or when a review needs a threshold rather than an opinion.
---

# UI/UX Quality

**Boundary — read this first.** Three skills cover UI and they do not overlap:

- `frontend` owns the conventions: theme tokens, `data-qa`, generated ids, ARIA wiring, shipped primitives, mandatory tests. It is the contract.
- `ui-auditor` owns the audit *workflow*: pattern detection, consistency sweep, severity grouping, fix prompts.
- **This skill owns the numbers.** The other two say "check contrast" and "make it responsive"; this one says 4.5:1 and 375/768/1024/1440. When a review needs a threshold to hold a finding against, it comes from here.

Rules ordered by impact. Work top-down: an accessibility failure matters more than a
transition duration.

| Priority | Category | Severity |
| --- | --- | --- |
| 1 | Accessibility | CRITICAL |
| 2 | Touch & interaction | CRITICAL |
| 3 | Performance | HIGH |
| 4 | Layout & responsive | HIGH |
| 5 | Typography | MEDIUM |
| 6 | Animation | MEDIUM |
| 7 | Consistency | MEDIUM |

## 1. Accessibility — CRITICAL

- **Contrast** ≥ 4.5:1 body text, 3:1 large text and UI boundaries — **checked in both themes.** This project ships a `.dark` block (`app/globals.css`) *and* eight presets in `lib/themes.ts`. A pairing that passes on `:root` can fail in `.dark` or under another preset; check the token pair, not the rendered pixel in whichever theme you happened to have open.
- **Focus states** visible on every interactive element. Never remove the ring without a replacement. The base layer sets `outline-ring/50` globally — do not undo it per component.
- **Alt text** on meaningful images; `alt=""` on decorative ones. A filename is not alt text.
- **Keyboard nav**: tab order matches visual order; nothing reachable only by mouse.
- **Colour is never the only signal** — pair it with text, icon, or shape.

Labels, `aria-label` on icon-only buttons, `<button type>`, `DialogTitle`, and the
`aria-invalid`/`aria-describedby` wiring are owned by the `frontend` skill and are
lint-enforced. Do not restate them here — follow that skill.

## 2. Touch & interaction — CRITICAL

- **Touch targets ≥ 44×44px.** A 16px icon in a `p-1` button is 24px — not enough. Pad to the target, or expand the hit area.
- **`cursor-pointer` on clickables.** `app/globals.css` already covers `button` and `[role="button"]`. The gap it does **not** cover: clickable `<div>`s, cards, and table rows. Those need it explicitly — and they need `role="button"` plus a key handler, or they are not reachable by keyboard either.
- Disable buttons during async work and show a pending state.
- Error messages sit next to the field that caused them, in words, not just red.
- Hover is an enhancement, never the only route to an action — it does not exist on touch.

## 3. Performance — HIGH

- `next/image` everywhere; explicit dimensions or a sized `fill` parent.
- `priority` on the LCP image **only** — putting it everywhere defeats it.
- Lazy-load below-fold content via `dynamic()` with a skeleton fallback. Use the shipped skeletons — `components/ui/custom/{Table,Form,Page,Detail,Card}Skeleton.tsx` — rather than a new one per feature.
- Reserve space for async content so it does not jump (CLS < 0.1). The skeleton's shape must match the loaded layout, or the skeleton *causes* the shift it was meant to prevent.
- **Respect `prefers-reduced-motion`.** `framer-motion` is a dependency in this project and **nothing currently honours the query** — no CSS media block, no `useReducedMotion()` call. Any new animated component is where that gets fixed, not deferred.

## 4. Layout & responsive — HIGH

- Test **375 / 768 / 1024 / 1440**.
- **No horizontal scroll on mobile**, ever. Check at 375px specifically.
- Body text ≥ 16px on mobile.
- Fixed and floating elements need edge spacing and must not occlude content — account for header height.
- One consistent max-width across a page's sections. Mixing widths between sections reads as broken, not as rhythm.
- **Define a z-index scale — 10 / 20 / 30 / 50** — and stay on it. Nothing in this codebase currently uses an arbitrary `z-[…]`; the first `z-[9999]` is the one to reject in review, because after it the scale is unrecoverable. Radix portals (dialog, popover, tooltip, sheet) manage their own stacking — do not fight them with a higher number.

## 5. Typography — MEDIUM

- Line height 1.5–1.75 for body copy.
- **Line length 65–75 characters.** Full-width paragraphs on a 1440px screen are unreadable; cap prose with `max-w-prose` or an explicit measure.
- Use Tailwind's type scale utilities rather than arbitrary `text-[13px]` values.
- Note this project's committed defaults before overriding them: `html` is `font-mono` and `--radius` is `0` (`app/globals.css`). Sharp corners and monospace are the design, not an oversight — see `frontend-design`.

Colour tokens are the `frontend` skill's rule, and ESLint plus review enforce it. This
skill only adds the *measurement*: check the pairing's contrast, in both themes.

## 6. Animation — MEDIUM

- **150–300ms** for micro-interactions. Slower reads as sluggish.
- Animate **`transform` and `opacity` only** — never `width`, `height`, `top`, or `margin`.
- Hover must not shift layout. No scale transforms on cards; use colour, shadow, or border.
- Skeletons over spinners for content loads.
- Animation needs a reason. Movement for its own sake is noise.

## 7. Consistency — MEDIUM

| Rule | Do | Don't |
| --- | --- | --- |
| Icons | One icon set, consistent viewBox | Emoji as icons |
| Icon sizing | Consistent `size-4` / `size-6` | Mixed sizes at random |
| Hover feedback | Colour / shadow / border transition | No indication of interactivity |
| Transitions | `transition-colors duration-200` | Instant, or > 500ms |
| Container width | One `max-w-*` per page | Mixing widths between sections |
| Brand logos | Verified official SVG | Guessed paths |

## Tailwind v4 syntax

Copy-pasted snippets often carry v3 syntax, and it fails silently rather than loudly.
Check for: `shadow-sm` (now `shadow-xs`), bare `shadow` (now `shadow-sm`), `rounded-sm`
(now `rounded-xs`), bare `rounded` (now `rounded-sm`), `outline-none` (now
`outline-hidden`), `bg-opacity-50` (now `bg-black/50`), `ring` (now `ring-3`).

## Pre-delivery checklist

**Accessibility**

- [ ] Contrast checked on actual token pairings — **light and dark**
- [ ] Focus states visible throughout
- [ ] Images have appropriate `alt`
- [ ] Keyboard-reachable in visual order
- [ ] `prefers-reduced-motion` respected

**Interaction**

- [ ] Touch targets ≥ 44×44px
- [ ] `cursor-pointer` on non-button clickables, with `role` and key handler
- [ ] Async buttons disable and show state
- [ ] Hover causes no layout shift

**Layout**

- [ ] No horizontal scroll at 375px
- [ ] Responsive at 375 / 768 / 1024 / 1440
- [ ] Nothing hidden behind fixed elements
- [ ] Consistent container width
- [ ] z-index on the 10/20/30/50 scale

**Code**

- [ ] No v3-era Tailwind syntax
- [ ] `next/image` with dimensions
- [ ] `pnpm typecheck` clean; `pnpm lint` adds no new errors
- [ ] `frontend` skill's requirements met: `data-qa`, generated ids, ARIA, and a `jest-axe` test
