import type { Metadata } from "next";
import { StakeholderCard } from "@/components/stakeholders/stakeholder-card";
import { TeamMemberCard } from "@/components/stakeholders/team-member-card";
import { BoardMemberCard } from "@/components/stakeholders/board-member-card";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { stakeholderChain, team, boardMembers } from "@/content/project";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.stakeholders);

export default function StakeholdersPage() {
  return (
    <>
      <PageHero
        media="culvertEarthworks"
        title="Project Stakeholders"
        subtitle="The delivery structure for the Accra–Tema Motorway and Extensions Project, in order of accountability from Employer to EPC contractor."
      />

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8">
        <ViewportReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stakeholderChain.map((stakeholder) => (
            <StakeholderCard key={stakeholder.name} stakeholder={stakeholder} />
          ))}
        </ViewportReveal>
      </section>

      <section className="border-t border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Project Team</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {team.map((member) => (
              <TeamMemberCard key={member.name} member={member} variant="feature" />
            ))}
          </div>
        </ViewportReveal>
      </section>

      <section id="board" className="scroll-mt-24 border-t border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-4 text-fg">Board of Directors</h2>
            <p className="max-w-2xl text-small text-fg-faint">
              The Board provides strategic leadership and governance oversight for the project.
              Profiles are shown as confirmed; any remaining seats will be updated as information is
              provided. Select “View profile” for each member&rsquo;s full biography.
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boardMembers.map((member, i) => (
              <BoardMemberCard key={`board-seat-${i + 1}`} member={member} variant="feature" />
            ))}
          </div>
        </ViewportReveal>
      </section>
    </>
  );
}
