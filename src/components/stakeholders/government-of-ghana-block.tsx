import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { governmentOfGhana } from "@/content/project";

/**
 * The Government of Ghana entry — one shared block rendered identically on
 * Home ("08 — Delivery") and on /stakeholders (first in the delivery
 * chain), reading from the single `governmentOfGhana` content export so the
 * two never drift apart. Same card language as StakeholderOrg (border,
 * bg-surface-raised, matching padding) so it sits comfortably next to it on
 * /stakeholders, while standing alone cleanly on Home.
 */
export function GovernmentOfGhanaBlock() {
  const logos = governmentOfGhana.logos.map((key) => mediaRegistry[key]);

  return (
    <div className="flex flex-col gap-4 border border-hairline bg-surface-raised p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <span className="text-caption text-fg-faint tracking-wide uppercase">
          {governmentOfGhana.subtitle}
        </span>
        <h3 className="text-heading-4 text-fg">{governmentOfGhana.title}</h3>
        <p className="max-w-2xl text-small text-fg-muted">{governmentOfGhana.paragraph}</p>
      </div>

      {logos.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {logos.map((logo) => (
            <div key={logo.src} className="flex h-14 w-fit max-w-full items-center bg-paper px-4">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-8 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
