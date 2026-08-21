"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore
} from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Whether motion should be suppressed, from either of the two signals that can say so:
 *
 *   1. the OS-level `prefers-reduced-motion` query, and
 *   2. an explicit in-page choice, stored as `data-motion="reduced"` on <html>.
 *
 * The OS query alone is not enough: a visitor who wants a calmer page but has never
 * touched an accessibility setting has no way to ask for one.
 *
 * This is a provider rather than a bare hook on purpose. The attribute is a single
 * piece of global DOM state; if every animated component owned its own copy they would
 * each run an effect writing `<html>`, which is both wasteful and racy. One writer,
 * many readers.
 *
 * The stored choice is read through `useSyncExternalStore` rather than an effect, which
 * gives a correct server snapshot ("system") and avoids setting state during an effect.
 */

const STORAGE_KEY = "tazcreates:motion";
const ATTRIBUTE = "data-motion";
/** Same-tab notification; the native `storage` event only fires in *other* tabs. */
const CHANGE_EVENT = "tazcreates:motion-change";

export type MotionChoice = "system" | "reduced" | "full";

type MotionPreference = {
  /** True when EITHER signal asks for reduced motion. This is what components gate on. */
  reduced: boolean;
  choice: MotionChoice;
  setChoice: (next: MotionChoice) => void;
  systemPrefersReduced: boolean;
  /** False during SSR and the first paint, when only the OS signal is known. */
  hydrated: boolean;
};

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): MotionChoice {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "reduced" || raw === "full" ? raw : "system";
  } catch {
    // Private mode, blocked site data, or a sandboxed preview — fall back to the OS.
    return "system";
  }
}

const getServerSnapshot = (): MotionChoice => "system";

const MotionPreferenceContext = createContext<MotionPreference | null>(null);

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemPrefersReduced = useReducedMotion() ?? false;
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const reduced = choice === "reduced" || (choice === "system" && systemPrefersReduced);

  // Single writer for the global attribute. `globals.css` carries a matching
  // `:root[data-motion="reduced"]` block so CSS animations stop too, not just the
  // JS-driven ones.
  useEffect(() => {
    const root = document.documentElement;
    if (reduced) root.setAttribute(ATTRIBUTE, "reduced");
    else root.removeAttribute(ATTRIBUTE);
  }, [reduced]);

  const setChoice = useCallback((next: MotionChoice) => {
    try {
      if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage is a convenience; the dispatch below still updates this session.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({ reduced, choice, setChoice, systemPrefersReduced, hydrated }),
    [reduced, choice, setChoice, systemPrefersReduced, hydrated]
  );

  return (
    <MotionPreferenceContext.Provider value={value}>{children}</MotionPreferenceContext.Provider>
  );
}

/**
 * Read the motion preference. Safe outside the provider — falls back to the OS query
 * alone, which is what a component rendered in isolation (a unit test) should see.
 */
export function useMotionPreference(): MotionPreference {
  const ctx = useContext(MotionPreferenceContext);
  const systemPrefersReduced = useReducedMotion() ?? false;

  return (
    ctx ?? {
      reduced: systemPrefersReduced,
      choice: "system" as const,
      setChoice: () => {},
      systemPrefersReduced,
      hydrated: false
    }
  );
}

/** Shorthand for the common case: "should this component animate?" */
export function useReducedMotionPreference(): boolean {
  return useMotionPreference().reduced;
}
