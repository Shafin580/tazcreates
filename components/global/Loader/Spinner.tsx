import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
  /**
   * Accessible label. Omit (the default) when the spinner is rendered
   * inside a parent `role="status"` region (e.g. LoadingOverlay) so AT
   * does not double-announce — the parent already says "Loading…". Pass
   * a label for standalone usage.
   */
  label?: string;
}

export function Spinner({ className, size = 24, label }: SpinnerProps) {
  if (label) {
    return (
      <Loader2
        className={cn("animate-spin text-primary", className)}
        size={size}
        role="status"
        aria-label={label}
        focusable="false"
      />
    );
  }

  return (
    <Loader2
      className={cn("animate-spin text-primary", className)}
      size={size}
      aria-hidden="true"
      focusable="false"
    />
  );
}
