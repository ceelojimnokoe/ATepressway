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

/**
 * Corrections to the Aug 2026 work-plan figures below — Tetteh Quarshie,
 * Community 18 and Lashibi (client instruction, 14 Sept 2026) and Teshie Link
 * (client instruction, 20 Sept 2026) — NOT a new reporting period: `asOf` on
 * those entries deliberately stays "August 2026" rather than moving to
 * September, since these aren't a new survey. No specific underlying source
 * document was given for either correction, only the dates the instructions
 * arrived; flagged in the report pending that detail. Lowercase and plural
 * (unlike WORK_PLAN_AUG_2026's proper noun) so it reads correctly in the
 * Progress page's "sourced from the {source}" sentence — which takes the
 * first work package's source and, with all four interchange figures now
 * corrections, describes them all.
 */
const CLIENT_CORRECTION_SEPT_2026 = "client corrections, 14 and 20 September 2026";

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
  // "Your guide" → "Your special purpose vehicle" (client instruction, 20 Sept
  // 2026), applied to this and the Home hero (src/components/home/hero.tsx),
  // the only two places the phrase appears. Only those two words were
  // swapped; the "to the design…" that follows is untouched and now reads
  // awkwardly ("vehicle to the design") — flagged in the report, with "for"
  // (as the hero already has it) as the suggested fix.
  gloss: "Your special purpose vehicle to the design, financing, construction, operation, and maintenance, of the Accra-Tema Motorway and Extensions Project under a 30-year concession",
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

/**
 * Legal Advisors — added 7 Sept 2026 (client instruction). Not part of the
 * MPR's contractual delivery chain (Concessionaire → Funding Agency →
 * Employer's Representative → Agent → EPC Contractor, see CLAUDE.md), so
 * this is kept out of `stakeholderChain`/`stakeholders` and rendered as its
 * own card directly after that chain on /stakeholders — same StakeholderOrg
 * name+logo+link treatment as every chain entry, but its own "Legal
 * Advisors" role caption so it never reads as a claim of contractual rank.
 */
