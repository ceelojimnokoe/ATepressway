import { organization, sections, projectFacts } from "./project";
import { mediaRegistry, isRenderable } from "./media";
import { SITE_URL } from "@/lib/site";

/**
 * JSON-LD payloads. Kept as plain data (not JSX) so the rendering
 * concern — a single <script type="application/ld+json"> — lives in one
 * shared component (src/components/seo/json-ld.tsx), not duplicated
 * per page.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.name,
    alternateName: organization.shortName,
    description: organization.description,
    url: SITE_URL,
    // The confirmed ATEL logo from the registry; omitted only if it ever
    // becomes unrenderable, never pointed at an empty src.
    ...(isRenderable(mediaRegistry.logoAtel)
      ? { logo: new URL(mediaRegistry.logoAtel.src, SITE_URL).toString() }
      : {}),
  };
}

/**
 * schema.org has no "Project" type in the standard vocabulary — Place is
 * the closest well-supported fit for a physical road corridor. No `geo`
 * property: we don't have real coordinates, and guessing them would be
 * exactly the kind of invented fact this project doesn't ship.
 *
 * Named "...Corridor", not just "Accra–Tema Motorway" — that plainer
 * name is section S1's own real name (see sections in project.ts), so
 * reusing it for the parent Place would put two different-sized Place
 * entities on the page with an identical name.
 */
export function corridorPlaceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Accra–Tema Motorway Corridor",
    description: `A ${projectFacts.corridorLengthKm}km road corridor across three sections, from Neoplan Junction to Tema Roundabout.`,
    hasPart: sections.map((section) => ({
      "@type": "Place",
      name: section.name,
      description: `${section.road}, ${section.lengthKm}km, ${section.from} to ${section.to}.`,
    })),
  };
}
