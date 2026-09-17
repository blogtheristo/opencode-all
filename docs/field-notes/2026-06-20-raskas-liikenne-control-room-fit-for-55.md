# Industry Case: Raskas liikenne reaaliaikaisen liikennetiedon tuottajana ja hyödyntäjänä — Control Room / Situation Room as the Fit-for-55 Compliance Layer for Heavy Transport

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/stoic-shannon-3u1994 | Date: 20.06.2026 | Changes: Initial industry-case field note. Frames heavy goods transport (raskas liikenne / HDV trucking) simultaneously as a producer and a consumer of real-time traffic data, and maps the DWS Control Room (edge) / Situation Room (cloud) architecture onto Fit-for-55 and broader supply-chain compliance obligations. Regulatory status verified 20.06.2026 (ETS2 start moved to 2028; eFTI mandatory acceptance 9 July 2027; Eurovignette CO2 differentiation per Dir. 2022/362; HDV CO2 standards per Reg. 2024/1610).

Document Status:

- Created: 20.06.2026
- Last Modified: 20.06.2026
- Language: English (with Finnish title and key terms)
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Industry Case

Related Documents:

- docs/Deputy-Agents-Architecture.md §9 (Control Room & Situation Room)
- docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md (Control Room Capital definition)
- skills/compliance/SKILL.md (Fit for 55 scoring: ETS, CBAM, CSRD, AI Act)
- skills/remote-control/SKILL.md (Control Room / Situation Room runtime)
- AGENTS.md (logistics Industrial Specialist agent)

---

## Ontology Tags

- **Geography:** EU > Nordics > Finland (TEN-T core corridors)
- **Sector:** Infrastructure > Mobility > Road Freight > Heavy-Duty Vehicles (HDV) > Telematics / C-ITS
- **Entities:** Lifetime Oy, DWS IQ 6, fleet operators, shippers (Scope 3 owners), National Access Points (NAP), eFTI platforms
- **Standards:** Fit for 55 (HDV CO2 2024/1610, ETS2, Eurovignette 2022/362, AFIR 2023/1804, RED III), eFTI 2020/1056, CSRD/ESRS E1, ISO 14083 / GLEC, ITS Directive, CountEmissions EU (proposal), GDPR (driver location = personal data)
- **Temporal Context:** 2026-Q2; ETS2 live 2028; eFTI acceptance 2027-07-09; HDV CO2 -45% from 2030
- **Confidence:** High on architecture mapping and current regulatory status; Medium on CountEmissions EU (still proposal-stage) and on per-fleet quantitative savings (illustrative, not measured).

---

## 1. The Core Thesis: A Truck Is a Sensor and a Subscriber

A modern heavy-goods vehicle is not a passive consumer of the road network. It is a **dual-role node** in the EU mobility data economy:

- **Producer** — every truck continuously emits high-frequency telemetry: GPS track, speed, road grade, instantaneous fuel/energy burn, payload mass, idling time, regenerative-braking recovery, ADAS/harsh-event flags, tachograph driving/rest state, and battery state-of-charge (SoC) for BEV/FCEV. Aggregated across a fleet and a corridor, this is _primary real-time traffic and emissions data_ — exactly the data class that EU regulation is moving from estimated to _measured_.
- **Consumer** — the same truck consumes real-time inputs to make the next decision better: congestion and incident feeds, weather, dynamic CO2-class tolls, low-emission-zone (LEZ) boundaries, and AFIR charger/hydrogen availability versus current SoC and remaining range.

The regulatory direction of travel under Fit for 55 is to **price, charge, and report** road-freight carbon at ever finer granularity. That makes the producer/consumer duality not a nice-to-have but the substrate of compliance: you cannot cheaply prove a per-consignment emission figure you never measured, and you cannot minimise an ETS2/toll cost you cannot see in real time.

This is precisely the problem the DWS **Control Room (edge) / Situation Room (cloud)** split was built for.

## 2. The Regulatory Pressure Stack (status verified 2026-06-20)

