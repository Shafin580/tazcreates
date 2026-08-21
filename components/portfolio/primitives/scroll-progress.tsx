"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotionPreference } from "../motion-preference";

/** Gold hairline across the top of the viewport tracking page scroll. */
export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotionPreference();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="bg-accent fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
      style={{ scaleX: prefersReducedMotion ? scrollYProgress : scaleX }}
    />
  );
}
