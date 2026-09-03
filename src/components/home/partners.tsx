import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";
import { GovernmentOfGhanaBlock } from "@/components/stakeholders/government-of-ghana-block";

/**
 * Delivery teaser — replaced 3 Sept 2026 (client instruction). Previously
 * showed ATEL + Maripoma side by side; now shows the Government of Ghana
 * only, via the shared block also used on /stakeholders (one source of
 * truth — see src/content/project.ts `governmentOfGhana` and
 * GovernmentOfGhanaBlock).
 */
export function Partners() {
  return (
    <section className="border-b border-hairline bg-surface-sunk">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">08 — Delivery</span>
            <TextReveal
              as="h2"
              text="An accountable delivery chain"
              className="text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/stakeholders" variant="secondary">
              All stakeholders
            </CtaLink>
          </Reveal>
        </div>

        <GovernmentOfGhanaBlock />
      </div>
    </section>
  );
}
