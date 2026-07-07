"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

export function BackNavigation({ routes }: { routes: string[] }) {
  const className = cn("ml-0 flex items-center gap-2");

  if (routes.length === 0) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Go back"
        className={className}
        disabled>
        <ArrowLeftIcon className="size-5" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="icon" className={className}>
      <Link href={routes[0]} aria-label="Go back">
        <ArrowLeftIcon className="size-5" aria-hidden="true" />
      </Link>
    </Button>
  );
}
