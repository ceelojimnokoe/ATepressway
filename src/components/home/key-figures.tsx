import { projectFacts, sections } from "@/content/project";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { formatShortDate } from "@/lib/format";

// S1 (Accra–Tema Motorway) is the 19.5km section under active reconstruction.
const underConstruction = sections[0];

/**
 * Contract price leads at heading-1 scale and carries the lime signal —
 * the single most important figure of this section. The other three
 * support at heading-4: total corridor, the length under construction,
 * and the scheduled completion date. One leads, the rest support.
 */
export function KeyFigures() {
  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-3 tracking-wide uppercase">Contract price</span>
          <AnimatedFigure
            value={projectFacts.contractPriceUSD / 1_000_000}
            decimals={1}
            prefix="US$"
            suffix="M"
            signal
            className="text-heading-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-rule pt-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">Corridor length</span>
            <div className="flex items-baseline gap-1">
              <AnimatedFigure value={projectFacts.corridorLengthKm} decimals={1} className="text-heading-4" />
              <span className="text-small text-ink-2">km</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">Under construction</span>
            <div className="flex items-baseline gap-1">
              <AnimatedFigure value={underConstruction.lengthKm} decimals={1} className="text-heading-4" />
              <span className="text-small text-ink-2">km</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">Scheduled completion</span>
            <Figure value={formatShortDate(projectFacts.scheduledCompletionDate)} className="text-heading-4" />
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
