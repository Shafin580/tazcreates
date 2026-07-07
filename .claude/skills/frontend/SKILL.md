---
name: frontend
description: Conventions for writing or reviewing any Next.js component, page, or hook — theme tokens, shadcn tables (scrollable layout, faceted filters, entity pickers), the mandatory pagination shape, loading states/skeletons, dynamic imports for heavy dialogs, URL-synced tabs, forms, data-qa/ARIA/test requirements, and i18n via next-intl. Read before writing or reviewing anything under app/, components/, or hooks/.
---

# Frontend Conventions Skill

## Shared primitives (reference implementations shipped)

The template ships these files at their real paths — they are ready to import, assuming the shadcn primitives from the README adoption steps have been added via the shadcn CLI. Their consumed i18n keys are seeded in `messages/en.json`.

Components — `components/ui/custom/`:
- `PaginationFooter.tsx` — mandatory pagination shape (see Pagination section); exports `PAGE_SIZE_OPTIONS` and `DEFAULT_PAGE_SIZE`.
- `TableSkeleton.tsx`, `CardSkeleton.tsx`, `DetailSkeleton.tsx`, `FormSkeleton.tsx`, `PageSkeleton.tsx` — shared loading skeletons (see Loading States section).
- `TableSelectionCounter.tsx` — bulk-select row counter (see Pagination section).
- `IconTooltipButton.tsx` — icon-only button with mandatory tooltip + aria-label (see Pagination section).
- `CustomSelect.tsx` — searchable single-select (Popover + Command) (see Interactive Element Convention).
- `EntityCard.tsx` — neutral record card (`EntityCardData`: title, subtitle, code, description, imageUrl, badges, active) rendered inside picker rows.
- `EntityPickerCommand.tsx` — exports both `EntityPickerCommand` (inline) and `EntityPickerPopover` (anchored) generic searchable-list-plus-filter pickers (see Entity picker section).
- `FacetedFilterPopover.tsx` — generic multi-facet filter for table columns; exports `FilterItem`, `FilterSection` (see Faceted filter popover section).

`components/ui/sonner.tsx` — themed `Toaster` wrapper; mount once in `app/layout.tsx` or toasts won't render.

Hooks — `hooks/`:
- `use-table-scroll-sync.ts` (`useTableScrollSync`) — bidirectional scroll sync + overflow detection for scrollable tables.
- `use-qa-id.ts` (`useQaId`) — generates a stable id for label/control association outside `<Form>`.
- `use-toasts.ts` (`useToasts`) — translated toast helper (namespaces `Toasts`/`Errors`).
- `use-localized-schema.ts` (`useLocalizedSchema`, `makeZodErrorMap`, `useInstallZodErrorMap`) — Zod schema factory with translated messages (`Validation` namespace; zod v3 API).
- `use-mobile.ts` (`useIsMobile`, `useIsTablet`) — breakpoint hooks used by the faceted filter's mobile Sheet layout.

Helpers — `lib/`:
- `utils.ts` (`cn`, `generateAvatarFallback`).
- `compute-facet-counts.ts` (`computeFacetCounts`, `FacetCountMap`, `FacetConfig`, `FacetSelection`) — exclude-self facet counting for filter badges + matchTotal.
- `show-error-toast.ts` / `show-success-toast.ts` — toast internals consumed by `useToasts`.

Fallback rule: if one of these files is missing (partial copy, template adopted before it existed), **recreate it at the stated path** following the contract in the section that uses it — never inline the pattern per-feature; that's how five slightly-different pagination footers happen.

## Rules (MUST follow)

### Theme Colors (CSS variables, not Tailwind palette)
- ALL colors come from the design tokens defined in `app/globals.css` (the `:root` block, its `.dark` override, and the `@theme inline` alias block). Use the corresponding Tailwind utilities only — `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `bg-destructive`, `text-destructive`, `bg-warning`, `text-warning-foreground`, `bg-success`, `text-success-foreground`, etc.
- For tinted callout surfaces (alert cards, info banners), use the `*-soft` triplet: `bg-{role}-soft`, `text-{role}-soft-foreground`, `border-{role}-soft-border`. Available roles: `destructive`, `warning`, `success`. Each pair has a matching dark-mode definition so it adapts automatically.
- NEVER hardcode Tailwind palette classes (`bg-rose-50`, `text-amber-700`, `border-emerald-200`, `bg-slate-50`, `bg-white`, `hover:bg-amber-100`, etc.). They bypass the theme, break dark mode, and drift across components.
- If a needed semantic role doesn't exist (e.g. `info`), ADD a new variable to `app/globals.css` (both `:root` and `.dark`) AND its `--color-*` alias inside `@theme inline`, then use the new utility everywhere — don't reach for the raw palette as a workaround.
- Pure white surfaces (e.g. card-on-tinted-background) → `bg-card` (not `bg-white`). Subtle hover background → `hover:bg-muted` (not `hover:bg-slate-200`). Strong accents → `text-primary` / `bg-primary` (not `bg-blue-600`).
- Opacity modifiers ARE allowed on themed colors: `text-warning-soft-foreground/70`, `bg-destructive-soft/50` etc. — they preserve the theme.

### Table Component
- NEVER use AG Grid (`ag-grid-react`, `ag-grid-community`) for data tables
- NEVER use TanStack React Table (`@tanstack/react-table`) for data tables
- ALWAYS use plain shadcn Table components with `.map()` over data — this is the project standard
- Import from `@/components/ui`: `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- Handle sorting, filtering, and pagination with React state (useState/useMemo)

