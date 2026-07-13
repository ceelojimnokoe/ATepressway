# CLAUDE.md

Instructions for Claude Code (and any other agent) working in this repository.

## What this project is

A public information website for **ATEL (Accra–Tema Motorway Expressway Limited)**, a Ghanaian road infrastructure project.

## Roles & attribution — read this before writing any copy

ATEL is the **project company / client**. It does not build the road. Get the attribution right every time:

| Entity | Role |
|---|---|
| **ATEL** (Accra–Tema Motorway Expressway Limited) | Project company / client |
| **Maripoma Enterprise Ltd** | EPC Contractor |
| **Associated Consultants Ltd** | Design Review & Construction Supervision |
| **Limmark Energy Solutions Ltd** | Electrical Relocation |
| **Dakal Construction Works Ltd** | Water Relocation |
| **GIIF** | Financing |

**Never describe ATEL as the contractor.** ATEL commissions and oversees the work; Maripoma builds it. This distinction is load-bearing for the site's credibility and must hold in every headline, caption, and meta description.

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

## The lime rule

Brand is **lime `#C8F31D` + black**.

- Lime on black: **15.2:1** contrast — good, use freely on dark surfaces.
- Lime on light: **1.2:1** contrast — **fails WCAG, never do this.**
- The site is **dark-first.**
- Lime is a **signal colour**: the live figure, the active state, the one CTA. It marks the single most important thing on a screen.
- Lime is **never** a background wash and **never** body text.
- Where a lime-adjacent signal is needed on a light surface, use the `signal-ink` token (a dark, legible variant of the same hue) instead of lime itself.

## Verified facts — do not alter

- Investment: **≈US$340M**.
- Corridor: **27.7km** across **three sections**:
  - **S1** — Accra–Tema Motorway (N1), **19.5km**, Tetteh Quarshie → Tema
  - **S2** — George Bush Highway (N1), **5.7km**, Tetteh Quarshie → Apenkwa
  - **S3** — Nsawam Road (N6), **2.5km**, Apenkwa → Neoplan
- Original road **opened 1964** under Nkrumah.
- **Reconstruction began 2024**, a **36-month window**.
- **Five interchanges**: Teshie Link, Community 18, Lashibi, Fiesta Royale, Neoplan.
- **14 pedestrian footbridges.**
- **8 toll plazas.**
- **10-lane configuration**: 4 lanes reinforced concrete freeway + 6 lanes urban highway.
- **Why reconstruction**: the existing pavement was designed for a **20-year life**. It now shows **fatigue cracking, joint failures, and pumping under wheel load**. Use this language as given — it is what makes the case credible; do not soften it into marketing copy.

These figures are fixed. If new information arrives that appears to contradict them, flag it — don't silently overwrite.

## Content process

**No CMS.** Content updates arrive weekly by email and we deploy. All content lives in `src/content/` as typed TypeScript, not in a database or headless CMS.
