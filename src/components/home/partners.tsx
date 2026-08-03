import { stakeholders } from "@/content/project";
import { TextReveal } from "@/components/motion/text-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";
import { StakeholderCard } from "@/components/stakeholders/stakeholder-card";

/**
 * Delivery teaser: the two parties a visitor most needs to place — the
 * Employer (ATEL, who commissions and oversees) and the EPC Contractor
 * (Maripoma, who actually builds). It reuses the /stakeholders card so the
 * styling stays identical, and links through to the full delivery chain.
 * Keeping ATEL and Maripoma side by side makes the Employer/Contractor
 * distinction — load-bearing for the site's credibility — unmissable.
 */
const featured = [stakeholders.employer, stakeholders.epcContractor];

export function Partners() {
  return (
    <section className="border-b border-hairline bg-surface-sunk">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">07 — Delivery</span>
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

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2" stagger={0.08}>
          {featured.map((party) => (
            <StaggerItem key={party.name} className="h-full">
              <StakeholderCard stakeholder={party} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