export const legalAdvisor = {
  name: "AB & David",
  role: "Legal Advisors",
  gloss: "AB & David provides legal advisory services to A.T. Expressway Ltd. for the Accra–Tema Motorway and Extensions Project.",
  logo: "logoAbDavid",
  website: "https://abdavid.com/",
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
 * `paragraph` was originally verbatim client copy that read grammatically
 * unusual ("Government of Ghana constructing the Ghana Highway Authority
 * through the Ministry of Roads & Highways") — flagged back to the client
 * rather than silently reworded (see report, 7 Sept 2026). Resolved by
 * client instruction, 10 Sept 2026: "constructing" → "contracting".
 *
 * `logo`/`website`/`supportingLogos`: reworked 4 Sept 2026 (client
 * instruction) to match the same name+logo layout every other
 * StakeholderOrg entry uses — `logo` sits beside the linked title, exactly
 * like `Stakeholder.logo` does; `supportingLogos` (Ghana Highway Authority,
 * Ministry of Roads & Highways) stay in their own row after the paragraph,
 * as already built.
 */
export const governmentOfGhana = {
  // Entity name corrected 25 Sept 2026 (client instruction): "Government of
  // Ghana" → "Ministry of Roads & Highways", resolving the label/destination
  // mismatch this file used to flag here (the link was always mrh.gov.gh).
  // `subtitle`/`website` are unchanged by this edit, as instructed. One
  // field, read by GovernmentOfGhanaBlock on both Home and /stakeholders, so
  // both change together.
  title: "Ministry of Roads & Highways",
  website: "https://mrh.gov.gh",
  subtitle: "Contracting Authority",
  paragraph:
    "Government of Ghana contracting the Ghana Highway Authority through the Ministry of Roads & Highways.",
  logo: "coatOfArms" as MediaKey,
  supportingLogos: ["logoGha", "logoMinistryOfRoadsAndHighways"] as readonly MediaKey[],
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
  /**
   * Optional line under the label — used for a qualifier that belongs to the
   * figure, not the label, e.g. "(approx.)" on an approximated total.
   */
  readonly note?: string;
  /**
   * Render on Home's "By the numbers" only, not in Project's "Across the whole
   * corridor" grid (which shares the Total group and renders bare figures —
   * no prefix/suffix — in a six-column row). Set on the unconfirmed $700M.
   */
  readonly homeOnly?: boolean;
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
      // Label "Contract price before tax" → "Construction Contract Price" (client
      // instruction, 20 Sept 2026); value unchanged. Dropping "before tax"
      // makes this US$338.9M ambiguous against the US$393.1M incl. tax on
      // record — flagged in the report. No "(approx.)": only the Total is.
      { value: 338.9, prefix: "US$", suffix: "M", decimals: 1, label: "Construction Contract Price" },
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
      // BOARD-APPROVED (client, 20 Sept 2026: every change in that batch was
      // approved by the board and is to be applied over the earlier data and
      // documents). $700M is far from the figures on record (US$338,897,543.56
      // before tax / US$393,121,150.53 incl. tax, May 2026 MPR) — the board's
      // figure now governs this display, and CLAUDE.md was updated to say so.
      // It is still an approximation (hence the "(approx.)" note), and the
      // instruction gave no written statement of what it covers or its
      // currency; prefix is "$" as written, whereas Section 1's is "US$". This
      // group had no price figure before; it is ADDED, not replaced.
      // `homeOnly` keeps it off Project's shared grid, which renders bare
      // figures without prefix/suffix.
      {
        value: 700,
        prefix: "$",
        suffix: "M",
        label: "Construction Contract Price",
        note: "(approx.)",
        homeOnly: true,
      },
      { value: 3, label: "Sections" },
      { value: 5, label: "New interchanges" },
      { value: 2, label: "Remodelled interchanges" },
      // Unit "year" (singular), not "years": it reads as the adjective in "30
      // year Concession Term" (client instruction, 20 Sept 2026). Shared with
      // Project's "Across the whole corridor" grid, so both change together.
      { value: 30, unit: "year", label: "Concession Term" },
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
  // "Client meeting" → "Progress meeting" (client instruction, 20 Sept 2026).
  // Rendered as "Source: {signOffSource}" on /progress — the only place the
  // label appears; the other "client meeting" mentions in this file are
  // comments, not rendered text.
  signOffSource: "Progress meeting, 28 August 2026",
  reportSeries: "Monthly Progress Report",
  sections: placeholder<readonly SectionProgress[]>("Per-section progress percentages", []),
  workPackages: [
    {
      id: "tetteh-quarshie",
      name: "Tetteh Quarshie Interchange",
      // ⚠ CORRECTED 14 Sept 2026 (client instruction): 100% → 70%. This was
      // previously reported complete (1 of 1) in the Aug 2026 work plan, up
      // from 88% in May — so this correction takes it from "fully complete"
      // back down to 70%, a bigger reversal than a plain percentage
      // comparison suggests. Flagged back to the client for confirmation
      // this is intentional (a corrected baseline, revised scope, or the
      // 100%/88% figures being wrong) rather than a transcription error —
      // see report. NOT YET CONFIRMED AS INTENTIONAL.
      percentComplete: 70,
      asOf: "August 2026",
      source: CLIENT_CORRECTION_SEPT_2026,
    },
    {
      id: "teshie-link",
      name: "Teshie Link Interchange",
      // Corrected 20 Sept 2026 (client instruction, board-approved): 74.7% →
      // 70%. For the record: this file held 74.7 (the doc comment on
      // WORK_PLAN_AUG_2026 calls it ≈74.5%) while the client's own note said
      // "currently 74.4%" — they were reading a different source than what
      // was published. The board's 70% governs regardless.
      percentComplete: 70,
      asOf: "August 2026",
      source: CLIENT_CORRECTION_SEPT_2026,
    },
    {
      id: "community-18",
      name: "Community 18 Interchange",
      // Corrected 14 Sept 2026 (client instruction): 67.5% → 70% — the one
      // figure of the three that moved up, not down.
      percentComplete: 70,
      asOf: "August 2026",
      source: CLIENT_CORRECTION_SEPT_2026,
    },
    {
      id: "lashibi",
      name: "Lashibi Interchange",
      // Corrected 14 Sept 2026 (client instruction): 37% → 40%.
      percentComplete: 40,
      asOf: "August 2026",
      source: CLIENT_CORRECTION_SEPT_2026,
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
  // Earlier months (added 20 Sept 2026 for the "Previous progress" history on
  // /progress). Percentage-only: the overall figures are read straight off
  // Maripoma's own chart of physical progress (public/images/progress-update-1
  // .jpeg, dated 28 Aug 2026), whose data table lists every month Jan–Aug
  // 2026 (38 · 40 · 42 · 44 · 46 · 48 · 50 · 52%). No per-month "what was
  // completed" notes exist for these months, so `completed` stays empty and
  // progressHistory (below) derives a single line from the series instead of
  // inventing detail. Going forward: add each new month at the TOP of this
  // array — the newest entry drives the page's "This month and next" section
  // and the Updates popup, and every older one flows into the history.
  {
    month: "July 2026",
    completed: [],
    planned: [],
    overallPct: 50,
  },
  {
    month: "June 2026",
    completed: [],
    planned: [],
    overallPct: 48,
  },
  {
    month: "May 2026",
    completed: [],
    planned: [],
    overallPct: 46,
  },
  {
    month: "April 2026",
    completed: [],
    planned: [],
    overallPct: 44,
  },
  {
    month: "March 2026",
    completed: [],
    planned: [],
    overallPct: 42,
  },
  {
    month: "February 2026",
    completed: [],
    planned: [],
    overallPct: 40,
  },
  {
    month: "January 2026",
    completed: [],
    planned: [],
    overallPct: 38,
  },
];

export const latestMonthlyUpdate: MonthlyUpdate | undefined = monthlyUpdates[0];

/**
 * One row of the "Previous progress" history, presented like release notes:
 * date + what changed. DERIVED from `monthlyUpdates` — not a second content
 * model — so adding a month to that array updates the page, the Updates popup
 * and this history together.
 */
export interface ProgressHistoryEntry {
  readonly month: string;
  readonly overallPct: number;
  /** The entry's own completed-work notes, or one line derived from the overall series. */
  readonly changes: readonly string[];
  /** True for the newest entry — the one the page itself already shows in full. */
  readonly isLatest: boolean;
}

export const progressHistory: readonly ProgressHistoryEntry[] = monthlyUpdates.map((update, index) => {
  const previous = monthlyUpdates[index + 1];
  const derived = previous
    ? `Overall physical progress reached ${update.overallPct}%, up from ${previous.overallPct}% in ${previous.month.split(" ")[0]}.`
    : `Overall physical progress reported at ${update.overallPct}%.`;
  return {
    month: update.month,
    overallPct: update.overallPct,
    changes: update.completed.length > 0 ? update.completed : [derived],
    isLatest: index === 0,
  };
});

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
  /**
   * Profile URL. OMIT it while the real link isn't available: the entry then
   * renders as a disabled "Coming soon" item (see site-footer.tsx and
   * contact-details.tsx) rather than linking to a placeholder or dead URL —
   * the same honest treatment the newsletter sign-up gets. Add the URL later
   * and the entry becomes a normal link with no other change.
   */
  readonly url?: string;
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
    // YouTube added 20 Sept 2026 (client instruction) with NO url yet — renders
    // disabled/"Coming soon". Placed last since no position was specified;
    // moving it is a one-line reorder, and adding `url` is the only change
    // needed to make it live.
    { platform: "YouTube" },
  ],
};

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
  /**
   * Optional tighter-crop override for a specific photo. Needed only when a
   * source image's aspect ratio already matches its display frame (a square
   * photo in a square card) — object-cover then shows the whole frame with
   * zero natural overflow, so object-position alone has nothing to pan
   * into. `scale` enlarges the image (clipped by the frame's
   * overflow-hidden) and `origin` is the CSS transform-origin that stays
   * fixed while it enlarges — an origin above centre biases the zoom toward
   * the top of the photo, cropping proportionally more off the bottom.
   */
  readonly crop?: { readonly scale: number; readonly origin: string };
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
    // Name RESOLVED (client instruction, 7 Sept 2026): "Kwabena" — the name
    // had already been corrected once from "Kwabena" to "Kwadwo" (client
    // instruction, 3 Sept 2026), and this reverses that back to "Kwabena"
    // per the client's own explicit confirmation ("Ing. Kwabena Bempong, not
    // Kwadwo"). Flagged in the delivery report as a two-way flip on the same
    // field within a week — final written confirmation requested before this
    // is touched again.
    name: "Ing. Kwabena Bempong",
    title: "Chief Resident Engineer",
    photo: {
      src: "/images/bempong.png",
      alt: "Portrait of Ing. Kwabena Bempong, Chief Resident Engineer",
    },
    initials: "KB",
    bio: "Ing. Kwabena Bempong is a civil and road engineer with more than 30 years of design and construction-supervision experience. He holds an MSc with honours in Road and Pavement Engineering and is Chief Executive Officer of Associated Consultants Limited. His major assignments include the Pokuase Interchange, the Ofankor–Nsawam Road, the Ashaiman–Akosombo dual carriageway and the Accra–Tema Motorway and Extensions Project, where he serves as Chief Resident Engineer.",
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
    // Ing. Koffi Togbenou's entry was REPLACED outright (client instruction,
    // 7 Sept 2026) by Ing. Evelyn Gyampo — a different person, not a rename;
    // Togbenou's photo and profile are removed from the site entirely.
    // Extracted from "ATEL Profile.docx" (public/info/): text via the
    // document.xml zipfile technique, photo from word/media/image1.jpeg
    // (the only non-template image in the file) — visually verified as a
    // genuine, distinct portrait, not a repeat of any other team photo.
    name: "Ing. Evelyn Gyampo",
    title: "Environmental, Social, Health & Safety Expert",
    photo: {
      src: "/images/evelyn-gyampo.jpg",
      alt: "Portrait of Ing. Evelyn Gyampo, Environmental, Social, Health & Safety Expert",
    },
    initials: "EG",
    bio: "Ing. Evelyn Gyampo is a chemical engineer and environmental management professional with more than 20 years of experience in environmental and social sustainability, ESHS compliance and stakeholder engagement across major infrastructure projects. She holds an MPhil in Environmental Science from the University of Ghana and a BSc (Hons) in Chemical Engineering from Kwame Nkrumah University of Science and Technology. As Lead Consultant (Environmental, Social, Health & Safety) for Associated Consultants Limited on the Accra–Tema Motorway and Extensions Project, she leads ESHS oversight, compliance monitoring and stakeholder engagement for the corridor.",
    credentials: [
      "MPhil, Environmental Science — University of Ghana, Legon",
      "BSc (Hons), Chemical Engineering — KNUST",
      "Certificate, Climate Change, Sustainable Development & CDM Project Formulation — University of Twente, Netherlands",
      "More than 20 years of environmental and social sustainability experience",
      "Environmental & Social Assessment Specialist — Millennium Challenge Account Infrastructure Projects",
      "Certified Trainer for Inclusive EIA — UNDP/AfDB (Ethiopia, South Africa, Eswatini)",
      "Member, Ghana Institution of Engineers",
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
 * "Akuoko" (used once since) → "Akuako" (3 Sept 2026) → "Akuaku" (client
 * instruction, 14 Sept 2026 — applied below as the most recent explicit
 * direction). FOUR different spellings across four updates now — the client
 * has been told directly this should not change a fifth time without
 * explicit, final written confirmation. See report.
 */
export const boardMembers: readonly BoardMember[] = [
  {
    // Surname spelling per client instruction, 14 Sept 2026 — see the flag
    // above. Title corrected "Mr." → "Ing." in a later same-day instruction
    // — the surname itself is unchanged, so this isn't a fifth spelling.
    name: "Ing. Samuel Kwasi Akuaku",
    role: "Board Chairman",
    isChairman: true,
    affiliation: "employer",
    // New photo per client instruction, 14 Sept 2026 (file verified to exist).
    photo: {
      src: "/images/akuaku-new.jpg",
      alt: "Portrait of Ing. Samuel Kwasi Akuaku, Chairman, Board of Directors of A.T. Expressway Ltd.",
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
      // Source carries a visible ~5.7% white border on every edge (a
      // CapCut Ai template frame, watermark included — client instruction,
      // 10 Sept 2026 flagged it as "some sort of frame"). Measured via a
      // pixel scan for where the near-white margin ends; scale/origin
      // sized to crop it out from a centred zoom, same mechanism as
      // Gifty's crop above — border is symmetric so no directional bias
      // needed, unlike hers.
      crop: { scale: 1.18, origin: "50% 50%" },
    },
    initials: "TA",
  },
  {
    // "Dr." removed per client instruction, 3 Sept 2026 — was "Hon. Dr. Eric
    // Afful". Photo replaced 7 Sept 2026 with a new client-supplied studio
    // headshot (hon-dr-eric-afful-400x500.jpg, public/images/) — the "dr" in
    // that filename is the client's own naming, not an instruction to
    // reintroduce "Dr." into the displayed title, which stays "Hon. Eric
    // Afful" per the 3 Sept 2026 correction above.
    name: "Hon. Eric Afful",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      src: "/images/hon-dr-eric-afful-400x500.jpg",
      alt: "Portrait of Hon. Eric Afful, Board Member of A.T. Expressway Ltd.",
    },
    initials: "EA",
  },
  {
    // ⚠ Named "Mallam (Issac Ishak)" in the 3 Sept 2026 instruction, then
    // "Issa/Issac Ishak" in the 14 Sept 2026 instruction (photo only) — the
    // existing on-record spelling is "Issah", not "Issac" or "Issa". Read as
    // identifying shorthand rather than a deliberate respelling both times
    // (unlike Akuaku/Louis, this one has never been flagged with the same
    // explicit "apply this spelling" language), so left unchanged here — but
    // this is the same category of discrepancy, now sighted a third way.
    // Flagged in the report; not silently decided either way. Photo updated
    // 14 Sept 2026 (client instruction, file verified to exist) — bio/name
    // untouched.
    name: "Surv. Mallam Issah Ishak",
    role: "Board Member",
    affiliation: "employer",
    photo: {
      // Replaced 14 Sept 2026 (client instruction) with a properly
      // composed headshot — the subject now fills the source frame edge to
      // edge (measured), so the earlier scale/origin crop tuned for the
      // old 600×363 image (with its wide white margin) no longer applies
      // and is removed rather than carried over onto a different photo.
      src: "/images/ishak-new.jpg",
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
      // Same CapCut Ai template frame as Theresa's, above — here a
      // narrower ~4% margin on every edge (measured the same way).
      //
      // Reframed 20 Sept 2026 (client instruction) from head-and-chest to
      // shoulders-upward: the lower portion is cropped off. Same
      // scale + origin technique as Gifty's below, on the existing image (no
      // new file). At scale 1.4 from an origin 21.5% down, the visible window
      // is x 14.3–85.7% / y 6.1–77.6% of the 1968×1968 source — clear of the
      // ~4% CapCut border and the watermark (top-left, y ≈ 3–6%), and about
      // 1400 source px across for a card that shows ~260 css px (~520 at 2x),
      // so resolution is comfortably sufficient: nothing is upscaled.
      crop: { scale: 1.4, origin: "50% 21.5%" },
    },
    initials: "VA",
  },
  // Last (client instruction, 2 Sept 2026, reconfirmed 3 Sept 2026).
  {
    // "Ms." prefix added 20 Sept 2026 (client instruction), matching
    // Victoria's formatting — name and alt text; initials stay "GB".
    name: "Ms. Gifty Duah-Boakye",
    role: "Board Secretary",
    affiliation: "employer",
    photo: {
      // Replaced 25 Sept 2026 (client instruction): board-member2.JPEG →
      // gifty-new.jpg. The old photo needed the crop below to zoom past its
      // CapCut AI template frame/watermark and get a shoulders-up portrait
      // out of an otherwise mostly-empty square canvas (same issue flagged
      // on Theresa Awuni's photo, above). The new source is already a
      // clean, tightly-framed portrait with no watermark, so that crop is
      // dropped rather than carried over onto different-composition
      // source — BoardMemberCard's default `object-cover object-top` in
      // its square frame reads correctly on it as-is.
      src: "/images/gifty-new.jpg",
      alt: "Portrait of Ms. Gifty Duah-Boakye, Board Secretary of A.T. Expressway Ltd.",
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
    // Photo replaced 7 Sept 2026 — image extraction only, from "Ing Ben
    // Sackey (Profile).docx" (public/info/); his bio below is untouched
    // (last revised 3 Sept 2026, see note below) per client instruction.
    // Swapped again 8 Sept 2026 (client instruction) to bsackey.png — the
    // same document's smaller passport-style headshot (191×233, positioned
    // later in the doc near what appears to be an embedded-object thumbnail)
    // rather than the larger informal office photo (image7.png) used the
    // day before; client's own choice of the more traditional portrait.
    photo: {
      src: "/images/bsackey.png",
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
    //
    // Brightened 20 Sept 2026 (client instruction: "too dark"). kwaku1.png is
    // a 716×869 backlit phone snapshot whose wall is already blown to white
    // while the face sits at ~91/255 luminance. Next's image optimizer can't
    // apply exposure per image, so this is a ONE-TIME sharp pre-process
    // (modulate brightness ×1.2 → face ~109/255, +20%), saved as a new file;
    // the original is kept untouched for a one-line revert. ×1.3 was tried and
    // rejected — it halos the head edge against the white wall. This is a
    // modest, honest improvement, not a fix: shadow detail can't be recovered
    // from this source, and a replacement photo from the client is the real
    // answer. Same precedent as the Togbenou "-enhanced" file.
    photo: {
      src: "/images/kwaku1-brightened.jpg",
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
  {
    // Added 7 Sept 2026, extracted from "Jihad_El_Zohbi_Profile .pdf"
    // (public/info/ — note the trailing space before the extension in the
    // actual filename). This source is a PDF rather than a docx like the
    // other profile sources here; text was read via native PDF text
    // extraction, and the photo via PyMuPDF (pixel data + its separate soft
    // mask combined into one RGBA image, then flattened onto a white
    // background to match a normal headshot rather than leaving it a
    // transparent cutout) since the embedded image itself is not exposed as
    // a plain extractable file in a PDF the way it is in a docx's zip.
    // "Ing." prefix added 14 Sept 2026 (client instruction) to match the
    // pattern used for every other engineer here (Bempong/Tetteh/Sackey/
    // Boateng) — applied to name, alt text and the bio opening, not just
    // this field.
    name: "Ing. Jihad El Zohbi",
    role: "Project Engineer",
    photo: {
      src: "/images/jihad-el-zohbi.jpg",
      alt: "Portrait of Ing. Jihad El Zohbi, Project Engineer at Maripoma Enterprise Limited",
    },
    initials: "JZ",
    bio: "Ing. Jihad El Zohbi is a project and highway design engineer with more than 20 years of experience across highway, urban road, infrastructure and building projects in the Middle East and Ghana. He holds a Master's in Topographic Engineering from the Lebanese Canadian University and has held design and site engineering roles with contractors including Mouawad–Eddeh, BATCO and Asphalt Hamat in Lebanon. As Project Engineer for Maripoma Enterprise Limited on the Accra–Tema Motorway and Extensions Project, he coordinates road, bridge and interchange design drawings, resolves design interfaces on site and oversees quantity take-off and construction verification for the corridor.",
    credentials: [
      "MSc, Topographic Engineering — Lebanese Canadian University, 2020",
      "More than 20 years of highway design and site engineering experience",
      "Reconstruction and Rehabilitation of Ofankor–Nsawam Road Dual Carriageway (33.4km), Ghana",
      "Rehabilitation of Tanourine el Tahta–Tanourine el Fawka Road, Lebanon",
      "Ground Water Dam in Balaa, Lebanon",
      "Jord Akkar Water Supply System, North Lebanon",
      "Upgrading of Tripoli's Infrastructure, Phase I, Lebanon",
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
