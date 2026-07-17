/**
 * Content for /design. Each section maps a structure to a supplied image
 * with a short explanatory paragraph and a status label. Renders carry the
 * mandatory disclaimer (enforced in the component); real construction
 * photographs used for footbridges and drainage are labelled honestly as
 * work in progress, never as proposed designs.
 */

import type { MediaKey } from "./media";

export const DESIGN_DISCLAIMER =
  "Proposed design visualisation. Final construction details may be refined during project delivery." as const;

export interface DesignSection {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly media: MediaKey;
  /** Visible status label, e.g. "Proposed Design" or "Under construction". */
  readonly status: string;
  /** When set, the component joins the chainage and completion % by interchange id. */
  readonly interchangeId?: string;
}

export const corridorOverview: DesignSection = {
  id: "corridor-overview",
  title: "Corridor design overview",
  description:
    "The reconstruction rebuilds the Section 1 corridor as two full access-controlled two-lane expressways alongside two partial access-controlled three-lane urban highways, with grade-separated interchanges, footbridges, toll plazas and upgraded drainage.",
  media: "designScheme",
  status: "Proposed Design",
};

/**
 * Interchange sections. The Tetteh Quarshie render is the supplied
 * `teshie-interchange-remodel.png` — used as instructed despite the
 * misleading filename and the Maripoma watermark it carries (flagged in
 * the delivery summary).
 */
export const interchangeSections: readonly DesignSection[] = [
  {
    id: "tetteh-quarshie",
    interchangeId: "tetteh-quarshie",
    title: "Tetteh Quarshie Interchange",
    description:
      "The existing Tetteh Quarshie Interchange is reconstructed to improve capacity and grade separation at the Accra end of Section 1.",
    media: "tettehQuarshieRender",
    status: "Proposed Design",
  },
  {
    id: "teshie-link",
    interchangeId: "teshie-link",
    title: "Teshie Link Interchange",
    description:
      "A new grade-separated interchange providing free-flowing connections between the motorway and the Teshie Link corridor.",
    media: "teshieLinkRemodel",
    status: "Proposed Design",
  },
  {
    id: "community-18",
    interchangeId: "community-18",
    title: "Community 18 Interchange",
    description:
      "A new interchange carrying the mainline over the local cross road, with an underpass and connecting ramps.",
    media: "comm18Render",
    status: "Proposed Design",
  },
  {
    id: "lashibi",
    interchangeId: "lashibi",
    title: "Lashibi Interchange",
    description:
      "A new interchange improving access between the motorway and the Lashibi area toward the Tema end of Section 1.",
    media: "lashibiRender",
    status: "Proposed Design",
  },
] as const;

/** Footbridges, toll plazas and drainage. Footbridge and drainage images are real site photographs. */
export const structureSections: readonly DesignSection[] = [
  {
    id: "footbridges",
    title: "Pedestrian footbridges",
    description:
      "Ten pedestrian crossing points separate people on foot from high-speed traffic at the busiest locations along Section 1.",
    media: "overpassPiers",
    status: "Under construction",
  },
  {
    id: "toll-plazas",
    title: "Toll plazas",
    description:
      "Eight toll plazas along the corridor, with canopy structures and lane arrangements that keep traffic moving through collection.",
    media: "tollPlazaRender",
    status: "Proposed Design",
  },
  {
    id: "drainage",
    title: "Drainage and supporting infrastructure",
    description:
      "Box and bridge culverts carry storm flows clear of the carriageway and protect the pavement from water damage, alongside overpass and supporting works.",
    media: "riverBridgeCulverts",
    status: "Under construction",
  },
] as const;
