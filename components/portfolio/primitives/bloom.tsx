"use client";

import { createContext, useContext } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useReducedMotionPreference } from "../motion-preference";
import { cn } from "@/lib/utils";

type Tone = "rose" | "blush" | "gold";

const TONE: Record<Tone, string> = {
  rose: "var(--bloom-rose)",
  blush: "var(--bloom-blush)",
  gold: "var(--bloom-gold)"
};

/**
 * Page scroll progress, opened once and shared.
 *
 * Every `Bloom` previously called `useScroll()` itself, so four blooms meant four
 * independent scroll listeners computing the same number. The provider opens one and
 * hands it down.
 */
const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

export function BloomScrollProvider({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  return (
    <ScrollProgressContext.Provider value={scrollYProgress}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

/**
 * A soft radial wash of colour behind a section — the blush-editorial stand-in for the
 * old site's full-bleed pastel gradients (and for the two background .mp4s, which
 * shipped ~5.5MB to do this same job).
 *
 * `drift` is how far it parallaxes across the whole page scroll, in pixels. The value
 * is spring-damped: a fast flick moves scroll several hundred pixels between frames,
 * and an undamped transform teleports rather than travelling.
 *
 * Note there is no `will-change` here on purpose. These are large, heavily blurred
 * layers; promoting four of them to their own compositor layers costs more memory than
 * the drift saves, and the drift is slow enough not to need it.
 */
export function Bloom({
  tone = "rose",
  className,
  size = 520,
  drift = 80,
  blur = 90
}: {
  tone?: Tone;
  className?: string;
  size?: number;
  drift?: number;
  blur?: number;
}) {
  const reduced = useReducedMotionPreference();
  // Always subscribes to the provider's single MotionValue. Calling `useScroll()` here
  // as a fallback would defeat the point — hooks are unconditional, so four blooms
  // would open four listeners again even when the provider is present. Without a
  // provider the bloom simply renders static, which is all a unit test needs.
  const progress = useContext(ScrollProgressContext);
  const inert = useMotionValue(0);
  const yRaw = useTransform(progress ?? inert, [0, 1], [0, reduced || !progress ? 0 : drift]);
  const y = useSpring(yRaw, { stiffness: 90, damping: 30, restDelta: 0.01 });

  return (
    <motion.div
      aria-hidden
      style={{
        y,
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        background: `radial-gradient(circle at center, ${TONE[tone]} 0%, transparent 68%)`
      }}
      className={cn("pointer-events-none absolute -z-10 rounded-full", className)}
    />
  );
}
