"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { countUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface AnimatedFigureProps {
  readonly value: number;
  readonly decimals?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly signal?: boolean;
  /** Group the integer part with thousands separators (e.g. 1,095). */
  readonly separator?: boolean;
  /**
   * When the count-up runs. "inView" (default) waits for the figure to be
   * scrolled into view; "load" starts as soon as it mounts — for figures
   * above the fold, which are already visible and would otherwise never
   * animate.
   */
  readonly trigger?: "inView" | "load";
  readonly className?: string;
}

function formatValue(value: number, decimals: number, separator: boolean): string {
  const fixed = value.toFixed(decimals);
  if (!separator) return fixed;
  const [whole, fraction] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/**
 * Figure that counts up from 0 once, when scrolled into view — for
 * confirmed, static facts revealed by scroll (KeyFigures, stat blocks).
 *
 * It renders its FINAL value on the server and in the first client render,
 * so the correct number is shown without JavaScript and there is no
 * hydration mismatch. Only when motion is allowed does a layout effect
 * reset it to 0 (before paint, so no flash) and let it count up on scroll.
 * Reduced-motion users keep the final value with no animation.
 */
export function AnimatedFigure({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  signal = false,
  separator = false,
  trigger = "inView",
  className,
}: AnimatedFigureProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const scrolledIntoView = useInView(ref, { once: true, amount: 0.4 });
  const inView = trigger === "load" ? true : scrolledIntoView;
  const reducedMotion = useReducedMotion();
  // Seed with the final value: server + first client render agree, and any
  // no-JS / failed-hydration path shows the correct number.
  const [display, setDisplay] = useState(value);
  const willAnimate = useRef(false);

  // Before paint, if we're going to animate, drop to 0 so the count-up has
  // somewhere to start from — off-screen figures never flash the final value.
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    willAnimate.current = true;
    setDisplay(0);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !willAnimate.current) return;
    if (!inView) return;
    const controls = animate(0, value, { ...countUp, onUpdate: setDisplay });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className={cn("figure", signal ? "text-accent" : "text-fg", className)}>
      {prefix}
      {formatValue(display, decimals, separator)}
      {suffix}
    </span>
  );
}
