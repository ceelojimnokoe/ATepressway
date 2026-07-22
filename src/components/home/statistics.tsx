import { projectFacts, interchanges } from "@/content/project";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { TextReveal } from "@/components/motion/text-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

interface Stat {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly unit?: string;
  readonly decimals?: number;
  readonly separator?: boolean;
  readonly label: string;
}

const stats: readonly Stat[] = [
  {
    value: projectFacts.contractPriceMillions,
    prefix: "US$",
    suffix: "M",
    decimals: 1,
    label: "Contract price before tax",
  },
  { value: projectFacts.contractDurationDays, unit: "days", separator: true, label: "Contract duration" },
  { value: projectFacts.equipmentOnSite, label: "Equipment recorded on site" },
  { value: interchanges.length, label: "Interchanges" },
  { value: projectFacts.tollPlazaCount, label: "Toll plazas" },
  { value: projectFacts.pedestrianFootbridges, label: "Pedestrian crossings" },
];

/**
 * The project at scale: large counters that run up once when the row
 * enters the viewport (deterministic 0 → final; the final value is shown
 * immediately under reduced motion). Numbers are drawn straight from the
 * report — no invented figures. The tabular figures don't reflow while
 * counting.
 */
export function Statistics() {
  return (
    <section className="border-b border-rule bg-void">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-14 flex flex-col gap-4">
          <span className="figure text-caption text-lime tracking-[0.2em] uppercase">03 — By the numbers</span>
          <TextReveal
            as="h2"
            text="The scale of the works"
            className="text-heading-3 text-ink-1 sm:text-heading-2"
          />
        </div>

        <StaggerContainer className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3" stagger={0.08} amount={0.2}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="flex flex-col gap-3 border-t border-rule pt-5">
              <div className="flex items-baseline gap-1.5">
                <AnimatedFigure
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  separator={stat.separator}
                  className="text-heading-1"
                />
                {stat.unit && <span className="text-small text-ink-2">{stat.unit}</span>}
              </div>
              <span className="text-caption text-ink-2 tracking-wide uppercase">{stat.label}</span>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