| Instrument                                  | What it does to heavy transport                                                                                          | Data demand it creates                                                             | Status                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **HDV CO2 standards — Reg. (EU) 2024/1610** | New-truck fleet CO2: **−45 % (2030), −65 % (2035), −90 % (2040)** vs 2019; 90 % ZE urban buses by 2030                   | Forces BEV/FCEV adoption → range/charging telemetry becomes operationally critical | In force from 01.07.2024                                                                      |
| **ETS2** (road-transport & buildings fuels) | Carbon price on diesel via fuel suppliers, passed through to hauliers                                                    | Real-time fuel-burn visibility to manage cost exposure                             | **Start moved to 2028**; MRV reporting since 2025; cap −42 % vs 2005 by 2030                  |
| **Eurovignette — Dir. (EU) 2022/362**       | **Mandatory CO2-class toll differentiation** for HDV, replacing Euro-class bands; external-cost (CO2/air/noise) charging | Vehicle CO2 class + route choice drive toll cost                                   | In force; Council clarified/simplified 03.2026; ZE-truck exemption extension under discussion |
| **AFIR — Reg. (EU) 2023/1804**              | HDV recharging pools along TEN-T core (~every 60 km) by 2030; H2 refuelling (~every 200 km)                              | Charger/H2 availability feeds route feasibility for ZE fleets                      | In force; rollout 2025–2030                                                                   |
| **eFTI — Reg. (EU) 2020/1056**              | Authorities must accept digital freight info via certified platforms                                                     | Machine-readable consignment + transport data exchange                             | **Mandatory acceptance by 09.07.2027**                                                        |
| **CSRD / ESRS E1**                          | Shippers report Scope 3 cat. 4/9 transport emissions                                                                     | Hauliers become the _verified data supplier_ for customers' downstream reporting   | Phased; large undertakings reporting now                                                      |
| **ISO 14083 / GLEC; CountEmissions EU**     | Common door-to-door GHG accounting for transport chains                                                                  | Per-shipment, primary-data emission figures                                        | ISO 14083 published; CountEmissions EU **proposal-stage**                                     |
| **CBAM — Reg. (EU) 2023/956**               | Embedded emissions of covered goods in the chain                                                                         | Indirect: provenance + transport leg of carried goods                              | Definitive regime from 2026                                                                   |

The throughline: **Fit for 55 is converting road freight from "estimated, annual, default-factor" carbon into "measured, continuous, primary-data" carbon — and attaching money to it** (ETS2 cost, CO2 tolls, lost tenders). Whoever has the real-time data layer wins on both cost and compliance.

## 3. Control Room — the Edge Layer in the Cab and the Depot

In DWS canon, the **Control Room is one per industry**, runs at the edge (<100 ms target), does local inference, enforces HIL approval gates, handles interrupt/override and exception routing, and logs every event to a tamper-evident audit trail for the Situation Room. For heavy transport the Control Room instance is the **fleet edge** — an in-cab unit plus depot gateway running the DWS edge stack (the same Jetson / Acer-class hardware referenced in the Control Room Capital field note).

What the heavy-transport Control Room does in real time:

| Edge function                                                        | Producer or Consumer | Compliance lever                                                                    |
| -------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| Eco-driving / idling classification, harsh-event scoring             | Producer             | Lowers measured fuel burn → lower ETS2 cost + lower reported CO2                    |
| Per-leg fuel/energy + payload capture (ISO 14083 primary data)       | Producer             | Replaces penalising default factors with audit-defensible actuals                   |
| SoC-vs-range + AFIR charger reachability check                       | Consumer             | Keeps ZE fleets feasible as 2024/1610 forces electrification                        |
| Dynamic re-route on congestion / incident / LEZ / CO2-toll band      | Consumer             | Avoids high-CO2-class toll segments; cuts corridor emissions                        |
| C-ITS / V2X / DATEX II event publishing to the National Access Point | Producer             | Makes the truck a contributor to the public real-time traffic graph (ITS Directive) |
| **HIL gate**: driver confirms reroute / charging stop                | —                    | EU AI Act Art. 14 human-oversight pattern, already calibrated in DWS                |
| Tamper-evident local log of telemetry + decisions                    | —                    | Evidence base for eFTI consignment data and verified-emissions claims               |

