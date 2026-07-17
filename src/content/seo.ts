import { organization } from "./project";

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

export const routes = {
  home: {
    path: "/",
    title: organization.name,
    description: organization.description,
  },
  project: {
    path: "/project",
    title: `Project — ${organization.name}`,
    description:
      "Scope and engineering rationale for the Accra–Tema Motorway reconstruction: three sections, new and rebuilt interchanges, and why a corridor opened in 1964 needs rebuilding.",
  },
  design: {
    path: "/design",
    title: `Design & Infrastructure — ${organization.name}`,
    description:
      "Design and infrastructure for the Accra–Tema Motorway reconstruction: road cross-sections, interchange visualisations, footbridges, toll plazas, and drainage. Proposed design visualisations — final construction may vary.",
  },
  progress: {
    path: "/progress",
    title: `Progress — ${organization.name}`,
    description:
      "Construction status for the Accra–Tema Motorway reconstruction: overall completion, work packages, milestones, and bulletins, updated as figures are confirmed.",
  },
  gallery: {
    path: "/gallery",
    title: `Gallery — ${organization.name}`,
    description:
      "Construction gallery for the Accra–Tema Motorway reconstruction — interchanges, bridges and structures, footbridges, drainage and culverts, earthworks, and aerial views.",
  },
  stakeholders: {
    path: "/stakeholders",
    title: `Stakeholders — ${organization.name}`,
    description:
      "The delivery structure for the Accra–Tema Motorway reconstruction — Employer, funding agency, Employer's Representative, EPC contractor, and specialist relocation contractors.",
  },
  contact: {
    path: "/contact",
    title: `Contact — ${organization.name}`,
    description: "Contact ATEL about the Accra–Tema Motorway reconstruction — enquiry form and contact details.",
  },
} as const satisfies Record<string, RouteMeta>;
