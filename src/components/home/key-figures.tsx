import { projectFacts, sections } from "@/content/project";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const SUPPORTING_FIGURES = [
  { label: "Corridor length", value: projectFacts.corridorLengthKm, decimals: 1, unit: "km" },
  { label: "Delivery window", value: projectFacts.constructionWindowMonths, decimals: 0, unit: "months" },
  { label: "Sections", value: sections.length, decimals: 0, unit: "" },
] as const;

/** Investment leads at heading-1 scale; the other three support underneath — see CLAUDE.md hierarchy pass. */
export function KeyFigures() {
  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-3 tracking-wide uppercase">Investment</span>
          <AnimatedFigure
            value={projectFacts.investmentUSD / 1_000_000}
            prefix="≈US$"
            suffix="M"
            signal
            className="text-heading-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-rule pt-8 sm:grid-cols-3">
          {SUPPORTING_FIGURES.map((figure) => (
            <div key={figure.label} className="flex flex-col gap-2">
              <span className="text-caption text-ink-3 tracking-wide uppercase">{figure.label}</span>
              <div className="flex items-baseline gap-1">
                <AnimatedFigure value={figure.value} decimals={figure.decimals} className="text-heading-4" />
                {figure.unit && <span className="text-small text-ink-2">{figure.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </ViewportReveal>
    </section>
  );
}
