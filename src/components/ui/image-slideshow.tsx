"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface SlideshowImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

interface ImageSlideshowProps {
  readonly slides: readonly SlideshowImage[];
  /** Aspect / sizing box (e.g. "aspect-[4/3]"). Reserves space → no CLS. */
  readonly className?: string;
  readonly sizes?: string;
  /** Autoplay interval in ms (0 disables). */
  readonly intervalMs?: number;
  readonly ariaLabel?: string;
}

/**
 * Contained crossfade slideshow used for the home "Journey" section.
 *
 * - Crossfade (opacity, ~800ms), never a horizontal slide.
 * - Autoplay pauses on hover, keyboard focus, and hidden tab; resumes after.
 * - Real <button> dots + prev/next, ArrowLeft/Right when focused within.
 * - prefers-reduced-motion: no autoplay, no transition (instant swap).
 * - Hydration-safe: server and client both first render slide 0; interval /
 *   visibility / motion checks live in effects and never change initial markup.
 * - Only the current slide and its immediate neighbours are mounted, so the
 *   five images don't all load at full resolution at once, and the crossfade
 *   target is always ready.
 * - The box reserves its aspect ratio via `className`, so there's no layout
 *   shift as images load.
 */
export function ImageSlideshow({
  slides,
  className,
  sizes = "100vw",
  intervalMs = 4500,
  ariaLabel = "Image slideshow",
}: ImageSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );
  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || intervalMs <= 0 || count <= 1) return;
    const id = window.setInterval(goNext, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, intervalMs, count, goNext]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const regionRef = useRef<HTMLDivElement>(null);
  function onKeyDown(e: React.KeyboardEvent) {
    if (count <= 1) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  }

  // Mount only the active slide and its neighbours (loop-aware).
  const mounted = new Set([index, (index + 1) % count, (index - 1 + count) % count]);

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className={cn("group/slideshow relative isolate overflow-hidden bg-surface-sunk", className)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-[800ms] ease-out motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          {mounted.has(i) && (
            <Image
              src={slide.src}
              alt={i === index ? slide.alt : ""}
              fill
              sizes={sizes}
              loading="lazy"
              className="object-cover"
            />
          )}
        </div>
      ))}

      {/* Controls */}
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 p-3">
          <ul className="flex items-center" data-theme="dark">
            {slides.map((slide, i) => (
              <li key={slide.src}>
                {/* Visible dot stays 8px; the button is a real tap target —
                    same h-11 w-8 hit-area convention as the corridor markers
                    and the home hero slider dots. */}
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                  className="group flex h-11 w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-2 w-2 rounded-full border border-hairline transition-colors",
                      i === index ? "border-accent bg-lime" : "bg-surface/60 group-hover:bg-surface/80",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2" data-theme="dark">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="flex min-h-11 min-w-11 items-center justify-center border border-hairline bg-surface/60 text-caption text-fg backdrop-blur-sm transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="flex min-h-11 min-w-11 items-center justify-center border border-hairline bg-surface/60 text-caption text-fg backdrop-blur-sm transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
