import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import type { Stakeholder } from "@/content/project";

/**
 * One stakeholder: contractual role, entity name, plain-English
 * description, and — where a logo is supplied — the logo on a light plate
 * so the (dark, coloured) artwork stays legible on the dark card.
 * `object-contain` with a fixed height preserves each logo's proportions;
 * logos are never stretched or recoloured.
 */
export function StakeholderCard({ stakeholder }: { readonly stakeholder: Stakeholder }) {
  const logo = stakeholder.logo ? mediaRegistry[stakeholder.logo] : null;

  return (
    <div className="flex h-full flex-col gap-4 border border-hairline bg-surface-raised p-6">
      <span className="text-caption text-fg-faint tracking-wide uppercase">{stakeholder.role}</span>
      <h3 className="text-heading-4 text-fg">{stakeholder.name}</h3>
      {logo && (
        <div className="flex h-14 w-fit max-w-full items-center bg-paper px-4">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-8 w-auto max-w-full object-contain"
          />
        </div>
      )}
      <p className="text-small text-fg-muted">{stakeholder.gloss}</p>
    </div>
  );
}
