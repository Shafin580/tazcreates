"use client";

import * as React from "react";
import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  parse,
  startOfDay,
  startOfMonth
} from "date-fns";
import {
  dateMatchModifiers,
  DayPicker,
  getDefaultClassNames,
  rangeContainsModifiers,
  type DateRange,
  type DayButton,
  type Locale,
  type Matcher,
  type OnSelectHandler,
  type PropsBase,
  type PropsRange
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  qaPrefix?: string;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  qaPrefix,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-2 [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn("relative rounded-(--cell-radius)", defaultClassNames.dropdown_root),
        dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-s-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-e-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4 rtl:rotate-180", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4 rtl:rotate-180", className)} {...props} />
            );
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} qaPrefix={qaPrefix} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  qaPrefix,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>;
  qaPrefix?: string;
}) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-qa={
        qaPrefix
          ? `${qaPrefix}.month.${formatQaMonth(day.displayMonth)}.day.${formatQaDate(day.date)}`
          : undefined
      }
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-e-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-s-(--cell-radius) [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

type PickerCalendarProps = Omit<
  PropsBase,
  | "autoFocus"
  | "dateLib"
  | "disabled"
  | "initialFocus"
  | "mode"
  | "month"
  | "onMonthChange"
  | "required"
  | "timeZone"
> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

type PickerOpenProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type PickerBaseProps = PickerOpenProps & {
  calendarProps?: PickerCalendarProps;
  className?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  displayLocale?: string;
  popoverContentClassName?: string;
  qaPrefix: string;
  triggerClassName?: string;
};

export type DatePickerLabels = {
  date: string;
  dateFormat: string;
  invalidDate: string;
  selectDate: string;
};

export type DateRangePickerLabels = {
  dateFormat: string;
  endDate: string;
  invalidDate: string;
  invalidRange: string;
  selectRange: string;
  startDate: string;
};

export type DatePickerProps = PickerBaseProps & {
  labels: DatePickerLabels;
  onSelect: (date: Date | undefined) => void;
  selected?: Date;
};

export type DateRangePickerProps = PickerBaseProps &
  Pick<PropsRange, "excludeDisabled" | "max" | "min" | "resetOnSelect"> & {
    labels: DateRangePickerLabels;
    onSelect: (range: DateRange | undefined) => void;
    selected?: DateRange;
  };

type DateInputCommitReason = "blur" | "enter";

type DateInputCommitResult = {
  error?: string;
  normalizedValue?: string;
};

type DateInputFieldProps = {
  initialValue: string;
  label: string;
  onCommit: (value: string, reason: DateInputCommitReason) => DateInputCommitResult;
  placeholder: string;
  qa: string;
  shouldSkipBlurCommit: () => boolean;
};

const DateInputField = React.forwardRef<HTMLInputElement, DateInputFieldProps>(
  function DateInputField(
    { initialValue, label, onCommit, placeholder, qa, shouldSkipBlurCommit },
    ref
  ) {
    const inputId = React.useId();
    const errorId = React.useId();
    const [draft, setDraft] = React.useState(initialValue);
    const [error, setError] = React.useState<string>();
    const [isDirty, setIsDirty] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [syncedInitialValue, setSyncedInitialValue] = React.useState(initialValue);

    if ((!isEditing || !isDirty) && syncedInitialValue !== initialValue) {
      setDraft(initialValue);
      setError(undefined);
      setIsDirty(false);
      setSyncedInitialValue(initialValue);
    }

    const commit = (reason: DateInputCommitReason) => {
      const result = onCommit(draft, reason);
      setError(result.error);
      if (result.normalizedValue !== undefined) {
        setDraft(result.normalizedValue);
        setIsDirty(false);
      }
    };

    return (
      <div className="min-w-0 space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <Input
          ref={ref}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          data-qa={qa}
          id={inputId}
          inputMode="numeric"
          maxLength={10}
          onBlur={() => {
            setIsEditing(false);
            if (!shouldSkipBlurCommit()) commit("blur");
          }}
          onChange={(event) => {
            setError(undefined);
            setIsDirty(true);
            setDraft(processDateDraft(event.target.value));
          }}
          onFocus={() => setIsEditing(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") return;
            if (event.key !== "Enter") return;
            event.stopPropagation();
            event.preventDefault();
            commit("enter");
          }}
          placeholder={placeholder}
          type="text"
          value={draft}
        />
        {error ? (
          <p className="text-destructive text-xs" data-qa={`${qa}.error`} id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

function usePickerOpen({ defaultOpen = false, onOpenChange, open }: PickerOpenProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const resolvedOpen = open ?? internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open]
  );

  return [resolvedOpen, setOpen] as const;
}

function resolvePickerCalendarProps(calendarProps?: PickerCalendarProps) {
  const { defaultMonth, numberOfMonths, ...dayPickerProps } = calendarProps ?? {};

  return { dayPickerProps, defaultMonth, numberOfMonths };
}

function DatePicker({
  calendarProps,
  className,
  defaultOpen,
  disabled = false,
  disabledDates,
  displayLocale,
  labels,
  onOpenChange,
  onSelect,
  open,
  popoverContentClassName,
  qaPrefix,
  selected,
  triggerClassName
}: DatePickerProps) {
  const [popoverOpen, setPopoverOpen] = usePickerOpen({
    defaultOpen,
    onOpenChange,
    open
  });
  const calendarPointerDownRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { dayPickerProps, defaultMonth, numberOfMonths } =
    resolvePickerCalendarProps(calendarProps);
  const initialMonth = selected ?? defaultMonth ?? startOfDay(new Date());
  const [visibleMonth, setVisibleMonth] = React.useState(initialMonth);
  const resolvedPopoverOpen = !disabled && popoverOpen;

  const triggerText = selected ? formatDisplayDate(selected, displayLocale) : labels.selectDate;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    if (nextOpen) {
      setVisibleMonth(selected ?? defaultMonth ?? startOfDay(new Date()));
    }
    setPopoverOpen(nextOpen);
  };

  const handleCalendarSelect: OnSelectHandler<Date | undefined> = (nextDate) => {
    if (disabled) return;
    onSelect(nextDate);
    if (nextDate) {
      setVisibleMonth(nextDate);
      setPopoverOpen(false);
    }
  };

  const commitInput = (
    inputValue: string,
    reason: DateInputCommitReason
  ): DateInputCommitResult => {
    if (!inputValue.trim()) {
      if (selected) onSelect(undefined);
      if (reason === "enter") setPopoverOpen(false);
      return { normalizedValue: "" };
    }

    const parsedDate = parseDateInput(inputValue);
    if (!parsedDate || isDateUnavailable(parsedDate, disabledDates, dayPickerProps)) {
      return { error: labels.invalidDate };
    }

    if (!selected || !isSameDay(parsedDate, selected)) {
      onSelect(parsedDate);
    }
    setVisibleMonth(parsedDate);
    if (reason === "enter") setPopoverOpen(false);
    return { normalizedValue: formatEditableDate(parsedDate) };
  };

  return (
    <div className={cn("min-w-0", className)}>
      <Popover onOpenChange={handleOpenChange} open={resolvedPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={resolvedPopoverOpen}
            aria-haspopup="dialog"
            aria-label={`${labels.date}: ${triggerText}`}
            className={cn(
              "w-full justify-start overflow-hidden text-start font-normal",
              !selected && "text-muted-foreground",
              triggerClassName
            )}
            data-qa={`${qaPrefix}.trigger`}
            disabled={disabled}
            type="button"
            variant="outline">
            <CalendarIcon aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{triggerText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label={labels.selectDate}
          className={cn(
            "w-auto max-w-[calc(100vw-2rem)] overflow-x-auto p-0",
            popoverContentClassName
          )}
          data-qa={`${qaPrefix}.popover`}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onPointerDownCapture={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest('[data-slot="calendar"]')) {
              calendarPointerDownRef.current = true;
              window.setTimeout(() => {
                calendarPointerDownRef.current = false;
              }, 0);
            }
          }}
          role="dialog">
          <div className="p-3 pb-0">
            <DateInputField
              ref={inputRef}
              initialValue={selected ? formatEditableDate(selected) : ""}
              label={labels.date}
              onCommit={commitInput}
              placeholder={labels.dateFormat}
              qa={`${qaPrefix}.input`}
              shouldSkipBlurCommit={() => calendarPointerDownRef.current}
            />
          </div>
          <Calendar
            {...dayPickerProps}
            data-qa={`${qaPrefix}.grid`}
            disabled={disabledDates}
            mode="single"
            month={visibleMonth}
            numberOfMonths={numberOfMonths ?? 1}
            onMonthChange={setVisibleMonth}
            onSelect={handleCalendarSelect}
            qaPrefix={qaPrefix}
            selected={selected}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateRangePicker({
  calendarProps,
  className,
  defaultOpen,
  disabled = false,
  disabledDates,
  displayLocale,
  excludeDisabled = false,
  labels,
  max,
  min,
  onOpenChange,
  onSelect,
  open,
  popoverContentClassName,
  qaPrefix,
  resetOnSelect = true,
  selected,
  triggerClassName
}: DateRangePickerProps) {
  const isMobile = useIsMobile();
  const [popoverOpen, setPopoverOpen] = usePickerOpen({
    defaultOpen,
    onOpenChange,
    open
  });
  const calendarPointerDownRef = React.useRef(false);
  const startInputRef = React.useRef<HTMLInputElement>(null);
  const { dayPickerProps, defaultMonth, numberOfMonths } =
    resolvePickerCalendarProps(calendarProps);
  const initialMonth = selected?.from ?? defaultMonth ?? startOfDay(new Date());
  const [visibleMonth, setVisibleMonth] = React.useState(initialMonth);
  const resolvedPopoverOpen = !disabled && popoverOpen;

  const triggerText = formatRangeDisplay(selected, displayLocale, labels.selectRange);

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    if (nextOpen) {
      setVisibleMonth(selected?.from ?? defaultMonth ?? startOfDay(new Date()));
    }
    setPopoverOpen(nextOpen);
  };

  const handleCalendarSelect: OnSelectHandler<DateRange | undefined> = (nextRange) => {
    if (disabled) return;
    onSelect(nextRange);
    if (nextRange?.from) setVisibleMonth(nextRange.from);
    if (nextRange?.from && nextRange.to) setPopoverOpen(false);
  };

  const commitStartInput = (inputValue: string): DateInputCommitResult => {
    if (!inputValue.trim()) {
      if (selected) onSelect(undefined);
      return { normalizedValue: "" };
    }

    const parsedDate = parseDateInput(inputValue);
    if (!parsedDate || isDateUnavailable(parsedDate, disabledDates, dayPickerProps)) {
      return { error: labels.invalidDate };
    }

    let nextEnd = selected?.to;
    if (nextEnd && isAfter(parsedDate, nextEnd)) nextEnd = undefined;
    if (
      nextEnd &&
      !isRangeAllowed(
        { from: parsedDate, to: nextEnd },
        { disabledDates, excludeDisabled, max, min }
      )
    ) {
      nextEnd = undefined;
    }

    if (
      !selected?.from ||
      !isSameDay(selected.from, parsedDate) ||
      Boolean(selected.to) !== Boolean(nextEnd) ||
      (selected.to && nextEnd && !isSameDay(selected.to, nextEnd))
    ) {
      onSelect({ from: parsedDate, to: nextEnd });
    }
    setVisibleMonth(parsedDate);
    return { normalizedValue: formatEditableDate(parsedDate) };
  };

  const commitEndInput = (
    inputValue: string,
    reason: DateInputCommitReason
  ): DateInputCommitResult => {
    if (!inputValue.trim()) {
      if (selected?.from && selected.to) {
        onSelect({ from: selected.from, to: undefined });
      }
      return { normalizedValue: "" };
    }

    const parsedDate = parseDateInput(inputValue);
    if (!parsedDate || isDateUnavailable(parsedDate, disabledDates, dayPickerProps)) {
      return { error: labels.invalidDate };
    }
    if (!selected?.from || isAfter(selected.from, parsedDate)) {
      return { error: labels.invalidRange };
    }

    const nextRange = { from: selected.from, to: parsedDate };
    if (
      !isRangeAllowed(nextRange, {
        disabledDates,
        excludeDisabled,
        max,
        min
      })
    ) {
      return { error: labels.invalidRange };
    }

    if (!selected.to || !isSameDay(selected.to, parsedDate)) {
      onSelect(nextRange);
    }
    setVisibleMonth(parsedDate);
    if (reason === "enter") setPopoverOpen(false);
    return { normalizedValue: formatEditableDate(parsedDate) };
  };

  return (
    <div className={cn("min-w-0", className)}>
      <Popover onOpenChange={handleOpenChange} open={resolvedPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={resolvedPopoverOpen}
            aria-haspopup="dialog"
            aria-label={
              selected?.from ? `${labels.selectRange}: ${triggerText}` : labels.selectRange
            }
            className={cn(
              "w-full justify-start overflow-hidden text-start font-normal",
              !selected?.from && "text-muted-foreground",
              triggerClassName
            )}
            data-qa={`${qaPrefix}.trigger`}
            disabled={disabled}
            type="button"
            variant="outline">
            <CalendarIcon aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{triggerText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label={labels.selectRange}
          className={cn(
            "w-auto max-w-[calc(100vw-2rem)] overflow-x-auto p-0",
            popoverContentClassName
          )}
          data-qa={`${qaPrefix}.popover`}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            startInputRef.current?.focus();
          }}
          onPointerDownCapture={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest('[data-slot="calendar"]')) {
              calendarPointerDownRef.current = true;
              window.setTimeout(() => {
                calendarPointerDownRef.current = false;
              }, 0);
            }
          }}
          role="dialog">
          <div className="grid gap-2 p-3 pb-0 sm:grid-cols-2">
            <DateInputField
              ref={startInputRef}
              initialValue={selected?.from ? formatEditableDate(selected.from) : ""}
              label={labels.startDate}
              onCommit={commitStartInput}
              placeholder={labels.dateFormat}
              qa={`${qaPrefix}.start-input`}
              shouldSkipBlurCommit={() => calendarPointerDownRef.current}
            />
            <DateInputField
              initialValue={selected?.to ? formatEditableDate(selected.to) : ""}
              label={labels.endDate}
              onCommit={commitEndInput}
              placeholder={labels.dateFormat}
              qa={`${qaPrefix}.end-input`}
              shouldSkipBlurCommit={() => calendarPointerDownRef.current}
            />
          </div>
          <Calendar
            {...dayPickerProps}
            data-qa={`${qaPrefix}.grid`}
            disabled={disabledDates}
            excludeDisabled={excludeDisabled}
            max={max}
            min={min}
            mode="range"
            month={visibleMonth}
            numberOfMonths={numberOfMonths ?? (isMobile ? 1 : 2)}
            onMonthChange={setVisibleMonth}
            onSelect={handleCalendarSelect}
            qaPrefix={qaPrefix}
            resetOnSelect={resetOnSelect}
            selected={selected}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function formatEditableDate(date: Date) {
  return format(date, "dd/MM/yyyy");
}

function formatDisplayDate(date: Date, locale?: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

function formatRangeDisplay(
  range: DateRange | undefined,
  locale: string | undefined,
  placeholder: string
) {
  if (!range?.from) return placeholder;
  const from = formatDisplayDate(range.from, locale);
  if (!range.to) return from;
  return `${from} – ${formatDisplayDate(range.to, locale)}`;
}

function formatQaDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatQaMonth(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function isDateUnavailable(
  date: Date,
  disabledDates: Matcher | Matcher[] | undefined,
  calendarProps: PickerCalendarProps
) {
  if (calendarProps.startMonth && isBefore(date, startOfMonth(calendarProps.startMonth))) {
    return true;
  }
  if (calendarProps.endMonth && isAfter(date, endOfMonth(calendarProps.endMonth))) {
    return true;
  }
  return disabledDates ? dateMatchModifiers(date, disabledDates) : false;
}

function isRangeAllowed(
  range: { from: Date; to: Date },
  {
    disabledDates,
    excludeDisabled,
    max,
    min
  }: {
    disabledDates?: Matcher | Matcher[];
    excludeDisabled: boolean;
    max?: number;
    min?: number;
  }
) {
  const duration = differenceInCalendarDays(range.to, range.from);
  if (min !== undefined && min > 1 && duration < min) return false;
  if (max !== undefined && max > 0 && duration > max) return false;
  if (excludeDisabled && disabledDates) {
    return !rangeContainsModifiers(range, disabledDates);
  }
  return true;
}

function parseDateInput(value: string) {
  const input = value.trim();
  if (!input) return undefined;

  const formats = [
    "dd/MM/yyyy",
    "d/M/yyyy",
    "dd/MM/yy",
    "dd-MM-yyyy",
    "d-M-yyyy",
    "yyyy-MM-dd",
    "ddMMyyyy",
    "ddMMyy"
  ];

  for (const inputFormat of formats) {
    const parsedDate = parse(input, inputFormat, new Date(2000, 0, 1));
    if (isValid(parsedDate)) {
      return startOfDay(parsedDate);
    }
  }

  return undefined;
}

function processDateDraft(value: string) {
  return value.slice(0, 10);
}

export { Calendar, CalendarDayButton, DatePicker, DateRangePicker };
