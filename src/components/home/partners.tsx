import Image from "next/image";
import { stakeholderChain } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { TextReveal } from "@/components/motion/text-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";

/**
 * Delivery chain as a static grid (five parties — too few for a marquee).
 * Where a logo is supplied it sits on a light plate at its natural
 * proportions; otherwise the name stands in. Border-per-item, so an odd
 * count never leaves a filled gap cell.
 */
export function Partners() {
  return (
    <section className="border-b border-rule bg-raised">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-lime tracking-[0.2em] uppercase">06 — Delivery</span>
            <TextReveal
              as="h2"
              text="An accountable delivery chain"
              className="text-heading-3 text-ink-1 sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/stakeholders" variant="secondary">
              All stakeholders
            </CtaLink>
          </Reveal>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {stakeholderChain.map((party) => {
            const logo = party.logo ? mediaRegistry[party.logo] : null;
            return (
              <StaggerItem
                key={party.name}
                className="flex flex-col gap-4 border-r border-b border-rule bg-raised p-6"
              >
                <span className="text-caption text-ink-3 tracking-wide uppercase">{party.role}</span>
                {logo ? (
                  <div className="flex h-12 w-fit max-w-full items-center bg-paper px-4">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      className="h-7 w-auto max-w-full object-contain"
                    />
                  </div>
                ) : null}
                <span className="text-body text-ink-1">{party.name}</span>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
