"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { ArrowUpRight, Images } from "lucide-react";
import { useState } from "react";
import { SITE, type TierPhoto } from "@/content/site";
import { GalleryLightbox } from "./gallery-lightbox";
import { REVEAL_VIEWPORT, Reveal, useRevealVariants } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";
import { Bloom } from "./primitives/bloom";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const prefersReducedMotion = useReducedMotionPreference();
  const { parent, child } = useRevealVariants(SITE.pricing.tiers.length);

  /**
   * Which tier's gallery is open, and where in it. Held as a pair so prev/next stays
   * inside the tier the visitor opened — moving from the last Solo piece into the Duo
   * set would misrepresent what they are looking at.
   */
  const [open, setOpen] = useState<{ tierId: string; index: number } | null>(null);
  const openTier = open ? SITE.pricing.tiers.find((t) => t.id === open.tierId) : undefined;
  const openPhotos: readonly TierPhoto[] = openTier ? openTier.photos : [];
  const activePhoto = open && openPhotos.length ? (openPhotos[open.index] ?? null) : null;

  return (
    <section
      id="pricing"
      className="bg-paper-deep border-border relative overflow-hidden border-y px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <Bloom tone="blush" size={560} className="-bottom-40 left-1/4" drift={-60} />

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-16 max-w-2xl text-center">
          <Reveal>
            <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.pricing.eyebrow}</p>
          </Reveal>
          <KineticHeading
            text={SITE.pricing.title}
            className="text-foreground mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold"
          />
          <Reveal delay={0.15}>
            <p className="text-ink-muted mt-5 text-lg text-balance">{SITE.pricing.body}</p>
          </Reveal>
        </header>

        <motion.ul
          variants={parent}
          initial="hidden"
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid gap-8 md:grid-cols-3">
          {SITE.pricing.tiers.map((tier) => {
            const featured = "featured" in tier && tier.featured;
            return (
              <motion.li
                key={tier.id}
                variants={child}
                // The hover spring lives on `whileHover`, NOT as a component-level
                // `transition`. A component-level transition overrides the variant's
                // own, which meant the reveal ignored the velocity gate's zero-duration
                // setting and sprang in slowly during a fast scroll — leaving a card
                // visibly half-faded on screen.
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -8, transition: { type: "spring", stiffness: 240, damping: 22 } }
                }
                className={cn(
                  "bg-card border-border relative flex flex-col overflow-hidden rounded-[1.75rem] border",
                  featured
                    ? "border-primary/40 shadow-[0_30px_70px_-40px_rgba(201,100,127,0.75)] md:-translate-y-4"
                    : "shadow-[0_20px_50px_-40px_rgba(26,20,22,0.5)]"
                )}>
                {(() => {
                  const cover = tier.photos[0];
                  const count = tier.photos.length;

                  // A single-photo tier stays a plain image. Wrapping one photo in a
                  // control that says "1 photo" would promise a gallery that does not
                  // exist — Group has exactly one piece.
                  if (count < 2) {
                    return (
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={cover.src}
                          alt={cover.alt}
                          fill
                          sizes="(max-width: 768px) 92vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    );
                  }

                  return (
                    <button
                      type="button"
                      onClick={() => setOpen({ tierId: tier.id, index: 0 })}
                      data-qa={`portfolio.pricing.gallery.${tier.id}`}
                      aria-label={`${SITE.pricing.viewGallery} — ${tier.tier}, ${count} ${SITE.pricing.photosLabel}`}
                      className="group/gallery focus-visible:ring-ring focus-visible:ring-offset-background relative block aspect-square w-full cursor-zoom-in overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(max-width: 768px) 92vw, 30vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover/gallery:scale-[1.03]"
                      />
                      {/* Count affordance: without it the image reads as decoration and
                          nobody discovers the other pieces. */}
                      <span
                        aria-hidden
                        className="bg-foreground/75 text-background absolute right-3 bottom-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium tracking-[0.08em] uppercase backdrop-blur-sm">
                        <Images className="size-3.5" />
                        {count} {SITE.pricing.photosLabel}
                      </span>
                    </button>
                  );
                })()}

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-foreground text-3xl">{tier.tier}</h3>
                    <p className="font-display text-primary text-4xl">{tier.price}</p>
                  </div>
                  <p className="text-ink-faint mt-2 text-xs tracking-[0.16em] uppercase">
                    {tier.people}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        <GalleryLightbox
          item={activePhoto}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((o) => (o && o.index > 0 ? { ...o, index: o.index - 1 } : o))}
          onNext={() =>
            setOpen((o) =>
              o && o.index < openPhotos.length - 1 ? { ...o, index: o.index + 1 } : o
            )
          }
          hasPrev={open !== null && open.index > 0}
          hasNext={open !== null && open.index < openPhotos.length - 1}
        />

        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col items-center gap-6 text-center">
            <p className="text-ink-faint text-sm">{SITE.pricing.note}</p>
            <a
              href={SITE.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-qa="portfolio.pricing.cta"
              className="group bg-foreground text-background hover:bg-secondary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium tracking-[0.14em] uppercase transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
              {SITE.cta.primary}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
