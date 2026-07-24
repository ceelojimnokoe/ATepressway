"use client";

import { AnimatePresence, motion } from "motion/react";
import { reveal } from "@/lib/motion";
import { useScrollPast } from "@/hooks/use-scroll-past";

const APPEAR_AFTER_PX = 600;

/**
 * Bottom-centre "back to top" control. Appears once the page is scrolled
 * past {@link APPEAR_AFTER_PX}, fading and rising in with the shared
 * `reveal` variants from lib/motion.ts — no bespoke variant.
 *
 * The fixed centring lives on a wrapper, not the animated element: motion
 * writes `transform` inline, which would overwrite a `-translate-x-1/2`
 * utility and throw the button to the left edge.
 *
 * Reduced motion: the site-wide MotionConfig drops the rise (keeping the
 * fade), and the scroll itself jumps instead of smooth-scrolling.
 */
export function ScrollToTop() {
  const visible = useScrollPast(APPEAR_AFTER_PX);

  function toTop() {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center"
    >
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            variants={reveal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="pointer-events-auto inline-flex items-center gap-2 border border-hairline bg-surface/80 px-4 py-2.5 text-caption tracking-wide text-fg uppercase backdrop-blur-md transition-colors duration-200 ease-out hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span aria-hidden="true">↑</span>
            Top
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
