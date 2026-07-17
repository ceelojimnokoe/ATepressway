import { mediaRegistry } from "@/content/media";
import { projectFacts } from "@/content/project";
import { HeroSlider, type Slide } from "./hero-slider";

// Exact slide order requested for the homepage hero.
const slides: readonly Slide[] = (
  ["teshieLinkRemodel", "flowerPotRemodel", "ogHeroBg", "routeAlignmentMap"] as const
).map((key) => {
  const asset = mediaRegistry[key];
  return { src: asset.src, alt: asset.alt, width: asset.width, height: asset.height };
});

/**
 * Homepage hero: the automatic image slider with the company title and a
 * concise intro overlaid. The title is the page's single h1 and sits above
 * the progress figures (which follow in KeyFigures), kept short so those
 * figures stay visible without excessive scrolling.
 */
export function Hero() {
  return (
    <HeroSlider slides={slides} className="min-h-[32rem] border-b border-rule sm:min-h-[38rem]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-24 pb-10 sm:px-8">
        <h1 className="text-heading-2 text-ink-1 sm:text-heading-1">Accra–Tema Expressway Ltd.</h1>
        <p className="text-lead text-ink-1 sm:text-heading-4">
          Your guide to the Accra–Tema Motorway and Extensions Project
        </p>
        <p className="max-w-2xl text-body text-ink-2">
          Follow the design, construction progress and key developments shaping the{" "}
          {projectFacts.corridorLengthKm} km Accra–Tema Motorway and Extensions Project, including
          the {projectFacts.section1LengthKm} km Section 1 corridor currently under construction.
        </p>
      </div>
    </HeroSlider>
  );
}
