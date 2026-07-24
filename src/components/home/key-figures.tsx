import { projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const overallPct = isPlaceholder(progress.overallPercentComplete) ? 46 : progress.overallPercentComplete;

function Stat({
  label,
  value,
  prefix,
  suffix,
  unit,
  decimals = 0,
  signal = false,
}: {
  readonly label: string;
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly unit?: string;
  readonly decimals?: number;
  readonly signal?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-fg-faint tracking-wide uppercase">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <AnimatedFigure
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          signal={signal}
          className="text-heading-2"
        />
        {unit && <span className="text-small text-fg-muted">{unit}</span>}
      </div>
    </div>
  );
}

/**
 * The four confirmed headline figures, each counting up once when it first
 * enters the viewport (deterministic 0 → final; see AnimatedFigure). Labels
 * are unambiguous per the report.
 */
export function KeyFigures() {
  return (
    <section className="border-b border-hairline bg-surface">
      <ViewportReveal className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <Stat label="Overall Physical Progress" value={overallPct} suffix="%" signal />
        <Stat
          label="Contract Price Before Tax"
          value={projectFacts.contractPriceMillions}
          prefix="US$"
          suffix="M"
          decimals={1}
        />
        <Stat label="Total Design Corridor" value={projectFacts.corridorLengthKm} unit="km" decimals={1} />
        <Stat
          label="Section 1 Under Construction"
          value={projectFacts.section1LengthKm}
          unit="km"
          decimals={1}
        />
      </ViewportReveal>
    </section>
  );
}
