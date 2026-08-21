"use client";

import { motion } from "framer-motion";
import { SITE } from "@/content/site";
import { REVEAL_VIEWPORT, Reveal, useRevealVariants } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";

/**
 * The four steps from enquiry to delivery.
 *
 * Answers the question a commission buyer actually has — "how does this work" — which
 * the old site never addressed. Also gives answer engines a self-contained,
 * step-by-step block, which `geo-fundamentals` §4 lists as one of the most citable
 * content shapes there is.
 */
export function ProcessSection() {
  const { parent, child } = useRevealVariants(SITE.process.steps.length);

  return (
    <section
      id="process"
      className="bg-paper-deep border-border border-y px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 max-w-2xl">
          <Reveal>
            <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.process.eyebrow}</p>
          </Reveal>
          <KineticHeading
            text={SITE.process.title}
            className="text-foreground mt-3 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] font-semibold"
          />
          <Reveal delay={0.1}>
            <p className="text-ink-muted mt-5 max-w-prose text-lg">{SITE.process.body}</p>
          </Reveal>
        </header>

        <motion.ol
          variants={parent}
          initial="hidden"
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.process.steps.map((step) => (
            <motion.li key={step.id} variants={child} className="relative">
              <p className="font-display text-primary/40 text-5xl leading-none">{step.step}</p>
              <h3 className="font-display text-foreground mt-4 text-xl">{step.title}</h3>
              <p className="text-ink-muted mt-2 max-w-prose text-base leading-relaxed">
                {step.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
