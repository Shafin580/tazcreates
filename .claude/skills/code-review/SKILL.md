---
name: code-review
description: Structured checklist for reviewing a diff or PR against project conventions (components, state/data, types/routing, interactive elements, i18n, quality, security). Trigger on "review", "review this PR", "check my changes", "code review".
---

# Code Review Skill

## Purpose

Structured code review checklist for this project. Enforces conventions from the frontend and git skills. Use when reviewing PRs, auditing code changes, or validating implementation quality.

## Review Process

### Step 1: Scope the Review

Identify what changed:
- Run `git diff` or `git diff --name-only` to see affected files (read-only git — allowed per git skill)
- Categorize the intent: feature, bugfix, refactor, migration, or config change

### Step 2: Apply the Checklist

---

## Frontend Checklist

### Components
- [ ] Interactive/client components have `"use client"` directive
- [ ] Uses `@/components/ui` components — no custom UI reinventing existing primitives
- [ ] Tables use plain ShadCN Table with `.map()` — no AG Grid, no `@tanstack/react-table`
- [ ] Table imports from `@/components/ui`

### State & Data
- [ ] Query keys from `QUERY_KEYS` in `config/query.config.ts` — never inline
- [ ] API calls go through `services/api.ts` (`getAPIResponse`) — no raw fetch/axios in components
- [ ] API params are **camelCase**
- [ ] Auth checks go through `useAuthStore` / the central permission helper at `@/lib/auth` — never inline `.find()`/`.some()`/`.includes()` on permission arrays

### Types & Routing
- [ ] New types defined in `types.d.ts`
- [ ] Navigation uses `LINKS` from `config/router.config.ts`
- [ ] No `any` types — TypeScript strict compliance

### Interactive Elements (buttons, inputs, dialogs, tabs, links)
- [ ] Every interactive element has a stable `data-qa="<area>.<feature>.<element>"` attribute (e.g. `auth.login.submit`, `settings.billing.export-button`)
- [ ] No hardcoded string `id="..."` JSX props — ids come from `FormItem`/`React.useId()`/`useQaId`
- [ ] Icon-only buttons have `aria-label`
- [ ] `<button>` has explicit `type` (default `"button"` via `Button` primitive)
- [ ] Inputs have a label (visible `<FormLabel>`/`<Label htmlFor>` or `aria-label`)
- [ ] Dialogs have a `DialogTitle` (use `VisuallyHidden` if suppressed)
- [ ] New/modified interactive elements have a Jest + RTL + `jest-axe` unit test asserting `data-qa`, label association, and zero axe violations

### Internationalization
- [ ] No hardcoded English in JSX text or `placeholder` / `title` / `label` / `aria-label` / `alt` / `tooltip` / `description` attributes
- [ ] All `toast.success(...)` / `toast.error(...)` calls receive translated arguments — never bare string literals (use `useToasts()`)
- [ ] All Zod schemas use translated messages — no inline English in `.min()` / `.max()` / `.email()` / `.refine()` / `required_error` (use `useLocalizedSchema(t => ...)`)
- [ ] Every new key added to `messages/en.json` has a parallel entry in every other `messages/<locale>.json` (`__TODO__: <english>` placeholder is acceptable; CI blocks parity gaps)
- [ ] Shared components (`components/ui/custom/`) do NOT hardcode feature-specific text (dialog titles, empty-state descriptions) — these come from caller props
- [ ] Namespace follows convention: `<Feature>` (or `<Area>.<Feature>` in large apps), or one of the reserved shared names (`Common`, `Validation`, `Toasts`, `Tables`, `Errors`)
- [ ] No dead `useTranslations("...")` imports (declared but every call site still uses English literals)
- [ ] `pnpm i18n:check` passes locally before requesting review, if the project defines an `i18n:check` script

### Quality
- [ ] No `console.log` left in production code
- [ ] Loading, error, and empty states handled for data-fetching components (per frontend skill)
- [ ] Accessible: labels, ARIA attributes, keyboard navigation

### Post-Change
- [ ] Build passes: `pnpm build`
- [ ] No lint errors: `pnpm lint`
- [ ] Typecheck passes: `pnpm tsc --noEmit`

---

## Cross-Cutting Checklist

### Security
- [ ] No XSS vectors (user input rendered with `dangerouslySetInnerHTML`)
- [ ] No injection vectors (unescaped user input passed into queries or shell/dynamic evaluation)
- [ ] No secrets committed (.env, tokens, keys) and no secrets leaked into client code via `NEXT_PUBLIC_*`
- [ ] No sensitive data in `console.log` or error messages
- [ ] For a deep security audit, dispatch the `security-reviewer` agent

### Git
- [ ] Only read-only git commands run by agents (`status`/`diff`/`log`/`show`/`blame`) — state-changing git (add/commit/push/checkout/switch/reset/stash/merge/rebase/tag/config) is never run by Claude

---

## Step 3: Report Format

```markdown
## Code Review: [scope]

### Summary
[1-2 sentence overview of what the changes do]

### Verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION

### Issues Found
#### Critical (must fix)
- [file:line] — [description]

#### Warnings (should fix)
- [file:line] — [description]

#### Suggestions (consider)
- [file:line] — [description]

### Convention Compliance
- Frontend rules: PASS / FAIL ([details])
- Security: PASS / FAIL ([details])

### What's Good
- [positive observations — acknowledge good patterns]
```
