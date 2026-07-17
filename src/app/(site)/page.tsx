import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { KeyFigures } from "@/components/home/key-figures";
import { InterchangeProgress } from "@/components/home/interchange-progress";
import { LatestReport } from "@/components/home/latest-report";
import { StakeholderGrid } from "@/components/home/stakeholder-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { corridorPlaceJsonLd } from "@/content/structured-data";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.home);

export default function Home() {
  return (
    <>
      <JsonLd data={corridorPlaceJsonLd()} />
      <Hero />
      <KeyFigures />
      <InterchangeProgress />
      <LatestReport />
      <StakeholderGrid />
    </>
  );
}
