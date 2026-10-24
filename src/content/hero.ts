/**
 * Home hero slider order (client instruction, 24 Oct 2026) — the one place
 * the slide list, order and per-slide scrim live, so hero-slider.tsx and
 * hero.tsx never hardcode a filename. Reordering or swapping a slide is a
 * one-line change here.
 *
 * header3.png (also supplied) is deliberately absent: it shows a generic
 * highway with supercars and non-Ghanaian road markings, not Accra–Tema
 * project imagery, and was held back pending the client's review rather
 * than included unchecked — see the 24 Oct report.
 *
 * Scrim tiers measured the same way as every other hero slide: a canvas
 * pixel sample of the bottom-left corner, where the text sits (≤ ~100
 * light, ~110–140 medium, ≥ ~170 strong). header1 ≈ 87, flowerPotRemodel ≈
 * 115, header2 ≈ 85 — all "light".
 */

import type { MediaKey } from "./media";

export type ScrimIntensity = "light" | "medium" | "strong";

export interface HeroSlideConfig {
  readonly media: MediaKey;
  readonly scrimIntensity: ScrimIntensity;
  /**
   * Shown as a small on-slide disclaimer when set — for a design
   * visualisation rather than construction photography, so it's never
   * mistaken for as-built work. Content lives here, not in the component.
   */
  readonly renderDisclaimer?: string;
}

const DESIGN_RENDER_DISCLAIMER = "Proposed design visualisation — final construction may vary.";

export const heroSlides: readonly HeroSlideConfig[] = [
  { media: "header1", scrimIntensity: "light", renderDisclaimer: DESIGN_RENDER_DISCLAIMER },
  { media: "flowerPotRemodel", scrimIntensity: "light", renderDisclaimer: DESIGN_RENDER_DISCLAIMER },
  { media: "header2", scrimIntensity: "light", renderDisclaimer: DESIGN_RENDER_DISCLAIMER },
] as const;
