/**
 * Gallery folders (added 24 Oct 2026, replacing category-filtered pagination
 * — client instruction). A folder is either ALL the photos from one visit or
 * event (content/events.ts), or all the photos in one of the pre-existing
 * construction/design categories (content/gallery.ts) — the exact same
 * six-category mapping the old filter used. Deliberately one level only, no
 * nesting.
 *
 * `date`/`precision`/the image list are NOT duplicated here: each folder
 * points at an event id or a category id and reads them from the one
 * existing source for that data, so a folder's date can never drift from
 * its event's own date, and a newly added photo in a category needs no
 * change here to show up in the matching folder.
 */

import { mediaRegistry, type MediaKey, type RegisteredMediaAsset } from "./media";
import {
  galleryCategories,
  galleryItems,
  resolveGalleryItems,
  type GalleryCategoryId,
  type ResolvedGalleryItem,
} from "./gallery";
import { galleryEventsById, formatEventDate, type DatePrecision, type GalleryEventId } from "./events";

const categoryLabel = new Map(galleryCategories.map((category) => [category.id, category.label]));

export type GalleryFolderGroup = "visits-events" | "construction-design" | "archives";

export const folderGroupLabel: Record<GalleryFolderGroup, string> = {
  "visits-events": "Visits & Events",
  "construction-design": "Construction & Design",
  archives: "Archives",
};

type FolderSource =
  | { readonly kind: "event"; readonly eventId: GalleryEventId }
  | { readonly kind: "category"; readonly categoryId: GalleryCategoryId };

export interface GalleryFolderDef {
  readonly slug: string;
  readonly group: GalleryFolderGroup;
  readonly source: FolderSource;
  /** Explicit cover override. Falls back to the first image (filename order) if unset. */
  readonly coverMedia?: MediaKey;
  /** Up to 3 explicit hover-preview images. Falls back to the next images after the cover if unset. */
  readonly previewMedia?: readonly MediaKey[];
  /**
   * When true, this folder always sorts after every non-pinned folder,
   * regardless of date (used for Archives, whose capture dates aren't
   * known — see the 26 Oct 2026 report). Two pinned folders would fall
   * back to date order between themselves; there's only one today.
   */
  readonly pinLast?: boolean;
  /**
   * True when the folder's capture dates are unknown: no date, month or year
   * is shown for it (card, page header, metadata), and `date` is used for
   * nothing but the fallback sort between two non-pinned folders.
   */
  readonly undated?: boolean;
  /** One-line description shown under the folder title and used in metadata. */
  readonly description?: string;
  /** A video featured at the top of the folder page. Not a gallery item: it never counts as a photo and never reaches a slider. */
  readonly video?: MediaKey;
}

export const galleryFolderDefs: readonly GalleryFolderDef[] = [
  // --- Visits & Events ---------------------------------------------------
  // Title isn't stored here — it's read from the event (content/events.ts),
  // the client's own wording, so there's exactly one place each title lives.
  { slug: "atel-board-visit", group: "visits-events", source: { kind: "event", eventId: "atel-board-visit-jan2026" } },
  { slug: "minister-roads-highways-inspection", group: "visits-events", source: { kind: "event", eventId: "minister-roads-highways-inspection-mar2026" } },
  { slug: "giif-board-visit", group: "visits-events", source: { kind: "event", eventId: "giif-board-visit-apr2026" } },
  { slug: "liberian-delegation-visit", group: "visits-events", source: { kind: "event", eventId: "liberian-delegation-aug2026" } },
  { slug: "breast-cancer-awareness", group: "visits-events", source: { kind: "event", eventId: "breast-cancer-awareness-oct2026" } },
  // No photos yet — resolves to null and is excluded from the index below;
  // appears automatically once files are added to this event (no new code
  // needed, see resolveGalleryFolder).
  { slug: "mofep-monitoring-visit", group: "visits-events", source: { kind: "event", eventId: "mofep-monitoring-visit-sep2026" } },

  // --- Construction & Design — one folder per existing category ---------
  // Title read from galleryCategories (content/gallery.ts) the same way.
  { slug: "interchanges", group: "construction-design", source: { kind: "category", categoryId: "interchanges" } },
  { slug: "bridges", group: "construction-design", source: { kind: "category", categoryId: "bridges" } },
  { slug: "drainage", group: "construction-design", source: { kind: "category", categoryId: "drainage" } },
  { slug: "earthworks", group: "construction-design", source: { kind: "category", categoryId: "earthworks" } },
  { slug: "proposed-designs", group: "construction-design", source: { kind: "category", categoryId: "proposed-designs" } },
  { slug: "corridor-maps", group: "construction-design", source: { kind: "category", categoryId: "corridor-maps" } },

  // --- Archives (client instruction, 26 Oct 2026) -------------------------
  // Pinned to the very end and undated: the capture dates are unknown, so
  // nothing about it may imply one. The description is a neutral stand-in,
  // PENDING THE CLIENT'S OWN WORDING. Cover is the one landscape frame in
  // the set (a wide view of the batching plant), since a portrait photo
  // crops badly into the 4:3 card.
  {
    slug: "archives",
    group: "archives",
    source: { kind: "category", categoryId: "archives" },
    coverMedia: "archive240117103935",
    pinLast: true,
    undated: true,
    description: "Early images from the start of the project.",
    video: "archiveSodCuttingVideo",
  },
] as const;

