# Climate Intelligence Made Easy

**Kaggle Summer School writeup — DWS IQ**

Author: Risto Paarni — <https://www.kaggle.com/ristoprni>

## Pitch

Climate data is everywhere and useful nowhere. ERA5 reanalysis, EDGAR
emissions, Copernicus land-cover, EU ETS registries, and EFRAG XBRL filings
each ship in their own schema, units, and update cadence. The result: every
team rebuilds the same plumbing before they can ask the actual question.

"Climate Intelligence Made Easy" is a one-week notebook track that compresses
that plumbing into reusable cells, so participants spend the week on
**signal**, not on **ingest**.

## What participants build

A single Kaggle notebook that:

1. Pulls one open climate dataset (ERA5 / EDGAR / Copernicus / EU ETS).
2. Joins it against one regulatory or financial table (CSRD, CBAM, ETS allowances).
3. Outputs a one-page brief: "What changed, who is exposed, what to do next."

Scoring rewards reproducibility, unit hygiene (tCO2e vs kgCO2e is a frequent
graveyard), and clarity of the final brief — not leaderboard accuracy.

## Why it works as a teaching format

- **Bounded scope.** One dataset, one regulation, one page.
- **Transferable plumbing.** The ingest cells become reusable utilities.
- **Real stakes.** The same pattern powers CBAM and CSRD compliance work in
  production at firms like ours.

## Suggested datasets

| Source | Use |
| --- | --- |
| ERA5 (Copernicus) | Temperature / wind baselines |
| EDGAR v8 | Country-sector emissions |
| EU ETS Union Registry | Installation-level allowances |
| EFRAG XBRL taxonomy | CSRD disclosure structure |
| CBAM transitional reports | Embedded emissions per importer |

## Deliverable template

```
Title:        <one-line finding>
Dataset(s):   <links + version pins>
Method:       <3 bullets, no jargon>
Finding:      <number + unit + scope>
So what:      <who acts, by when, under which rule>
```

If a participant can fill that template honestly, they have produced climate
intelligence. The rest is engineering.
