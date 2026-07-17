import { progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { PageTransitionLink } from "@/components/layout/page-transition-link";
import { Figure } from "@/components/ui/figure";

/**
 * A quiet summary of the latest Monthly Progress Report, linking through
 * to the full breakdown on /progress. Every claim here is drawn straight
 * from the MPR figures in content — no interpretation, no "on track".
 */
export function LatestReport() {
  const overall = isPlaceholder(progress.overallPercentComplete)
    ? null
    : progress.overallPercentComplete;
  const asOf = isPlaceholder(progress.asOf) ? null : progress.asOf;

  return (
    <section className="border-b border-rule bg-raised">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">
          {asOf ? `${asOf} report highlights` : "Report highlights"}
        </h2>

        {overall !== null && (
          <p className="text-body text-ink-1">
            Overall physical progress stands at <Figure value={`${overall}%`} />, with the four
            interchanges between 30% and 88% complete.
          </p>
        )}

        <PageTransitionLink
          href="/progress"
          className="text-small text-ink-1 underline underline-offset-4"
        >
          Read the full progress report →
        </PageTransitionLink>
      </ViewportReveal>
    </section>
  );
}
