"use client";

import type { ReactNode } from "react";
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
}

/**
 * A primary-nav link that knows whether it points at the current page.
 * The active page's label is lime (the signal colour marking "you are
 * here" — the same lime as the live figures and bars); the others rest in
 * ink and warm toward a muted lime (`text-lime/70`) on hover, hinting at
 * where they lead. `aria-current="page"` carries the active state for
 * assistive tech, so it's never colour-only.
 */
export function NavLink({
  href,
  children,
  className,
  inactiveClass = "text-ink-2 hover:text-lime/70",
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <PageTransitionLink
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(active ? "text-lime" : inactiveClass, className)}
    >
      {children}
    </PageTransitionLink>
  );
}
