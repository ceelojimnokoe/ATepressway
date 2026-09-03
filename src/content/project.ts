/**
 * Single source of truth for site copy and data. Components must import
 * from here — no hardcoded strings or numbers. See CLAUDE.md.
 *
 * Fact hierarchy: the client's written Monthly Progress Report (MPR) is
 * the source of truth. It supersedes verbal confirmations, the
 * information form, and press reports. Current reference: Monthly
 * Progress Report, May 2026.
 *
 * Facts the client has not yet supplied are wrapped in `placeholder()`
 * (see ./placeholder.ts) rather than invented or left blank, so a naive
 * `{value}` render can't silently ship a made-up fact. Consuming
 * components must call `isPlaceholder()` and render an explicit
 * "to be confirmed" state.
 */

import { placeholder, type Placeholder } from "./placeholder";
import type { MediaKey } from "./media";

export { isPlaceholder, type Placeholder } from "./placeholder";

/** Source tag carried by every per-structure figure taken from the May 2026 MPR. */
const MPR_MAY_2026 = "MPR May 2026";

/**
 * Per-structure progress source as of the 28 Aug 2026 client meeting: Maripoma’s
 * own work-plan sheet (public/images/progress-update-7.jpeg), which reports each
 * structure as a completed fraction of its total quantity. Two figures carried
 * over unchanged from the May MPR (Teshie Link 0.747 ≈ 74.5%, Community 18 0.675
 * = 67.5%), confirming both documents measure on the same basis.
 */
const WORK_PLAN_AUG_2026 = "Maripoma work plan, 28 August 2026";

// ---------------------------------------------------------------------------
// Organization & stakeholders
// ---------------------------------------------------------------------------

export interface Stakeholder {
  readonly name: string;
  /** Contractual role — used verbatim as the label (e.g. "Employer"). */
  readonly role: string;
  /** One-line plain-English gloss of what this party actually does. */
  readonly gloss: string;
  /**
   * Registry key for this party's logo. The slot renders an image only
   * where the asset is verified; otherwise the party shows name-only, so
   * an unconfirmed or missing logo never renders as a broken image.
   */
  readonly logo?: MediaKey;
  /** Official website, linked from the party's name/logo. Opens in a new tab. */
  readonly website?: string;
}

/**
 * Contractual structure. ATEL's contractual role is CONCESSIONAIRE (client,
 * 28 Aug 2026) — it commissions, finances and oversees the works and will
 * operate and maintain them; it does not build the road. Never describe ATEL
 * as the contractor — see CLAUDE.md.
 *
 * Chain, top to bottom: Concessionaire → Funding Agency → Employer's
 * Representative → Employer's Representative's Agent → EPC Contractor for
 * Section 1. The relocation specialists sit outside that chain and render
 * visually subordinate to it.
 */
const employer = {
  name: "A.T. Expressway Ltd.",
  // Concessionaire, not Employer (client, 28 Aug 2026). This also resolves a
  // long-standing internal inconsistency: the footer already described ATEL as
  // "the concessionaire responsible for...". Per the client's own FAQ pack,
  // MRH acting through GHA awarded ATEL a 30-year concession.
  role: "Concessionaire",
  // Verbatim replacement (client instruction, 3 Sept 2026) — distinct from
  // the Home hero paragraph, which got its own separate wording change.
  gloss: "Your guide to the design, financing, construction, operation, and maintenance, of the Accra-Tema Motorway and Extensions Project under a 30-year concession",
  logo: "logoAtel",
} as const satisfies Stakeholder;

const fundingAgency = {
  name: "Ghana Infrastructure Investment Fund",
  role: "Funding Agency",
  gloss: "The Ghana Infrastructure Investment Fund established ATEL to deliver the project and is currently its sole shareholder.",
  logo: "logoGiif",
  website: "https://giif.gov.gh",
} as const satisfies Stakeholder;

const employersRepresentative = {
  name: "Ghana Highway Authority",
  role: "Employer's Representative",
  gloss: "The Ghana Highway Authority is the Contracting Authority for the concession and the Employer's Representative, providing technical oversight and coordination for the project.",
  logo: "logoGha",
  website: "https://www.highways.gov.gh/",
} as const satisfies Stakeholder;

const employersRepAgent = {
  name: "Associated Consultants Limited",
  role: "Employer's Representative's Agent",
  gloss: "Associated Consultants Limited provides engineering consultancy, design review and construction-supervision services for the project.",
  logo: "logoAssociatedConsultants",
  website: "https://associatedconsultantsltd.com/",
} as const satisfies Stakeholder;

const epcContractor = {
  name: "Maripoma Enterprise Limited",
  // "for Section 1" is load-bearing: Maripoma designed all three sections but
  // constructs Section 1 only (client FAQ pack; Phase 2 EPC is still being procured).
  role: "EPC Contractor for Section 1",
  gloss: "Maripoma Enterprise Limited is the EPC contractor responsible for engineering, procurement and construction, delivering the Section 1 works under Phase 1 — which also covers the design of all three sections.",
  logo: "logoMaripoma",
} as const satisfies Stakeholder;

const electricalRelocation = {
  name: "Limmark Energy Solutions Ltd",
  role: "Specialist Contractor — Electrical Relocation",
  gloss: "Relocates electrical services clear of the works.",
} as const satisfies Stakeholder;

const waterRelocation = {
  name: "Dakal Construction Works Ltd",
  role: "Specialist Contractor — Water Relocation",
  gloss: "Relocates water mains clear of the works.",
} as const satisfies Stakeholder;

export const stakeholders = {
  employer,
  fundingAgency,
  employersRepresentative,
  employersRepAgent,
  epcContractor,
  electricalRelocation,
  waterRelocation,
} as const satisfies Record<string, Stakeholder>;

/** Contractual chain per the MPR organogram, top to bottom — render in this order. */
export const stakeholderChain: readonly Stakeholder[] = [
  employer,
  fundingAgency,
  employersRepresentative,
  employersRepAgent,
  epcContractor,
];

/** Outside the contractual chain — always render visually subordinate to it. */
export const specialistContractors: readonly Stakeholder[] = [
  electricalRelocation,
  waterRelocation,
];

