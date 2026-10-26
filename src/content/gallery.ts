/**
 * Central gallery data. Titles describe what each image verifiably shows;
 * where the report does not let an image be tied to a specific chainage or
 * activity, a neutral title is used rather than an invented location.
 * Company, government and stakeholder logos, portraits and duplicates are
 * deliberately excluded.
 */

import { mediaRegistry, type MediaKey, type RegisteredMediaAsset } from "./media";
import { galleryEventsById, formatEventDate, type GalleryEventId } from "./events";

export interface GalleryCategory {
  readonly id: string;
  readonly label: string;
}

/**
 * Only categories that actually contain images (no always-empty filters).
 * "Visits & Events" added 23 Oct 2026 (client instruction) for photography
 * of site visits, inspections and awareness events — deliberately separate
 * from the construction categories below it, which document works in
 * progress rather than who visited.
 */
export const galleryCategories: readonly GalleryCategory[] = [
  { id: "interchanges", label: "Interchanges" },
  { id: "bridges", label: "Bridges" },
  { id: "drainage", label: "Drainage" },
  { id: "earthworks", label: "Earthworks" },
  { id: "proposed-designs", label: "Proposed Designs" },
  { id: "corridor-maps", label: "Corridor and Maps" },
  { id: "archives", label: "Archives" },
  { id: "visits-events", label: "Visits & Events" },
] as const;

export type GalleryCategoryId = (typeof galleryCategories)[number]["id"];

const CATEGORY_LABEL = new Map(galleryCategories.map((category) => [category.id, category.label]));

export type GalleryType = "Construction Photo" | "Proposed Design";

export interface GalleryItem {
  readonly id: string;
  /**
   * ISO 8601 date. The Gallery sorts on this, newest first — so a newly
   * added entry sorts to the front purely by carrying a later date, with no
   * manual reordering and no code change.
   *
   * Two meanings depending on whether `eventId` is set: for a photo tied to
   * an event (below), this is that event's own real date, read from
   * content/events.ts — not a publish date. For everything else it is
   * "published on", not "captured on": we know when an image was added to
   * the site, but the client has not supplied capture dates for the older
   * sets, and inventing them would be inventing facts. Either way it is
   * never rendered — the Gallery doesn't show dates directly, only through
   * `resolveGalleryCaption` for event photos.
   */
  readonly addedOn: string;
  readonly media: MediaKey;
  readonly title: string;
  readonly category: GalleryCategoryId;
  readonly type: GalleryType;
  /**
   * The visit or event this photo documents (content/events.ts). When set,
   * it — not `category`/`type` — drives the caption shown in the Gallery and
   * lightbox (see `resolveGalleryCaption` below), and `addedOn` above is set
   * to that event's own real, client-confirmed date rather than a publish
   * date, so sorting stays newest-first "from the date field" with no second
   * sort key. Added 23 Oct 2026, replacing the 22 Oct `dateIsApproximate`
   * placeholder now that real dates exist for every photo that carries one.
   */
  readonly eventId?: GalleryEventId;
  /**
   * Marks a category assignment as not yet client-confirmed (client
   * instruction, 23 Oct 2026) — not shown in the UI, kept so these entries
   * can be found in one place if the client later wants a different
   * grouping. Currently true on every `eventId` photo below.
   */
  readonly provisional?: boolean;
  /**
   * Keeps an item out of every slider that reads the gallery newest-first
   * (currently just "The Journey" on Home — see corridor-timeline.tsx;
   * the Hero slider is separately curated and never reads this registry at
   * all). Added 22 Oct 2026 for the 21-photo batch below, which the client
   * does not want surfacing there; works for any future entry the same way,
   * no filename or id ever hardcoded in the component.
   */
  readonly excludeFromSliders?: boolean;
}

/**
 * Archives photos carry the day they were added to the site, like every
 * other non-event item. Their capture dates are unknown to the client and
 * are deliberately never displayed; the Archives folder is pinned last by
 * `pinLast` in content/folders.ts, not by this date.
 */
const ARCHIVE_ADDED_ON = "2026-10-26";

