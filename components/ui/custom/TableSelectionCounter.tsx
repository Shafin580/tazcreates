"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface TableSelectionCounterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  count: number;
}

export function TableSelectionCounter({
  count,
  className,
  ...rest
}: TableSelectionCounterProps) {
  const t = useTranslations("Tables");

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "text-sm tabular-nums",
        count > 0 ? "text-foreground font-medium" : "text-muted-foreground",
        className,
      )}
      {...rest}>
      {t("pagination.selected", { count })}
    </span>
  );
}
