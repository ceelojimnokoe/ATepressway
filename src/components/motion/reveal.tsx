"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Delay before the entrance, in seconds. */
  readonly delay?: number;
  /** Shift distance in px before settling. */
  readonly distance?: number;
  readonly direction?: RevealDirection;
  readonly once?: boolean;
  readonly amount?: number;
  /** Entrance duration, in seconds. */
  readonly duration?: number;
}

function offsetVars(direction: RevealDirection, distance: number): Record<string, string> {
  switch (direction) {
    case "up":
      return { "--reveal-y": `${distance}px` };
    case "down":
      return { "--reveal-y": `${-distance}px` };
    case "left":
      return { "--reveal-x": `${distance}px` };
    case "right":
      return { "--reveal-x": `${-distance}px` };
    default:
      return { "--reveal-y": "0px" };
  }
}

/**
 * Scroll-triggered entrance: a fade plus a small directional shift, once.
 * Content renders fully visible; the fade/shift is applied purely as a
 * client-side enhancement (see {@link useReveal} and the reveal CSS in
 * globals.css), so it can never leave the content hidden. Reduced-motion
 * users get the content immediately, in place.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  direction = "up",
  once = true,
  amount = 0.2,
  duration,
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>({ once, amount });
  const style = {
    ...offsetVars(direction, distance),
    "--reveal-delay": `${delay}s`,
    ...(duration ? { "--reveal-duration": `${duration}s` } : null),
  } as CSSProperties;

  return (
    <div ref={ref} data-reveal className={className} style={style}>
      {children}
    </div>
  );
}

/** Reveal with no directional shift — a plain fade. */
export function FadeIn(props: Omit<RevealProps, "direction">) {
  return <Reveal {...props} direction="none" />;
}
