"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { SITE, type GalleryItem } from "@/content/site";
import { REVEAL_VIEWPORT, Reveal, useRevealVariants } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";
import { GalleryLightbox } from "./gallery-lightbox";

const items = SITE.gallery.items;

export function GallerySection() {
  const prefersReducedMotion = useReducedMotionPreference();
  const { parent, child } = useRevealVariants(items.length);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const active: GalleryItem | null = openIndex === null ? null : items[openIndex];

  return (
    <section id="work" className="relative px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 max-w-2xl">
          <Reveal>
            <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.gallery.eyebrow}</p>
          </Reveal>
          <KineticHeading
            text={SITE.gallery.title}
            className="text-foreground mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold"
          />
          <Reveal delay={0.15}>
            <p className="text-ink-muted mt-5 text-lg">{SITE.gallery.body}</p>
          </Reveal>
        </header>

        {/* CSS columns give a true masonry flow with no layout library and no
            measurement pass. `break-inside-avoid` is what keeps a card whole. */}
        <motion.ul
          variants={parent}
          initial="hidden"
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <motion.li key={item.id} variants={child} className="mb-6 break-inside-avoid">
              <motion.button
                type="button"
                layoutId={prefersReducedMotion ? undefined : `art-${item.id}`}
                onClick={() => setOpenIndex(index)}
                data-qa={`portfolio.gallery.card.${item.id}`}
                aria-label={`${SITE.a11y.openPortrait}: ${item.caption}`}
                whileHover={prefersReducedMotion ? undefined : { y: -6, rotate: -0.6 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="group border-border focus-visible:ring-ring focus-visible:ring-offset-background bg-card block w-full cursor-zoom-in overflow-hidden rounded-2xl border text-left shadow-[0_18px_50px_-32px_rgba(26,20,22,0.55)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                <span className="relative block overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </span>
                <span className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <span className="font-display text-foreground text-xl">{item.caption}</span>
                  <span className="text-ink-faint text-[0.7rem] tracking-[0.16em] whitespace-nowrap uppercase">
                    {item.medium}
                  </span>
                </span>
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <GalleryLightbox
        item={active}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i === null || i === 0 ? i : i - 1))}
        onNext={() => setOpenIndex((i) => (i === null || i === items.length - 1 ? i : i + 1))}
        hasPrev={openIndex !== null && openIndex > 0}
        hasNext={openIndex !== null && openIndex < items.length - 1}
      />
    </section>
  );
}
