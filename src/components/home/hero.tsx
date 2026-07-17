import Image from "next/image";
import { organization, progress, projectFacts } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { mediaRegistry } from "@/content/media";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { formatLongDate } from "@/lib/format";

const hero = mediaRegistry.heroCorridorAerial;

/**
 * First screen. The client's own aerial drone photograph of the corridor,
 * full-bleed and priority (the LCP image), carries the overall-progress
 * figure. Two stacked gradient overlays darken the photo — heaviest at
 * the bottom-left where the text sits (so the 46% reads at full contrast),
 * lightest at the top-right (so the aerial still reads). Lime appears
 * exactly once here: on the live figure. Nowhere else in the hero.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden border-b border-rule sm:min-h-[40rem]">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        // The heavy bottom-left overlay hides compression artefacts, so a
        // lower quality trims the LCP payload (notably the large retina
        // variants) with no visible cost behind the gradient.
        quality={58}
        className="-z-10 object-cover"
      />
      {/* Bottom-weighted darkening: protects the text band, lets the top read. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-void/80 via-void/35 to-void/5"
      />
      {/* Bottom-left corner emphasis, stacking with the layer above under the text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-void/70 via-transparent to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-24 pb-14 sm:px-8 sm:pb-20">
        {/* The page's accessible name and only h1. The hero's visible focus
            is the progress figure, which isn't heading text, so the h1 is
            visually hidden rather than forced into the design. */}
        <h1 className="sr-only">{organization.name} — reconstruction progress</h1>

        <PlaceholderNotice value={progress.overallPercentComplete} size="display">
          {(value) => (
            <AnimatedFigure value={value} suffix="%" signal className="text-figure leading-none" />
          )}
        </PlaceholderNotice>

        <div className="flex flex-col gap-1">
          {!isPlaceholder(progress.asOf) && (
            <p className="text-small text-ink-1">
              <span className="text-ink-2">Physical progress</span> · {progress.asOf}
            </p>
          )}
          <p className="text-small text-ink-1">
            <span className="text-ink-2">Scheduled completion</span> ·{" "}
            {formatLongDate(projectFacts.scheduledCompletionDate)}
          </p>
        </div>
      </div>
    </section>
  );
}
