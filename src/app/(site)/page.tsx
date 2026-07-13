import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CorridorSection } from "@/components/home/corridor-section";
import { KeyFigures } from "@/components/home/key-figures";
import { ProgressTracker } from "@/components/home/progress-tracker";
import { LatestBulletin } from "@/components/home/latest-bulletin";
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
      <CorridorSection />
      <KeyFigures />
      <ProgressTracker />
      <LatestBulletin />
      <StakeholderGrid />
    </>
  );
}
