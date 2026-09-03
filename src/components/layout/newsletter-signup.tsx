"use client";

import type { FormEvent } from "react";

/**
 * Footer newsletter sign-up.
 *
 * No submission endpoint exists yet, so this is deliberately inert and says so
 * — the same honest treatment the progress PDF button used: the submit control
 * is genuinely disabled rather than merely styled to look inert, and onSubmit
 * still calls preventDefault() as a second guarantee (Enter from the input).
 * There is no path here that can produce a fake success message.
 *
 * To wire it up later: point the form at the provider, drop the disabled
 * attribute and the "coming soon" note, and keep the markup as-is.
 */
export function NewsletterSignup() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="flex flex-col gap-4 border-t border-hairline pt-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-body text-fg">Project updates by email</h2>
        <p className="max-w-md text-small text-fg-muted">
          Construction progress, corridor changes and milestones — sent as they are published.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:max-w-md">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby="newsletter-note"
            // Fixed white background regardless of theme (client instruction,
            // 2 Sept 2026 — the dark-theme-resolved bg-surface-raised made
            // this unreadable in the dark footer). Text/placeholder use the
            // paper-ink tokens, not the theme-relative fg tokens, for the
            // same reason the footer's logo plate does (see bg-paper above).
            className="w-full border border-hairline bg-paper px-4 py-3 text-small text-paper-ink-1 placeholder:text-paper-ink-3 focus:border-paper-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <button
            type="submit"
            disabled
            aria-describedby="newsletter-note"
            className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 border border-hairline bg-transparent px-5 py-3 text-caption tracking-wide text-fg-faint uppercase"
          >
            Subscribe
            <span className="border border-hairline px-2 py-0.5">Coming soon</span>
          </button>
        </div>
        <p id="newsletter-note" className="text-caption text-fg-faint">
          Email updates are not yet switched on — nothing entered here is sent or stored.
        </p>
      </form>
    </div>
  );
}
