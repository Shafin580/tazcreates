"use client";

import { SITE } from "@/content/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Reveal } from "./primitives/reveal";
import { KineticHeading } from "./primitives/kinetic-heading";
import { Bloom } from "./primitives/bloom";

/**
 * The commission FAQ.
 *
 * Doubles as the source for `faqSchema()` on the page — the questions here are the
 * exact strings that go into JSON-LD, so the two cannot drift. Question-shaped `h3`s
 * are what answer engines match conversational queries against, which is why each item
 * is a full question rather than a keyword.
 */
export function FaqSection() {
  return (
    <section id="faq" className="relative px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <Bloom tone="gold" size={420} className="top-16 -left-20" drift={60} />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.faq.eyebrow}</p>
          </Reveal>
          <KineticHeading
            text={SITE.faq.title}
            className="text-foreground mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold"
          />
        </div>

        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="w-full">
            {SITE.faq.items.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger
                  data-qa={`portfolio.faq.trigger.${index}`}
                  className="font-display text-foreground py-5 text-left text-lg hover:no-underline md:text-xl">
                  {/* No inner heading element: `AccordionTrigger` already renders an
                      <h3> wrapper, so nesting one gives h3 > button > h3 — a duplicate
                      heading in the outline and invalid nesting. */}
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-ink-muted max-w-prose pb-5 text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
