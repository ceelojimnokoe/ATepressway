import { AnimatedFigure } from "@/components/ui/animated-figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { buildSegments } from "@/components/corridor/geometry";

/**
 * Reuses Corridor's geometry (correct Neoplan-to-Tema ordering and
 * direction, not the raw S1/S2/S3 array order — see geometry.ts) without
 * duplicating the interactive scrubber. This page is a factual listing a
 * stakeholder scans, not something they explore by dragging — the
 * scrubber doesn't earn its place a third time on the site.
 */
export function Scope() {
  const segments = buildSegments();

  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Scope</h2>

        <div className="flex flex-col divide-y divide-rule border-t border-b border-rule">
          {segments.map((segment) => (
            <div
              key={segment.section.id}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="text-body text-ink-1">
                  {segment.section.name} · {segment.section.road}
                </span>
                <span className="text-small text-ink-2">
                  {segment.displayFrom} → {segment.displayTo}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <AnimatedFigure value={segment.section.lengthKm} decimals={1} className="text-heading-3" />
                <span className="text-small text-ink-2">km</span>
              </div>
            </div>
          ))}
        </div>
      </ViewportReveal>
    </section>
  );
}
