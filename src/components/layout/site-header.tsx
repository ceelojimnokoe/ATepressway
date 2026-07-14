import { organization, media } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { primaryNav } from "@/content/navigation";
import { PageTransitionLink } from "./page-transition-link";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-rule">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
        <PageTransitionLink href="/" className="text-body text-ink-1">
          {isPlaceholder(media.logo) ? (
            <span className="font-mono text-body tracking-wide uppercase">
              {organization.shortName}
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.logo.src} alt={media.logo.alt} className="h-6 w-auto" />
          )}
        </PageTransitionLink>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <PageTransitionLink href={item.href} className="text-small text-ink-2 hover:text-ink-1">
                  {item.label}
                </PageTransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav items={primaryNav} />
      </div>
    </header>
  );
}
