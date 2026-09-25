import type { Metadata } from "next";
import { StakeholderOrg } from "@/components/stakeholders/stakeholder-org";
import { GovernmentOfGhanaBlock } from "@/components/stakeholders/government-of-ghana-block";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import {
  stakeholders,
  legalAdvisor,
  team,
  epcPersonnel,
  specialistContractors,
  type OrgPerson,
  type StakeholderKey,
} from "@/content/project";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.stakeholders);

/**
 * Delivery chain, top to bottom, paired with the key each board member's
 * `affiliation` points at. ATEL's own Board of Directors no longer renders
 * inline here at all — see the `linkOut` passed to its StakeholderOrg card
 * below, and PEOPLE_BY_ORG's comment.
 */
const CHAIN: readonly { readonly key: StakeholderKey | "employersRepAgent" | "epcContractor"; readonly value: (typeof stakeholders)[keyof typeof stakeholders] }[] = [
  { key: "employer", value: stakeholders.employer },
  { key: "fundingAgency", value: stakeholders.fundingAgency },
  { key: "employersRepresentative", value: stakeholders.employersRepresentative },
  { key: "employersRepAgent", value: stakeholders.employersRepAgent },
  { key: "epcContractor", value: stakeholders.epcContractor },
];

/**
 * Associated Consultants' engineers, ADAPTED from the single `team` source
 * rather than copied — so a name, title, portrait or bio is only ever
 * edited once. Bio and credentials are carried through (client instruction,
 * 3 Sept 2026: each member is the same person in the same role whether
 * described here or under "Project Team", so there's no reason to show a
 * thinner version of them here — the old standalone Project Team section
 * that used to show the full version has been removed instead). Membership
 * of `team` itself has changed since (Togbenou replaced by Gyampo, 7 Sept
 * 2026) — this mapping is unaffected either way.
 */
const consultantPeople: readonly OrgPerson[] = team.map((member) => ({
  name: member.name,
  role: member.title,
  photo: member.photo,
  initials: member.initials,
  bio: member.bio,
  credentials: member.credentials,
}));

/**
 * ATEL's own Board of Directors is deliberately absent from this map: it
 * moved to /about#board-of-directors (client instruction, 9 Sept 2026) —
 * see CHAIN.map below, which gives the "employer" entry a `linkOut` instead
 * of a `members` list. `boardMembers` itself is untouched and still the one
 * shared source both pages read from (About renders it directly).
 */
const PEOPLE_BY_ORG: Record<string, { people: readonly OrgPerson[]; label: string }> = {
  // "Project personnel" (not "Project team") — matches the EPC contractor's
  // label below now that there's no separate Project Team section for this
  // to imply a distinction from (client instruction, 3 Sept 2026).
  employersRepAgent: { people: consultantPeople, label: "Project personnel" },
  epcContractor: { people: epcPersonnel, label: "Project personnel" },
};

export default function StakeholdersPage() {
  return (
    <>
      {/* Hero image → stakeholders-img.jpg (client instruction, 20 Sept 2026;
          was culvertEarthworks). Generic handshake photo, not project
          imagery. Dark in the text zone (~75), so the "light" scrim. */}
      <PageHero
        media="stakeholdersHero"
        scrimIntensity="light"
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
            {/* First in the chain, above the Concessionaire (client
                instruction, 3 Sept 2026) — same shared block as Home's
                "08 — Delivery" section. */}
            <GovernmentOfGhanaBlock />
            {CHAIN.map(({ key, value }) => {
              const group = PEOPLE_BY_ORG[key];
              return (
                <StakeholderOrg
                  key={value.name}
                  stakeholder={value}
                  members={group?.people ?? []}
                  membersLabel={group?.label}
                  linkOut={
                    key === "employer"
                      ? { href: "/about#board-of-directors", label: "View Board of Directors" }
                      : undefined
                  }
                />
              );
            })}
            {/* Outside the MPR's contractual chain above (client instruction,
                7 Sept 2026) — same StakeholderOrg card, own "Legal Advisors"
                role caption so it never reads as a claim of contractual
                rank alongside the Concessionaire-to-EPC-Contractor chain. */}
            <StakeholderOrg stakeholder={legalAdvisor} members={[]} />
          </div>
        </ViewportReveal>
      </section>

      {/* The "Government Role" section (Ministry of Roads and Highways /
          Ministry of Finance, each with its own card + link) was removed
          entirely here (client instruction, 25 Sept 2026) — it duplicated
          the Ministry of Roads & Highways entry now named correctly at the
          top of the Delivery chain above (see governmentOfGhana in
          content/project.ts), and the Ministry of Finance's role is still
          described in the FAQ. Specialist contractors is kept — Limmark and
          Dakal aren't named anywhere else on the site — as its own small,
          clearly-subordinate block rather than folded into the numbered
          chain above, matching specialistContractors' own "always render
          visually subordinate" doc comment in content/project.ts. */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-4 text-fg">Specialist contractors</h2>
            <p className="max-w-3xl text-small text-fg-faint">
              Engaged directly for utility relocation works along the corridor, outside the delivery
              chain above.
            </p>
          </div>
          <ul className="flex flex-col gap-1">
            {specialistContractors.map((party) => (
              <li key={party.name} className="text-small text-fg-muted">
                <span className="text-fg">{party.name}</span> — {party.role.replace("Specialist Contractor — ", "")}
              </li>
            ))}
          </ul>
        </ViewportReveal>
      </section>
    </>
  );
}
