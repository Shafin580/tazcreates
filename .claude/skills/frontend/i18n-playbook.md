# i18n Migration Playbook

> Referenced by the `frontend` skill's Internationalization section. The atomic unit of work for converting one component file from hardcoded English to translated.
> Applies whenever you create a new component or touch an existing untranslated one.

---

## When to apply this playbook

- **Creating a new component / page / hook.** All user-visible text must be translated from the start. Skip nothing — even "internal admin" pages.
- **Editing an existing untranslated component.** If the file has hardcoded English, convert the file in this PR. Don't ship a half-translated mix.
- **Editing an existing translated component.** Stay consistent — extend the existing namespace, don't introduce a parallel one.

---

## The 10-step recipe

### 1. Identify all user-visible strings in the file

Eyeball-scan for these forms:

- JSX text nodes — `<h1>Dashboard</h1>`, `<Button>Save</Button>`, `<p>No items found</p>`
- JSX attributes — `placeholder`, `title`, `label`, `aria-label`, `alt`, `tooltip`, `description`, `confirmLabel`, `cancelLabel`, `emptyMessage`
- Toast calls — `toast.success("...")`, `toast.error("...")`, `toast.info("...")`, `toast.warning("...")`, `toast("...")`
- Zod messages — `z.string({ required_error: "..." })`, `.min(1, "...")`, `.max(50, "...")`, `.email("...")`, `.refine(..., "...")`, `.refine(..., { message: "..." })`
- Confirm/alert dialog content — title, description, button labels
- Empty / loading / error state copy — "No data", "Loading...", "Failed to load"
- Tooltip and helper text passed as props

Skip: route paths, API URLs, CSS classNames, `data-*` / `id` / `key` props, console messages, error.code strings, fixture data inside test files.

### 2. Pick the namespace

In order of preference:

1. **Reuse an existing feature namespace** if the file already belongs to one — check `messages/en.json`. Example: anything under `.../settings/notification-preferences/` uses `NotificationSettings`.
2. **New feature-scoped namespace** — `<Feature>` (or `<Area>.<Feature>` in large apps). Examples: `Invoices`, `Billing.Invoices`, `Projects.Tasks`.
3. **Reserved shared namespaces** for cross-cutting text:
   - `Common` — actions (`save`, `cancel`, `delete`, `edit`, `create`, `close`), states (`loading`, `empty`, `error`)
   - `Validation` — Zod messages (`required`, `minLength`, `email`, etc.)
   - `Toasts` — success/error/loading templates with `{entity}` placeholder
   - `Tables` — column actions, pagination, empty
   - `Errors` — server / network / unauthorized / not-found / `byCode.<HTTP_CODE>`

If the file's text is purely shared (e.g. a re-usable confirm dialog), use a shared namespace. If it has feature-specific copy, use a feature namespace. Most files end up using both — `useTranslations("Billing.Invoices")` for feature copy plus `useTranslations("Common")` for buttons.

### 3. Add the keys to `messages/en.json`

Group under the chosen namespace using these sub-key conventions:

```json
{
  "Invoices": {
    "page": {
      "title": "Invoice Configuration",
      "description": "Configure invoices applied to customer billing"
    },
    "form": {
      "name": { "label": "Invoice Name", "placeholder": "e.g. Monthly Subscription" },
      "amount": { "label": "Default Amount", "placeholder": "0.00" }
    },
    "actions": {
      "create": "Create Invoice",
      "deleteConfirm": "Delete this invoice?"
    },
    "modal": {
      "editTitle": "Edit Invoice",
      "deleteTitle": "Delete Invoice"
    },
    "column": {
      "name": "Name",
      "amount": "Amount",
      "appliesTo": "Applies To"
    },
    "empty": {
      "noInvoices": "No invoices configured yet"
    },
    "toast": {
      "created": "Invoice created successfully",
      "createdDescription": "The new invoice is now available in billing templates",
      "deleteFailed": "Failed to delete invoice"
    },
    "validation": {
      "nameRequired": "Invoice name is required",
      "amountPositive": "Amount must be greater than zero"
    }
  }
}
```

**Sort alphabetically inside each sub-tree.** Don't introduce duplicate keys with different casing (`createTitle` vs `CreateTitle`).

### 4. Add `__TODO__` placeholders to every other locale

`en` is the source locale. For every new key in `en.json`, add the SAME path in every other `messages/<locale>.json` with the value `__TODO__: <english>`:

```json
{
  "Invoices": {
    "page": { "title": "__TODO__: Invoice Configuration" },
    "actions": { "create": "__TODO__: Create Invoice" }
  }
}
```

