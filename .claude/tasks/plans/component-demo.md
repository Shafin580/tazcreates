# Component Demo Plan

## Goal

Add a public App Router page at `/component-demo` that acts as a living, AI-friendly reference for every shipped component module. Each public visual module receives a working example, important variants receive representative examples, and provider/hook modules receive small behavioral harnesses.

## Architecture

- Keep `app/component-demo/page.tsx` as a Server Component for route metadata.
- Put interactive examples under `app/component-demo/_components/`.
- Use a route-local provider stack for `next-intl`, `next-themes`, `ActiveThemeProvider`, tooltips, and Sonner.
- Scope `SidebarProvider`, `LoadingProvider`, and other behavior-specific providers to the examples that consume them.
- Organize examples into focused section files and index them in a typed catalog containing the display name, category, anchor, and source path.
- Keep portal and full-screen examples closed until a user opens them.
- Show source paths beside examples so agents can move directly from usage to implementation.

## Coverage contract

Coverage is one working composition per non-test TSX module under `components/`, plus representative variants/states for public primitives. It does not require every possible prop permutation. Supporting hooks/providers are exercised through harnesses; nonvisual stores are documented but are not counted as visual modules.

### Base UI modules (55)

- accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb
- button-group, button, calendar, card, carousel, chart, checkbox, collapsible
- combobox, command, context-menu, dialog, direction, drawer, dropdown-menu
- empty, field, hover-card, input-group, input-otp, input, item, kbd, label
- menubar, native-select, navigation-menu, pagination, popover, progress
- radio-group, resizable, scroll-area, select, separator, sheet, sidebar
- skeleton, slider, sonner, spinner, switch, table, tabs, textarea
- toggle-group, toggle, tooltip

### Custom modules (19)

- ApiErrorCard, CardSkeleton, CustomDrawer, CustomSelect, DetailSkeleton
- EntityCard, EntityPickerCommand/EntityPickerPopover, FacetedFilterPopover
- FormSkeleton, IconTooltipButton, IconTooltipDropdownTrigger, PageHeader
- PageLoader, PageSkeleton, PaginationFooter, TableSelectionCounter
- TableSkeleton, CountAnimation, UserAvatar

### Global modules (20)

- BackNavigation, ConfirmModal, DashboardErrorContent, DeviceCheck
- Error500Content, ErrorText, LoadingProvider/useLoading, LoadingOverlay
- global Loader Spinner, NoDataFound, NotFoundContent, PermissionDenied
- PhoneNumberInputField, Preview, SessionExpiredModal, ThemeSwitch
- WorkInProgressCard, LiveTime, PhotoEnlarge, useUnsavedChanges

### Theme/provider modules (11)

- PresetSelector, ChartPresetSelector, ThemeScaleSelector, ThemeRadiusSelector
- FontSelector, ColorModeSelector, ContentLayoutSelector, SidebarModeSelector
- ResetThemeButton, ThemeCustomizerPanel, ActiveThemeProvider/useThemeConfig

## Accessibility and project conventions

- Use semantic design-token utilities only.
- Translate all new user-facing copy through a `ComponentDemo` namespace in both `messages/en.json` and `messages/bn.json`.
- Give every new interactive element a stable `data-qa`, accessible name, and explicit button type where applicable.
- Keep a single page-level `h1`, ordered section headings, labeled inputs, focus-visible behavior, and keyboard-operable examples.
- Avoid changing the starter homepage or adding global navigation unless separately requested.

## Known constraints

- The existing 404/500 components reference missing illustration assets and an optional site URL. Repair only the minimum needed to render them safely.
- Theme preset selectors currently write body attributes/cookies, but most presets do not have matching CSS definitions. Demonstrate and disclose current behavior rather than expanding this task into a theme-system redesign.
- `IconTooltipDropdownTrigger` currently ignores its `variant` prop. Do not silently redesign it as part of the catalog unless it blocks the example.

## Verification

- Prettier check for changed files
- `pnpm i18n:check:ci`
- targeted ESLint, then `pnpm lint`
- `pnpm typecheck`
- targeted Jest tests, then `pnpm test -- --runInBand`
- `pnpm build`
- browser smoke at mobile, tablet, and desktop widths in light and dark modes
