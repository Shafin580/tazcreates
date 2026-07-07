"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconTooltipButton } from "@/components/ui/custom/IconTooltipButton";

export const PAGE_SIZE_OPTIONS = [100, 300, 500, 1000, 3000, 5000] as const;
export const DEFAULT_PAGE_SIZE: number = PAGE_SIZE_OPTIONS[0];

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filteredCount: number;
  unfilteredCount?: number;
  startIndex: number;
  endIndex: number;
  hasActiveFilter?: boolean;
  rowLabel?: string;
  pageSizeOptions?: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationFooter({
  currentPage,
  totalPages,
  pageSize,
  filteredCount,
  unfilteredCount,
  startIndex,
  endIndex,
  hasActiveFilter,
  rowLabel,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}: PaginationFooterProps) {
  const t = useTranslations("Tables");
  const tCommon = useTranslations("Common");
  const pageSizeLabelId = useId();
  const [pageSelectOpen, setPageSelectOpen] = useState(false);
  const isAtStart = currentPage <= 1;
  const isAtEnd = currentPage >= totalPages;

  const label = rowLabel ?? t("pagination.noRows", { label: "row" }).replace("No ", "").replace("s", "");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3">
      <p className="text-muted-foreground shrink-0 text-sm">
        {filteredCount === 0
          ? t("pagination.noRows", { label })
          : t("pagination.showing", { from: startIndex + 1, to: endIndex, total: filteredCount, label: `${label}${filteredCount !== 1 ? "s" : ""}` })}
        {hasActiveFilter && unfilteredCount != null && filteredCount !== unfilteredCount && (
          <span className="ml-1">{t("pagination.filteredFrom", { total: unfilteredCount })}</span>
        )}
      </p>

      {totalPages > 1 && (
        <nav aria-label={tCommon("a11y.pagination")} className="flex items-center gap-1">
          <IconTooltipButton
            icon={<ChevronsLeft />}
            iconSize="sm"
            tooltip={t("pagination.first")}
            aria-label={t("pagination.first")}
            className="size-8"
            disabled={isAtStart}
            onClick={() => onPageChange(1)}
          />
          <IconTooltipButton
            icon={<ChevronLeft />}
            iconSize="sm"
            tooltip={t("pagination.prev")}
            aria-label={t("pagination.prev")}
            className="size-8"
            disabled={isAtStart}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          />

          <Popover open={pageSelectOpen} onOpenChange={setPageSelectOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={pageSelectOpen}
                aria-label={t("pagination.pageAriaLabel", { current: currentPage, total: totalPages })}
                className="h-8 min-w-[110px] justify-between gap-2 px-2 text-sm">
                <span>
                  {t("pagination.page")} {currentPage} / {totalPages}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0" align="center">
              <Command>
                <CommandInput placeholder={t("pagination.jumpTo")} />
                <CommandList>
                  <CommandEmpty>{t("pagination.noPage")}</CommandEmpty>
                  <CommandGroup className="max-h-[240px] overflow-y-auto">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <CommandItem
                        key={p}
                        value={String(p)}
                        keywords={[`${t("pagination.page")} ${p}`]}
                        onSelect={() => {
                          onPageChange(p);
                          setPageSelectOpen(false);
                        }}
                        aria-current={p === currentPage ? "page" : undefined}>
                        {t("pagination.page")} {p}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <IconTooltipButton
            icon={<ChevronRight />}
            iconSize="sm"
            tooltip={t("pagination.next")}
            aria-label={t("pagination.next")}
            className="size-8"
            disabled={isAtEnd}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          />
          <IconTooltipButton
            icon={<ChevronsRight />}
            iconSize="sm"
            tooltip={t("pagination.last")}
            aria-label={t("pagination.last")}
            className="size-8"
            disabled={isAtEnd}
            onClick={() => onPageChange(totalPages)}
          />
        </nav>
      )}

      <div className="flex shrink-0 items-center gap-2">
        <span id={pageSizeLabelId} className="text-muted-foreground text-sm">
          {t("pagination.rowsPerPage")}
        </span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="h-8 w-[80px]" aria-labelledby={pageSizeLabelId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
