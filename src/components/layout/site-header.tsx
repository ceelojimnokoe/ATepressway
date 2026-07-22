"use client";

import { organization, media } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { primaryNav } from "@/content/navigation";
import { PageTransitionLink } from "./page-transition-link";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { useScrollPast } from "@/hooks/use-scroll-past";
import { cn } from "@/lib/cn";

/**
 * Fixed header that floats transparently over the top of each page and
 * gains a blurred void background + rule once the page scrolls, so the
 * hero reads full-bleed while the nav stays legible over content further
 * down. Height never changes between states (only colour/backdrop), so
 * there's no layout shift. A thin scroll-progress bar sits at the very top.
 */
export function SiteHeader() {
  const scrolled = useScrollPast(24);

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out",
          scrolled
            ? "border-b border-rule bg-void/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
          <PageTransitionLink
            href="/"
            aria-label={`${organization.shortName} — home`}
            className="text-body text-ink-1"
          >
            {isPlaceholder(media.logo) ? (
              <span className="font-mono text-body tracking-wide uppercase">{organization.shortName}</span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.logo.src} alt={media.logo.alt} className="h-6 w-auto" />
            )}
          </PageTransitionLink>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="text-small">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <MobileNav items={primaryNav} />
        </div>
      </header>
    </>
  );
}
