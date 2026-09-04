import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { governmentOfGhana } from "@/content/project";

/**
 * The Government of Ghana entry — one shared block rendered identically on
 * Home ("08 — Delivery") and on /stakeholders (first in the delivery
 * chain), reading from the single `governmentOfGhana` content export so the
 * two never drift apart. Header row (role caption, linked title, gloss,
 * logo) matches StakeholderOrg's own name+logo layout exactly (client
 * instruction, 4 Sept 2026) — same position, same link styling — so this
 * reads as one more entry in the same visual language, not a one-off.
 */
export function GovernmentOfGhanaBlock() {
  const logo = mediaRegistry[governmentOfGhana.logo];
  const supportingLogos = governmentOfGhana.supportingLogos.map((key) => mediaRegistry[key]);

  return (
    <div className="flex flex-col gap-5 border border-hairline bg-surface-raised p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-caption text-fg-faint tracking-wide uppercase">
            {governmentOfGhana.subtitle}
          </span>
          <h3 className="text-heading-4 text-fg">
            <a
              href={governmentOfGhana.website}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {governmentOfGhana.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </h3>
          <p className="max-w-2xl text-small text-fg-muted">{governmentOfGhana.paragraph}</p>
        </div>
        <div className="flex h-16 w-fit max-w-full shrink-0 items-center bg-paper px-5">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-9 w-auto max-w-full object-contain"
          />
        </div>
      </div>

      {supportingLogos.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
          {supportingLogos.map((supportingLogo) => (
            <div key={supportingLogo.src} className="flex h-14 w-fit max-w-full items-center bg-paper px-4">
              <Image
                src={supportingLogo.src}
                alt={supportingLogo.alt}
                width={supportingLogo.width}
                height={supportingLogo.height}
                className="h-8 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
