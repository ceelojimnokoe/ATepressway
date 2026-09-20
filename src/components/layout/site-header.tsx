"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { organization } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { PageTransitionLink } from "./page-transition-link";
import { DesktopNav } from "./desktop-nav";
import { MobileNavList } from "./mobile-nav-list";
import { LatestUpdates } from "./latest-updates";
import { useScrollPast } from "@/hooks/use-scroll-past";
import { cn } from "@/lib/cn";

const logoMark = mediaRegistry.atelLogoMark;

/**
 * Conventional sticky top navigation (replaces the earlier right-docked
 * rail). Logo left, the link list across the top on desktop (DesktopNav —
 * seven items, three of them with dropdowns) — no hamburger at that width.
 * Opaque light surface at all times with a bottom hairline; on scroll it
 * gains a shadow for separation from content, since it no longer sits over a
 * dark hero. Below lg it collapses to a plain hamburger that toggles a simple
 * slide-down list (MobileNavList, whose dropdown parents expand inline).
 * Sticky behaviour is unchanged by the 20 Sept 2026 nav restructure.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollPast(8);
  const pathname = usePathname();

  // Close the mobile menu on route change and on Escape.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-hairline bg-surface-raised transition-shadow duration-200 ease-out",
        scrolled && "shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)]",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <PageTransitionLink
          href="/"
          aria-label={`${organization.shortName} — home`}
          className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-md border border-hairline bg-surface-raised p-1">
            <Image
              src={logoMark.src}
              alt=""
              width={logoMark.width}
              height={logoMark.height}
              sizes="48px"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="figure text-body font-medium tracking-wide text-fg uppercase">
            {organization.shortName}
          </span>
        </PageTransitionLink>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <LatestUpdates />
          <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2.5 p-2.5 text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:hidden"
        >
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute top-0 left-0 block h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-200 ease-out",
                menuOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute top-1/2 left-0 block h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ease-out",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 block h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-200 ease-out",
                menuOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        // max-h + overflow: the menu is longer now that groups can expand, and
        // the header is sticky, so on a short viewport (a phone in landscape)
        // it must scroll inside itself rather than run off the screen.
        <nav
          id="mobile-menu"
          aria-label="Primary"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-hairline bg-surface-raised lg:hidden"
        >
          <MobileNavList onNavigate={() => setMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
}
