"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Wraps the public site so every motion.* animation and imperative
 * animate() call beneath it honours prefers-reduced-motion: transform and
 * layout animations are disabled (the reveal's 12px slide, the scaleX
 * progress bars, the corridor track draw), while opacity still fades.
 * This is the site-wide guarantee behind CLAUDE.md's "every animation is
 * off under prefers-reduced-motion" — without it, motion/react defaults to
 * reducedMotion:"never" and those transforms play regardless. Components
 * that manipulate value directly (AnimatedFigure, Corridor) still keep
 * their own useReducedMotion checks as belt-and-braces.
 *
 * Accepts server-rendered children unchanged — this is a thin client
 * boundary, not a render owner.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
