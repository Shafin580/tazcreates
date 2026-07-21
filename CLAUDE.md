# <PROJECT_NAME>

<One-line project description — replace on adoption.>

## Stack (opinionated — do not substitute without discussion)

- Next.js (App Router) + TypeScript strict
- Tailwind CSS with CSS-variable design tokens in `app/globals.css` + shadcn/ui
- TanStack React Query (server state) + Zustand (client state)
- next-intl (i18n), react-hook-form + Zod (forms/validation)
- Jest + React Testing Library + jest-axe (tests)

**Banned:** AG Grid, `@tanstack/react-table`, raw Tailwind palette colors (`bg-rose-50`, `bg-white`, …), raw `fetch`/axios in components.

## Behavior

- Use plan mode for any task with 3+ steps; write the spec to `.claude/tasks/plans/<slug>.md` before implementing.
- Read the relevant skill (via the Skill tool) BEFORE writing or reviewing code it covers.
- After any user correction, append the lesson to `.claude/tasks/lessons.md`.
- Never mark work done without proof. Verification for this project: `pnpm tsc --noEmit` + `pnpm lint` on changed files.
- Offload bounded, low-risk subtasks to the local model and **always review** the result — see *Delegating to the local model* below.

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

## Cross-cutting rules

- API request/response params are **camelCase** end to end.
- **Git:** never run state-changing git commands (`add`, `commit`, `push`, `checkout`, `reset`, …). Read-only git (`status`, `diff`, `log`, `show`, `blame`) is fine. See the `git` skill.
- **Permissions:** gate features through the central helper in `@/lib/auth` — never inline `.find()`/`.some()`/`.includes()` on permission arrays.
- **i18n:** locales are `en` (default) and `bn` (Bengali). `messages/en.json` is the source locale; every key must exist in `messages/bn.json` (and any locale added later) — placeholder `__TODO__: <english>` until translated. Never add a key to one file only.

## Project structure

```
app/                      # App Router routes, layouts, globals.css (design tokens)
components/ui/            # shadcn/ui primitives
components/ui/custom/     # shipped custom primitives (PaginationFooter, EntityPickerCommand, FacetedFilterPopover, EntityCard, CustomSelect, skeletons, …)
hooks/                    # shipped hooks (use-table-scroll-sync, use-qa-id, use-toasts, use-localized-schema, use-mobile)
lib/                      # utilities (cn), auth helper, compute-facet-counts, toast helpers
services/api.ts           # single API wrapper — all HTTP goes through here
config/query.config.ts    # QUERY_KEYS — all React Query keys
config/router.config.ts   # LINKS — all internal route paths
messages/                 # next-intl locale files: en.json (source, default) + bn.json
knowledge/                # curated engineering pattern docs (read when relevant)
```

(`src/`-prefixed layouts work the same — paths above are relative to the source root.)
