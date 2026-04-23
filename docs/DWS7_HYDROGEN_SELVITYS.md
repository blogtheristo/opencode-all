# DWS IQ 7 Hydrogen — Selvitys (Research Report)

## Vedyn rooli DWS IQ 7 -arkkitehtuurissa: sääntely, markkinat, rajaus

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/green-energy-roadmap-pEPPK | Date: 18.04.2026 | Changes: Initial creation — hydrogen-specific selvitys for DWS IQ 7; clarifies RFNBO vs back-up-power regulatory tracks, corrects Hydrogen Bank data from parked roadmap, documents EU Commission auction results, applies Finnish onshore-wind cost context

Session Links & References:

- Claude Code (claude/green-energy-roadmap-pEPPK): https://github.com/blogtheristo/dws6/commits/claude/green-energy-roadmap-pEPPK
- Related (parked): docs/DWS7_GREEN_ENERGY_ROADMAP.md
- Related (research): docs/field-notes/2026-04-18-eu-green-hydrogen-additionality-finland-datacentres.md
- Related (architecture): docs/DWS6_TO_DWS7_UPDATE.md
- Related (jurisdictions): docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md

Document Status:

- Created: 18.04.2026
- Last Modified: 18.04.2026
- Language: English (primary) with Finnish abstract
- Publication Status: INTERNAL — research report, NOT for public sites

---

## Tiivistelmä (Finnish Abstract)

Tämä selvitys erottaa toisistaan kaksi eri sääntelyraidetta, jotka menevät usein sekaisin, kun puhutaan vihreästä vedystä datakeskusten yhteydessä:

1. **Vihreä vety polttoaineraaka-aineena (RFNBO)** — EU:n delegoitu asetus 2023/1184 vaatii _lisäysperiaatteen_ (additionality), kun vetyä tuotetaan e-metaania, SAF:ia tai muita vedyjalosteita varten. Tämä on se raide, josta Anni Lassila kirjoittaa Hesarissa.
2. **Vety varavoimana datakeskuksessa (back-up)** — Tier-IV-redundanssissa vety korvaa dieselin. Tuotos ei ole RFNBO-polttoaine vaan varastoitu sähkö. RED II / 2023/1184 ei tätä käyttöä suoraan sääntele.

**DWS IQ 7:n vedyn käyttötapaus kuuluu raiteelle 2 (varavoima), ei raiteelle 1 (RFNBO).** Tämä yksinkertaistaa sääntelyn ja parantaa taloutta. Selvitys on itsenäinen tausta-asiakirja; itse vihreän energian roadmap pysyy `PARKED`-tilassa lokakuuhun 2026 asti (Arctic 15 -auditin mukaisesti).

---

## 1. Scope and What This Report Does NOT Claim

**In scope:**

- Regulatory framing of hydrogen for a Nordic datacentre with back-up fuel-cell architecture
- EU Commission data (Delegated Reg. 2023/1184, Hydrogen Bank auction results)
- Finnish market context (onshore wind LCOE, existing datacentre PPAs)
- Correction of numeric claims made in the parked roadmap

**Out of scope (deliberately):**

- Any commitment that DWS IQ 7 will build hydrogen infrastructure
- Site selection, vendor selection, or capex budgeting
- Green investor onboarding — roadmap remains parked per Arctic 15 audit

This is background research, not a plan.

---

## 2. The Two Regulatory Tracks — Critical Distinction

A common confusion in public discussion (including well-intentioned coverage) is treating "green hydrogen" as a single regulated thing. It is not. For DWS IQ 7 the distinction is load-bearing.

| Dimension                    | Track 1 — RFNBO feedstock                          | Track 2 — Back-up power                                              |
| ---------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| **Output sold**              | e-methane, e-SAF, green ammonia, methanol          | Electricity (consumed on-site during grid outage)                    |
| **Primary regulation**       | RED II (2018/2001) + Delegated Reg. (EU) 2023/1184 | No dedicated EU framework — national grid / emergency-power law      |
| **Additionality required?**  | Yes (Article 4, with 2028 transition)              | No                                                                   |
| **Temporal correlation?**    | Monthly until 2030, hourly thereafter              | N/A — back-up runs hours per year                                    |
| **Geographic correlation?**  | Same bidding zone                                  | N/A                                                                  |
| **Carbon-accounting regime** | RED II sustainability certification                | Scope 2 (GHG Protocol) + EU ETS (if combustion) / zero if H₂ back-up |
| **Lassila's HS article**     | This track                                         | Not this track                                                       |

