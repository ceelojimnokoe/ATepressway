import Image from "next/image";
import { organization, contact } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { primaryNav } from "@/content/navigation";
import { mediaRegistry } from "@/content/media";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { NavLink } from "./nav-link";

const logoMark = mediaRegistry.atelLogoMark;

const SOCIAL_LINKS = [
  { key: "twitter", value: contact.social.twitter },
  { key: "facebook", value: contact.social.facebook },
  { key: "instagram", value: contact.social.instagram },
  { key: "linkedin", value: contact.social.linkedin },
].filter((entry) => !isPlaceholder(entry.value));

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
            <span className="flex h-16 w-16 items-center justify-center rounded-md bg-paper p-1.5">
              <Image
                src={logoMark.src}
                alt={logoMark.alt}
                width={logoMark.width}
                height={logoMark.height}
                sizes="64px"
                className="h-full w-full object-contain"
              />
            </span>
            <p className="text-small text-fg-muted">{organization.footerBlurb}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2 sm:items-end">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="text-small">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {SOCIAL_LINKS.length > 0 && (
          <ul className="flex gap-4 border-t border-hairline pt-6">
            {SOCIAL_LINKS.map((entry) => (
              <li key={entry.key} className="text-small text-fg-muted">
                {String(entry.value)}
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
        </div>
      </div>
    </footer>
  );
}
