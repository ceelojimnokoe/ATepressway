import type { MediaKey } from "./media";

/**
 * Design images shown when a structure is opened from the Progress page,
 * keyed by interchange id (Interchange.id / progress.workPackages[].id).
 *
 * Only images that verifiably depict THAT structure are listed — the
 * proposed-design renders for each interchange. Generic construction
 * photographs are deliberately excluded: the monthly report does not tie a
 * given site photo to a specific interchange, so presenting one as "this
 * structure" would be an invented association.
 */
export const structureDesignImages: Record<string, readonly MediaKey[]> = {
  "tetteh-quarshie": ["tettehQuarshieProposed", "tettehQuarshieRender"],
  "teshie-link": ["teshieLinkProposed", "teshieLinkRemodel"],
  "community-18": ["comm18Proposed", "comm18Render"],
  lashibi: ["lashibiProposed", "lashibiRender"],
};
