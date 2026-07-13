import Link from "next/link";
import { latestBulletin } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

export function LatestBulletin() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Latest bulletin</h2>

        {latestBulletin ? (
          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">{latestBulletin.date}</span>
            <p className="text-body text-ink-1">{latestBulletin.headline}</p>
            <p className="text-small text-ink-2">{latestBulletin.summary}</p>
          </div>
        ) : (
          // Not a placeholder — an empty bulletin list is a genuine
          // current state, not a withheld fact. See src/content/project.ts.
          <p className="text-small text-ink-2">No bulletins published yet.</p>
        )}

        <Link href="/progress" className="text-small text-ink-1 underline underline-offset-4">
          View progress updates →
        </Link>
      </ViewportReveal>
    </section>
  );
}
