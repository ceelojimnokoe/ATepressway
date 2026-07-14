import { stakeholders } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { PageTransitionLink } from "@/components/layout/page-transition-link";

const ECOSYSTEM = [
  stakeholders.contractor,
  stakeholders.designSupervision,
  stakeholders.electricalRelocation,
  stakeholders.waterRelocation,
  stakeholders.financier,
] as const;

export function StakeholderGrid() {
  return (
    <section className="bg-sunk">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Delivered by</h2>

        <div className="flex flex-col gap-1 border border-rule bg-raised px-4 py-3">
          <span className="text-body text-ink-1">{stakeholders.client.name}</span>
          <span className="text-small text-ink-2">{stakeholders.client.role}</span>
        </div>

        {/*
          Border-per-item, not the gap-color grid trick — the ecosystem
          list has an odd count (5), and a gap-color background shows
          through as a solid filled block in whatever cell has no child
          to cover it. Borders only render where there's an actual item.
        */}
        <div className="grid grid-cols-1 border-t border-l border-rule sm:grid-cols-2">
          {ECOSYSTEM.map((entity) => (
            <div
              key={entity.name}
              className="flex flex-col gap-1 border-r border-b border-rule px-4 py-3"
            >
              <span className="text-body text-ink-1">{entity.name}</span>
              <span className="text-small text-ink-2">{entity.role}</span>
            </div>
          ))}
        </div>

        <PageTransitionLink href="/partners" className="text-small text-ink-1 underline underline-offset-4">
          See all partners →
        </PageTransitionLink>
      </ViewportReveal>
    </section>
  );
}
