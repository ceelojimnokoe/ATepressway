/**
 * Single source of truth for motion on the ATEL site.
 *
 * Components must import from here — no ad-hoc easings, durations, or
 * transitions defined inline. Animate transform/opacity only. The global
 * prefers-reduced-motion hard-stop in globals.css covers CSS transitions;
 * anything driven from here that plugs into an animation library should
 * also respect the user's OS-level reduced-motion setting at the call site.
 */

import type { Variants } from "motion/react";

/** Cubic-bezier easing curves. Mirrors --ease-* tokens in globals.css. */
export const easing = {
  standard: [0.4, 0, 0.2, 1],
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
} as const;

export type EasingName = keyof typeof easing;
export type EasingCurve = (typeof easing)[EasingName];

/**
 * Durations in seconds (animation-library convention), 150/220/320ms.
 * Mirrors --duration-* tokens in globals.css, which are in ms for CSS.
 */
export const duration = {
  fast: 0.15,
  base: 0.22,
  slow: 0.32,
  /**
   * Number count-ups only. Deliberately far longer than `slow` — a figure
   * that lands instantly reads as static text, so the run-up needs to be
   * visible. The one duration allowed outside the 150/220/320ms budget.
   */
  count: 1.8,
} as const;

export type DurationName = keyof typeof duration;

interface SpringConfig {
  readonly type: "spring";
  readonly stiffness: number;
  readonly damping: number;
  readonly mass: number;
}

/**
 * Spring configs for elements the user directly manipulates (drag, press,
 * toggle). Springs respond to interruption and velocity the way eased
 * curves can't, so anything under the user's hand should use one of these
 * rather than a duration/easing pair.
 */
export const spring: Record<"drag" | "press" | "toggle", SpringConfig> = {
  drag: { type: "spring", stiffness: 400, damping: 40, mass: 1 },
  press: { type: "spring", stiffness: 600, damping: 35, mass: 0.7 },
  toggle: { type: "spring", stiffness: 500, damping: 30, mass: 0.9 },
};

interface TransitionConfig {
  readonly duration: number;
  readonly ease: EasingCurve;
}

/**
 * Typed against motion's own `Variants` (not a hand-rolled shape) — these
 * are consumed directly via the `variants` prop, which requires the
 * library's string-indexed type, not just a structurally similar object.
 *
 * Deliberately small: a 12px rise + fade, not a dramatic entrance.
 * Restraint is the point — this should read as a settle, not a swoop.
 */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easing.out },
  },
};

/** Wraps a group of `reveal` children with a 40ms stagger between them. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

interface BarFillVariant {
  readonly hidden: { readonly scaleX: number };
  readonly visible: (value: number) => {
    readonly scaleX: number;
    readonly transition: TransitionConfig;
  };
}

/**
 * Progress/stat bars animate via scaleX, never width, to keep motion on
 * the compositor (transform/opacity only). The element this is applied to
 * must set `transform-origin: left` or the scale will grow from centre.
 */
export const barFill: BarFillVariant = {
  hidden: { scaleX: 0 },
  visible: (value: number) => ({
    scaleX: value,
    transition: { duration: duration.slow, ease: easing.standard },
  }),
};

interface ViewportConfig {
  readonly once: boolean;
  readonly amount: number;
}

/** Standard viewport trigger for scroll-linked reveals: fire once, at 30% visible. */
export const viewport: ViewportConfig = {
  once: true,
  amount: 0.3,
};

interface TrackDrawVariant {
  readonly hidden: { readonly scaleX: number };
  readonly visible: {
    readonly scaleX: number;
    readonly transition: TransitionConfig;
  };
}

/**
 * Corridor's signature scroll-in: the track draws left-to-right once,
 * scaleX from an origin-left element. Segments reveal in sequence as a
 * side effect of the sweep, no separate per-segment stagger needed.
 * Deliberately longer than duration.slow (320ms) — the one named
 * exception to the site's motion budget, for the one named signature
 * moment.
 */
export const trackDraw: TrackDrawVariant = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.65, ease: easing.standard },
  },
};

/** Transition for number count-ups (KeyFigures, stats, hero figures). Fires once. */
export const countUp: TransitionConfig = {
  duration: duration.count,
  ease: easing.out,
};
