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
}

/**
 * Contractual structure per the May 2026 MPR. ATEL's contractual role is
 * Employer — it commissions and oversees the works; it does not build
 * the road. Never describe ATEL as the contractor — see CLAUDE.md.
 *
 * Chain, top to bottom: Employer → Funding Agency → Employer's
 * Representative → Employer's Representative's Agent → EPC Contractor.
 * The relocation specialists sit outside that chain and render visually
 * subordinate to it.
 */
const employer = {
  name: "A.T. Expressway Ltd.",
  role: "Employer",
  gloss: "A.T. Expressway Ltd. is the employer responsible for the delivery framework of the Accra–Tema Motorway and Extensions Project.",
  logo: "logoAtel",
} as const satisfies Stakeholder;

const fundingAgency = {
  name: "Ghana Infrastructure Investment Fund",
  role: "Funding Agency",
  gloss: "The Ghana Infrastructure Investment Fund provides the project's principal infrastructure financing support.",
  logo: "logoGiif",
} as const satisfies Stakeholder;

const employersRepresentative = {
  name: "Ghana Highway Authority",
  role: "Employer's Representative",
  gloss: "The Ghana Highway Authority serves as the employer's representative, providing technical oversight and coordination for the project.",
  logo: "logoGha",
} as const satisfies Stakeholder;

const employersRepAgent = {
  name: "Associated Consultants Limited",
  role: "Employer's Representative's Agent",
  gloss: "Associated Consultants Limited provides engineering consultancy, design review and construction-supervision services for the project.",
  logo: "logoAssociatedConsultants",
} as const satisfies Stakeholder;

