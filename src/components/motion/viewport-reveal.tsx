"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { reveal, viewport } from "@/lib/motion";

interface ViewportRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * The only motion this site's Server Component sections use: a single
 * reveal, triggered once when scrolled into view. This is the leaf —
 * wrapping server-rendered content in this doesn't make the section
 * itself a Client Component.
 */
export function ViewportReveal({ children, className }: ViewportRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={reveal}
      className={className}
    >
      {children}
    </motion.div>
  );
}
