import { boardMembers } from "@/content/project";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";
import { BoardMemberCard } from "@/components/stakeholders/board-member-card";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/**
 * Board of Directors teaser, mirroring the Delivery section: one reserved
 * seat as a preview, linking through to the full board on /stakeholders.
 * It reuses BoardMemberCard, so this seat renders the same honest "to be
 * confirmed" state as the others — no name is fabricated. The full board
 * (all reserved seats) lives on /stakeholders#board.
 */
const previewMember = boardMembers[0];

export function BoardPreview() {
  if (!previewMember) return null;

  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">08 — Governance</span>
            <TextReveal
              as="h2"
              text="Board of Directors"
              className="text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/stakeholders#board" variant="secondary">
              View the board
            </CtaLink>
          </Reveal>
        </div>

        <ViewportReveal className="grid grid-cols-1 sm:grid-cols-2">
          <BoardMemberCard member={previewMember} />
        </ViewportReveal>

        <p className="mt-6 max-w-2xl text-small text-fg-faint">
          Seats are reserved; names, positions and profiles are provisional and will be published
          once confirmed by the stakeholders.
        </p>
      </div>
    </section>
  );
}
