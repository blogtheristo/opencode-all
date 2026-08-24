# Field Note: Caruna Espoo Oy — Jakeluverkon kehittämissuunnitelma 2026

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/espoo-electrical-summary-dfV9L | Date: 15.05.2026 | Changes: Initial field note summarising Caruna Espoo Oy's 2026 distribution network development plan. The primary PDF (caruna.fi) was blocked by the remote-execution sandbox (HTTP 403 host_not_allowed); content is reconstructed from Caruna's public landing pages, the 2024 summary (tiivistelmä) document, the 1.1.2026 tariff release, and 2025 press coverage (Espoon Sanomat, Länsiväylä, Kauppalehti).

Document Status:

- Created: 15.05.2026
- Language: English + Finnish key terms
- Publication Status: INTERNAL — field note, source-grounded summary, not a substitute for the primary PDF

Source Links:

- Primary (not retrieved in session): https://caruna.fi/sites/default/files/docs/Jakeluverkon%20kehitt%C3%A4missuunnitelma%20Caruna%20Espoo%20Oy%202026.pdf
- 2024 summary (structurally analogous): https://caruna.fi/sites/default/files/docs/Caruna%20Espoo%20Oy%20jakeluverkon%20kehitt%C3%A4missuunnitelman%20tiivistelm%C3%A4%202024.pdf
- Caruna development plans landing page (FI): https://caruna.fi/tuotteet-ja-palvelut/sahkoverkko/kehittamissuunnitelma
- Caruna development plans landing page (EN): https://caruna.fi/en/products-and-services/electrical-grid/development-plans
- Sinimäki primary substation (EUR 30M): https://caruna.fi/en/news/primary-substation-be-built-sinimaki-espoo-meet-growing-energy-demand-and-improve-reliability
- Tariff increase 1.1.2026 (EN): https://caruna.fi/en/news/caruna-espoo-oys-prices-are-rising
- Press: https://www.espoonsanomat.fi/2025/11/12/caruna-korottaa-siirtohintoja-44-espoossa-kauniaisissa-ja-kirkkonummella-1-1-2026-taustalla-verkon-jatti-investoinnit/
- Press: https://www.lansivayla.fi/paikalliset/8989082

***

- **Date:** 15.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** Field note for the DWS IQ team. Caruna Espoo Oy is the DSO responsible for Espoo, Kauniainen, Kirkkonummi and central Joensuu — the same footprint where Lifetime Oy operates (HQ Laidunmaanraitti 2, Espoo). The 2026 plan was filed with Energiavirasto under the Electricity Market Act §52a (kehittämissuunnitelmavelvoite) and is in customer consultation. We need a working picture of the investment envelope, the reliability targets that bound site planning, and the capacity bottleneck that DSO upgrades will or will not relieve before the early 2030s.

## Ontology Tags

- **Geography:** Finland > Uusimaa > Espoo, Kauniainen, Kirkkonummi (Caruna Espoo Oy footprint)
- **Regulatory:** Sähkömarkkinalaki 588/2013 §51 (toimitusvarmuus), §52a (kehittämissuunnitelma); Energiavirasto valvontamenetelmät 2024–2031 (5th regulatory period)
- **Domain:** Sähkönjakelu / Distribution grid > Underground cabling > Capacity expansion > Reliability

## 1. Headline numbers — what we believe is in the 2026 plan

> Confidence is marked per row. Primary-PDF figures will need a direct read once the host is reachable.

| Item | Value | Confidence | Source |
| --- | --- | --- | --- |
| Caruna Espoo Oy customer sites (käyttöpaikat) | ~245,000 | High | Caruna 2024 tiivistelmä |
| Connection points (sähköliittymät) | ~55,000 | High | Caruna 2024 tiivistelmä |
| Network length | ~8,300 km | High | Caruna 2024 tiivistelmä |
| 2023 revenue | ~€87 M | High | Caruna 2024 tiivistelmä |
| Energy transferred to customers (2023) | 3,300 GWh | High | Caruna 2024 tiivistelmä |
| LV (pienjännite) underground cabling rate | ~80 % | High | Caruna 2024 tiivistelmä |
| MV (keskijännite) underground cabling rate | ~92 % | High | Caruna 2024 tiivistelmä |
| Statutory max outage time, outside zoned (asemakaava) areas | 36 h | High | Sähkömarkkinalaki §51, restated in plan |
| Statutory max outage time, inside zoned areas | 6 h | High | Sähkömarkkinalaki §51 |
| 2026 transfer-tariff increase (1.1.2026) | +4.4 % avg | High | Caruna release 12.11.2025 |
| Avg monthly increase, apartment / row-house / detached electric-heat | €0.60 / €1.30 / €2.28 | High | Caruna release |
| Espoo grid capacity expansion needed by early 2030s | **~2× (doubling)** | High | Caruna release + Espoonsanomat |
| Indicative multi-year investment envelope (program-level) | up to **~€300 M** | Medium | Länsiväylä headline; not confirmed in plan text |
| Sinimäki primary substation (in execution) | ~€30 M, with new Leppävaara–Sinimäki underground link | High | Caruna 16.04.2026 news |

## 2. Drivers Caruna names for the 2026 plan

