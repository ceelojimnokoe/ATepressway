import type { Metadata } from "next";
import { TeamMemberCard } from "@/components/stakeholders/team-member-card";
import { StakeholderOrg } from "@/components/stakeholders/stakeholder-org";
import { BoardMemberCard } from "@/components/stakeholders/board-member-card";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import {
  stakeholders,
  team,
  boardMembers,
  epcPersonnel,
  oversightBodies,
  specialistContractors,
  type OrgPerson,
  type StakeholderKey,
} from "@/content/project";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.stakeholders);

/**
 * Delivery chain, top to bottom, paired with the key each board member's
 * `affiliation` points at. The standalone Board of Directors section has been
 * dissolved: each director now sits under the organisation they come from.
 */
const CHAIN: readonly { readonly key: StakeholderKey | "employersRepAgent" | "epcContractor"; readonly value: (typeof stakeholders)[keyof typeof stakeholders] }[] = [
  { key: "employer", value: stakeholders.employer },
  { key: "fundingAgency", value: stakeholders.fundingAgency },
  { key: "employersRepresentative", value: stakeholders.employersRepresentative },
  { key: "employersRepAgent", value: stakeholders.employersRepAgent },
  { key: "epcContractor", value: stakeholders.epcContractor },
];

/**
 * ATEL's directors, split into executive leadership and the board proper.
 * Everyone sits under ATEL (client, 30 Aug 2026) — the delivery-chain and
 * oversight bodies keep their entries but no longer carry nested people.
 */
const executives = boardMembers.filter((member) => member.isExecutive);
const directors = boardMembers.filter((member) => !member.isExecutive);

/**
 * Associated Consultants' engineers, ADAPTED from the single `team` source
 * rather than copied. The same records drive the Project Team section below and
 * the Home page slider, so a name, title or portrait is only ever edited once.
 */
const consultantPeople: readonly OrgPerson[] = team.map((member) => ({
  name: member.name,
  role: member.title,
  photo: member.photo,
  initials: member.initials,
}));

const PEOPLE_BY_ORG: Record<string, { people: readonly OrgPerson[]; label: string }> = {
  employer: { people: directors, label: "Board of Directors" },
  employersRepAgent: { people: consultantPeople, label: "Project team" },
  epcContractor: { people: epcPersonnel, label: "Project personnel" },
};

function membersFor(key: string) {
  return boardMembers.filter((member) => member.affiliation === key);
}

export default function StakeholdersPage() {
  return (
    <>
      <PageHero
        media="culvertEarthworks"
        title="Project Stakeholders"
        subtitle="The delivery structure for the Accra–Tema Motorway and Extensions Project, in order of accountability from Concessionaire to EPC contractor."
      />

      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-4 text-fg">Delivery chain</h2>
            <p className="max-w-3xl text-small text-fg-faint">
              Each organisation below links to its official site, and lists the people who lead or
              deliver its part of the project.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {CHAIN.map(({ key, value }) => {
              const group = PEOPLE_BY_ORG[key];
              return (
                <StakeholderOrg
                  key={value.name}
                  stakeholder={value}
                  members={group?.people ?? []}
                  membersLabel={group?.label}
                  executives={key === "employer" ? executives : []}
                />
              );
            })}
          </div>
        </ViewportReveal>
      </section>

      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Project Team</h2>
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamMemberCard key={member.name} member={member} variant="feature" />
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Government bodies: real contractual roles, but not delivery-chain
          contractors — so a lighter band rather than full chain cards. */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-4 text-fg">Government oversight</h2>
            <p className="max-w-3xl text-small text-fg-faint">
              Ministries with a defined role in the concession, outside the delivery chain.
            </p>
          </div>
          <ul className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
            {oversightBodies.map((body) => {
              const members = membersFor(body.key);
              return (
                <li key={body.name} className="flex flex-col gap-4 py-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-caption text-fg-faint tracking-wide uppercase">{body.role}</span>
                    <a
                      href={body.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="-my-1 inline-block w-fit py-1 text-body text-fg underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {body.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <p className="max-w-2xl text-small text-fg-muted">{body.gloss}</p>
                  </div>
                  {members.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <span className="text-caption text-fg-faint tracking-wide uppercase">
                        Represented on the ATEL Board by
                      </span>
                      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                        {members.map((member) => (
                          <li key={member.name}>
                            <BoardMemberCard member={member} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-caption text-fg-faint tracking-wide uppercase">
              Specialist contractors
            </span>
            <ul className="flex flex-col gap-1">
              {specialistContractors.map((party) => (
                <li key={party.name} className="text-small text-fg-muted">
                  <span className="text-fg">{party.name}</span> — {party.role.replace("Specialist Contractor — ", "")}
                </li>
              ))}
            </ul>
          </div>
        </ViewportReveal>
      </section>
    </>
  );
}
