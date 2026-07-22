"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/cn";

interface ImageRevealProps {
  readonly src: string;
  readonly alt: string;
  readonly sizes?: string;
  readonly priority?: boolean;
  /** Applied to the wrapper — set the aspect ratio here (e.g. "aspect-[4/3]"). */
  readonly className?: string;
  readonly delay?: number;
}

/**
 * Masked image reveal: a void panel wipes upward while the image settles
 * from a slight zoom, once, on scroll-in. Both are handled in CSS and
 * applied only after the client arms the reveal — so without JavaScript,
 * on a hydration failure, or under reduced motion the image is simply
 * shown (no panel, no zoom). The wrapper reserves the aspect ratio, so
 * there is no layout shift; the image is lazy unless `priority`.
 */
export function ImageReveal({ src, alt, sizes = "100vw", priority, className, delay = 0 }: ImageRevealProps) {
  const ref = useReveal<HTMLDivElement>({ once: true, amount: 0.25 });

  return (
    <div
      ref={ref}
      data-reveal-cover
      className={cn("relative overflow-hidden bg-sunk", className)}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      <div data-reveal-zoom className="h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      </div>
    </div>
  );
}
