/**
 * "About Us" content, taken from the client's own document
 * ("ATEL Website Text Corrections - Updated -12-05-25.docx"). Wording is the
 * client's; only punctuation and capitalisation have been normalised.
 *
 * As with every other fact on this site, anything the client has NOT supplied
 * stays a placeholder rather than being invented — see `otherProjects` below.
 */

import { placeholder, type Placeholder } from "./placeholder";

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

export const investmentHighlights: readonly Highlight[] = [
  {
    title: "Government-backed funding support",
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

export const whyAtel: readonly Highlight[] = [
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
];

export const internalStrengths: readonly string[] = [
  "Ghanaian expertise and capacity building",
  "Public–private partnership for sustainable development",
  "Innovation and modern engineering standards",
  "Commitment to safety and efficiency",
  "Future-ready infrastructure",
];

/**
 * ATEL's work beyond the Accra–Tema corridor.
 *
 * The client's source document states the INTENT — "building capacity within
 * Ghana to execute similar projects independently in the future" and
 * "establishing the foundation for a pipeline of future infrastructure projects
 * across the region" — but names no specific other project. Naming one here
 * would be inventing a fact, so this stays a placeholder until ATEL supplies
 * the detail. The page renders the confirmed intent and an explicit
 * "to be confirmed" state for the pipeline itself.
 */
export const beyondTheCorridor = {
  intent:
    "ATEL is more than a single road. The company is a vehicle for building Ghanaian institutional capability — keeping capital, expertise and long-term value within Ghana’s economy, and establishing the foundation for a pipeline of future infrastructure projects across the region.",
  otherProjects: placeholder<readonly string[]>(
    "Other ATEL projects beyond the Accra–Tema corridor (names, scope, status)",
    [],
  ) as Placeholder<readonly string[]>,
} as const;
