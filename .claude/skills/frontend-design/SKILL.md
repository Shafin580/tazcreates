---
name: frontend-design
description: Aesthetic direction for building distinctive, production-grade interfaces without generic "AI slop" design — composition, typography, motion, depth, and what to avoid. Use when building a new page, section, hero, or component where visual quality matters, or when asked to make something look better, more polished, or more distinctive.
---

# Frontend Design

Guidance for producing interfaces with a clear point of view, working within this
project's existing design language rather than inventing a new one each time.

**Boundary:** `frontend` owns the mechanics (which primitive, which token utility, which
hook), `ui-ux-quality` owns the thresholds (4.5:1, 44px, 150–300ms), `ui-auditor` owns
compliance sweeps. This skill owns *taste* — the decisions none of those three can make
for you.

## Context first

Ask before designing, and write the answer down: **who is this for, on what device, and
what do they need to believe by the time they leave?** Every rule below bends to that
answer. A design system with no audience behind it produces the same centred hero and
three feature cards every time.

Two constraints that hold regardless:

- **Mobile-first, genuinely.** Not "it reflows at 375px" — the mobile view is the design, and the desktop view is the variation. Heavy motion and large images cost real users real access.
- **Evidence carries the page.** Specific numbers, real photography, named things. Decoration supports the evidence; it does not replace it. If the decoration pushes the substance below the fold, the decoration is wrong.

## Existing design language — work with it

The palette is committed in `app/globals.css` as oklch tokens with a full `.dark`
counterpart. Two defaults are deliberate choices, not oversights:

- **`--radius: 0`.** Sharp corners are the project's look. Rounding a card because it feels friendlier breaks the system — change the token if the whole product should be rounded, never one component.
- **`html { @apply font-mono }`.** Monospace is the default voice. `--font-sans` and `--font-heading` exist for deliberate contrast, not as an escape hatch from the default.

`lib/themes.ts` ships eight presets plus radius, scale, font, and chart-preset axes.
**Anything you design must survive a preset switch** — hardcoding a look that only works
on `default` defeats the system.

**Do not invent a new palette per component.** Extend a ramp, or add a semantic role to
both `:root` and `.dark` plus its `@theme inline` alias — the `frontend` skill has that
workflow.

**Dark mode is designed, not inherited.** Every surface, border, and shadow needs a dark
decision. A shadow that reads as depth on white reads as a smudge on near-black; depth in
dark mode comes from lighter surfaces (`--card` above `--background`), not darker shadows.

## Typography

Fonts are loaded through `next/font` in `app/layout.tsx` — Geist Sans, Geist Mono, and
JetBrains Mono, exposed as CSS variables. Add a face there or not at all; a `@font-face`
in CSS bypasses Next's preloading and subsetting.

- Use the type scale. Arbitrary `text-[13px]` values are how a scale dies.
- **Contrast in weight and size does more work than adding another typeface.** Two weights of one family beats three families every time.
- Cap prose at 65–75 characters. See `ui-ux-quality`.

## Composition

- **Generous negative space beats density.** Whitespace is not wasted space; it is what makes the important thing look important.
- **Break the three-equal-columns reflex.** It is the single clearest tell of a layout nobody made a decision about.
- **Vary rhythm.** Full-bleed statement, then a tight grid, then a wide quote. A page where every section is the same height and shape reads as a list, not an argument.
- Asymmetry is available and underused. An offset block, an off-centre image, a column that breaks the grid — one per page is a signature; one per section is noise.
- Respect one max-width across sections. Mixing container widths reads as broken.

## Motion

`framer-motion` is a dependency, and `tw-animate-css` is imported in `app/globals.css`.
Reach for CSS transitions first; bring in `framer-motion` for orchestration —
`staggerChildren`, layout transitions, presence — not for a hover colour.

- **One well-orchestrated reveal beats scattered micro-interactions.**
- 150–300ms for UI transitions. Slower reads as sluggish.
- Animate `transform` and `opacity` only — never `width`/`height`/`top`.
- Hover states must not shift layout: colour, shadow, and border changes, not scale transforms on cards.
- **`prefers-reduced-motion` is currently honoured nowhere in this codebase.** Whatever you animate is where that debt gets paid — `useReducedMotion()` from framer-motion, or a media block in `globals.css`. Motion that cannot be turned off is an accessibility failure, not a flourish.

## Backgrounds and depth

Prefer layered tints from existing tokens over flat fills: `bg-muted` for a section wash,
`bg-card` for a raised surface, opacity modifiers (`bg-primary/5`) for a tint. These
adapt across themes and presets; a hand-mixed background does not.

Avoid: purple-gradient-on-white, generic blob shapes, stock abstract meshes, and the
glassmorphism panel that appears whenever nobody decided what the background should be.

## What to avoid

- **Emoji used as icons.** Use the project's icon set.
- **Cookie-cutter SaaS layout:** centred hero, three feature cards, alternating image-left/image-right all the way down, testimonial carousel, pricing table, CTA. Recognisable at a glance as a template nobody edited.
- **Adding a typeface to signal effort.**
- **Decorative imagery that pushes the substance below the fold.**
- **Arbitrary values** (`p-[13px]`, `bg-[#...]`) instead of scale and token values.
- **Rounding, shadowing, or gradient-ing a component to make it "pop"** when the real problem is hierarchy.

## Before you call it done

- [ ] Every colour is a token — no hex, no `bg-[#...]`, no stock palette classes
- [ ] It works in **both themes**, and survives a `lib/themes.ts` preset switch
- [ ] Contrast ≥ 4.5:1 for body text, checked in light and dark
- [ ] Responsive at 375 / 768 / 1024 / 1440; no horizontal scroll on mobile
- [ ] Touch targets ≥ 44×44px; visible focus states
- [ ] Hover states cause no layout shift
- [ ] `prefers-reduced-motion` honoured
- [ ] Images via `next/image` with meaningful `alt`
- [ ] Below-fold sections behind `dynamic()` with a matching skeleton
- [ ] Nothing on this page is here only because the template had one
