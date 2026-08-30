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
  // Only drawings whose subject is labelled INSIDE the image are listed. The
  // three unlabelled 3D renders that used to appear here made interchange
  // claims that could not be verified (teshie-link-remodel.png is a full
  // cloverleaf, which is geometrically incompatible with Teshie Link’s own
  // labelled CAD drawing). Flagged to ATEL for correctly-identified renders.
  "tetteh-quarshie": ["tettehQuarshieProposed"],
  "teshie-link": ["teshieLinkProposed"],
  "community-18": ["comm18Proposed"],
  lashibi: ["lashibiProposed", "lashibiRender"],
};
