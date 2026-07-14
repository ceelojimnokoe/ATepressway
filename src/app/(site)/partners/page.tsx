import type { Metadata } from "next";
import { DeliveryEcosystem } from "@/components/partners/delivery-ecosystem";
import { TeamRoster } from "@/components/partners/team-roster";
import { ImageBanner } from "@/components/ui/image-banner";
import { stockImages } from "@/content/stock-media";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.partners);

export default function PartnersPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Partners</h1>
      </div>

      <DeliveryEcosystem />
      <ImageBanner image={stockImages.interchangeConstruction} />
      <TeamRoster />
    </>
  );
}
