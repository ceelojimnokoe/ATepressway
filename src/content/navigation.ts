/**
 * Primary site navigation, shared by SiteHeader and SiteFooter
 * (src/components/layout/). Routes reflect the IA agreed for launch:
 * Home, Progress, Project, Partners, Contact.
 */

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export const primaryNav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Progress", href: "/progress" },
  { label: "Project", href: "/project" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
] as const;
