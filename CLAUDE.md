# CLAUDE.md

Instructions for Claude Code (and any other agent) working in this repository.

## What this project is

A public information website for **ATEL (Accra–Tema Expressway Limited)**, the Ghanaian company delivering the reconstruction of the Accra–Tema Motorway corridor. The confirmed company name (client, 2026-07-17) is **"Accra–Tema Expressway Limited"** — used for both `organization.name` and the Employer (`stakeholders.employer.name`). Do not reintroduce the earlier "A.T. Expressway Ltd" or "Accra–Tema Motorway Expressway Limited" forms. Note "Accra–Tema Motorway" (no "Expressway Limited") is the **road/corridor** name and stays as-is.

## Source of truth

The client's written Monthly Progress Report is the source of truth. It supersedes verbal confirmations, the information form, and press reports. When the MPR conflicts with anything else, the MPR wins.

Current reference: **Monthly Progress Report, May 2026** (cited per-figure as "MPR May 2026").

## Roles & attribution — read this before writing any copy

ATEL's contractual role is **Employer**. It commissions and oversees the works; it does not build the road. Get the attribution right every time. The contractual chain, top to bottom (per the MPR):

| Entity | Role |
|---|---|
| **Accra–Tema Expressway Limited** (ATEL) | Employer |
| **GIIF** | Funding Agency |
| **Ghana Highway Authority** | Employer's Representative |
| **Associated Consultants Ltd** | Employer's Representative's Agent |
| **Maripoma Enterprise Ltd** | EPC Contractor |

Outside the chain, always visually subordinate to it:

| Entity | Role |
|---|---|
| **Limmark Energy Solutions Ltd** | Specialist Contractor — Electrical Relocation |
| **Dakal Construction Works Ltd** | Specialist Contractor — Water Relocation |

**Never describe ATEL as the contractor.** Maripoma builds the road. This distinction is load-bearing for the site's credibility and must hold in every headline, caption, and meta description.

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

- **Money**: contract price **US$338,897,543.56** (before tax); total including tax **US$393,121,150.53**. Display label: **"US$338.9M contract price"**. The old "≈US$340M investment" figure is superseded — do not reintroduce it.
- Corridor: **27.7km** across **three sections**:
  - **S1** — Accra–Tema Motorway (N1), **19.5km**, Tetteh Quarshie → Tema
  - **S2** — George Bush Highway (N1), **5.7km**, Tetteh Quarshie → Apenkwa
  - **S3** — Nsawam Road (N6), **2.5km**, Apenkwa → Neoplan
- Original road **opened 1964** under Nkrumah.
- **Dates**: contract award **21 March 2024**; contractor commencement **2 August 2024**; scheduled completion **2 August 2027** — a **36-month window** from commencement.
- **Works scope (MPR)**:
  - **Reconstruction of Tetteh Quarshie Interchange**
  - **New interchanges at Teshie Link, Community 18, and Lashibi**
  - **8 toll plazas**
  - **10 pedestrian crossing points** (MPR scope: "Construction of 10 No. Pedestrian Crossing Points"; the MPR quantities table confirms 10)
  - **Enhancement of roadway traffic in the Lagos Avenue / Lagos Link area**
  - **Rehabilitation and widening of Liberation Road to Polo Club, with overpass**
  - Do **not** use the old "five interchanges" framing. **Fiesta Royale exists only as a design visualisation** — never present it as works scope. Neoplan does not appear in the MPR scope and was dropped from the interchange list (flagged 2026-07-16; restore only on client confirmation).
- **Progress: 46% overall — OFFICIAL** (source string: "Monthly Progress Report, May 2026").
- **Per-structure progress** (each sourced "MPR May 2026"): Tetteh Quarshie **88%** · Teshie Link **74.5%** · Community 18 **67.5%** · Lashibi **30%** · Footbridges **3.15/10** · Box culverts **12.85/20** · Bridge culverts **1.2/3**.
- **10-lane configuration**: 4 lanes reinforced concrete freeway + 6 lanes urban highway.
- **Why reconstruction**: the existing pavement was designed for a **20-year life**. It now shows **fatigue cracking, joint failures, and pumping under wheel load**. Use this language as given — it is what makes the case credible; do not soften it into marketing copy.

These figures are fixed until a newer MPR supersedes them. If other information appears to contradict them, the MPR wins — flag the conflict, don't silently overwrite.

## Media

Real, client-supplied files are catalogued in `src/content/media.ts` (the registry: `src`, alt text, `sourceSlide?`, `verified`). Logo candidates enter the registry `verified: false` until the client renames/confirms them; a file whose content contradicts its filename also stays `verified: false`. Temporary stock assets live in `src/content/stock-media.ts` and are never presented as project imagery.

## Content process

**No CMS.** Content updates arrive weekly by email and we deploy. The client's Monthly Progress Report arrives monthly and is authoritative (see "Source of truth"). All content lives in `src/content/` as typed TypeScript, not in a database or headless CMS.
