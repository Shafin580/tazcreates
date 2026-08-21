"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { SITE } from "@/content/site";
import { REVEAL_VIEWPORT, Reveal, useRevealVariants } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";

export function ReviewsSection() {
  const prefersReducedMotion = useReducedMotionPreference();
  const { parent, child } = useRevealVariants(SITE.reviews.items.length);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const collageYRaw = useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : 60, -40]);
  const collageY = useSpring(collageYRaw, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section ref={ref} id="reviews" className="px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.reviews.eyebrow}</p>
          </Reveal>
          <KineticHeading
            text={SITE.reviews.title}
            className="text-foreground mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold"
          />

          <motion.ul
            variants={parent}
            initial="hidden"
            whileInView="shown"
            viewport={REVEAL_VIEWPORT}
            className="mt-12 space-y-10">
            {SITE.reviews.items.map((review) => (
              <motion.li key={review.id} variants={child}>
                <figure className="flex gap-5">
                  <Image
                    src={review.artwork}
                    alt={review.alt}
                    width={160}
                    height={200}
                    sizes="88px"
                    className="border-border size-[5.5rem] shrink-0 rounded-xl border object-cover"
                  />
                  <div className="min-w-0">
                    <blockquote className="text-foreground text-lg leading-relaxed text-pretty">
                      <p>{review.quote}</p>
                    </blockquote>
                    <figcaption className="font-hand text-secondary mt-2 text-2xl">
                      {review.name}
                    </figcaption>
                  </div>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div style={{ y: collageY }} className="relative self-center">
          <Reveal direction="left" delay={0.1}>
            <Image
              src={SITE.reviews.collage.src}
              alt={SITE.reviews.collage.alt}
              width={SITE.reviews.collage.width}
              height={SITE.reviews.collage.height}
              sizes="(max-width: 1024px) 92vw, 40vw"
              className="border-border h-auto w-full rounded-[1.75rem] border shadow-[0_30px_70px_-45px_rgba(26,20,22,0.6)]"
            />
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
