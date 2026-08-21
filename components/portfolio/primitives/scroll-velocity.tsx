"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

/**
 * Is the visitor scrolling fast enough that entrance animations cannot keep up?
 *
 * Measured, not guessed: during a hard flick this page moves ~530px per frame. A card
 * is then on screen for two frames total — at the first it is at opacity 0, by the
 * second it has already scrolled past at opacity 0.17. No fade duration survives that,
 * because the problem is not the duration, it is that there is no time to play one.
 *
 * So above a velocity threshold reveals stop animating and simply appear. Below it they
 * animate normally. This is the difference between "the animation is too slow" and
 * "there is no room for an animation", and only the second one is actually happening.
 *
 * The threshold is per-frame pixels rather than px/s so it is directly comparable to
 * the measurement above and independent of frame rate drift.
 */
const FAST_PX_PER_FRAME = 90;
/** Frames of calm before animations are allowed back — stops flicker at the boundary. */
const COOLDOWN_FRAMES = 6;

const ScrollVelocityContext = createContext(false);

export function ScrollVelocityProvider({ children }: { children: React.ReactNode }) {
  const [fast, setFast] = useState(false);
  const lastY = useRef(0);
  const calmFrames = useRef(0);
  const isFast = useRef(false);

  useEffect(() => {
    let raf = 0;
    lastY.current = window.scrollY;

    const markFast = () => {
      calmFrames.current = 0;
      if (!isFast.current) {
        isFast.current = true;
        setFast(true);
      }
    };

    const sample = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY.current);
      lastY.current = y;
      if (delta > FAST_PX_PER_FRAME) {
        markFast();
        return true;
      }
      return false;
    };

    // The `scroll` event fires before the next animation frame, so sampling here as
    // well closes a one-frame gap: without it, an element whose IntersectionObserver
    // fires on the very first fast frame starts a normal-speed reveal before the gate
    // has engaged, and is caught mid-fade.
    const onScroll = () => sample();
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      if (!sample() && isFast.current) {
        calmFrames.current += 1;
        if (calmFrames.current >= COOLDOWN_FRAMES) {
          isFast.current = false;
          setFast(false);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <ScrollVelocityContext.Provider value={fast}>{children}</ScrollVelocityContext.Provider>;
}

/** True while the page is being scrolled faster than an entrance animation can play. */
export function useIsScrollingFast(): boolean {
  return useContext(ScrollVelocityContext);
}
