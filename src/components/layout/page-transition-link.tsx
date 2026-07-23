import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface PageTransitionLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  readonly children: ReactNode;
}

/**
 * Internal navigation link.
 *
 * This previously hijacked every click with document.startViewTransition()
 * to cross-fade between routes. That has been REMOVED and must not be
 * reinstated in this form: startViewTransition() snapshots the document and
 * commits when its callback settles, but router.push() in the App Router is
 * asynchronous and each route loads its own CSS chunk. The old code waited
 * only two animation frames, so the transition could commit before the
 * incoming route's stylesheet applied — rendering the page unstyled. A
 * cross-fade is not worth a race condition in the site's only navigation.
 *
 * Kept as a named component (rather than swapping every call site back to
 * next/link) so route-level link behaviour still has one place to live.
 */
export function PageTransitionLink({ href, children, ...rest }: PageTransitionLinkProps) {
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
  );
}
