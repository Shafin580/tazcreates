"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { useRef } from "react";
import { SITE } from "@/content/site";
import { Reveal } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";
import { Bloom } from "./primitives/bloom";

export function AboutSection() {
  const prefersReducedMotion = useReducedMotionPreference();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The two tool photographs drift in from opposite edges as the section passes.
  const pastelsXRaw = useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : -60, 0]);
  const pastelsX = useSpring(pastelsXRaw, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const markersXRaw = useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : 70, 0]);
  const markersX = useSpring(markersXRaw, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const markersRotateRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [prefersReducedMotion ? 0 : 10, -2]
  );
  const markersRotate = useSpring(markersRotateRaw, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <Bloom tone="rose" size={480} className="top-10 right-0" drift={-90} />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Reveal>
            <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.about.eyebrow}</p>
          </Reveal>

          <KineticHeading
            text={SITE.about.title}
            className="text-foreground mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold"
          />

          <div className="mt-8 space-y-6">
            {SITE.about.body.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.1 + index * 0.08}>
                <p className="text-ink-muted max-w-lg text-lg leading-relaxed">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="font-hand text-secondary mt-8 text-3xl">{SITE.artist.signature}</p>
          </Reveal>
        </div>

        <div className="relative flex min-h-[26rem] items-center justify-center">
          <motion.div style={{ x: pastelsX }} className="relative z-10 w-1/2 max-w-[18rem]">
            <Image
              src={SITE.about.textures[0].src}
              alt={SITE.about.textures[0].alt}
              width={450}
              height={800}
              sizes="(max-width: 768px) 45vw, 18rem"
              className="h-auto w-full drop-shadow-[0_24px_40px_rgba(26,20,22,0.22)]"
            />
          </motion.div>

          <motion.div
            style={{ x: markersX, rotate: markersRotate }}
            className="relative -ml-10 w-1/2 max-w-[17rem]">
            <Image
              src={SITE.about.textures[1].src}
              alt={SITE.about.textures[1].alt}
              width={600}
              height={800}
              sizes="(max-width: 768px) 45vw, 17rem"
              className="h-auto w-full drop-shadow-[0_24px_40px_rgba(26,20,22,0.22)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
