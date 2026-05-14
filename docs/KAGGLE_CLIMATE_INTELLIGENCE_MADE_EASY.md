# Climate Intelligence Made Easy

Kaggle Summer School — Risto Paarni (<https://www.kaggle.com/ristoprni>)

Follow-up to *DWS IQ Platform: Climate-Aware Multi-Agent AI for Construction*
(Nov 16, 2025 — saved at `docs/KAGGLE_DWS6_AGENTS_NOV2025.md`).

One notebook, three open datasets (ERA5, EDGAR v8, EU ETS Union Registry),
one output: a one-page exposure brief for an EU industrial site.

The thesis: climate intelligence is mostly plumbing. Normalize everything to
tCO2e/year, spatial-join ERA5 to the site, compare ETS surrenders to the
EDGAR sector median — and the finding writes itself.

Biggest lesson: unit hygiene beats model choice. Nearly every wrong number
traced back to a kg/t or scope-1/scope-2 mixup, not to the math.
