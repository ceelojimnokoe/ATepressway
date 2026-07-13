/**
 * Branded placeholder type shared across src/content/. Wraps any fact the
 * client hasn't supplied yet, so a naive render can't silently ship a
 * made-up value. Consumers must call isPlaceholder() and render an
 * explicit "to be confirmed" state.
 */

const PLACEHOLDER: unique symbol = Symbol("placeholder");

export interface Placeholder<T> {
  readonly [PLACEHOLDER]: true;
  /** What this placeholder stands in for, e.g. "Public contact email". */
  readonly label: string;
  /** Non-fact fallback value — safe to use for typing, never for display as fact. */
  readonly fallback: T;
}

export function placeholder<T>(label: string, fallback: T): Placeholder<T> {
  return { [PLACEHOLDER]: true, label, fallback };
}

export function isPlaceholder<T>(value: T | Placeholder<T>): value is Placeholder<T> {
  return typeof value === "object" && value !== null && PLACEHOLDER in value;
}
