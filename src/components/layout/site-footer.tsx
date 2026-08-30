import Image from "next/image";
import { organization, contact, siteLastUpdated } from "@/content/project";
import { formatLongDate } from "@/lib/format";
import { NewsletterSignup } from "./newsletter-signup";
import { primaryNav } from "@/content/navigation";
import { mediaRegistry } from "@/content/media";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { NavLink } from "./nav-link";

const logoMark = mediaRegistry.atelLogoMark;


export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" className="border-t border-hairline bg-surface text-fg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            {/* Logo on a fixed light plate (bg-paper) so the mark reads on the
                dark footer, and noticeably larger than before. next/image,
                not a raw <img>, for resizing + modern-format conversion. */}
            <span className="flex h-32 w-32 items-center justify-center rounded-md bg-paper p-2">
              <Image
                src={logoMark.src}
                alt={logoMark.alt}
                width={logoMark.width}
                height={logoMark.height}
                sizes="128px"
                className="h-full w-full object-contain"
              />
            </span>
            <p className="text-small text-fg-muted">{organization.footerBlurb}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col sm:items-end">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="inline-block py-1.5 text-small">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <NewsletterSignup />

        {contact.social.length > 0 && (
          <ul className="flex flex-wrap gap-x-5 border-t border-hairline pt-4">
            {contact.social.map((entry) => (
              <li key={entry.platform}>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block py-1.5 text-small text-fg-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {entry.platform}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 border-t border-hairline pt-6 text-caption text-fg-faint">
          <PlaceholderNotice value={contact.email}>{(value) => <span>{value}</span>}</PlaceholderNotice>
          <PlaceholderNotice value={contact.phone}>{(value) => <span>{value}</span>}</PlaceholderNotice>
          <PlaceholderNotice value={contact.address}>{(value) => <span>{value}</span>}</PlaceholderNotice>
          <span>
            © {year} {organization.name}
          </span>
          <span>Site last updated: {formatLongDate(siteLastUpdated)}</span>
        </div>
      </div>
    </footer>
  );
}
