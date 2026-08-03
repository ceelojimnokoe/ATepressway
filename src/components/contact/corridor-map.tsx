/**
 * OpenStreetMap's own embed — free, no API key, no tracking, and licensed
 * for this use with the attribution the embed itself renders. It frames the
 * Accra–Tema corridor, NOT an office: the project has no physical office
 * address, so this map shows WHERE THE WORKS ARE. A "Project location" badge
 * on the map, the heading and the caption all make that unambiguous, so it
 * can never be mistaken for an office pin.
 *
 * Requires `frame-src https://www.openstreetmap.org` in the CSP
 * (next.config.ts) — the default policy is otherwise 'self' only.
 */
const CORRIDOR_BBOX = "-0.2000,5.5750,0.0300,5.7000";
const OSM_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(CORRIDOR_BBOX)}&layer=mapnik`;
const OSM_VIEW = "https://www.openstreetmap.org/#map=12/5.6400/-0.0850";

export function CorridorMap() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-heading-4 text-fg">Where the works are</h2>

      <figure className="flex flex-col gap-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-hairline bg-surface-sunk">
          <span className="pointer-events-none absolute top-3 left-3 z-10 border border-hairline bg-surface-raised px-2.5 py-1 text-caption tracking-wide text-fg uppercase">
            Project location
          </span>
          <iframe
            src={OSM_EMBED}
            title="Map of the Accra–Tema corridor on OpenStreetMap"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <figcaption className="flex flex-col gap-1 text-caption text-fg-faint">
          <span>
            The Accra–Tema corridor between Tetteh Quarshie and Tema — where the construction work is
            taking place. This map shows the project location, not an office.
          </span>
          <span>
            Map data ©{" "}
            <a
              href={OSM_VIEW}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              OpenStreetMap
            </a>{" "}
            contributors.
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
