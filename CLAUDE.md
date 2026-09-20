# CLAUDE.md

Instructions for Claude Code (and any other agent) working in this repository.

## What this project is

A public information website for **ATEL (Accra–Tema Expressway Limited)**, the Ghanaian company delivering the reconstruction of the Accra–Tema Motorway corridor. The confirmed company name (client, 2026-08-28, and used throughout the client’s own source documents) is **"A.T. Expressway Ltd."** — one form everywhere, for `organization.name`, the SEO brand string and `stakeholders.employer.name`. This SUPERSEDES the earlier 2026-07-17 guidance that mandated "Accra–Tema Expressway Limited" and banned the "A.T. Expressway Ltd" form. Note "Accra–Tema Motorway" (no "Expressway Limited") is the **road/corridor** name and stays as-is.

## Source of truth

The client's written Monthly Progress Report is the source of truth. It supersedes verbal confirmations, the information form, and press reports. When the MPR conflicts with anything else, the MPR wins.

**Exception — board-approved changes.** Where the client states a change was approved by the board (the 14 and 20 Sept 2026 update batches), apply it over the MPR-based figures below, note the override in the content file's comments, and do not revert it on the grounds that it contradicts the MPR. The MPR figures below stay as the record of what the MPR said.

Current reference: **Monthly Progress Report, May 2026** (cited per-figure as "MPR May 2026").

## Roles & attribution — read this before writing any copy

ATEL's contractual role is **Employer**. It commissions and oversees the works; it does not build the road. Get the attribution right every time. The contractual chain, top to bottom (per the MPR):

| Entity | Role |
|---|---|
| **A.T. Expressway Ltd.** (ATEL) | Concessionaire |
| **GIIF** | Funding Agency |
| **Ghana Highway Authority** | Employer's Representative |
| **Associated Consultants Ltd** | Employer's Representative's Agent |
| **Maripoma Enterprise Ltd** | EPC Contractor for Section 1 |

Outside the chain, always visually subordinate to it:

| Entity | Role |
|---|---|
| **Limmark Energy Solutions Ltd** | Specialist Contractor — Electrical Relocation |
| **Dakal Construction Works Ltd** | Specialist Contractor — Water Relocation |

**Never describe ATEL as the contractor.** ATEL is the **Concessionaire** (client, 2026-08-28) — it commissions, finances and oversees the works and will operate and maintain them under a 30-year concession. Maripoma builds the road (Section 1 only). This distinction is load-bearing for the site's credibility and must hold in every headline, caption, and meta description.

## Audience & tone

- Primary audience: **government stakeholders**.
- Secondary audience: **commuters**.
- The site's job, in order: **inform → reassure → attract investment**.
- Tone is **clinical and accountable**, not promotional. This is not a marketing microsite. Claims are verifiable, numbers are sourced, and nothing is oversold.

## Quality bar

Emil Kowalski. Restraint over decoration. **Credibility is the product.** If a design choice doesn't serve clarity or trust, cut it.

## Non-negotiables

- **TypeScript strict, no `any`.**
- **No hardcoded strings or numbers in components** — everything lives in `src/content/`.
- **No raw hex in components** — tokens only (see `src/styles/globals.css`).
- **All motion comes from `src/lib/motion.ts`** — no ad-hoc easings, durations, or transitions defined in components.
- **Animate `transform`/`opacity` only.** No animating `width`, `height`, `top`, `left`, or other layout-triggering properties.
- **Every animation is off under `prefers-reduced-motion`.**
- **All numbers use mono + tabular-nums** (see the `.figure` utility class).
- **Mobile-first. Check 360px first**, then scale up.
- **Server Components by default.** Only reach for Client Components when interactivity requires it.
- **No new dependencies without asking.**

## Theme: light-first (client reversal, 2026)

**The site is light-first.** Paper surfaces + dark ink are the default site-wide. The dark palette (`void`/`raised`/`sunk`) is now the **exception, reserved for a few sections**: the hero, the footer, and the closing-CTA band. Earlier instructions describing a dark-first default are **superseded** — do not reintroduce dark-first.

