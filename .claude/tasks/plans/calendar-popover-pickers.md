# Calendar Popover Pickers Plan

## Goal

Extend `components/ui/calendar.tsx` with reusable, controlled single-date and date-range picker fields. Both fields render a selected-value trigger and mount their editable calendar inside a popover. Update `/component-demo` to demonstrate both modes instead of rendering the calendar grid inline.

## Architecture

- Preserve the existing `Calendar` and `CalendarDayButton` exports as the low-level styled `react-day-picker` grid.
- Add `DatePicker` and `DateRangePicker` exports in the same module so the component inventory remains unchanged.
- Keep both picker APIs controlled through `selected` and `onSelect`.
- Accept translated labels as structured props; the shared component must not depend on a feature namespace.
- Continue forwarding supported DayPicker options to the inner grid through an explicit `calendarProps` object.
- Give the popover trigger, text inputs, and errors generated IDs, accessible labels, and stable hooks derived from a required `qaPrefix`.

## Behavior

- Single picker: one `dd/MM/yyyy` input; selecting or committing a valid date updates the trigger and closes the popover.
- Range picker: start and end `dd/MM/yyyy` inputs; the popover stays open after the start and closes when a complete range is selected from the grid.
- Trigger text uses locale-aware display formatting; input editing remains explicitly day-first.
- Text entry accepts day-first slash/dash/compact forms plus ISO `yyyy-MM-dd`, normalizes valid values, and navigates the grid to the committed month.
- Invalid, out-of-bounds, disabled, or chronologically reversed values do not mutate selection and expose associated error copy.
- Changing the start beyond an existing end clears the end; an end before the start is rejected.
- Empty input clears the corresponding optional selection.
- External controlled-value changes resynchronize input drafts when the user is not actively editing.
- Guard blur commits so clicking a calendar day is not swallowed before DayPicker receives the click.
- Range mode renders one month on mobile and two months at larger widths.

## Component demo

- Replace the inline single calendar with two controlled picker examples in the existing Calendar frame.
- Show single and range triggers side by side where space permits.
- Add translated labels, placeholders, invalid-state copy, and stable `component-demo.calendar.*` QA hooks.

## Tests

- Closed state renders an accessible trigger but no calendar grid.
- Opening renders labeled/prefilled input fields and passes an axe smoke check.
- Single pointer and typed selection update the controlled value and trigger.
- Invalid and disabled typed dates preserve the previous value and announce an error.
- Input blur followed by a day click does not swallow the click.
- Range supports partial and completed selections, typed endpoints, reversed-range validation, and controlled resynchronization.
- Escape closes the popover and restores focus to its trigger.
- Catalog coverage remains exactly 105 component modules.

## Verification

- Prettier and ESLint on changed files
- `pnpm typecheck`
- focused calendar and component-demo Jest suites, then the full Jest suite
- `pnpm i18n:check:ci`
- `pnpm build`
- production browser smoke at mobile and desktop widths in light and dark modes
