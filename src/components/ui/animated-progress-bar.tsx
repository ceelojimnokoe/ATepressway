"use client";

import { motion } from "motion/react";
import { barFill, viewport } from "@/lib/motion";
import { Figure } from "@/components/ui/figure";

interface AnimatedProgressBarProps {
  readonly label: string;
  readonly percent: number;
  readonly sublabel?: string;
}

/**
 * A labelled progress bar that fills from zero (scaleX, transform only)
 * when it scrolls into view. The percentage is always shown as text and
 * the bar carries progressbar ARIA, so the value is never conveyed by
 * colour alone. Under reduced motion the site-wide MotionConfig makes the
 * fill appear instantly at its final value.
 */
export function AnimatedProgressBar({ label, percent, sublabel }: AnimatedProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body text-ink-1">{label}</span>
        <Figure value={`${percent}%`} />
      </div>
      <div
        className="h-2 w-full overflow-hidden bg-sunk"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} progress`}
      >
        <motion.div
          initial={barFill.hidden}
          whileInView={barFill.visible(percent / 100)}
          viewport={viewport}
          className="h-full w-full origin-left bg-lime"
        />
      </div>
      {sublabel && <span className="text-caption text-ink-3">{sublabel}</span>}
    </div>
  );
}
