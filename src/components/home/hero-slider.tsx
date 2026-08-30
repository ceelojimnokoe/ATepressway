"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface Slide {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  /**
   * Scrim strength for THIS slide specifically, tuned from its own measured
   * brightness where the text sits — the slider rotates several different
   * photos behind one fixed text block, so the scrim now swaps with the
   * slide rather than using one setting for all of them. Defaults to
   * "medium" (the original shared value) if a slide doesn't specify one.
   */
  readonly scrimIntensity?: "light" | "medium" | "strong";
}

const SCRIM_CLASS = {
  light: "hero-scrim-light",
  medium: "hero-scrim",
  strong: "hero-scrim-strong",
} as const;

interface HeroSliderProps {
  readonly slides: readonly Slide[];
  readonly className?: string;
  /**
   * Photo treatment behind the content:
   * - "none": no wash at all — the photo is fully visible.
   * - "scrim": a localised corner scrim behind the bottom-left text, fading
   *   to fully transparent before the subject side. Strength follows each
   *   slide's own `scrimIntensity` (see the Slide interface above), since
   *   the rotating photos aren't equally bright.
   * The former full-image dark wash is gone in both cases.
   */
  readonly overlay?: "none" | "scrim";
  /** Overlaid hero content (positions itself over the full height). */
  readonly children?: ReactNode;
}

const INTERVAL_MS = 4500;

/**
 * Automatic fading image slider used as the hero backdrop.
 *
 * Hydration-safe: server and client both first render slide 0 — the
 * interval, visibility and motion checks all live in effects and never
 * change the initial markup. Auto-advance pauses on hover, keyboard focus
 * and hidden tabs, and doesn't run at all under reduced motion (the
 * crossfade and Ken Burns collapse to static via the global reduced-motion
 * CSS; users navigate with the controls). Crossfade is opacity, Ken Burns
 * is a transform — no layout-affecting properties, no layout shift.
 * Controls are absolutely positioned so the overlaid content can own the
 * full height.
 */
export function HeroSlider({ slides, className, overlay = "none", children }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /*
   * Every slide is stacked at inset-0, so they are all technically "in the
   * viewport" and loading="lazy" defers nothing — the browser fetched all
   * four up front (~1.1MB at 1440px). Only the first slide is mounted for
   * the initial paint; the rest mount once the browser is idle, which keeps
   * them off the LCP path without breaking the crossfade.
   */
  const [mountAll, setMountAll] = useState(false);
  const count = slides.length;

  useEffect(() => {
    let timer = 0;
    // Gate on `load`, not just idle: idle can fire before the LCP image has
    // finished, which would put the other slides back on the critical path.
    // Waiting for load guarantees slide 0 (and the rest of the initial
    // payload) is done before the remaining slides are even requested.
    const schedule = () => {
      timer = window.setTimeout(() => setMountAll(true), 300);
    };
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timer);
    };
  }, []);

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(goNext, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count, goNext]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section
      data-theme="dark"
      className={cn("relative isolate overflow-hidden bg-surface", className)}
      aria-roledescription="carousel"
      aria-label="Project images"
      // Pause only while a control is focused (keyboard users) — hovering the
      // hero itself must NOT pause, or a full-viewport hero would sit paused
      // under the cursor and never auto-advance during normal reading. Hover
      // pause is scoped to the controls bar below.
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        if (i !== 0 && !mountAll) return null;
        return (
          <div
            key={slide.src}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 -z-10 transition-opacity duration-1000 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              quality={i === 0 ? 70 : 65}
              className={cn(
                "object-cover",
                i === index && "motion-safe:animate-[ken-burns_7s_ease-out_forwards]",
              )}
            />
          </div>
        );
      })}

      {/* Localised corner scrim behind the bottom-left text only — no
          full-image wash. Fades to fully transparent before the subject side
          (see the three .hero-scrim-* tiers in globals.css). Strength
          follows the CURRENT slide, since the four rotating photos vary in
          brightness and one shared value would over- or under-darken some
          of them. */}
      {overlay === "scrim" && (
        <div
          aria-hidden="true"
          className={cn(SCRIM_CLASS[slides[index]?.scrimIntensity ?? "medium"], "absolute inset-0 -z-10")}
        />
      )}

      {children}

      {/* Controls — absolute so content owns the height. Hovering the
          controls pauses auto-advance (so it doesn't move under the cursor
          while you aim at a button); hovering the hero itself does not. */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-5xl items-center gap-3 px-4 pb-6 sm:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex gap-2" role="group" aria-label="Slider navigation">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="flex min-h-11 min-w-11 items-center justify-center border border-hairline bg-surface/50 text-caption text-fg backdrop-blur-sm hover:text-accent/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="flex min-h-11 min-w-11 items-center justify-center border border-hairline bg-surface/50 text-caption text-fg backdrop-blur-sm hover:text-accent/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ›
          </button>
        </div>
        <ul className="flex items-center">
          {slides.map((slide, i) => (
            <li key={slide.src}>
              {/* The visible dot stays 8px (the established minimal look); the
                  button around it is a real tap target — the same h-11 w-8
                  hit-area convention already used for the corridor markers,
                  not a one-off size. */}
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-11 w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-2 w-2 rounded-full border border-hairline",
                    i === index ? "bg-lime" : "bg-surface/60",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
