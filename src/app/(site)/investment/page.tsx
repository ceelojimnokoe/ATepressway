import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { InvestmentInterestForm } from "@/components/investment/investment-interest-form";
import { investmentContent, investmentForm } from "@/content/investment";
import { getMailConfig } from "@/lib/investment-mail";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.investment);

/**
 * Investment Info (/investment) — added 20 Sept 2026; sits under "About" in
 * the nav.
 *
 * ⚠ PROVISIONAL. All wording here comes from content/investment.ts, which is
 * a draft awaiting the client's approved copy (their next meeting). While its
 * `status` is "pending-client-signoff" the page shows a visible draft notice,
 * and the route is `draft: true` in content/seo.ts (noindex, not in the
 * sitemap). Nothing here is hardcoded — replacing the copy is a change to
 * content/investment.ts only.
 *
 * The registration form's on/off state is decided here, on the server, from
 * whether mail is configured (RESEND_API_KEY + INVESTMENT_MAIL_FROM — see
 * lib/investment-mail.ts). This page is statically generated, so the state
 * is fixed at BUILD time: after adding those variables, redeploy. The API
 * route re-checks at request time and the form falls back to its disabled
 * state if it is told mail isn't configured.
 */
export default function InvestmentPage() {
  const { intro, approach, highlights, beyond } = investmentContent;
  const pending = investmentContent.status === "pending-client-signoff";
  const formEnabled = getMailConfig() !== null;

  return (
    <>
      <PageHero
        media="investmentHero"
        title={investmentContent.hero.title}
        subtitle={investmentContent.hero.subtitle}
      />

      {/* Intro + approach */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
          {pending && (
            <div className="flex max-w-3xl flex-col gap-2 border border-dashed border-hairline bg-surface-raised px-5 py-4">
              <span className="text-caption text-fg-faint tracking-wide uppercase">Draft</span>
              <p className="text-small text-fg-muted">{investmentContent.draftNotice}</p>
            </div>
          )}

          <div className="flex max-w-3xl flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">{intro.eyebrow}</span>
            <h2 className="text-heading-3 text-fg sm:text-heading-2">{intro.heading}</h2>
            <p className="text-lead text-fg-muted">{intro.tagline}</p>
          </div>

          <div className="flex max-w-3xl flex-col gap-4 border-t border-hairline pt-10">
            <h3 className="text-heading-4 text-fg">{approach.heading}</h3>
            <p className="text-body text-fg">{approach.lead}</p>
            {approach.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body text-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Investment highlights — the same independently-bordered card grid
          the /about "Why ATMP" section uses. */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">{highlights.heading}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.items.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 border border-hairline bg-surface-raised p-6">
                <h3 className="text-body text-fg">{item.title}</h3>
                <p className="text-small text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Beyond infrastructure */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
          <div className="flex max-w-3xl flex-col gap-4">
            <h2 className="text-heading-4 text-fg">{beyond.heading}</h2>
            {beyond.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body text-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Register interest */}
      <section id="register-interest" className="scroll-mt-24 bg-surface-raised">
        <ViewportReveal className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="flex flex-col gap-4">
              <h2 className="text-heading-4 text-fg">{investmentForm.heading}</h2>
              <p className="max-w-md text-body text-fg-muted">{investmentForm.intro}</p>
            </div>
            <InvestmentInterestForm enabled={formEnabled} />
          </div>
        </ViewportReveal>
      </section>
    </>
  );
}
