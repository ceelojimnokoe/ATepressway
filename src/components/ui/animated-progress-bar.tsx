"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
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
 * colour alone.
 *
 * The fill renders at its true value by default; it only starts from zero
 * once the client arms the reveal (see globals.css `[data-reveal-bar]`).
 * So without JavaScript, on a hydration failure, or under reduced motion
 * the bar shows its real value immediately.
 */
export function AnimatedProgressBar({ label, percent, sublabel }: AnimatedProgressBarProps) {
  const ref = useReveal<HTMLDivElement>({ once: true, amount: 0.4 });
  const clamped = Math.max(0, Math.min(100, percent));

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
        <div
          ref={ref}
          data-reveal-bar
          className="h-full w-full bg-lime"
          style={{ "--bar-scale": String(clamped / 100) } as CSSProperties}
        />
      </div>
      {sublabel && <span className="text-caption text-ink-3">{sublabel}</span>}
    </div>
  );
}
