"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageTransitionLink } from "./page-transition-link";
import { cn } from "@/lib/cn";

interface NavLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  /** Resting + hover classes for the non-active state (overridable per surface). */
  readonly inactiveClass?: string;
  readonly onClick?: () => void;
  /**
   * A dropdown parent's other pages. When the current route is one of these
   * the parent is highlighted as the active SECTION (lime, plus
   * aria-current="true" so it isn't colour-only) even though it isn't the
   * current page itself — e.g. "The Project" while on /design.
   */
  readonly sectionHrefs?: readonly string[];
  /** Attribute passthroughs used by the dropdown's keyboard handling. */
  readonly onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void;
  readonly id?: string;
}

/**
 * A primary-nav link that knows whether it points at the current page.
 * The active page's label is lime (the signal colour marking "you are
 * here" — the same lime as the live figures and bars); the others rest in
 * ink and warm toward a muted lime (`text-accent/70`) on hover, hinting at
 * where they lead. `aria-current="page"` carries the active state for
 * assistive tech, so it's never colour-only.
 */
function matches(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  children,
  className,
  inactiveClass = "text-fg-muted hover:text-accent/70",
  onClick,
  sectionHrefs,
  onKeyDown,
  id,
}: NavLinkProps) {
  const pathname = usePathname();
  const isPage = matches(pathname, href);
  const inSection = !isPage && (sectionHrefs?.some((section) => matches(pathname, section)) ?? false);
  const active = isPage || inSection;

  return (
    <PageTransitionLink
      id={id}
      href={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-current={isPage ? "page" : inSection ? "true" : undefined}
      className={cn(active ? "text-accent" : inactiveClass, className)}
    >
      {children}
    </PageTransitionLink>
  );
}
