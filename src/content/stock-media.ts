/**
 * Temporary stock media — NOT ATEL's own photography or footage. Every
 * entry carries the PLACEHOLDER_ASSET note so it's one grep away from
 * being found and swapped for real project imagery.
 *
 * Distinct from the Placeholder<T> system in ./placeholder.ts: that
 * marks facts the client hasn't confirmed yet (and renders nothing).
 * This marks assets we already have on disk that are known-wrong —
 * generic construction stock, not this project — and does render, since
 * withholding it would leave the page with no imagery at all.
 */

export const PLACEHOLDER_ASSET =
  "stock placeholder — not ATEL's own imagery; swap before launch" as const;

export interface StockImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly note: typeof PLACEHOLDER_ASSET;
}

export interface StockVideo {
  readonly src: string;
  readonly poster: string;
  readonly note: typeof PLACEHOLDER_ASSET;
}

export const heroVideo: StockVideo = {
  src: "/media/video/highwayvideo.mp4",
  poster: "/media/video/highwayvideo-poster.jpg",
  note: PLACEHOLDER_ASSET,
};

export const stockImages = {
  aerialMotorway: {
    src: "/media/img/image1.jpg",
    alt: "Aerial view of a motorway under construction, with earthworks and lane markings visible on both sides",
    width: 1920,
    height: 1080,
    note: PLACEHOLDER_ASSET,
  },
  pavingEquipment: {
    src: "/media/img/image2.jpg",
    alt: "Road paving and roller equipment at work on a construction site",
    width: 1920,
    height: 1280,
    note: PLACEHOLDER_ASSET,
  },
  reinforcementWork: {
    src: "/media/img/image3.jpg",
    alt: "Workers placing steel reinforcement mesh across a large foundation excavation",
    width: 1920,
    height: 1277,
    note: PLACEHOLDER_ASSET,
  },
  interchangeConstruction: {
    src: "/media/img/image4.jpg",
    alt: "Concrete piers and construction cranes at an interchange building site",
    width: 1920,
    height: 907,
    note: PLACEHOLDER_ASSET,
  },
} as const satisfies Record<string, StockImage>;
