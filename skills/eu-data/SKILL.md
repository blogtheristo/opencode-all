---
name: eu-data
description: "European open data (data.europa.eu, HVDs, PRH, FMI) for client onboarding demos and dataset discovery. CC BY 4.0 attribution discipline built in."
argument-hint: "onboard <business-id> | search <query> | status; add --demo for offline fixtures"
allowed-tools: [Bash]
---

# EU Data — European Data Portal Onboarding & Discovery Skill

**Domain:** EU open data | High-Value Datasets (HVD) | client onboarding
**CLI:** `cli/src/cli.ts` → `dws eu-data <subcommand>` (zero-dependency, JSON-native)
**Origin:** docs/lab-notes/2026-07-06-inspire-european-data-portal-geospatial.md (INSPIRE → data.europa.eu consolidation, 1 July 2026)

## What This Skill Knows

Since 1 July 2026 the European Data Portal (data.europa.eu) is the single
discovery point for EU geospatial data (INSPIRE), High-Value Datasets, and
public-sector open data — with a Search API, SPARQL endpoint, geospatial
filters, and dataset versioning. HVDs are free and machine-readable by
regulation (Implementing Regulation (EU) 2023/138) under CC BY 4.0 or more
permissive licenses.

**Onboarding principle:** show the client their own world before they upload
anything — company profile, live site weather, and the EU datasets DWS would
activate for them, assembled entirely from public data.

## Invocation

```bash
# Client onboarding pack (live: PRH + FMI + data.europa.eu)
dws eu-data onboard 0772407-9 --place Espoo --json

# Offline demo (bundled fixtures, output labelled mode:"demo")
dws eu-data onboard --demo --json

# Dataset discovery on the European Data Portal
dws eu-data search "verified emissions" --limit 5 --json

# Upstream reachability probe (run FIRST in a new environment)
dws eu-data status --json
```

Parameters: `BUSINESS_ID` (Finnish y-tunnus for PRH lookup), `PLACE` (FMI
weather location, default Espoo), `QUERY` (dataset search override),
`--demo` (fixtures), `--limit N`.

## Upstreams

| Upstream                                  | API                                   | License     | Used for                                      |
| ----------------------------------------- | ------------------------------------- | ----------- | --------------------------------------------- |
| PRH (avoindata.prh.fi, companies HVD)     | YTJ v3 REST                           | CC BY 4.0   | Company profile from Business ID              |
| FMI (opendata.fmi.fi, meteorological HVD) | WFS stored queries                    | CC BY 4.0   | Live weather at client site (SiteSense wedge) |
| data.europa.eu                            | Search API (`/api/hub/search/search`) | per-dataset | Related-dataset discovery                     |

## Output Contract

Structured JSON, always with:

- `mode`: `"live"` or `"demo"` — fixture output is explicitly labelled and must
  never be presented as live values.
- `partial` + `warning` when some upstreams failed (fail loud, never hide).
- `provenance[]`: per source — `source`, `url`, `license`, `attribution`,
  `retrieved`, `status` (`ok` | `error` | `fixture`). Any DWS surface rendering
  this data MUST carry the attribution line (CC BY 4.0 obligation; see lab note
  §IPR Considerations).

## Failure Modes

- Restricted environments (e.g. Claude Code remote sessions) may block EU data
  hosts at the network-policy layer (HTTP 403 on CONNECT). `status` reports
  this; use `--demo` for demos, never fake live data.
- **Confirmed, not hypothetical:** two independent Claude Code cloud sessions
  (2026-07-06, 2026-07-14) both hit CONNECT 403 on all three upstreams
  (avoindata.prh.fi, opendata.fmi.fi, data.europa.eu). The agent-proxy relay
  log classifies this as `connect_rejected` — an organization egress-policy
  denial, not a transient fault. Do not re-attempt live verification from a
  Claude Code cloud session; use a local dev machine, DGX Spark, or another
  runner outside that egress policy. See the Live Verification Log in
  docs/lab-notes/2026-07-06-inspire-european-data-portal-geospatial.md.
- If all onboard upstreams fail, the command exits non-zero with the full
  provenance error list on stderr.

## Demo Script (2 minutes)

1. `dws eu-data status` — show which upstreams are live.
2. `dws eu-data onboard <client-y-tunnus>` (or `--demo` offline) — "this is
   what DWS knows about you before you've uploaded a single file."
3. Walk the `relatedDatasets[].dwsUse` column: each dataset maps to a DWS
   surface (CBAM compliance, Control Room map, SiteSense, regulatory-radar).
4. Point at `provenance[]`: versioned, attributed, EU-governed sources — the
   sovereignty story in one JSON block.
