/**
 * Registry of the real project media on disk under /public/images. Every
 * entry carries the intrinsic width/height (the source of truth for
 * aspect ratio, so next/image reserves space and never shifts layout) and
 * honest alt text describing what the file shows. `kind` distinguishes a
 * real construction photograph from a proposed design render / drawing —
 * renders must never be presented as as-built photographs.
 */

export type MediaKind = "photo" | "render" | "drawing" | "logo" | "map";

export interface RegisteredMediaAsset {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly kind: MediaKind;
  /** Whether the file exists under /public (always true here). */
  readonly onDisk: boolean;
  /** Confirmed as the correct, presentable asset. */
  readonly verified: boolean;
}

export const mediaRegistry = {
  // --- Hero slider ---------------------------------------------------------
  teshieLinkRemodel: {
    src: "/images/teshie-link-remodel.png",
    alt: "Aerial design visualisation of the Teshie Link Interchange, a landscaped cloverleaf junction linking the motorway with local roads",
    width: 3997,
    height: 2422,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  flowerPotRemodel: {
    src: "/images/flower-pot-remodel.png",
    alt: "Design visualisation of a landscaped grade-separated flyover along the Accra–Tema corridor",
    width: 4184,
    height: 2383,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  ogHeroBg: {
    src: "/images/og-hero-bg.jpg",
    alt: "Aerial view of the reconstructed Accra–Tema Motorway corridor with interchange and service roads",
    width: 1200,
    height: 630,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  routeAlignmentMap: {
    src: "/images/route-alignment-map.png",
    alt: "Design visualisation of the Accra–Tema corridor showing carriageways and a toll plaza",
    width: 3840,
    height: 2160,
    kind: "render",
    onDisk: true,
    verified: true,
  },

  // --- Design page: proposed interchange renders ---------------------------
  heroCorridorAerial: {
    src: "/images/hero-corridor-aerial.jpg",
    alt: "Aerial design visualisation of the reconstructed Accra–Tema corridor: a multi-lane divided expressway with interchanges and service roads",
    width: 3840,
    height: 2160,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  tettehQuarshieRender: {
    src: "/images/teshie-interchange-remodel.png",
    alt: "Design visualisation of the reconstructed Tetteh Quarshie Interchange with dual carriageways and roundabouts",
    width: 3558,
    height: 1938,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  comm18Render: {
    src: "/images/comm-18-remodel.png",
    alt: "Design visualisation of the Community 18 Interchange showing the mainline flyover over a signalised cross road",
    width: 3299,
    height: 2474,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  lashibiRender: {
    src: "/images/lashibi-remodel.png",
    alt: "Aerial design visualisation of the Lashibi Interchange corridor passing through a built-up area",
    width: 2599,
    height: 2380,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  tettehQuarshieProposed: {
    src: "/images/tetteh-quarshie-proposed.png",
    alt: "Proposed design of the Tetteh Quarshie Interchange",
    width: 768,
    height: 488,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  tollPlazaRender: {
    src: "/images/toll-plaza1.png",
    alt: "Design visualisation of a corridor toll plaza with a canopy over the tolling lanes, showing the Accra and Tema directions",
    width: 3743,
    height: 2150,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  tollPlazaRender2: {
    src: "/images/toll-plaza2.png",
    alt: "Design visualisation of a toll plaza and canopy along the reconstructed corridor",
    width: 3729,
    height: 2337,
    kind: "render",
    onDisk: true,
    verified: true,
  },
  designScheme: {
    src: "/images/design-scheme.png",
    alt: "Typical road cross-section drawing showing the divided carriageways, central reservation and pavement layers",
    width: 3962,
    height: 2075,
    kind: "drawing",
    onDisk: true,
    verified: true,
  },

  // --- Construction photographs (real) -------------------------------------
  bridgeTBeamLaunch: {
    src: "/images/progress-image1.png",
    alt: "A launching gantry positioning precast T-beams over a bridge span, with reinforcement projecting from the beams",
    width: 1213,
    height: 606,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  bridgeDeckPour: {
    src: "/images/progress-image2.png",
    alt: "Workers placing deck reinforcement on a bridge deck as a concrete pump delivers concrete",
    width: 1213,
    height: 606,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  bridgeDeckConcreting: {
    src: "/images/progress-image3.png",
    alt: "Bridge deck concreting beneath a red launching gantry, with a concrete pump and work crew on the deck",
    width: 2422,
    height: 2492,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  deckFinishing: {
    src: "/images/progress-image4.png",
    alt: "Work crew finishing a freshly poured concrete deck slab as a concrete pump boom reaches across it",
    width: 2362,
    height: 2513,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  underpassStructure: {
    src: "/images/progress-image5.png",
    alt: "Aerial view of a large reinforced-concrete underpass structure under construction beside a live road",
    width: 4400,
    height: 2475,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  rockFilling: {
    src: "/images/progress-image6.png",
    alt: "Aerial view of stockpiled rock fill and earthworks beside the corridor, with an underpass structure and traffic",
    width: 3886,
    height: 1853,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  corridorAerial: {
    src: "/images/progress-image7.png",
    alt: "Aerial view of the Section 1 corridor under construction, with traffic on partially completed carriageways",
    width: 3912,
    height: 1899,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  culvertEarthworks: {
    src: "/images/progress-image8.png",
    alt: "Aerial view of box-culvert construction and earth stockpiles alongside an existing road carrying traffic",
    width: 4362,
    height: 2054,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  streamCulvert: {
    src: "/images/progress-image9.png",
    alt: "Aerial view of culvert works beneath a road crossing a watercourse, with queuing traffic",
    width: 1213,
    height: 606,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  riverBridgeCulverts: {
    src: "/images/progress-image10.png",
    alt: "Aerial view of a river crossing with box and bridge culverts under construction on both sides of the road",
    width: 4400,
    height: 2475,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  retainingWall: {
    src: "/images/progress-image12.png",
    alt: "Night-time view of a long reinforcement cage for a retaining wall along an excavated section of the corridor",
    width: 4273,
    height: 2294,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  overpassPiers: {
    src: "/images/progress-image14.png",
    alt: "Aerial view of overpass pier and deck construction beside a live road, with a mobile crane and reinforcement cages",
    width: 4400,
    height: 2475,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  corridorPiers: {
    src: "/images/progress-image15.png",
    alt: "Aerial view of the corridor with new bridge piers and columns rising alongside traffic lanes",
    width: 4928,
    height: 2074,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  corridorGantries: {
    src: "/images/progress-image16.png",
    alt: "Aerial view of the corridor with two overpass deck structures under construction over the roadway",
    width: 4365,
    height: 2060,
    kind: "photo",
    onDisk: true,
    verified: true,
  },
  dustSpraying: {
    src: "/images/progress-image20.png",
    alt: "A water tanker spraying the road surface for dust suppression along the construction corridor",
    width: 960,
    height: 1280,
    kind: "photo",
    onDisk: true,
    verified: true,
  },

  // --- Stakeholder logos ---------------------------------------------------
  logoAtel: {
    src: "/images/logo-atel.png",
    alt: "Accra–Tema Expressway Limited logo",
    width: 599,
    height: 496,
    kind: "logo",
    onDisk: true,
    verified: true,
  },
  logoGha: {
    src: "/images/ghana-highway-authority.png",
    alt: "Ghana Highway Authority logo",
    width: 837,
    height: 250,
    kind: "logo",
    onDisk: true,
    verified: true,
  },
  logoAssociatedConsultants: {
    src: "/images/associated-consultants.png",
    alt: "Associated Consultants Limited logo",
    width: 839,
    height: 288,
    kind: "logo",
    onDisk: true,
    verified: true,
  },
  logoMaripoma: {
    src: "/images/mariproma.png",
    alt: "Maripoma Enterprise Limited logo",
    width: 450,
    height: 103,
    kind: "logo",
    onDisk: true,
    verified: true,
  },
} as const satisfies Record<string, RegisteredMediaAsset>;

export type MediaKey = keyof typeof mediaRegistry;

/** Whether a registry asset is safe to render as a real, confirmed image. */
export function isRenderable(asset: RegisteredMediaAsset): boolean {
  return asset.onDisk && asset.verified;
}
