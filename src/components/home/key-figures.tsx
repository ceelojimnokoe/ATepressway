import { projectFacts, sections } from "@/content/project";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const FIGURES = [
  { label: "Investment", value: projectFacts.investmentDisplay, unit: "" },
  { label: "Corridor length", value: projectFacts.corridorLengthKm, unit: "km" },
  { label: "Delivery window", value: projectFacts.constructionWindowMonths, unit: "months" },
  { label: "Sections", value: sections.length, unit: "" },
] as const;

export function KeyFigures() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 px-4 py-16 sm:grid-cols-4 sm:px-8">
        {FIGURES.map((figure) => (
          <div key={figure.label} className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">{figure.label}</span>
            <div className="flex items-baseline gap-1">
              <Figure value={figure.value} className="text-heading-3" />
              {figure.unit && <span className="text-small text-ink-2">{figure.unit}</span>}
            </div>
          </div>
        ))}
      </ViewportReveal>
    </section>
  );
}
