"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A thin lime bar pinned to the top of the viewport that fills as the page
 * scrolls. Driven by the library's scroll value (no manual scroll
 * listeners or per-frame React state) and animated with scaleX only.
 * Decorative, so aria-hidden.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, right: "var(--rail-collapsed)" }}
      className="fixed top-0 left-0 z-[60] h-0.5 origin-left bg-lime"
    />
  );
}
