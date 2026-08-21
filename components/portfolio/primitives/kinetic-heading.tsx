"use client";

import { motion } from "framer-motion";
import { useReducedMotionPreference } from "../motion-preference";
import { cn } from "@/lib/utils";

/**
 * Display heading whose characters arrive one at a time.
 *
 * The whole string is exposed to assistive tech as a single label via
 * `aria-label`, and the per-character spans are hidden from it — otherwise a
 * screen reader announces the heading one letter at a time.
 *
 * Under reduced motion the characters are not split at all; the heading renders
 * as plain text with a single fade.
 */
export function KineticHeading({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  once = true
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotionPreference();

  if (prefersReducedMotion) {
    return (
      <Tag className={cn("font-display", className)}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once, amount: 0.01, margin: "0px 0px 25% 0px" }}
          transition={{ duration: 0.3 }}>
          {text}
        </motion.span>
      </Tag>
    );
  }

  const words = text.split(" ");

  return (
    <Tag className={cn("font-display", className)} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        whileInView="shown"
        viewport={{ once, amount: 0.01, margin: "0px 0px 25% 0px" }}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: 0.015, delayChildren: delay } }
        }}>
        {words.map((word, wordIndex) => (
          // Each word is its own inline-block so lines break between words, never
          // mid-word, while the characters inside still animate individually.
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${char}-${charIndex}`}
                className="inline-block will-change-transform"
                variants={{
                  hidden: { opacity: 0, y: "0.4em", rotate: -4 },
                  shown: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  }
                }}>
                {char}
              </motion.span>
            ))}
            {wordIndex < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
