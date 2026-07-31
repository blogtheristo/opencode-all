# Lab Note: INSPIRE Moves to the European Data Portal — Geospatial Discovery, Dataset Versioning, eDelivery (July 2026)

***

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code | Session: claude/eu-data-live-verify-tfy7aw | Date: 19.07.2026 | Changes: Implemented Actions item 3 — `scripts/weekly/edp-dataset-diff.sh`, the first concrete piece of the regulatory-radar ingestion layer (reuses `dws eu-data search`, diffs a watchlist against `config/edp-dataset-state.json`, writes changes to `docs/regulatory-radar/edp-dataset-diffs/`). Tested against a stubbed `dws` binary (new/no-change/modified paths all verified); not live-tested against the real EDP Search API — same network-policy block as the rest of this lab note. Also fixed the pre-existing broken `cli/` tsc build (missing `cli/node_modules`, plus a cross-package rootDir violation on the `dws kb preflight` dynamic import into `src/utils/embeddings.ts`, resolved via a non-literal import specifier + local type). `.claude/commands/regulatory-radar.md` §Data freshness and §Agent lineage updated to match.
- Version: 1.2 | Tool: Claude Code | Session: claude/eu-data-live-verify-tfy7aw | Date: 14.07.2026 | Changes: Live-verify attempt of `dws eu-data status` against PRH/FMI/EDP upstreams (carried-over next step from PR #1640). All three hosts (avoindata.prh.fi, opendata.fmi.fi, data.europa.eu) returned CONNECT 403 from this session's agent proxy — confirmed via `/root/.ccr/__agentproxy/status` relay log as `connect_rejected` / organization egress-policy denial, not a transient or code-level fault. This is the second independent Claude Code cloud session to hit the identical block (first: claude/european-datasets-lab-note-8mlg9u, 2026-07-06/09). Added a "Live Verification Log" section below; the CLI's fail-loud path (`mode`, `partial`, `hint`) is now confirmed correct on live infrastructure — only the reachability itself remains unverified. Recommend running from a non-Claude-Code-cloud machine (local dev box, DGX Spark, or any host outside this org's cloud-session egress policy).
- Version: 1.1 | Tool: Claude Code | Session: claude/european-datasets-lab-note-8mlg9u | Date: 06.07.2026 | Changes: Web verification pass (INSPIRE Geoportal retirement on 1 July 2026 confirmed via web search; portal search/API architecture documented from EDP provider manual), added IPR Considerations section and testing/onboarding dataset shortlist.
- Version: 1.0 | Tool: Claude Code | Session: claude/european-datasets-lab-note-8mlg9u | Date: 06.07.2026 | Changes: Initial lab note — INSPIRE geospatial datasets migrating to data.europa.eu (effective 1 July 2026), new dataset versioning feature, and Digital Europe eDelivery cross-border exchange framework, mapped to DWS IQ data-ingestion and sovereignty relevance.

Session Links & References:

- Claude Code (claude/european-datasets-lab-note-8mlg9u): https://github.com/blogtheristo/dws6/commits/claude/european-datasets-lab-note-8mlg9u
- Claude Code (claude/eu-data-live-verify-tfy7aw): https://github.com/blogtheristo/dws6/commits/claude/eu-data-live-verify-tfy7aw
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/lab-notes/2026-07-06-inspire-european-data-portal-geospatial.md

Document Status:

- Created: 06.07.2026
- Last Modified: 19.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Lab Note / Ecosystem Research

Related Documents:

- docs/lab-notes/README.md
- docs/lifetime-world-model/LEARNING_SOURCES.md
- docs/field-notes/2026-03-21-ted-eprocurement-ontology-lead-sourcing.md
- docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md
- skills/regulatory-radar/ (EU pipeline scanning)
- skills/kb/ (knowledge base ingestion)

***

**Version:** 1.3
**Effective Date:** 2026-07-06
**Last Updated:** 2026-07-19
**Status:** Active

---

## Lab Note Metadata

- **Date:** 2026-07-06
- **Author:** Claude Code session, on behalf of Lifetime Oy research
- **Source:** data.europa.eu newsletter (July 2026), "European datasets" edition — three items: INSPIRE transition to the European Data Portal, dataset versioning feature, Digital Europe eDelivery. Newsletter content supplied directly; canonical announcements live on https://data.europa.eu/en/news-events.
- **Type:** Ecosystem Research / Standards Evaluation
- **Confidence:** High for Item 1, Medium-High for Items 2–3. The source is the official data.europa.eu newsletter (primary source for portal features), received and quoted verbatim. Item 1 was independently verified by web search on 2026-07-06: the INSPIRE Geoportal is confirmed retired as of 1 July 2026, with data.europa.eu as the successor access point, and the portal's geospatial filter, map/bounding-box search, HVD dashboard, SPARQL endpoint (Virtuoso triplestore), and Search API are documented in the EDP data-provider manual. Direct hands-on browsing of data.europa.eu was not possible from this session (remote-environment network policy blocks the domain — proxy CONNECT 403), so Items 2–3 rest on the newsletter text alone.

### Ontology Tags

- **Geography:** European Union > All Member States (cross-border scope)
- **Sector:** Public Sector > Open Data > Geospatial / Digital Infrastructure
- **Entities:** European Commission, data.europa.eu (European Data Portal), INSPIRE Directive (2007/2/EC), Digital Europe Programme, eDelivery, High-Value Datasets (Implementing Regulation (EU) 2023/138)
- **Temporal Context:** 2026-Q3; INSPIRE transition effective 1 July 2026 (five days before this note)

---

## Executive Summary

Three developments from the European Data Portal, all live as of July 2026:

1. **INSPIRE datasets are now searchable on data.europa.eu** (effective 1 July 2026). Geospatial data from the INSPIRE infrastructure joins the portal's millions of public-sector datasets, with dedicated geospatial search tools, a High-Value Datasets (HVD) dashboard, and a geo-viewer. The separate INSPIRE geoportal era ends; data.europa.eu becomes the single discovery point for European geospatial data.
2. **Dataset versioning has landed on the portal.** Previous versions of a dataset can be accessed, downloaded, and diffed against later updates — enabling reliable citation, reproducibility, and transparent change tracking.
3. **eDelivery is being positioned as the common cross-border exchange framework.** Built on open standards, it lets independently developed public and private systems exchange documents securely across borders; related datasets on the portal document interoperability and digital infrastructure across Europe.

**Takeaway for DWS IQ:** data.europa.eu just became a materially better single upstream for our EU data ingestion. One portal now covers regulatory datasets, HVD categories (geospatial, earth observation, meteorological, statistics, companies, mobility), and versioned time series — with provenance we can cite. This strengthens three existing DWS threads: Control Room geospatial context, regulatory-radar/kb ingestion, and the EU-sovereignty narrative (a public, EU-governed data plane feeding an EU-sovereign analytics stack).

---

## Item 1: INSPIRE → European Data Portal

**What changed.** From 1 July 2026, datasets published under the INSPIRE Directive (the EU's spatial data infrastructure covering 34 spatial data themes: hydrography, land use, transport networks, energy resources, environmental monitoring, buildings, etc.) are discoverable and accessible through data.europa.eu. The portal adds:

- **Dedicated geospatial search** — spatial filtering alongside the existing DCAT-AP metadata search.
- **HVD dashboard** — tracking Member State publication of High-Value Datasets, which the Open Data Directive requires to be free, machine-readable, and API-accessible. Geospatial is one of the six HVD categories.
- **Geo-viewer** — in-portal preview of spatial datasets before download.

**Verified 2026-07-06 (web search; direct portal access blocked by session network policy):** the INSPIRE Geoportal (inspire-geoportal.ec.europa.eu) is retired as of 1 July 2026 and now redirects users to the European Data Portal. The combined search at `data.europa.eu/data/combined` supports a geospatial-source filter and a map search where a region can be typed or drawn as a bounding box. Programmatic access is two-track: a **SPARQL API** (Virtuoso triplestore over DCAT-AP metadata) for complex queries and a **Search API** for high-performance full-text search with facet filtering — these are the integration surfaces a future `eu-data` skill would target.

**Why it matters for DWS.**

- **One ingestion target instead of two.** Previously, geospatial discovery meant the INSPIRE geoportal (OGC CSW, ISO 19115/19139 metadata) while general open data meant data.europa.eu (DCAT-AP, SPARQL endpoint). Consolidation means the portal's existing SPARQL/REST APIs become the single programmatic surface — a simpler wedge for a future `eu-data` ingestion skill.
- **Control Room / site intelligence.** SiteSense, carbon-analysis, and Lifetime Fleet scenarios all benefit from authoritative geospatial layers (land use, transport networks, protected sites, energy infrastructure) with EU-wide licensing clarity. HVD geospatial data is free for reuse by regulation, removing license diligence per dataset.
- **Customer relevance.** Energy-network customers (distribution grid development plans, cf. the Caruna field note) and industrial customers with CBAM/EED exposure sit exactly where INSPIRE themes (energy resources, environmental monitoring) meet HVD categories.

## Item 2: Dataset Versioning

**What changed.** The portal now tracks dataset evolution: earlier versions remain accessible and downloadable, and changes between updates can be identified and compared.

**Why it matters for DWS.**

- **Reproducibility for compliance outputs.** A CBAM or CSRD number derived from an EU dataset can now cite the exact dataset version, not just the URL. This aligns directly with the DWS Truth Standard's canonical-source discipline: assertions should be traceable to a versioned source.
- **Change detection as a signal.** Version diffs on regulatory and statistical datasets are a machine-readable "something changed" trigger — a natural feed for regulatory-radar, which today scans document pipelines (EUR-Lex, EFRAG) rather than data revisions.
- **Retention argument.** The 2026-07-01 field note on sensor-data aging (tiedon vanheneminen) argued data value decays without provenance; the EU portal adopting versioning validates that positioning at the public-infrastructure level.

## Item 3: eDelivery (Digital Europe)

**What changed.** The Commission is promoting eDelivery — its open-standards framework (AS4 messaging profile, four-corner model) — as the common mechanism for secure cross-border document and data exchange between independently built systems. Related datasets on the portal document interoperability and cross-border digital infrastructure.

**Why it matters for DWS.**

- **Interoperability posture, not implementation (yet).** No current DWS product exchanges documents cross-border via eDelivery. But for public-sector and regulated-industry deals, "eDelivery-compatible" is the EU's answer to "how do we integrate securely with your national system" — worth tracking as a standards checkbox in the sovereignty-pillars assessment (EU pillar, interoperability dimension).
- **Adjacent to existing threads.** eDelivery is the transport layer under Peppol (e-invoicing/e-procurement) — the same ecosystem as the TED e-procurement lead-sourcing work. If DWS ever automates tender-document exchange, eDelivery is the mandated rail.

---

## Datasets for Testing and Client Onboarding

**Onboarding principle:** show the client their own world before they upload anything. Enter a Business ID → DWS renders company profile, facilities on a map, emissions history, live site weather, open tenders — all from public data.

| Dataset                                                             | Onboarding / testing use                                | DWS surface                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| EU ETS verified emissions (EEA / Union Registry)                    | Client's installations: verified CO₂, allowances, trend | CBAM / compliance-check demo (steel, cement, chemicals) |
| Industrial Emissions Portal (E-PRTR)                                | Client facilities' reported pollutant releases, mapped  | Compliance + Control Room map layer                     |
| Business registers (companies HVD; FI: PRH/YTJ open API)            | Auto-filled company profile from Business ID            | Onboarding pre-fill, KYA identity anchoring             |
| INSPIRE buildings / cadastral / addresses (geospatial HVD; FI: NLS) | Client sites with authoritative parcel/building context | SiteSense, carbon-analysis site context                 |
| Meteorological HVD (FI: FMI open data)                              | Live wind/weather at client site coordinates            | SiteSense crane/wind scoring — always-live demo         |
| TED procurement notices                                             | Sector tenders, scored                                  | Lead sourcing (existing thread)                         |

**Testing targets** (stable, API-first, exercise version-diff and geo paths): Eurostat statistics HVD (high update cadence → versioning-diff tests for regulatory-radar), CORINE Land Cover / Copernicus layers (large geospatial payload tests), Fintraffic Digitraffic (real-time mobility streams → Control Room ingestion/retention), and one bounded INSPIRE theme (e.g. protected sites, single country) to validate post-consolidation metadata parsing.

**First concrete step:** the Finnish trio — PRH business register + FMI weather + NLS geospatial — all mature, free, no-auth APIs; add ETS verified emissions for industrial prospects.

---

## IPR Considerations (Lifetime Oy)

**Inbound — what we may use.** HVDs must by regulation be free, machine-readable, and reusable under CC BY 4.0 or more permissive; the Open Data Directive (EU) 2019/1024 Art. 1(6) bars public-sector bodies from invoking the sui generis database right to prevent reuse. Practical consequence: EU open data is safe input for DWS analytics and demos, **but license terms vary per dataset** — ingestion must capture the license URI and attribution string as metadata, not assume uniformity. Watch for third-party IPR flags in dataset metadata (some INSPIRE layers embed third-party content).

**Attribution discipline.** CC BY requires attribution. Every DWS surface that renders EU-derived data (Control Room layers, compliance reports, onboarding demos) needs a provenance line, e.g. "Contains data from data.europa.eu, © [publisher], CC BY 4.0, dataset version [X]". The portal's new versioning feature makes version-pinned attribution possible — adopt it from day one.

**Outbound — what stays ours.** DWS IPR lives in the derived layer: scoring models, ontology mappings (e.g. Nemotron two-tower ontology stages), risk indices, LWM training artifacts, and the composition of sources — not in the raw datasets. Keep a clean provenance ledger separating open inputs from proprietary outputs so that (a) our derived-work claims are defensible, (b) no CC BY share-alike-style contamination argument can arise (CC BY has no share-alike, but mislabelled inputs might), and (c) client deliverables can state exactly which numbers rest on which public dataset version. This is the DWS Truth Standard applied to third-party data.

**Model training.** Using open portal data for LWM/agent training is licence-compatible (CC BY / CC0) and unaffected by CDSM Art. 4 TDM opt-outs, which do not bind public-sector open data releases. Log dataset versions used in training runs for EU AI Act data-governance documentation (Art. 10-style provenance records).

**Client boundary.** Public context data (no confidentiality, attribution required) vs. client operational data (client-owned, processed under DPA, never mixed into shared artifacts). Onboarding demos built purely on open data avoid client-IPR entanglement entirely — a selling point, not just a compliance stance.

---

## Actions

1. **No immediate code change.** This is ecosystem intelligence; no DWS surface breaks or requires update today.
2. **Candidate skill (deferred until asked twice):** an `eu-data` ingestion skill targeting the data.europa.eu SPARQL/REST API with HVD + INSPIRE theme filters and version-aware fetch. Log here as the first ask; codify per the Skill Codification Rule if a second concrete need appears.
3. **regulatory-radar enhancement — implemented 2026-07-19, not yet live-verified:** `scripts/weekly/edp-dataset-diff.sh` scans a small watchlist (EU ETS verified emissions, E-PRTR, Eurostat energy statistics) via `dws eu-data search`, diffs against `config/edp-dataset-state.json`, and writes changes to `docs/regulatory-radar/edp-dataset-diffs/`. EUR-Lex/EFRAG document pipelines remain unbuilt (see `.claude/commands/regulatory-radar.md` §Data freshness).
4. **sovereignty-pillars-assess:** consider adding eDelivery compatibility as an EU-pillar interoperability signal when that skill is next revised.
5. **IPR hygiene from day one:** any `eu-data` ingestion design must capture license URI, publisher, and dataset version per record (see §IPR Considerations) so attribution and provenance are automatic, not retrofitted.

---

## Live Verification Log

Tracks attempts to run `dws eu-data status` against real upstreams, per Action item 2's shipped `eu-data` CLI (`b412eaa`, 2026-07-06) and the PR #1640 handoff carry-over.

| Date       | Session                                  | Environment                        | PRH     | FMI     | EDP     | Result                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ---------------------------------------- | ---------------------------------- | ------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-06 | claude/european-datasets-lab-note-8mlg9u | Claude Code cloud (remote sandbox) | blocked | blocked | blocked | Fail-loud path only — network policy blocked all 3 hosts at CONNECT                                                                                                                                                                                                                                                                                           |
| 2026-07-14 | claude/eu-data-live-verify-tfy7aw        | Claude Code cloud (remote sandbox) | blocked | blocked | blocked | Same result. Confirmed via agent-proxy relay log as `connect_rejected` — an organization egress-policy denial (403 on CONNECT), not a code, DNS, or transient fault. Per `/root/.ccr/README.md`: 403/407 from the proxy means "the destination host is not allowed by your organization's egress policy for this session... do not retry or route around it." |

**Standing conclusion:** the `eu-data` CLI's fail-loud contract (mode/partial/hint, non-zero exit when all upstreams fail) is verified correct on live infrastructure — it degrades exactly as designed. What remains unverified is upstream reachability itself, and two independent sessions now agree that verification requires a host **outside** Claude Code's cloud-session egress policy (a local dev machine, DGX Spark, or CI runner with open internet). Re-running this check inside another Claude Code cloud session is not expected to produce a different result — do not re-attempt it here; hand off to a human or non-restricted runner instead.

## References

- data.europa.eu — European Data Portal news & events: https://data.europa.eu/en/news-events
- INSPIRE Directive 2007/2/EC: https://eur-lex.europa.eu/eli/dir/2007/2/oj
- High-Value Datasets Implementing Regulation (EU) 2023/138: https://eur-lex.europa.eu/eli/reg_impl/2023/138/oj
- eDelivery (Digital Europe Programme): https://ec.europa.eu/digital-building-blocks/sites/display/DIGITAL/eDelivery
- INSPIRE Geoportal retirement notice (redirects to EDP since 1 July 2026): https://inspire-geoportal.ec.europa.eu/
- data.europa.eu news — INSPIRE and open data: https://data.europa.eu/en/news-events/news/inspire-open-data
- EDP data-provider manual — search & APIs (geospatial filter, map search, SPARQL, Search API): https://dataeuropa.gitlab.io/data-provider-manual/how-to-search/search-for-datasets/
- Open Data Directive (EU) 2019/1024: https://eur-lex.europa.eu/eli/dir/2019/1024/oj