/**
 * Government of Ghana entry — added 3 Sept 2026 (client instruction),
 * replacing the old ATEL + Maripoma "08 — Delivery" preview on Home with
 * this single entry, and shown as the first delivery-chain card on
 * /stakeholders (above the Concessionaire). One source of truth rendered
 * by GovernmentOfGhanaBlock (src/components/stakeholders/) on both pages.
 *
 * ⚠ `paragraph` is verbatim client copy, applied without correction even
 * though it reads grammatically unusual ("Government of Ghana constructing
 * the Ghana Highway Authority through the Ministry of Roads & Highways") —
 * flagged back to the client rather than silently reworded. See report.
 *
 * ⚠ `logos` currently lists only the Ghana Highway Authority mark
 * (`logoGha`, already used elsewhere on /stakeholders). The Government of
 * Ghana's own coat of arms and a Ministry of Roads & Highways logo were
 * both requested but neither asset exists yet at any path checked
 * (`public/images/coatofarms*`, `public/image/coatofarms*`, or
 * `public/images/ministryofroadshighways/`) — see report before assuming
 * this is a complete set.
 */
export const governmentOfGhana = {
  title: "Government of Ghana",
  subtitle: "Contracting Authority",
  paragraph:
    "Government of Ghana constructing the Ghana Highway Authority through the Ministry of Roads & Highways.",
  logos: ["logoGha"] as readonly MediaKey[],
};

/**
 * Website / brand identity. As of the 28 Aug 2026 client meeting the site uses
 * ONE name form everywhere — "A.T. Expressway Ltd." — matching the client's own
 * source documents (the Website Text Corrections doc and the FAQ pack both use
 * "A.T. Expressway Ltd (ATEL)"). This supersedes the earlier split between a
 * public brand and a separate legal-entity name.
 */
export const organization = {
  name: "A.T. Expressway Ltd.",
  shortName: "ATEL",
  description:
    "Official project information, design highlights and construction progress for the Accra–Tema Motorway and Extensions Project.",
  // Footer "about" line — a plain-language statement of ATEL's role and
  // ownership (client-confirmed copy, August 2026). Kept separate from
  // `description` (which is the SEO/meta blurb) so the two can differ.
  footerBlurb:
    "The concessionaire responsible for the financing, development, operation, and maintenance of the Accra–Tema Motorway and Extensions Project, and currently wholly owned by the Ghana Infrastructure Investment Fund.",
} as const;

/**
 * The single serif statement of intent, used exactly once sitewide.
 *
 * The copy below is PROPOSED, pending ATEL's written approval — it is not
 * yet an approved fact and must not render as one. Approval is a single
 * switch: flip STATEMENT_OF_INTENT_APPROVED to `true` once ATEL signs
 * off, and `statementOfIntent` resolves from the TBC placeholder to the
 * real line everywhere it renders. No other edit required. Until then it
 * renders as an honest "to be confirmed" slot.
 */
const STATEMENT_OF_INTENT_APPROVED = false;

const PROPOSED_STATEMENT_OF_INTENT =
  "Built in 1964 for a twenty-year life, Ghana's busiest corridor is being rebuilt for the next fifty.";

export const statementOfIntent: string | Placeholder<string> = STATEMENT_OF_INTENT_APPROVED
  ? PROPOSED_STATEMENT_OF_INTENT
  : placeholder<string>(
      "Statement of intent (one sentence, set in --font-serif, used once sitewide)",
      "",
    );

// ---------------------------------------------------------------------------
// Verified project facts — per the Monthly Progress Report, May 2026.
// The MPR supersedes verbal confirmations, the information form, and
// press reports. Do not alter without a newer MPR.
// ---------------------------------------------------------------------------

// Contract price per the May 2026 MPR. The pre-MPR "≈US$340M investment"
// figure is superseded — do not reintroduce it.
const CONTRACT_PRICE_USD = 338_897_543.56;
const CONTRACT_PRICE_DISPLAY = "US$338.9M contract price";

export const projectFacts = {
  /** Contract price before tax (MPR May 2026). */
  contractPriceUSD: CONTRACT_PRICE_USD,
  /** Tax on the contract price (MPR May 2026). */
  taxUSD: 54_223_606.97,
  /** Total contract price including tax (MPR May 2026). */
  contractPriceWithTaxUSD: 393_121_150.53,
  contractPriceDisplay: CONTRACT_PRICE_DISPLAY,
  /** Contract price before tax, in millions, for the animated figure. */
  contractPriceMillions: 338.9,
  /** Approved variation to the contract price as of the May 2026 report. */
  variationAsOfMay2026: "Nil",
  /** Full design corridor length. */
  corridorLengthKm: 27.7,
  /** Section 1 (Tema Roundabout → Tetteh Quarshie) — the length under construction. */
  section1LengthKm: 19.5,
  openedYear: 1964,
  openedUnder: "Kwame Nkrumah",
  /**
   * CONFIRMED by the client (2026-08-29): the contract award date is
   * 12 March 2024. This supersedes the May 2026 MPR, which stated 21 March
   * 2024 — the client has confirmed the MPR date was incorrect. Do not revert
   * to the MPR value.
   */
  contractAwardDate: "2024-03-12",
  /** ISO 8601, per the May 2026 MPR. The 36-month window runs from this date. */
  commencementDate: "2024-08-02",
  /** ISO 8601, per the May 2026 MPR — commencement + 36 months. */
  scheduledCompletionDate: "2027-08-02",
  /** Contract duration in days (MPR May 2026). */
  contractDurationDays: 1095,
  reconstructionStartYear: 2024,
  constructionWindowMonths: 36,
  /** Contractor equipment recorded on site (MPR May 2026). */
  equipmentOnSite: 284,
  /**
   * MPR scope: "Construction of 10 No. Pedestrian Crossing Points"; the
   * MPR quantities table confirms 10.
   */
  pedestrianFootbridges: 10,
  tollPlazaCount: 8,
} as const;

