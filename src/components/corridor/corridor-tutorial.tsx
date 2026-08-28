"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  { title: "Drag the handle", body: "Slide it along the corridor to read any point by kilometre." },
  { title: "Select a point", body: "Tap an interchange, boundary or endpoint — on the bar or in the cards below." },
  { title: "Read its detail", body: "Its chainage, section, completion and proposed-design images appear." },
] as const;

/**
 * A small looping demonstration of the interaction: a lime handle slides
 * between points and pulses on arrival. Purely decorative (aria-hidden) and
 * only rendered when motion is allowed. The moving layer is full-width and
 * translated by a percentage (transform, not `left`), clipped by the track's
 * overflow so it never bleeds out.
 */
function MiniDemo() {
  const stops = [12, 50, 82];
  return (
    <div
      aria-hidden="true"
      className="relative h-10 w-full overflow-hidden border border-hairline bg-surface-sunk"
    >
      <div className="absolute inset-x-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-raised" />
      {stops.map((s) => (
        <span
          key={s}
          style={{ left: `${s}%` }}
          className="absolute top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg bg-surface-raised"
        />
      ))}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full">
        <motion.div
          className="absolute inset-y-0 left-0 w-full"
          initial={{ x: "12%" }}
          animate={{ x: ["12%", "50%", "82%", "50%", "12%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.28, 0.55, 0.8, 1] }}
        >
          <motion.span
            className="absolute top-1/2 left-0 block h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg bg-lime"
            animate={{ scale: [1, 1, 1.35, 1, 1.35, 1, 1] }}
            transition={{ duration: 5, repeat: Infinity, times: [0, 0.26, 0.3, 0.53, 0.57, 0.82, 1] }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Corridor explorer walkthrough. It NEVER appears on its own — it opens only
 * when the visitor clicks the "How it works" control, and closes on dismiss
 * (no first-visit auto-show, no "seen it" storage). Under
 * prefers-reduced-motion it drops the animated demo and shows the same
 * information as a plain labelled list of steps.
 */
export function CorridorTutorial() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Esc closes the panel while it's open.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-1.5 border border-hairline px-3 py-1.5 text-caption text-fg-muted uppercase tracking-wide transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span aria-hidden="true" className="figure">?</span> How it works
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-label="How to use the corridor explorer"
          className="flex flex-col gap-4 border-l-2 border-accent bg-surface-raised p-5 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-heading-4 text-fg">How to explore the corridor</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss"
              className="figure -mt-1 shrink-0 px-2 text-body text-fg-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              ×
            </button>
          </div>

          {!reduced && <MiniDemo />}

          <ol className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-1 gap-3">
                <span className="figure flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent bg-lime text-caption text-void">
                  {index + 1}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-small text-fg">{step.title}</span>
                  <span className="text-caption text-fg-muted">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-accent bg-lime px-4 py-2 text-caption tracking-wide text-void uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
