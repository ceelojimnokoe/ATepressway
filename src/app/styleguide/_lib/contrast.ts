/**
 * WCAG contrast-ratio math over colors read live from the DOM (see
 * color-tokens.tsx) — no color values are duplicated here or anywhere
 * else in the styleguide; everything is measured from the actual
 * rendered tokens so this can't drift from src/styles/globals.css.
 */

export type RGB = readonly [number, number, number];

export function parseRgb(value: string): RGB {
  const match = value.match(/(\d+(?:\.\d+)?)/g);
  if (!match || match.length < 3) return [0, 0, 0];
  const [r, g, b] = match.map(Number);
  return [r, g, b];
}

export function rgbToHex([r, g, b]: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function channelLuminance(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

export function relativeLuminance([r, g, b]: RGB): number {
  return (
    0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
  );
}

export function contrastRatio(a: RGB, b: RGB): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}