Two DWS-specific edge strengths matter disproportionately here:

1. **Operation under limited connectivity.** TEN-T corridors have rural dead zones; the Control Room's tested failover/offline mode (per the Control Room Capital note) means measurement and HIL keep working where a cloud-only telematics SaaS degrades.
2. **Sovereignty at the edge.** Driver position is **personal data under GDPR**, and tachograph data is regulated. Running inference at the edge means raw location/identity stays local; only aggregated, purpose-bound compliance metrics propagate upward — reducing CLOUD Act exposure and keeping the data-residency posture intact. This is a differentiator against US-cloud telematics incumbents.

## 4. Situation Room — the Cloud Layer for Fleet-Wide Compliance

The **Situation Room is one implementation** (the Atlas-style orchestrator) that aggregates all edge observations into a managed situational picture and owns heavy analytics, ERP/TMS integration, and compliance reporting (the note already names EU AI Act, NIS2, CSRD/ESRS as Situation Room outputs). For heavy transport it becomes the **fleet + supply-chain compliance cockpit**:

- **Per-consignment verified emissions** — rolls edge primary data into ISO 14083 / GLEC-conformant figures, ready for CountEmissions EU once finalised, and exportable into **eFTI** datasets ahead of the 2027 acceptance mandate.
- **Scope 3 data supply to shippers** — packages each customer's transport legs as machine-readable ESRS E1 inputs. The haulier stops being a Scope 3 blind spot for its customers and becomes their _preferred, audit-ready low-carbon supplier_ — a tender-winning position as procurement increasingly weights verified carbon.
- **ETS2 cost exposure & Eurovignette toll analytics** — forward view of carbon-priced fuel cost (from 2028) and CO2-class toll spend, with route/vehicle-mix optimisation; CO2-class assignment per vehicle drives toll-band routing.
- **Regulatory timeline per fleet** — deadline dashboard (eFTI 2027, ETS2 2028, HDV milestones 2030/35/40), mirroring the compliance skill's deadline-urgency output.
- **Cross-fleet risk correlation** — e.g. diesel/ETS2 price → toll band → optimal modal/route mix, in the Atlas cross-industry-correlation pattern.

## 5. How This "Better Answers" Fit for 55 — the Mechanism

The compliance gain is not "a dashboard." It is three concrete shifts:

1. **From default factors to primary data.** ISO 14083 rewards measured data; defaults are conservative (i.e. they over-state your emissions). Edge measurement → lower _defensible_ reported intensity → cheaper compliance and better tender scores. This is the single biggest lever and it is pure data-quality arbitrage.
2. **From annual report to real-time control.** ETS2 (2028) and CO2 tolls put a live price on each litre and each tolled km. A cost you can see at the edge in <100 ms is a cost you can route around _today_; a cost you discover in next year's report is already paid.
3. **From siloed telematics to interoperable compliance exchange.** eFTI (2027) and CSRD make the _exchange_ of structured transport-emissions data mandatory. The Situation Room is the production point for those machine-readable artefacts, so the same pipeline that optimises operations also discharges the reporting obligation — no second system.

## 6. DWS Asset Mapping (what we already have vs. what to build)

| Need                                          | Existing DWS asset                                                   | Gap / action                                                                      |
| --------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| EU regulatory scoring (ETS2/CSRD/CBAM/AI Act) | `skills/compliance` + `src/compliance/scoring-engine.ts`             | Add HDV-specific factors: Eurovignette CO2 bands, ISO 14083 transport-leg model   |
| Edge real-time control + HIL                  | Control Room runtime (`skills/remote-control`), calibrated HIL gates | Define a heavy-transport edge profile (telematics/tachograph/SoC inputs)          |
| Fleet aggregation + exec picture              | Situation Room / Atlas orchestrator                                  | Add per-consignment ISO 14083 rollup + eFTI export                                |
| Upcoming-regulation warning                   | `skills/regulatory-radar`                                            | Score fleets against ETS2-2028 and CountEmissions EU finalisation                 |
| Industry agent home                           | `logistics` Industrial Specialist agent (per AGENTS.md / agent-run)  | This is the natural **Control Room owner** for raskas liikenne — one per industry |

