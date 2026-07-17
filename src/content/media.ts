/**
 * Registry of real, client-supplied media files on disk under /public.
 * Distinct from ./stock-media.ts (known-wrong stock placeholders) and
 * from the media *slots* in ./project.ts (which decide what renders
 * where): every entry here catalogues an actual file, with honest alt
 * text describing what the file shows — not what its name claims.
 *
 * `verified: false` means "do not present this as a confirmed project
 * asset yet" — it covers two cases the render layer treats the same way
 * (show a pending slot, never a bare <img>): (1) the file is on disk but
 * its identity is unconfirmed (e.g. a filename that contradicts its
 * content), and (2) the file is expected but `onDisk: false` — a seed
 * whose real image the client will drop in later. The moment a seed's
 * file lands and its identity is confirmed, flip `onDisk` and `verified`
 * and it renders for real, no other change needed.
 *
 * Still expected from the client and NOT registered here yet:
 *   public/images/: aerial-earthworks-wide
 *   public/logos/:  logo-candidate-A..F (the directory does not exist
 *                   yet; candidates will enter `verified: false` until
 *                   the client renames/confirms them)
 */

export interface RegisteredMediaAsset {
  readonly src: string;
  readonly alt: string;
  /**
   * Intrinsic pixel dimensions — the single source of truth for aspect
   * ratio, so consumers can reserve a box before the image loads and
   * never shift layout (CLS). For not-yet-delivered seeds this is a
   * nominal placeholder ratio; update it when the real file lands.
   */
  readonly width: number;
  readonly height: number;
  /** Slide of the client deck / MPR this file was extracted from, when known. */
  readonly sourceSlide?: string;
  /**
   * Whether the file actually exists under /public. Seeds referenced by
   * the gallery before their image lands are `false`; the render layer
   * shows a pending slot for these instead of a 404-ing <img>.
   */
  readonly onDisk: boolean;
  /**
   * False until the file's identity is confirmed: logo candidates
   * pending rename, files whose content contradicts their filename, and
   * not-yet-delivered seeds.
   */
  readonly verified: boolean;
}

export const mediaRegistry = {
  // The client's own 8K aerial drone photograph of the corridor — a real
  // record of live traffic and active construction, NOT a design render.
  // Do not present it with the "final construction may vary" disclaimer.
  heroCorridorAerial: {
    src: "/images/hero-corridor-aerial.jpg",
    alt: "Aerial drone photograph of the Accra–Tema Motorway corridor: a multi-lane divided expressway carrying live traffic through built-up neighbourhoods, with construction under way",
    width: 3840,
    height: 2160,
    onDisk: true,
    verified: true,
  },
  /**
   * Filename/content mismatch (flagged 2026-07-16): the file is named
   * route-alignment-map but its content is a toll-plaza design
   * visualisation, not a map. Unverified until the client renames or
   * replaces it — do not render as a route map.
   */
  routeAlignmentMap: {
    src: "/images/route-alignment-map.png",
    alt: "Design visualisation of a toll plaza: trucks and cars queuing at toll booths beneath a long canopy, with palm trees lining the carriageway",
    width: 3840,
    height: 2160,
    onDisk: true,
    verified: false,
  },
  logoAtel: {
    src: "/images/logo-atel.png",
    alt: "Accra–Tema Expressway Limited logo",
    width: 599,
    height: 496,
    onDisk: true,
    verified: true,
  },

  // --- Construction gallery seeds ---------------------------------------
  // Referenced by src/content/gallery.ts. The image files are not on disk
  // yet (onDisk: false), so the gallery renders each as a pending slot,
  // never a broken <img>. Alt text below is a neutral, honest placeholder,
  // and width/height are a nominal 3:2 so the grid reserves a box; the
  // client supplies the real image, its true dimensions, and a specific
  // description later, at which point onDisk/verified flip.
  construction01: {
    src: "/images/construction-01.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction02: {
    src: "/images/construction-02.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction03: {
    src: "/images/construction-03.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction04: {
    src: "/images/construction-04.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction05: {
    src: "/images/construction-05.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction06: {
    src: "/images/construction-06.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction07: {
    src: "/images/construction-07.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
  construction08: {
    src: "/images/construction-08.jpg",
    alt: "Construction progress photograph — pending",
    width: 1500,
    height: 1000,
    onDisk: false,
    verified: false,
  },
} as const satisfies Record<string, RegisteredMediaAsset>;

export type MediaKey = keyof typeof mediaRegistry;

/** Whether a registry asset is safe to render as a real, confirmed image. */
export function isRenderable(asset: RegisteredMediaAsset): boolean {
  return asset.onDisk && asset.verified;
}
