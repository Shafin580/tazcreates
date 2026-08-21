"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "../motion-preference";
import { useIsScrollingFast } from "./scroll-velocity";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
  none: { x: 0, y: 0 }
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal timing, and why these specific numbers.
 *
 * The earlier values (0.7s duration, `amount: 0.3`) produced a measurable fault: on a
 * cold page with one fast scroll flick, three elements were simultaneously inside the
 * viewport at opacity < 0.9 — visibly blank content that the visitor had already
 * scrolled to. Two causes, both fixed here:
 *
 *   - `amount: 0.3` meant the reveal only STARTED once 30% of the element was already
 *     on screen. `0.01` plus a negative bottom margin starts it just BEFORE the element
 *     enters, so it is finished by the time it can be read.
 *   - 0.7s is 2-4x the 150-300ms band `ui-ux-quality` sets for UI motion. At speed, a
 *     0.7s fade cannot keep up with the scroll that triggered it.
 */
const DURATION = 0.3;
const VIEWPORT_AMOUNT = 0.01;
/**
 * Start the reveal before the element actually enters the viewport.
 *
 * Sign matters and is easy to get backwards: IntersectionObserver's `rootMargin`
 * GROWS the observation box on positive values, so a positive bottom margin makes
 * elements below the fold intersect *early*. A negative value shrinks the box and
 * fires later — the opposite of what a reveal wants.
 */
const VIEWPORT_MARGIN = "0px 0px 25% 0px";

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = DURATION,
  once = true,
  amount = VIEWPORT_AMOUNT
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}) {
  const reduced = useReducedMotionPreference();
  const fast = useIsScrollingFast();
  // No travel when motion is reduced, and none when there is no time to play it.
  const still = reduced || fast;
  const offset = still ? OFFSET.none : OFFSET[direction];

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: VIEWPORT_MARGIN }}
      transition={{
        duration: fast ? 0 : reduced ? 0.15 : duration,
        delay: still ? 0 : delay,
        ease: EASE
      }}>
      {children}
    </motion.div>
  );
}

/**
 * Variants for staggered lists.
 *
 * The stagger is capped rather than per-item-unbounded: at the old 0.08s the sixth
 * gallery card started 480ms after the first, so during a fast scroll the tail of the
 * list was still invisible well after the head had been read. `staggerChildren` is
 * halved and callers get `cappedStagger()` for lists long enough to need it.
 */
const STAGGER = 0.04;
const MAX_TOTAL_STAGGER = 0.2;

export function cappedStagger(itemCount: number): number {
  if (itemCount <= 1) return 0;
  return Math.min(STAGGER, MAX_TOTAL_STAGGER / (itemCount - 1));
}

export function useRevealVariants(itemCount?: number): {
  parent: Variants;
  child: Variants;
} {
  const reduced = useReducedMotionPreference();
  const fast = useIsScrollingFast();
  const still = reduced || fast;
  // A stagger is a queue; at speed the tail of the queue is what the visitor sees as
  // "half the section is missing". Drop it entirely when there is no time for it.
  const stagger = fast ? 0 : reduced ? 0.02 : itemCount ? cappedStagger(itemCount) : STAGGER;

  return {
    parent: {
      hidden: {},
      shown: { transition: { staggerChildren: stagger, delayChildren: fast ? 0 : 0.02 } }
    },
    child: {
      hidden: { opacity: 0, y: still ? 0 : 16 },
      shown: {
        opacity: 1,
        y: 0,
        transition: { duration: fast ? 0 : reduced ? 0.15 : DURATION, ease: EASE }
      }
    }
  };
}

/** Shared viewport config so every staggered list triggers at the same point. */
export const REVEAL_VIEWPORT = {
  once: true,
  amount: VIEWPORT_AMOUNT,
  margin: VIEWPORT_MARGIN
} as const;
