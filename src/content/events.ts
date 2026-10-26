/**
 * Visits and events documented by client-supplied photography (added 23 Oct
 * 2026). Each gallery photo referencing one of these (`GalleryItem.eventId`
 * in content/gallery.ts) is captioned from this one record — correcting a
 * title or date here updates every photo from that visit at once.
 *
 * Titles are the client's own wording, verbatim. Dates are the client's
 * stated event dates, not file metadata (none of atel22.jpeg–atel53.jpeg
 * carry EXIF capture dates) and not the site's publish date.
 */

import { formatLongDate, formatMonthYear } from "@/lib/format";

export type DatePrecision = "day" | "month";

export interface GalleryEvent {
  readonly id: string;
  readonly title: string;
  /**
   * ISO 8601 date. When `precision` is "month", the day is always "01" and
   * is a placeholder for sorting only — `formatEventDate` never shows it.
   */
  readonly date: string;
  readonly precision: DatePrecision;
  /**
   * Explicit sort-priority override (client instruction, 26 Oct 2026): when
   * set, this event's folder always sorts ahead of the named event's
   * folder, regardless of either one's date — added so the rule "ministry-
   * led events before the ATEL Board Visit" holds even if a date is later
   * corrected. Deliberately narrow: it overrides the date comparison for
   * ONLY this one pair, so every other folder pair (including this event
   * against anything other than the one it names) still sorts purely by
   * date — see `compareGalleryFolders` in content/folders.ts, the only
   * place that reads it.
   */
  readonly sortAheadOf?: string;
}

export const galleryEvents: readonly GalleryEvent[] = [
  {
    id: "atel-board-visit-jan2026",
    title: "ATEL Board Visit",
    date: "2026-01-22",
    precision: "day",
  },
  {
    id: "minister-roads-highways-inspection-mar2026",
    title: "Minister for Roads and Highways inspects ATMP project",
    date: "2026-03-31",
    precision: "day",
    sortAheadOf: "atel-board-visit-jan2026",
  },
  {
    id: "giif-board-visit-apr2026",
    title: "GIIF Board pays a working visit to the project site",
    date: "2026-04-08",
    precision: "day",
  },
  {
    id: "liberian-delegation-aug2026",
    title: "Liberian Delegation pays benchmark visit to Project Site to learn GIIF's proven infrastructure model",
    date: "2026-08-14",
    precision: "day",
  },
  // No photos assigned yet (client instruction, 23 Oct 2026: don't invent a
  // file range). The record exists so confirmed images can reference it
  // later with no schema change — see the report for this choice.
  {
    id: "mofep-monitoring-visit-sep2026",
    title: "Monitoring Team from the Ministry of Finance pays an inspection visit to project site",
    date: "2026-09-22",
    precision: "day",
    sortAheadOf: "atel-board-visit-jan2026",
  },
  {
    id: "breast-cancer-awareness-oct2026",
    title: "Breast cancer awareness education at the project site",
    date: "2026-10-01",
    precision: "month",
  },
] as const;

export type GalleryEventId = (typeof galleryEvents)[number]["id"];

export const galleryEventsById: ReadonlyMap<GalleryEventId, GalleryEvent> = new Map(
  galleryEvents.map((event) => [event.id, event]),
);

/** "ATEL Board Visit" → "22 January 2026"; month-precision → "October 2026". */
export function formatEventDate(event: GalleryEvent): string {
  return event.precision === "month" ? formatMonthYear(event.date) : formatLongDate(event.date);
}
