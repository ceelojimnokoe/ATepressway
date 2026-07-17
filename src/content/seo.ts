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

/** SEO brand string, per the client (2026-07-17): the abbreviated "Ltd." form. */
export const BRAND = "Accra–Tema Expressway Ltd.";

export const routes = {
  home: {
    path: "/",
    title: `${BRAND} | Motorway and Extensions Project`,
    description:
      "Official project information, design highlights and construction progress for the Accra–Tema Motorway and Extensions Project.",
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
  contact: {
    path: "/contact",
    title: `Contact — ${BRAND}`,
    description: "Contact Accra–Tema Expressway Ltd. about the Accra–Tema Motorway and Extensions Project.",
  },
} as const satisfies Record<string, RouteMeta>;