### Table Pattern
```typescript
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui";

// Render with simple .map()
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Scrollable Table Layout

**Apply to**: **every** dashboard list/data table. No opt-out: sticky header, sticky pagination, sticky horizontal scrollbar, and sticky identifier + Actions columns are **mandatory** on all data tables. Only nested tables inside drawers / dialogs whose host container already owns the overflow are exempt.

**Outcome**: table scrolls *internally* inside a viewport-height container, `TableHeader` sticks to the top, the identifier column (left) and actions column (right) stay pinned during horizontal scroll, a 14px proxy scrollbar sits just above the pagination, and pagination is pinned to the bottom of the viewport (no `position: sticky` — the flex-col layout does it). Search + filters + sort + page + size are mirrored into the URL so refresh restores the view.

**Faceted filter popover (mandatory)** — see the dedicated section below: any table that filters an entity column on multiple facets (department, status, category, role, ...) MUST use the shared faceted-filter popover — do not hand-roll individual filter dropdowns.

**Entity picker (mandatory)** — see the dedicated section below: whenever a list with search + faceted filter + status toggle must be rendered for *selecting one record*, use the shared `EntityPickerCommand` / `EntityPickerPopover` — do not hand-roll a `<Command>` + `CommandInput` + filter-popover + card block.

**Critical shadcn Table gotcha — wrapper dissolution**: the `<Table>` primitive wraps `<table>` in a `<div data-slot="table-container" className="... overflow-x-auto">`. That nested overflow context becomes the sticky-positioning ancestor and silently breaks `sticky left-0` / `sticky right-0` on cells (the sticky columns ride along with the content instead of pinning). The scroll container's className **must** include `[&_[data-slot=table-container]]:contents` to dissolve that wrapper via `display: contents`, so:
- the table's natural width flows up through `tableContentRef` (`min-w-max`) so horizontal overflow still exists,
- sticky cells attach directly to `scrollContainerRef` and pin correctly.
`overflow-visible` is **not** a substitute — per CSS spec it still affects intrinsic sizing and collapses the table's width.

**Required refs** (`HTMLDivElement`): `rootRef`, `scrollContainerRef`, `tableContentRef`, `tableProxyScrollRef`.
**Required hook**: `useTableScrollSync` from `@/hooks/use-table-scroll-sync` (returns `{ proxyWidth, hasOverflow }`). Per-feature URL-synced state still lives in the component: `searchTerm` + `useDebounce` → `debouncedSearch`, `currentPage`, `pageSize`, `sortField`, `sortDirection`.

**Viewport height** — `useLayoutEffect` sizes the root to the space between its top and the viewport bottom:

```ts
useLayoutEffect(() => {
  const compute = () => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const availablePx = window.innerHeight - rect.top;
    el.style.height = `${availablePx}px`;
  };
  compute();
  window.addEventListener("resize", compute);
  return () => window.removeEventListener("resize", compute);
}, []);
```
> If your `globals.css` applies a body zoom (e.g. `body { zoom: 0.8 }` at some breakpoint), divide `availablePx` by the current zoom factor — otherwise the container overshoots by the inverse of the zoom.

**Bidirectional scroll sync + overflow detection** — use the shared `useTableScrollSync` hook. It owns the bidirectional `scrollLeft` listeners, the `ResizeObserver` setup, the guarded-flag feedback-loop prevention, and the `{ proxyWidth, hasOverflow }` state. Pass the data slice that drives the rendered rows in the deps array so row-count changes trigger a re-measure. **Do not inline this effect — it must go through the hook.**

```ts
import { useTableScrollSync } from "@/hooks/use-table-scroll-sync";

