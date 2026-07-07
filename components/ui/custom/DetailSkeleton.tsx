"use client";

import type * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DetailSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  showAvatar?: boolean;
  showHeader?: boolean;
}

export function DetailSkeleton({
  rows = 6,
  showAvatar = false,
  showHeader = true,
  className,
  ...props
}: DetailSkeletonProps) {
  const t = useTranslations("Common");
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("states.loadingDetails")}
      className={cn("w-full space-y-6", className)}
      {...props}>
      {showHeader && (
        <div className="flex items-center gap-4">
          {showAvatar && (
            <div className="size-16 animate-pulse rounded-full bg-muted" />
          )}
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      )}
      <div className="space-y-4 rounded-md border p-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
