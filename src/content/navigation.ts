/**
 * Primary site navigation, shared by SiteHeader and SiteFooter
 * (src/components/layout/). Order reflects the IA agreed for launch:
 * Home, Project, Design, Progress, Gallery, Stakeholders, Contact.
 *
 * Below `md` the header collapses this list into MobileNav's toggle
 * menu (a vertical dropdown), so the item count never crowds the header
 * row on small screens — it only has to fit horizontally at `md` and up.
 */

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export const primaryNav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Project", href: "/project" },
  { label: "Design", href: "/design" },
  { label: "Progress", href: "/progress" },
  { label: "Gallery", href: "/gallery" },
  { label: "Stakeholders", href: "/stakeholders" },
  { label: "Contact", href: "/contact" },
] as const;
