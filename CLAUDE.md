# Tazcreates

Single-page marker-art portfolio and commission site for Tazcreates. One public route
(`/`), one API route (`/api/commission`), deployed to Cloudflare Workers.

## Stack (opinionated — do not substitute without discussion)

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS v4 with CSS-variable design tokens in `app/globals.css` + shadcn/ui
- next-intl (i18n runtime), react-hook-form + Zod (forms/validation)
- framer-motion + lenis (motion and smooth scroll)
- Resend + React Email (commission delivery)
- Jest + React Testing Library + jest-axe (tests)
- `@opennextjs/cloudflare` + wrangler (deploy)

**Banned:** AG Grid, `@tanstack/react-table`, raw Tailwind palette colors (`bg-rose-50`,
`bg-white`, …).

**Not installed — do not import:** TanStack React Query, Zustand, and the rest of the
starter's data-layer packages. They were removed once the site turned out to be static;
there is no client data fetching and no global client store. Adding one back is a
discussion, not a drive-by `pnpm add`.

## Behavior

- Use plan mode for any task with 3+ steps; write the spec to `.claude/tasks/plans/<slug>.md` before implementing.
- Read the relevant skill (via the Skill tool) BEFORE writing or reviewing code it covers.
- After any user correction, append the lesson to `.claude/tasks/lessons.md`.
- Never mark work done without proof. Verification for this project: `pnpm tsc --noEmit` + `pnpm lint` on changed files. **Do not run `pnpm test` as a routine step** — run it only when the change touches something under test (`components/portfolio/`, `lib/commission-schema.ts`) or when asked. Jest does not exit on its own here (open-handle leak), so it needs `--forceExit` and otherwise leaves stray processes behind.
- Before starting a bounded/mechanical subtask (stub, test skeleton, rename, docstring pass, summary, commit-message draft), read the `local-llm` skill — it decides whether to offload to the local model. **Always review** the result; see *Delegating to the local model* below for the mechanics.

## Deployment (Cloudflare Workers)

Deployed via `@opennextjs/cloudflare`, **not** Cloudflare Pages. `@cloudflare/next-on-pages`
is deprecated and does not support Next 16 — never reintroduce it.

- `wrangler.jsonc` — Worker name, `nodejs_compat`, ASSETS/IMAGES bindings.
- `open-next.config.ts` — deliberately minimal; nothing on this site revalidates, so
  there is no incremental cache. Add `incrementalCache` the day a route uses `revalidate`.
- Workers Builds runs `pnpm run build:cf`, then `pnpm exec wrangler deploy`.
- Build-time env (`NEXT_PUBLIC_*`) goes in Build variables; `RESEND_API_KEY`,
  `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` are runtime secrets.

**The 3 MiB script budget is the binding constraint.** The free Workers plan caps the
compiled script at 3 MiB gzipped and the current build sits just under it. Before adding
any dependency that lands in the server graph, check the cost:

```
pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c
```

Anything that can be computed once at build time belongs in `scripts/`, emitted into
`public/`, and served as a static asset — assets do not count against the script limit.
`scripts/generate-og.tsx` is the worked example: it took `next/og` (Satori + `resvg.wasm`,
820 KB gzipped) out of the runtime by rendering the social card at build instead.

## Delegating to the local model (Claude-usage efficiency)

To conserve Claude usage, offload **bounded, mechanical, low-risk** subtasks to the local LM Studio model **`google/gemma-4-12b-qat`** (OpenAI-compatible, default `http://localhost:1234/v1`), then **always review** the result before using it. Claude stays the planner, reviewer, and integrator; the local model is a cheap first-draft generator whose output is untrusted until verified.

**Delegate (good fit):** boilerplate/scaffolding from an explicit spec (a type/DTO from a described shape, a test skeleton, a component stub), repetitive mechanical edits (renames, docstrings/comments, format-only rewrites), first-draft `bn` i18n values, file/diff summaries, draft commit messages.

**Never delegate (Claude does these directly):** architecture, the FE↔BE wire contract, DB schema/migrations, auth/permissions and other security-sensitive code, and anything needing whole-repo or cross-file reasoning.

**How to call it (Bash):**

```bash
curl -s http://localhost:1234/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"google/gemma-4-12b-qat","messages":[{"role":"user","content":"<task>"}],"temperature":0.2}'
```

Read `.choices[0].message.content` from the JSON. The model id must match what LM Studio has loaded — confirm with `curl -s http://localhost:1234/v1/models`. If the server is unreachable, **do the task yourself** — never block on it.

**Always review (non-negotiable):** treat the output as an untrusted draft — read it, run this project's verification (`pnpm tsc --noEmit && pnpm lint`), and fix any issue before accepting. Never commit or mark work done on unreviewed local-model output. The review itself is Claude's job — never delegated.

## After auto-compact

Re-read this file, then re-read the skill for the in-progress task (frontend / git / code-review) before resuming.

## Task management

- Working checklist: `.claude/tasks/todo.md` — write it before starting, check items off as you go.
- Plans / design docs: `.claude/tasks/plans/<slug>.md` (never `~/.claude/plans/`).
- Corrections: `.claude/tasks/lessons.md`.

## Knowledge graph (graphify)

