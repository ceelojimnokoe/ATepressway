/**
 * Verified data from the Accra–Tema Motorway and Extensions Project
 * Monthly Progress Report, May 2026 — the works-in-progress detail shown
 * on /progress. Figures are quoted as "recorded to date"; the report's
 * cumulative quantities do not always reconcile cleanly against its total
 * quantities, so ONLY cumulative quantities are shown here and no
 * completion percentages are computed against the totals. Nothing is
 * described as complete unless the report says so.
 */

export const REPORT_LABEL = "Monthly Progress Report, May 2026" as const;

export interface Quantity {
  readonly label: string;
  readonly value: number;
  readonly unit: string;
}

// --- Earthworks: cumulative quantities recorded to date --------------------
export const earthworks = {
  summary:
    "Earthworks include site clearance, excavation, replacement of unsuitable materials, rock filling, engineered fill and road formation along the Section 1 corridor.",
  quantities: [
    { label: "Site clearance", value: 76, unit: "hectares" },
    { label: "Topsoil cutting and disposal", value: 23_150, unit: "m³" },
    { label: "Cut-to-fill / borrow material", value: 650_241, unit: "m³" },
    { label: "Unsuitable-material replacement", value: 174_789, unit: "m³" },
    { label: "Rock filling", value: 238_375, unit: "m³" },
  ] as readonly Quantity[],
} as const;

// --- Concrete and structural works: recorded to date -----------------------
export const concreteWorks = {
  summary: "Concrete and reinforcement quantities recorded to date in the May 2026 report.",
  quantities: [
    { label: "Plain concrete", value: 1_902, unit: "m³" },
    { label: "Reinforced concrete", value: 17_772, unit: "m³" },
    { label: "Reinforcement steel", value: 4_186, unit: "tonnes" },
  ] as readonly Quantity[],
} as const;

// --- Drainage and culverts -------------------------------------------------
export const drainage = {
  summary:
    "Box and bridge culverts carry storm flows clear of the carriageway. Status categories are shown as reported; they are not reconciled into a single total to avoid implying a precision the report does not state.",
  boxCulverts: {
    programme: 20,
    commenced: 18,
    completed: 11,
    ongoing: 6,
    outstanding: 2,
  },
  bridgeCulverts: {
    note: "Three bridge / big culverts had commenced; all three were ongoing as of the report.",
    commenced: 3,
    ongoing: 3,
  },
} as const;

// --- Footbridges (pedestrian crossing points) ------------------------------
export interface FootbridgeStatus {
  readonly chainage: string;
  /** Percentage, or null where the report gives no percentage. */
  readonly percent: number | null;
}

export const footbridges = {
  summary:
    "Ten pedestrian footbridges / crossing points form part of the Section 1 scope. Construction has started at several locations, with the most advanced at CH 12+350, reported at 72%.",
  mostAdvanced: { chainage: "CH 12+350", percent: 72 },
  statuses: [
    { chainage: "CH 0+080", percent: 20 },
    { chainage: "CH 0+853.6", percent: null },
    { chainage: "CH 4+490", percent: null },
    { chainage: "CH 6+300", percent: 57 },
    { chainage: "CH 8+050", percent: 25 },
    { chainage: "CH 8+885", percent: 44.5 },
    { chainage: "CH 9+920", percent: 55 },
    { chainage: "CH 12+350", percent: 72 },
    { chainage: "CH 16+200", percent: 34 },
    { chainage: "CH 18+295", percent: 7 },
  ] as readonly FootbridgeStatus[],
} as const;

// --- Recent construction activity (location-based; no dates in the report) --
export interface ActivityItem {
  readonly location: string;
  readonly chainage: string;
  readonly activity: string;
}

export const recentActivity: readonly ActivityItem[] = [
  { location: "Tetteh Quarshie Interchange", chainage: "Km 0+550", activity: "T-beam and joint concreting works" },
  { location: "Teshie Link Interchange", chainage: "Km 6+363", activity: "Traffic-diversion wall construction" },
  { location: "Community 18 Interchange", chainage: "Km 12+350", activity: "Underpass construction" },
  { location: "Lashibi Interchange", chainage: "Km 16+105", activity: "Right-side top-slab works" },
  { location: "Bridge", chainage: "Km 10+873.6", activity: "Foundation walls and concrete casting" },
  { location: "Bridge", chainage: "Km 13+745", activity: "Bridge piling" },
  { location: "Bridge", chainage: "Km 16+552", activity: "Bridge piling" },
  { location: "Box culvert", chainage: "Km 4+703", activity: "Backfilling" },
  { location: "Box culvert", chainage: "Km 18+973.8", activity: "Top slab and wall reinforcement" },
  { location: "Footbridge", chainage: "CH 8+050", activity: "Blinding works" },
] as const;

// --- Construction considerations (restrained public-information cards) ------
export interface Consideration {
  readonly title: string;
  readonly body: string;
}

export const considerations: readonly Consideration[] = [
  {
    title: "Traffic management",
    body: "Construction activities can create temporary congestion. The project uses traffic-management plans, alternative routing, signage and public awareness measures.",
  },
  {
    title: "Dust and environmental management",
    body: "The report identifies dust and emissions as an environmental consideration. Mitigation measures include water spraying, equipment management and environmental monitoring.",
  },
  {
    title: "Utilities and right-of-way coordination",
    body: "Relocation of electricity and water infrastructure remains part of the construction coordination process.",
  },
] as const;
