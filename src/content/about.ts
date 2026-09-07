/**
 * "About Us" content, taken from the client's own document
 * ("ATEL Website Text Corrections - Updated -12-05-25.docx"). Wording is the
 * client's; only punctuation and capitalisation have been normalised.
 */

export const aboutIntro = {
  eyebrow: "Accra–Tema Motorway & Extensions PPP Project",
  // "toll road" added 3 Sept 2026 (client instruction) — this is one of
  // several "Ghana's first road public–private partnership" occurrences
  // site-wide; the others are pending confirmation (see report).
  headline: "Ghana’s first toll road public–private partnership",
  paragraphs: [
    "The Accra–Tema Motorway dual carriageway links Accra and the industrial city of Tema, where Ghana’s main port is located. It was opened as a freeway in 1964 under Ghana’s first president, Kwame Nkrumah. The design life of the motorway was intended for 20 years, and the pavement has outlived its terminal level of serviceability with visible fatigue-cracking, joint failures and pumping under wheel load — and requires reconstruction.",
    "The project scope covers 27.7 km and involves an upgrade of the national road network in the Greater Accra Region, together with the operation and maintenance of the road, including a toll road system on certain sections. The Project will be delivered in two phases, ensuring timely delivery and efficiency, providing solutions to address the challenges with the freeway.",
  ],
} as const;

export const visionMission = [
  {
    id: "vision",
    title: "Our vision",
    body: "To establish Ghana as a leader in world-class road infrastructure development using local expertise and sustainable models.",
  },
  {
    id: "mission",
    title: "Our mission",
    body: "To design, construct, and operate high-quality roads while maximising local participation and long-term economic benefits for Ghana.",
  },
  {
    id: "commitment",
    title: "Our commitment",
    body: "At ATEL, we are dedicated to developing world-class infrastructure that drives Ghana’s economic growth and strengthens local expertise. Through the Accra–Tema Motorway & Extensions PPP Project, we are not only enhancing transportation networks but also building capacity within Ghana to execute similar projects independently in the future.",
  },
] as const;

export const approach = {
  title: "Our approach",
  lead: "A.T. Expressway Ltd. (ATEL) is a strategic infrastructure investment vehicle established by the Ghana Infrastructure Investment Fund (GIIF) to deliver the Accra–Tema Motorway & Extensions PPP Project.",
  paragraphs: [
    "This sovereign-backed infrastructure development connects Ghana’s capital city with its industrial hub and largest port, creating an essential economic corridor with predictable revenue streams and robust growth potential.",
    "This landmark project is a testament to Ghana’s commitment to modern, sustainable, and high-quality road infrastructure, ensuring seamless connectivity, economic growth, and enhanced trade across the West African region. With Ghanaian ownership at its core, ATEL is not just building roads — we are building local expertise, capacity, and opportunities.",
  ],
} as const;

export interface Highlight {
  readonly title: string;
  readonly body: string;
}

/**
 * "Why ATMP" — merged 7 Sept 2026 (client instruction) from the two
 * previously separate sections "Why ATEL" (4 items) and "Investment
 * highlights" (6 items), which now render as one flat 10-item grid under one
 * heading. Order preserved: the former "Why ATEL" items first, then the
 * former "Investment highlights" items — no other wording changed.
 */
export const whyAtmp: readonly Highlight[] = [
  {
    title: "Local expertise and ownership",
    body: "Ensuring maximum Ghanaian participation in construction and operations.",
  },
  {
    title: "Long-term economic benefits",
    body: "Revenue generation and capacity building for future projects.",
  },
  {
    title: "Sustainable and modern infrastructure",
    body: "Designed for durability, efficiency, and international standards.",
  },
  {
    title: "Reduced congestion and improved safety",
    body: "Minimising travel times and enhancing road user experience.",
  },
  {
    // Title changed from "Government-backed funding support" (client
    // instruction, 7 Sept 2026, verbatim except correcting "Signifcant" to
    // "Significant"). FLAGGED in the delivery report: "Seed" reads as an
    // incomplete phrase on its own — it normally takes a following noun
    // ("seed funding", "seed capital", "seed investment") — applied exactly
    // as instructed rather than silently completing it; the body text below
    // is unchanged and still describes the underlying funding structure.
    title: "Significant Government Seed",
    body: "Structured as a public–private partnership with initial funding support from Government.",
  },
  {
    title: "Inflation-protected returns",
    body: "Long-term concession agreement with built-in tariff adjustment mechanisms.",
  },
  {
    title: "Strategic economic asset",
    body: "Critical infrastructure connecting Ghana’s key commercial and industrial zones.",
  },
  {
    title: "Exponential growth corridor",
    body: "Serving a rapidly expanding urban population and trade environment.",
  },
  {
    title: "ESG-aligned development",
    body: "Incorporating sustainable design, local economic empowerment, and governance best practices.",
  },
  {
    title: "First-mover advantage",
    body: "Pioneering investment in West Africa’s fastest-growing infrastructure market.",
  },
];

export const internalStrengths: readonly string[] = [
  "Ghanaian expertise and capacity building",
  "Public–private partnership for sustainable development",
  "Innovation and modern engineering standards",
  "Commitment to safety and efficiency",
  "Future-ready infrastructure",
];

// The "Beyond the Accra–Tema corridor" section (and this content backing it)
// was removed outright 7 Sept 2026 (client instruction) — not hidden like
// visionMission above, fully deleted. If this content is wanted again later,
// see git history for the last version (intent paragraph + a placeholder()
// for the unconfirmed other-projects pipeline).
