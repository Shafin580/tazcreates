"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function CountAnimation({
  number,
  className,
  ariaLabel,
}: {
  number: number;
  className?: string;
  /**
   * Accessible label read by screen readers in place of the live-animating
   * digits (which would otherwise be announced repeatedly mid-animation).
   * Pass the contextual final value, e.g. "42 employees".
   */
  ariaLabel?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, number, { duration: 2 });

    return animation.stop;
  }, [count, number]);

  if (ariaLabel) {
    // role="img" on the wrapper is the WAI-ARIA-blessed way to give a
    // composite presentational element a single accessible name; the
    // inner motion span is aria-hidden so AT does not stutter through
    // each in-flight digit.
    return (
      <span
        className={cn(className)}
        role="img"
        aria-label={ariaLabel}>
        <motion.span aria-hidden="true">{rounded}</motion.span>
      </span>
    );
  }

  return <motion.span className={cn(className)}>{rounded}</motion.span>;
}
