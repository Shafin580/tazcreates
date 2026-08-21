"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "../motion-preference";

/**
 * Her glossy 3D star cluster, drifting slowly behind the hero content.
 *
 * The source image is a single 800x800 arrangement of stars and pearls on
 * transparency, so it is placed once rather than tiled. Purely decorative:
 * `aria-hidden` on the wrapper and an empty `alt` keep it out of the a11y tree.
 * Under reduced motion it is placed but never moves.
 */
export function FloatingStars() {
  const prefersReducedMotion = useReducedMotionPreference();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-[6%] left-[38%] -z-10 hidden w-[26rem] lg:block"
      animate={prefersReducedMotion ? undefined : { y: [0, 16, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
      <Image
        src="/texture/glossy-stars.png"
        alt=""
        width={800}
        height={800}
        sizes="416px"
        className="h-auto w-full opacity-55"
      />
    </motion.div>
  );
}