const { proxyWidth, hasOverflow } = useTableScrollSync(
  scrollContainerRef,
  tableContentRef,
  tableProxyScrollRef,
  [paginatedData /* or equivalent rendered slice */]
);
```

If you need custom behavior beyond what the hook provides, prefer extending the hook over re-inlining the pattern.

**URL sync** — written as a separate effect. Rules (violating any of these produces an infinite loop or wipes params on refresh):
- **`searchParams` must NOT be in the deps array.** `router.replace` produces a new `searchParams` reference and the effect would loop.
- Read `window.location.search` fresh inside the effect to preserve params owned by parents/siblings.
- Guard the first render with `useRef(true)` so a mount doesn't wipe URL state provided by a refresh.
- Early-return when `qs === currentQs` to avoid redundant `router.replace` calls.
- Use `router.replace(\`${pathname}?${qs}\`, { scroll: false })` — explicit pathname from `usePathname()`, not a relative `?...`.
- State initializers read from `searchParams` lazily (`useState(() => ...)`) so refresh restores the view.

```ts
const isFirstUrlSync = useRef(true);
useEffect(() => {
  if (isFirstUrlSync.current) {
    isFirstUrlSync.current = false;
    return;
  }
  const params = new URLSearchParams(window.location.search);
  // set/delete each owned param; delete when at default
  const qs = params.toString();
  const currentQs = window.location.search.replace(/^\?/, "");
  if (qs === currentQs) return;
  router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
}, [router, pathname, /* debouncedSearch, sortField, sortDirection, currentPage, pageSize, ... */]);
```

**JSX skeleton** — the canonical classNames are load-bearing; do not rename or relax them:

```tsx
<div ref={rootRef} className="flex flex-col gap-3">
  {/* header row (optional), filters row */}

  {isLoading ? (
    <TableSkeleton rows={8} columns={N} />
  ) : isError ? (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
      <p>{t("loadError")}</p>
      <Button variant="outline" onClick={() => query.refetch()}>{t("retry")}</Button>
    </div>
  ) : (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-md border [&_[data-slot=table-container]]:contents">
        <div ref={tableContentRef} className="min-w-max">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-20">
              <TableRow>
                <TableHead className="bg-background sticky left-0 z-30 shadow-[1px_0_0_0_var(--border)]">
                  {/* identifier column */}
                </TableHead>
                {/* middle columns */}
                <TableHead className="bg-background sticky right-0 z-30 shadow-[-1px_0_0_0_var(--border)]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-muted/50 cursor-pointer" onClick={...}>
                  <TableCell className="bg-background group-hover:bg-muted/50 sticky left-0 z-10 shadow-[1px_0_0_0_var(--border)]">
                    {/* identifier cell */}
                  </TableCell>
                  {/* middle cells */}
                  <TableCell className="bg-background group-hover:bg-muted/50 sticky right-0 z-10 shadow-[-1px_0_0_0_var(--border)]">
                    {/* action buttons */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div
        ref={tableProxyScrollRef}
        aria-hidden
        className={`bg-background z-20 overflow-x-auto ${
          hasOverflow ? "" : "pointer-events-none opacity-0"
        }`}
        style={{ height: 14 }}>
        <div style={{ width: proxyWidth, height: 1 }} />
      </div>

      <div className="bg-background mt-2 rounded-md border px-4 py-2">
        {/* PaginationFooter from components/ui/custom/PaginationFooter.tsx — page Select + First/Prev/Next/Last IconTooltipButton + rows-per-page Select */}
      </div>
    </div>
  )}
</div>
```

**Z-index scheme** — header `z-20`, sticky header cells `z-30` (above the rest of the header), sticky body cells `z-10` (above non-sticky body cells, below the sticky header). Do not change without touching all three.

**Skip sticky-left** when the identifier column is short and the table is unlikely to overflow — rendering a sticky shadow on a visually unscrollable table is noise. Sticky-right (Actions) is always correct.

**Skip data-qa on tables unless the audit rule applies.** The interactive-element spec still governs buttons inside cells (search input, pagination buttons, row actions).

**Pagination page-size options (mandatory)** — every dashboard table's "Rows per page" dropdown MUST expose exactly `[100, 300, 500, 1000, 3000, 5000]` with `100` as the default. Import `PAGE_SIZE_OPTIONS` and `DEFAULT_PAGE_SIZE` from `components/ui/custom/PaginationFooter.tsx` — do **not** redeclare local copies, even for "small" or domain-specific tables. URL-synced `?size=` values must be validated against `PAGE_SIZE_OPTIONS` and fall back to `DEFAULT_PAGE_SIZE` when the param is missing or invalid.

```tsx
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/components/ui/custom/PaginationFooter";

const [pageSize, setPageSize] = useState<number>(() => {
  const n = Number(searchParams.get("size"));
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_PAGE_SIZE;
});
```

### Faceted filter popover

Any table filtering an entity column on multiple facets (status, category, role, team, ...) MUST use the shared `FacetedFilterPopover` from `components/ui/custom/FacetedFilterPopover.tsx` — do not hand-roll per-table dropdown blocks.

Shape: it takes `sections` — an array of `FilterSection` `{ key, label, items, selectedIds, onChange }` — one section per facet. `FilterItem` ids are `number` (coerce string ids at the caller). The caller owns the data (item lists, selected ids) and the change handler; the component owns the popover UI (Sheet + Tabs on mobile), checkboxes, per-section search, and count badges.

```tsx
<FacetedFilterPopover
  sections={[
    { key: "status", label: t("filters.status"), items: statusOptions, selectedIds: selectedStatus, onChange: setSelectedStatus },
    { key: "role", label: t("filters.role"), items: roleOptions, selectedIds: selectedRoles, onChange: setSelectedRoles },
  ]}
/>
```

For live counts next to each filter item plus a "{count} records match" badge, compute a `FacetCountMap` with `computeFacetCounts` from `@/lib/compute-facet-counts` and pass it via the `facetCounts` prop (bucket keys must equal section keys):

```tsx
const facetCounts = useMemo(
  () =>
    computeFacetCounts(users, { role: selectedRoles, status: selectedStatus }, {
      facets: { role: (u) => u.roleId, status: (u) => u.statusId },
      include: (u) => u.isActive,
    }),
  [users, selectedRoles, selectedStatus],
);

<FacetedFilterPopover sections={sections} facetCounts={facetCounts} />
```

### Entity picker

"Searchable list + faceted filter + an active/inactive (or similar status) toggle, used to select **one** record" is ALWAYS the shared `EntityPickerCommand` (inline) / `EntityPickerPopover` (anchored) from `components/ui/custom/` — never a hand-rolled `<Command>` + `CommandInput` + filter-popover + card block.

The shared component owns the layout (search on its own full-width row, filters + status toggle on a second row, scrollable card list) so the search input never gets crushed. All data, filtering, selection state, and side-effects stay in the caller and are passed via props: `items`, `getId`, `getValue`, `toCard`, `onSelect`, `searchPlaceholder`, `emptyText`, `filterSections`, `facetCounts`, `matchTotal`, `status`, `onStatusChange`, `filterQaPrefix`, `selectedId`, `showCheckmark`, `maxListHeight`, `inline`; the popover variant additionally takes `trigger`, `open`, `onOpenChange`, `popoverWidthClass`, `align`, `side`, `avoidCollisions`.

**Radix gotcha**: the popover `trigger` must stay visible (never `hidden`) so Radix anchors the content correctly — switch the trigger's *label* (e.g. "Select user" → the selected user's name), never its visibility, once a record is selected.

