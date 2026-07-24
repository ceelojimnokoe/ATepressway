import { progress, interchanges } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { AnimatedProgressBar } from "@/components/ui/animated-progress-bar";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";

const workPackages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;
const source = isPlaceholder(progress.signOffSource) ? null : progress.signOffSource;

/**
 * Interchange progress from the May 2026 report: each bar fills from zero
 * on scroll-in, the percentage is always shown as text (never colour
 * alone), and the source is stated. A server component — only the bars and
 * reveals are client leaves.
 */
export function InterchangeProgress() {
  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-24 sm:px-8">
        <div className="flex flex-col gap-4">
          <span className="figure text-caption text-accent tracking-[0.2em] uppercase">04 — Progress</span>
          <TextReveal
            as="h2"
            text="Interchange construction, structure by structure"
            className="max-w-3xl text-heading-3 text-fg sm:text-heading-2"
          />
        </div>

        <div className="flex flex-col gap-8">
          {interchanges.map((interchange) => {
            const pkg = workPackages.find((w) => w.id === interchange.id);
            if (!pkg) return null;
            return (
              <Reveal key={interchange.id} direction="up" distance={16}>
                <AnimatedProgressBar
                  label={`${interchange.name} Interchange`}
                  percent={pkg.percentComplete}
                  sublabel={`${interchange.chainageLabel} · ${interchange.mayActivity}`}
                />
              </Reveal>
            );
          })}
        </div>

        {source && (
          <p className="text-caption text-fg-faint">Interchange progress figures reflect the {source}.</p>
        )}
      </div>
    </section>
  );
}