If `graphify-out/` exists: query the graph BEFORE Grep/Glob/Read. If `graphify-out/.needs_update` exists, run `/graphify ./ --update` first.
Commands: `query "<q>"` (BFS), `query "<q>" --dfs`, `path "<A>" "<B>"`, `explain "<node>"`, `affected "<node>"` (reverse traversal — impact/blast radius before a change). Read `graphify-out/GRAPH_REPORT.md` for architecture questions.
Cite `source_file:source_location` from graph results. Trust EXTRACTED edges; verify INFERRED ones against source before relying on them.

## Skills

| Skill | When |
|---|---|
| `frontend` | Before writing/reviewing any component, page, or hook |
| `git` | Before running any git command |
| `code-review` | Reviewing a diff or PR against project conventions |
| `commit-message-generator` | Composing a commit message (print-only — never commits) |
| `knowledge` | Retrieving past learnings (`.planning/learnings/`) |
| `learn` | Capturing implementation learnings after significant work |
| `ui-auditor` | Auditing UI consistency, UX, and accessibility |
| `local-llm` | Before starting a bounded/mechanical subtask — decide if it should go to the local model first |
| `seo-optimizer` | Writing page metadata, adding structured data, auditing on-page SEO |
| `geo-fundamentals` | Optimizing for AI citation (ChatGPT/Claude/Perplexity), writing or auditing `llms.txt` |
| `ui-ux-quality` | Before delivering UI work — the numeric bar (contrast, touch targets, breakpoints, motion) `frontend` and `ui-auditor` do not state |
| `frontend-design` | Building a page, section, or hero where visual quality matters — taste, not mechanics |

## Agents

| Agent | When | Writes? |
|---|---|---|
| `security-reviewer` | After touching the commission API route or any server-side code | no |
| `i18n-reviewer` | After any change touching user-visible text | no |
| `seo-analyzer` | Auditing metadata coverage, structured data, sitemap/robots correctness | no |
| `ui-ux-reviewer` | Evidence-cited UI/UX critique (vs. the `ui-auditor` skill's guided audit) | no |
| `search-ai-optimizer` | Implementing SEO/AEO/GEO changes — schema, metadata, `llms.txt` | **yes** |

`search-ai-optimizer` is the only agent that edits files. Everything else reports and
leaves the change to the main thread.

## Cross-cutting rules

- **Git:** never run state-changing git commands (`add`, `commit`, `push`, `checkout`, `reset`, …). Read-only git (`status`, `diff`, `log`, `show`, `blame`) is fine. See the `git` skill.
- **Content:** all site copy lives in `content/site.ts`. Never hard-code a name, price, tagline, or gallery item in a component — read it from `SITE`.
- **i18n:** locales are `en` (default) and `bn` (Bengali). `messages/en.json` is the source locale; every key must exist in `messages/bn.json` — placeholder `__TODO__: <english>` until translated. Never add a key to one file only. next-intl is wired only because `components/ui/custom/CustomSelect.tsx` calls `useTranslations`; routes are unprefixed and `LOCALE_PREFIXED_ROUTES` is false.
- **Untrusted input:** `app/api/commission/route.ts` is public and can be POSTed directly. Keep the ordering — schema parse, honeypot, rate limit, Turnstile, then send — and never take the recipient address from the payload.
- **SEO:** page metadata goes through `buildPageMetadata()` (`lib/seo/`), site-wide values live in `config/site.config.ts`, and routes come from `LINKS` (`config/router.config.ts`). Adding a route means a sitemap decision: included by default, or added to `SITEMAP_EXCLUDE` deliberately. JSON-LD is built in `lib/seo/schemas.ts` and rendered server-side via `JsonLd` — never from a client component.
- **Social card:** `public/og.png` is generated by `pnpm og`, which `build` and `build:cf` both run. Edit `scripts/generate-og.tsx`, never the PNG. Do not turn it back into an `app/opengraph-image.tsx` route — see *Deployment*.

## Project structure

```
app/                      # App Router: layout, page, globals.css (design tokens),
                          #   robots.ts, sitemap.ts, api/commission/route.ts
components/portfolio/     # every section of the single page, plus primitives/
components/seo/           # JsonLd — server-rendered structured data
components/ui/            # the 11 shadcn primitives this site actually renders
components/ui/custom/     # CustomSelect (the only surviving custom primitive)
content/site.ts           # ALL site copy, gallery, pricing, FAQ — the content source
hooks/use-qa-id.ts        # data-qa id helper
lib/utils.ts              # cn
lib/commission-schema.ts  # zod schema shared by the form and the API route
lib/seo/                  # buildRootMetadata, buildPageMetadata, JSON-LD schema builders
config/router.config.ts   # LINKS — all internal route paths + SITEMAP_EXCLUDE
config/site.config.ts     # SITE_CONFIG / ORGANIZATION / SITE_URL — site-wide SEO values
emails/                   # React Email templates for commission requests
scripts/generate-og.tsx   # build-time social card -> public/og.png
scripts/i18n/             # locale key check / sync / extract
i18n/request.ts           # next-intl config (no [locale] segment by design)
messages/                 # next-intl locale files: en.json (source, default) + bn.json
knowledge/                # curated engineering pattern docs (read when relevant)
wrangler.jsonc            # Cloudflare Worker config
open-next.config.ts       # OpenNext adapter config
```

An earlier revision of this file documented a much larger starter kit — a full shadcn
catalog, `services/api.ts`, React Query keys, table/pagination/skeleton primitives, an
auth permission helper. None of it was reachable from `app/`, so it was deleted. If you
need one of those pieces back, add it deliberately and check the script budget first.
