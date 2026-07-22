"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MagneticButtonProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Fraction of the cursor offset the element follows (kept small). */
  readonly strength?: number;
}

/**
 * Wraps an interactive child (a link or button) in a non-interactive span
 * that drifts slightly toward the cursor, then springs back. The child
 * stays the real control — no nested interactive elements. Runs only on
 * fine-pointer, non-reduced-motion devices; on touch it's inert.
 */
export function MagneticButton({ children, className, strength = 0.25 }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function handleMove(event: PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    if (event.pointerType !== "mouse") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}