Per the CLAUDE.md _Agent Productization Rule_, the heavy-transport Control Room should be reachable as a CLI path with structured JSON output and surfaced through the logistics agent, not built as a one-off dashboard.

## 7. Illustrative KPIs (to instrument, not yet measured)

- % of consignments reported on **primary** vs **default** emission factors (target: rising).
- ETS2-priced fuel cost avoided via edge eco-driving + routing (€/quarter once live 2028).
- CO2-class toll spend vs. theoretical optimum (Eurovignette).
- eFTI-ready consignment coverage ahead of 09.07.2027.
- Share of customer Scope 3 (cat. 4/9) supplied as audit-ready ESRS E1 data.
- Edge offline-resilience: % of measurement retained under connectivity loss.

## 8. Risks & Caveats

- **CountEmissions EU is still a proposal.** Build to ISO 14083 (stable) so the pipeline survives whatever final form the EU framework takes.
- **ETS2 timing slipped to 2028** (and carries a further price-contingency safeguard) — do not hard-code 2027 in cost models.
- **GDPR / tachograph data is sensitive.** Keep raw location at the edge; propagate only aggregated, purpose-bound metrics. Treat this as a security-standard concern, not a feature toggle.
- **Telematics-vendor lock-in.** The DWS edge value is the _calibrated operating model_ (Control Room Capital), not raw device data — keep ingest vendor-neutral.

## 9. Key Insight

Fit for 55 turns every heavy truck into a regulated, carbon-priced, continuously-measured object — and simultaneously into a primary source of the real-time traffic and emissions data the EU now wants _measured rather than estimated_. The producer/consumer duality is therefore the compliance substrate, and the DWS **Control Room (measure + decide at the edge) / Situation Room (aggregate + report + optimise in the cloud)** split is a near-exact fit: the edge converts default-factor carbon into defensible primary data and routes around live carbon costs in real time, while the cloud turns that same stream into eFTI, ISO 14083, and ESRS E1 artefacts the haulier's customers are obligated to collect. The haulier stops being a Scope 3 blind spot and becomes the audit-ready, lowest-cost-of-compliance supplier — using the exact architecture DWS has already built and calibrated.

---

## Sources

- [ETS2: buildings, road transport and additional sectors — European Commission](https://climate.ec.europa.eu/eu-action/carbon-markets/ets2-buildings-road-transport-and-additional-sectors_en)
- [ETS2 cap adopted — European Commission](https://climate.ec.europa.eu/news-other-reads/news/emissions-trading-system-buildings-road-transport-and-small-industry-ets2-cap-adopted-2027-2024-12-03_en)
- [EU ETS 2 — International Carbon Action Partnership](https://icapcarbonaction.com/en/ets/eu-emissions-trading-system-buildings-and-road-transport-eu-ets-2)
- [eFTI Regulation — European Commission (DG MOVE)](https://transport.ec.europa.eu/transport-themes/logistics-and-multimodal-transport/efti-regulation_en)
- [CMR / eFTI 2027 mandate guide](https://planlogi.com/eng/ecmr-efti-2027-guide)
- [Eurovignette: Council clarifies and simplifies EU rules — Consilium (03.2026)](https://www.consilium.europa.eu/en/press/press-releases/2026/03/04/eurovignette-council-clarifies-and-simplifies-eu-rules-on-road-tolls-and-user-charges-for-heavy-duty-vehicles/)
- [Revised Eurovignette system — Croner-i](https://app.croneri.co.uk/feature-articles/revised-eurovignette-system-aims-promote-cleaner-journeys)
- [Regulation (EU) 2024/1610 on HDV CO2 emission standards — Climate Policy Database](https://climatepolicydatabase.org/policies/regulation-eu-20241610-heavy-duty-vehicle-emission-standard)
- [CO2 emission standards for heavy-duty vehicles — AECC](https://www.aecc.eu/legislation/co2-emission-standards-for-heavy-duty-vehicles/)
