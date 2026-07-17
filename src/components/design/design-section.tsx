import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { DESIGN_DISCLAIMER, type DesignSection } from "@/content/design";
import { Figure } from "@/components/ui/figure";
import { cn } from "@/lib/cn";

interface DesignSectionCardProps {
  readonly section: DesignSection;
  readonly reverse?: boolean;
  readonly chainage?: string;
  readonly percent?: number | null;
}

/**
 * One design section: image on one side, copy on the other (alternating).
 * The "final construction may vary" disclaimer is shown for renders and
 * drawings only; real site photographs (footbridges, drainage) are
 * labelled honestly as work in progress and carry no such disclaimer.
 */
export function DesignSectionCard({ section, reverse, chainage, percent }: DesignSectionCardProps) {
  const asset = mediaRegistry[section.media];
  const isProposedVisual = asset.kind === "render" || asset.kind === "drawing";

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
      <figure className={cn("flex flex-col gap-3", reverse && "md:order-2")}>
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-rule bg-sunk">
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            className="object-cover"
          />
        </div>
        {isProposedVisual && <figcaption className="text-caption text-ink-3">{DESIGN_DISCLAIMER}</figcaption>}
      </figure>

      <div className={cn("flex flex-col gap-3", reverse && "md:order-1")}>
        <span className="w-fit border border-rule px-2 py-1 text-caption text-ink-3 tracking-wide uppercase">
          {section.status}
        </span>
        <h3 className="text-heading-3 text-ink-1">{section.title}</h3>
        {chainage && <span className="figure text-small text-ink-3">{chainage}</span>}
        {percent != null && (
          <div className="flex items-baseline gap-2">
            <Figure value={`${percent}%`} className="text-heading-4 text-lime" />
            <span className="text-small text-ink-3">complete · May 2026</span>
          </div>
        )}
        <p className="text-body text-ink-2">{section.description}</p>
      </div>
    </div>
  );
}
