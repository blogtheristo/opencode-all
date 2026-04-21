# SNCF France — Infrastructure Surveillance Market Signal for Aegis

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-14
Author: Claude Code (claude/update-aegis-france-specs-Y9DXY)
Owner: Lifetime Oy
Status: Active

---

## Context

France's national railway operator SNCF has deployed a 200-drone fleet (manufactured by
French startup Delair) to monitor 28,000 km of railway infrastructure around the clock.
This is part of a €100M annual budget dedicated to protecting the French rail network from
malicious acts. The deployment is a real-world validation of the critical infrastructure
surveillance market that Aegis targets under the CER Directive and NIS2 frameworks.

**Source:** SNCF public communications, Delair product announcements, rail industry reporting (2024–2025).

## The Threat: Malicious Acts on Railway Infrastructure

| Metric                                 | Value                             | Source                     |
| -------------------------------------- | --------------------------------- | -------------------------- |
| Delay minutes caused by malicious acts | 800,000+ minutes in 2024          | SNCF annual report         |
| Trains affected                        | ~40,000 trains in 2024            | SNCF annual report         |
| Incident types                         | Copper theft, vandalism, sabotage | SNCF public communications |
| Annual protection budget               | €100M/year                        | SNCF public communications |

Copper theft alone triggers cascading signal failures — one cut cable can halt an entire
corridor. Vandalism and sabotage are increasingly coordinated (criminal networks), not
opportunistic. SNCF's response is to shift from reactive policing to deterrent-first
AI surveillance.

## SNCF Drone Fleet Architecture

| Parameter        | Detail                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| Fleet size       | 200 drones                                                               |
| Manufacturer     | Delair (French startup, Toulouse)                                        |
| Network coverage | 28,000 km of railway                                                     |
| Operating hours  | 24/7, emphasis on night operations                                       |
| Night vision     | Infrared cameras                                                         |
| Primary mission  | Deterrent surveillance + real-time criminal detection                    |
| Outcome          | Multiple criminal networks disrupted                                     |
| Stated goal      | "Prevent any act" via deterrent presence + rapid railway police response |

### Delair Sovereign Profile

Delair is a French-owned drone manufacturer, which makes the SNCF deployment a
**sovereign-by-design** infrastructure protection model. This mirrors Aegis's
EU-sovereignty positioning — France is choosing French hardware, just as Aegis
targets Finnish and EU-sovereign cloud infrastructure.

## Aegis Fit Analysis

### Regulatory Coverage (Why Aegis Is Directly Applicable)

SNCF operates under three EU frameworks that Aegis already covers:

| EU Framework                   | SNCF Obligation                                                                                               | Aegis Coverage                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **CER Directive** (2022/2557)  | Critical entity resilience — infrastructure protection plans, incident reporting                              | ComplianceAgent + Article12Logger    |
| **NIS2 Directive** (2022/2555) | Essential entity cybersecurity, incident notification                                                         | SovereigntyMonitor + Article12Logger |
| **EU AI Act** (2024/1689)      | AI surveillance systems are high-risk (Annex III) — require Article 12 logging, human oversight, transparency | Article12Logger + KYA Engine         |
| **GDPR** (2016/679)            | Biometric/behavioral data from infrared surveillance requires DPA compliance                                  | SovereigntyMonitor + Article12Logger |

SNCF's drone surveillance fleet captures behavioral data (individuals caught in the act)
which classifies the AI system under **EU AI Act Annex III, Category 6** (AI systems used
by law enforcement/critical infrastructure for real-time remote biometric identification
and behavior analysis). This requires Article 12 logging and human oversight — exactly
what Aegis provides.

### Agent Mapping

| SNCF Use Case                                       | Aegis Agent                      | Capability Match                                                                                           |
| --------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Aerial / orbital monitoring of 28,000 km network    | **ArgusAgent**                   | All-weather, day/night target detection; change detection alerts; infrastructure monitoring over large AOI |
| AI detection of individuals committing acts         | **ArgusAgent + Article12Logger** | AI labeling with mandatory Article 12 audit trail for high-risk AI decisions                               |
| Drone fleet governance (kill authority, isolation)  | **KYA Engine**                   | Agent identity, Firecracker MicroVM isolation, real-time kill authority across agent fleet                 |
| Criminal network intelligence across regions        | **CrossVerticalIntel**           | Cross-vertical signal propagation — connects infrastructure incidents across geography                     |
| Site-level field operations (rapid police dispatch) | **SiteSenseAgent**               | Defence and field operations coordination                                                                  |
| CER Directive incident reporting                    | **ComplianceAgent**              | EU regulatory reporting automation                                                                         |
| GDPR + EU AI Act audit trail                        | **Article12Logger**              | Every AI decision logged with risk classification and reasoning lineage                                    |

### Deployment Model for SNCF-Type Customers

A railway operator or critical infrastructure authority deploying Aegis would use:

```
ArgusAgent (aerial/SAR monitoring)
  → CrossVerticalIntel (network-wide signal correlation)
    → SiteSenseAgent (field dispatch coordination)
      → Article12Logger (EU AI Act compliance logging)
        → ComplianceAgent (CER + NIS2 regulatory reporting)
          → KYA Engine (drone/agent fleet governance + kill authority)
```

Sovereign deployment: **Scaleway (Paris)** — French-owned IaaS (Iliad Group), ISO 27001,
CISPE member, no CLOUD Act exposure. Equivalent position to UpCloud Helsinki for
Finland/Nordic deployments.

## France Market Entry — Scaleway Sovereign Option

The SNCF case opens a direct France market entry path for Aegis.

