import { stakeholderChain } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { PageTransitionLink } from "@/components/layout/page-transition-link";

// Employer sits above the rest of the delivery chain; the teaser links
// through to the full stakeholders page.
const [employer, ...others] = stakeholderChain;

export function StakeholderGrid() {
  return (
    <section className="bg-surface-sunk">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-fg">Delivered by</h2>

        <div className="flex flex-col gap-1 border border-hairline bg-surface-raised px-4 py-3">
          <span className="text-caption text-fg-faint tracking-wide uppercase">{employer.role}</span>
          <span className="text-body text-fg">{employer.name}</span>
        </div>

        {/*
          Border-per-item, not the gap-color grid trick — borders render
          only where there's an actual cell, so an odd count never leaves a
          filled gap block. Same fix as the /stakeholders chain.
        */}
        <div className="grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-2">
          {others.map((entity) => (
            <div
              key={entity.name}
              className="flex flex-col gap-1 border-r border-b border-hairline px-4 py-3"
            >
              <span className="text-body text-fg">{entity.name}</span>
              <span className="text-small text-fg-muted">{entity.role}</span>
            </div>
          ))}
        </div>

        <PageTransitionLink href="/stakeholders" className="text-small text-fg underline underline-offset-4">
          See all stakeholders →
        </PageTransitionLink>
      </ViewportReveal>
    </section>
  );
}
