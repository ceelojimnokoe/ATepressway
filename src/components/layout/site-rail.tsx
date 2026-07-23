"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { staggerContainer, reveal } from "@/lib/motion";
import { primaryNav } from "@/content/navigation";
import { organization, contact } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { isPlaceholder } from "@/content/placeholder";
import { PageTransitionLink } from "./page-transition-link";
import { NavLink } from "./nav-link";
import { cn } from "@/lib/cn";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const logoMark = mediaRegistry.atelLogoMark;

/** Renders a contact line, or an explicit to-be-confirmed state. */
function ContactLine({
  label,
  value,
  href,
}: {
  readonly label: string;
  readonly value: string | { readonly label: string };
  readonly href?: (v: string) => string;
}) {
  const unresolved = isPlaceholder(value as string);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-caption text-ink-3 tracking-wide uppercase">{label}</span>
      {unresolved ? (
        <span className="text-small text-ink-3">To be confirmed</span>
      ) : href ? (
        <a
          href={href(value as string)}
          className="text-small text-ink-1 underline underline-offset-4 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
        >
          {value as string}
        </a>
      ) : (
        <span className="text-small text-ink-1">{value as string}</span>
      )}
    </div>
  );
}

/**
 * The site's only navigation: a slim rail permanently docked to the right
 * edge at every breakpoint, which expands in place into a full panel.
 *
 * The widening is pure transform — see `.rail-panel` in globals.css. The
 * panel is always laid out at --rail-expanded inside a clip of the same
 * width; collapsed, it is translated right so only a --rail-collapsed
 * sliver survives the clip. The logo, trigger and vertical page label all
 * live inside that sliver, so they are what shows when collapsed and they
 * travel left with the panel as it opens.
 *
 * The page behind stays fully visible and undimmed — there is deliberately
 * no backdrop. The clip is pointer-events-none so the strip of it sitting
 * over page content never swallows clicks while collapsed.
 */
export function SiteRail() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const pathname = usePathname();

  /** Current page name, taken from the same primaryNav labels the list uses. */
  const currentPageLabel = primaryNav.find((item) =>
    item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`),
  )?.label;

  const close = useCallback(() => setOpen(false), []);

  /**
   * Close and hand focus back to the trigger. Flagged rather than focused
   * inline so it survives the re-render that swaps the panel's contents.
   */
  const closeAndRestoreFocus = useCallback(() => {
    restoreFocus.current = true;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    triggerRef.current?.focus();
  }, [open]);

  // Esc closes and returns focus to the trigger; Tab is trapped in the panel.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        restoreFocus.current = true;
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Clicking anywhere outside the panel closes it.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-0 z-50 overflow-hidden"
      style={{ width: "var(--rail-expanded)" }}
    >
      <div
        ref={panelRef}
        data-open={open ? "true" : "false"}
        className="rail-panel pointer-events-auto absolute inset-y-0 right-0 flex w-full flex-col border-l border-rule bg-void"
      >
        {/* Logo — inside the collapsed sliver, hugging the inner edge. */}
        <div className="shrink-0 pt-6 pl-4 sm:pl-5">
          <PageTransitionLink
            href="/"
            onClick={close}
            aria-label={`${organization.shortName} — home`}
            className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-rule bg-raised p-1 sm:h-10 sm:w-10">
              <Image
                src={logoMark.src}
                alt=""
                width={logoMark.width}
                height={logoMark.height}
                sizes="40px"
                className="h-full w-full object-contain"
              />
            </span>
          </PageTransitionLink>
        </div>

        {/*
         * Trigger — a standard 3-line hamburger that morphs into an X on
         * open. The bars themselves transform (rotate/translate/opacity);
         * no SVG is swapped. It sits below the logo rather than mid-height
         * so the X never collides with the nav list once expanded. The
         * global reduced-motion hard-stop collapses these transitions to
         * instant, so the state still changes, just without the morph.
         */}
        <div className="shrink-0 pt-6 pl-4 sm:pl-5">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => (open ? closeAndRestoreFocus() : setOpen(true))}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="group block text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <span aria-hidden="true" className="relative block h-4 w-6">
              <span
                className={cn(
                  "absolute top-0 left-0 block h-px w-full origin-center bg-current transition-transform duration-300 ease-out",
                  open ? "translate-y-[7px] rotate-45" : "group-hover:scale-x-125",
                )}
              />
              <span
                className={cn(
                  "absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-current transition-opacity duration-200 ease-out",
                  open ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 block h-px w-full origin-center bg-current transition-transform duration-300 ease-out",
                  open ? "-translate-y-[7px] -rotate-45" : "group-hover:scale-x-125",
                )}
              />
            </span>
          </button>
        </div>

        {/* Close — expanded only, circular, right-pointing (collapse direction). */}
        {open && (
          <button
            type="button"
            onClick={closeAndRestoreFocus}
            aria-label="Close navigation"
            className="absolute top-6 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-lime text-lime transition-colors duration-200 ease-out hover:bg-lime hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            <span aria-hidden="true" className="text-body">
              →
            </span>
          </button>
        )}

        <div className="relative min-h-0 flex-1">
          {/*
           * Wayfinding: the current page name set vertically along the rail,
           * like a sign gantry or a drawing annotation. Collapsed-state only
           * — once expanded, the nav list marks the active page itself.
           */}
          {currentPageLabel && (
            <span
              aria-hidden="true"
              className={cn(
                "figure absolute top-1/2 left-4 -translate-y-1/2 text-caption tracking-[0.25em] text-ink-3 uppercase transition-opacity duration-200 ease-out [writing-mode:vertical-rl] sm:left-5",
                open && "opacity-0",
              )}
            >
              {currentPageLabel}
            </span>
          )}

          {/* Panel body — mounted only while expanded, so nothing focusable
              hides in the clipped-off region when collapsed. */}
          {open && (
            <div
              id={panelId}
              className="flex h-full flex-col justify-between gap-10 overflow-y-auto pt-8 pr-5 pb-8 pl-4 sm:pl-5"
            >
              <nav aria-label="Primary">
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-1"
                >
                  {primaryNav.map((item) => (
                    <motion.li key={item.href} variants={reveal}>
                      <NavLink
                        href={item.href}
                        onClick={close}
                        inactiveClass="text-ink-1 hover:text-lime"
                        className="block py-2 text-heading-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                      >
                        {item.label}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4 border-t border-rule pt-6"
              >
                <motion.div variants={reveal}>
                  <ContactLine label="Email" value={contact.email} href={(v) => `mailto:${v}`} />
                </motion.div>
                <motion.div variants={reveal}>
                  <ContactLine label="Phone" value={contact.hotline} href={(v) => `tel:${v}`} />
                </motion.div>
                <motion.div variants={reveal}>
                  <ContactLine label="Office" value={contact.address} />
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