/**
 * When the site's content was last refreshed. ONE value, rendered wherever the
 * "site last updated" indicator appears — update this line and every instance
 * changes. ISO 8601 so it can be formatted per locale at the render site.
 */
export const siteLastUpdated = "2026-08-29";

/**
 * "By the numbers", per section plus a combined total.
 *
 * Only verified facts appear here. Section 1 (Phase 1) is the section under
 * construction, so it carries the contract, programme and quantity figures from
 * the MPR. Sections 2 and 3 are Phase 2 — designed but not yet under
 * construction — so they carry only what the client has actually published:
 * length, lane count on completion, road designation and phase. Nothing is
 * back-derived or estimated to fill the grid.
 *
 * Lane counts and the interchange split are from the client's own FAQ pack
 * ("a 10-lane Section 1, 12-lane Section 2, and a 6-lane Section 3 ... five (5)
 * new interchanges and two (2) remodelled interchanges").
 */
export interface SectionStat {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly unit?: string;
  readonly decimals?: number;
  readonly separator?: boolean;
  readonly label: string;
}

export interface SectionStatGroup {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly stats: readonly SectionStat[];
}

export const sectionStatGroups: readonly SectionStatGroup[] = [
  {
    id: "s1",
    label: "Section 1",
    summary:
      "The 19.5 km Accra–Tema Motorway — Phase 1, currently under construction and the focus of monthly progress reporting.",
    stats: [
      { value: 19.5, decimals: 1, unit: "km", label: "Length" },
      { value: 10, label: "Lanes on completion" },
      { value: 338.9, prefix: "US$", suffix: "M", decimals: 1, label: "Contract price before tax" },
      { value: 1095, separator: true, unit: "days", label: "Contract duration" },
      { value: 4, label: "Interchanges" },
      { value: 10, label: "Pedestrian crossings" },
      // Client (Aug 2026): the toll-plaza count is withdrawn pending official
      // communication. Days elapsed replaces it, giving the 1,095-day contract
      // duration the "755 days covered so far" context the client asked for.
      // "Project" (not "Programme") — client instruction, 4 Sept 2026.
      { value: 755, separator: true, unit: "days", label: "Project days elapsed" },
      { value: 284, label: "Equipment recorded on site" },
    ],
  },
  {
    id: "s2",
    label: "Section 2",
    summary:
      "The 5.7 km George Bush Highway — Phase 2. Designed under the current EPC contract; construction is not yet under way.",
    stats: [
      { value: 5.7, decimals: 1, unit: "km", label: "Length" },
      { value: 12, label: "Lanes on completion" },
      { value: 2, label: "Phase" },
    ],
  },
  {
    id: "s3",
    label: "Section 3",
    summary:
      "The 2.5 km Nsawam Road link — Phase 2. Designed under the current EPC contract; construction is not yet under way.",
    stats: [
      { value: 2.5, decimals: 1, unit: "km", label: "Length" },
      { value: 6, label: "Lanes on completion" },
      { value: 2, label: "Phase" },
    ],
  },
  {
    id: "total",
    label: "Total",
    summary:
      "The full 27.7 km design scope across all three sections, delivered under a 30-year concession.",
    stats: [
      { value: 27.7, decimals: 1, unit: "km", label: "Total corridor" },
      { value: 3, label: "Sections" },
      { value: 5, label: "New interchanges" },
      { value: 2, label: "Remodelled interchanges" },
      { value: 30, unit: "years", label: "Concession term" },
      { value: 2, label: "Delivery phases" },
    ],
  },
];

export interface LaneGroup {
  readonly lanes: number;
  readonly surface: string;
}

/**
 * Surface descriptions ("reinforced concrete freeway", "urban highway")
 * live here, not as hardcoded strings in the-works.tsx — the client's
 * exact wording for each surface type is itself a fact, same as the
 * lane counts.
 */
export const laneConfiguration: { readonly freeway: LaneGroup; readonly urban: LaneGroup } = {
  freeway: { lanes: 4, surface: "reinforced concrete freeway" },
  urban: { lanes: 6, surface: "urban highway" },
};

/**
 * Client's own condition-assessment language for why reconstruction is
 * needed — kept verbatim rather than paraphrased into marketing copy.
 * distressTypes[2] intentionally reads "pumping under wheel load" as one
 * item, not three items each qualified by "under wheel load" — that's
 * how the client phrased it.
 */
export const reconstructionRationale = {
  designLifeYears: 20,
  distressTypes: ["fatigue cracking", "joint failures", "pumping under wheel load"],
} as const;

export interface ProjectSection {
  readonly id: "s1" | "s2" | "s3";
  readonly label: string;
  readonly name: string;
  readonly road: string;
  readonly lengthKm: number;
  readonly from: string;
  readonly to: string;
}

export const sections: readonly ProjectSection[] = [
  {
    id: "s1",
    label: "S1",
    name: "Accra–Tema Motorway",
    road: "N1",
    lengthKm: 19.5,
    from: "Tetteh Quarshie",
    to: "Tema",
  },
  {
    id: "s2",
    label: "S2",
    name: "George Bush Highway",
    // Corrected 3 Sept 2026 (client instruction): N4, not N1. This is the
    // single source of truth for Section 2's route — every render (Project
    // page, Design page, Home stats, the corridor visualisation) reads
    // `sections`/`sectionStatGroups` from here, so the fix propagates
    // without a separate edit. Confirmed via grep: no other file hardcodes
    // "N1" for Section 2/George Bush Highway.
    road: "N4",
    lengthKm: 5.7,
    from: "Tetteh Quarshie",
    to: "Apenkwa",
  },
  {
    id: "s3",
    label: "S3",
    name: "Nsawam Road",
    road: "N6",
    lengthKm: 2.5,
    from: "Apenkwa",
    to: "Neoplan",
  },
] as const;

// ---------------------------------------------------------------------------
// Works scope — per the May 2026 MPR scope statement.
// ---------------------------------------------------------------------------

export interface ScopeItem {
  readonly id: string;
  readonly description: string;
  readonly source: string;
}

