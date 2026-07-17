import { progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/** The headline figure, as typography — not a card, not a widget. */
export function OverallCompletion() {
  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
        <h2 className="text-caption text-ink-3 tracking-wide uppercase">Overall completion</h2>
        <PlaceholderNotice value={progress.overallPercentComplete} size="display">
          {(value) => (
            <div className="flex flex-col gap-3">
              <AnimatedFigure value={value} suffix="%" signal className="text-figure" />
              {!isPlaceholder(progress.asOf) && (
                <span className="text-small text-ink-2">
                  As of {progress.asOf} · {progress.reportSeries}
                </span>
              )}
            </div>
          )}
        </PlaceholderNotice>
      </ViewportReveal>
    </section>
  );
}
