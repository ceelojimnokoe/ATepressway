"use client";

import { motion, useReducedMotion } from "motion/react";
import { easing } from "@/lib/motion";

/**
 * A discreet "scroll to explore" indicator: a label and a track down which
 * a short line loops. The loop is motion-safe only — reduced-motion users
 * see the static indicator. Decorative wrapper is aria-hidden; the label
 * text remains for context.
 */
export function ScrollCue() {
  const reduced = useReducedMotion();
  return (
    <div className="flex items-center gap-3 text-caption text-ink-2 tracking-wide uppercase">
      <span>Scroll to explore</span>
      <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-rule">
        <motion.span
          className="absolute inset-x-0 top-0 block h-3 bg-lime"
          initial={{ y: -12 }}
          animate={reduced ? { y: 10 } : { y: 32 }}
          transition={reduced ? { duration: 0 } : { duration: 1.6, ease: easing.in, repeat: Infinity, repeatDelay: 0.2 }}
        />
      </span>
    </div>
  );
}
