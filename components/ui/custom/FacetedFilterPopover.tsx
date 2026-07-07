"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ListFilter, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { FacetCountMap } from "@/lib/compute-facet-counts";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type FilterItem = {
  id: number;
  name: string;
  /** Optional faceted count. When present, renders as a muted numeric suffix
   * and gates click-ability when zero. */
  count?: number;
};

export type FilterSection = {
  /** Stable key, also used for ids and the active tab value */
  key: string;
  /** Visible label in the tab strip */
  label: string;
  /** The list of selectable items (may be undefined while loading) */
  items: FilterItem[] | undefined;
  /** Currently selected item ids */
  selectedIds: number[];
  /** Replace the entire selection with the given list */
  onChange: (ids: number[]) => void;
  /** Show a search input above the list. Defaults to true. */
  searchable?: boolean;
  /** Custom search placeholder. Defaults to `Search {label}...` */
  placeholder?: string;
  /** Empty-state copy. Defaults to `No {label} found.` */
  emptyText?: string;
};

export interface FacetedFilterPopoverProps {
  /** Sections to render — order is preserved in the tab strip */
  sections: FilterSection[];
  /** Trigger button label. Defaults to `Filters`. */
  triggerLabel?: string;
  /** Popover alignment relative to the trigger. Defaults to `end` so it
   * stays inside narrow parent containers like drawers. */
  align?: "start" | "center" | "end";
  /** Extra classes for the trigger button */
  triggerClassName?: string;
  /** Override the trigger button entirely */
  trigger?: React.ReactNode;
  /** When provided, renders as a second muted badge on the trigger — the
   * number of entities that match all current selections. */
  matchTotal?: number;
  /** When true, shows a small spinner next to the match-total badge so users
   * know counts are being recomputed. */
  isFetching?: boolean;
  /** Namespace used to stamp `data-qa` onto every interactive element. When
   * omitted, the popover falls back to a neutral `faceted-filter.*` prefix. */
  qaPrefix?: string;
  /** When false, Radix is told to keep the popover on its preferred side
   * (`bottom`) even if it would overlap the viewport edge. Default `true`
   * lets Radix flip above when space is tight. Set to `false` for use cases
   * (like the schedule-assign right rail) where the popover *must* render
   * below the trigger so it doesn't cover other panel content. */
  avoidCollisions?: boolean;
  /** When provided, renders an Active/Inactive toggle above the section tabs. */
  status?: "active" | "inactive";
  /** Required when `status` is provided — called with the new status on toggle. */
  onStatusChange?: (status: "active" | "inactive") => void;
  /** Faceted counts keyed by section key. When present, merged into each
   * section's items as `count` before rendering — a safe no-op when the
   * host page has not yet computed facets for a given section. */
  facetCounts?: FacetCountMap;
}

// -----------------------------------------------------------------------------
// Shared inner content (used by both Popover and Sheet variants)
// -----------------------------------------------------------------------------