| Factor                  | Detail                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------ |
| **Sovereign cloud**     | Scaleway (Paris, Iliad Group) — French-owned, no CLOUD Act                           |
| **Infrastructure cost** | ~€200–300/mo for equivalent Aegis stack (vs. €376 on UpCloud Helsinki)               |
| **Customer profile**    | SNCF, RTE (power grid), GRTgaz, Aéroports de Paris — all CER/NIS2 essential entities |
| **Budget signal**       | €100M/year SNCF alone — Aegis at €59,990 is 0.06% of their annual protection budget  |
| **Procurement**         | French public procurement (UGAP framework), EU defence procurement (OCCAR)           |
| **Partner ecosystem**   | Delair (Toulouse), Thales, Airbus Defence & Space, Safran                            |

### Price Positioning Against SNCF's €100M Budget

| Context                                              | Value                                              |
| ---------------------------------------------------- | -------------------------------------------------- |
| SNCF annual protection budget                        | €100,000,000                                       |
| Aegis one-time platform cost                         | €59,990                                            |
| Aegis as % of SNCF annual budget                     | **0.06%**                                          |
| Aegis 5-year TCO                                     | ~€120,000                                          |
| Aegis 5-year TCO as % of 5-year budget               | **0.024%**                                         |
| Annual savings if Aegis reduces delay minutes by 10% | ~€8M (80,000 minutes × €100/minute estimated cost) |
| ROI ratio (year 1)                                   | **133× return on Aegis platform cost**             |

## Business Case Validation

This SNCF deployment confirms three Aegis market assumptions:

### 1. Critical Infrastructure Operators Invest Heavily in AI Surveillance

SNCF's €100M annual budget and 200-drone fleet prove that European critical infrastructure
operators (CER Directive "essential entities") will fund serious technology for
infrastructure protection. Aegis pricing is trivial relative to this budget.

### 2. EU AI Act Creates Mandatory Compliance Need

Drone-based AI surveillance of public areas is explicitly high-risk under EU AI Act
Annex III. Every SNCF-equivalent operator across EU27 faces mandatory Article 12 logging.
No incumbent (Palantir, Anduril, C3.ai) offers this as a built-in capability. Aegis does.

### 3. Sovereignty Is a Buying Criterion, Not a Feature

SNCF chose French-manufactured Delair drones. EU critical infrastructure operators
deliberately choose sovereign vendors. Aegis's EU-sovereign positioning is not just
compliance — it is **the primary buying signal** for this segment.

## Total Addressable Market — EU Rail + Critical Infrastructure

| Segment                               | EU Operators              | Est. Annual Infra Security Budget |
| ------------------------------------- | ------------------------- | --------------------------------- |
| National railway operators (CER)      | 27 (one per member state) | €50–500M each                     |
| Power grid operators (ENTSO-E)        | 42 operators              | €100M–1B each                     |
| Port authorities (TEN-T core network) | 82 ports                  | €10–100M each                     |
| Airport authorities (critical)        | 70+ airports              | €20–200M each                     |
| Gas transmission operators            | 24 operators              | €50–500M each                     |

CER Directive requires all 27 EU member states to identify and register critical entities
by Q4 2026. Every identified entity must have an infrastructure protection plan — creating
a compliance-driven procurement event that Aegis can address.

## Competitive Gap — No Platform Covers This Intersection

| Platform          | AI Surveillance Governance | EU AI Act Article 12 | CER Directive | EU Sovereign               | Aerial Intelligence |
| ----------------- | -------------------------- | -------------------- | ------------- | -------------------------- | ------------------- |
| Palantir AIP      | Partial                    | No                   | No            | No (CLOUD Act)             | Partial             |
| Anduril Lattice   | Hardware-focused           | No                   | No            | No (US only)               | Yes (hardware)      |
| Delair OPENSKYLAB | Analytics only             | No                   | No            | Yes (French)               | Drone-only          |
| Airbus Defence    | Custom projects            | Partial              | Partial       | Yes                        | Limited             |
| **DWS IQ Aegis**  | **KYA Engine**             | **Built-in**         | **Built-in**  | **Yes (UpCloud/Scaleway)** | **ArgusAgent**      |

Delair builds the drones; Aegis governs the AI decisions the drones feed. They are
complementary, not competitive — Delair is a potential integration partner.

## Action Items

- [ ] Add France / Scaleway deployment option to `Store/PRODUCT_AEGIS.md` technical requirements
- [ ] Add CER Directive essential entity procurement event to investor memo (`investor-outreach/INVESTOR_MEMO_AEGIS.md`)
- [ ] Research Delair partner programme and OPENSKYLAB API for ArgusAgent integration
- [ ] Add SNCF use case to Aegis competitive positioning (public site: `dws10.com/aegis/`)
- [ ] Map EU CER Directive essential entity registry deadline (Q4 2026) as sales trigger event
- [ ] Explore Scaleway Tech Partner programme for France market entry

## References

- SNCF drone fleet: SNCF public communications, rail industry reporting 2024–2025
- Delair: delair.com (French drone manufacturer, Toulouse)
- CER Directive: EUR-Lex 2022/2557 (Critical Entity Resilience)
- NIS2 Directive: EUR-Lex 2022/2555 (Network and Information Security)
- EU AI Act: EUR-Lex 2024/1689, Annex III (High-risk AI systems)
- Scaleway sovereignty: scaleway.com/en/why-scaleway/
- Aegis product definition: `Store/PRODUCT_AEGIS.md`
- Aegis pricing study: `docs/field-notes/2026-03-26-aegis-pricing-study.md`
- Aegis sovereignty evaluation: `docs/field-notes/2026-03-25-upcloud-aegis-sovereign-evaluation.md`