**Claim:** DWS IQ 7's hydrogen use case is Track 2. The electrolyser, if built, produces H₂ for storage in pressure tanks, later reconverted to electricity via fuel cell during grid outage or peak-shaving. The stored H₂ is _not sold to a customer as a fuel product_, so RFNBO rules do not trigger.

**Consequence:** The regulatory bar is lower, the PPA flexibility is higher, and — importantly — the economic model does not depend on qualifying for RFNBO subsidies (Hydrogen Bank). This is a feature, not a bug: it de-risks the thesis.

---

## 3. EU Delegated Regulation 2023/1184 — Summary (For Context)

**Legal status:** Adopted 10 February 2023; entered into force 10 July 2023. Supplements RED II (Directive 2018/2001) defining when hydrogen qualifies as a Renewable Fuel of Non-Biological Origin (RFNBO).

**Three cumulative criteria** (Track 1 only):

1. **Additionality (Article 4):** The fuel producer must either (a) own the renewable installation, or (b) have a PPA with a plant commissioned ≤36 months before the electrolyser. Transitional: existing plants qualify until **31 December 2027**; the 36-month test applies from **1 January 2028**.
2. **Temporal correlation:** Monthly matching (until 31 December 2029), then hourly matching from **1 January 2030**.
3. **Geographic correlation:** Electrolyser and renewable plant in the same bidding zone, or in an interconnected zone where the price was lower or equal during the relevant hour.

**Source:** Commission Delegated Regulation (EU) 2023/1184, 10 Feb 2023. EUR-Lex CELEX: 32023R1184.

_Note:_ These dates supersede the more cautious "fully binds 2028, hourly from 2030" phrasing in the companion field note. The field note's substance is correct; this selvitys uses the regulation's own language.

---

## 4. European Hydrogen Bank — Corrected Timeline

This is the most important correction to the parked roadmap. The roadmap stated: _"Hydrogen Bank second auction closed March 2026 at €0.37/kg fixed premium."_ **That is wrong on two counts.** The correct timeline from EU Commission sources:

| Round               | Key dates                                                   | Outcome                                                                        |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Pilot (1st) auction | Opened Nov 2023, closed Feb 2024. 132 bids, 17 countries.   | 7 winners, strike prices €0.37–€0.48/kg. €720M awarded (IP/24/2333).           |
| IF24 (2nd) auction  | Opened 3 Dec 2024, closed 20 Feb 2025. 61 bids, 8 maritime. | 15 invited May 2025; 6 signed grant agreements 20 Jan 2026; **€270.6M** total. |
| IF25 (3rd) auction  | Closed 19 Feb 2026. 58 bids, **€8.4B** funding sought.      | Evaluation results expected **May–June 2026** (CINEA timeline).                |

**So:**

- The €0.37/kg figure comes from the _pilot_ auction (2023–2024), not the 2nd.
- No "March 2026" auction closed — the 3rd auction closed February 2026 and results are pending.
- If the parked roadmap is ever unparked, this paragraph must be corrected.

**Source list:**

- ec.europa.eu/commission/presscorner/detail/en/ip_24_2333 (pilot auction results)
- climate.ec.europa.eu — IF24 auction press release 7 March 2025 (61 bids)
- cinea.ec.europa.eu — IF24 grant signatures 20 Jan 2026 (€270.6M)
- climate.ec.europa.eu — IF25 auctions result note 20 March 2026 (€8.4B sought, decisions May–June 2026)

---

## 5. Finnish Context for a Back-Up-Only Hydrogen Datacentre

(Same base data as the accompanying field note, repeated here for self-containment.)

| Metric                              | Finland                   | EU avg                 | Source                                                  |
| ----------------------------------- | ------------------------- | ---------------------- | ------------------------------------------------------- |
| Onshore wind LCOE (new build)       | ~€25–35/MWh               | ~€45–60/MWh            | IEA WEO 2024; Finnish Wind Power Association (STY) 2024 |
| Nordpool FI spot avg 2024           | ~€40/MWh                  | ~€85/MWh (continental) | Nordpool historical                                     |
| Grid CO₂ intensity (FI)             | 41 gCO₂/kWh               | ~230 gCO₂/kWh          | European Environment Agency (EEA) 2024                  |
| New onshore wind capacity 2024 (FI) | ~1.3 GW added             | —                      | STY 2024                                                |
| Datacentre PPAs already signed (FI) | Microsoft, Google, Nebius | —                      | Public announcements 2013–2023                          |

**Implication for Track 2:** A datacentre in Finland can sign a long-term onshore wind PPA at a price that already competes with Nordpool spot, and use the PPA as its Scope 2 claim. The hydrogen fuel-cell back-up runs perhaps 50–150 hours per year (Tier-IV SLA equivalent), so the H₂ production CAPEX/OPEX is amortised over availability, not energy throughput.

