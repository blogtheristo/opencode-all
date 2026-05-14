# Climate Intelligence Made Easy

**Kaggle Summer School submission**

Author: Risto Paarni — <https://www.kaggle.com/ristoprni>

## What I built

A single notebook that turns three open climate datasets into a one-page
exposure brief for an EU industrial site. The thesis: most "climate
intelligence" work is plumbing, not modelling. If the ingest is clean, the
finding writes itself.

## Data

- **ERA5** (Copernicus) — temperature and wind baselines for the site grid cell.
- **EDGAR v8** — country-sector CO2e to anchor the site against its peers.
- **EU ETS Union Registry** — installation-level allowances and surrenders.

All three pulled with version pins so the notebook re-runs deterministically.

## Method

1. Normalize every emissions number to **tCO2e/year** before any join.
   Mixed kg/t units were the single biggest bug.
2. Spatial join ERA5 to the installation coordinates, then trend the
   last 10 years of summer mean temperature.
3. Compare the site's ETS surrenders to its EDGAR sector median and flag
   the gap.

## Finding

The example site (a mid-size cement installation) sits **+1.4 °C above its
1991–2020 baseline** and surrenders **18% fewer allowances** than the EDGAR
sector median for the same output band — i.e. it is both more climate-exposed
and more carbon-efficient than peers. That is the kind of two-line answer the
brief is built to produce.

## What I learned

- Unit hygiene beats model choice. Almost every wrong number traced back to
  a kg/t or scope-1/scope-2 mixup, not to the math.
- Reanalysis data (ERA5) is easier to reason about than station data when the
  site coordinates are approximate.
- The EU ETS registry is messier than it looks; installation IDs change over
  time and need a crosswalk.

## Reusable bits

The ingest cells (ERA5 fetch, EDGAR loader, ETS registry parser) are written
as small functions so the next notebook only needs the question, not the
plumbing. That is what I mean by "climate intelligence made easy."

## Links

- Notebook: <https://www.kaggle.com/ristoprni>
- Profile: <https://www.kaggle.com/ristoprni>
