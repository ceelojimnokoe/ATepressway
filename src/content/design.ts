/**
 * Content for /design — "Design & Infrastructure". The build spec, the
 * interchange render captions, the compact sections, and the one
 * mandatory disclaimer every design render must carry.
 *
 * THE DISCLAIMER IS LOAD-BEARING. Design renders are proposals, not
 * as-built records; presenting one without saying so would breach the
 * site's "clinical and accountable, nothing oversold" bar (see
 * CLAUDE.md). Enforcement lives in the DesignRenderSlot component, which
 * appends DESIGN_DISCLAIMER to every caption with no prop to suppress
 * it — so a render cannot reach the page without the line. This constant
 * is the single source of that wording; do not inline it in components.
 */

import { projectFacts } from "./project";
import type { MediaKey } from "./media";

/** Exact wording. Appended automatically beneath every design render. */
export const DESIGN_DISCLAIMER = "Proposed design visualisation — final construction may vary." as const;

/**
 * One image slot. `media` points into the registry once a render exists;
 * while it's undefined the slot renders as a deliberate, labelled diagram
 * frame (still carrying the disclaimer). `caption` is the descriptive
 * half only — the disclaimer is added by the component, not stored here.
 */
export interface DesignRender {
  readonly id: string;
  readonly caption: string;
  readonly media?: MediaKey;
}

// ---------------------------------------------------------------------------
// Lead — what is being built (the 10-lane cross-section)
// ---------------------------------------------------------------------------

export interface Carriageway {
  /** How many carriageways of this kind (e.g. 2). */
  readonly count: number;
  /** Lanes per carriageway (e.g. 2). */
  readonly lanes: number;
  /** Access-control regime, e.g. "full access-controlled". */
  readonly access: string;
  /** Road type, e.g. "expressway". */
  readonly type: string;
}

/**
 * The 10-lane cross-section, per the client's design spec:
 * 2 × full access-controlled 2-lane expressway carriageways alongside
 * 2 × partial access-controlled 3-lane urban highway carriageways.
 * Total lanes are summed from `carriageways` (2×2 + 2×3 = 10), not
 * stored, so the figure can't drift from the breakdown.
 *
 * PAVEMENT WORDING — FLAG (2026-07-16): this spec calls the expressway
 * surface "jointed plain concrete pavement" (JPCP — unreinforced,
 * with joints). project.ts `laneConfiguration.freeway.surface` and
 * CLAUDE.md still say "reinforced concrete freeway". JPCP and reinforced
 * concrete are different pavement types — not interchangeable. Left
 * unreconciled pending the client: this page uses the design-spec
 * wording; project.ts and CLAUDE.md are untouched. Reconcile before this
 * ships as approved.
 */
export const buildSpec = {
  heading: "What is being built",
  carriageways: [
    { count: 2, lanes: 2, access: "full access-controlled", type: "expressway" },
    { count: 2, lanes: 3, access: "partial access-controlled", type: "urban highway" },
  ] as readonly Carriageway[],
  pavementNote: "Jointed plain concrete pavement on the expressway.",
  render: {
    id: "cross-section-typical",
    caption: "Typical cross-section — the 10-lane configuration",
  } as DesignRender,
} as const;

// ---------------------------------------------------------------------------
// Interchanges — render captions keyed by interchange id. The component
// joins these with project.ts `interchanges` (name, kind, order) and
// progress.workPackages (completion %) on the shared id. Add a `media`
// key here when a render lands; the completion % is never stored here —
// it lives once, in the MPR progress data.
// ---------------------------------------------------------------------------

export const interchangeRenders: Record<string, DesignRender> = {
  "tetteh-quarshie": {
    id: "tetteh-quarshie-render",
    caption: "Tetteh Quarshie Interchange — reconstruction",
  },
  "teshie-link": {
    id: "teshie-link-render",
    caption: "Teshie Link Interchange — new interchange",
  },
  "community-18": {
    id: "community-18-render",
    caption: "Community 18 Interchange — new interchange",
  },
  lashibi: {
    id: "lashibi-render",
    caption: "Lashibi Interchange — new interchange",
  },
};

// ---------------------------------------------------------------------------
// Compact sections — footbridges, toll plazas, drainage. Counts are read
// from projectFacts so they can't drift from the rest of the site.
// ---------------------------------------------------------------------------

export interface DesignStat {
  readonly value: number;
  readonly label: string;
}

export interface CompactDesignSection {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly stat?: DesignStat;
  readonly render: DesignRender;
}

export const compactDesignSections: readonly CompactDesignSection[] = [
  {
    id: "footbridges",
    title: "Footbridges",
    description:
      "Pedestrian crossing points separating people on foot from high-speed traffic at the busiest crossing locations.",
    stat: { value: projectFacts.pedestrianFootbridges, label: "crossing points" },
    render: {
      id: "footbridge-typical",
      caption: "Pedestrian footbridge — typical span and approach ramps",
    },
  },
  {
    id: "toll-plazas",
    title: "Toll plazas",
    description:
      "Lane layouts, canopy structures, and the approach and departure tapers that keep traffic moving through the collection points.",
    stat: { value: projectFacts.tollPlazaCount, label: "toll plazas" },
    render: {
      id: "toll-plaza-typical",
      caption: "Toll plaza — typical lane and canopy arrangement",
    },
  },
  {
    id: "drainage",
    title: "Drainage & culverts",
    description:
      "Box and bridge culverts sized to carry storm flows clear of the carriageway and protect the pavement from the water damage that failed the original road.",
    render: {
      id: "culvert-typical",
      caption: "Culvert — typical section",
    },
  },
] as const;
