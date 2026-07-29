"use client";

import { useEffect, useRef, useState } from "react";
import { galleryCategories } from "@/content/gallery";
import { cn } from "@/lib/cn";

const FILTERS = [
  { id: "all", label: "All" },
  ...galleryCategories.map((category) => ({ id: category.id, label: category.label })),
] as const;

const VALID = new Set<string>(FILTERS.map((filter) => filter.id));

/**
 * Client-side category filter — a progressive enhancement over a fully
 * server-rendered, STATIC grid. It does not fetch or re-render anything on
 * the server (no ?category= navigation, so the route prerenders at build
 * time like every other page). Instead it writes the chosen category to a
 * `data-gallery-filter` attribute on the nearest ancestor scope, and CSS
 * (see globals.css) hides the tiles that don't match.
 *
 * Because the grid is NOT a child of this component, if this ever fails to
 * hydrate the grid stays fully visible with every tile shown — the images
 * never depend on client code to appear. The default ("all") matches no
 * hide rule, so with JS off every tile is shown too.
 */
export function GalleryFilter({ initial = "all" }: { readonly initial?: string }) {
  const [active, setActive] = useState<string>(initial);
  const ref = useRef<HTMLDivElement>(null);

  // Reflect the active category onto the scope so CSS can filter the tiles.
  useEffect(() => {
    const scope = ref.current?.closest<HTMLElement>("[data-gallery-filter]");
    if (scope) scope.setAttribute("data-gallery-filter", active);
  }, [active]);

  // Deep-link support without a server round-trip: honour ?category= on mount.
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category && VALID.has(category)) setActive(category);
  }, []);

  function select(id: string) {
    setActive(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
  }

  return (
    <div ref={ref} role="group" aria-label="Filter gallery by category" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.id === active;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => select(filter.id)}
            className={cn(
              "border px-3 py-1.5 text-caption uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
              isActive ? "border-accent bg-lime text-void" : "border-hairline text-fg-muted hover:text-fg",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
