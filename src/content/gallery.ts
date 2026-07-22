/**
 * Central gallery data. Titles describe what each image verifiably shows;
 * where the report does not let an image be tied to a specific chainage or
 * activity, a neutral title is used rather than an invented location.
 * Company, government and stakeholder logos, portraits and duplicates are
 * deliberately excluded.
 */

import type { MediaKey } from "./media";

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
  readonly media: MediaKey;
  readonly title: string;
  readonly category: GalleryCategoryId;
  readonly type: GalleryType;
}

export const galleryItems: readonly GalleryItem[] = [
  // Aerial corridor construction photography (client-supplied), sorted 1–10.
  { id: "atel-1", media: "atelJunctionUnderpass", title: "Junction Underpass Construction", category: "interchanges", type: "Construction Photo" },
  { id: "atel-2", media: "atelBridgeDeckRebar", title: "Bridge Deck Reinforcement", category: "bridges", type: "Construction Photo" },
  { id: "atel-3", media: "atelPierConcreting", title: "Bridge Pier Concreting", category: "bridges", type: "Construction Photo" },
  { id: "atel-4", media: "atelOverpassDeck", title: "Overpass Deck Construction", category: "bridges", type: "Construction Photo" },
  { id: "atel-5", media: "atelCorridorOverpass", title: "Corridor Overpass and Piers", category: "bridges", type: "Construction Photo" },
  { id: "atel-6", media: "atelCorridorPiersWide", title: "Corridor Widening with New Piers", category: "corridor-maps", type: "Construction Photo" },
  { id: "atel-7", media: "atelOverpassCrossheads", title: "Overpass Piers and Crossheads", category: "bridges", type: "Construction Photo" },
  { id: "atel-8", media: "atelCarriagewaySection", title: "Completed Carriageway Section", category: "corridor-maps", type: "Construction Photo" },
  { id: "atel-9", media: "atelRoadsideRamps", title: "Roadside Ramp Structures", category: "corridor-maps", type: "Construction Photo" },
  { id: "atel-10", media: "atelJunctionRoundabout", title: "Major Junction Underpass", category: "interchanges", type: "Construction Photo" },
  // Interchanges
  { id: "underpass", media: "underpassStructure", title: "Interchange Underpass Construction", category: "interchanges", type: "Construction Photo" },
  // Bridges
  { id: "tbeam", media: "bridgeTBeamLaunch", title: "Bridge T-Beam Launching", category: "bridges", type: "Construction Photo" },
  { id: "deck-rebar", media: "bridgeDeckPour", title: "Bridge Deck Reinforcement and Concreting", category: "bridges", type: "Construction Photo" },
  { id: "deck-concreting", media: "bridgeDeckConcreting", title: "Bridge Deck Concreting", category: "bridges", type: "Construction Photo" },
  { id: "deck-finishing", media: "deckFinishing", title: "Deck Slab Concreting", category: "bridges", type: "Construction Photo" },
  { id: "overpass-piers", media: "overpassPiers", title: "Overpass Pier Construction", category: "bridges", type: "Construction Photo" },
  { id: "corridor-piers", media: "corridorPiers", title: "Corridor Bridge Piers", category: "bridges", type: "Construction Photo" },
  { id: "corridor-gantries", media: "corridorGantries", title: "Corridor Overpass Construction", category: "bridges", type: "Construction Photo" },
  // Drainage
  { id: "box-culvert", media: "culvertEarthworks", title: "Box Culvert Construction", category: "drainage", type: "Construction Photo" },
  { id: "stream-culvert", media: "streamCulvert", title: "Culvert Works at a Watercourse", category: "drainage", type: "Construction Photo" },
  { id: "river-culverts", media: "riverBridgeCulverts", title: "River Crossing Culvert Works", category: "drainage", type: "Construction Photo" },
  // Earthworks
  { id: "rock-filling", media: "rockFilling", title: "Earthworks and Rock Filling", category: "earthworks", type: "Construction Photo" },
  { id: "retaining-wall", media: "retainingWall", title: "Retaining Wall Reinforcement", category: "earthworks", type: "Construction Photo" },
  { id: "dust-spraying", media: "dustSpraying", title: "Dust Suppression on the Corridor", category: "earthworks", type: "Construction Photo" },
  // Proposed designs
  { id: "d-teshie", media: "teshieLinkRemodel", title: "Teshie Link Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-comm18", media: "comm18Render", title: "Community 18 Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-lashibi", media: "lashibiRender", title: "Lashibi Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-tetteh", media: "tettehQuarshieProposed", title: "Tetteh Quarshie Interchange — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-toll", media: "tollPlazaRender", title: "Toll Plaza — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  { id: "d-flyover", media: "flowerPotRemodel", title: "Corridor Flyover — Proposed Design", category: "proposed-designs", type: "Proposed Design" },
  // Corridor and maps
  { id: "corridor-aerial", media: "corridorAerial", title: "Section 1 Corridor Under Construction", category: "corridor-maps", type: "Construction Photo" },
  { id: "cross-section", media: "designScheme", title: "Typical Road Cross-Section", category: "corridor-maps", type: "Proposed Design" },
  { id: "route-viz", media: "routeAlignmentMap", title: "Accra–Tema Corridor — Design Visualisation", category: "corridor-maps", type: "Proposed Design" },
] as const;
