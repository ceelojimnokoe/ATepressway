import Image from "next/image";
import { organization, contact } from "@/content/project";
import { NewsletterSignup } from "./newsletter-signup";
import { primaryNav } from "@/content/navigation";
import { mediaRegistry } from "@/content/media";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { NavLink } from "./nav-link";

const logoMark = mediaRegistry.atelLogoMark;

/** Shared small-caps label above each footer column, so every group of
    links is identified rather than just floating under the one before it. */
const COLUMN_HEADING = "text-caption text-fg-faint tracking-wide uppercase";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" className="border-t border-hairline bg-surface text-fg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-8">
        {/* One even grid — brand, nav, contact and social all read as
            siblings instead of two blocks pinned to opposite edges with
            empty space between them. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-4">
          <div className="flex flex-col gap-4">
            {/* Logo on a fixed light plate (bg-paper) so the mark reads on the
                dark footer. next/image, not a raw <img>, for resizing +
                modern-format conversion. */}
            <span className="flex h-24 w-24 items-center justify-center rounded-md bg-paper p-2">
              <Image
                src={logoMark.src}
                alt={logoMark.alt}
                width={logoMark.width}
                height={logoMark.height}
                sizes="96px"
                className="h-full w-full object-contain"
              />
            </span>
            <p className="max-w-xs text-small text-fg-muted">{organization.footerBlurb}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className={COLUMN_HEADING}>Navigate</h2>
            <ul className="mt-3 flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="inline-block py-1.5 text-small">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={COLUMN_HEADING}>Contact</h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-small text-fg-muted">
              <li>
                <PlaceholderNotice value={contact.email}>{(value) => <span>{value}</span>}</PlaceholderNotice>
              </li>
              <li>
                <PlaceholderNotice value={contact.phone}>{(value) => <span>{value}</span>}</PlaceholderNotice>
              </li>
              <li>
                <PlaceholderNotice value={contact.address}>{(value) => <span>{value}</span>}</PlaceholderNotice>
              </li>
            </ul>
          </div>

          {contact.social.length > 0 && (
            <div>
              <h2 className={COLUMN_HEADING}>Follow</h2>
              <ul className="mt-3 flex flex-col">
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
            </div>
          )}
        </div>

        <NewsletterSignup />

        {/* "Site last updated" removed (client instruction, 2 Sept 2026). */}
        <div className="border-t border-hairline pt-6 text-caption text-fg-faint">
          <span>
            © {year} {organization.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