function FilterPanel({
  visibleSections,
  totalSelected,
  onClearAll,
  defaultTab,
  matchTotal,
  qaPrefix
}: {
  visibleSections: FilterSection[];
  totalSelected: number;
  onClearAll: () => void;
  defaultTab: string | undefined;
  matchTotal: number | undefined;
  qaPrefix: string;
}) {
  const t = useTranslations("Tables");
  // Per-section search text — drives "Select all" scope so it only
  // selects items visible after the user's search query.
  const [sectionSearch, setSectionSearch] = React.useState<Record<string, string>>({});

  // Shared filter: includes OR subsequence match. Passed to <Command>
  // AND used for visibleItems so "Select all" always covers exactly
  // the items the user sees. Supports fuzzy queries like "jaq" → "Jacquard".
  const commandFilter = React.useCallback((value: string, search: string): number => {
    const v = value.toLowerCase();
    const s = search.toLowerCase();
    if (!s) return 1;
    if (v.includes(s)) return 1;
    // Subsequence match
    let si = 0;
    for (let vi = 0; vi < v.length && si < s.length; vi++) {
      if (v[vi] === s[si]) si++;
    }
    return si === s.length ? 0.5 : 0;
  }, []);

  const toggleId = (sec: FilterSection, id: number) => {
    sec.onChange(
      sec.selectedIds.includes(id)
        ? sec.selectedIds.filter((x) => x !== id)
        : [...sec.selectedIds, id]
    );
  };

  // Items sorted by `count` descending (alphabetical tiebreak). When no item
  // in a section carries a numeric count (e.g. schedule/shift sections, or
  // before facets load) we keep API order so consumers without facet data
  // don't reshuffle.
  const sortedSectionItems = React.useMemo(() => {
    const out = new Map<string, FilterItem[]>();
    for (const sec of visibleSections) {
      const items = sec.items;
      if (!items || items.length === 0) {
        out.set(sec.key, items ?? []);
        continue;
      }
      const hasAnyCount = items.some((i) => typeof i.count === "number");
      if (!hasAnyCount) {
        out.set(sec.key, items);
        continue;
      }
      const sorted = items.slice().sort((a, b) => {
        const ca = a.count ?? 0;
        const cb = b.count ?? 0;
        if (cb !== ca) return cb - ca;
        return a.name.localeCompare(b.name);
      });
      out.set(sec.key, sorted);
    }
    return out;
  }, [visibleSections]);

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      {/* Header */}
      <div className="bg-muted/30 flex items-center justify-between gap-2 border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ListFilter aria-hidden="true" className="text-muted-foreground size-4" />
          <h4 className="text-sm font-semibold">{t("filters.title")}</h4>
          {totalSelected > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs font-medium">
              {totalSelected}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={totalSelected === 0}
          onClick={onClearAll}
          data-qa={`${qaPrefix}.clear-all`}>
          {t("filters.clearAll")}
        </Button>
      </div>

      {/* SR-only live region — announces the new match total after each
          selection settles. Kept polite so it does not interrupt keyboard
          navigation between checkboxes. */}
      {matchTotal !== undefined && (
        <div role="status" aria-live="polite" className="sr-only">
          {t("filters.matchTotal", { count: matchTotal })}
        </div>
      )}

      {/* Tab strip */}
      <div className="border-b">
        <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-1.5">
          {visibleSections.map((sec) => (
            <TabsTrigger
              key={sec.key}
              value={sec.key}
              data-qa={`${qaPrefix}.tab.${sec.key}`}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted shrink-0 gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors data-[state=active]:shadow-none">
              {sec.label}
              {sec.selectedIds.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/15 text-primary h-4 min-w-4 px-1 text-[10px]">
                  {sec.selectedIds.length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab panels */}
      <div className="p-2">
        {visibleSections.map((sec) => {
          const showSearch = sec.searchable ?? true;
          const items = sortedSectionItems.get(sec.key) ?? [];
          const query = sectionSearch[sec.key] ?? "";
          const visibleItems = query
            ? items.filter((i) => commandFilter(i.name, query) > 0)
            : items;
          const selectableIds = visibleItems
            .filter((i) => i.count === undefined || i.count > 0)
            .map((i) => i.id);
          const hasSelectable = selectableIds.length > 0;
          const allSelectableSelected =
            hasSelectable && selectableIds.every((id) => sec.selectedIds.includes(id));
          return (
            <TabsContent
              key={sec.key}
              value={sec.key}
              className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 mt-0 duration-200 ease-out focus-visible:outline-none">
              {hasSelectable && (
                <label
                  className="hover:bg-muted/50 mb-1 flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5"
                  data-qa={`${qaPrefix}.section.${sec.key}.select-all-row`}>
                  <Checkbox
                    checked={allSelectableSelected}
                    data-qa={`${qaPrefix}.section.${sec.key}.select-all`}
                    onCheckedChange={(next) => {
                      if (next === true) {
                        sec.onChange(Array.from(new Set([...sec.selectedIds, ...selectableIds])));
                      } else {
                        sec.onChange(sec.selectedIds.filter((id) => !selectableIds.includes(id)));
                      }
                    }}
                  />
                  <span className="flex-1 text-sm font-medium">{t("filters.selectAll")}</span>
                </label>
              )}
              <Command filter={commandFilter} className="h-auto bg-transparent">
                {showSearch && (
                  <CommandInput
                    placeholder={
                      sec.placeholder ??
                      t("filters.searchSection", { section: sec.label.toLowerCase() })
                    }
                    className="h-9"
                    value={sectionSearch[sec.key] ?? ""}
                    onValueChange={(v) => setSectionSearch((prev) => ({ ...prev, [sec.key]: v }))}
                  />
                )}
                <CommandList className="max-h-[55vh] sm:max-h-[260px]">
                  <CommandEmpty>
                    {sec.emptyText ?? t("filters.noSectionFound", { section: sec.label })}
                  </CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => {
                      const checked = sec.selectedIds.includes(item.id);
                      const hasCount = typeof item.count === "number";
                      const isZero = hasCount && item.count === 0;
                      // Zero-count items are disabled unless already selected
                      // — users can always deselect out of an invalid combo.
                      const interactable = checked || !isZero;
                      return (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          data-qa={`${qaPrefix}.item.${sec.key}.${item.id}`}
                          disabled={!interactable}
                          // Single source of truth — fires on row click,
                          // keyboard Enter, and tap. Checkbox below is
                          // pointer-events-none so it never double-fires.
                          onSelect={() => {
                            if (!interactable) return;
                            toggleId(sec, item.id);
                          }}
                          className={cn(
                            "aria-selected:bg-muted/60 cursor-pointer rounded-md transition-colors duration-150",
                            checked && "bg-primary/5 hover:bg-primary/10",
                            !interactable && "cursor-not-allowed opacity-50"
                          )}>
                          <div className="flex w-full items-center gap-3 py-1">
                            <Checkbox
                              checked={checked}
                              tabIndex={-1}
                              aria-hidden="true"
                              className="pointer-events-none"
                              data-qa={`${qaPrefix}.item.${sec.key}.${item.id}.checkbox`}
                            />
                            <span className="flex-1 text-sm leading-none">{item.name}</span>
                            {hasCount && (
                              <span
                                className="text-muted-foreground ml-2 text-xs tabular-nums"
                                data-qa={`${qaPrefix}.item.${sec.key}.${item.id}.count`}>
                                {item.count}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Compact, mobile-friendly multi-select filter popover.
 *
 * - **Mobile (<768px):** renders as a bottom Sheet so it never overflows the
 *   viewport or its parent drawer.
 * - **Desktop:** renders as a Popover anchored under the trigger.
 *   `avoidCollisions` is enabled so Radix shifts the popover horizontally
 *   when the trigger is near the right edge of a narrow container (e.g. a
 *   side drawer) — the popover stays visible without flipping above the
 *   trigger.
 * - Tabs let users pick a category first, then see its options — keeps the
 *   popover narrow and avoids 6-column overflow.
 * - "Clear all" sits at the top, next to the title. Each tab shows its own
 *   selection count badge.
 * - When `facetCounts` is provided, buckets are merged into each section's
 *   items (keyed directly by the section's `key`) before anything renders.
 */
export function FacetedFilterPopover({
  sections,
  triggerLabel,
  align = "end",
  triggerClassName,
  trigger,
  matchTotal,
  isFetching,
  qaPrefix = "faceted-filter",
  avoidCollisions = true,
  status,
  onStatusChange,
  facetCounts
}: FacetedFilterPopoverProps) {
  const t = useTranslations("Tables");
  const isMobile = useIsMobile();

  const mergedSections = React.useMemo(() => {
    if (!facetCounts) return sections;
    return sections.map((s) => {
      const bucket = facetCounts[s.key];
      return bucket && s.items
        ? { ...s, items: s.items.map((i) => ({ ...i, count: bucket.get(i.id) ?? 0 })) }
        : s;
    });
  }, [sections, facetCounts]);

  const resolvedMatchTotal = matchTotal ?? facetCounts?.matchTotal;

  const visibleSections = mergedSections.filter((s) => Boolean(s));
  const totalSelected = visibleSections.reduce(
    (acc, sec) => acc + (sec.selectedIds?.length ?? 0),
    0
  );
  const defaultTab = visibleSections[0]?.key;

  const clearAll = React.useCallback(() => {
    visibleSections.forEach((sec) => sec.onChange([]));
  }, [visibleSections]);

  const triggerNode = trigger ?? (
    <Button
      variant="outline"
      data-qa={`${qaPrefix}.trigger`}
      className={`relative ${triggerClassName ?? ""}`}>
      <ListFilter aria-hidden="true" className="size-4" />
      <span className="ml-1">{triggerLabel ?? t("filters.title")}</span>
      {totalSelected > 0 && (
        <Badge
          className="ml-2 h-5 min-w-5 px-1 text-xs"
          variant="secondary"
          data-qa={`${qaPrefix}.selected-count`}>
          {totalSelected}
        </Badge>
      )}
      {/* {resolvedMatchTotal !== undefined && (
          <Badge
            className="bg-muted/60 text-muted-foreground ml-1 h-5 min-w-5 px-1.5 text-xs font-medium tabular-nums"
            variant="secondary"
            data-qa={`${qaPrefix}.match-total`}>
            {resolvedMatchTotal}
          </Badge>
        )} */}
      {isFetching && (
        <Loader2 aria-hidden="true" className="text-muted-foreground ml-1 size-3 animate-spin" />
      )}
    </Button>
  );

  const statusToggle =
    status !== undefined && onStatusChange ? (
      <ButtonGroup>
        <Button
          type="button"
          variant={status === "active" ? "default" : "outline"}
          onClick={() => onStatusChange("active")}>
          {t("filters.statusActive")}
        </Button>
        <Button
          type="button"
          variant={status === "inactive" ? "default" : "outline"}
          onClick={() => onStatusChange("inactive")}>
          {t("filters.statusInactive")}
        </Button>
      </ButtonGroup>
    ) : null;

  if (visibleSections.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>{triggerNode}</PopoverTrigger>
          <PopoverContent className="w-72 p-3">
            <div className="text-muted-foreground text-sm">{t("filters.noFilters")}</div>
          </PopoverContent>
        </Popover>
        {statusToggle}
      </div>
    );
  }

  // ─── Mobile: bottom Sheet ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>{triggerNode}</SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-hidden p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle>{t("filters.title")}</SheetTitle>
              <SheetDescription>{t("filters.sheetDescription")}</SheetDescription>
            </SheetHeader>
            <div className="flex h-full flex-col overflow-y-auto">
              <FilterPanel
                visibleSections={visibleSections}
                totalSelected={totalSelected}
                onClearAll={clearAll}
                defaultTab={defaultTab}
                matchTotal={resolvedMatchTotal}
                qaPrefix={qaPrefix}
              />
            </div>
          </SheetContent>
        </Sheet>
        {statusToggle}
      </div>
    );
  }

  // ─── Desktop: Popover ──────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>{triggerNode}</PopoverTrigger>
        <PopoverContent
          className="w-[min(92vw,420px)] overflow-hidden p-0 shadow-lg"
          align={align}
          side="bottom"
          sideOffset={6}
          avoidCollisions={avoidCollisions}
          collisionPadding={12}>
          <FilterPanel
            visibleSections={visibleSections}
            totalSelected={totalSelected}
            onClearAll={clearAll}
            defaultTab={defaultTab}
            matchTotal={resolvedMatchTotal}
            qaPrefix={qaPrefix}
          />
        </PopoverContent>
      </Popover>
      {statusToggle}
    </div>
  );
}
