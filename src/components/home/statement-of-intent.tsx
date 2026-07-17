import { statementOfIntent } from "@/content/project";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/**
 * The one serif moment on the entire site. The copy is wired behind the
 * approval flag in src/content/project.ts — until ATEL signs off it
 * renders as a "to be confirmed" slot, not the proposed line. Flip
 * STATEMENT_OF_INTENT_APPROVED there to activate it.
 */
export function StatementOfIntent() {
  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-8 sm:py-24">
        <PlaceholderNotice value={statementOfIntent} size="display">
          {(value) => (
            <p className="max-w-3xl font-serif text-heading-3 text-balance text-ink-1">{value}</p>
          )}
        </PlaceholderNotice>
      </ViewportReveal>
    </section>
  );
}
