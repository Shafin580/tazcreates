"use client";

import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/content/site";
import { Reveal } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";

/**
 * Closing call to action.
 *
 * The animated mesh gradient here replaces the two background .mp4 files the
 * Canva site shipped (~5.5MB combined) to achieve the same effect. It is pure
 * CSS, scales to any viewport, and the `mesh-drift` keyframes are stopped by the
 * global prefers-reduced-motion rule in globals.css.
 */
export function CtaSection() {
  return (
    <section id="order" className="relative overflow-hidden px-6 py-32 md:px-12 md:py-44">
      <div aria-hidden className="mesh-bloom absolute inset-0 -z-10" />

      <div className="relative mx-auto max-w-4xl text-center">
        <KineticHeading
          text={SITE.cta.closingTitle}
          className="text-background text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] font-semibold"
        />
        <Reveal delay={0.2}>
          <p className="text-background/85 mt-6 text-xl md:text-2xl">{SITE.cta.closingBody}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href={SITE.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-qa="portfolio.cta.button"
            className="group bg-background text-foreground hover:bg-foreground hover:text-background focus-visible:ring-background mt-12 inline-flex items-center gap-3 rounded-full px-10 py-5 text-sm font-medium tracking-[0.14em] uppercase transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none">
            {SITE.cta.primary}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
