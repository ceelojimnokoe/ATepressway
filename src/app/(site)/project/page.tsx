import type { Metadata } from "next";
import { Scope } from "@/components/project/scope";
import { TheWorks } from "@/components/project/the-works";
import { WhyReconstruction } from "@/components/project/why-reconstruction";
import { Timeline } from "@/components/project/timeline";
import { JsonLd } from "@/components/seo/json-ld";
import { ImageBanner } from "@/components/ui/image-banner";
import { corridorPlaceJsonLd } from "@/content/structured-data";
import { stockImages } from "@/content/stock-media";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.project);

export default function ProjectPage() {
  return (
    <>
      <JsonLd data={corridorPlaceJsonLd()} />
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Project</h1>
      </div>

      <ImageBanner image={stockImages.aerialMotorway} />
      <Scope />
      <TheWorks />
      <ImageBanner image={stockImages.reinforcementWork} />
      <WhyReconstruction />
      <Timeline />
    </>
  );
}
