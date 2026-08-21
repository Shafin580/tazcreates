"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { SITE } from "@/content/site";
import { Bloom } from "./primitives/bloom";
import { FloatingStars } from "./primitives/floating-stars";
import { KineticHeading } from "./primitives/kinetic-heading";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotionPreference();
  const ref = useRef<HTMLElement>(null);

  // Section-local scroll progress, so the parallax is tied to this section
  // passing the viewport rather than to the whole document.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoYRaw = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -70]);
  const photoY = useSpring(photoYRaw, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const avatarYRaw = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 40]);
  const avatarY = useSpring(avatarYRaw, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const copyYRaw = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 60]);
  const copyY = useSpring(copyYRaw, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92svh] items-center overflow-hidden px-6 pt-28 pb-20 md:px-12 lg:px-20">
      <Bloom tone="blush" size={620} className="-top-40 -left-32" drift={110} />
      <Bloom tone="gold" size={420} className="top-1/3 -right-24" drift={-70} />
      <FloatingStars />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <motion.div style={{ y: copyY }} className="relative z-10">
          <motion.p
            className="font-hand text-primary text-3xl md:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            {SITE.artist.greeting}
          </motion.p>

          <KineticHeading
            as="h1"
            text={SITE.artist.name}
            delay={0.2}
            className="text-foreground mt-2 text-[clamp(3rem,9vw,7rem)] leading-[0.92] font-semibold"
          />

          <motion.p
            className="text-ink-muted mt-7 max-w-md text-lg leading-relaxed text-balance md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}>
            {SITE.artist.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-10">
            <a
              href={SITE.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-qa="portfolio.hero.cta"
              className="group border-foreground text-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-3 rounded-full border px-8 py-4 text-sm font-medium tracking-[0.14em] uppercase transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
              {SITE.cta.primary}
              <ArrowDownRight
                aria-hidden
                className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </a>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-[23rem]">
          <motion.div
            style={{ y: photoY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-border relative aspect-[3/4] overflow-hidden rounded-[2rem] border shadow-[0_30px_80px_-40px_rgba(26,20,22,0.5)]">
            <Image
              src={SITE.artist.portrait.src}
              alt={SITE.artist.portrait.alt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </motion.div>

          {/* Her own illustrated self-portrait, overlapping the photograph — the
              one place the site shows both the artist and her drawing of herself. */}
          <motion.div
            style={{ y: avatarY }}
            initial={{ opacity: 0, x: -24, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -4 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-12 -left-8 w-28 sm:-left-14 sm:w-36 lg:-left-24 lg:w-44">
            <Image
              src={SITE.artist.avatar.src}
              alt={SITE.artist.avatar.alt}
              width={551}
              height={799}
              sizes="(max-width: 768px) 128px, 208px"
              className="h-auto w-full drop-shadow-[0_18px_28px_rgba(26,20,22,0.28)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
