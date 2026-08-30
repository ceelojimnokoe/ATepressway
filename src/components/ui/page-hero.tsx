import Image from "next/image";
import { mediaRegistry, type MediaKey } from "@/content/media";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  readonly media: MediaKey;
  readonly title: string;
  readonly subtitle?: ReactNode;
  readonly priority?: boolean;
  /**
   * CSS object-position for the hero image, so an important subject isn't
   * cropped out on a given photo (e.g. "center 30%"). Defaults to centre.
   */
  readonly objectPosition?: string;
  /**
   * Scrim strength, tuned per photo from its actual brightness where the
   * text sits — not one global value for every hero. Defaults to "medium"
   * (the original values). See the three .hero-scrim-* tiers in
   * globals.css for how each was picked.
   */
  readonly scrimIntensity?: "light" | "medium" | "strong";
}

const SCRIM_CLASS = {
  light: "hero-scrim-light",
  medium: "hero-scrim",
  strong: "hero-scrim-strong",
} as const;

/**
 * Shared full-bleed page hero (Project, Design, Progress, Gallery, Contact,
 * Stakeholders). The image shows at its natural brightness — there is no
 * full-image wash. Legibility comes from a LOCALISED corner scrim
 * (`.hero-scrim`) behind the bottom-left text plus a soft text-shadow, so
 * the rest of the photo stays uncovered. The text column is capped at
 * ~672px. Responsive min-heights reserve the aspect (no layout shift) and
 * give inner-page heroes more room than before.
 */
export function PageHero({
  media,
  title,
  subtitle,
  priority = true,
  objectPosition,
  scrimIntensity = "medium",
}: PageHeroProps) {
  const asset = mediaRegistry[media];
  return (
    <section
      data-theme="dark"
      className="relative isolate flex min-h-[27rem] flex-col justify-end overflow-hidden border-b border-hairline bg-surface sm:min-h-[32rem] lg:min-h-[35rem]"
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes="100vw"
        quality={70}
        className={cn("-z-10 object-cover", !objectPosition && "object-center")}
        style={objectPosition ? { objectPosition } : undefined}
      />
      {/* Localised scrim behind the text only — no full-image overlay. */}
      <div aria-hidden="true" className={cn(SCRIM_CLASS[scrimIntensity], "absolute inset-0 -z-10")} />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-20 pb-12 sm:px-8">
        <div className="flex max-w-[42rem] flex-col gap-3">
          <h1 className="hero-text-shadow text-heading-2 text-fg sm:text-heading-1">{title}</h1>
          {subtitle && <div className="hero-text-shadow max-w-2xl text-body text-fg">{subtitle}</div>}
        </div>
      </div>
    </section>
  );
}
