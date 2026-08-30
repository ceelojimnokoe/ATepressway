import { sections, projectFacts, sectionStatGroups } from "@/content/project";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/**
 * The complete 27.7 km design scope — "here's the whole plan" — sitting above
 * the interactive corridor explorer, which is then "here's how to dig into it".
 *
 * Lane counts and the interchange split come from the client's own FAQ pack;
 * lengths and section names come from the project record. Phase 1 is Section 1
 * (under construction); Phase 2 is Sections 2 and 3 plus operation and
 * maintenance. Nothing here is estimated.
 */

const LANES: Record<string, number> = { s1: 10, s2: 12, s3: 6 };
const PHASE: Record<string, string> = { s1: "Phase 1 · under construction", s2: "Phase 2", s3: "Phase 2" };

const totals = sectionStatGroups.find((group) => group.id === "total");

export function FullScope() {
  return (
    <section className="border-b border-hairline bg-surface">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="figure text-caption text-accent tracking-[0.2em] uppercase">
            The full design
          </span>
          <h2 className="text-heading-3 text-fg sm:text-heading-2">
            The complete {projectFacts.corridorLengthKm} km scope
          </h2>
          <p className="max-w-3xl text-body text-fg-muted">
            The programme covers three connected sections between Tema Port, Accra and its
            surrounding areas. Section 1 is being built now; Sections 2 and 3 have been designed
            under the same contract and form the second phase, together with the long-term operation
            and maintenance of the whole corridor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-3 bg-surface p-6">
              <span className="text-caption text-fg-faint tracking-wide uppercase">
                {section.name} · {section.road}
              </span>
              <div className="flex items-baseline gap-1">
                <Figure value={section.lengthKm.toFixed(1)} className="text-heading-3" />
                <span className="text-small text-fg-muted">km</span>
              </div>
              <p className="text-small text-fg-muted">
                {section.from} → {section.to}
              </p>
              <dl className="mt-1 flex flex-col gap-1 border-t border-hairline pt-3">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-caption text-fg-faint tracking-wide uppercase">On completion</dt>
                  <dd className="figure text-small text-fg">{LANES[section.id]} lanes</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-caption text-fg-faint tracking-wide uppercase">Delivery</dt>
                  <dd className="text-small text-fg">{PHASE[section.id]}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {totals && (
          <div className="flex flex-col gap-4">
            <span className="text-caption text-fg-faint tracking-wide uppercase">
              Across the whole corridor
            </span>
            <dl className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-6">
              {totals.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 bg-surface p-5">
                  <dd className="flex items-baseline gap-1">
                    <Figure
                      value={stat.value.toFixed(stat.decimals ?? 0)}
                      className="text-heading-4"
                    />
                    {stat.unit && <span className="text-caption text-fg-muted">{stat.unit}</span>}
                  </dd>
                  <dt className="text-caption text-fg-faint tracking-wide uppercase">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        )}
      </ViewportReveal>
    </section>
  );
}
