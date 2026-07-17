import type { Metadata } from "next";
import { DeliveryChain } from "@/components/stakeholders/delivery-chain";
import { TeamRoster } from "@/components/stakeholders/team-roster";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.stakeholders);

export default function StakeholdersPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Stakeholders</h1>
      </div>

      <DeliveryChain />
      <TeamRoster />
    </>
  );
}
