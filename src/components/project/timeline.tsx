import { projectFacts } from "@/content/project";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const MILESTONES = [
  { year: projectFacts.openedYear, label: `Opened under ${projectFacts.openedUnder}` },
  {
    year: projectFacts.reconstructionStartYear,
    label: `Reconstruction commenced — ${projectFacts.constructionWindowMonths}-month window`,
  },
] as const;

export function Timeline() {
  return (
    <section>
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Timeline</h2>
        <ol className="flex flex-col divide-y divide-rule border-t border-b border-rule">
          {MILESTONES.map((milestone) => (
            <li key={milestone.year} className="flex items-baseline gap-4 py-4">
              <Figure value={milestone.year} className="text-heading-3" />
              <span className="text-body text-ink-1">{milestone.label}</span>
            </li>
          ))}
        </ol>
      </ViewportReveal>
    </section>
  );
}