If the project defines an `i18n:check` script, CI runs it (e.g. `pnpm i18n:check --ci`) to block PRs that have keys in `en.json` missing from another locale file.

Until that's automated for your project, do this manually — it takes 30 seconds per file and keeps the parity check green.

### 5. Wire the translation hook

```ts
// Client component
import { useTranslations } from "next-intl";

export function InvoiceForm() {
  const t = useTranslations("Invoices");
  // ...
}

// Server component / route handler
import { getTranslations } from "next-intl/server";

export default async function InvoicePage() {
  const t = await getTranslations("Invoices");
  return <h1>{t("page.title")}</h1>;
}
```

If you need multiple namespaces in one component, just call the hook multiple times:

```ts
const t = useTranslations("Invoices");
const tCommon = useTranslations("Common");
const tValidation = useTranslations("Validation");
```

### 6. Replace JSX literals

```tsx
// Before
<h1>Invoice Configuration</h1>
<Button>Create Invoice</Button>
<Input placeholder="e.g. Monthly Subscription" aria-label="Invoice name" />

// After
<h1>{t("page.title")}</h1>
<Button>{t("actions.create")}</Button>
<Input
  placeholder={t("form.name.placeholder")}
  aria-label={t("form.name.label")}
/>
```

### 7. Convert toasts

**Use `useToasts()`:**

```ts
import { useToasts } from "@/components/ui";

const toasts = useToasts();
toasts.success("create", { entity: t("entityName") });
toasts.error("network");
```

Never call `toast.success("...")` / `toast.error("...")` with bare string literals.

### 8. Convert Zod schemas

**Use `useLocalizedSchema()`:**

```ts
import { useLocalizedSchema } from "@/components/ui";

const useInvoiceSchema = () =>
  useLocalizedSchema((t) => z.object({
    name:   z.string().min(1, t("required")).max(50, t("maxLength", { max: 50 })),
    amount: z.number().positive(t("number.positive"))
  }));
```

**Never** leave hardcoded English in Zod — that's the most-missed gap during reviews.

### 9. Verify

- **Type check:** `pnpm tsc --noEmit` — catches missing keys (next-intl types ARE strict if `messages.d.ts` is wired).
- **Parity:** `pnpm i18n:check` if the project defines this script — confirms every other locale has the new keys.
- **Lint:** `pnpm lint` — catches any literals you missed (e.g. via `i18next/no-literal-string` if configured).
- **Smoke test:** in dev, set the `NEXT_LOCALE` cookie via DevTools to any non-en locale, reload the page, eyeball — every string should be either translated or `__TODO__: <english>`. If something stays English, it's still hardcoded.
- **Unit test:** add or update the jest-axe test wrapping the component in `<NextIntlClientProvider locale="<locale>" messages={...}>` (use `customRender` from `@/test-utils`) — confirms no a11y regression and no missing-key crash.

### 10. Open the PR

CI runs `pnpm lint` + `pnpm i18n:check --ci` (if defined) + the test suite. Green = done.

If `i18n:check` fails: a key was added to `en.json` without a parallel `__TODO__` placeholder in another locale file. Fix and push.

If lint fails on a literal-string rule: you missed a literal. Either translate it, or add the literal to the rule's `ignore` list if it's genuinely non-user-facing (URL, CSS class, etc.).

---

## Common gotchas

- **Don't translate the same string twice with different keys.** "Save" appears everywhere in the codebase — there should be exactly one key (`Common.actions.save`). Before adding `Invoices.actions.save`, check `Common.actions.save` first.
- **ICU placeholders are positional, not free-form.** `t("greeting", { name: user.name })` works; `t("greeting", user.name)` does not.
- **Server components cannot use `useTranslations` directly** — they must use `getTranslations` from `next-intl/server` (it's async). Mistaking one for the other crashes at render.
- **Don't conditionally render translation calls.** `{condition && t("foo")}` is fine. `t(condition ? "foo" : "bar")` is also fine. But `condition ? "Foo" : t("bar")` mixes hardcoded and translated — fail.
- **Don't translate proper nouns.** Company names, product names ("Workday"), brand strings stay English in all locales.
- **Don't translate enum / API values.** The API returns `"status": "PENDING"` — that's a code, not a label. Map it client-side via `t(`status.${value.toLowerCase()}`)` — the label is translated, the value isn't.
- **Don't leave dead `useTranslations` imports.** If you imported `useTranslations` but every call site still uses English literals, the import is just hiding the gap. Remove it OR translate.
- **Empty namespace strings.** `useTranslations("")` returns the root — almost always a mistake. Always pass a namespace.