const epcContractor = {
  name: "Maripoma Enterprise Limited",
  role: "EPC Contractor",
  gloss: "Maripoma Enterprise Limited is the engineering, procurement and construction contractor delivering the Section 1 works.",
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
 * Website / brand identity. The client distinguishes the public brand
 * ("Accra–Tema Expressway Ltd.") from the Employer legal entity
 * ("A.T. Expressway Ltd.", see stakeholders.employer). Both are ATEL.
 */
export const organization = {
  name: "Accra–Tema Expressway Ltd.",
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
  /** ISO 8601, per the May 2026 MPR. */
  contractAwardDate: "2024-03-21",
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
    road: "N1",
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
    id: "toll-plazas",
    description: "Construction of 8 toll plazas",
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
  // Overall raised to 50% per a Board of Directors update (August 2026) — a
  // separate source from the May 2026 MPR, so it is attributed to the Board,
  // not falsely to the MPR. NOTE: the per-structure workPackages below are
  // unchanged and still cite "MPR May 2026"; they now sit beneath a higher
  // overall from a different, later source. Left as-is pending confirmation
  // of refreshed per-structure figures — do not back-derive them.
  overallPercentComplete: 50,
  asOf: "August 2026",
  signOffSource: "Board of Directors update, August 2026",
  reportSeries: "Monthly Progress Report",
  sections: placeholder<readonly SectionProgress[]>("Per-section progress percentages", []),
  workPackages: [
    {
      id: "tetteh-quarshie",
      name: "Tetteh Quarshie Interchange",
      percentComplete: 88,
      source: MPR_MAY_2026,
    },
    {
      id: "teshie-link",
      name: "Teshie Link Interchange",
      percentComplete: 74.5,
      source: MPR_MAY_2026,
    },
    {
      id: "community-18",
      name: "Community 18 Interchange",
      percentComplete: 67.5,
      source: MPR_MAY_2026,
    },
    {
      id: "lashibi",
      name: "Lashibi Interchange",
      percentComplete: 30,
      source: MPR_MAY_2026,
    },
    {
      id: "footbridges",
      name: "Pedestrian footbridges",
      percentComplete: 31.5,
      unitsComplete: 3.15,
      unitsTotal: 10,
      source: MPR_MAY_2026,
    },
    {
      id: "box-culverts",
      name: "Box culverts",
      percentComplete: 64.25,
      unitsComplete: 12.85,
      unitsTotal: 20,
      source: MPR_MAY_2026,
    },
    {
      id: "bridge-culverts",
      name: "Bridge culverts",
      percentComplete: 40,
      unitsComplete: 1.2,
      unitsTotal: 3,
      source: MPR_MAY_2026,
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

export interface MonthlyUpdate {
  /** Reporting month, e.g. "May 2026". */
  readonly month: string;
  readonly completed: readonly string[];
  readonly planned: readonly string[];
  /** Overall physical progress reported that month. */
  readonly overallPct: number;
}

export const monthlyUpdates: readonly MonthlyUpdate[] = [
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

export interface ContactSocial {
  readonly twitter: string | Placeholder<string>;
  readonly facebook: string | Placeholder<string>;
  readonly instagram: string | Placeholder<string>;
  readonly linkedin: string | Placeholder<string>;
}

export interface Contact {
  readonly email: string | Placeholder<string>;
  readonly phone: string | Placeholder<string>;
  readonly address: string | Placeholder<string>;
  readonly social: ContactSocial;
}

// Real, client-confirmed contact details (August 2026). The address is
// textual contact information only: the /contact map continues to show the
// project corridor, not an office pin. Social handles remain placeholders
// until supplied.
export const contact: Contact = {
  email: "info@atexpressway.com",
  phone: "0332092401",
  address: "157 Yantabri Road, Labone, Accra, Ghana",
  social: {
    twitter: placeholder<string>("X / Twitter handle", ""),
    facebook: placeholder<string>("Facebook handle", ""),
    instagram: placeholder<string>("Instagram handle", ""),
    linkedin: placeholder<string>("LinkedIn handle", ""),
  },
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

/**
 * Only the two confirmed professionals. Ing. Kwabena Bempong has no
 * supplied photograph, so his card renders an initials avatar rather than
 * an invented portrait.
 */
export const team: readonly TeamMember[] = [
  {
    name: "Ing. Kwabena Bempong",
    title: "Chief Resident Engineer",
    photo: null,
    initials: "KB",
    bio: "Ing. Kwabena Bempong is a civil and road engineer with more than 30 years of design and construction-supervision experience. He holds an MSc with honours in Road and Pavement Engineering and is Chief Executive Officer of Associated Consultants Limited. His major assignments include the Pokuase Interchange, the Ofankor–Nsawam Road, the Ashaiman–Akosombo dual carriageway and the Accra–Tema Motorway expansion project, where he serves as Chief Resident Engineer.",
    credentials: [
      "MSc, Road and Pavement Engineering",
      "Chief Executive Officer, Associated Consultants Limited",
      "Immediate Past President, Ghana Institution of Engineering",
      "President, Ghana Consulting Engineers Association",
      "More than 30 years of engineering experience",
    ],
  },
  {
    name: "Koffi Togbenou",
    title: "Resident Engineer — Bridges and Structures",
    photo: {
      src: "/images/koffitogbenou.png",
      alt: "Portrait of Koffi Togbenou, Resident Engineer for bridges and structures",
    },
    initials: "KT",
    bio: "Koffi Togbenou is a structural engineer with approximately eight years of experience in bridge design, analysis and construction supervision. As Resident Engineer for bridges on the Accra–Tema Motorway and Extensions Project, he oversees bridge, interchange and associated structural works, with a strong focus on technical compliance, quality control and site execution.",
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
 * Mirrors {@link TeamMember} so the board renders through the same card
 * layout as the project team. The identity fields are Placeholders rather
 * than plain strings: nothing here is confirmed, so a naive render can't
 * ship an invented name or title.
 */
export interface BoardMember {
  readonly name: string | Placeholder<string>;
  readonly title: string | Placeholder<string>;
  /** Supplied portrait, or null to fall back to an initials avatar. */
  readonly photo: ImageAsset | null;
  readonly initials: string;
  readonly bio: string | Placeholder<string>;
  readonly credentials: readonly string[];
}

/**
 * ⚠ PLACEHOLDER SEATS — the five board portraits are real, client-supplied
 * files, but no name, position or biography has been confirmed. Every
 * identity field is wrapped in placeholder() so the cards render an
 * explicit "to be confirmed" state and the layout is reserved. Filling
 * these in once the client approves is a content-only change: swap each
 * placeholder() for the confirmed string, nothing else moves.
 *
 * The photo `src` values use the exact on-disk filenames (note the
 * uppercase .JPEG on board-member2) so they resolve on case-sensitive hosts.
 */
function boardSeat(seatNumber: number, photoSrc: string): BoardMember {
  const seat = String(seatNumber).padStart(2, "0");
  return {
    name: placeholder<string>(`Board member ${seat} — full name`, `Board Member ${seat}`),
    title: placeholder<string>(`Board member ${seat} — position`, "Position to be confirmed"),
    photo: { src: photoSrc, alt: "Board member portrait — profile to be confirmed" },
    initials: seat,
    bio: placeholder<string>(
      `Board member ${seat} — profile`,
      "Official board member profile information will be added following stakeholder approval.",
    ),
    credentials: [],
  };
}

export const boardMembers: readonly BoardMember[] = [
  boardSeat(1, "/images/board-member1.jpeg"),
  boardSeat(2, "/images/board-member2.JPEG"),
  boardSeat(3, "/images/board-member3.jpeg"),
  boardSeat(4, "/images/board-member4.jpeg"),
  boardSeat(5, "/images/board-member5.jpeg"),
];

// ---------------------------------------------------------------------------
// Media slots — which asset renders where. The catalogue of real files on
// disk lives in ./media.ts (the registry); these slots stay placeholder
// until an asset is confirmed for each position.
// ---------------------------------------------------------------------------

export interface SectionPhotographs {
  readonly s1: ImageAsset | Placeholder<ImageAsset>;
  readonly s2: ImageAsset | Placeholder<ImageAsset>;
  readonly s3: ImageAsset | Placeholder<ImageAsset>;
}

export interface Media {
  readonly logo: ImageAsset | Placeholder<ImageAsset>;
  readonly heroPhotograph: ImageAsset | Placeholder<ImageAsset>;
  readonly sectionPhotographs: SectionPhotographs;
}

export const media: Media = {
  logo: placeholder<ImageAsset>("ATEL logo", {
    src: "",
    alt: "ATEL logo — to be confirmed",
  }),
  heroPhotograph: placeholder<ImageAsset>("Hero photography", {
    src: "",
    alt: "Project photography — to be confirmed",
  }),
  sectionPhotographs: {
    s1: placeholder<ImageAsset>("S1 section photography", {
      src: "",
      alt: "S1 — Accra–Tema Motorway photography — to be confirmed",
    }),
    s2: placeholder<ImageAsset>("S2 section photography", {
      src: "",
      alt: "S2 — George Bush Highway photography — to be confirmed",
    }),
    s3: placeholder<ImageAsset>("S3 section photography", {
      src: "",
      alt: "S3 — Nsawam Road photography — to be confirmed",
    }),
  },
};

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

export const latestBulletin: Bulletin | undefined = bulletins[0];

// ---------------------------------------------------------------------------
// Aggregate export
// ---------------------------------------------------------------------------

export const project = {
  organization,
  statementOfIntent,
  stakeholders,
  stakeholderChain,
  specialistContractors,
  projectFacts,
  scopeOfWorks,
  bulletins,
  laneConfiguration,
  reconstructionRationale,
  sections,
  interchanges,
  progress,
  monthlyUpdates,
  contact,
  team,
  media,
} as const;
