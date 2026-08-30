/**
 * One entry per public route. Title, description, sitemap, and canonical
 * URLs all read from here — a page's SEO identity is edited in one place,
 * not scattered across page.tsx files. /styleguide is deliberately absent
 * (internal tool, noindex, not part of the public route set).
 */

export interface RouteMeta {
  readonly path: string;
  readonly title: string;
  readonly description: string;
}

/**
 * SEO brand string. Matches `organization.name` (the single confirmed name
 * form, client 2026-08-28/30) — was stale at "Accra–Tema Expressway Ltd."
 * until this fix, which had been silently leaking into every page's <title>.
 * The content-template row for the Contact page literally asked for the
 * spelled-out "A.T. Expressway Limited" for that one page only; using a
 * second brand string for a single page would reintroduce the inconsistency
 * this rename was meant to remove, so the same BRAND is used everywhere
 * instead. Flagged in the delivery report.
 */
export const BRAND = "A.T. Expressway Ltd.";

export const routes = {
  home: {
    path: "/",
    title: `${BRAND} | Motorway and Extensions Project`,
    description:
      "Official project information, design highlights and construction progress for the Accra–Tema Motorway and Extensions Project.",
  },
  about: {
    path: "/about",
    title: `About Us — ${BRAND}`,
    description:
      "A.T. Expressway Ltd. (ATEL) is the concessionaire delivering the Accra–Tema Motorway & Extensions PPP Project — Ghana’s first road public–private partnership.",
  },
  project: {
    path: "/project",
    title: `The Project — ${BRAND}`,
    description:
      "Scope and engineering rationale for the Accra–Tema Motorway and Extensions Project: the 27.7 km design corridor, the 19.5 km Section 1 under construction, and why the corridor is being rebuilt.",
  },
  design: {
    path: "/design",
    title: `Design & Infrastructure — ${BRAND}`,
    description:
      "Design highlights for the Accra–Tema Motorway and Extensions Project: interchanges, footbridges, toll plazas and drainage. Proposed design visualisations; final construction details may be refined.",
  },
  progress: {
    path: "/progress",
    title: `Construction Progress — ${BRAND}`,
    description:
      "Verified construction progress for the Accra–Tema Motorway and Extensions Project, drawn from the May 2026 monthly progress report: overall status, interchanges, works in progress and recent activity.",
  },
  gallery: {
    path: "/gallery",
    title: `Gallery — ${BRAND}`,
    description:
      "Construction and design gallery for the Accra–Tema Motorway and Extensions Project — interchanges, bridges, drainage, earthworks, proposed designs and corridor views.",
  },
  stakeholders: {
    path: "/stakeholders",
    title: `Project Stakeholders — ${BRAND}`,
    description:
      "The delivery structure for the Accra–Tema Motorway and Extensions Project — Employer, funding agency, Employer's Representative, Employer's Representative's Agent and EPC contractor.",
  },
  faq: {
    path: "/faq",
    title: `FAQ — ${BRAND}`,
    description:
      "Answers to common questions about the Accra–Tema Motorway and Extensions Project — the corridor, the works, funding, tolling and the delivery chain, drawn from the project record.",
  },
  contact: {
    path: "/contact",
    title: `Contact — ${BRAND}`,
    description: "Contact Accra–Tema Expressway Ltd. about the Accra–Tema Motorway and Extensions Project.",
  },
} as const satisfies Record<string, RouteMeta>;
