import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { CtaLink } from "@/components/ui/cta-link";

/**
 * Closing call to action: an oversized heading over a faint engineering
 * lane-line pattern (static — no moving background), with the primary
 * routes onward. Content is fully readable without animation.
 */
export function ClosingCta() {
  return (
    <section data-theme="dark" className="relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 95px, var(--color-rule) 95px, var(--color-rule) 96px)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start gap-8 px-4 py-28 sm:px-8">
        <TextReveal
          as="h2"
          text="Follow the Accra–Tema Expressway as it takes shape."
          className="max-w-4xl text-heading-2 text-fg sm:text-heading-1"
        />
        <Reveal direction="up" distance={16} delay={0.15}>
          <p className="max-w-xl text-lead text-fg-muted">
            Explore the design, track verified construction progress, and see the works in pictures.
          </p>
        </Reveal>
        <StaggerContainer className="flex flex-wrap gap-3" delay={0.25} stagger={0.1} amount={0.2}>
          <StaggerItem>
            <MagneticButton>
              <CtaLink href="/progress" variant="primary">
                View progress
              </CtaLink>
            </MagneticButton>
          </StaggerItem>
          <StaggerItem>
            <MagneticButton>
              <CtaLink href="/design" variant="secondary">
                Explore the design
              </CtaLink>
            </MagneticButton>
          </StaggerItem>
          <StaggerItem>
            <MagneticButton>
              <CtaLink href="/contact" variant="secondary">
                Contact ATEL
              </CtaLink>
            </MagneticButton>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
