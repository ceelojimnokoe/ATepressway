"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

interface ParallaxProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Total travel in px across the scroll range (kept subtle). */
  readonly distance?: number;
}

/**
 * Subtle vertical parallax for media. The child should be slightly
 * oversized (e.g. an image at 115% height) inside an overflow-hidden
 * parent, so the travel never reveals an edge or shifts surrounding
 * layout. Library-managed scroll value; disabled entirely under reduced
 * motion.
 */
export function Parallax({ children, className, distance = 48 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
