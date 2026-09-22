"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * A thin lime bar pinned to the top of the viewport that fills as the page
 * scrolls. Driven by the library's scroll value (no manual scroll
 * listeners or per-frame React state) and animated with scaleX only.
 * Decorative, so aria-hidden.
 *
 * The spring smoothing is itself motion (it can overshoot/settle rather
 * than track 1:1), and — being a MotionValue applied outside a CSS
 * transition/animation — it isn't caught by the global
 * prefers-reduced-motion rule in globals.css the way ordinary transitions
 * are. So it's skipped explicitly here (pre-launch review, Stage 7, 22
 * Sept 2026): under reduced motion the bar still fills with scroll, just
 * without the spring.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const springX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const scaleX = reduced ? scrollYProgress : springX;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-lime"
    />
  );
}