export const scopeOfWorks: readonly ScopeItem[] = [
  {
    id: "tetteh-quarshie-reconstruction",
    description: "Reconstruction of the Tetteh Quarshie Interchange",
    source: MPR_MAY_2026,
  },
  {
    id: "new-interchanges",
    description: "Construction of new interchanges at Teshie Link, Community 18, and Lashibi",
    source: MPR_MAY_2026,
  },
  {
    id: "pedestrian-crossing-points",
    description: "Construction of 10 pedestrian crossing points",
    source: MPR_MAY_2026,
  },
  {
    id: "lagos-avenue-enhancement",
    description: "Enhancement of roadway traffic in the Lagos Avenue / Lagos Link area",
    source: MPR_MAY_2026,
  },
  {
    id: "liberation-road-widening",
    description: "Rehabilitation and widening of Liberation Road to Polo Club, with overpass",
    source: MPR_MAY_2026,
  },
] as const;

/**
 * Where an interchange sits on the corridor scale: which section it falls
 * in, and its distance in km from that section's start. Unknown until the
 * client confirms exact chainage, hence placeholder per interchange —
 * the name is a verified fact, the position is not.
 */
export interface InterchangePosition {
  readonly sectionId: ProjectSection["id"];
  readonly offsetKm: number;
}

export type InterchangeKind = "reconstruction" | "new";

export interface Interchange {
  /**
   * Stable id, shared with the matching progress work package
   * (progress.workPackages[].id) so the two can be joined without
   * matching on display names.
   */
  readonly id: string;
  readonly name: string;
  readonly kind: InterchangeKind;
  /** Approximate chainage along Section 1, from the May 2026 report. */
  readonly chainageLabel: string;
  /** The activity reported at this interchange in the May 2026 report. */
  readonly mayActivity: string;
  readonly position: InterchangePosition | Placeholder<InterchangePosition>;
}

// Dummy, non-indicative fallback — never render position.fallback as a
// real chainage. See isPlaceholder() / Placeholder<T> above.
const UNCONFIRMED_POSITION: InterchangePosition = { sectionId: "s1", offsetKm: 0 };

/**
 * Interchange scope per the May 2026 MPR: reconstruction of Tetteh
 * Quarshie, new interchanges at Teshie Link, Community 18, and Lashibi.
 * The pre-MPR "five interchanges" list is superseded: Fiesta Royale
 * exists only as a design visualisation, and Neoplan does not appear in
 * the MPR works scope (flagged 2026-07-16 — restore only if the client
 * confirms it).
 */
