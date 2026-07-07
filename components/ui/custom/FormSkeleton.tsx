"use client";

import type * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FormSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  fields?: number;
  columns?: 1 | 2;
  showHeader?: boolean;
  showActions?: boolean;
}

export function FormSkeleton({
  fields = 4,
  columns = 1,
  showHeader = true,
  showActions = true,
  className,
  ...props
}: FormSkeletonProps) {
  const t = useTranslations("Common");
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("states.loadingForm")}
      className={cn("w-full space-y-6", className)}
      {...props}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
        </div>
      )}
      <div
        className={cn(
          "grid gap-6",
          columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        )}
      >
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
      {showActions && (
        <div className="flex items-center gap-3 pt-2">
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      )}
    </div>
  );
}