Both variants are exported from `components/ui/custom/EntityPickerCommand.tsx`. Rows render via `EntityCard`; `toCard` maps your record to `EntityCardData` (title, subtitle, code, description, imageUrl, badges, active) — the default is an identity cast, so pass `toCard` unless your rows already have that shape. The default search haystack derives from `toCard` output (title + code + description); pass `getValue` to customize.

### Pagination (mandatory shape)

Every dashboard list/data table MUST render its pagination through the shared `PaginationFooter` component from `components/ui/custom/`. The footer's interior shape is fixed:

1. **Current page selector = searchable Select dropdown** (Popover + Command). Lists every page; user types to filter and clicks a page to jump.
   - **NEVER** use `<Input type="number">` to jump to a page.
   - **NEVER** use a row of clickable page-number `<Button>`s.
   - **NEVER** render plain "Page X of Y" text without an interactive jump control.

2. **Four navigation buttons** = `IconTooltipButton`, icon-only, tooltip-labelled, in this order: **First → Previous → Next → Last**.
   - Icons (from `lucide-react`): `ChevronsLeft`, `ChevronLeft`, `ChevronRight`, `ChevronsRight`.
   - Tooltips: `"First page"`, `"Previous"`, `"Next"`, `"Last page"` — translate via `next-intl` namespace `Tables.pagination.{first,prev,next,last}`.
   - `aria-label` matches the tooltip string.
   - **Disabled boundaries**: First + Previous disabled when `currentPage <= 1`; Next + Last disabled when `currentPage >= totalPages`.
   - Plain `<Button>` with an icon is **not** a substitute — `IconTooltipButton` is mandatory so every nav control ships with an accessible tooltip.

3. **Page-size dropdown** — shadcn `Select` driven by `PAGE_SIZE_OPTIONS` / `DEFAULT_PAGE_SIZE` (rule above). Changing page size MUST reset `currentPage` to 1.

**Canonical implementation (do not re-create — import & reuse)**:
```tsx
import { PaginationFooter } from "@/components/ui/custom/PaginationFooter";

<PaginationFooter
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  filteredCount={filteredCount}
  unfilteredCount={data.length}
  startIndex={(currentPage - 1) * pageSize}
  endIndex={Math.min(filteredCount, currentPage * pageSize)}
  hasActiveFilter={hasActiveFilter}
  rowLabel="project"
  onPageChange={setCurrentPage}
  onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
/>
```

Need pagination outside a table? Still use `PaginationFooter` — do **not** hand-roll a parallel layout.

**Red flags to reject in review**:
- New pagination block with `<Input type="number">` for page jump.
- Plain `<Button>` (or `<Button size="icon">` directly) used for First/Prev/Next/Last instead of `IconTooltipButton`.
- Missing First or Last button (Prev/Next-only is forbidden on dashboard tables).
- Row of clickable page-number `<Button>`s with ellipsis (the previous pattern — replaced by the searchable Select).
- Local re-implementation of First/Prev/Next/Last + page jump instead of importing `PaginationFooter`.
- `IconTooltipButton` used without `aria-label`, or without `disabled` boundary toggling.

**Row-selection counter (mandatory for tables with a row-select checkbox column)** — any table whose rows carry a selection `<Checkbox>` used to drive bulk actions MUST render a `TableSelectionCounter` on the **left side of the pagination footer**, opposite the rows-per-page / prev-next controls. Copy is fixed at `N selected`; the primitive handles muted-vs-active styling based on whether `count > 0`. Pass the count as `selectedIds.size` (Set) or `selected.length` (array) — the primitive does not own state. Render it unconditionally so the footer layout does not shift as selection toggles.