Mechanically: components use the **semantic, theme-aware tokens** — `bg-surface` / `bg-surface-raised` / `bg-surface-sunk`, `border-hairline`, `text-fg` / `text-fg-muted` / `text-fg-faint`, `text-accent` — never the raw palette (`bg-void`, `text-ink-1`, …) directly. A dark section is created by putting **`data-theme="dark"`** on its wrapper; everything inside re-resolves to the dark palette automatically. See the header comment in `src/styles/globals.css` for the full token map.

## The lime rule

Brand is **lime `#C8F31D` + black**. The lime rule is unchanged by the light-first flip — only which mode is default changed.

- **Lime as text or icon on a light surface: 1.2:1 — fails WCAG, still banned.** For emphasis text/icons on light, use **`text-accent`** (resolves to the `signal-ink` token, ~5.4:1 on paper). Never lime lettering on paper.
- **Lime as a solid fill with near-black text on top is fine** — contrast is symmetric, so a lime chip/button/badge with `text-void` reads ~15–16:1 on either theme. This is the primary way to keep the brand signal visible on a light page: filled buttons, active-state chips, progress-bar fills. Give a lime fill a **`border-accent`** edge on light so its boundary is perceivable (lime vs paper is ~1.1:1 — fails 1.4.11 without it), and put lime bar-fills on a **dark groove** (`data-theme="dark"` on the track) so the fill reads against its track.
- **Lime as text/icon stays legal only inside the dark sections** (hero, footer, closing CTA, image lightbox) — there `text-accent` resolves to real lime.
- Lime is a **signal colour**: the live figure, the active state, the one CTA. It marks the single most important thing on a screen. Never a background wash, never body text.

## Verified facts — per the May 2026 MPR, do not alter

- **Money**: contract price **US$338,897,543.56** (before tax); total including tax **US$393,121,150.53**. Display label: **"US$338.9M contract price"**. The old "≈US$340M investment" figure is superseded — do not reintroduce it. **Board-approved override (20 Sept 2026):** Home's "By the numbers" **Total** tab shows **$700M "Construction Contract Price"** with "(approx.)" beneath; Section 1's label there is now "Construction Contract Price" (still US$338.9M). The $700M is not derived from the MPR, and the instruction did not say what it covers or its currency; it appears on Home only.
- Corridor: **27.7km** across **three sections**:
  - **S1** — Accra–Tema Motorway (N1), **19.5km**, Tetteh Quarshie → Tema
  - **S2** — George Bush Highway (N1), **5.7km**, Tetteh Quarshie → Apenkwa
  - **S3** — Nsawam Road (N6), **2.5km**, Apenkwa → Neoplan
- Original road **opened 1964** under Nkrumah.
- **Dates**: contract award **12 March 2024** — CONFIRMED by the client (2026-08-29), superseding the May 2026 MPR’s 21 March 2024; needs written confirmation from ATEL; contractor commencement **2 August 2024**; scheduled completion **2 August 2027** — a **36-month window** from commencement.
- **Works scope (MPR)**:
  - **Reconstruction of Tetteh Quarshie Interchange**
  - **New interchanges at Teshie Link, Community 18, and Lashibi**
  - ~~8 toll plazas~~ — WITHDRAWN from display (client, 30 Aug 2026: "no official communication on it"). The scope item was removed and no toll-plaza count is shown on Home, /project, /design or the FAQ. `projectFacts.tollPlazaCount` is retained in data but must not be rendered as a count until ATEL confirms
  - **10 pedestrian crossing points** (MPR scope: "Construction of 10 No. Pedestrian Crossing Points"; the MPR quantities table confirms 10)
  - **Enhancement of roadway traffic in the Lagos Avenue / Lagos Link area**
  - **Rehabilitation and widening of Liberation Road to Polo Club, with overpass**
  - Do **not** use the old "five interchanges" framing. **Fiesta Royale exists only as a design visualisation** — never present it as works scope. Neoplan does not appear in the MPR scope and was dropped from the interchange list (flagged 2026-07-16; restore only on client confirmation).
