"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "./TableSkeleton";

type Variant = "settings-list" | "settings-form" | "detail-tabs";

export function PageLoader({
  variant = "settings-list",
  rows = 6,
  columns = 6
}: {
  variant?: Variant;
  rows?: number;
  columns?: number;
}) {
  if (variant === "settings-form") {
    return (
      <Card role="status" aria-label="Loading content" aria-busy="true">
        <span className="sr-only">Loading…</span>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-9 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (variant === "detail-tabs") {
    return (
      <div className="space-y-4" role="status" aria-label="Loading content" aria-busy="true">
        <span className="sr-only">Loading…</span>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <TableSkeleton rows={rows} columns={columns} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="status" aria-label="Loading content" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-40" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <TableSkeleton rows={rows} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
