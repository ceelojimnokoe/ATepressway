/**
 * Central gallery data. Titles describe what each image verifiably shows;
 * where the report does not let an image be tied to a specific chainage or
 * activity, a neutral title is used rather than an invented location.
 * Company, government and stakeholder logos, portraits and duplicates are
 * deliberately excluded.
 */

import { mediaRegistry, type MediaKey, type RegisteredMediaAsset } from "./media";

export interface GalleryCategory {
  readonly id: string;
  readonly label: string;
}

/** Only categories that actually contain images (no always-empty filters). */
export const galleryCategories: readonly GalleryCategory[] = [
  { id: "interchanges", label: "Interchanges" },
  { id: "bridges", label: "Bridges" },
  { id: "drainage", label: "Drainage" },
  { id: "earthworks", label: "Earthworks" },
  { id: "proposed-designs", label: "Proposed Designs" },
  { id: "corridor-maps", label: "Corridor and Maps" },
] as const;

export type GalleryCategoryId = (typeof galleryCategories)[number]["id"];

export type GalleryType = "Construction Photo" | "Proposed Design";

export interface GalleryItem {
  readonly id: string;
  /**
   * ISO 8601 date this image was published to the site. The Gallery sorts on
   * this, newest first — so a newly added entry sorts to the front purely by
   * carrying a later date, with no manual reordering and no code change.
   *
   * Deliberately "published on", not "captured on": we know when an image was
   * added to the site, but the client has not supplied capture dates for the
   * older sets, and inventing them would be inventing facts.
   */
  readonly addedOn: string;
  readonly media: MediaKey;
  readonly title: string;
  readonly category: GalleryCategoryId;
  readonly type: GalleryType;
  /**
   * True when `addedOn` is standing in for a capture date the client hasn't
   * supplied (client instruction, 22 Oct 2026) — not shown anywhere in the
   * UI (the Gallery doesn't render dates at all), but kept so these entries
   * can be found and corrected in one place if a real date arrives later.
   */
  readonly dateIsApproximate?: boolean;
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

export const galleryItems: readonly GalleryItem[] = [
  // --- 22 Oct 2026: 21-photo batch (client-supplied: atel01.jpg–atel21.jpg,
  // public/images/). atel02.jpg excluded — a byte-for-byte duplicate of
  // headerImage (Home hero slide 1). No capture dates were supplied, so
  // every entry shares one placeholder date (dateIsApproximate: true) —
  // correct it in one place here once a real date is known. All 20 carry
  // excludeFromSliders: true (client instruction) so none can appear in
  // "The Journey" on Home. Order below is the tie-break for same-date
  // sorting (resolveGalleryItems' sort is stable) — filename order,
  // atel01 first, exactly as instructed; reorder this block directly if a
  // different sequence is wanted later, no other file needs to change.
  { id: "oct2026-01", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch01", title: "Site Visit Along the Corridor", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-03", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch03", title: "Bridge Deck Reinforcement Under a Launching Gantry", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-04", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch04", title: "Precast Beam Yard with Gantry Cranes", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-05", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch05", title: "Engineers and Officials on Site", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-06", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch06", title: "Project Briefing with Press", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-07", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch07", title: "Site Visit Near a Launching Gantry", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-08", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch08", title: "Indoor Project Meeting", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-09", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch09", title: "Press Interview During a Site Visit", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-10", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch10", title: "Press Interview on Site", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-11", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch11", title: "Launching Gantry Over Bridge Deck Reinforcement", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-12", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch12", title: "Press Interview Near a Piling Rig", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-13", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch13", title: "Twin-Cell Underpass Structure", category: "interchanges", type: "Construction Photo" },
  { id: "oct2026-14", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch14", title: "Design Review Meeting", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-15", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch15", title: "Site Visit Near Piling Works", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-16", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch16", title: "Gantry Crane Lowering a Load", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-17", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch17", title: "Delegation Walking the Corridor", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-18", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch18", title: "Group Photo at the Construction Site", category: "bridges", type: "Construction Photo" },
  { id: "oct2026-19", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch19", title: "Project Discussion", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-20", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch20", title: "Indoor Meeting Beside a Window", category: "corridor-maps", type: "Construction Photo" },
  { id: "oct2026-21", addedOn: "2026-10-17", dateIsApproximate: true, excludeFromSliders: true, media: "octoberBatch21", title: "Indoor Meeting with Microphone Stand", category: "corridor-maps", type: "Construction Photo" },
  // Aerial corridor construction photography (client-supplied), sorted 1–10.
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
