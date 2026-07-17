/**
 * Content for /gallery — the filterable construction gallery. Items read
 * their image from the media registry (./media.ts); this module adds the
 * per-item caption, category, and date.
 *
 * One real, confirmed image leads the set: the corridor aerial drone
 * photograph (registry `heroCorridorAerial`), a genuine Aerial-category
 * shot. The rest are seeded from construction-01..08, whose image files
 * are not on disk yet (registry `onDisk: false`) — the grid renders those
 * as pending slots, never broken images. Seed category assignments are
 * provisional (`categoryProvisional: true`) placeholders: the client
 * categorises the shots after seeing them placed. Dates use the shared
 * Placeholder<T> system rather than invented values.
 */

import { placeholder, type Placeholder } from "./placeholder";
import type { MediaKey } from "./media";

export interface GalleryCategory {
  readonly id: string;
  readonly label: string;
}

/** The six categories, in display order. Drives the filter control. */
export const galleryCategories: readonly GalleryCategory[] = [
  { id: "interchanges", label: "Interchanges" },
  { id: "bridges-structures", label: "Bridges & Structures" },
  { id: "footbridges", label: "Footbridges" },
  { id: "drainage-culverts", label: "Drainage & Culverts" },
  { id: "earthworks", label: "Earthworks" },
  { id: "aerial", label: "Aerial" },
] as const;

export type GalleryCategoryId = (typeof galleryCategories)[number]["id"];

export interface GalleryItem {
  readonly id: string;
  /** Registry key for the image. */
  readonly media: MediaKey;
  readonly caption: string;
  readonly category: GalleryCategoryId;
  /**
   * True while the category is a provisional placeholder — the client
   * re-categorises after seeing the shots placed. Rendered as a visible
   * "provisional" marker so a guessed category is never mistaken for a
   * confirmed one.
   */
  readonly categoryProvisional: boolean;
  /** Capture date. Placeholder until the client supplies it. */
  readonly date: string | Placeholder<string>;
}

/**
 * Seed set. Every category is provisional and every date is a
 * placeholder; the images resolve automatically once the construction-0N
 * files land in the registry.
 */
export const galleryItems: readonly GalleryItem[] = [
  {
    id: "corridor-aerial",
    media: "heroCorridorAerial",
    caption: "Aerial view of the corridor",
    category: "aerial",
    categoryProvisional: false,
    date: placeholder<string>("Corridor aerial capture date", ""),
  },
  {
    id: "construction-01",
    media: "construction01",
    caption: "Construction progress — image pending",
    category: "interchanges",
    categoryProvisional: true,
    date: placeholder<string>("construction-01 capture date", ""),
  },
  {
    id: "construction-02",
    media: "construction02",
    caption: "Construction progress — image pending",
    category: "interchanges",
    categoryProvisional: true,
    date: placeholder<string>("construction-02 capture date", ""),
  },
  {
    id: "construction-03",
    media: "construction03",
    caption: "Construction progress — image pending",
    category: "bridges-structures",
    categoryProvisional: true,
    date: placeholder<string>("construction-03 capture date", ""),
  },
  {
    id: "construction-04",
    media: "construction04",
    caption: "Construction progress — image pending",
    category: "footbridges",
    categoryProvisional: true,
    date: placeholder<string>("construction-04 capture date", ""),
  },
  {
    id: "construction-05",
    media: "construction05",
    caption: "Construction progress — image pending",
    category: "drainage-culverts",
    categoryProvisional: true,
    date: placeholder<string>("construction-05 capture date", ""),
  },
  {
    id: "construction-06",
    media: "construction06",
    caption: "Construction progress — image pending",
    category: "earthworks",
    categoryProvisional: true,
    date: placeholder<string>("construction-06 capture date", ""),
  },
  {
    id: "construction-07",
    media: "construction07",
    caption: "Construction progress — image pending",
    category: "aerial",
    categoryProvisional: true,
    date: placeholder<string>("construction-07 capture date", ""),
  },
  {
    id: "construction-08",
    media: "construction08",
    caption: "Construction progress — image pending",
    category: "aerial",
    categoryProvisional: true,
    date: placeholder<string>("construction-08 capture date", ""),
  },
] as const;
