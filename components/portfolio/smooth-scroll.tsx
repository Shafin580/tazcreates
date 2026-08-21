"use client";

import { useReducedMotionPreference } from "./motion-preference";

import { ReactLenis } from "lenis/react";

/**
 * Momentum scroll for the whole document.
 *
 * Lenis wraps native scroll rather than replacing it, so `position: sticky`,
 * anchor links and keyboard scrolling keep working. When the visitor has asked
 * for reduced motion we do not mount it at all — smoothing scroll is exactly the
 * kind of vestibular-triggering effect WCAG 2.3.3 is about, and a disabled Lenis
 * still costs a rAF loop.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotionPreference();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.4 }}>
      {children}
    </ReactLenis>
  );
}
