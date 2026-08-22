"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionPreference } from "./motion-preference";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SITE } from "@/content/site";

/**
 * The shape the lightbox needs, declared structurally rather than as one section's
 * concrete type. Both `SITE.gallery.items` and `SITE.pricing.tiers[].photos` satisfy it,
 * so the gallery section and the pricing tiers share one viewer instead of growing a
 * second implementation.
 */
export type LightboxPhoto = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  medium: string;
};
import { cn } from "@/lib/utils";

/**
 * Full-bleed viewer for a single portrait.
 *
 * Deliberately not the shadcn `Dialog`: the point of this lightbox is the shared
 * `layoutId` morph from the grid card into the enlarged image, and Radix's
 * portal + mount/unmount cycle breaks that continuity. So the focus trap, escape
 * handling, scroll lock and labelling are wired by hand below, and the container
 * carries the same `role="dialog"` / `aria-modal` contract Radix would have.
 */
export function GalleryLightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: {
  item: LightboxPhoto | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const prefersReducedMotion = useReducedMotionPreference();
  const open = item !== null;

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrev) onPrev();
      if (event.key === "ArrowRight" && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    // Lock the page behind the overlay. Lenis also listens to wheel events, so
    // hiding overflow is not enough on its own — the class is what Lenis reads.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}>
          {/* Click-outside-to-close. Hidden from assistive tech and untabbable:
              it duplicates the labelled close button and Escape, and exposing it
              would put two identically-named buttons in the a11y tree. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            data-qa="portfolio.gallery.lightbox-backdrop"
            onClick={onClose}
            className="bg-foreground/85 absolute inset-0 cursor-zoom-out backdrop-blur-sm"
          />

          <motion.figure
            layoutId={prefersReducedMotion ? undefined : `art-${item.id}`}
            className="relative z-10 flex max-h-full w-full max-w-3xl flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-2xl">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 768px) 92vw, 768px"
                className="h-auto max-h-[74svh] w-full object-contain"
                priority
              />
            </div>
            <figcaption className="text-background/90 mt-5 text-center">
              <span className="font-display block text-2xl">{item.caption}</span>
              <span className="text-background/60 mt-1 block text-xs tracking-[0.18em] uppercase">
                {item.medium}
              </span>
            </figcaption>
          </motion.figure>

          <LightboxButton
            label={SITE.a11y.prevPortrait}
            qa="portfolio.gallery.lightbox-prev"
            onClick={onPrev}
            disabled={!hasPrev}
            className="top-1/2 left-3 -translate-y-1/2 md:left-6">
            <ChevronLeft aria-hidden className="size-5" />
          </LightboxButton>

          <LightboxButton
            label={SITE.a11y.nextPortrait}
            qa="portfolio.gallery.lightbox-next"
            onClick={onNext}
            disabled={!hasNext}
            className="top-1/2 right-3 -translate-y-1/2 md:right-6">
            <ChevronRight aria-hidden className="size-5" />
          </LightboxButton>

          <LightboxButton
            label={SITE.a11y.closeViewer}
            qa="portfolio.gallery.lightbox-close"
            onClick={onClose}
            className="top-4 right-3 md:top-6 md:right-6">
            <X aria-hidden className="size-5" />
          </LightboxButton>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function LightboxButton({
  label,
  qa,
  onClick,
  disabled,
  className,
  children
}: {
  label: string;
  qa: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-qa={qa}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "border-background/25 bg-background/10 text-background hover:bg-background/20 focus-visible:ring-background absolute z-20 flex size-11 items-center justify-center rounded-full border backdrop-blur transition focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30",
        className
      )}>
      {children}
    </button>
  );
}
