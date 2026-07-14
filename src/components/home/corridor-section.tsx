import { Corridor } from "@/components/corridor/Corridor";

/** Full-bleed, unlike every other section — the corridor gets the width. */
export function CorridorSection() {
  return (
    <section className="border-b border-rule bg-raised">
      <div className="w-full px-4 py-16 sm:px-8">
        <h2 className="mx-auto mb-6 w-full max-w-5xl text-heading-4 text-ink-1">The corridor</h2>
        <Corridor variant="full" />
      </div>
    </section>
  );
}