This rule does NOT apply to filter-popover checkboxes, permission-matrix toggles, or form-field checkboxes — only to row-selection checkboxes used for bulk operations. Bulk-action buttons (`Approve Selected`, `Reject Selected`, `Clear Selection`) remain where each feature places them; the counter is a display indicator, not a replacement.

```tsx
// inside the sticky pagination footer
<div className="bg-background mt-2 flex items-center justify-between rounded-md border px-4 py-2">
  <TableSelectionCounter
    count={selectedIds.size}
    data-qa="projects.project-list.selection-count"
  />
  <div className="flex items-center gap-2">
    {/* PaginationFooter — page Select + First/Prev/Next/Last IconTooltipButton + rows-per-page Select */}
  </div>
</div>
```

### Client Components
- All interactive components use `"use client"` directive
- Use `useAuthStore` for token / role flags (e.g. `isAdmin`) inside client components (not server props)

### Loading States & Skeletons

**Error state — MANDATORY for every `useQuery` call that drives a list, table, or page section.**
A 500 or network error can return a non-array `results` that bypasses `?? []`, causing `list.filter is not a function` during render which propagates to the React error boundary and shows a generic error screen to the user.

**Rules:**
- Every `useQuery` that feeds a list/table MUST handle `isError` with an inline error UI + retry button — **never** let it reach the React error boundary.
- Derive the data array with `Array.isArray` guard (not `?? []` alone): wrap in `useMemo` to avoid new-array-ref on every render.
- Add `retry: 1` to the query options to avoid hammering on transient failures.

**Required pattern:**
```ts
// ✅ Correct — guards against non-array results and is stable across renders
const items = useMemo(() => {
  const raw = query.data?.results;
  return Array.isArray(raw) ? raw : [];
}, [query.data]);
```

```tsx
// ✅ Correct — three-branch render: loading → error → data
{query.isLoading ? (
  <TableSkeleton />
) : query.isError ? (
  <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
    <p>{t("loadError")}</p>
    <Button variant="outline" onClick={() => query.refetch()}>
      {t("retry")}
    </Button>
  </div>
) : (
  /* table / content */
)}
```

```ts
// ✅ Correct — query options
useQuery({
  queryKey: [...],
  queryFn: ...,
  enabled: !!token,
  retry: 1,
});
```

**Anti-patterns to reject in review:**
- `const items = query.data?.results ?? []` — if `results` is `{}` or `null`, this passes through and `.filter()` throws.
- `isLoading ? <skeleton> : <table>` with no `isError` branch — 500 response crashes to error boundary.
- `const items = Array.isArray(raw) ? raw : []` declared inline (not in `useMemo`) — creates new array ref on every render, breaks `useLayoutEffect`/`useEffect` deps.

**i18n keys** — add `loadError` and `retry` to the feature's namespace in `messages/en.json`, and to every other `messages/<locale>.json`.

- NEVER show a centered `<Loader2>` spinner as a page or section's loading state. Spinners are only acceptable inside small affordances (e.g. button-pending icons during a mutation)
- NEVER early-return a full-page skeleton that hides the page chrome. The user should see the layout immediately and only the data-dependent regions should be skeletonized
- ALWAYS use the shared skeleton primitives from `components/ui/custom/`:
  - `TableSkeleton` (`rows`, `columns`, `showHeader`, `cellHeight`) for tables
  - `CardSkeleton`, `DetailSkeleton`, `FormSkeleton`, `PageSkeleton` for other shapes
  - For one-off content shapes (titles, badges, code lines), use inline `<div className="bg-muted h-X w-Y animate-pulse rounded" />` placeholders that match the eventual element's footprint
- Skeletons MUST mirror the eventual layout. If the table has 8 columns, pass `columns={8}`. If the hero has a title + 2 badges, render a wide bar + 2 pill placeholders — not a generic block
- Partial loading over full loading. Render the page chrome (header, tabs, back buttons, navigation) unconditionally and conditionally swap data-dependent regions for skeletons. Tab panels should each manage their own loading state so the tablist stays interactive
- Persisted Zustand stores that rehydrate asynchronously (e.g. from IndexedDB) — track hydration via `store.persist.hasHydrated()` + `store.persist.onFinishHydration()` and show a skeleton until hydration completes — otherwise the user sees a flash of "no data" before the async read resolves

### Dynamic Imports for Heavy Dialog/Drawer Bodies

**Rule**: lazy-load the **body** of any dialog/drawer/modal whose source file is roughly ≥300 LOC or pulls in heavy deps (React Hook Form + Zod, wizards, multi-tab forms, data grids). Users who never open the drawer should not pay the download cost on page load.

