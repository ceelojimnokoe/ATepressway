import { progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { PageTransitionLink } from "@/components/layout/page-transition-link";
import { Figure } from "@/components/ui/figure";

/**
 * The latest monthly report as a single polished card that links through
 * to /progress. A restrained hover (border pick-up + arrow nudge), no
 * cursor tricks. Every claim is drawn straight from the report figures.
 */
export function LatestReport() {
  const overall = isPlaceholder(progress.overallPercentComplete) ? null : progress.overallPercentComplete;
  const asOf = isPlaceholder(progress.asOf) ? null : progress.asOf;
  const series = progress.reportSeries;

  return (
    <section className="border-b border-rule bg-raised">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-4">
          <span className="figure text-caption text-lime tracking-[0.2em] uppercase">08 — Latest</span>
          <TextReveal
            as="h2"
            text="From the latest progress report"
            className="text-heading-3 text-ink-1 sm:text-heading-2"
          />
        </div>

        <Reveal direction="up" distance={20}>
          <PageTransitionLink
            href="/progress"
            className="group block border border-rule bg-void p-8 transition-colors duration-200 ease-out hover:border-lime/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime sm:p-10"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2 text-caption text-ink-3 tracking-wide uppercase">
                <span>{series}</span>
                {asOf && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{asOf}</span>
                  </>
                )}
              </div>
              <h3 className="text-heading-3 text-ink-1">
                {asOf ? `${asOf} report highlights` : "Report highlights"}
              </h3>
              {overall !== null && (
                <p className="max-w-2xl text-lead text-ink-2">
                  Overall physical progress stands at{" "}
                  <Figure value={`${overall}%`} className="text-ink-1" />, with the four interchanges
                  between 30% and 88% complete.
                </p>
              )}
              <span className="inline-flex items-center gap-2 text-small text-ink-1">
                Read the full progress report
                <span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </PageTransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
