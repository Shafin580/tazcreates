"use client";

import { motion } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { SITE } from "@/content/site";

const SERVICES = SITE.services;

/**
 * One pass of the service list. Declared at module scope, not inside the
 * component, so React does not treat it as a new component type each render.
 */
function ServiceRow({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {SERVICES.map((service) => (
        <li key={service} className="flex items-center">
          <span className="font-display px-8 text-2xl whitespace-nowrap md:text-3xl">
            {service}
          </span>
          <span aria-hidden className="bg-accent size-1.5 shrink-0 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite ticker of what she offers.
 *
 * The list is rendered twice and the track translated by exactly -50%, so the
 * second copy lands where the first started and the loop is seamless. The
 * duplicate is `aria-hidden` so the services are announced once, not twice.
 *
 * Under reduced motion the track does not move; it becomes a horizontally
 * scrollable strip the visitor drives themselves.
 */
export function ServicesMarquee() {
  const prefersReducedMotion = useReducedMotionPreference();

  if (prefersReducedMotion) {
    return (
      <section
        aria-label={SITE.about.eyebrow}
        className="border-border bg-paper-deep text-secondary overflow-x-auto border-y py-6">
        <ServiceRow />
      </section>
    );
  }

  return (
    <section
      aria-label={SITE.about.eyebrow}
      className="border-border bg-paper-deep text-secondary overflow-hidden border-y py-6">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}>
        <ServiceRow />
        <ServiceRow hidden />
      </motion.div>
    </section>
  );
}
