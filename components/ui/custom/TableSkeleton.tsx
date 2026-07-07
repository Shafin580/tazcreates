"use client";

import type * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  cellHeight?: number;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  cellHeight = 40,
  className,
  ...props
}: TableSkeletonProps) {
  const t = useTranslations("Common");
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("states.loadingTable")}
      className={cn("w-full overflow-hidden rounded-md border", className)}
      {...props}
    >
      <span className="sr-only">{t("states.loadingTable")}</span>
      <div className="w-full overflow-auto" aria-hidden="true">
        <table className="w-full caption-bottom text-sm">
          {showHeader && (
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors">
                {Array.from({ length: columns }).map((_, index) => (
                  <th
                    key={index}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="p-4 align-middle"
                    style={{ height: `${cellHeight}px` }}
                  >
                    <div
                      className={cn(
                        "h-4 animate-pulse rounded-md bg-muted",
                        colIndex === 0 ? "w-24" : "w-full max-w-[120px]"
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