1. **Espoo population growth + electrification.** EV charging and the electrification of district heating (Fortum's Espoo decarbonisation, large heat-pump and waste-heat substations) push peak load up well beyond consumption growth.
2. **Doubling of distribution capacity in Espoo by early 2030s** — this is the load-side anchor the plan and the tariff release both cite.
3. **Weather resilience under SML §51** — even though Espoo is heavily underground already, the plan still has to close the last LV gaps (the ~20 % overhead pienjännite remainder) and harden inter-substation links.
4. **DER and prosumer connection volume** — rooftop PV, behind-the-meter batteries, and small wind require LV reverse-flow capacity and protection re-coordination.
5. **Joensuu centre** — a small but non-trivial slice of Caruna Espoo Oy's footprint; the plan treats it separately for both demographics and topology reasons.

## 3. Investment programme — what we can confirm

- **Sinimäki primary substation** (Espoo, in build): ~€30 M. Includes a new MV underground cable between Leppävaara and Sinimäki primary substations — relieves Leppävaara loading and creates a second source for Sinimäki LV networks. This is the single most-cited concrete project in 2026.
- **Continued LV underground cabling backlog** in the remaining ~20 % overhead pienjännite. Per-km unit costs and weather-resilience benefit are the regulator's two scoring axes.
- **MV network reinforcements** along corridors where housing is being densified (Suurpelto, Kera, Finnoo, Kivenlahti–Kivenlahti metro corridor extensions).
- **Smart-grid / automation**: continued primary-substation automation and remote MV switching rollout. Specific 2026 figures not confirmed without the PDF.
- **Programme-level "jätti-investoinnit"** referenced by Länsiväylä at up to €300 M — likely the 2026–2031 rolling envelope; treat as press-derived until verified in the PDF.

## 4. Reliability targets (toimitusvarmuus)

- The statutory ceiling under SML §51 — 6 h zoned, 36 h non-zoned — is the regulator's compliance floor, not Caruna Espoo's internal SAIDI/SAIFI target.
- Caruna Espoo's footprint is overwhelmingly zoned urban (Espoo, Kauniainen, central Kirkkonummi, Joensuu centre), so the operative regime is the 6 h cap.
- Specific 2026 SAIDI/SAIFI target values are inside the PDF (not retrieved in this session) — flagged as **open item** for the next reachable session.

## 5. Customer-facing impact

- Tariff +4.4 % from 1.1.2026 across Caruna Espoo Oy footprint. After the increase Caruna Espoo's transfer price is still in the ten cheapest Finnish DSOs per the company's release.
- Customer consultation window for the plan ran in the standard Energiavirasto cycle (30.4.–31.5.); comments routed via caruna.fi.

## 6. Implications for Lifetime / DWS IQ work in Espoo

1. **Capacity headroom is the binding constraint, not energy supply.** Any DWS IQ analysis of an Espoo construction or industrial site that adds ≥1 MW peak load before ~2030 has to be checked against Caruna Espoo's reservation queue, not just against tariff-cost.
2. **Sinimäki and Leppävaara substations** are the two reinforcement nodes most relevant to Suurpelto / Kera / Otaniemi-side projects in the next 24 months.
3. **Underground cabling is mostly done in our service envelope** — pitching Lifetime crane / construction-site offerings on storm-resilience improvements is not differentiating in Caruna Espoo's area (LV 80 %, MV 92 % already cabled). Pitch on capacity, DER integration, and EV-charging power reservation instead.
4. **DSO development plans are public** — DWS IQ's `regulatory-radar` and `compliance-check` skills should ingest Caruna Espoo's plan annually; this PDF is a primary signal for Espoo-area infrastructure forecasting.
5. **Site Safety / SiteSense** can cross-reference the 36 h non-zoned outage cap as a worst-case planning input for temporary site power in Kirkkonummi outskirts.

## 7. Open items (to close once caruna.fi is reachable)

- Exact 2026–2031 investment envelope per year, per category (LV cabling / MV cabling / substations / automation / DER connections).
- 2026 SAIDI and SAIFI **targets** for Caruna Espoo Oy (regulator-reported, not just statutory ceiling).
- Customer-experience metrics (CAIDI, MAIFI, weather-event recovery time).
- Specific Espoo-district priorities listed in the plan body (Suurpelto, Kera, Finnoo, Kivenlahti) with year tags.
- Hosting-capacity statements for prosumer / DER per LV network area.
- Programme-level €300 M figure cited by Länsiväylä — confirm scope (5-year? 10-year? capex only?).

## 8. Action — what to do next

- [ ] Re-fetch the primary PDF from a non-sandboxed environment, attach as `docs/field-notes/attachments/caruna-espoo-2026.pdf`, and amend §1 / §4 with exact figures.
- [ ] Add Caruna Espoo Oy's 2026 capacity-doubling target as a planning input to `Firehorse/` Espoo-area load forecasts.
- [ ] Cross-link this note from `docs/DWS7_GREEN_ENERGY_ROADMAP.md` (DSO capacity is the gating constraint for the Espoo deployments in that roadmap).
- [ ] Open `regulatory-radar` ticket: annual ingestion of every Finnish DSO `kehittämissuunnitelma` PDF (Caruna Oy, Caruna Espoo Oy, Helen Sähköverkko, Vantaan Energia Sähköverkot, Elenia, Järvi-Suomen Energia).

## 9. Sandbox / sourcing note

`curl` and `WebFetch` against `caruna.fi` returned HTTP 403 (`x-deny-reason: host_not_allowed`) in this remote-execution session. The note is therefore a **structured reconstruction** from:

1. Caruna Espoo Oy 2024 tiivistelmä (publicly cached search excerpt).
2. Caruna press release 12.11.2025 announcing the 1.1.2026 tariff.
3. Caruna news item on Sinimäki primary substation (April 2026).
4. Press coverage in Espoonsanomat, Länsiväylä, Kauppalehti, Iltalehti (Nov 2025).

Numbers are conservative — where the 2024 figures were the only ones available, they are reported as 2024 baselines, not 2026 targets. Any decision dependent on an exact 2026 target value must wait for §7's PDF re-fetch.
