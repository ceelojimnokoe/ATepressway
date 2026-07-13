import { bulletins } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/**
 * "No bulletins published yet" (zero entries) and "to be confirmed" (an
 * unresolved fact) are different claims — this only ever renders the
 * former, since bulletins is a real array, never a placeholder. See
 * project.ts.
 */
export function BulletinFeed() {
  const newestFirst = [...bulletins].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section>
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Bulletins</h2>

        {newestFirst.length === 0 ? (
          <p className="text-small text-ink-2">No bulletins published yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-rule border-t border-b border-rule">
            {newestFirst.map((bulletin) => (
              <li key={bulletin.href} className="flex flex-col gap-2 py-6">
                <span className="text-caption text-ink-3 tracking-wide uppercase">{bulletin.date}</span>
                <p className="text-body text-ink-1">{bulletin.headline}</p>
                <p className="text-small text-ink-2">{bulletin.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </ViewportReveal>
    </section>
  );
}
