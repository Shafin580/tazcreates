"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";

export interface DashboardErrorContentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function DashboardErrorContent({ error, reset }: DashboardErrorContentProps) {
  useEffect(() => {
    console.error("-->", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-labelledby="dashboard-error-title"
      className="flex min-h-[99vh] flex-col items-start gap-4 px-2 py-8"
    >
      <div className="space-y-2 lg:space-y-4">
        <h1
          id="dashboard-error-title"
          className="text-3xl font-bold lg:text-5xl"
        >
          Oops!
        </h1>
        <p className="text-muted-foreground">Something went wrong!</p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
