"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Figure } from "@/components/ui/figure";

interface AnimatedProgressBarProps {
  readonly label: string;
  readonly percent: number;
  readonly sublabel?: string;
  /**
   * When set, the label becomes a <button> carrying `data-lightbox-index`
   * — used to open the structure image lightbox on the Progress page. The
   * button wraps only phrasing content; the bar itself stays a sibling, so
   * this is valid markup and the bar is never nested inside the button.
   */
  readonly lightboxIndex?: number;
  readonly triggerAriaLabel?: string;
  /** Small call-to-action shown beside the label when it's interactive. */
  readonly cue?: string;
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
export function AnimatedProgressBar({
  label,
  percent,
  sublabel,
  lightboxIndex,
  triggerAriaLabel,
  cue,
}: AnimatedProgressBarProps) {
  const ref = useReveal<HTMLDivElement>({ once: true, amount: 0.4 });
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        {lightboxIndex !== undefined ? (
          <button
            type="button"
            data-lightbox-index={lightboxIndex}
            aria-label={triggerAriaLabel}
            className="group inline-flex cursor-zoom-in items-baseline gap-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="text-body text-fg transition-colors group-hover:text-accent">{label}</span>
            {cue && (
              <span className="text-caption text-accent underline decoration-from-font underline-offset-2">
                {cue}
              </span>
            )}
          </button>
        ) : (
          <span className="text-body text-fg">{label}</span>
        )}
        <Figure value={`${percent}%`} />
      </div>
      {/*
       * data-theme="dark" makes the track a dark groove regardless of page
       * theme, so the lime fill reads at ~16:1 against it (WCAG 1.4.11).
       * On a light page a lime fill on a light track would be ~1.1:1 —
       * imperceptible.
       */}
      <div
        data-theme="dark"
        className="h-2 w-full overflow-hidden bg-surface-sunk"
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
      {sublabel && <span className="text-caption text-fg-faint">{sublabel}</span>}
    </div>
  );
}
