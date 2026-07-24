import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Parallax } from "@/components/motion/parallax";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";

const feature = mediaRegistry.corridorAerial;

const previews = [
  { key: "bridgeDeckPour", caption: "Bridge deck reinforcement and concreting", type: "Construction" },
  { key: "comm18Render", caption: "Community 18 Interchange — proposed design", type: "Design" },
  { key: "riverBridgeCulverts", caption: "River crossing culvert works", type: "Construction" },
] as const;

/**
 * Image-led preview of the gallery. The wide lead image has a subtle
 * parallax (the only parallax on the page); the three below use masked
 * reveals. Captions are always visible (not hover-only), so nothing is
 * lost on touch. All images are lazy and their boxes reserve aspect ratio.
 */
export function GalleryPreview() {
  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">06 — Gallery</span>
            <TextReveal
              as="h2"
              text="The works in pictures"
              className="text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/gallery" variant="secondary">
              View the gallery
            </CtaLink>
          </Reveal>
        </div>

        <figure className="flex flex-col gap-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-sunk sm:aspect-[21/9]">
            <Parallax distance={36} className="absolute inset-x-0 -top-[8%] h-[116%]">
              <Image src={feature.src} alt={feature.alt} fill sizes="100vw" loading="lazy" className="object-cover" />
            </Parallax>
          </div>
          <figcaption className="flex items-baseline justify-between gap-4">
            <span className="text-small text-fg">Section 1 corridor under construction</span>
            <span className="text-caption text-fg-faint tracking-wide uppercase">Construction</span>
          </figcaption>
        </figure>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {previews.map((item, i) => {
            const asset = mediaRegistry[item.key];
            return (
              <figure key={item.key} className="flex flex-col gap-3">
                <ImageReveal
                  src={asset.src}
                  alt={asset.alt}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="aspect-[4/3]"
                  delay={i * 0.05}
                />
                <figcaption className="flex items-baseline justify-between gap-3">
                  <span className="text-small text-fg">{item.caption}</span>
                  <span className="text-caption text-fg-faint tracking-wide uppercase">{item.type}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