**Pattern** — use `next/dynamic` with `ssr: false` **and** gate the render on the open flag so the chunk is not fetched until first open:
```tsx
"use client";
import dynamic from "next/dynamic";

// Named export — unwrap with `.then((m) => m.X)`
const BillingSettingsDrawer = dynamic(
  () => import("./BillingSettingsDrawer").then((m) => m.BillingSettingsDrawer),
  { ssr: false }
);

// Default export — bare import
const InvoiceTemplateDrawer = dynamic(() => import("./InvoiceTemplateDrawer"), {
  ssr: false,
});

// Gate render on the open flag. If `open` is a non-null "mode" (e.g. "create" | "edit" | null),
// `{mode && <Drawer mode={mode} .../>}` works too.
{drawerMode && (
  <BillingSettingsDrawer
    mode={drawerMode}
    onClose={() => setDrawerMode(null)}
    ...
  />
)}
```

**Fallback UI**: for drawers, omit `loading` and let the click-to-render delay be near-invisible. For full tab/section contents, wrap the lazy mount in `<Suspense fallback={<Spinner />}>` or `<Suspense fallback={<FormSkeleton />}>` — pick the skeleton that matches the eventual layout.

**Do NOT lazy-load:**
- Small dialogs/modals (<100 LOC) such as a confirm modal or an image lightbox — the dynamic-import overhead outweighs the saved bytes
- Components mounted in a universal layout (e.g. a change-password drawer in the header shell) — every authenticated page needs them anyway
- Inline `AlertDialog` blocks used for delete confirmations — bodies are 10–20 lines of JSX
- Radix primitives themselves (`Dialog`, `Sheet`, `AlertDialog`) — they are small and shared across the bundle

**Gotchas:**
- If the drawer exposes an imperative handle via `forwardRef`, `next/dynamic` does not forward refs by default. Either refactor to drop the ref or keep the drawer always mounted (`<LazyDrawer open={open} />`) — the chunk still defers until `open=true` if declared outside render.
- `{open && <X />}` unmounts on close. If the body holds in-flight form state that must survive close/reopen, hoist the state to the parent or keep the drawer always mounted.
- Keep the lazy declaration (`const X = dynamic(...)`) at module scope, **not** inside the component body — re-declaring per render recreates the chunk loader on every render.

**Verification per change:**
- `pnpm tsc --noEmit` (or `npx tsc --noEmit`)
- `ANALYZE=true pnpm build` — confirm a separately-named chunk (e.g. `BillingSettingsDrawer-<hash>.js`) is emitted
- Dev open: Network tab shows the chunk on first open of the drawer, not on page load; second open is instant (cached)

### Tab UI Pattern (URL-synced)

**Primitive**: shadcn `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui`.

**TabsList layout**: always `grid w-full grid-cols-N` where N = number of triggers. Never use the default inline flex.

**TabsTrigger**: always `flex items-center gap-2` with a lucide-react icon + text label.

**URL sync**: persist active tab as `?tab=<value>` using `useSearchParams()` for initial read and `window.history.replaceState()` for writes — never `router.replace()` (async; lazy-loaded children see stale searchParams on mount).

**Base URL construction**: always use `new URLSearchParams(window.location.search)` as the base (not `new URLSearchParams(Array.from(searchParams.entries()))`), so concurrent replaceState writes (tab + record id + filters) don't overwrite each other.

**Unsaved-changes guard**: if leaving a form-tab with dirty state, gate the transition via `AlertDialog` + `pendingTab` state before calling `commitTabChange(value)`.

**Heavy tab content**: lazy-load bodies ≥300 LOC via `next/dynamic` with `ssr: false`, gated on the tab value (see Dynamic Imports section above).

**data-qa on TabsTrigger**: `data-qa="<area>.<feature>.tab-<value>"` per the Interactive Element Convention below.

```tsx
// Pattern
<Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="summary" className="flex items-center gap-2"
      data-qa="billing.invoice-detail.tab-summary">
      <ListChecks className="size-4" /> Summary
    </TabsTrigger>
    <TabsTrigger value="reports" className="flex items-center gap-2"
      data-qa="billing.invoice-detail.tab-reports">
      <FileDown className="size-4" /> Reports
    </TabsTrigger>
  </TabsList>
  <TabsContent value="summary" className="space-y-6">…</TabsContent>
  <TabsContent value="reports" className="space-y-6">…</TabsContent>
</Tabs>

// URL sync helper
const [currentTab, setCurrentTabState] = useState(() => searchParams.get("tab") ?? "summary");
const setCurrentTab = (value: string) => {
  setCurrentTabState(value);
  const params = new URLSearchParams(window.location.search);
  params.set("tab", value);
  window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
};
```

### API Parameters
- All request parameters: **camelCase** (matching backend convention)
- ALL HTTP calls go through the `services/api.ts` wrapper (e.g. `getAPIResponse`) — never raw `fetch`/`axios` in components
- Query keys only from `QUERY_KEYS` (`config/query.config.ts`) — never inline string arrays
- Routes only from `LINKS` (`config/router.config.ts`) — never hand-written path strings

### Interactive Element Convention (IDs, ARIA, QA hooks, Tests)

> Applies to every `<button>`, `<a>`, form input, `Dialog`/`Sheet`/`Drawer` trigger, `Tabs` trigger, and clickable row.

