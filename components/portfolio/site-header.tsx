"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { SITE } from "@/content/site";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
// Motion toggle is intentionally disabled in the header (see the commented render
// below). Import kept commented alongside it so re-enabling is a two-line uncomment.
// import { MotionToggle } from "./motion-toggle";

const SECTION_IDS = SITE.nav.links.map((l) => l.id);

/**
 * Sticky site navigation.
 *
 * The page previously had none: 6,700px of content across five anchorable sections with
 * no way to reach any of them except scrolling. This is the single largest usability
 * gap the audit found.
 *
 * Scroll-spy runs off IntersectionObserver rather than a scroll handler so it costs
 * nothing per frame — which matters here because the page already runs scroll-linked
 * parallax and a velocity gate.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section occupying the most of the viewport wins, so a tall section does
        // not lose to a short one that merely crossed the threshold more recently.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-colors duration-200",
        scrolled
          ? "bg-background/85 border-border border-b backdrop-blur-md"
          : "border-b border-transparent"
      )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-12 lg:px-20">
        <a
          href="#main"
          data-qa="portfolio.header.brand"
          className="font-display text-foreground focus-visible:ring-ring -mx-2 inline-flex min-h-11 shrink-0 items-center rounded-lg px-2 text-lg focus-visible:ring-2 focus-visible:outline-none md:text-xl">
          {SITE.nav.brand}
        </a>

        <nav aria-label={SITE.nav.brand} className="hidden items-center gap-1 lg:flex">
          {SITE.nav.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              data-qa={`portfolio.header.link.${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
              className={cn(
                "focus-visible:ring-ring rounded-full px-4 py-2 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
                active === link.id
                  ? "text-foreground bg-muted"
                  : "text-ink-muted hover:text-foreground"
              )}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* <MotionToggle /> */}

          <a
            href="#commission"
            data-qa="portfolio.header.cta"
            className="bg-foreground text-background hover:bg-secondary focus-visible:ring-ring hidden items-center rounded-full px-5 py-3 text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none sm:inline-flex">
            {SITE.nav.cta}
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={SITE.a11y.openMenu}
                data-qa="portfolio.header.menu"
                className="border-border text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none lg:hidden">
                <Menu aria-hidden className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,85vw)]">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">{SITE.nav.brand}</SheetTitle>
              </SheetHeader>
              <nav aria-label={SITE.nav.brand} className="mt-4 flex flex-col gap-1 px-4 pb-6">
                {SITE.nav.links.map((link) => (
                  <SheetClose asChild key={link.id}>
                    <a
                      href={link.href}
                      data-qa={`portfolio.header.mobile-link.${link.id}`}
                      className="text-foreground hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center rounded-lg px-4 text-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none">
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href="#commission"
                    data-qa="portfolio.header.mobile-cta"
                    className="bg-foreground text-background focus-visible:ring-ring mt-3 flex min-h-11 items-center justify-center rounded-full px-5 text-xs font-medium tracking-[0.12em] uppercase focus-visible:ring-2 focus-visible:outline-none">
                    {SITE.nav.cta}
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
