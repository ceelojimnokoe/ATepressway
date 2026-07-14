import type { Metadata } from "next";
import { OverallCompletion } from "@/components/progress/overall-completion";
import { WorkPackages } from "@/components/progress/work-packages";
import { MilestoneTimeline } from "@/components/progress/milestone-timeline";
import { BulletinFeed } from "@/components/progress/bulletin-feed";
import { ImageBanner } from "@/components/ui/image-banner";
import { stockImages } from "@/content/stock-media";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.progress);

export default function ProgressPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Progress</h1>
      </div>

      <OverallCompletion />
      <ImageBanner image={stockImages.pavingEquipment} />
      <WorkPackages />
      <MilestoneTimeline />
      <BulletinFeed />
    </>
  );
}
