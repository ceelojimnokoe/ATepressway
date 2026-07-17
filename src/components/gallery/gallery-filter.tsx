"use client";

import { useRouter } from "next/navigation";
import { galleryCategories } from "@/content/gallery";
import { cn } from "@/lib/cn";

const FILTERS = [
  { id: "all", label: "All" },
  ...galleryCategories.map((category) => ({ id: category.id, label: category.label })),
] as const;

/**
 * The one interactive leaf of the gallery. It doesn't hold the filtered
 * list — it just writes the choice to the URL (?category=…), and the
 * server re-renders the grid for that category. `active` is passed down
 * from the server so the pressed state always matches what's rendered.
 * `scroll: false` keeps the viewport put while switching filters.
 */
export function GalleryFilter({ active }: { readonly active: string }) {
  const router = useRouter();

  function select(id: string) {
    router.push(id === "all" ? "/gallery" : `/gallery?category=${id}`, { scroll: false });
  }

  return (
    <div role="group" aria-label="Filter gallery by category" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.id === active;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => select(filter.id)}
            className={cn(
              "border px-3 py-1.5 text-caption uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime",
              isActive ? "border-lime bg-lime text-void" : "border-rule text-ink-2 hover:text-ink-1",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
