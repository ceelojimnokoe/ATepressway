"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface Slide {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

interface HeroSliderProps {
  readonly slides: readonly Slide[];
  readonly className?: string;
  /** Overlaid hero content (title, copy, figures). */
  readonly children?: ReactNode;
}

const INTERVAL_MS = 3000;

/**
 * Automatic fading image slider for the homepage hero.
 *
 * Hydration-safe: the first render on server and client both show slide 0
 * — the interval, visibility and motion checks all live in effects and
 * never change the initial markup. Auto-advance pauses when the tab is
 * hidden and on hover/keyboard focus, and does not run at all for users
 * who prefer reduced motion (they navigate with the controls; the
 * crossfade and Ken Burns collapse to static via the global
 * reduced-motion CSS). Slides crossfade with opacity and push with a
 * transform — no layout-affecting properties, no layout shift.
 */
export function HeroSlider({ slides, className, children }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Auto-advance — client-only, respects reduced motion, pausable.
  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(goNext, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count, goNext]);

  // Pause while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section
      className={cn("relative isolate flex flex-col justify-end overflow-hidden", className)}
      aria-roledescription="carousel"
      aria-label="Project images"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-700 ease-out",
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
              i === index && "motion-safe:animate-[ken-burns_5s_ease-out_forwards]",
            )}
          />
        </div>
      ))}

      {/* Dark overlay — heaviest at the bottom-left where the hero text sits. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-void/85 via-void/45 to-void/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-tr from-void/70 via-transparent to-transparent" />

      {children}

      {/* Controls */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center gap-4 px-4 pb-6 sm:px-8">
        <div className="flex gap-2" role="group" aria-label="Slider navigation">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="border border-rule bg-void/60 px-3 py-2 text-caption text-ink-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime hover:text-lime/70"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="border border-rule bg-void/60 px-3 py-2 text-caption text-ink-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime hover:text-lime/70"
          >
            ›
          </button>
        </div>
        <ul className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <li key={slide.src}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "block h-2 w-2 rounded-full border border-rule focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime",
                  i === index ? "bg-lime" : "bg-void/60",
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
