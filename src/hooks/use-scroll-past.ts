"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * True once the page has scrolled past `threshold` pixels. Uses the
 * library's scroll value and only flips React state when the boundary is
 * crossed — no per-pixel re-renders, no manual scroll listener to clean
 * up. Used to switch the header from transparent to a solid/blurred state.
 */
export function useScrollPast(threshold = 24): boolean {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > threshold;
    setPast((prev) => (prev === next ? prev : next));
  });

  return past;
}
