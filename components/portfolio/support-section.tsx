"use client";

import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";
import { CoffeeGlyph } from "./primitives/coffee-glyph";

/**
 * Tip jar.
 *
 * Deliberately a styled link rather than the Buy Me a Coffee widget script: the widget
 * injects third-party JS, renders in its own palette, and floats a button over the page.
 * A link costs nothing and matches the site.
 *
 * If the username has not been filled in yet, this renders the copy without a live link
 * rather than pointing at `buymeacoffee.com/__TODO__`, which would 404 in front of a
 * real visitor.
 */
// Widened deliberately: `content/site.ts` is `as const`, so TS narrows this to the
// literal "__TODO__" and would treat the configured branch as unreachable. The value is
// a placeholder that a human replaces, not a constant.
const USERNAME: string = SITE.support.username;
const CONFIGURED = USERNAME.length > 0 && USERNAME !== "__TODO__";
const SUPPORT_URL = `https://buymeacoffee.com/${USERNAME}`;

export function SupportSection() {
  return (
    <section id="support" className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="border-border bg-card mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[1.75rem] border px-8 py-14 text-center md:px-14">
        <Reveal>
          <span className="text-primary bg-muted inline-flex size-14 items-center justify-center rounded-full">
            <CoffeeGlyph className="size-6" />
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="font-hand text-primary text-2xl">{SITE.support.eyebrow}</p>
        </Reveal>

        <KineticHeading
          text={SITE.support.title}
          className="text-foreground text-[clamp(2rem,4.5vw,3.25rem)] leading-[1] font-semibold"
        />

        <Reveal delay={0.1}>
          <p className="text-ink-muted max-w-prose text-lg text-balance">{SITE.support.body}</p>
        </Reveal>

        <Reveal delay={0.15}>
          {CONFIGURED ? (
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-qa="portfolio.support.cta"
              className={cn(
                "group bg-foreground text-background hover:bg-secondary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center gap-3 rounded-full px-8 py-4 text-sm font-medium tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              )}>
              {SITE.support.cta}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ) : (
            <p className="text-ink-faint max-w-prose text-sm">{SITE.support.cta}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
