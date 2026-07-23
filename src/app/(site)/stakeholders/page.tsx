import type { Metadata } from "next";
import { StakeholderCard } from "@/components/stakeholders/stakeholder-card";
import { TeamMemberCard } from "@/components/stakeholders/team-member-card";
import { BoardMemberCard } from "@/components/stakeholders/board-member-card";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { stakeholderChain, team, boardMembers } from "@/content/project";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.stakeholders);

export default function StakeholdersPage() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-16 sm:px-8">
        {/* Steps down on mobile, matching PageHero — "Stakeholders" set in the
            display face overflows a 360px viewport at the full heading-1 size. */}
        <h1 className="text-heading-2 text-ink-1 sm:text-heading-1">Project Stakeholders</h1>
        <p className="max-w-2xl text-body text-ink-2">
          The delivery structure for the Accra–Tema Motorway and Extensions
          Project, in order of accountability from Employer to EPC contractor.
        </p>
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8">
        <ViewportReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stakeholderChain.map((stakeholder) => (
            <StakeholderCard key={stakeholder.name} stakeholder={stakeholder} />
          ))}
        </ViewportReveal>
      </section>

      <section className="border-t border-rule bg-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-ink-1">Project Team</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {team.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </ViewportReveal>
      </section>

      <section className="border-t border-rule bg-void">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-4 text-ink-1">Board of Directors</h2>
            <p className="max-w-2xl text-small text-ink-3">
              Seats are reserved below. Names, positions and profiles are provisional and will be
              published once confirmed by the stakeholders.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {boardMembers.map((member, i) => (
              <BoardMemberCard key={`board-seat-${i + 1}`} member={member} />
            ))}
          </div>
        </ViewportReveal>
      </section>
    </>
  );
}
