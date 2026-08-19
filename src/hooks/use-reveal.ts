"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Runs a layout effect on the client and a plain effect on the server
 * render pass — avoids React's "useLayoutEffect does nothing on the
 * server" warning while still arming reveals before the browser paints
 * (so there is never a flash of visible-then-hidden content).
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface UseRevealOptions {
  /** Reveal only once (default) or re-hide when scrolled back out. */
  readonly once?: boolean;
  /** IntersectionObserver threshold, 0–1. */
  readonly amount?: number;
  /** IntersectionObserver rootMargin. */
  readonly rootMargin?: string;
}

/**
 * Attach the returned ref to the element that should reveal on scroll.
 *
 * The element renders fully visible; this hook is the ONLY thing that
 * hides it (by adding `.reveal-armed`, which the CSS in globals.css keys
 * the hidden pre-state off). It then adds `.is-visible` to play the
 * entrance — on the next frame for elements already on screen, or when
 * the IntersectionObserver reports them entering the viewport.
 *
 * Because hiding depends on this client-only hook running, any failure
 * path — no JS, a hydration crash, an unsupported observer, or
 * prefers-reduced-motion — leaves the content in its final, visible
 * state. There is no way for it to get stuck hidden.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: UseRevealOptions = {}) {
  const { once = true, amount = 0.2, rootMargin = "0px 0px -8% 0px" } = options;
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion or no observer support: show the final state at once,
    // never arm (so nothing is ever hidden).
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    // Arm (hide) before paint, so there is no visible flash.
    el.classList.add("reveal-armed");

    const rect = el.getBoundingClientRect();
    const alreadyOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

    let raf = 0;
    let observer: IntersectionObserver | null = null;

    if (alreadyOnScreen) {
      // Reveal next frame so the entrance transition still plays.
      raf = window.requestAnimationFrame(() => el.classList.add("is-visible"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // Reveal when the element is intersecting OR has already reached /
            // passed the viewport top. The second case makes this robust to
            // fast scrolling (a fling can carry an element in and out between
            // coalesced observer callbacks; without it, such elements would
            // stay armed-but-hidden — exactly the failure we're fixing).
            const viewportBottom = entry.rootBounds?.bottom ?? window.innerHeight;
            const reached = entry.isIntersecting || entry.boundingClientRect.top < viewportBottom;
            if (reached) {
              entry.target.classList.add("is-visible");
              if (once) observer?.unobserve(entry.target);
            } else if (!once) {
              entry.target.classList.remove("is-visible");
            }
          }
        },
        // threshold 0, NOT `amount`: a section taller than (viewport / amount)
        // can never reach `amount` (e.g. 30%) visibility, so with a positive
        // threshold the callback never fires and the element stays armed-hidden
        // forever. This was the mobile bug — tall sections (esp. the Board of
        // Directors, one column and very tall on a phone) never revealed unless
        // the page happened to load already scrolled to them. Firing on any
        // intersection (threshold 0) + the rootMargin below triggers reliably at
        // every height; `rootMargin`'s -8% still holds the entrance until the
        // element is a little into view. `amount` is kept for API compatibility.
        { threshold: 0, rootMargin },
      );
      observer.observe(el);
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [once, amount, rootMargin]);

  return ref;
}
