import type { ReactNode } from "react";
import { PageTransitionLink } from "@/components/layout/page-transition-link";
import { cn } from "@/lib/cn";

interface CtaLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary";
  readonly className?: string;
}

/**
 * The site's consistent call-to-action link. Primary fills with lime and
 * inverts on hover; secondary is an outline that picks up lime. The arrow
 * nudges right on hover. Colour/transform transitions only (collapsed to
 * instant under the global reduced-motion rule), with a clear focus ring.
 * It is a link — use it for navigation, not actions.
 */
export function CtaLink({ href, children, variant = "primary", className }: CtaLinkProps) {
  return (
    <PageTransitionLink
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 border px-6 py-3 text-small tracking-wide uppercase transition-colors duration-200 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
        variant === "primary"
          ? "border-lime bg-lime text-void hover:bg-transparent hover:text-lime"
          : "border-rule text-ink-1 hover:border-lime hover:text-lime",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-1">
        →
      </span>
    </PageTransitionLink>
  );
}