export type GalleryFolderSlug = (typeof galleryFolderDefs)[number]["slug"];

export interface ResolvedGalleryFolder {
  readonly def: GalleryFolderDef;
  readonly slug: string;
  readonly title: string;
  readonly group: GalleryFolderGroup;
  /** Set only for an event-sourced folder — read by compareGalleryFolders for the sortAheadOf rule. */
  readonly eventId?: GalleryEventId;
  readonly date: string;
  readonly precision: DatePrecision;
  /** Filename-ascending — the folder's own display order, independent of the flat Gallery's old newest-first sort. */
  readonly items: readonly ResolvedGalleryItem[];
  readonly cover: ResolvedGalleryItem;
  readonly previews: readonly ResolvedGalleryItem[];
  readonly description?: string;
  readonly video?: RegisteredMediaAsset;
}

/** Base filename for natural (numeric-aware) sort — "atel-images2.webp" before "atel-images10.webp". */
function filenameOf(src: string): string {
  return src.split("/").pop() ?? src;
}

function byFilenameAscending(a: ResolvedGalleryItem, b: ResolvedGalleryItem): number {
  return filenameOf(a.asset.src).localeCompare(filenameOf(b.asset.src), undefined, { numeric: true });
}

/**
 * Resolves one folder definition against the live gallery data. Returns null
 * for a folder with zero matching images (e.g. an event with no photos yet)
 * — callers must drop nulls, which is what keeps an empty folder from ever
 * rendering. The toll-plaza design render is excluded the same way the flat
 * Gallery page used to exclude it (still withdrawn from display).
 */
export function resolveGalleryFolder(def: GalleryFolderDef): ResolvedGalleryFolder | null {
  const matchingItems = galleryItems.filter((item) => {
    if (item.id === "d-toll") return false;
    return def.source.kind === "event" ? item.eventId === def.source.eventId : item.category === def.source.categoryId;
  });
  const items = resolveGalleryItems(matchingItems).sort(byFilenameAscending);
  if (items.length === 0) return null;

  let title: string;
  let date: string;
  let precision: DatePrecision;
  if (def.source.kind === "event") {
    const event = galleryEventsById.get(def.source.eventId);
    if (!event) return null;
    title = event.title;
    date = event.date;
    precision = event.precision;
  } else {
    title = categoryLabel.get(def.source.categoryId) ?? def.source.categoryId;
    // The most recent addedOn among the category's own items — not an
    // invented date, and it moves forward on its own as new photos are
    // added to that category.
    date = items.reduce((max, r) => (r.item.addedOn > max ? r.item.addedOn : max), items[0].item.addedOn);
    precision = "day";
  }

  const cover = (def.coverMedia && items.find((r) => r.item.media === def.coverMedia)) || items[0];
  const previews = def.previewMedia
    ? (def.previewMedia
        .map((key) => items.find((r) => r.item.media === key))
        .filter((r): r is ResolvedGalleryItem => !!r))
    : items.filter((r) => r.item.id !== cover.item.id).slice(0, 3);

  return {
    def,
    slug: def.slug,
    title,
    group: def.group,
    eventId: def.source.kind === "event" ? def.source.eventId : undefined,
    date,
    precision,
    items,
    cover,
    previews,
    description: def.description,
    video: def.video ? mediaRegistry[def.video] : undefined,
  };
}

/**
 * Newest-first by date, with two explicit overrides read from the folder
 * data rather than hardcoded here:
 *  - `def.pinLast` (Archives) always sorts after every non-pinned folder.
 *  - an event's `sortAheadOf` (content/events.ts — currently the Minister
 *    for Roads and Highways inspection and the Ministry of Finance
 *    monitoring visit, both set to outrank the ATEL Board Visit) wins over
 *    date for that ONE named pair only; every other pair, including those
 *    same two events against anything else, still sorts purely by date.
 */
function compareGalleryFolders(a: ResolvedGalleryFolder, b: ResolvedGalleryFolder): number {
  const aPinned = a.def.pinLast ?? false;
  const bPinned = b.def.pinLast ?? false;
  if (aPinned !== bPinned) return aPinned ? 1 : -1;

  if (a.eventId && b.eventId) {
    const aEvent = galleryEventsById.get(a.eventId);
    const bEvent = galleryEventsById.get(b.eventId);
    if (aEvent?.sortAheadOf === bEvent?.id) return -1;
    if (bEvent?.sortAheadOf === aEvent?.id) return 1;
  }

  return b.date.localeCompare(a.date);
}

/** Every folder that actually has images, newest-first. The one list both the index and `generateStaticParams` read. */
export const galleryFolders: readonly ResolvedGalleryFolder[] = galleryFolderDefs
  .map(resolveGalleryFolder)
  .filter((folder): folder is ResolvedGalleryFolder => folder !== null)
  .sort(compareGalleryFolders);

export function getGalleryFolder(slug: string): ResolvedGalleryFolder | undefined {
  return galleryFolders.find((folder) => folder.slug === slug);
}

/** The folder's date line, or null for an undated folder (Archives) — callers must render nothing in that case. */
export function formatFolderDate(folder: ResolvedGalleryFolder): string | null {
  if (folder.def.undated) return null;
  return formatEventDate({ id: folder.slug, title: folder.title, date: folder.date, precision: folder.precision });
}
