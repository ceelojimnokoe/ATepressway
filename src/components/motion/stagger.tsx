"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { useReveal } from "@/hooks/use-reveal";

interface StaggerContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Seconds between each item's entrance. */
  readonly stagger?: number;
  /** Seconds before the first item. */
  readonly delay?: number;
  readonly once?: boolean;
  readonly amount?: number;
}

interface StaggerItemProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Rise distance in px. */
  readonly distance?: number;
  /** Injected by StaggerContainer — not part of the public API. */
  readonly __index?: number;
  readonly __stagger?: number;
  readonly __delay?: number;
}

/**
 * A single item within a {@link StaggerContainer}. Renders visible by
 * default; the container arms and reveals the group, and each item's
 * --reveal-delay sequences the entrance.
 */
export function StaggerItem({
  children,
  className,
  distance = 16,
  __index = 0,
  __stagger = 0.08,
  __delay = 0,
}: StaggerItemProps) {
  const style = {
    "--reveal-item-y": `${distance}px`,
    "--reveal-delay": `${__delay + __index * __stagger}s`,
  } as CSSProperties;

  return (
    <div data-reveal-item className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Reveals its StaggerItem children one after another when scrolled into
 * view. The container is what the observer watches; each direct StaggerItem
 * child is handed its running index so the CSS can stagger the entrances.
 * Non-StaggerItem children pass through untouched.
 */
export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  const ref = useReveal<HTMLDivElement>({ once, amount });

  let index = 0;
  const items = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === StaggerItem) {
      const injected = { __index: index, __stagger: stagger, __delay: delay };
      index += 1;
      return cloneElement(child as ReactElement<StaggerItemProps>, injected);
    }
    return child;
  });

  return (
    <div ref={ref} data-reveal-group className={className}>
      {items}
    </div>
  );
}
