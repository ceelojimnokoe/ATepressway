"use client";

import { useEffect } from "react";
import { PageTransitionLink } from "@/components/layout/page-transition-link";

/**
 * Route-level error boundary for /gallery. If anything in this route throws,
 * this contains the failure to the gallery route — it will NOT take down the
 * whole app via the root global-error — and shows a usable fallback with a
 * retry. The error digest is logged so a production-only failure can be
 * matched to Vercel's function logs. This is a safety net; the gallery grid
 * itself is a server component that renders independently of client code.
 */
export default function GalleryError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error("Gallery route error:", error, "digest:", error.digest);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-start gap-4 px-4 py-24 sm:px-8">
      <h1 className="text-heading-3 text-fg">The gallery could not be displayed</h1>
      <p className="max-w-xl text-body text-fg-muted">
        Something went wrong loading the gallery. Please try again.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-accent bg-lime px-5 py-2.5 text-small tracking-wide text-void uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
        <PageTransitionLink
          href="/"
          className="border border-hairline px-5 py-2.5 text-small tracking-wide text-fg uppercase hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to home
        </PageTransitionLink>
      </div>
    </main>
  );
}
