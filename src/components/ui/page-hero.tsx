import Image from "next/image";
import { mediaRegistry, type MediaKey } from "@/content/media";
import type { ReactNode } from "react";

interface PageHeroProps {
  readonly media: MediaKey;
  readonly title: string;
  readonly subtitle?: ReactNode;
  readonly priority?: boolean;
}

/**
 * Shared full-bleed page hero used by Project, Design and Progress: a
 * responsive image with a bottom-weighted dark overlay and the page title.
 * The image aspect is reserved by the fixed min-height, so there's no
 * layout shift while it loads.
 */
export function PageHero({ media, title, subtitle, priority = true }: PageHeroProps) {
  const asset = mediaRegistry[media];
  return (
    <section className="relative isolate flex min-h-[19rem] flex-col justify-end overflow-hidden border-b border-rule sm:min-h-[24rem]">
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes="100vw"
        quality={70}
        className="-z-10 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-void/88 via-void/50 to-void/25"
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-24 pb-12 sm:px-8">
        <h1 className="text-heading-2 text-ink-1 sm:text-heading-1">{title}</h1>
        {subtitle && <div className="max-w-2xl text-body text-ink-2">{subtitle}</div>}
      </div>
    </section>
  );
}
