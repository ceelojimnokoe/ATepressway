import { interchanges, projectFacts, laneConfiguration } from "@/content/project";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const totalLanes = laneConfiguration.freeway.lanes + laneConfiguration.urban.lanes;

const STATS = [
  { label: "Interchanges", value: interchanges.length },
  { label: "Footbridges", value: projectFacts.pedestrianFootbridges },
  { label: "Toll plazas", value: projectFacts.tollPlazaCount },
  { label: "Lanes", value: totalLanes },
] as const;

export function TheWorks() {
  return (
    <section className="border-b border-rule bg-raised">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">The works</h2>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <span className="text-caption text-ink-3 tracking-wide uppercase">{stat.label}</span>
              <AnimatedFigure value={stat.value} className="text-heading-3" />
            </div>
          ))}
        </div>

        <p className="text-small text-ink-2">
          {laneConfiguration.freeway.lanes} lanes {laneConfiguration.freeway.surface} +{" "}
          {laneConfiguration.urban.lanes} lanes {laneConfiguration.urban.surface}.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-3 tracking-wide uppercase">Interchanges</span>
          <ul className="flex flex-col divide-y divide-rule border-t border-b border-rule">
            {interchanges.map((interchange) => (
              <li key={interchange.name} className="py-3 text-body text-ink-1">
                {interchange.name}
              </li>
            ))}
          </ul>
        </div>
      </ViewportReveal>
    </section>
  );
}
