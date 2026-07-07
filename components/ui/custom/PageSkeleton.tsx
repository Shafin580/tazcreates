"use client";

import type * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface PageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean;
  showToolbar?: boolean;
  children?: React.ReactNode;
}

export function PageSkeleton({
  showHeader = true,
  showToolbar = false,
  children,
  className,
  ...props
}: PageSkeletonProps) {
  const t = useTranslations("Common");
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("states.loadingPage")}
      className={cn("w-full space-y-6", className)}
      {...props}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      )}
      {showToolbar && (
        <div className="flex items-center gap-3">
          <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      )}
      {children ?? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-full animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}
    </div>
  );
}
