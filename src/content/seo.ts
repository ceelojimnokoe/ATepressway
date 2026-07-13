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
      "Scope and engineering rationale for the Accra–Tema Motorway reconstruction: three sections, five interchanges, and why a corridor opened in 1964 needs rebuilding.",
  },
  progress: {
    path: "/progress",
    title: `Progress — ${organization.name}`,
    description:
      "Construction status for the Accra–Tema Motorway reconstruction: overall completion, work packages, milestones, and bulletins, updated as figures are confirmed.",
  },
  partners: {
    path: "/partners",
    title: `Partners — ${organization.name}`,
    description:
      "ATEL and the delivery ecosystem for the Accra–Tema Motorway reconstruction — contractor, design supervision, utility relocation, and financing partners.",
  },
  contact: {
    path: "/contact",
    title: `Contact — ${organization.name}`,
    description: "Contact ATEL about the Accra–Tema Motorway reconstruction — enquiry form and contact details.",
  },
} as const satisfies Record<string, RouteMeta>;
