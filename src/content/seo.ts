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
  /**
   * True for a route that must not be publicly discoverable yet — provisional
   * copy awaiting client sign-off, and/or deliberately hidden pending launch
   * approval (currently both, for /investment — pre-launch review Stage 0,
   * 22 Sept 2026). A draft route is left OUT of the sitemap (app/sitemap.ts)
   * and gets `noindex, nofollow` (lib/page-metadata.ts) — but the route
   * itself, its page and its content are untouched and still reachable by
   * direct URL. This flag does NOT remove nav links by itself; that's done
   * separately in content/navigation.ts (see its header comment for
   * /investment specifically). Remove the flag once the client approves the
   * page and it is re-linked in the nav.
   */
  readonly draft?: boolean;
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
    // "toll road" added 4 Sept 2026 (client instruction).
    description:
      "A.T. Expressway Ltd. (ATEL) is the concessionaire delivering the Accra–Tema Motorway & Extensions PPP Project — Ghana’s first toll road public–private partnership.",
  },
  // Added 20 Sept 2026 (client instruction). Route is /investment (short,
  // matches the "Investment Info" nav label, no trailing "-info" noise).
  // `draft: true` — see the doc comment on RouteMeta.draft just above, and
  // the fuller explanation in src/app/(site)/investment/page.tsx and
  // src/content/navigation.ts. Two independent reasons right now: the copy
  // isn't approved, AND the page is being held out of the public site until
  // launch even once it is — check investmentContent.status in
  // content/investment.ts before assuming this flag is safe to remove.
  investment: {
    path: "/investment",
    title: `Investment Info — ${BRAND}`,
    description:
      "Background on the Accra–Tema Motorway & Extensions PPP Project for parties reviewing it as an investment opportunity, and a way to register interest in receiving project and investment information.",
    draft: true,
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
    // "toll plazas" removed 4 Sept 2026 (client instruction) — matches the
    // toll plaza design section being hidden from the Design page itself.
    description:
      "Design highlights for the Accra–Tema Motorway and Extensions Project: interchanges, footbridges and drainage. Proposed design visualisations; final construction details may be refined.",
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
