# Cloudflare deploy: next-on-pages -> OpenNext Workers

## Problem
Cloudflare build ran `npx @cloudflare/next-on-pages@1` and died on npm ERESOLVE:
next-on-pages@1.13.16 wants `@cloudflare/workers-types@^4`, wrangler@4 wants `^5`.
Deeper issue: `@cloudflare/next-on-pages` is deprecated (npm deprecation points at
OpenNext) and does not support Next 16. This project is on next 16.2.

## Decision
Migrate to `@opennextjs/cloudflare` (Cloudflare Workers), the supported adapter for
Next 14 latest / 15 / 16. Not Pages — OpenNext output (`.open-next/worker.js` +
`.open-next/assets`) is a Worker with static assets, which the Pages git integration
cannot deploy.

## Steps
1. deps: `@opennextjs/cloudflare` (dep), `wrangler` (devDep).
2. `wrangler.jsonc` — main, assets binding, `nodejs_compat` +
   `global_fetch_strictly_public`, IMAGES binding (next/image is used with local files),
   WORKER_SELF_REFERENCE.
3. `open-next.config.ts` — minimal; no ISR on this site, so no R2 incremental cache.
4. package.json scripts: `build:cf`, `deploy`, `preview`, `cf-typegen`.
5. `.gitignore`: `.open-next/`, `.wrangler/`.
6. `app/opengraph-image.tsx` reads fonts/art off disk with `node:fs` — pin it
   `force-static` so it stays a build-time route and never runs in the Worker.
7. `clientIp()` in the commission route: prefer `cf-connecting-ip` on Workers.

## Cloudflare dashboard (manual — user does this)
Delete/ignore the Pages project. New Workers project, same repo, Workers Builds:
- Build command:  `pnpm run build:cf`
- Deploy command: `pnpm exec wrangler deploy`
Build variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
`NEXT_PUBLIC_SEO_INDEX`.
Runtime secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL`.

## Known accepted limits
- Rate limit in `app/api/commission/route.ts` is per-isolate in-memory. On Workers that
  window is shorter and less reliable than on Node. Turnstile is the real gate.
- Cloudflare Images transformations are metered beyond the free tier.

## Round 2 — fitting the 3 MiB free-plan script limit

Measured, not guessed. Baseline worker payload was 3,833,495 bytes gzipped.

Deleting the ~120 unreachable files and 24 packages moved it **zero bytes** — none of
that code was in the module graph reachable from `app/`, so Next never bundled it. That
cleanup buys install time and repo clarity, not deploy size.

What actually cost bytes was `next/og`. Two metadata routes (`app/opengraph-image.tsx`
and `app/twitter-image.tsx`, the latter a 3-line re-export of the former) kept Satori in
the runtime graph, so every deploy shipped `resvg.wasm` (531 KB gz), `yoga.wasm` (29 KB),
a font blob (59 KB) and their JS glue — to render an image identical on every request.

Fix: `scripts/generate-og.tsx` renders the same 1200x630 card at build time into
`public/og.png`; `config/site.config.ts` points `OG_IMAGE.path` at it. Static assets are
served from Cloudflare's asset store and do not count against the script limit.

    3,833,495 -> 3,013,678 bytes gz   (-820 KB, 21%)
    free-plan limit is 3,145,728      (132 KB of headroom, 4%)

Rejected: shrinking the canvas to 800x420 for "lower quality". Measured at 180 KB vs the
592 KB baseline, so it does work — but it degrades the card on retina displays and, once
the PNG became a static asset, it buys nothing against the limit it was meant to fix.

Headroom is thin. Re-measure before adding any server-graph dependency:

    pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
    find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c

Next lever if it is ever needed: replace the `resend` SDK + `@react-email/components`
in the commission route with a plain `fetch` to Resend's REST API.
