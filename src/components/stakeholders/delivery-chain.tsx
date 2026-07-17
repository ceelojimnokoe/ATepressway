import Image from "next/image";
import { stakeholderChain, specialistContractors } from "@/content/project";
import { mediaRegistry, isRenderable, type MediaKey } from "@/content/media";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/**
 * The delivery structure as a chain of accountability, read top to
 * bottom: Employer → Funding Agency → Employer's Representative →
 * Representative's Agent → EPC Contractor. Numbered nodes on a single
 * connecting rail make the order — who answers to whom — legible at a
 * glance; the contractual role is the label and a plain-English gloss
 * sits under each. Logos pull from the registry and render only where the
 * asset is verified (today, only the Employer), so an unconfirmed logo is
 * never a broken image. The relocation specialists sit outside the chain,
 * in a visibly subordinate row.
 */
function LogoSlot({ logo }: { readonly logo?: MediaKey }) {
  const asset = logo ? mediaRegistry[logo] : undefined;
  if (!asset || !isRenderable(asset)) return null;
  // Logos are dark artwork; a light plate keeps them legible on the dark
  // surface without tinting them.
  return (
    <div className="flex h-12 w-fit shrink-0 items-center bg-paper px-3">
      <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} className="h-7 w-auto" />
    </div>
  );
}

export function DeliveryChain() {
  return (
    <section className="border-b border-rule bg-raised">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-4 text-ink-1">Delivery structure</h2>
          <p className="max-w-2xl text-small text-ink-2">
            A chain of accountability, top to bottom — each party answers to the one above it.
          </p>
        </div>

        <ol className="flex flex-col">
          {stakeholderChain.map((node, index) => {
            const isLast = index === stakeholderChain.length - 1;
            return (
              <li key={node.name} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-4 h-full w-px bg-rule sm:left-5"
                  />
                )}
                <span className="figure relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border border-rule bg-void text-caption text-ink-2 sm:h-10 sm:w-10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col gap-4 border border-rule bg-sunk px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-caption text-ink-3 tracking-wide uppercase">{node.role}</span>
                    <h3 className="text-heading-4 text-ink-1">{node.name}</h3>
                    <p className="max-w-xl text-small text-ink-2">{node.gloss}</p>
                  </div>
                  <LogoSlot logo={node.logo} />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-4 border-t border-rule pt-8">
          <p className="text-caption text-ink-3 tracking-wide uppercase">
            Specialist relocation contractors
          </p>
          <div className="grid grid-cols-1 border-t border-l border-rule sm:grid-cols-2">
            {specialistContractors.map((entity) => (
              <div
                key={entity.name}
                className="flex flex-col gap-1 border-r border-b border-rule px-5 py-4"
              >
                <span className="text-small text-ink-1">{entity.name}</span>
                <span className="text-caption text-ink-3">{entity.gloss}</span>
              </div>
            ))}
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
