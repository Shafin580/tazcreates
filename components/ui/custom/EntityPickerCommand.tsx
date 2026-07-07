"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EntityCard, type EntityCardData } from "@/components/ui/custom/EntityCard";
import { FacetedFilterPopover, type FilterSection } from "@/components/ui/custom/FacetedFilterPopover";
import type { FacetCountMap } from "@/lib/compute-facet-counts";

/**
 * Shared entity picker (search + filterable record list). Replaces the
 * inline `<Command>` picker that was copy-pasted across many feature files.
 *
 * Layout fix: the search input gets its OWN full-width row (with the native
 * cmdk search icon + bottom border); the Filters button + Active/Inactive
 * toggle live on a SEPARATE row below it. This removes the previous cramped
 * single-row layout where the filter button starved the search input of width.
 *
 * The component is presentational — all data, filtering, selection state, and
 * side-effects stay in the caller and are passed via props.
 */
export interface EntityPickerCommandProps<T> {
  /** Already-filtered record list. cmdk does text-search via `getValue`. */
  items: T[];
  getId: (e: T) => number | string;
  /** cmdk search haystack for a row. Default: derived from `toCard` output. */
  getValue?: (e: T) => string;
  /** Map a row to the EntityCard shape. Default: identity cast. */
  toCard?: (e: T) => EntityCardData;
  onSelect: (e: T) => void;

  searchPlaceholder: string;
  emptyText: React.ReactNode;

  /** Filter row (Filters button + Active/Inactive). Hidden when false. */
  showFilter?: boolean;
  filterSections?: FilterSection[];
  facetCounts?: FacetCountMap;
  matchTotal?: number;
  status?: "active" | "inactive";
  onStatusChange?: (status: "active" | "inactive") => void;
  filterQaPrefix?: string;

  /** Selected-row check mark (left of the card). */
  selectedId?: number | string | null;
  showCheckmark?: boolean;

  /** e.g. "max-h-[220px]" or "max-h-[60vh] overflow-y-auto". */
  maxListHeight?: string;
  /** When true, wraps in a bordered Command (inline, no popover). */
  inline?: boolean;
  className?: string;
}

export function EntityPickerCommand<T>({
  items,
  getId,
  getValue,
  toCard = (e) => e as unknown as EntityCardData,
  onSelect,
  searchPlaceholder,
  emptyText,
  showFilter = true,
  filterSections = [],
  facetCounts,
  matchTotal,
  status,
  onStatusChange,
  filterQaPrefix,
  selectedId,
  showCheckmark = false,
  maxListHeight,
  inline = false,
  className
}: EntityPickerCommandProps<T>) {
  // Default search haystack derives from `toCard` output (title + code +
  // description). Pass `getValue` for a custom haystack.
  const resolvedGetValue =
    getValue ??
    ((e: T) => {
      const c = toCard(e);
      return [c.title, c.code, c.description].filter(Boolean).join(" ");
    });

  return (
    <Command className={cn(inline && "rounded-md border", className)}>
      <CommandInput placeholder={searchPlaceholder} />
      {showFilter && (
        <div className="flex items-center gap-2 border-b px-2 py-1.5">
          <FacetedFilterPopover
            align="end"
            qaPrefix={filterQaPrefix}
            sections={filterSections}
            facetCounts={facetCounts}
            matchTotal={matchTotal}
            status={status}
            onStatusChange={onStatusChange}
          />
        </div>
      )}
      <CommandList className={maxListHeight}>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {items.map((e) => {
            const id = getId(e);
            const sel = selectedId != null && String(id) === String(selectedId);
            return (
              <CommandItem
                key={id}
                value={resolvedGetValue(e)}
                onSelect={() => onSelect(e)}
                className="data-[selected=true]:bg-accent flex items-center gap-2 py-2">
                {showCheckmark && (
                  <Check className={cn("size-4 shrink-0", sel ? "opacity-100" : "opacity-0")} />
                )}
                <div className="min-w-0 flex-1">
                  <EntityCard
                    entity={toCard(e)}
                    className="pointer-events-none w-full border-0 p-0 shadow-none"
                  />
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export interface EntityPickerPopoverProps<T> extends EntityPickerCommandProps<T> {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Default: matches the trigger width. */
  popoverWidthClass?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  avoidCollisions?: boolean;
}

export function EntityPickerPopover<T>({
  trigger,
  open,
  onOpenChange,
  popoverWidthClass = "w-[var(--radix-popover-trigger-width)]",
  align = "start",
  side,
  avoidCollisions,
  ...inner
}: EntityPickerPopoverProps<T>) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn("p-0", popoverWidthClass)}
        align={align}
        side={side}
        avoidCollisions={avoidCollisions}>
        <EntityPickerCommand {...(inner as EntityPickerCommandProps<T>)} />
      </PopoverContent>
    </Popover>
  );
}
