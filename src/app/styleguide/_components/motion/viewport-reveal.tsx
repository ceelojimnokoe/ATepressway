"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { reveal, viewport } from "@/lib/motion";

interface ViewportRevealProps {
  readonly children: ReactNode;
}

/** Wraps content with the real `viewport` config from motion.ts (once: true, amount: 0.3). */
export function ViewportReveal({ children }: ViewportRevealProps) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
      {children}
    </motion.div>
  );
}
