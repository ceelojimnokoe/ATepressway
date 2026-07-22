"use client";

import { Fragment, type CSSProperties, type ElementType } from "react";
import { useReveal } from "@/hooks/use-reveal";

interface TextRevealProps {
  readonly text: string;
  readonly className?: string;
  /** Rendered wrapper element, e.g. "h1" | "h2" | "p" (default span). */
  readonly as?: ElementType;
  /** Seconds before the first word. */
  readonly delay?: number;
  /** Seconds between words. */
  readonly stagger?: number;
  readonly once?: boolean;
}

/**
 * Heading reveal: each word fades and rises in sequence. The words are the
 * real, in-order text (with normal spaces as separate text nodes so lines
 * wrap), so screen readers read clean, complete content — nothing is
 * duplicated or split into characters.
 *
 * Rendered visible by default. The word offsets are applied only after the
 * client arms the reveal (see {@link useReveal} + globals.css); without JS,
 * on a hydration failure, or under reduced motion the full heading is shown
 * immediately.
 */
export function TextReveal({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  stagger = 0.05,
  once = true,
}: TextRevealProps) {
  const ref = useReveal<HTMLSpanElement>({ once, amount: 0.35 });
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref} data-reveal-text>
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span data-reveal-word style={{ "--reveal-delay": `${delay + i * stagger}s` } as CSSProperties}>
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
