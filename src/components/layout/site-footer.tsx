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
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-sm flex-col gap-2">
            {/* next/image, not a raw <img>: the raw tag skipped resizing and
                modern-format conversion entirely. */}
            <Image
              src={logoMark.src}
              alt={logoMark.alt}
              width={logoMark.width}
              height={logoMark.height}
              sizes="96px"
              className="h-8 w-auto object-contain"
            />
            <p className="text-small text-ink-2">{organization.description}</p>
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
          <ul className="flex gap-4 border-t border-rule pt-6">
            {SOCIAL_LINKS.map((entry) => (
              <li key={entry.key} className="text-small text-ink-2">
                {String(entry.value)}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 border-t border-rule pt-6 text-caption text-ink-3">
          <PlaceholderNotice value={contact.email}>{(value) => <span>{value}</span>}</PlaceholderNotice>
          <span>
            © {year} {organization.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