export const interchanges: readonly Interchange[] = [
  {
    id: "tetteh-quarshie",
    name: "Tetteh Quarshie",
    kind: "reconstruction",
    chainageLabel: "approx. CH 0+500",
    mayActivity: "T-beam installation and joint concreting works",
    position: placeholder<InterchangePosition>(
      "Tetteh Quarshie position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    id: "teshie-link",
    name: "Teshie Link",
    kind: "new",
    chainageLabel: "approx. CH 6+300",
    mayActivity: "Traffic-diversion wall construction",
    position: placeholder<InterchangePosition>(
      "Teshie Link position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    id: "community-18",
    name: "Community 18",
    kind: "new",
    chainageLabel: "approx. CH 12+350",
    mayActivity: "Underpass construction",
    position: placeholder<InterchangePosition>(
      "Community 18 position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    id: "lashibi",
    name: "Lashibi",
    kind: "new",
    chainageLabel: "approx. CH 16+200",
    mayActivity: "Top-slab structural works",
    position: placeholder<InterchangePosition>(
      "Lashibi position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Progress — official figures from the Monthly Progress Report, May 2026.
// A newer MPR is the only thing that updates these.
// ---------------------------------------------------------------------------

export interface SectionProgress {
  readonly sectionId: ProjectSection["id"];
  readonly percentComplete: number;
}

/**
 * One per-structure progress entry from the MPR. `source` is required by
 * design: a figure without a citation must not typecheck. Unit-based
 * structures (footbridges, culverts) carry the MPR's aggregate
 * unitsComplete/unitsTotal; their percentComplete is the exact derived
 * value, stored as a literal so floating-point division can't leak into
 * a render (e.g. "64.25000000000001%"). Keep the pair in sync.
 */
export interface WorkPackageProgress {
  readonly id: string;
  readonly name: string;
  readonly percentComplete: number;
  readonly unitsComplete?: number;
  readonly unitsTotal?: number;
  /**
   * Short display date for this figure, e.g. "August 2026" — mirrors
   * `Progress.asOf` (vs. `source`, the full citation). Every structure
   * currently shares the same Aug 2026 work-plan date, but the field is
   * per-item on purpose: if a future report updates only some structures,
   * each card can show its own real date instead of one shared label
   * silently implying every structure is equally current.
   */
  readonly asOf: string;
  readonly source: string;
}

export interface Progress {
  readonly overallPercentComplete: number | Placeholder<number>;
  readonly asOf: string | Placeholder<string>;
  /** Full citation, e.g. "Monthly Progress Report, May 2026". */
  readonly signOffSource: string | Placeholder<string>;
  /** Report series name without the date, e.g. "Monthly Progress Report". */
  readonly reportSeries: string;
  readonly sections: readonly SectionProgress[] | Placeholder<readonly SectionProgress[]>;
  readonly workPackages:
    | readonly WorkPackageProgress[]
    | Placeholder<readonly WorkPackageProgress[]>;
}

/**
 * OFFICIAL — Monthly Progress Report, May 2026. This supersedes the
 * earlier press-reported figure (Chief Resident Engineer via Ghanaian
 * Times, Jan 2026), which happened to match at 46% but was never the
 * sign-off source. Per-section percentages were not in the MPR and stay
 * placeholder — do not back-derive them from the per-structure figures.
 */
export const progress: Progress = {
  // Overall physical progress is 52% per the 28 Aug 2026 client meeting.
  //
  // RECONCILIATION — now largely explained. Maripoma's own progress chart
  // (public/images/progress-update-1.jpeg, dated 28 Aug 2026) shows a single
  // continuous monthly series: Jan 38% · Feb 40% · Mar 42% · Apr 44% ·
  // May 46% · Jun 48% · Jul 50% · Aug 52%. So the three figures on record
  // (46% MPR → 50% Board → 52% now) are NOT competing sources; they are the
  // same series read at three different months.
  //
  // RESOLVED (client instruction, 2026-08-29): the per-structure workPackages
  // below have been updated from Maripoma’s 28 Aug 2026 work plan
  // (public/images/progress-update-7.jpeg) and now sit on the same reporting
  // date as the 52% overall. They are cited as WORK_PLAN_AUG_2026, not the MPR.
  overallPercentComplete: 52,
  asOf: "August 2026",
  signOffSource: "Client meeting, 28 August 2026",
  reportSeries: "Monthly Progress Report",
  sections: placeholder<readonly SectionProgress[]>("Per-section progress percentages", []),
  workPackages: [
    {
      id: "tetteh-quarshie",
      name: "Tetteh Quarshie Interchange",
      // Reported complete (1 of 1) in the Aug 2026 work plan, up from 88% in May.
      percentComplete: 100,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
    {
      id: "teshie-link",
      name: "Teshie Link Interchange",
      percentComplete: 74.7,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
    {
      id: "community-18",
      name: "Community 18 Interchange",
      percentComplete: 67.5,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
    {
      id: "lashibi",
      name: "Lashibi Interchange",
      percentComplete: 37,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
    {
      id: "footbridges",
      name: "Pedestrian footbridges",
      percentComplete: 44.5,
      unitsComplete: 4.45,
      unitsTotal: 10,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
    {
      id: "box-culverts",
      name: "Box culverts",
      percentComplete: 91.25,
      unitsComplete: 18.25,
      unitsTotal: 20,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
    {
      id: "bridge-culverts",
      name: "Bridge culverts",
      // 1.3 of 3 = 43.33...%; stored to 1dp so no float artefact can reach a render.
      percentComplete: 43.3,
      unitsComplete: 1.3,
      unitsTotal: 3,
      asOf: "August 2026",
      source: WORK_PLAN_AUG_2026,
    },
  ],
};

// ---------------------------------------------------------------------------
// Monthly updates — the "This month" summary on /progress. Each month is
// one entry (newest first). Summarise in plain sentences drawn from that
// month's MPR; do NOT paste quantity tables. `overallPct` is the overall
// figure reported that month.
//
// Adding a month is a one-entry edit — unshift the new record, e.g.:
//   {
//     month: "June 2026",
//     completed: ["Lashibi interchange deck poured", "Box culverts 15/20 in place"],
//     planned: ["Begin footbridge steelwork at Community 18", "Toll plaza foundations"],
//     overallPct: 49,
//   },
//
// `completed`/`planned` are left empty for May 2026 on purpose: the MPR
// figures are captured per-structure elsewhere, but the narrative summary
// of what was done and what's next is the client's to supply — it is not
// invented here. The section renders an honest "to be added" state until
// then.
// ---------------------------------------------------------------------------

/**
 * Plain-language construction highlights for a public audience, each paired
 * with a real photograph from the 28 Aug 2026 progress pack. This replaces the
 * chainage-by-chainage engineering list that used to sit on /progress: the
 * client flagged it as too technical for the general public. The precise
 * chainage still lives in each image alt text for anyone who wants it.
 */
export interface ActivityHighlight {
  readonly media: MediaKey;
  readonly title: string;
  readonly detail: string;
}

export const activityHighlights: readonly ActivityHighlight[] = [
  {
    media: "comm18Underpass",
    title: "Underpass structure completed",
    detail: "Community 18 Interchange",
  },
  {
    media: "teshieLinkDiversionWalls",
    title: "Traffic diversion walls built",
    detail: "Teshie Link Interchange",
  },
  {
    media: "progTBeam",
    title: "Bridge beams cast and placed",
    detail: "Along the Section 1 corridor",
  },
  {
    media: "progFootbridgeKm8050A",
    title: "Pedestrian footbridge going up",
    detail: "Near Km 8+050",
  },
  {
    media: "progRetainingKm12120A",
    title: "Retaining walls under construction",
    detail: "Near Km 12+120",
  },
  {
    media: "progSubbaseKm7600",
    title: "New road foundation being laid",
    detail: "Between Km 7+600 and Km 8+340",
  },
];

export interface MonthlyUpdate {
  /** Reporting month, e.g. "May 2026". */
  readonly month: string;
  readonly completed: readonly string[];
  readonly planned: readonly string[];
  /** Overall physical progress reported that month. */
  readonly overallPct: number;
  /** Imagery evidencing the completed work. */
  readonly completedImages?: readonly MediaKey[];
  /** Imagery for the NEXT month's plan (work-plan sheets), never mixed with completed work. */
  readonly plannedImages?: readonly MediaKey[];
}

export const monthlyUpdates: readonly MonthlyUpdate[] = [
  {
    month: "August 2026",
    completed: [
      "Physical progress reached 52%, up from 50% in July.",
      "Traffic-diversion and footing walls constructed at Teshie Link Interchange (Km 6+363–6+380).",
      "Footing walls and underpass construction at Community 18 Interchange (Km 12+010–12+910).",
      "Bridge works advanced at Km 10+873, Km 13+745 and Km 16+556.",
      "Subgrade and sub-base laid between Km 7+600 and Km 18+300.",
    ],
    // September 2026 plan, from Maripoma's work-plan sheets (28 Aug 2026).
    planned: [
      "Rock filling — 70,000 m³.",
      "Natural gravel sub-base — 3,000 m³.",
      "Graded crushed stone sub-base — 1,000 m³.",
      "Trapezoidal concrete drain — 2,000 m, and U-drain slab — 1,000 m.",
      "Continued works at Lashibi Interchange, the footbridges and the box culverts.",
    ],
    overallPct: 52,
    completedImages: [
      "teshieLinkDiversionWalls",
      "teshieLinkFootingWall",
      "comm18FootingWall",
      "comm18Underpass",
      "progressChartAug2026",
    ],
    plannedImages: ["workPlanSep2026PageOne", "workPlanSep2026PageTwo"],
  },
  {
    month: "May 2026",
    completed: [],
    planned: [],
    overallPct: 46,
  },
];

export const latestMonthlyUpdate: MonthlyUpdate | undefined = monthlyUpdates[0];

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

/**
 * One social profile. An ORDERED ARRAY, not a fixed-key object: display order
 * is part of the content (LinkedIn leads), and a fixed-key shape can't express
 * order or accommodate a new platform without a type change.
 */
export interface SocialLink {
  readonly platform: string;
  readonly url: string;
}

export interface Contact {
  readonly email: string | Placeholder<string>;
  readonly phone: string | Placeholder<string>;
  readonly address: string | Placeholder<string>;
  readonly social: readonly SocialLink[];
}

// Real, client-confirmed contact details. The road name spelling "Yantrabi"
// was confirmed by the client (2026-08-29) and independently matches the
// client’s own Website Text Corrections document. The address is
// textual contact information only: the /contact map continues to show the
// project corridor, not an office pin. Social handles remain placeholders
// until supplied.
export const contact: Contact = {
  email: "info@atexpressway.com",
  phone: "0332092401",
  address: "157 Yantrabi Road, Labone, Accra, Ghana",
  social: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/atexpresswayltd/" },
    { platform: "X (Twitter)", url: "https://x.com/AtExpressway" },
    { platform: "Instagram", url: "https://www.instagram.com/atexpressway/" },
    { platform: "Facebook", url: "https://www.facebook.com/profile.php?id=61573949670230" },
  ],
};

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
}

export interface TeamMember {
  readonly name: string;
  readonly title: string;
  /** Photo asset, or null to render an initials avatar (no fabricated portrait). */
  readonly photo: ImageAsset | null;
  /** Initials for the avatar fallback when no photo is supplied. */
  readonly initials: string;
  /** Short biography for the card. */
  readonly bio: string;
  /** Selected experience / credentials for the expandable "view profile". */
  readonly credentials: readonly string[];
}

/** The two confirmed project professionals, both with supplied portraits. */
export const team: readonly TeamMember[] = [
  {
    name: "Ing. Kwadwo Bempong",
    title: "Chief Resident Engineer",
    photo: {
      src: "/images/bempong.png",
      alt: "Portrait of Ing. Kwadwo Bempong, Chief Resident Engineer",
    },
    initials: "KB",
    bio: "Ing. Kwadwo Bempong is a civil and road engineer with more than 30 years of design and construction-supervision experience. He holds an MSc with honours in Road and Pavement Engineering and is Chief Executive Officer of Associated Consultants Limited. His major assignments include the Pokuase Interchange, the Ofankor–Nsawam Road, the Ashaiman–Akosombo dual carriageway and the Accra–Tema Motorway and Extensions Project, where he serves as Chief Resident Engineer.",
    credentials: [
      "MSc, Road and Pavement Engineering",
      "Chief Executive Officer, Associated Consultants Limited",
      "Immediate Past President, Ghana Institution of Engineering",
      "President, Ghana Consulting Engineers Association",
      "More than 30 years of engineering experience",
    ],
  },
  {
    name: "Ing. Emmanuel Tetteh",
    title: "Resident Engineer, Roads",
    photo: {
      src: "/images/tetteh.jpg",
      alt: "Portrait of Ing. Emmanuel Tetteh, Resident Engineer (Roads)",
    },
    initials: "ET",
    bio: "Ing. Emmanuel Tetteh is a civil engineer with more than thirty years of construction experience across Ghana's trunk road network. He holds an MSc in Industrial Mathematics and a BSc in Civil Engineering, both from Kwame Nkrumah University of Science and Technology. As Resident Engineer for roads on the Accra–Tema Motorway and Extensions Project with Associated Consultants Limited, he liaises with the client, contractor and stakeholders, monitors progress against the work project and ensures site compliance with the relevant specifications.",
    credentials: [
      "MSc, Industrial Mathematics — KNUST",
      "BSc, Civil Engineering — KNUST",
      "Tamale–Paga Road Rehabilitation",
      "Kwame Nkrumah Circle–Achimota Road",
      "Reconstruction of Teshie Link Road",
      "Reconstruction of Tema Steel Works Road",
      "Valco Roundabout–Kpone Road",
    ],
  },
  {
    // "Ing." prefix added (client instruction, 3 Sept 2026) to match the
    // pattern used for Bempong and Tetteh — applied consistently below in
    // the alt text and bio opening too, not just this field.
    name: "Ing. Koffi Togbenou",
    title: "Bridge & Tunnel Engineer",
    // Enhanced from the (low-res 137×199) source via denoise + unsharp + a
    // lanczos upscale to 420px — a modest, honest improvement in delivered
    // resolution, not a recovery of detail. A proper replacement photo is
    // still the real fix.
    photo: {
      src: "/images/koffitogbenou-enhanced.png",
      alt: "Portrait of Ing. Koffi Togbenou, Bridge & Tunnel Engineer",
    },
    initials: "KT",
    bio: "Ing. Koffi Togbenou is a structural engineer with approximately eight years of experience in bridge design, analysis and construction supervision. As Resident Engineer for bridges on the Accra–Tema Motorway and Extensions Project, he oversees bridge, interchange and associated structural works, with a strong focus on technical compliance, quality control and site execution.",
    credentials: [
      "La Beach Road and Nungua Interchange",
      "Namdini Gold Project",
      "Tatale–Yendi–Tamale Road",
      "Buipe, Yapei, Daboya and Nawuni Bridges",
      "Padma Multipurpose Bridge",
      "Guene–Ouenou Road",
    ],
  },
] as const;

/**
 * Board of Directors. Data-driven so the card is written once and every
 * member is one record. `bio` is an array of paragraphs. Where a portrait
 * has not been supplied, `photo` is null and the card renders an initials
 * avatar — never a fake photo and never a broken image. Members whose
 * biography has not yet been supplied wrap `bio` in placeholder() so the
 * card shows an explicit "to be confirmed" profile. Adding a bio or photo
 * later is a one-line change.
 */
/**
 * The minimal shape every person card renders: name, role, portrait (or null
 * for an initials avatar) and initials. BoardMember satisfies it, and team
 * members are adapted to it at the render site — so a person's name, title and
 * photo live in exactly ONE place in this file, never copied.
 *
 * `bio` and `credentials` are optional and deliberately absent for the board
 * roster (see BoardMemberCard's own comment — the board reads as a clean
 * roster, not a set of profiles). They exist for the rare case a person
 * outside that roster (e.g. EPC contractor personnel) needs the same
 * full-profile treatment as a `TeamMember`; StakeholderOrg renders anyone
 * with a `bio` via TeamMemberCard instead of the thin BoardMemberCard.
 */
export interface OrgPerson {
  readonly name: string;
  readonly role: string;
  readonly photo: ImageAsset | null;
  readonly initials: string;
  readonly bio?: string;
  readonly credentials?: readonly string[];
}

export interface BoardMember {
  /** Plain string: every seat is now confirmed, so no placeholder state remains. */
  readonly name: string;
  /** Contractual role — "Board Member", or "Chairman, Board of Directors". */
  readonly role: string;
  /** Supplied portrait, or null to fall back to an initials avatar. */
  readonly photo: ImageAsset | null;
  readonly initials: string;
  /**
   * Which delivery-chain organisation this director is affiliated with, per
   * their own supplied profile. The board roster is nested under that
   * organisation on /stakeholders. NOTE: every person here is a director of
   * ATEL; the affiliation is their substantive employer/appointing body, NOT a
   * claim that they sit on that organisation's own board. The UI labels this
   * as representation for exactly that reason.
   */
  readonly affiliation: StakeholderKey;
  /** Chair leads the roster. */
  readonly isChairman?: boolean;
  /**
   * Executive leadership (e.g. the CEO) rather than a non-executive director.
   * Rendered in its own group above the board list, so governance and
   * management are visually distinct.
   */
  readonly isExecutive?: boolean;
}

export type StakeholderKey = "employer" | "fundingAgency" | "employersRepresentative" | "financeMinistry";

/**
 * Reordered into a single list 3 Sept 2026 (client instruction): the old
 * "Executive leadership" / "Board of Directors" split (via isExecutive) is
 * gone — everyone renders in one Board of Directors list now, in the exact
 * order below. isExecutive/isChairman fields are no longer read by any
 * renderer (kept as inert historical data rather than stripped, in case a
 * future distinct treatment wants them back).
 *
 * ⚠ Chairman's surname spelling: "Akuoku" (originally confirmed correct) →
 * "Akuoko" (used once since) → "Akuako" (this instruction, applied below as
 * the most recent explicit direction). Three different spellings across
 * three updates — get this confirmed once, in writing, before it changes a
 * fourth time. See report.
 */
export const boardMembers: readonly BoardMember[] = [
  {
    // Spelling per client instruction, 3 Sept 2026 — see the flag above.
    name: "Mr. Samuel Kwasi Akuako",
    role: "Board Chairman",
    isChairman: true,
    affiliation: "employer",
    // New photo per client instruction, 3 Sept 2026 (file verified to exist).
    photo: {
      src: "/images/Akuako.jpg",
      alt: "Portrait of Mr. Samuel Kwasi Akuako, Chairman, Board of Directors of A.T. Expressway Ltd.",
    },
    initials: "SA",
  },
  {
    name: "Mr. Louis Harrison",
    // CEO per the client's 30 Aug 2026 list. Name spelling CONFIRMED as
    // "Louis" (client instruction, 2 Sept AND 3 Sept 2026) — resolves the
    // earlier flag (an intervening client list had written "Louise").
    role: "Chief Executive Officer",
    affiliation: "employer",
    photo: {
      src: "/images/board-member5.jpeg",
      alt: "Portrait of Mr. Louis Harrison, Board Member of A.T. Expressway Ltd.",
    },
    initials: "LH",
  },
  {
    name: "Mr. Patrick Nomo",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      src: "/images/patrick.jpg",
      alt: "Portrait of Mr. Patrick Nomo, Board Member of A.T. Expressway Ltd.",
    },
    initials: "PN",
  },
  {
    name: "Hon. Theresa Lardi Awuni",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      src: "/images/board-member4.jpeg",
      alt: "Portrait of Hon. Theresa Lardi Awuni, Board Member of A.T. Expressway Ltd.",
    },
    initials: "TA",
  },
  {
    // "Dr." removed per client instruction, 3 Sept 2026 — was "Hon. Dr. Eric
    // Afful".
    name: "Hon. Eric Afful",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      src: "/images/afful.jpg",
      alt: "Portrait of Hon. Eric Afful, Board Member of A.T. Expressway Ltd.",
    },
    initials: "EA",
  },
  {
    // ⚠ Named "Mallam (Issac Ishak)" in the 3 Sept 2026 instruction — the
    // existing on-record spelling is "Issah", not "Issac". Read as
    // identifying shorthand rather than a deliberate respelling (unlike
    // Akuako/Louis, this one wasn't flagged with the same explicit
    // "apply this spelling" language), so left unchanged here — but this is
    // the same category of discrepancy. Flagged in the report; not silently
    // decided either way.
    name: "Surv. Mallam Issah Ishak",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      src: "/images/ishak.jpg",
      alt: "Portrait of Surv. Mallam Issah Ishak, Board Member of A.T. Expressway Ltd.",
    },
    initials: "MI",
  },
  {
    name: "Ms. Victoria Addotey",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      src: "/images/board-member3.jpeg",
      alt: "Portrait of Ms. Victoria Addotey, Board Member of A.T. Expressway Ltd.",
    },
    initials: "VA",
  },
  // Last (client instruction, 2 Sept 2026, reconfirmed 3 Sept 2026).
  {
    name: "Gifty Duah-Boakye",
    role: "Board Secretary",
    affiliation: "employer",
    photo: {
      src: "/images/board-member2.JPEG",
      alt: "Portrait of Gifty Duah-Boakye, Board Secretary of A.T. Expressway Ltd.",
    },
    initials: "GB",
  },
];

/**
 * People nested under the EPC contractor. Not directors — Maripoma's own
 * personnel.
 */
export const epcPersonnel: readonly OrgPerson[] = [
  {
    name: "Ing. Benjamin Sackey",
    // RESOLVED (client instruction, 2 Sept 2026): "Project Manager" —
    // corrects the earlier client list (30 Aug 2026), which read "Product
    // Manager". Verified directly against his own CV ("Ing Ben Sackey.docx",
    // public/info/), which states "Project Manager" throughout, including as
    // his current role on this project.
    role: "Project Manager",
    photo: {
      src: "/images/ben-sackey.jpg",
      alt: "Portrait of Ing. Benjamin Sackey, Project Manager at Maripoma Enterprise Limited",
    },
    initials: "BS",
    // Full profile added 2 Sept 2026, extracted from his CV (same source
    // file above) so his entry matches the level of detail the Project Team
    // members (Bempong/Tetteh/Togbenou) get, per client instruction.
    // Bio revised 3 Sept 2026 from an updated version of the same CV (which
    // added a "Key Skills"/"Key Positions Held" section) — tightened into a
    // summary rather than pasted verbatim, per client instruction.
    bio: "Ing. Benjamin Sackey is a civil engineer and project management professional with more than 25 years of experience across highway design, contract management and construction supervision in Ghana and internationally. He holds an MSc in Transportation Systems from Kwame Nkrumah University of Science and Technology and an Executive MBA in Project Management from the University of Ghana Business School. As Project Manager for Maripoma Enterprise Limited on the Accra–Tema Motorway and Extensions Project, he leads the design and construction of the Section 1 corridor, overseeing contract management, quality control and the on-site workforce.",
    credentials: [
      "MSc, Transportation Systems (Infrastructure & Engineering) — KNUST, 2023",
      "Executive MBA, Project Management — University of Ghana Business School",
      "BSc (Hons), Civil Engineering — KNUST",
      "More than 25 years of civil engineering and project management experience",
      "Liberia Swedish Feeder Roads Project Phase III (700km), Liberia",
      "Accra and Tema Asphalt Roads Resurfacing Project (150km)",
      "Asphaltic Overlay of Selected Streets in Accra Phase II (120km)",
    ],
  },
  {
    // Added 3 Sept 2026, extracted from his CV ("Ing Kwaku Anim Boateng.docx",
    // public/info/). His CV lists Maripoma Enterprise Limited among his past
    // clients generically (no dated "current role" line the way Sackey's CV
    // has) — the project tie in the bio below reflects his placement on this
    // roster per client instruction, matching the framing every other entry
    // here uses, not an explicit dated claim from the CV itself.
    //
    // Photo resolved 3 Sept 2026: client supplied a dedicated new photo
    // (kwaku1.png — file verified to exist; instruction said "kwaku1.jpg",
    // flagged as a minor extension mismatch in the report), replacing the
    // earlier by-elimination guess from his CV (which turned out to be a
    // leftover copy of Sackey's own photo — see git history for that note).
    name: "Ing. Kwaku Anim Boateng",
    role: "ESHS Expert",
    photo: {
      src: "/images/kwaku1.png",
      alt: "Portrait of Ing. Kwaku Anim Boateng, ESHS Expert at Maripoma Enterprise Limited",
    },
    initials: "KB",
    bio: "Ing. Kwaku Anim Boateng is a chemical and environmental engineer and social development expert based in Accra, with more than 40 years of experience in chemical engineering design and environmental and social planning, assessment and implementation for major capital projects in Ghana and internationally. He holds an MSc in Chemical Engineering from Howard University and a BSc (Hons) in Chemical Engineering from Kwame Nkrumah University of Science and Technology. As ESHS Expert for Maripoma Enterprise Limited on the Accra–Tema Motorway and Extensions Project, he leads environmental, social and health & safety planning and compliance for the corridor.",
    credentials: [
      "MSc, Chemical Engineering — Howard University, Washington D.C.",
      "BSc (Hons), Chemical Engineering — KNUST",
      "More than 40 years of environmental, social and chemical engineering experience",
      "Environmental & Social Impact Assessment (ESIA) and Management Plans (ESMP)",
      "Projects to World Bank, IFC, European Union and African Development Bank standards",
      "Ghana Highway Authority, AngloGold Ashanti, Newmont Ghana Akyem Mines",
    ],
  },
];

/**
 * Government bodies with a defined role in the concession, per the client's own
 * FAQ pack. They are NOT delivery-chain contractors, so they render as a
 * lighter-weight oversight band rather than as chain cards.
 */
export interface OversightBody {
  /** Matches BoardMember.affiliation so directors nest under the right body. */
  readonly key: StakeholderKey | "roadsMinistry";
  readonly name: string;
  readonly role: string;
  readonly gloss: string;
  readonly website: string;
}

export const oversightBodies: readonly OversightBody[] = [
  {
    key: "roadsMinistry",
    name: "Ministry of Roads and Highways",
    role: "Contracting Authority",
    gloss: "Acting through the Ghana Highway Authority, the Ministry awarded the 30-year concession for the corridor.",
    website: "https://mrh.gov.gh/",
  },
  {
    key: "financeMinistry",
    name: "Ministry of Finance and Economic Planning",
    role: "Viability Gap Funding",
    gloss: "Provides the construction grant that keeps tolls affordable, and funds applicable taxes on the Section 1 works.",
    website: "https://www.mofep.gov.gh/",
  },
];

// ---------------------------------------------------------------------------
// Bulletins — the weekly-by-email update feed. This is the one array
// that changes on a weekly cadence; it lives here (not a separate file)
// specifically so a week's update is one edit to one file. Each entry is
// a real, dated record, not a placeholder. An empty list means no
// bulletin has been published yet — a genuine current state, not a
// withheld fact — and should render as an explicit "no bulletins yet"
// empty state, distinct from the "to be confirmed" placeholder treatment
// used elsewhere.
// ---------------------------------------------------------------------------

export interface Bulletin {
  /** ISO 8601 (YYYY-MM-DD) — /progress sorts the feed newest-first on this string. */
  readonly date: string;
  readonly headline: string;
  readonly summary: string;
  readonly href: string;
}

export const bulletins: readonly Bulletin[] = [];
