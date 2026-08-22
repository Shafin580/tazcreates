# Lessons

Corrections log. Append an entry after ANY user correction so the same mistake is never repeated. Keep entries short — one rule each.

Entry format:

```
## <YYYY-MM-DD> — <one-line lesson>
Context: <what happened>
Rule: <what to do instead, stated as an imperative>
```

## 2026-08-21 — Batch delegable llm.py jobs in parallel, and never A/B a warm corpus
Context: User pointed out I was batching llm.py jobs but running them serially, and asked me
to use parallel batches and update the `local-llm` convention. The skill said `--workers > 1`
"actively loses" on the 26b. Re-measuring showed that was true only at 12-24 jobs, not at the
~6-job size a real `--each` sweep is; at 6 jobs w1/w4/w8 are within noise (1.04x) with the
citation contract intact. My first A/B was invalid because it re-swept the same files, so
every arm read the server's prefix cache (all conditions 2.1-2.6s).
Rule: When comparing request *shape* against a local LLM server, consume byte-unique input
exactly once per arm and alternate condition order — a warm re-run measures the KV cache, not
the variable. And do not restate a benchmark's conclusion outside the job size it was taken at.

## 2026-08-21 — Verify image/asset identity offline, not through a dev server
Context: Three downloaded assets had filenames that did not match their contents. The browser
gave contradictory answers across reloads because Next's dev image optimizer holds an
*in-memory* cache keyed on the request URL; the file bytes changed underneath an unchanged
`/_next/image?url=...`, and an empty `.next/cache/images` did not mean the cache was cold.
Rule: Settle "which image is this" with an offline check on the file itself (PIL pixel
signature, hash against the source URL) before trusting any rendered screenshot. Only a dev
server restart clears the optimizer's in-memory cache.

## 2026-08-21 — Measure the reported symptom before accepting the reported cause
Context: Asked to evaluate GSAP because scrolling "glitched", and told
prefers-reduced-motion "doesn't exist". Both premises were wrong: reduced motion was
already implemented and verifiable, and profiling showed ZERO dropped frames even at 6x
CPU throttle. The real fault was reveal choreography — and even that turned out narrower:
at ~530px/frame an element is on screen for two frames, so no duration can play at all.
Timing fixes alone did not move the metric; a scroll-velocity gate that skips the
animation did (3 sustained -> 1 frame).
Rule: Reproduce a reported symptom as a number before choosing a fix, and re-measure
after each change — three plausible fixes in a row (shorter duration, earlier threshold,
spring damping) all left the metric at 3. Also: skill/docs describing repo state can be
stale; verify against the code, not the doc.

## 2026-08-21 — IntersectionObserver rootMargin sign, and variant-vs-component transitions
Context: Two subtle framer-motion bugs cost real debugging time.
Rule: (1) `rootMargin` POSITIVE grows the observation box and fires EARLIER; negative
shrinks it and fires later — I had it backwards and the reveal got worse, not better.
(2) A component-level `transition` prop OVERRIDES the transition inside a variant. A card
with `variants={child}` plus `transition={{type:"spring"}}` for its hover ignored the
variant's timing entirely. Scope hover timing inside `whileHover`, not on the component.

## 2026-08-22 — Commission email templates
Rule: (1) Do not run the full test suite as a routine verification step here — it does
not exit on its own and leaves stray processes; run it only when the change touches
tested code, with `--forceExit`. (2) "An email template" for this site means TWO: the
commission flow has a client-facing auto-reply AND an artist-facing notification. Ask
which, or build both. Delivered `components/email-template/commission-confirmation.html`
(client) and `commission-request-admin.html` (artist).
