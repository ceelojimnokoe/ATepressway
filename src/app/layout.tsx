import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

/**
 * Display face for h1–h3 and the oversized hero figure. Self-hosted from
 * the Fontshare offline kit under ITF's Free Font License, which permits
 * commercial use and self-hosting — self-hosting also keeps the site
 * inside its existing `font-src 'self'` CSP with no third-party request.
 * Variable 200–700: components must NOT add font-bold on top, the face
 * already carries the display weight.
 */
const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
  weight: "200 700",
  display: "swap",
});

/**
 * Body / UI face — pairs natively with Clash Display. Roman only: nothing
 * on the site sets italic, and shipping the italic variable face cost ~40kB
 * on every page for zero glyphs rendered. Re-add the italic entry here if
 * italic copy is ever introduced.
 */
const generalSans = localFont({
  src: [{ path: "./fonts/GeneralSans-Variable.woff2", style: "normal", weight: "200 700" }],
  variable: "--font-general-sans",
  display: "swap",
});

/** Unchanged: numbers need a true mono face with tabular figures. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Unchanged: the one serif moment, still used exactly once. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Accra–Tema Expressway Ltd. | Motorway and Extensions Project",
    template: "%s",
  },
  description:
    "Official project information, design highlights and construction progress for the Accra–Tema Motorway and Extensions Project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${clashDisplay.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
