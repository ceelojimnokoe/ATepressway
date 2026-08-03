import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { CorridorTimeline } from "@/components/home/corridor-timeline";
import { Statistics } from "@/components/home/statistics";
import { InterchangeProgress } from "@/components/home/interchange-progress";
import { DesignPreview } from "@/components/home/design-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Partners } from "@/components/home/partners";
import { BoardPreview } from "@/components/home/board-preview";
import { ClosingCta } from "@/components/home/closing-cta";
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
      <Intro />
      <CorridorTimeline />
      <Statistics />
      <InterchangeProgress />
      <DesignPreview />
      <GalleryPreview />
      <Partners />
      <BoardPreview />
      <ClosingCta />
    </>
  );
}