- **Progress: 52% overall** (source string: "Progress meeting, 28 August 2026" — was "Client meeting", changed 20 Sept 2026). Maripoma’s own chart (`progress-update-1.jpeg`, 28 Aug 2026) shows one continuous series — Jan 38% · May 46% · Jul 50% · Aug 52% — so the earlier 46% and 50% figures are the same series at earlier months, not competing sources. The per-structure breakdown is now the 28 Aug 2026 set (applied on client instruction, 2026-08-29), so overall and per-structure figures share a reporting date.
- **Per-structure progress** (footbridges and culverts sourced "Maripoma work plan, 28 August 2026"): Footbridges **4.45/10** · Box culverts **18.25/20** · Bridge culverts **1.3/3**. These replace the May 2026 MPR set and are on the same reporting date as the 52% overall. **The four interchange figures are board-approved client corrections** (Tetteh Quarshie, Community 18 and Lashibi on 14 Sept 2026; Teshie Link on 20 Sept 2026): Tetteh Quarshie **70%** (was 100%) · Teshie Link **70%** (was 74.7%) · Community 18 **70%** (was 67.5%) · Lashibi **40%** (was 37%). They are corrections, not a new reporting period — `asOf` stays "August 2026" — and are sourced "client corrections, 14 and 20 September 2026" pending a specific source document.
- **10-lane configuration**: 4 lanes reinforced concrete freeway + 6 lanes urban highway.
- **Why reconstruction**: the existing pavement was designed for a **20-year life**. It now shows **fatigue cracking, joint failures, and pumping under wheel load**. Use this language as given — it is what makes the case credible; do not soften it into marketing copy.

These figures are fixed until a newer MPR supersedes them. If other information appears to contradict them, the MPR wins — flag the conflict, don't silently overwrite — except for board-approved changes (see "Source of truth"), which are marked above.

## Media

Real, client-supplied files are catalogued in `src/content/media.ts` (the registry: `src`, alt text, `sourceSlide?`, `verified`). Logo candidates enter the registry `verified: false` until the client renames/confirms them; a file whose content contradicts its filename also stays `verified: false`. Temporary stock assets live in `src/content/stock-media.ts` and are never presented as project imagery.

Several page-hero banners (About Us, Stakeholders, Contact, Investment Info) are generic office/business photos, **not project imagery** (registered 20 Sept 2026 under `aboutUsHero`, `stakeholdersHero`, `contactUsHero`, `investmentHero`). They must never be used as evidence of the works or in the Gallery.

## Navigation

Seven top-level items — Home · About ▾ · The Project ▾ · Progress · Gallery · Stakeholders · Contact ▾ — defined once in `src/content/navigation.ts` and shared by the header (`desktop-nav.tsx`, `mobile-nav-list.tsx`) and the footer (which lists all ten pages flat). **A parent with a dropdown is always also a real link** to its own page (About → /about, The Project → /project, Contact → /contact); a separate chevron button opens the sub-items. Never make a parent menu-only. The dropdown follows the WAI-ARIA disclosure-navigation pattern (aria-expanded + aria-controls, plain links) — deliberately not `role="menu"`.

## Content process

`contact.social` is an ORDERED ARRAY of `{ platform, url }` (LinkedIn first), not a fixed-key object — display order is content, and new platforms need no type change. An entry with no `url` renders as a disabled "Coming soon" item (YouTube, until its link exists).

**Provisional content.** `src/content/investment.ts` (the /investment page and its form copy) is a **draft pending client sign-off** — the client supplies approved copy at their next meeting. While `investmentContent.status` is `"pending-client-signoff"` the page shows a "Draft" notice and the route is `draft: true` in `content/seo.ts` (noindex, not in the sitemap). When approved copy arrives: replace the text, set `status` to `"approved"`, and remove `draft: true`. Do not treat its wording as verified — it includes return/guarantee claims that are the client's own and unchecked (see the file's header).

**Investment interest form.** `POST /api/investment-interest` emails `contact.email` via Resend (`src/lib/investment-mail.ts`, plain `fetch`, no SDK). It is **off until `RESEND_API_KEY` and `INVESTMENT_MAIL_FROM` are set** (see `.env.example`) — until then the form renders disabled/"Coming soon" and the route answers 503; it never shows a success it didn't get. `/investment` is statically generated, so after adding the variables **redeploy**. Validation is server-side (`src/lib/investment-interest.ts`); spam protection is a honeypot, a minimum fill time, same-origin, a body cap and a best-effort in-memory per-IP rate limit (weak on serverless — use a shared store or the host's WAF if abuse appears).


**No CMS.** Content updates arrive weekly by email and we deploy. The client's Monthly Progress Report arrives monthly and is authoritative (see "Source of truth"). All content lives in `src/content/` as typed TypeScript, not in a database or headless CMS.