**1. `data-qa` is required on every interactive element.**
Format: `data-qa="<area>.<feature>.<element>[.<variant>]"` — lowercase, dot-separated, kebab-case segments. Stable across renders; **never** derived from array index alone. Disambiguate list items with a record id suffix: `projects.project-list.row.${project.id}`.
Examples: `auth.login.submit`, `settings.billing.export-button`.

**2. HTML `id` is generated, never hand-written.**
- **Inside `<Form>`** (react-hook-form): `FormItem` + `FormControl` already wire `React.useId()` → `htmlFor` → `id` → `aria-describedby` → `aria-invalid`. **Never pass `id=` into a form child.**
- **Outside `<Form>`**: use the `useQaId` helper from `@/hooks/use-qa-id`:
  ```tsx
  import { useQaId } from "@/hooks/use-qa-id";
  const phone = useQaId("settings.contact-form.phone");
  <Label htmlFor={phone.id}>Phone</Label>
  <Input {...phone} />
  ```
- String-literal `id="..."` JSX props are **forbidden** (lint-enforced). The only exception is URL anchor targets (e.g. `id="section-overview"`).

**3. W3C / WCAG baseline.**
- Every input has a programmatic label: visible `<FormLabel>`/`<Label htmlFor>` OR `aria-label` / `aria-labelledby`.
- Icon-only buttons **must** have `aria-label` (lint-enforced via `jsx-a11y/control-has-associated-label`).
- `<button>` always has an explicit `type` — the `Button` primitive defaults to `type="button"` to prevent accidental form submission. Use `type="submit"` only inside a `<form>` that should submit.
- Dialogs always have a `DialogTitle` (use `VisuallyHidden` if visually suppressed).
- Navigation uses `<Link>`/`<a>`, not `<button onClick={router.push}>`.
- Form errors are announced via `aria-invalid` + `aria-describedby` — already wired in `FormControl`.

**4. Unit tests are mandatory.**
Any new or modified interactive element ships with a unit test (Jest + React Testing Library + `jest-axe`) that:
1. Renders the element.
2. Asserts the `data-qa` attribute.
3. Asserts label ↔ control association via `getByLabelText` or `getByRole({ name })`.
4. Passes `expect(await axe(container)).toHaveNoViolations()`.

Co-locate tests as `*.test.tsx` next to the component. Run with `pnpm test`.

**Test infrastructure** lives at `@/test-utils`:
- `customRender(ui)` wraps with `QueryClientProvider` — import from `@/test-utils`, never from `@testing-library/react` directly.
- Fixtures: `userFixture`, `makeUser(overrides)` — extend with project-specific factories the same way.
- MSW server, if scaffolded, lives alongside (`@/test-utils/msw`) — wire in per-suite as needed.
- Jest config: `jest.config.js` (`next/jest` preset), `jest.setup.js` (jest-dom + jest-axe), `jest.polyfills.js` (undici + streams for Node→jsdom globals).

**Gotcha**: if `@/components/ui` re-exports through a barrel that transitively imports ESM-only packages (Radix, framer-motion, react-resizable-panels), and a test imports from that barrel, **mock the module** to only return the primitives the component under test touches:
```ts
jest.mock("@/components/ui", () => {
  const React = jest.requireActual("react");
  return {
    Label: (p) => React.createElement("label", p),
  };
});
```
Prefer mocking `@/hooks/use-qa-id` directly in the same style when a test only needs the id-generation behavior. The primitive behavior itself is covered by the component library's own tests.

**5. Single-select dropdowns — always use `CustomSelect`.**
Always use `CustomSelect` from `components/ui/custom/` (Popover + Command pattern with search). Never use `<Select>/<SelectTrigger>/<SelectContent>/<SelectItem>` for single-select form inputs. Ensure `options[].value` is always a `string` — coerce numbers with `String(id)`. `onValueChange` receives `Option | null`.

**6. Red flags to reject in review.**
- Hardcoded `id="..."` on an input or button.
- Icon-only button with no `aria-label`.
- `<button>` missing `type`.
- Input without a label (visible or aria).
- New interactive element with no `data-qa`.
- New interactive element with no test.

### Internationalization (Required)

> Per-component migration recipe: [`i18n-playbook.md`](./i18n-playbook.md).

**Locales:** `en` (source + default) and `bn` (Bengali) — `messages/en.json` / `messages/bn.json`. Every rule below that says "every other `messages/<locale>.json`" means `bn.json` (plus any locale added later).

**Hard rule.** ALL user-visible text MUST be translated via `next-intl`. NO hardcoded English in:
- JSX text nodes (`<h1>Dashboard</h1>` → `<h1>{t("title")}</h1>`)
- JSX attributes — `placeholder`, `title`, `label`, `aria-label`, `alt`, `tooltip`, `description`, `confirmLabel`, `cancelLabel`, `emptyMessage`
- `toast.success("...")` / `toast.error("...")` / `toast.info("...")` / `toast.warning("...")` / `toast("...")`
- Zod schema messages — `z.string().min(1, "Required")`, `{ required_error: "..." }`, `{ message: "..." }` inside `.refine()`

