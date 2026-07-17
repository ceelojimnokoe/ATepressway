# Monthly content update runbook

When a new Monthly Progress Report (MPR) arrives, you edit **one file** —
`src/content/project.ts` — in **two places** (a third is optional). Every
page that shows a figure reads from here, so these edits update the whole
site at once. Then run `pnpm build` and deploy (see `DEPLOY.md`).

The MPR is the source of truth. Only change what the new MPR changes.

---

## 1. `progress` — the headline number and the per-structure bars

Update the four top fields and each work package's percentage (and, for
the unit-based structures, its `unitsComplete`). Leave `reportSeries` as
`"Monthly Progress Report"`.

```ts
export const progress: Progress = {
  overallPercentComplete: 49,          // ← new overall % from the MPR
  asOf: "June 2026",                   // ← new reporting month
  signOffSource: "Monthly Progress Report, June 2026",   // ← month in the citation
  reportSeries: "Monthly Progress Report",               // leave as-is
  sections: placeholder(...),          // leave as-is (per-section not reported)
  workPackages: [
    { id: "tetteh-quarshie", name: "Tetteh Quarshie Interchange", percentComplete: 91, source: "MPR May 2026" },
    // ...update each percentComplete. For unit-based ones, update BOTH numbers
    //    and keep percentComplete = unitsComplete / unitsTotal × 100:
    { id: "footbridges", name: "Pedestrian footbridges", percentComplete: 40, unitsComplete: 4, unitsTotal: 10, source: "MPR June 2026" },
  ],
};
```

Also bump each `source` string to the new month (it's the `MPR_MAY_2026`
constant near the top of the file — either update that constant's value or
set the sources inline).

**Updates automatically from this one edit:** the Home hero figure, the
`/progress` header + every bar + the "current" point on the milestone
timeline, the Home interchange bars, and the `/design` interchange
completion figures.

## 2. `monthlyUpdates` — the "This month" summary

Add the new month to the **front** of the array (newest first). Summarise
in short sentences drawn from the MPR narrative — do not paste quantity
tables.

```ts
export const monthlyUpdates: readonly MonthlyUpdate[] = [
  {
    month: "June 2026",
    completed: [
      "Tetteh Quarshie interchange deck completed",
      "Box culverts reached 15 of 20",
    ],
    planned: [
      "Begin footbridge steelwork at Community 18",
      "Toll plaza foundations on Section 1",
    ],
    overallPct: 49,
  },
  // ...previous months stay below, untouched
];
```

The "Completed in June / Planned for July" headings and the next-month
label are derived automatically from `month`.

## 3. `bulletins` — optional, for notices *between* reports

Only for interim notices (closures, advisories). Add newest-first:

```ts
export const bulletins: readonly Bulletin[] = [
  { date: "2026-06-14", headline: "Night closures on Section 1", summary: "…", href: "#" },
];
```

An empty array renders an honest "No bulletins published yet" — that's
fine; use it only when there's a real notice.

---

## Do NOT touch unless the MPR explicitly changes them

Contract price, the three contractual dates (award / commencement /
completion), the corridor length and sections, the scope (interchanges,
8 toll plazas, 10 pedestrian crossing points), and anything else in
`projectFacts`. These are fixed until a superseding MPR says otherwise; if
a new MPR contradicts one, flag it rather than quietly overwriting.

## Finish

```bash
pnpm build     # must be clean, zero TS errors
```

Then deploy per `DEPLOY.md`. A month's update is one commit.
