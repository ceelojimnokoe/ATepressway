"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Applies to every motion.* animation and useAnimation() controls.start()
 * call in its subtree — the sweep that guarantees "every animation off
 * under prefers-reduced-motion" without a manual check in each demo.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