export const galleryItems: readonly GalleryItem[] = [
  // --- Visits & Events (client instruction, 23 Oct 2026) ---------------------
  // Five visits/events with photography, grouped below by event; all carry
  // eventId, provisional: true (category not yet client-confirmed) and
  // excludeFromSliders: true (none of these may appear in the Home hero
  // slider or "The Journey"). `addedOn` on every entry is that event's own
  // real date (content/events.ts), not a publish-date placeholder — the
  // 22 Oct dateIsApproximate field is retired now that real dates exist.
  // Within each event, entries are ordered by filename ascending — the one
  // place to reorder if a different sequence is ever wanted.
  //
  // atel02.jpg stays unregistered: confirmed (SHA-256 and two independent
  // visual inspections) as a real aerial photo, byte-identical to
  // headerImage — see the report for the open conflict with the "concept
  // of the final work" note. The Ministry of Finance monitoring-team visit
  // (22 Sept 2026) has no files in this batch; its event record exists in
  // content/events.ts with zero photos rather than being invented here.

  // ATEL Board Visit — 22 January 2026 (atel22–atel29)
  { id: "event-atel22", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel22", title: "Reviewing a Progress Dashboard in the Boardroom", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel23", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel23", title: "Delegation Group Photo Beside Interchange Design Boards", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel24", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel24", title: "Site Visit Near Reinforcement Works", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel25", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel25", title: "Delegation at a Concrete Batching Plant", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel26", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel26", title: "Delegation at an Underpass Structure", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel27", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel27", title: "Observing an Overpass Span Under Scaffolding", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel28", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel28", title: "Delegation on a Bridge Deck", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel29", addedOn: "2026-01-22", eventId: "atel-board-visit-jan2026", provisional: true, excludeFromSliders: true, media: "atel29", title: "Delegation Beside Site Vehicles and a Crane", category: "visits-events", type: "Construction Photo" },

  // Minister for Roads and Highways inspects ATMP project — 31 March 2026
  // (atel01, atel03–atel21; atel02 excluded, see above). Titles carried
  // over unchanged from the 22 Oct registration.
  { id: "event-atel01", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch01", title: "Site Visit Along the Corridor", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel03", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch03", title: "Bridge Deck Reinforcement Under a Launching Gantry", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel04", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch04", title: "Precast Beam Yard with Gantry Cranes", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel05", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch05", title: "Engineers and Officials on Site", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel06", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch06", title: "Project Briefing with Press", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel07", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch07", title: "Site Visit Near a Launching Gantry", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel08", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch08", title: "Indoor Project Meeting", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel09", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch09", title: "Press Interview During a Site Visit", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel10", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch10", title: "Press Interview on Site", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel11", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch11", title: "Launching Gantry Over Bridge Deck Reinforcement", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel12", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch12", title: "Press Interview Near a Piling Rig", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel13", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch13", title: "Twin-Cell Underpass Structure", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel14", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch14", title: "Design Review Meeting", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel15", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch15", title: "Site Visit Near Piling Works", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel16", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch16", title: "Gantry Crane Lowering a Load", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel17", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch17", title: "Delegation Walking the Corridor", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel18", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch18", title: "Group Photo at the Construction Site", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel19", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch19", title: "Project Discussion", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel20", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch20", title: "Indoor Meeting Beside a Window", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel21", addedOn: "2026-03-31", eventId: "minister-roads-highways-inspection-mar2026", provisional: true, excludeFromSliders: true, media: "octoberBatch21", title: "Indoor Meeting with Microphone Stand", category: "visits-events", type: "Construction Photo" },

  // GIIF Board pays a working visit to the project site — 8 April 2026
  // (atel30–atel36). The presentation slide visible in atel35/atel36 itself
  // reads "8th March 2026" — a discrepancy with the date given for this
  // event; flagged in the report rather than silently resolved either way.
  { id: "event-atel30", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel30", title: "Delegation Meeting Indoors", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel31", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel31", title: "GIIF Board Meeting in the Boardroom", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel32", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel32", title: "GIIF Board Reviewing a Presentation", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel33", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel33", title: "GIIF Board Meeting, Boardroom View", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel34", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel34", title: "GIIF Board Meeting Beside a Site Window", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel35", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel35", title: "Presentation to the GIIF Board", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel36", addedOn: "2026-04-08", eventId: "giif-board-visit-apr2026", provisional: true, excludeFromSliders: true, media: "atel36", title: "Presentation to the GIIF Board, Wider View", category: "visits-events", type: "Construction Photo" },

  // Liberian Delegation pays benchmark visit to Project Site — 14 August 2026
  // (atel43–atel53)
  { id: "event-atel43", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel43", title: "Liberian Delegation Seated in the Boardroom", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel44", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel44", title: "Liberian Delegation Meeting, Close View", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel45", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel45", title: "Liberian Delegation Meeting Beside a Window", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel46", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel46", title: "Liberian Delegation Boardroom Meeting", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel47", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel47", title: "Liberian Delegation Beside Interchange Design Boards", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel48", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel48", title: "Liberian Delegation Meeting, Seated View", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel49", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel49", title: "Delegation Briefing Beside the Boardroom Entrance", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel50", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel50", title: "Liberian Delegation Reviewing a Corridor Map", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel51", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel51", title: "Liberian Delegation Beside Interchange Design Boards", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel52", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel52", title: "Delegation Group Photo Beside Interchange Design Boards", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel53", addedOn: "2026-08-14", eventId: "liberian-delegation-aug2026", provisional: true, excludeFromSliders: true, media: "atel53", title: "Delegation Group Photo Beside Interchange Design Boards, Second View", category: "visits-events", type: "Construction Photo" },

  // Breast cancer awareness education at the project site — October 2026
  // (month precision only; atel37–atel42)
  { id: "event-atel37", addedOn: "2026-10-01", eventId: "breast-cancer-awareness-oct2026", provisional: true, excludeFromSliders: true, media: "atel37", title: "Breast Cancer Awareness Session — Overview of Stages", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel38", addedOn: "2026-10-01", eventId: "breast-cancer-awareness-oct2026", provisional: true, excludeFromSliders: true, media: "atel38", title: "Breast Cancer Awareness Session — Support and Awareness", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel39", addedOn: "2026-10-01", eventId: "breast-cancer-awareness-oct2026", provisional: true, excludeFromSliders: true, media: "atel39", title: "Breast Cancer Awareness Session, Wider View", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel40", addedOn: "2026-10-01", eventId: "breast-cancer-awareness-oct2026", provisional: true, excludeFromSliders: true, media: "atel40", title: "Breast Cancer Awareness Session Beside Design Boards", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel41", addedOn: "2026-10-01", eventId: "breast-cancer-awareness-oct2026", provisional: true, excludeFromSliders: true, media: "atel41", title: "Breast Cancer Awareness Presentation", category: "visits-events", type: "Construction Photo" },
  { id: "event-atel42", addedOn: "2026-10-01", eventId: "breast-cancer-awareness-oct2026", provisional: true, excludeFromSliders: true, media: "atel42", title: "Breast Cancer Awareness Presentation, Closer View", category: "visits-events", type: "Construction Photo" },

  // Removed from the Home hero slider (client instruction, 24 Oct 2026) and
  // registered here instead, so the photo stays visible on the site — same
  // "headerImage" media key the hero used to reference (confirmed by
  // SHA-256 to be the exact same file as atel02.jpg), not a second entry
  // for atel02.jpg itself. excludeFromSliders keeps it out of "The Journey"
  // too, so that section's output is provably unaffected by this move.
  { id: "header-image", addedOn: "2026-10-24", excludeFromSliders: true, media: "headerImage", title: "Completed Flyover Interchange", category: "interchanges", type: "Construction Photo" },

  // --- Aerial corridor construction photography (client-supplied), sorted 1–10.
  { id: "atel-1", addedOn: "2026-07-17", media: "atelJunctionUnderpass", title: "Junction Underpass Construction", category: "interchanges", type: "Construction Photo" },
  { id: "atel-2", addedOn: "2026-07-17", media: "atelBridgeDeckRebar", title: "Bridge Deck Reinforcement", category: "bridges", type: "Construction Photo" },
  { id: "atel-3", addedOn: "2026-07-17", media: "atelPierConcreting", title: "Bridge Pier Concreting", category: "bridges", type: "Construction Photo" },
  { id: "atel-4", addedOn: "2026-07-17", media: "atelOverpassDeck", title: "Overpass Deck Construction", category: "bridges", type: "Construction Photo" },
  { id: "atel-5", addedOn: "2026-07-17", media: "atelCorridorOverpass", title: "Corridor Overpass and Piers", category: "bridges", type: "Construction Photo" },
  { id: "atel-6", addedOn: "2026-07-17", media: "atelCorridorPiersWide", title: "Corridor Widening with New Piers", category: "corridor-maps", type: "Construction Photo" },
  { id: "atel-7", addedOn: "2026-07-17", media: "atelOverpassCrossheads", title: "Overpass Piers and Crossheads", category: "bridges", type: "Construction Photo" },
  { id: "atel-8", addedOn: "2026-07-17", media: "atelCarriagewaySection", title: "Completed Carriageway Section", category: "corridor-maps", type: "Construction Photo" },
  { id: "atel-9", addedOn: "2026-07-17", media: "atelRoadsideRamps", title: "Roadside Ramp Structures", category: "corridor-maps", type: "Construction Photo" },
  { id: "atel-10", addedOn: "2026-07-17", media: "atelJunctionRoundabout", title: "Major Junction Underpass", category: "interchanges", type: "Construction Photo" },
  // Interchanges
  { id: "underpass", addedOn: "2026-07-17", media: "underpassStructure", title: "Interchange Underpass Construction", category: "interchanges", type: "Construction Photo" },
  // Bridges
  { id: "tbeam", addedOn: "2026-07-17", media: "bridgeTBeamLaunch", title: "Bridge T-Beam Launching", category: "bridges", type: "Construction Photo" },
  { id: "deck-rebar", addedOn: "2026-07-17", media: "bridgeDeckPour", title: "Bridge Deck Reinforcement and Concreting", category: "bridges", type: "Construction Photo" },
  { id: "deck-concreting", addedOn: "2026-07-17", media: "bridgeDeckConcreting", title: "Bridge Deck Concreting", category: "bridges", type: "Construction Photo" },
  { id: "deck-finishing", addedOn: "2026-07-17", media: "deckFinishing", title: "Deck Slab Concreting", category: "bridges", type: "Construction Photo" },
  { id: "overpass-piers", addedOn: "2026-07-17", media: "overpassPiers", title: "Overpass Pier Construction", category: "bridges", type: "Construction Photo" },
  { id: "corridor-piers", addedOn: "2026-07-17", media: "corridorPiers", title: "Corridor Bridge Piers", category: "bridges", type: "Construction Photo" },
  { id: "corridor-gantries", addedOn: "2026-07-17", media: "corridorGantries", title: "Corridor Overpass Construction", category: "bridges", type: "Construction Photo" },
  // Drainage
  { id: "box-culvert", addedOn: "2026-07-17", media: "culvertEarthworks", title: "Box Culvert Construction", category: "drainage", type: "Construction Photo" },
  { id: "stream-culvert", addedOn: "2026-07-17", media: "streamCulvert", title: "Culvert Works at a Watercourse", category: "drainage", type: "Construction Photo" },
  { id: "river-culverts", addedOn: "2026-07-17", media: "riverBridgeCulverts", title: "River Crossing Culvert Works", category: "drainage", type: "Construction Photo" },
  // Earthworks
  { id: "rock-filling", addedOn: "2026-07-17", media: "rockFilling", title: "Earthworks and Rock Filling", category: "earthworks", type: "Construction Photo" },
  { id: "retaining-wall", addedOn: "2026-07-17", media: "retainingWall", title: "Retaining Wall Reinforcement", category: "earthworks", type: "Construction Photo" },
  { id: "dust-spraying", addedOn: "2026-07-17", media: "dustSpraying", title: "Dust Suppression on the Corridor", category: "earthworks", type: "Construction Photo" },
  // Proposed designs
  { id: "d-teshie", addedOn: "2026-07-17", media: "teshieLinkProposed", title: "Teshie Link Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-comm18", addedOn: "2026-07-17", media: "comm18Proposed", title: "Community 18 Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-lashibi", addedOn: "2026-07-17", media: "lashibiRender", title: "Lashibi Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-tetteh", addedOn: "2026-07-17", media: "tettehQuarshieProposed", title: "Tetteh Quarshie Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-toll", addedOn: "2026-07-17", media: "tollPlazaRender", title: "Toll Plaza — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-flyover", addedOn: "2026-07-17", media: "flowerPotRemodel", title: "Corridor Flyover — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  // Corridor and maps
  { id: "corridor-aerial", addedOn: "2026-07-17", media: "corridorAerial", title: "Section 1 Corridor Under Construction", category: "corridor-maps", type: "Construction Photo" },
  { id: "cross-section", addedOn: "2026-07-17", media: "designScheme", title: "Typical Road Cross-Section", category: "corridor-maps", type: "Proposed Design" },
  { id: "route-viz", addedOn: "2026-07-17", media: "routeAlignmentMap", title: "Accra–Tema Corridor — Design Visualisation", category: "corridor-maps", type: "Proposed Design" },
  // --- 28 August 2026 progress photography (client-supplied, captioned by chainage) ---
  { id: "prog-ashaiman", addedOn: "2026-08-28", media: "progAshaiman", title: "Corridor at Ashaiman", category: "corridor-maps", type: "Construction Photo" },
  { id: "prog-bridge-10a", addedOn: "2026-08-28", media: "progBridgeKm10873A", title: "Bridge Construction at Km 10+873", category: "bridges", type: "Construction Photo" },
  { id: "prog-bridge-10b", addedOn: "2026-08-28", media: "progBridgeKm10873B", title: "Bridge Deck Works at Km 10+873", category: "bridges", type: "Construction Photo" },
  { id: "prog-bridge-13a", addedOn: "2026-08-28", media: "progBridgeKm13745A", title: "Bridge Construction at Km 13+745", category: "bridges", type: "Construction Photo" },
  { id: "prog-bridge-13b", addedOn: "2026-08-28", media: "progBridgeKm13745B", title: "Bridge Deck Works at Km 13+745", category: "bridges", type: "Construction Photo" },
  { id: "prog-bridge-16a", addedOn: "2026-08-28", media: "progBridgeKm16556A", title: "Bridge Construction at Km 16+556", category: "bridges", type: "Construction Photo" },
  { id: "prog-bridge-16b", addedOn: "2026-08-28", media: "progBridgeKm16556B", title: "Bridge Deck Works at Km 16+556", category: "bridges", type: "Construction Photo" },
  { id: "prog-c18", addedOn: "2026-08-28", media: "progCommunity18", title: "Community 18 Interchange Works", category: "interchanges", type: "Construction Photo" },
  { id: "prog-fb8a", addedOn: "2026-08-28", media: "progFootbridgeKm8050A", title: "Pedestrian Footbridge at Km 8+050", category: "bridges", type: "Construction Photo" },
  { id: "prog-fb8b", addedOn: "2026-08-28", media: "progFootbridgeKm8050B", title: "Footbridge Steelwork at Km 8+050", category: "bridges", type: "Construction Photo" },
  { id: "prog-fb8c", addedOn: "2026-08-28", media: "progFootbridgeKm8050C", title: "Footbridge Construction at Km 8+050", category: "bridges", type: "Construction Photo" },
  { id: "prog-fb9", addedOn: "2026-08-28", media: "progFootbridgeKm9920", title: "Pedestrian Footbridge at Km 9+920", category: "bridges", type: "Construction Photo" },
  { id: "prog-ret-a", addedOn: "2026-08-28", media: "progRetainingKm12120A", title: "Retaining Wall at Km 12+120", category: "earthworks", type: "Construction Photo" },
  { id: "prog-ret-b", addedOn: "2026-08-28", media: "progRetainingKm12120B", title: "Retaining Wall Construction at Km 12+120", category: "earthworks", type: "Construction Photo" },
  { id: "prog-ret-c", addedOn: "2026-08-28", media: "progRetainingKm12120C", title: "Retaining Wall Reinforcement at Km 12+120", category: "earthworks", type: "Construction Photo" },
  { id: "prog-roadbed", addedOn: "2026-08-28", media: "progRoadbedKm910", title: "Roadbed Preparation at Km 9+000–10+000", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sub76", addedOn: "2026-08-28", media: "progSubbaseKm7600", title: "Sub-base Laying at Km 7+600", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sub81", addedOn: "2026-08-28", media: "progSubbaseKm8140", title: "Sub-base Laying at Km 8+140", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sg133", addedOn: "2026-08-28", media: "progSubgradeKm13300", title: "Subgrade Preparation at Km 13+300", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sg172", addedOn: "2026-08-28", media: "progSubgradeKm17200", title: "Subgrade Preparation at Km 17+200", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sg175", addedOn: "2026-08-28", media: "progSubgradeKm17500", title: "Subgrade Preparation at Km 17+500", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sg179", addedOn: "2026-08-28", media: "progSubgradeKm17900", title: "Subgrade Works at Km 17+900", category: "earthworks", type: "Construction Photo" },
  { id: "prog-sg180", addedOn: "2026-08-28", media: "progSubgradeKm18000", title: "Subgrade Preparation at Km 18+000", category: "earthworks", type: "Construction Photo" },
  { id: "prog-tbeam", addedOn: "2026-08-28", media: "progTBeam", title: "Precast T-Beams for Bridge Decks", category: "bridges", type: "Construction Photo" },
  { id: "prog-up27", addedOn: "2026-08-28", media: "progUnderpassKm2701", title: "Underpass Construction at Km 2+701", category: "interchanges", type: "Construction Photo" },
  { id: "prog-up16a", addedOn: "2026-08-28", media: "progUnderpassKm16105A", title: "Underpass Construction at Km 16+105", category: "interchanges", type: "Construction Photo" },
  { id: "prog-up16b", addedOn: "2026-08-28", media: "progUnderpassKm16105B", title: "Underpass Works at Km 16+105", category: "interchanges", type: "Construction Photo" },
  { id: "prog-tl-walls", addedOn: "2026-08-28", media: "teshieLinkDiversionWalls", title: "Teshie Link Interchange — Traffic Diversion Walls", category: "interchanges", type: "Construction Photo" },
  { id: "prog-tl-footing", addedOn: "2026-08-28", media: "teshieLinkFootingWall", title: "Teshie Link Interchange — Footing Wall", category: "interchanges", type: "Construction Photo" },
  { id: "prog-c18-footing", addedOn: "2026-08-28", media: "comm18FootingWall", title: "Community 18 Interchange — Footing Wall", category: "interchanges", type: "Construction Photo" },
  { id: "prog-c18-underpass", addedOn: "2026-08-28", media: "comm18Underpass", title: "Community 18 Interchange — Underpass", category: "interchanges", type: "Construction Photo" },
  // --- Archives (client instruction, 26 Oct 2026) ---------------------------
  { id: "archive-20240103_135531", addedOn: ARCHIVE_ADDED_ON, media: "archive240103135531", title: "Excavator Beside Cleared Ground", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240103_141515", addedOn: ARCHIVE_ADDED_ON, media: "archive240103141515", title: "Earth Strip Beside a Road", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240104_111804", addedOn: ARCHIVE_ADDED_ON, media: "archive240104111804", title: "Two People in Hard Hats and Vests", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240104_111908", addedOn: ARCHIVE_ADDED_ON, media: "archive240104111908", title: "Motor Grader on Dirt Surface", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240104_111922", addedOn: ARCHIVE_ADDED_ON, media: "archive240104111922", title: "Motor Grader on Graded Earth", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240104_114009", addedOn: ARCHIVE_ADDED_ON, media: "archive240104114009", title: "Joint Between Concrete Road Slabs", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240105_144103", addedOn: ARCHIVE_ADDED_ON, media: "archive240105144103", title: "Earth Marked by Machine Tracks", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240105_151028", addedOn: ARCHIVE_ADDED_ON, media: "archive240105151028", title: "Excavator Beside Cleared Vegetation", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240106_102201", addedOn: ARCHIVE_ADDED_ON, media: "archive240106102201", title: "Dirt Track with Heavy Tyre Marks", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240106_113941", addedOn: ARCHIVE_ADDED_ON, media: "archive240106113941", title: "Rollers and Excavators Parked in a Row", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240106_114023", addedOn: ARCHIVE_ADDED_ON, media: "archive240106114023", title: "Truck-Mounted Cranes Parked in a Row", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240106_114135", addedOn: ARCHIVE_ADDED_ON, media: "archive240106114135", title: "Bulldozer at Rest", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240106_114148", addedOn: ARCHIVE_ADDED_ON, media: "archive240106114148", title: "Machines with Large Buckets in a Row", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240108_110858", addedOn: ARCHIVE_ADDED_ON, media: "archive240108110858", title: "Graded Earth with Deep Tyre Tracks", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240111_161851", addedOn: ARCHIVE_ADDED_ON, media: "archive240111161851", title: "Self-Portrait in Hard Hat and Vest", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240113_111239", addedOn: ARCHIVE_ADDED_ON, media: "archive240113111239", title: "Cleared Strip of Reddish Earth", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240116_083042", addedOn: ARCHIVE_ADDED_ON, media: "archive240116083042", title: "Paving Machine Beside Fresh Asphalt", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240117_103842", addedOn: ARCHIVE_ADDED_ON, media: "archive240117103842", title: "Two Yellow Silos on a Scaffold Frame", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240117_103935", addedOn: ARCHIVE_ADDED_ON, media: "archive240117103935", title: "Yellow Silos Beside a Long Storage Shed", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240120_112626", addedOn: ARCHIVE_ADDED_ON, media: "archive240120112626", title: "Metal Wall Beside Bare Earth", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240123_120240", addedOn: ARCHIVE_ADDED_ON, media: "archive240123120240", title: "Two People Measuring Across a Field", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240127_112127", addedOn: ARCHIVE_ADDED_ON, media: "archive240127112127", title: "Earth Strip Beside a Gravel Edge", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240127_112640", addedOn: ARCHIVE_ADDED_ON, media: "archive240127112640", title: "Concrete Culvert Beneath a Road", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240229_095807", addedOn: ARCHIVE_ADDED_ON, media: "archive240229095807", title: "Pipe Lengths on Open Ground", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240229_100456", addedOn: ARCHIVE_ADDED_ON, media: "archive240229100456", title: "Narrow Excavated Trench", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240229_100518", addedOn: ARCHIVE_ADDED_ON, media: "archive240229100518", title: "Pipe Beside a Trench", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240229_100612", addedOn: ARCHIVE_ADDED_ON, media: "archive240229100612", title: "Black Pipe Beside a Trench", category: "archives", type: "Construction Photo", excludeFromSliders: true },
  { id: "archive-20240229_101932", addedOn: ARCHIVE_ADDED_ON, media: "archive240229101932", title: "Green Mesh Fence Beside a Building", category: "archives", type: "Construction Photo", excludeFromSliders: true },
] as const;

export interface ResolvedGalleryItem {
  readonly item: GalleryItem;
  readonly asset: RegisteredMediaAsset;
}

/**
 * Validate and resolve gallery items before render. Any entry missing a
 * required field, or whose media key doesn't resolve to a real on-disk
 * asset, is SKIPPED (with a dev-only warning) rather than allowed to throw —
 * so a single bad entry or a mistyped key can never blank the whole Gallery
 * page. The returned list is what both the grid and the lightbox render, so
 * their indices stay aligned.
 */
export function resolveGalleryItems(items: readonly GalleryItem[]): ResolvedGalleryItem[] {
  const resolved: ResolvedGalleryItem[] = [];
  for (const item of items) {
    const asset = item?.media
      ? (mediaRegistry[item.media] as RegisteredMediaAsset | undefined)
      : undefined;
    const valid =
      !!item?.id &&
      !!item?.title &&
      !!item?.category &&
      !!asset &&
      !!asset.src &&
      !!asset.alt &&
      asset.onDisk;
    if (!valid) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[gallery] skipping invalid item id="${item?.id ?? "?"}" media="${String(item?.media)}"`,
        );
      }
      continue;
    }
    resolved.push({ item, asset });
  }
  /**
   * Newest first, by the item’s published date. Sorting here (rather than
   * relying on array order) means a new entry needs only a later `addedOn`
   * to appear at the front — no manual reordering, no code change. Ties fall
   * back to the array order, which is stable in V8, so same-day batches keep
   * their authored sequence.
   */
  return resolved.sort((a, b) => b.item.addedOn.localeCompare(a.item.addedOn));
}

export interface GalleryCaption {
  /** The event title for an event photo, else the item's own title. */
  readonly heading: string;
  /** Category label plus event date, or category plus type — one line. */
  readonly meta: string;
  /** Single-line form for contexts with no room for two lines (the lightbox). */
  readonly full: string;
}

/**
 * The caption shown for a gallery item (added 23 Oct 2026, for the Visits &
 * Events photos). An item with `eventId` is captioned from its event —
 * title and date, read once from content/events.ts — rather than from its
 * own `category`/`type`, per the client's "caption each image with the
 * event title and date" instruction. Everything else renders exactly as it
 * did before this existed.
 */
export function resolveGalleryCaption(item: GalleryItem): GalleryCaption {
  const categoryLabel = CATEGORY_LABEL.get(item.category) ?? item.category;
  const event = item.eventId ? galleryEventsById.get(item.eventId) : undefined;
  if (event) {
    const date = formatEventDate(event);
    return { heading: event.title, meta: `${categoryLabel} · ${date}`, full: `${event.title} — ${date}` };
  }
  return { heading: item.title, meta: `${categoryLabel} · ${item.type}`, full: item.title };
}
