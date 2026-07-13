import Link from "next/link";
import { organization, media, contact } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { primaryNav } from "@/content/navigation";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";

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
            {isPlaceholder(media.logo) ? (
              <span className="font-mono text-body tracking-wide uppercase">
                {organization.shortName}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.logo.src} alt={media.logo.alt} className="h-6 w-auto" />
            )}
            <p className="text-small text-ink-2">{organization.description}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2 sm:items-end">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-small text-ink-2 hover:text-ink-1">
                    {item.label}
                  </Link>
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
