import type React from "react";
import { FileX, Search, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoDataFoundProps {
  title?: string;
  description?: string;
  icon?: "file" | "search" | "database";
  className?: string;
  children?: React.ReactNode;
}

export function NoDataFound({
  title = "No data found",
  description = "There's nothing to display at the moment.",
  icon = "search",
  className,
  children,
}: NoDataFoundProps) {
  const icons = {
    file: FileX,
    search: Search,
    database: Database,
  };

  const Icon = icons[icon];

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-muted-foreground text-balance">{description}</p>

      {children && <div className="flex flex-col gap-2 sm:flex-row">{children}</div>}
    </div>
  );
}