---

## 6. Back-of-Envelope Economics (Track 2, Illustrative Only)

This is a sanity-check, not a budget.

Assumptions (all sourced or conservative):

- Datacentre IT load: 10 MW continuous (typical Tier-III/IV modular build)
- Tier-IV back-up requirement: 72 h full load → 720 MWh reserve
- H₂ round-trip efficiency (electrolysis + storage + fuel cell): ~35% (IEA _Global Hydrogen Review_ 2024)
- Electrolyser CAPEX: ~€1,200/kW (PEM, 2026 prices, BloombergNEF trajectory — best-available published)
- Fuel-cell CAPEX: ~€2,500/kW
- Annual back-up run-hours: 50 h expected, 150 h worst-case

Ballpark cost to replace diesel with H₂ at this scale:

| Component               | Size    | CAPEX (illustrative) | Notes                                      |
| ----------------------- | ------- | -------------------- | ------------------------------------------ |
| PEM electrolyser        | 5 MW    | ~€6M                 | Sized for weekly refill of reserve         |
| H₂ storage (compressed) | 30 t H₂ | ~€3–5M               | 350–700 bar tanks, depends on vendor       |
| Fuel cell               | 10 MW   | ~€25M                | Sized for full IT load                     |
| BoP + integration       | —       | ~€5M                 | Piping, safety, ATEX, controls             |
| **Total**               |         | **~€39–41M**         | Versus ~€5–8M for diesel genset equivalent |

**The economics do not work on Tier-IV back-up alone.** The delta vs. diesel (~€33M) must be justified by: (a) avoided ETS/CBAM exposure on diesel emissions — too small; (b) additional revenue from peak-shaving / grid services — plausible; (c) corporate ESG/brand value — real but hard to price; (d) subsidy (Hydrogen Bank Track 1 — but we said we're Track 2).

**Honest conclusion:** H₂ as pure back-up does not pencil. The business case only works if the electrolyser also:

- Produces H₂ for sale (moves us back to Track 1, additionality applies)
- Participates in grid balancing / frequency response markets
- Serves as long-duration storage paired with co-located wind (different thesis)

**This is a finding to flag, not a decision to make.** The parked roadmap implicitly assumed the back-up framing alone was sufficient. It is not. When the roadmap is unparked in October, this is the first question to answer.

---

## 7. What the Voluntary Hyperscaler PPAs Actually Tell Us

Microsoft (Espoo/Kirkkonummi), Google (Hamina), and Nebius (Mäntsälä) have all signed Finnish onshore-wind PPAs voluntarily. Lassila's observation is that they are already doing what the regulation would require.

**What this means for DWS:**

- Building on top of the same PPA structure is not a differentiator — it is table stakes.
- The DWS IQ 7 thesis cannot rest on "we signed a wind PPA". Hyperscalers did too, and at better terms.
- The differentiator must be **measured, signed, Article-12-auditable inference lineage** tied to that green electricity — i.e. software, not infrastructure.

This sharpens the Arctic 15 audit conclusion: the IQ 6 software story (sovereignty audit logging, signed reports, Article 12 compliance) is the near-term asset. The infrastructure layer, if ever built, sits on top and serves customers who already demand that level of audit — not as a primary selling point.

---

## 8. Open Research Threads (For October Revisit)

- [ ] Get the exact Anni Lassila / HS article URL and date
- [ ] Pull IF24 winners list and their strike prices (CINEA disclosure pending)
- [ ] Check whether any Finnish onshore wind developer publishes additionality-compliant PPA terms publicly
- [ ] Model Track-2 economics with added grid-services revenue (FCR-N, FCR-D in Fingrid market)
- [ ] Monitor Omnibus simplification package (Q3 2026) for RED II / 2023/1184 impact
- [ ] Investigate whether DWS IQ 7 can _serve_ customers building RFNBO plants (compliance software for Track-1 producers) — more scalable than _being_ such a plant

---

## 9. Recommendation

1. **Keep the DWS IQ 7 green-energy roadmap parked** until October 2026 per the Arctic 15 audit.
2. **When unparking, correct:** Hydrogen Bank dates, strike prices, and the back-up economics section.
3. **Consider pivoting the hydrogen thesis** from "DWS builds a green datacentre with H₂ back-up" to "DWS provides the compliance software layer for European green-hydrogen producers and the datacentres that buy from them". That is on-thesis (software, MCP, Article 12) and scales without CAPEX.
4. **This selvitys does not change the SAFE round.** Arctic 15 close remains the priority.

---

_End of selvitys — v1.0_
