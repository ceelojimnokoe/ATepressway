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
export function HeroSlider({ slides, className, children }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

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
      className={cn("relative isolate overflow-hidden", className)}
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
      ))}

      {/* Dark overlay — deepest at the bottom where the hero text sits. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/55 to-void/30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-tr from-void/70 via-transparent to-transparent" />

      {children}

      {/* Controls — absolute so content owns the height. */}
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-5xl items-center gap-3 px-4 pb-6 sm:px-8">
        <div className="flex gap-2" role="group" aria-label="Slider navigation">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="border border-rule bg-void/50 px-3 py-2 text-caption text-ink-1 backdrop-blur-sm hover:text-lime/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="border border-rule bg-void/50 px-3 py-2 text-caption text-ink-1 backdrop-blur-sm hover:text-lime/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
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
