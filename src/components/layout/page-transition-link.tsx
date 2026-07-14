"use client";

import NextLink, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

interface PageTransitionLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  readonly children: ReactNode;
}

/**
 * Wraps next/link with the native View Transitions API for a cross-fade
 * between routes (duration/easing set in globals.css, mirroring
 * --duration-base / --ease-standard). Next's experimental.viewTransition
 * config flag only takes effect with React's canary/experimental build
 * (not installed here — see CLAUDE.md "no new dependencies without
 * asking"), so this drives the browser API directly instead.
 *
 * Progressive enhancement only: browsers without
 * document.startViewTransition (Firefox, older Safari) fall through to
 * a normal Link navigation, and prefers-reduced-motion skips it the
 * same way.
 */
export function PageTransitionLink({
  href,
  onClick,
  children,
  ...rest
}: PageTransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (typeof document === "undefined" || !document.startViewTransition) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    document.startViewTransition(async () => {
      router.push(href.toString());
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
  }

  return (
    <NextLink href={href} onClick={handleClick} {...rest}>
      {children}
    </NextLink>
  );
}
