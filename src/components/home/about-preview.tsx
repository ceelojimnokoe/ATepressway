import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { aboutIntro, visionMission } from "@/content/about";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const logo = mediaRegistry.logoAtel;

/**
 * About Us teaser, using the established "preview card + link to full page"
 * pattern. Content is drawn from the same source as /about, so the two can
 * never drift apart.
 */
export function AboutPreview() {
  return (
    <section className="border-b border-hairline bg-surface-raised">
      <ViewportReveal className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">02 — About us</span>
            <TextReveal
              as="h2"
              text={aboutIntro.headline}
              className="max-w-3xl text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/about" variant="secondary">
              About ATEL
            </CtaLink>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div className="flex items-center justify-center border border-hairline bg-paper p-8">
            <Image
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              sizes="(min-width: 1024px) 25vw, 60vw"
              className="h-auto w-full max-w-[12rem] object-contain"
            />
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-body text-fg-muted">{aboutIntro.paragraphs[0]}</p>
            <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
              {visionMission.slice(0, 2).map((item) => (
                <div key={item.id} className="flex flex-col gap-2 bg-surface-raised p-5">
                  <h3 className="text-body text-fg">{item.title}</h3>
                  <p className="text-small text-fg-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
