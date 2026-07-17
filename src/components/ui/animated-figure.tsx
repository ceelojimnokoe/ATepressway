"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { countUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface AnimatedFigureProps {
  readonly value: number;
  readonly decimals?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly signal?: boolean;
  readonly className?: string;
}

/**
 * Figure that counts up from 0 once, when scrolled into view — for
 * confirmed, static facts revealed by scroll (KeyFigures, stat blocks).
 * Not for the Corridor readout: that value is driven directly by the
 * user's scrubber, not a scroll reveal, so counting it up would fight
 * their input rather than earn its place.
 */
export function AnimatedFigure({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  signal = false,
  className,
}: AnimatedFigureProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reducedMotion = useReducedMotion();
  // Always start at 0 so server and first client render agree — the
  // server has no matchMedia, so seeding from `reducedMotion` here would
  // mismatch (server 0 vs client `value`) and fail hydration for anyone
  // with reduced motion enabled. The effect below jumps straight to the
  // final value for those users, once, after hydration.
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      ...countUp,
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className={cn("figure", signal ? "text-lime" : "text-ink-1", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
