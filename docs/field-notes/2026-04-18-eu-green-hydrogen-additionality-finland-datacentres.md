# Field Note: EU Green Hydrogen Additionality Principle — Finland Datacentre Implications

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/green-energy-roadmap-pEPPK | Date: 18.04.2026 | Changes: Initial creation — research note on EU Delegated Regulation 2023/1184 additionality principle for green hydrogen, triggered by Anni Lassila's Helsingin Sanomat article; links Finnish onshore wind economics to datacentre PPA practice

Session Links & References:

- Claude Code (claude/green-energy-roadmap-pEPPK): https://github.com/blogtheristo/dws6/commits/claude/green-energy-roadmap-pEPPK
- Trigger article: Helsingin Sanomat — Anni Lassila (@LassilaAnni), date/URL pending user confirmation
- Related parked doc: docs/DWS7_GREEN_ENERGY_ROADMAP.md (PARKED per Arctic 15 audit)
- Related note: docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md

Document Status:

- Created: 18.04.2026
- Last Modified: 18.04.2026
- Language: English (with Finnish terminology preserved)
- Publication Status: INTERNAL — research note, NOT for public sites

---

## 1. Trigger

Anni Lassila (Helsingin Sanomat) quote (translated, Finnish original preserved at end):

> "The model can be found in the EU's green hydrogen regulation, which states that green hydrogen used in the production of e-methane or other hydrogen derivatives must source its electricity under the so-called additionality principle (_lisäysperiaate_). This means the contract is based on the construction of new renewable electricity generation.
>
> In Finland, such a requirement would hardly burden datacentre project profitability, because onshore wind construction is so inexpensive. That is why some datacentre developers have signed such PPAs voluntarily, without any regulatory requirement."

This is the policy mechanism relevant to any DWS IQ 7 green-energy architecture. Noting for research only — not advocating action (green roadmap remains parked per Arctic 15 audit).

## 2. What the Additionality Principle Actually Requires

**Legal basis:** Commission Delegated Regulation (EU) 2023/1184 of 10 February 2023, supplementing RED II (Directive 2018/2001) — defines rules for "renewable fuels of non-biological origin" (RFNBOs).

**Three cumulative criteria** for electricity to count as "renewable" when producing green H₂:

| Criterion                  | Requirement                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| **Additionality**          | PPA must be with a renewable installation commissioned ≤36 months before the electrolyser    |
| **Temporal correlation**   | Hourly matching from 2030 (monthly until 2030) — production hour must match consumption hour |
| **Geographic correlation** | Same bidding zone, or interconnected zone with lower electricity price                       |

Transitional period until **2028-01-01**: existing RES plants qualify. After 2028 the three-way test applies fully.

## 3. Why Finland Is (Unusually) Well-Positioned

Lassila's point is economically correct. Rough numbers:

| Metric                              | Finland       | EU avg                 | Source                                                                     |
| ----------------------------------- | ------------- | ---------------------- | -------------------------------------------------------------------------- |
| Onshore wind LCOE (new build)       | ~€25–35/MWh   | ~€45–60/MWh            | IEA _World Energy Outlook_ 2024, Finnish Wind Power Association (STY) 2024 |
| Nordpool FI spot avg 2024           | ~€40/MWh      | ~€85/MWh (continental) | Nordpool historical data                                                   |
| Grid CO₂ intensity (FI)             | 41 gCO₂/kWh   | ~230 gCO₂/kWh          | European Environment Agency (EEA) 2024                                     |
| New onshore wind capacity 2024 (FI) | ~1.3 GW added | —                      | STY 2024 annual report                                                     |

**Implication:** The marginal cost of complying with additionality in Finland is close to zero — because the cheapest new electricity is already new onshore wind. In Germany or France, additionality adds a real premium.

## 4. "Voluntary Additionality" — The Practice Signal

Lassila notes _some datacentre developers already sign such PPAs without being required to_. Known Finnish examples (public):

- **Microsoft** — Espoo/Kirkkonummi datacentre region, signed PPAs with Finnish onshore wind (announcement 2022).
- **Google** — Hamina datacentre, long-standing PPA portfolio (public since 2013, most recent additions 2023).
- **Yandex/Nebius** (Mäntsälä) — Nordic PPA portfolio (public reporting 2023).

**Why they do it without a mandate:**

1. Hedge against Nordpool volatility (10-yr fixed-price PPA beats spot risk)
2. Scope 2 emissions (GHG Protocol market-based method) → zero if backed by bundled Guarantees of Origin from the additional plant
3. Brand/ESG disclosure (CDP, SBTi, CSRD) — additionality counts where mere unbundled GOs are increasingly discounted

**Inference for DWS research:** A datacentre architecture that _starts_ additional-PPA-native is already aligned with where regulation is heading. Not a DWS product decision — just a market observation.

## 5. Regulatory Trajectory

| Date       | Event                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 2023-07-10 | Delegated Reg. 2023/1184 entered into force                                                                                  |
| 2024-01-01 | Article 12 (EU AI Act) logging for high-risk systems — separate track, overlaps                                              |
| 2028-01-01 | Additionality 36-month rule fully binds (transitional period ends)                                                           |
| 2030-01-01 | Hourly temporal correlation replaces monthly                                                                                 |
| 2030+      | Likely extension of additionality concept to power-purchase classification beyond H₂ (speculative — watch RED III revisions) |

**Risk to watch:** The Commission's "Omnibus simplification" package (2026) may reopen parts of RED II / Delegated 2023/1184. Direction of travel is unclear — could loosen (industry lobby) or tighten (DG CLIMA position).

## 6. What We Do With This Note

**Nothing operational.** The DWS IQ 7 green energy roadmap is parked until October 2026 per the Arctic 15 SAFE audit. This note is filed as background research so that when the roadmap is unpacked, the regulatory context is already captured.

**Open research threads:**

- [ ] Get the exact HS article URL and date from Anni Lassila's piece
- [ ] Pull the public PPA disclosures from Microsoft/Google/Nebius for the Finnish datacentres (volume, term, vendor)
- [ ] Check whether any Finnish onshore wind developer publishes additionality-compliant PPA term sheets publicly
- [ ] Monitor Omnibus simplification package progress (target: Q3 2026)

## 7. Finnish Original Quote (Preserved)

> "Malli löytyisi EU:n vihreän vedyn säännöstöstä, jonka mukaan esimerkiksi e-metaanin tai muiden vetyjalosteiden tuotantoon käytettävän vihreän vedyn tuotannolle pitää ostaa sähkö niin sanotulla lisäysperiaatteella. Se tarkoittaa, että sopimus perustuu uuden uusiutuvan sähköntuotannon rakentamiseen.
>
> Suomessa tällainen vaatimus ei juuri rasittaisi datakeskushankkeiden kannattavuutta, koska maatuulivoiman rakentaminen on niin edullista. Siksi osa datakeskusten rakentajista on tehnyt tällaisia PPA-sopimuksia ilman pakkoakin."
>
> — Anni Lassila, Helsingin Sanomat (URL/date pending)

---

_End of field note — v1.0_
