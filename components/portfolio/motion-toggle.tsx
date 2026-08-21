"use client";

import { Sparkles, Waves } from "lucide-react";
import { SITE } from "@/content/site";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preference";

/**
 * Lets a visitor turn the site's motion down without touching an OS setting.
 *
 * Deliberately a two-state switch (`full` / `reduced`) rather than a three-way
 * including "system": once someone has reached for this control they have expressed a
 * preference, and offering "system" back invites them to pick an option whose effect
 * they cannot see. The OS preference still supplies the *initial* state — the button
 * starts pressed for anyone who already asked for reduced motion.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { reduced, setChoice, hydrated } = useMotionPreference();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduced}
      aria-label={reduced ? SITE.a11y.motionEnable : SITE.a11y.motionReduce}
      data-qa="portfolio.global.motion-toggle"
      // Until the stored choice is read, server and client markup must agree.
      disabled={!hydrated}
      onClick={() => setChoice(reduced ? "full" : "reduced")}
      className={cn(
        "text-ink-muted hover:text-foreground hover:border-foreground/30 focus-visible:ring-ring border-border inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
        className
      )}>
      {reduced ? (
        <Waves aria-hidden className="size-4" />
      ) : (
        <Sparkles aria-hidden className="size-4" />
      )}
    </button>
  );
}
