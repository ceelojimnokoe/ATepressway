import { boardMembers } from "@/content/project";
import { BoardMemberCard } from "@/components/stakeholders/board-member-card";
import { TextReveal } from "@/components/motion/text-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";

/**
 * Leadership preview: the project's board. Portraits are supplied but the
 * identities are not yet confirmed, so the copy stays neutral and the
 * provisional status is stated plainly (see `boardMembers`). Kept honest
 * rather than oversold — the credibility of the page depends on it.
 */
export function Leadership() {
  return (
    <section className="border-b border-rule bg-void">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-lime tracking-[0.2em] uppercase">07 — Leadership</span>
            <TextReveal
              as="h2"
              text="The board behind the programme"
              className="text-heading-3 text-ink-1 sm:text-heading-2"
            />
            <p className="max-w-xl text-small text-ink-3">
              Board portraits are shown here; names, titles and profiles are provisional and will be
              published once confirmed by the stakeholders.
            </p>
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/stakeholders" variant="secondary">
              All stakeholders
            </CtaLink>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5" stagger={0.06}>
          {boardMembers.map((member) => (
            <StaggerItem key={member.name}>
              <BoardMemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
