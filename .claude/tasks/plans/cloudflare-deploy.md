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
