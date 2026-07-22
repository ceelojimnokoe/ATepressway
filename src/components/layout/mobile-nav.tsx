"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import type { NavItem } from "@/content/navigation";
import { NavLink } from "./nav-link";
import { easing, duration as D } from "@/lib/motion";

interface MobileNavProps {
  readonly items: readonly NavItem[];
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: D.slow, ease: easing.out } },
};

/**
 * Full-screen mobile menu. Opening locks body scroll, Escape closes it,
 * and the links stagger in (transform disabled under reduced motion, so
 * they simply appear). The trigger sits above the overlay so it stays the
 * close control. All the usual ARIA: aria-expanded, aria-controls, and a
 * labelled nav landmark.
 */
export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="relative z-[70] border border-rule bg-void/60 px-3 py-1.5 text-caption text-ink-1 tracking-wide uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
      >
        {open ? "Close" : "Menu"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            className="fixed inset-0 z-[65] flex flex-col bg-void"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: D.base, ease: easing.out }}
          >
            <motion.ul
              className="mt-24 flex flex-col px-6 sm:px-8"
              initial="hidden"
              animate="visible"
              variants={listVariants}
            >
              {items.map((item) => (
                <motion.li key={item.href} className="border-b border-rule" variants={itemVariants}>
                  <NavLink
                    href={item.href}
                    onClick={() => setOpen(false)}
                    inactiveClass="text-ink-1 hover:text-lime/70"
                    className="block py-4 text-heading-4"
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
