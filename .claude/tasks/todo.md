# Todo

## Phase 2 — motion, SEO/AEO/GEO, UX, commission form, donations — DONE

Plan: `~/.claude/plans/use-local-llm-skill-read-atomic-honey.md`

### 1. Motion — DONE
The reported cause (framer-motion / missing prefers-reduced-motion) was wrong on both
counts; the measured cause was narrower than even the plan assumed.

- [x] `reveal.tsx` retimed: duration 0.7/0.6 -> 0.3, `amount` 0.3 -> 0.01, stagger 0.08 -> 0.04 capped
- [x] `rootMargin` sign corrected (negative SHRINKS the box and fires later; positive fires early)
- [x] Spring-damped scroll transforms in hero / about / reviews
- [x] Four `Bloom` global `useScroll` listeners collapsed onto one shared provider
- [x] `ScrollVelocityProvider` — skips the animation above 90px/frame, sampling on both
      the scroll event and rAF so it engages without a one-frame lag
- [x] `MotionPreferenceProvider` + in-page toggle + `:root[data-motion="reduced"]` CSS
- [x] Pricing hover spring scoped to `whileHover` (a component-level `transition`
      overrides the variant's, which defeated the velocity gate)
- [x] PROVEN: cold flick went 3 elements sustained -> 1 element for exactly 1 frame (~16ms)

### 2. SEO / AEO / GEO — DONE
- [x] Domain -> `https://tazcreates.site` (sitemap + robots verified)
- [x] `app/opengraph-image.tsx` + `twitter-image.tsx` — real 1200x630 card (was a 600x800 portrait crop)
- [x] `public/llms.txt`
- [x] `serviceSchema` added; page serves 7 server-rendered JSON-LD blocks:
      Organization, WebSite, ProfessionalService, FAQPage, 3x Product — real CAD prices,
      Group correctly emits `minPrice` since "$35+" is a floor
- [x] `force-static` on `/` (registering the next-intl plugin had made it dynamic)

### 3. UI/UX — DONE
- [x] `site-header.tsx` — sticky nav w/ IntersectionObserver scroll-spy + mobile Sheet
      (the page previously had ZERO nav links)
- [x] `faq-section.tsx`, `process-section.tsx`
- [x] Footer touch targets 28px -> 44px; consent row, selects, header brand, clear button
- [x] `<Toaster />` mounted (was absent, so `useToasts()` rendered nothing)
- [x] Duplicate `id="commission"` resolved (closing CTA -> `#order`)
- [x] Home `<title>` fixed — `title.template` does not apply to the root segment's own page

### 4. Commission form — DONE (needs credentials to actually send)
- [x] `lib/commission-schema.ts` shared client+server; re-validated server-side
- [x] `commission-form.tsx` — RHF + CustomSelect + Turnstile + honeypot
- [x] `app/api/commission/route.ts` — Turnstile verified server-side and FAILS CLOSED,
      per-IP rate limit, `to` never taken from payload (open-relay guard)
- [x] `emails/commission-request.tsx` React Email template
- [x] `.env.example`; 503 + Instagram/email fallback when unconfigured
- [x] Verified: bogus captcha 400, bad email 400, no consent 400, honeypot silent 200,
      GET 405, no secret names in the client bundle

### 5. Support — DONE
- [x] `support-section.tsx` — Buy Me a Coffee styled link, renders WITHOUT a live link
      while the username is `__TODO__` rather than shipping a 404

### 6. Verify — DONE
- [x] tsc clean; jest 79/79 (9 suites); build clean; prettier clean
- [x] lint: 0 problems in my files; repo-wide down 49 -> 46 problems
- [x] Lighthouse desktop AND mobile: 100 / 100 / 100 / 100, 0 failures
- [x] No horizontal overflow at 375 or 1440
- [x] Reduced motion via BOTH the OS query and the in-page toggle (persisted, reversible)

## Blocked — needs the user
- [ ] **Buy Me a Coffee username** — `content/site.ts` `support.username` is `__TODO__`
- [ ] **`RESEND_API_KEY`** + verify `tazcreates.site` DNS on Resend
- [ ] **Turnstile** site + secret keys
- [ ] **VERIFY THE DRAFTED FAQ AND PROCESS COPY.** `content/site.ts` marks both blocks
      `verify: true`. Turnaround (1-2 weeks), revision policy, deposit, and shipping are
      drafted, NOT taken from the old site, which stated none of them. These strings are
      the source for `faqSchema()`, so a wrong answer here becomes a wrong answer in
      ChatGPT/Perplexity.

## Follow-ups
- [ ] `ui-ux-quality` + `frontend-design` skills claim "prefers-reduced-motion honoured
      nowhere" — stale since phase 1; correct them.
- [ ] Pre-existing lint debt: `hooks/use-mobile.ts` (setState-in-effect x2),
      `components/ui/custom/CustomSelect.tsx:20,64`, `services/`, `types/`, `jest.polyfills.js`
- [ ] Jest needs `--forceExit` (MessagePort handle)
- [ ] `i18n/routing.ts:6` declares `fr` but `messages/fr.json` absent
- [ ] Scroll-spy does not highlight for `#process`/`#commission` (not in `SITE.nav.links`)
- [ ] Rate limit is per-instance and in-memory; move to a shared store if traffic grows
