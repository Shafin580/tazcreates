"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function LiveTime({ className = "", dataQa }: { className?: string; dataQa?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(new Date()), 0);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(initialTick);
      clearInterval(interval);
    };
  }, []);

  if (!now) {
    return (
      <div
        className={`bg-muted/30 text-muted-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${className}`}
        aria-live="off">
        <Clock className="size-4" aria-hidden="true" focusable="false" />
        <span className="font-mono tabular-nums">--:--:--</span>
      </div>
    );
  }

  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  return (
    <div
      className={`bg-muted/30 text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${className}`}
      role="timer"
      aria-live="off"
      data-qa={dataQa}>
      <Clock className="text-muted-foreground size-4" aria-hidden="true" focusable="false" />
      <span className="text-muted-foreground text-xs">{dateString}</span>
      <span className="bg-border h-4 w-px" />
      <span className="font-mono text-sm font-semibold tabular-nums">{timeString}</span>
    </div>
  );
}