The convention is enforced by ESLint (`i18next/no-literal-string`) and, if the project defines an `i18n:check` script, by CI. Whether or not that gate exists, the rule is still binding — code review will reject hardcoded strings.

**1. Hooks.**

```ts
// Client component
import { useTranslations } from "next-intl";
const t = useTranslations("Billing.Invoices");
<Button>{t("actions.create")}</Button>

// Server component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("Billing.Invoices");
return <h1>{t("page.title")}</h1>;
```

**2. Namespace convention.**

- Feature-scoped: `<Feature>` — e.g. `Invoices`, `Projects`, `UserProfiles` — or `<Area>.<Feature>` in large apps with multiple areas, e.g. `Billing.Invoices`. Reuse if the file already belongs to one (check `messages/en.json` first).
- Shared (reserved — single source of truth across the app):
  - `Common` — `actions.{save,cancel,delete,edit,create,close,confirm,back,next,search,filter,clear,export,import}`, `states.{loading,empty,error}`, `labels.{yes,no,all,none,language}`
  - `Validation` — `required`, `minLength`, `maxLength`, `email`, `url`, `phone`, `number.{min,max,integer}`, `date.{required,future,past}`, `passwordMismatch`
  - `Toasts` — `success.{create,update,delete,save,upload,send,copy}`, `error.{create,update,delete,generic,network}`, `loading.{saving,deleting,uploading}` (ICU `{entity}` placeholder)
  - `Tables` — `actions.{view,edit,delete,duplicate}`, `pagination.{prev,next,page,of,rowsPerPage}`, `empty`, `noResults`
  - `Errors` — `server`, `unexpected`, `validation`, `fetch`, `tryAgain`, `actionFailed`, `network`, `unauthorized`, `notFound`, `byCode.<HTTP_CODE>`
- Sub-key shape: `page.title`, `page.description`, `form.*`, `actions.*`, `column.*`, `modal.*`, `empty.*`, `toast.*`, `validation.*`.

**3. Toasts — use the `useToasts()` helper.** NEVER call `toast.success("...")` / `toast.error("...")` directly.

```ts
import { useToasts } from "@/hooks/use-toasts";
const toasts = useToasts();
toasts.success("create", { entity: t("invoice") });   // → Toasts.success.create with {entity}
toasts.error("network");                              // → Errors.network
toasts.success("delete", { entity: t("invoice") }, { title: t("custom.title") });  // override
```

**4. Zod schemas — use `useLocalizedSchema` factory.** NEVER inline English in `.min()` / `.max()` / `.email()` / `.refine()` messages or `required_error` / `invalid_type_error`.

```ts
import { useLocalizedSchema } from "@/hooks/use-localized-schema";
const useInvoiceSchema = () =>
  useLocalizedSchema((t) => z.object({
    title: z.string().min(1, t("required")).max(50, t("maxLength", { max: 50 })),
    email: z.string().email(t("email")),
    amount: z.number().int(t("number.integer")).min(0, t("number.min", { min: 0 }))
  }));
```

**5. Shared components in `components/ui/custom/`.** MAY call `useTranslations("Common")` or `useTranslations("Tables")` for guaranteed-shared text. Feature-specific text (dialog title, empty-state copy) MUST be a required prop — caller translates and passes in.

```tsx
// ConfirmDialog — caller-translated for feature copy, defaults for confirm/cancel
<ConfirmDialog
  title={t("deleteInvoiceTitle")}              // app-supplied (required)
  description={t("deleteInvoiceBody")}         // app-supplied (required)
  // confirmLabel / cancelLabel default to Common.actions.{confirm,cancel}; override via prop
/>

// EmptyState
<EmptyState title={t("noInvoices")} />       // app-supplied
```

**6. Locale parity.** After adding any new English string:

1. Append the key to `messages/en.json` under the chosen namespace (sorted alphabetically inside its sub-tree).
2. Add a `__TODO__: <english>` placeholder at the same key path in every other `messages/<locale>.json`. If the project defines an `i18n:check` script, CI blocks PRs with parity gaps — run it locally before opening one.

**7. ICU MessageFormat for plurals / interpolation.**

```json
{
  "items": "{count, plural, =0 {No items} one {# item} other {# items}}",
  "greeting": "Welcome, {name}"
}
```

**8. Red flags to reject in review.**
- JSX text or attribute string literal containing English words (other than `data-qa`, `data-testid`, `id`, `key`, `className`, `type`, `name`, `href`, `src`).
- `toast.success("...")` / `toast.error("...")` with a string literal first arg.
- Zod `.min(1, "Required")` / `.email("Invalid")` / `.refine(..., "...")` with a string literal message.
- New key added to `messages/en.json` without parallel entries in every other `messages/<locale>.json`.
- Shared component in `components/ui/custom/` hardcoding feature-specific text (dialog title, empty-state copy) instead of accepting it as a prop.
- `useTranslations("...")` imported but never called (dead import).
- Namespace that doesn't follow `<Feature>` / `<Area>.<Feature>` (feature-scoped) or one of the reserved shared names (`Common`, `Validation`, `Toasts`, `Tables`, `Errors`).
