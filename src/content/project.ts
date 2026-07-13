/**
 * Single source of truth for site copy and data. Components must import
 * from here — no hardcoded strings or numbers. See CLAUDE.md.
 *
 * Facts the client has not yet supplied are wrapped in `placeholder()`
 * (see ./placeholder.ts) rather than invented or left blank, so a naive
 * `{value}` render can't silently ship a made-up fact. Consuming
 * components must call `isPlaceholder()` and render an explicit
 * "to be confirmed" state.
 */

import { placeholder, type Placeholder } from "./placeholder";

export { isPlaceholder, type Placeholder } from "./placeholder";

// ---------------------------------------------------------------------------
// Organization & stakeholders
// ---------------------------------------------------------------------------

export interface Stakeholder {
  readonly name: string;
  readonly role: string;
}

/**
 * ATEL is the project company / client. It does not build the road.
 * Never describe ATEL as the contractor — see CLAUDE.md.
 */
export const stakeholders = {
  client: {
    name: "Accra–Tema Motorway Expressway Limited",
    role: "Project company / client",
  },
  contractor: {
    name: "Maripoma Enterprise Ltd",
    role: "EPC Contractor",
  },
  designSupervision: {
    name: "Associated Consultants Ltd",
    role: "Design Review & Construction Supervision",
  },
  electricalRelocation: {
    name: "Limmark Energy Solutions Ltd",
    role: "Electrical Relocation",
  },
  waterRelocation: {
    name: "Dakal Construction Works Ltd",
    role: "Water Relocation",
  },
  financier: {
    name: "GIIF",
    role: "Financing",
  },
} as const satisfies Record<string, Stakeholder>;

export const organization = {
  name: "Accra–Tema Motorway Expressway Limited",
  shortName: "ATEL",
  description:
    "ATEL is the project company responsible for the reconstruction of the Accra–Tema Motorway corridor. ATEL commissions and oversees the works; it does not build the road.",
} as const;

/**
 * The single serif statement of intent, used exactly once sitewide (Hero).
 * Editorial copy to be drafted and approved — not a withheld fact, but it
 * still can't render until real copy exists.
 */
export const statementOfIntent: string | Placeholder<string> = placeholder<string>(
  "Statement of intent (one sentence, set in --font-serif, used once sitewide)",
  "",
);

// ---------------------------------------------------------------------------
// Verified project facts — do not alter without client sign-off
// ---------------------------------------------------------------------------

export const projectFacts = {
  investmentUSD: 340_000_000,
  investmentDisplay: "≈US$340M",
  corridorLengthKm: 27.7,
  openedYear: 1964,
  openedUnder: "Kwame Nkrumah",
  reconstructionStartYear: 2024,
  constructionWindowMonths: 36,
  interchangeCount: 5,
  pedestrianFootbridges: 14,
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

export interface Interchange {
  readonly name: string;
  readonly position: InterchangePosition | Placeholder<InterchangePosition>;
}

// Dummy, non-indicative fallback — never render position.fallback as a
// real chainage. See isPlaceholder() / Placeholder<T> above.
const UNCONFIRMED_POSITION: InterchangePosition = { sectionId: "s1", offsetKm: 0 };

export const interchanges: readonly Interchange[] = [
  {
    name: "Teshie Link",
    position: placeholder<InterchangePosition>(
      "Teshie Link position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    name: "Community 18",
    position: placeholder<InterchangePosition>(
      "Community 18 position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    name: "Lashibi",
    position: placeholder<InterchangePosition>(
      "Lashibi position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    name: "Fiesta Royale",
    position: placeholder<InterchangePosition>(
      "Fiesta Royale position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
  {
    name: "Neoplan",
    position: placeholder<InterchangePosition>(
      "Neoplan position along corridor",
      UNCONFIRMED_POSITION,
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Progress — figures arrive weekly by email; sign-off source is required
// before a percentage can render as fact.
// ---------------------------------------------------------------------------

export interface SectionProgress {
  readonly sectionId: ProjectSection["id"];
  readonly percentComplete: number;
}

/**
 * Generic on purpose: whether the client's "five work packages" turn out
 * to be the five interchanges or a separate contract-package breakdown is
 * still unconfirmed. This shape doesn't presuppose either answer.
 */
export interface WorkPackageProgress {
  readonly id: string;
  readonly name: string;
  readonly percentComplete: number;
}

export interface Progress {
  readonly overallPercentComplete: number | Placeholder<number>;
  readonly asOf: string | Placeholder<string>;
  readonly signOffSource: string | Placeholder<string>;
  readonly sections: readonly SectionProgress[] | Placeholder<readonly SectionProgress[]>;
  readonly workPackages:
    | readonly WorkPackageProgress[]
    | Placeholder<readonly WorkPackageProgress[]>;
}

export const progress: Progress = {
  overallPercentComplete: placeholder<number>("Overall progress percentage", 0),
  asOf: placeholder<string>("Progress as-of date", ""),
  signOffSource: placeholder<string>(
    "Verified-by / sign-off source for progress percentages",
    "",
  ),
  sections: placeholder<readonly SectionProgress[]>("Per-section progress percentages", []),
  workPackages: placeholder<readonly WorkPackageProgress[]>(
    "Work package breakdown & progress — 5 packages per client; breakdown (interchanges vs. contract packages) not yet defined",
    [],
  ),
};

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
  readonly hotline: string | Placeholder<string>;
  readonly address: string | Placeholder<string>;
  readonly social: ContactSocial;
}

export const contact: Contact = {
  email: placeholder<string>("Public contact email", ""),
  hotline: placeholder<string>("Public hotline number", ""),
  address: placeholder<string>("Registered / office address", ""),
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
  readonly photo: ImageAsset;
}

export const team: readonly TeamMember[] | Placeholder<readonly TeamMember[]> = placeholder<
  readonly TeamMember[]
>("Leadership team roster (names, titles, photos)", []);

// ---------------------------------------------------------------------------
// Media
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
  projectFacts,
  bulletins,
  laneConfiguration,
  reconstructionRationale,
  sections,
  interchanges,
  progress,
  contact,
  team,
  media,
} as const;
